/* Physical regression tests: shots move balls, contacts exchange momentum,
 * full-rack breaks don't glue balls together, and shots settle. */
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import assert from 'node:assert/strict';
const html=readFileSync('index.html','utf8');
const a=html.indexOf('/* PoolPhysics v4'),b=html.indexOf('</script>',a);
assert.ok(a>=0&&b>a,'pool engine script missing');
const ctx={};runInNewContext(html.slice(a,b),ctx);
const {Engine,R}=ctx.PoolPhysics;
function run(e,power=.78){
 let frames=0;
 assert.ok(e.shoot(0,power),'pool shot must be accepted');
 while(e.shotRunning&&frames<1400){e.update(1/60);frames++}
 assert.ok(!e.shotRunning,'balls did not settle');
 assert.ok(frames>10,'shot ended suspiciously early');
 return frames/60;
}
// One clean head-on contact should separate balls and transfer momentum.
const direct=new Engine();
direct.balls=[direct.create(0,248,260),direct.create(1,475,260)];
const one=run(direct,.7);
assert.equal(direct.firstContact,1,'cue must hit target ball');
assert.ok(direct.balls[1].x>475+80,'target ball sticks to cue instead of rolling away');
assert.ok(direct.balls[1].x-direct.balls[0].x>2*R+70,'balls remain glued together after impact');
assert.ok(one<15,'single-ball shot too slow to settle');
// Break must move most object balls; earlier over-damped engine moved only four.
const rack=new Engine();
const before=new Map(rack.balls.map(q=>[q.id,{x:q.x,y:q.y}]));
const seconds=run(rack,.78);
const moved=rack.balls.filter(ball=>ball.id!==0&&Math.hypot(
 ball.x-before.get(ball.id).x,ball.y-before.get(ball.id).y)>15).length;
assert.ok(moved>=8,`rack looks frozen: only ${moved} object balls moved`);
assert.ok(seconds>=2&&seconds<16,`break animation duration out of range: ${seconds}s`);
assert.ok(rack.events.filter(q=>q.type==='collision').length>=15,'no proper break collisions');
console.log(`PASS pool collision regression: ${moved}/15 displaced; break settled in ${seconds.toFixed(2)}s`);
