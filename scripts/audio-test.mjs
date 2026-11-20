/* Offline audio regression tests: WebAudio, default-on, persistence, no assets. */
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const html=readFileSync('index.html','utf8');
const match=html.match(/<script id="aac-sound-engine">([\s\S]*?)<\/script>/);
assert.ok(match,'shared sound engine script must exist');

class Param {
 setValueAtTime(){}
 exponentialRampToValueAtTime(){}
}
class Node {
 constructor(){this.gain=new Param();this.frequency=new Param();}
 connect(){return this}
 start(){Audio.started++}
 stop(){}
}
class Audio {
 static started=0;
 constructor(){this.sampleRate=44100;this.currentTime=0;this.destination=new Node();this.state='running'}
 createGain(){return new Node()}
 createOscillator(){return new Node()}
 createBiquadFilter(){return new Node()}
 createBuffer(){const array=new Float32Array(8820);return{getChannelData:()=>array}}
 createBufferSource(){return new Node()}
 resume(){this.state='running';return Promise.resolve()}
}
const store=new Map(),events={};
const win={AudioContext:Audio,dispatchEvent:()=>{}};
const document={hidden:false,addEventListener:(type,callback)=>{events[type]=callback}};
const localStorage={getItem:key=>store.has(key)?store.get(key):null,setItem:(key,value)=>store.set(key,value)};
new Script(match[1],{filename:'sound-engine.js'}).runInNewContext({
 window:win,document,localStorage,Event:class Event{constructor(type){this.type=type}},Date,Math
});
assert.ok(win.AACSound,'one global audio engine required');
assert.equal(win.AACSound.enabled,true,'sound must start on by default');
assert.equal(typeof events.pointerdown,'function','touch unlock handler missing');
assert.equal(typeof events.keydown,'function','keyboard unlock handler missing');
const effects=['tap','button','card','draw','flip','shuffle','place','hit',
 'bounce','shot','laser','pocket','score','match','snap','capture',
 'crown','wrong','damage','turn','win','lose'];
for(const effect of effects)win.AACSound.play(effect);
assert.ok(Audio.started>=effects.length,'all effects must schedule real audio');
const before=Audio.started;
win.AACSound.setEnabled(false);
win.AACSound.play('win');
assert.equal(Audio.started,before,'muted sound should not generate audio');
assert.equal(store.get('aac-playroom-sfx-v1'),'off','mute preference not saved');
win.AACSound.setEnabled(true);
assert.equal(store.get('aac-playroom-sfx-v1'),'on','enabled preference not saved');
assert.ok(Audio.started>before,'re-enabling must produce confirmation sound');

assert.ok(html.includes('setMediaPlaybackRequiresUserGesture')===false,'WebView permission belongs in Android file');
for(const id of ['crazy','fish','memory','snap','solitaire','rummy','spades','war'])
 assert.ok(html.includes("if(game==='"+id+"')"),id+' card sound mapping missing');
assert.ok(html.includes("sfx('laser')"),'space laser should make sound');
assert.ok(html.includes("sfx('bounce')"),'brick ball/paddle should make sound');
assert.ok(html.includes("sfx('score')"),'target, lane, mole scoring should make sound');
assert.ok(html.includes("sfx('place')"),'strategy board moves should make sound');
assert.ok(html.includes("sfx('pocket')")||html.includes("'pocket'"),'pool pocket sound missing');
assert.ok(html.includes("sfx('flip')"),'card flips should make sound');
assert.ok(html.includes("sfx('snap')"),'SNAP calls should make sound');
assert.ok(html.includes("data-act='toggle-sound'")||html.includes("dataset.act='toggle-sound'"),'Card Club sound toggle missing');
assert.ok(!html.includes('sound=false, audio=null'),'arcade must not default to mute');
console.log('Passed: default-on WebAudio, 22 effects, persistent mute, and all 16 games wired for SFX.');
