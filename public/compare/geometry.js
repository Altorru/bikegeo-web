// Same axes and component conventions as FORMULAS.md; no bike catalogue.
export const fields = {
  stack:[300,850,'Stack','Stack','mm'], reach:[200,650,'Reach','Reach','mm'],
  head:[55,85,'Angle de direction','Head angle','°'], stem:[20,180,'Longueur de potence','Stem length','mm'],
  angle:[-45,45,'Angle de potence signé','Signed stem angle','°'], spacers:[0,80,'Spacers','Spacers','mm'],
  topCap:[0,40,'Hauteur du capot','Headset cover height','mm'], clamp:[20,60,'Hauteur du collier de potence','Stem clamp height','mm']
};
export function parseMeasurement(raw) {
  if(typeof raw!=='string'||!/^[-+]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw.trim()))return NaN;
  return Number(raw.trim().replace(',','.'));
}
export function valid(bike) {
  return Object.entries(fields).every(([key,[low,high]])=>Number.isFinite(bike[key])&&bike[key]>=low&&bike[key]<=high);
}
export function cockpit(bike) {
  if(!valid(bike))throw new RangeError('Invalid measurements');
  const h=bike.head*Math.PI/180,theta=(90-bike.head+bike.angle)*Math.PI/180;
  const z=bike.spacers+bike.topCap+bike.clamp/2;
  return {x:bike.reach-z*Math.cos(h)+bike.stem*Math.cos(theta),y:bike.stack+z*Math.sin(h)+bike.stem*Math.sin(theta)};
}
export function delta(a,b) {
  const ca=cockpit(a),cb=cockpit(b);return {x:cb.x-ca.x,y:cb.y-ca.y};
}
