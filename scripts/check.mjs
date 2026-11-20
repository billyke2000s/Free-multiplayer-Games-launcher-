import { readFileSync } from 'node:fs';
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
assert.match(html,/id="arcJoystick"/,'Space Explorer joystick missing');
assert.match(html,/edge=\(s\.spawnEdge\+\+\)%4/,'Space Explorer must spawn from four edges');
assert.match(html,/s\.playerY\+moveY\*speed\*dt/,'Space Explorer vertical movement missing');
assert.match(html,/s\.shots\.push\(\{x:s\.playerX\+Math\.cos\(angle\)/,'Space Explorer radial lasers missing');
assert.ok(html.includes('Sixteen familiar games') && html.includes('<strong>16</strong> games'),'game count mismatch');
console.log('Passed: '+scripts.length+' scripts parse; launcher, pool controls and omnidirectional Space Explorer present.');
