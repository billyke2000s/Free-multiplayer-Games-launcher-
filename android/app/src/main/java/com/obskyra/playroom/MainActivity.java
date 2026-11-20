package com.obskyra.playroom;

import android.app.Activity;
import android.content.Intent;
import android.webkit.JavascriptInterface;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.IOException;

public class MainActivity extends Activity {
    private WebView web;
    private BluetoothBridge bluetooth;
    private static final String HOST = "app.playroom.local";
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().getDecorView().setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        getWindow().setStatusBarColor(0xff121817);
        getWindow().setNavigationBarColor(0xff121817);
        web = new WebView(this);
        web.setBackgroundColor(0xff121817);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        // Game sound effects use WebAudio. Let our bundled offline game play
        // effects on CPU/Bluetooth turns after the context has been unlocked.
        web.getSettings().setMediaPlaybackRequiresUserGesture(false);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(false);
        bluetooth = new BluetoothBridge(this, web);
        web.addJavascriptInterface(bluetooth, "AACBluetooth");
        web.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if ("https".equals(uri.getScheme()) && HOST.equals(uri.getHost())) return false;
                return true;
            }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (!HOST.equals(uri.getHost())) return null;
                String path = uri.getPath();
                if (path == null || path.equals("/")) path = "/index.html";
                if (path.contains("..") || path.contains("\\")) return new WebResourceResponse("text/plain", "UTF-8", null);
                String mime = path.endsWith(".css") ? "text/css" : path.endsWith(".js") ? "application/javascript" : path.endsWith(".svg") ? "image/svg+xml" : path.endsWith(".jpg") ? "image/jpeg" : "text/html";
                try { return new WebResourceResponse(mime, "UTF-8", getAssets().open(path.substring(1))); }
                catch (IOException e) { return new WebResourceResponse("text/plain", "UTF-8", null); }
            }
        });
        setContentView(web);
        web.loadUrl("https://" + HOST + "/index.html");
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("(()=>{if(window.AACExit?.isGameOpen?.()){window.AACExit.openConfirmation();return true}return false})()", value -> {
            if (!"true".equals(value)) finish();
        });
    }
    @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (bluetooth != null) bluetooth.onPermissionsResult(requestCode, grantResults);
    }
    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (bluetooth != null) bluetooth.onActivityResult(requestCode, resultCode);
    }
    @Override protected void onDestroy() {
        if (bluetooth != null) bluetooth.destroy();
        if (web != null) web.destroy();
        super.onDestroy();
    }
}
