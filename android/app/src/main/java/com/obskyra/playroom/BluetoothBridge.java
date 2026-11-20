package com.obskyra.playroom;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.os.Build;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Bluetooth Classic RFCOMM transport for the offline card-game host/client protocol.
 * The host is authoritative and accepts at most three guests (four phones total).
 *
 * All Bluetooth operations that can block run off the UI thread. The WebView bridge
 * carries JSON strings rather than page navigation or network requests.
 */
public final class BluetoothBridge {
    private static final UUID SERVICE_UUID = UUID.fromString("9b2b7424-69b1-4e7c-b8a6-82e961b9410e");
    private static final String SERVICE_NAME = "AAC Playroom";
    private static final int MAX_GUESTS = 3;
    private static final int MAX_MESSAGE_CHARS = 60000;
    static final int PERMISSION_REQUEST = 7101;
    static final int ENABLE_REQUEST = 7102;
    static final int DISCOVERABLE_REQUEST = 7103;

    private final Activity activity;
    private final WebView webView;
    private final BluetoothAdapter adapter;
    private final Map<String, Peer> peers = new ConcurrentHashMap<>();
    private final Map<String, JSONObject> discovered = new LinkedHashMap<>();
    private volatile BluetoothServerSocket serverSocket;
    private volatile BluetoothSocket connectingSocket;
    private volatile Peer clientPeer;
    private volatile boolean hosting;
    private volatile int generation;
    private BroadcastReceiver discoveryReceiver;
    private String pendingAction;
    private String pendingAddress;

    public BluetoothBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        this.adapter = BluetoothAdapter.getDefaultAdapter();
    }

    @JavascriptInterface public boolean isSupported() {
        return adapter != null;
    }

    @JavascriptInterface public void host() {
        activity.runOnUiThread(() -> begin("host", null));
    }

    /** Returns paired devices immediately, then broadcasts newly discovered devices. */
    @JavascriptInterface public void pairedDevices() {
        activity.runOnUiThread(() -> begin("scan", null));
    }

    @JavascriptInterface public void connectTo(String address) {
        activity.runOnUiThread(() -> {
            if (address == null || !address.matches("(?i)[0-9a-f]{2}(:[0-9a-f]{2}){5}")) {
                error("Invalid Bluetooth device address.");
                return;
            }
            begin("connect", address);
        });
    }

    @JavascriptInterface public void send(String json) {
        Peer client = clientPeer;
        if (client != null) {
            client.send(json);
        } else if (hosting) {
            for (Peer peer : peers.values()) peer.send(json);
        } else {
            error("Not connected to a Bluetooth game.");
        }
    }

    @JavascriptInterface public void sendTo(String peerId, String json) {
        if (!hosting || peerId == null) return;
        Peer peer = peers.get(peerId);
        if (peer != null) peer.send(json);
    }

    @JavascriptInterface public void stop() {
        activity.runOnUiThread(() -> {
            pendingAction = null;
            stopTransport();
            status("stopped", "Bluetooth session closed.");
        });
    }

    public void destroy() {
        stopTransport();
    }

    private void begin(String action, String address) {
        if (adapter == null) {
            error("This device has no Bluetooth Classic adapter.");
            return;
        }
        pendingAction = action;
        pendingAddress = address;
        String[] required = permissionsFor(action);
        ArrayList<String> missing = new ArrayList<>();
        for (String permission : required) {
            if (activity.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
                missing.add(permission);
            }
        }
        if (!missing.isEmpty()) {
            status("permission", "Allow nearby devices to use Bluetooth.");
            activity.requestPermissions(missing.toArray(new String[0]), PERMISSION_REQUEST);
            return;
        }
        try {
            if (!adapter.isEnabled()) {
                status("enable", "Turn Bluetooth on to continue.");
                activity.startActivityForResult(new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE), ENABLE_REQUEST);
                return;
            }
        } catch (SecurityException e) {
            error("Bluetooth access was denied.");
            return;
        }
        pendingAction = null;
        if ("host".equals(action)) startHosting();
        else if ("scan".equals(action)) startScanning();
        else if ("connect".equals(action)) startConnecting(address);
    }

    private String[] permissionsFor(String action) {
        if (Build.VERSION.SDK_INT >= 31) {
            if ("host".equals(action)) return new String[] {
                Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_ADVERTISE
            };
            if ("scan".equals(action)) return new String[] {
                Manifest.permission.BLUETOOTH_CONNECT, Manifest.permission.BLUETOOTH_SCAN
            };
            return new String[] { Manifest.permission.BLUETOOTH_CONNECT };
        }
        if ("scan".equals(action)) {
            return new String[] { Manifest.permission.ACCESS_FINE_LOCATION };
        }
        return new String[0];
    }

    public void onPermissionsResult(int requestCode, int[] grants) {
        if (requestCode != PERMISSION_REQUEST) return;
        for (int grant : grants) {
            if (grant != PackageManager.PERMISSION_GRANTED) {
                pendingAction = null;
                error("Bluetooth permission denied. Enable it in Android app settings.");
                return;
            }
        }
        if (grants.length == 0) {
            error("Bluetooth permission was not granted.");
            return;
        }
        resumePending();
    }

    public void onActivityResult(int requestCode, int resultCode) {
        if (requestCode == ENABLE_REQUEST) {
            if (resultCode == Activity.RESULT_OK) resumePending();
            else {
                pendingAction = null;
                error("Bluetooth was not enabled.");
            }
        } else if (requestCode == DISCOVERABLE_REQUEST) {
            if (resultCode == Activity.RESULT_CANCELED) {
                status("hosting", "Waiting for paired friends. To be found by new phones, allow discoverability.");
            } else {
                status("hosting", "Visible to nearby phones. Friends can scan and connect.");
            }
        }
    }

    private void resumePending() {
        if (pendingAction != null) begin(pendingAction, pendingAddress);
    }

    private void startHosting() {
        stopTransport();
        hosting = true;
        final int token = generation;
        status("hosting", "Hosting Bluetooth game — waiting for friends.");
        Thread thread = new Thread(() -> {
            try (BluetoothServerSocket listener =
                     adapter.listenUsingRfcommWithServiceRecord(SERVICE_NAME, SERVICE_UUID)) {
                serverSocket = listener;
                while (token == generation && hosting) {
                    BluetoothSocket socket = listener.accept();
                    if (token != generation || !hosting) {
                        closeSocket(socket);
                        break;
                    }
                    String address = socket.getRemoteDevice().getAddress();
                    if (peers.size() >= MAX_GUESTS || peers.containsKey(address)) {
                        closeSocket(socket);
                        status("hosting", "Room is full (four devices maximum).");
                        continue;
                    }
                    Peer peer = new Peer(address, socket, token);
                    peers.put(address, peer);
                    connected(address);
                    peer.startReading();
                }
            } catch (IOException | SecurityException e) {
                if (token == generation && hosting) {
                    error("Bluetooth host stopped: " + safeMessage(e));
                }
            } finally {
                if (token == generation) serverSocket = null;
            }
        }, "Playroom-Bluetooth-Host");
        thread.start();
        try {
            Intent visible = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
            visible.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 180);
            activity.startActivityForResult(visible, DISCOVERABLE_REQUEST);
        } catch (SecurityException e) {
            status("hosting", "Hosting is active, but discoverability permission is unavailable.");
        } catch (Exception e) {
            status("hosting", "Hosting is active. Make this phone discoverable in Bluetooth settings.");
        }
    }

    private void startScanning() {
        stopTransport();
        discovered.clear();
        status("scanning", "Searching for nearby phones. The host must be discoverable.");
        try {
            Set<BluetoothDevice> bonded = adapter.getBondedDevices();
            for (BluetoothDevice device : bonded) addDevice(device, true);
            emitPeers();
            IntentFilter filter = new IntentFilter();
            filter.addAction(BluetoothDevice.ACTION_FOUND);
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
            discoveryReceiver = new BroadcastReceiver() {
                @Override public void onReceive(Context context, Intent intent) {
                    if (BluetoothDevice.ACTION_FOUND.equals(intent.getAction())) {
                        BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                        if (device != null) {
                            addDevice(device, false);
                            emitPeers();
                        }
                    } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(intent.getAction())) {
                        status("scan_finished", "Scan complete. Tap Refresh to scan again.");
                    }
                }
            };
            if (Build.VERSION.SDK_INT >= 33) {
                activity.registerReceiver(discoveryReceiver, filter, Context.RECEIVER_NOT_EXPORTED);
            } else {
                activity.registerReceiver(discoveryReceiver, filter);
            }
            if (!adapter.startDiscovery()) {
                status("scan_finished", "Scan could not start. Check Bluetooth and Location settings.");
            }
        } catch (SecurityException e) {
            error("Bluetooth scanning is not permitted.");
        } catch (Exception e) {
            error("Could not scan: " + safeMessage(e));
        }
    }

    private void addDevice(BluetoothDevice device, boolean paired) {
        try {
            String address = device.getAddress();
            if (address == null || discovered.containsKey(address)) return;
            String name = device.getName();
            JSONObject item = new JSONObject();
            item.put("address", address);
            item.put("name", name == null || name.isEmpty() ? "Android/Bluetooth device" : name);
            item.put("paired", paired);
            discovered.put(address, item);
        } catch (SecurityException | JSONException ignored) {}
    }

    private void emitPeers() {
        JSONArray list = new JSONArray();
        int count = 0;
        for (JSONObject item : discovered.values()) {
            if (++count > 35) break;
            list.put(item);
        }
        JSONObject json = event("peers");
        try { json.put("peers", list); } catch (JSONException ignored) {}
        emit(json);
    }

    private void startConnecting(String address) {
        stopTransport();
        final int token = generation;
        status("connecting", "Connecting to your friend's phone…");
        Thread thread = new Thread(() -> {
            BluetoothSocket socket = null;
            try {
                BluetoothDevice device = adapter.getRemoteDevice(address);
                socket = device.createRfcommSocketToServiceRecord(SERVICE_UUID);
                connectingSocket = socket;
                socket.connect(); // Blocking, includes Android's secure pairing flow.
                if (token != generation) {
                    closeSocket(socket);
                    return;
                }
                connectingSocket = null;
                Peer peer = new Peer(address, socket, token);
                clientPeer = peer;
                connected(address);
                peer.readLoop();
            } catch (IOException | SecurityException | IllegalArgumentException e) {
                if (token == generation) error("Connection failed: " + safeMessage(e));
                closeSocket(socket);
            } finally {
                if (connectingSocket == socket) connectingSocket = null;
            }
        }, "Playroom-Bluetooth-Connect");
        thread.start();
    }

    private void connected(String peerId) {
        JSONObject json = event("connected");
        try { json.put("peerId", peerId); } catch (JSONException ignored) {}
        emit(json);
        status("connected", "Bluetooth connected.");
    }

    private void disconnected(String peerId, int token) {
        if (token != generation) return;
        JSONObject json = event("disconnected");
        try { json.put("peerId", peerId); } catch (JSONException ignored) {}
        emit(json);
    }

    private final class Peer {
        final String id;
        final BluetoothSocket socket;
        final int token;
        final Object writeLock = new Object();

        Peer(String id, BluetoothSocket socket, int token) {
            this.id = id;
            this.socket = socket;
            this.token = token;
        }

        void startReading() {
            new Thread(this::readLoop, "Playroom-Bluetooth-Reader").start();
        }

        void send(String value) {
            if (value == null || value.length() > MAX_MESSAGE_CHARS) {
                error("Bluetooth message is too large.");
                return;
            }
            new Thread(() -> {
                try {
                    synchronized (writeLock) {
                        if (token != generation) return;
                        BufferedWriter writer = new BufferedWriter(
                            new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));
                        writer.write(value);
                        writer.write('\n');
                        writer.flush();
                    }
                } catch (IOException e) {
                    closeSocket(socket);
                }
            }, "Playroom-Bluetooth-Send").start();
        }

        void readLoop() {
            try {
                BufferedReader reader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                while (token == generation) {
                    String value = readBoundedLine(reader);
                    if (value == null) break;
                    JSONObject json = event("message");
                    json.put("peerId", id);
                    json.put("data", value);
                    emit(json);
                }
            } catch (IOException | JSONException ignored) {
            } finally {
                closeSocket(socket);
                if (token != generation) return;
                if (hosting) {
                    if (peers.remove(id, this)) disconnected(id, token);
                } else if (clientPeer == this) {
                    clientPeer = null;
                    disconnected(id, token);
                }
            }
        }
    }

    /** Limit data accepted from nearby devices; one JSON record per line. */
    private static String readBoundedLine(BufferedReader reader) throws IOException {
        StringBuilder value = new StringBuilder();
        int ch;
        while ((ch = reader.read()) != -1) {
            if (ch == '\n') return value.toString();
            if (ch != '\r') {
                if (value.length() >= MAX_MESSAGE_CHARS) throw new IOException("Message too large");
                value.append((char) ch);
            }
        }
        return value.length() == 0 ? null : value.toString();
    }

    private void stopTransport() {
        generation++;
        hosting = false;
        unregisterScanner();
        try {
            if (adapter != null && (Build.VERSION.SDK_INT < 31 ||
                activity.checkSelfPermission(Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED)) {
                adapter.cancelDiscovery();
            }
        } catch (SecurityException ignored) {}
        BluetoothServerSocket server = serverSocket;
        serverSocket = null;
        if (server != null) try { server.close(); } catch (IOException ignored) {}
        closeSocket(connectingSocket);
        connectingSocket = null;
        Peer client = clientPeer;
        clientPeer = null;
        if (client != null) closeSocket(client.socket);
        for (Peer peer : peers.values()) closeSocket(peer.socket);
        peers.clear();
    }

    private void unregisterScanner() {
        if (discoveryReceiver == null) return;
        try { activity.unregisterReceiver(discoveryReceiver); }
        catch (IllegalArgumentException ignored) {}
        discoveryReceiver = null;
    }

    private static void closeSocket(BluetoothSocket socket) {
        if (socket != null) try { socket.close(); } catch (IOException ignored) {}
    }

    private JSONObject event(String type) {
        JSONObject object = new JSONObject();
        try { object.put("type", type); } catch (JSONException ignored) {}
        return object;
    }

    private void status(String state, String message) {
        JSONObject object = event("status");
        try {
            object.put("state", state);
            object.put("message", message);
        } catch (JSONException ignored) {}
        emit(object);
    }

    private void error(String message) {
        status("error", message);
    }

    private void emit(JSONObject object) {
        String jsonArgument = JSONObject.quote(object.toString());
        activity.runOnUiThread(() -> {
            if (!activity.isFinishing() && !activity.isDestroyed()) {
                webView.evaluateJavascript(
                    "window.AACBluetoothEvent && window.AACBluetoothEvent(" + jsonArgument + ");",
                    null
                );
            }
        });
    }

    private static String safeMessage(Exception error) {
        String message = error.getMessage();
        return message == null ? error.getClass().getSimpleName() : message;
    }
}
