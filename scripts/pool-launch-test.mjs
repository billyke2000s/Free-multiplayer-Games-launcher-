/* Pool runtime smoke test: launch actual game scripts and render frames.
 * Prevents the v2.2.3 regression where startPool referenced removed 'tone'
 * even though every script parsed and all standalone physics checks passed.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createContext,runInContext} from 'node:vm';

const html=readFileSync('index.html','utf8');
const sourceOf=marker=>{
 const start=html.indexOf(marker);
 assert.ok(start>=0,'Missing script marker: '+marker);
 const end=html.indexOf('</script>',start);
 assert.ok(end>start,'Missing closing script: '+marker);
 return html.slice(start,end);
};
class FakeElement{
 constructor(id){this.id=id;this.style={setProperty(){}};this.dataset={};this.attributes={};
  this.classList={toggle(){},add(){},remove(){},contains(){return false}};
  this._html='';this.textContent='';this.checked=true;this.hidden=false;this.events={};
  this.width=2000;this.height=1040;
 }
 set innerHTML(value){this._html=value}
 get innerHTML(){return this._html}
 querySelector(selector){return nodes.get(selector)||createNode(selector)}
 setAttribute(key,value){this.attributes[key]=value}
 getAttribute(key){return this.attributes[key]}
 addEventListener(key,fn){(this.events[key]??=[]).push(fn)}
 removeEventListener(){}
 getBoundingClientRect(){return {left:0,top:0,right:1000,bottom:520,width:1000,height:520}}
 setPointerCapture(){}
 releasePointerCapture(){}
 getContext(){return canvasContext}
}
const nodes=new Map();
const createNode=key=>{const n=new FakeElement(key);nodes.set(key,n);return n};
const canvasContext=new Proxy({
 createLinearGradient:()=>({addColorStop(){}}),
 createRadialGradient:()=>({addColorStop(){}}),
 createPattern:()=>({}),
 measureText:()=>({width:40})
},{get(target,key){return key in target?target[key]:()=>{}}});
const area=createNode('#gameArea');
const frames=[],effects=[];
let nextId=1;
const env={
 console,Math,
 setTimeout:()=>nextId++,clearTimeout(){},
 requestAnimationFrame(fn){frames.push(fn);return nextId++},
 cancelAnimationFrame(){},
 ResizeObserver:class{observe(){}disconnect(){}},
 localStorage:{getItem(){return null},setItem(){}},
 area,active:null,arcadeBt:null,
 showModal(){},closeModal(){},closeGame(){},cleanup(){},
 sendArcadeBt(){},
 addEventListener(){},removeEventListener(){},
 AACSound:{play(...args){effects.push(args)}}
};
env.window=env;
const vm=createContext(env);
for(const marker of ['/* PoolPhysics v4','/* Pool AI v6','/* AAC Arcade v5']){
 const code=sourceOf(marker);
 runInContext(code,vm,{timeout:1500,filename:marker});
}
// Execute the REAL launcher wrapper, including dependency injection, not an
// isolated PoolGameV4.start() call that could conceal undefined references.
const wrapperStart=html.indexOf('function startPool(mode){');
const wrapperEnd=html.indexOf('function roundRect(',wrapperStart);
assert.ok(wrapperStart>=0&&wrapperEnd>wrapperStart);
const wrapper=html.slice(wrapperStart,wrapperEnd);
runInContext(wrapper+"\nstartPool('practice');",vm,{timeout:1500,filename:'pool-launcher.js'});
assert.ok(env.active,'pool wrapper failed to return active game');
assert.ok(area.innerHTML.includes('id="pvCanvas"'),'pool table not rendered');
assert.ok(!area.innerHTML.includes('Pool could not start'),'pool error fallback was used');
assert.equal(env.active.engine.balls.length,16,'pool rack not initialized');
assert.ok(frames.length,'game did not schedule any animation frames');
let time=0;
function frame(){
 const cb=frames.shift();assert.ok(cb,'render loop stopped unexpectedly');
 time+=1000/60;cb(time);
}
frame(); // Initial render must work, before a shot.
assert.equal(env.active.engine.shotRunning,false,'pool should wait for input');
// Take a real human shot through the power slider pointer events.
const power=nodes.get('#pvPower');
assert.ok(power?.events.pointerdown && power?.events.pointermove && power?.events.pointerup,'power controls were not installed');
function pointer(kind,y){for(const fn of power.events[kind]||[])fn({pointerId:1,clientY:y,preventDefault(){}})}
pointer('pointerdown',100);
pointer('pointermove',460);
pointer('pointerup',460);
assert.ok(env.active.engine.shotRunning,'power gesture failed to shoot');
// Run until after the first rack collision and until the shot ends. Prior
// versions would die in frame() once collision SFX were called.
let collision=false,framesPlayed=0;
while(framesPlayed++<1200){
 frame();
 if(env.active.engine.firstContact!==null)collision=true;
 if(!env.active.engine.shotRunning&&collision)break;
}
assert.ok(collision,'shot never collided with rack');
assert.equal(env.active.engine.shotRunning,false,'rack shot failed to settle');
assert.ok(effects.some(x=>x[0]==='pool'&&x[1]==='collision'),'pool contact effects not fired');
env.active.destroy();
console.log('PASS: actual pool launch, canvas render, human shot, collision audio, and turn completion');
