import { readFileSync, existsSync } from 'node:fs';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const html = readFileSync('index.html','utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
assert.ok(scripts.length>=5,'expected embedded game scripts');
for (const [i,part] of scripts.entries()) new Script(part[1],{filename:'inline-script-'+i+'.js'});
assert.match(html,/AACGames/,'arcade module missing');
assert.match(html,/AACCards/,'card module missing');
assert.match(html,/AACExit/,'shared exit module missing');
for (const game of ['crazy','fish','memory','snap','solitaire','rummy','spades','war'])
  assert.ok(html.includes('data-cardgame="'+game+'"'),game+' missing');
assert.ok(!html.includes('Star Catcher'),'removed game returned');
assert.match(html,/id="pvPower" class="pv-power-track"/,'pool custom pull bar missing');
assert.match(html,/function stopPull\(ev,cancel=false\)/,'pool drag-release shooting missing');
assert.match(html,/id="pvAimWheel"/,'pool fine aim wheel missing');
assert.match(html,/id="pvSpin"/,'pool spin ball missing');
assert.doesNotMatch(html,/if\(d>48\)\{shoot\(aim,power\)/,'pool must not shoot when aiming on table');
assert.ok(html.includes('function setAimAngle(value)'),'cue drag rotation missing');
assert.ok(html.includes('function drawCue()'),'cue shape missing');
assert.ok(html.includes('drawCue(); // Turning off'),'guide toggle must keep physical cue visible');
assert.ok(html.includes('function resetShotPower()'),'power reset helper missing');
assert.ok(html.includes('function endTurn(){resetShotPower();'),'turn change must reset power');
assert.ok(html.includes('e.shoot(angle,pwr,tip);resetShotPower();'),'CPU must reset power');
assert.ok(html.includes('buttonsFrozen=false;processed=0;shooter=null;resetShotPower();'),'Bluetooth must clear power');
assert.match(html,/id="arcJoystick"/,'Space Explorer joystick missing');
assert.match(html,/edge=\(s\.spawnEdge\+\+\)%4/,'Space Explorer must spawn from four edges');
assert.match(html,/s\.playerY\+moveY\*speed\*dt/,'Space Explorer vertical movement missing');
assert.match(html,/s\.shots\.push\(\{x:s\.playerX\+Math\.cos\(angle\)/,'Space Explorer radial lasers missing');
assert.ok(html.includes('Sixteen familiar games') && html.includes('<strong>16</strong> games'),'game count mismatch');

// Bluetooth native transport: verify implementation rather than a cosmetic UI toggle.
const bridgePath='android/app/src/main/java/com/obskyra/playroom/BluetoothBridge.java';
const activityPath='android/app/src/main/java/com/obskyra/playroom/MainActivity.java';
const manifestPath='android/app/src/main/AndroidManifest.xml';
assert.ok(existsSync(bridgePath),'native Bluetooth transport class missing');
const native=readFileSync(bridgePath,'utf8');
const activity=readFileSync(activityPath,'utf8');
const manifest=readFileSync(manifestPath,'utf8');
for(const method of ['host','pairedDevices','connectTo','send','sendTo','stop'])
  assert.match(native,new RegExp('@JavascriptInterface public void '+method+'\\('),method+' bridge method missing');
assert.match(native,/listenUsingRfcommWithServiceRecord/,'RFCOMM host listener missing');
assert.match(native,/createRfcommSocketToServiceRecord/,'RFCOMM client connection missing');
assert.match(native,/MAX_GUESTS\s*=\s*3/,'multi-peer guest cap missing');
assert.match(native,/writer\.execute\(/,'Bluetooth packets must be sent in order per connection');
assert.match(native,/readBoundedLine/,'Bluetooth inbound frame size cap missing');
assert.match(native,/ACTION_REQUEST_DISCOVERABLE/,'Host discoverability prompt missing');
assert.match(native,/BluetoothDevice\.ACTION_FOUND/,'Nearby device discovery missing');
assert.match(activity,/addJavascriptInterface\(bluetooth, "AACBluetooth"\)/,'WebView bridge missing');
assert.match(manifest,/android\.permission\.BLUETOOTH_SCAN/,'Android 12+ scan permission missing');
assert.match(manifest,/android\.permission\.BLUETOOTH_CONNECT/,'Android 12+ connect permission missing');
assert.match(manifest,/android\.permission\.BLUETOOTH_ADVERTISE/,'Android discoverability permission missing');
assert.match(manifest,/android\.permission\.ACCESS_FINE_LOCATION/,'Android 6-11 discovery permission missing');
assert.match(html,/window\.AACBluetoothEvent=\(str\)=>/,'Bluetooth event router missing');
assert.match(html,/function sendArcadeBt\(/,'Board/pool Bluetooth transport missing');
assert.match(html,/bluetoothReceive\(m\)/,'Board/pool Bluetooth remote action handler missing');
assert.match(html,/type:'arcade_pool_state'/,'Pool host authoritative reconciliation missing');
assert.match(html,/function showHostLobby\(/,'Card-game Bluetooth host lobby missing');
assert.match(html,/function showDevicePicker\(/,'Card-game Bluetooth discoverability UI missing');
console.log('Passed Bluetooth bridge checks: native discovery, pairing, transport, cards, pool, and boards.');

console.log('Passed: '+scripts.length+' scripts parse; launcher, pool controls and omnidirectional Space Explorer present.');
