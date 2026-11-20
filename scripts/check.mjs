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
assert.ok(html.includes('Sixteen familiar games') && html.includes('<strong>16</strong> games'),'game count mismatch');
console.log('Passed: '+scripts.length+' scripts parse; 16-game launcher and navigation present.');
