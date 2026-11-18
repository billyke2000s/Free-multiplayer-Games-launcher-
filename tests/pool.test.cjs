const assert=require('node:assert/strict');require('../pool.js');
function shot(options={}){const e=new PoolEngine();Object.assign(e,{shooter:1,firstHit:1,rails:new Set([1]),pots:[],wasClear:false,breakShot:false},options);return e;}
let e=new PoolEngine();assert.equal(e.balls.length,16);assert.equal(new Set(e.balls.map(b=>b.n)).size,16);for(let i=0;i<16;i++)for(let j=i+1;j<16;j++)assert.ok(Math.hypot(e.balls[i].x-e.balls[j].x,e.balls[i].y-e.balls[j].y)>=22);
e=shot({pots:[1]});e.resolve();assert.deepEqual(e.groups,['solids','stripes']);assert.equal(e.player,1);
e=shot({pots:[0]});e.cue().out=true;e.resolve();assert.equal(e.player,2);assert.ok(e.hand);assert.equal(e.shoot(0,.5),false);assert.equal(e.place(0,0),false);assert.equal(e.place(270,280),true);assert.equal(e.confirm(),true);
e=shot({groups:['solids','stripes'],firstHit:9});e.resolve();assert.ok(e.hand);assert.equal(e.player,2);
e=shot({groups:['solids','stripes'],pots:[8],wasClear:false,firstHit:8});e.resolve();assert.equal(e.winner,2);
e=shot({groups:['solids','stripes'],pots:[8],wasClear:true,firstHit:8});e.resolve();assert.equal(e.winner,1);
e=shot({groups:['solids','stripes'],pots:[8,0],wasClear:true,firstHit:8});e.resolve();assert.equal(e.winner,2);
e=shot({pots:[8],breakShot:true});e.balls.find(b=>b.n===8).out=true;e.resolve();assert.equal(e.winner,null);assert.equal(e.balls.find(b=>b.n===8).out,false);
e=shot({firstHit:1,rails:new Set(),pots:[]});e.resolve();assert.ok(e.hand);
e=new PoolEngine();e.shoot(0,.85);for(let i=0;i<240*20&&e.moving;i++)e.step(1/240);assert.equal(e.moving,false,'break simulation settles');assert.equal(e.hand,false,'default break is legal');assert.ok(e.balls.every(b=>Number.isFinite(b.x)&&Number.isFinite(b.y)));
e=new PoolEngine();e.shoot(0,.5);const c=e.cue();c.x=66;c.y=66;c.vx=-20;c.vy=-20;e.step(1/240);assert.ok(e.pots.includes(0),'corner pocket captures cue ball');
console.log('Pool rules and physics: rack, groups, fouls, ball in hand, 8-ball outcomes, break respot, settled simulation and pockets passed.');
