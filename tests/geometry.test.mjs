import assert from 'node:assert/strict';
import {cockpit,delta,parseMeasurement,valid} from '../public/compare/geometry.js';
const bike={stack:560,reach:390,head:60,stem:100,angle:-30,spacers:0,topCap:10,clamp:40};
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const point=cockpit(bike);near(point.x,475);near(point.y,560+15*Math.sqrt(3));
const a={...bike,head:73,angle:-6},d=delta(a,{...a,spacers:20});near(d.x,-5.847434094);near(d.y,19.126095119);
assert.deepEqual(delta(a,a),{x:0,y:0});const shifted={...a,stack:a.stack-8,reach:a.reach+12};near(delta(a,shifted).x,12);near(delta(a,shifted).y,-8);
const reverse=delta(shifted,a);near(reverse.x,-12);near(reverse.y,8);
near(parseMeasurement(' 575,0 '),575);near(parseMeasurement('-6'),-6);
for(const input of ['',' ','NaN','Infinity','1e2','12 mm','1,2,3'])assert.ok(Number.isNaN(parseMeasurement(input)));
for(const bad of [{...a,reach:Infinity},{...a,stack:NaN},{...a,head:90},{...a,spacers:-1},{...a,clamp:0}]){assert.equal(valid(bad),false);assert.throws(()=>cockpit(bad),RangeError);}
for(const boundary of [{stack:300,reach:200,head:55,stem:20,angle:-45,spacers:0,topCap:0,clamp:20},{stack:850,reach:650,head:85,stem:180,angle:45,spacers:80,topCap:40,clamp:60}]){assert.ok(valid(boundary));const p=cockpit(boundary);assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y));}
console.log('8 checks passed: independent analytical fixture, spacer vector, identity, translation, reverse, parsing, invalid bounds/non-finite, boundary finiteness. Test fixtures only; no production defaults.');
