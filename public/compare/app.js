import {fields,parseMeasurement,cockpit,delta} from './geometry.js';
let english=new URL(location.href).searchParams.get('lang')==='en',last=null,validationActive=false;
const byId=id=>document.getElementById(id);
for(const setup of ['a','b'])for(const [key,[low,high,fr,en,unit]]of Object.entries(fields)){
  const label=document.createElement('label');label.htmlFor=setup+'-'+key;
  const text=document.createElement('span');text.dataset.fr=fr;text.dataset.en=en;text.textContent=fr;
  const hint=document.createElement('span');hint.className='unit';hint.id=setup+'-'+key+'-range';hint.textContent=`${unit} · ${low} … ${high}`;
  const input=document.createElement('input');input.id=label.htmlFor;input.type='text';input.inputMode='decimal';input.required=true;input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-describedby',hint.id);
  label.append(text,hint,input);byId('fields-'+setup).append(label);
}
function format(value){return new Intl.NumberFormat(english?'en-GB':'fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1}).format(Math.abs(value)<0.05?0:value);}
function render(){
  if(!last)return;
  const {a,b}=last,d=delta(a,b),pa=cockpit(a),pb=cockpit(b);
  byId('dx').textContent=(d.x>=0?'+':'')+format(d.x)+' mm';byId('dy').textContent=(d.y>=0?'+':'')+format(d.y)+' mm';
  byId('xmeaning').textContent=Math.abs(d.x)<0.05?(english?'Same horizontal position':'Même position horizontale'):d.x>0?(english?'B farther forward':'B plus éloigné'):(english?'B closer':'B plus proche');
  byId('ymeaning').textContent=Math.abs(d.y)<0.05?(english?'Same height':'Même hauteur'):d.y>0?(english?'B higher':'B plus haut'):(english?'B lower':'B plus bas');
  for(const [id,value]of Object.entries({ax:pa.x,ay:pa.y,bx:pb.x,by:pb.y}))byId(id).textContent=format(value);
  const points=[{x:a.reach,y:a.stack},pa,{x:b.reach,y:b.stack},pb];
  const left=Math.min(...points.map(p=>p.x))-20,right=Math.max(...points.map(p=>p.x))+20;
  const bottom=Math.min(...points.map(p=>p.y))-20,top=Math.max(...points.map(p=>p.y))+20;
  const scale=Math.min(620/(right-left),240/(top-bottom));
  const map=p=>({x:30+(620-(right-left)*scale)/2+(p.x-left)*scale,y:280-(240-(top-bottom)*scale)/2-(p.y-bottom)*scale});
  const va=map(pa),vb=map(pb),ha=map(points[0]),hb=map(points[2]);
  byId('plot').innerHTML=`<path d="M30 280H650M30 280V40" stroke="var(--border)" fill="none"/><text x="615" y="308" fill="var(--muted)">+X</text><text x="6" y="30" fill="var(--muted)">+Y</text><path d="M${ha.x} ${ha.y}L${va.x} ${va.y}" stroke="var(--a)" stroke-width="3"/><path d="M${hb.x} ${hb.y}L${vb.x} ${vb.y}" stroke="var(--b)" stroke-width="3"/><circle cx="${va.x}" cy="${va.y}" r="7" fill="var(--surface)" stroke="var(--a)" stroke-width="3"/><circle cx="${vb.x}" cy="${vb.y}" r="5" fill="var(--b)"/><text x="${va.x-18}" y="${va.y-13}" fill="var(--a)">A</text><text x="${vb.x+10}" y="${vb.y+22}" fill="var(--b)">B</text>`;
  byId('plot').setAttribute('aria-label',english?'Measured head-tube top and bar clamp positions, A hollow, B filled':'Sommet du tube de direction et centre du cintre mesurés, A creux, B plein');
}
function validate(){
  const values={a:{},b:{}},errors=[];let first=null;
  for(const setup of ['a','b'])for(const [key,[low,high,fr,en,unit]]of Object.entries(fields)){
    const input=byId(setup+'-'+key),value=parseMeasurement(input.value),invalid=!Number.isFinite(value)||value<low||value>high;
    values[setup][key]=value;
    if(validationActive)input.setAttribute('aria-invalid',String(invalid));
    if(invalid){if(!first)first=input;errors.push(`${setup.toUpperCase()} · ${english?en:fr}: ${low} … ${high} ${unit}`);}
  }
  byId('errors').textContent=validationActive&&errors.length?(english?'Enter a number within these ranges: ':'Saisissez un nombre dans ces plages : ')+errors.join(' ; '):'';
  return {values,first};
}
function language(){
  document.documentElement.lang=english?'en':'fr';
  document.querySelectorAll('[data-fr]').forEach(el=>el.textContent=english?el.dataset.en:el.dataset.fr);
  byId('language').querySelector('span').textContent=english?'FR':'EN';
  validate();render();
}
byId('language').addEventListener('click',()=>{english=!english;language();});
byId('compare').addEventListener('input',()=>{last=null;byId('results').hidden=true;if(validationActive)validate();});
byId('compare').addEventListener('submit',event=>{
  event.preventDefault();validationActive=true;const {values,first}=validate();
  if(first){last=null;byId('results').hidden=true;first.focus();return;}
  last=values;render();byId('results').hidden=false;byId('results').focus();
});
byId('clear').addEventListener('click',()=>{byId('compare').reset();validationActive=false;document.querySelectorAll('input').forEach(input=>input.removeAttribute('aria-invalid'));last=null;byId('results').hidden=true;byId('errors').textContent='';byId('a-stack').focus();});
language();
byId('copy-a').addEventListener('click',()=>{for(const key of Object.keys(fields))byId('b-'+key).value=byId('a-'+key).value;last=null;byId('results').hidden=true;if(validationActive)validate();byId('b-stack').focus();});
