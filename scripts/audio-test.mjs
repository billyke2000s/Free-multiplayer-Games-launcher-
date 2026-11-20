/* Tests for per-game sound identity, audio execution and user mute preferences. */
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';

const html=readFileSync('index.html','utf8');
const sound=html.match(/<script id="aac-sound-engine">([\s\S]*?)<\/script>/);
assert.ok(sound,'offline game-specific sound engine missing');
class Param{constructor(){this.value=1}setValueAtTime(){}exponentialRampToValueAtTime(){}}
class Node{
 constructor(){this.gain=new Param;this.frequency=new Param;this.playbackRate=new Param;}
 connect(){return this}
 start(){Audio.starts++}
 stop(){}
}
class Audio{
 static starts=0;
 constructor(){this.sampleRate=44100;this.currentTime=0;this.destination=new Node;this.state='running'}
 createGain(){return new Node}
 createOscillator(){return new Node}
 createBiquadFilter(){return new Node}
 createBuffer(){return{getChannelData:()=>new Float32Array(10600)}}
 createBufferSource(){return new Node}
 resume(){this.state='running';return Promise.resolve()}
}
const store=new Map(),events={};
const win={AudioContext:Audio,dispatchEvent:()=>{}};
const document={hidden:false,addEventListener:(event,callback)=>{events[event]=callback}};
const localStorage={getItem:key=>store.get(key)??null,setItem:(key,v)=>store.set(key,v)};
new Script(sound[1],{filename:'sound-engine.js'}).runInNewContext({window:win,document,localStorage,Event:class Event{},Date,Math});
assert.equal(win.AACSound.enabled,true,'sound must start enabled');
const all=['pool','space','brick','target','lanes','mole','ttt','checkers',
'crazy','fish','memory','snap','solitaire','rummy','spades','war'];
assert.deepEqual(Array.from(win.AACSound.gameNames),all,'every game needs its OWN sound bank');
const effects={
 pool:['strike','collision','pocket','foul'],
 space:['laser','score','damage'],
 brick:['bounce','score','shot'],
 target:['score','wrong'],
 lanes:['score','wrong'],
 mole:['score','wrong'],
 ttt:['place','win'],
 checkers:['place','capture','crown'],
 crazy:['card','draw'],
 fish:['draw','match'],
 memory:['flip','match'],
 snap:['flip','snap'],
 solitaire:['draw','place'],
 rummy:['card','match'],
 spades:['card','match'],
 war:['flip','snap']
};
for(const [game,types] of Object.entries(effects))for(const type of types){
 const before=Audio.starts;
 win.AACSound.play(game,type,260);
 assert.ok(Audio.starts>before,`${game}: ${type} must schedule audible samples`);
}
const before=Audio.starts;
win.AACSound.setEnabled(false);win.AACSound.play('pool','strike');
assert.equal(Audio.starts,before,'muted engine should stay quiet');
assert.equal(store.get('aac-playroom-sfx-v1'),'off');
win.AACSound.setEnabled(true);
assert.equal(store.get('aac-playroom-sfx-v1'),'on');
assert.ok(Audio.starts>before,'unmuting should play soft confirmation');
assert.equal(typeof events.pointerdown,'function','Android touch unlock missing');
assert.equal(typeof events.keydown,'function','keyboard unlock missing');
assert.ok(!html.includes('sound=false, audio=null'),'arcade must not default muted');

// Cross-script scoping: pool MUST NOT call the private AACGames sfx() closure.
const pool=html.slice(html.indexOf('/* AAC Arcade v5'),html.indexOf('</script>',html.indexOf('/* AAC Arcade v5')));
assert.ok(pool.includes("window.AACSound?.play('pool',event,detail)"),'pool audio must resolve through global bridge');
assert.ok(!/(^|[^\w])sfx\(/.test(pool),'pool uses an unbound local sfx and will freeze on collision');
assert.ok(pool.includes("poolFx('collision',ev.speed)"),'pool impacts should be audible');
assert.ok(html.includes('const sfx=(event,detail=0)=>window.AACSound?.play(currentId,event,detail);'),
 'arcade/board sound must be tagged with current game');
assert.ok(html.includes("window.AACSound?.play(s?.game||clientView?.game||lobbyGame,event,detail)"),
 'cards need their own game-specific sound palette');
console.log('PASS: 16 distinct sound banks, audible game events, scoped pool audio, mute memory and WebAudio');
