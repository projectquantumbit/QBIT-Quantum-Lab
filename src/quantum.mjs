/** QBIT Quantum Lab — dependency-free state-vector simulator.
 * Qubit 0 is the least-significant bit. Gate order is chronological by step.
 * All amplitudes use IEEE-754 doubles and complex arithmetic.
 */
export const MAX_QUBITS = 8;
export const SINGLE_GATES = ['H','X','Y','Z','S','SDG','T','TDG','RX','RY','RZ'];
export const MULTI_GATES = ['CX','CZ','SWAP','CCX','CP'];
export const ALL_GATES = [...SINGLE_GATES, ...MULTI_GATES];
const sq2 = 1 / Math.sqrt(2);
const c = (r=0,i=0)=>[r,i];
const add=(a,b)=>[a[0]+b[0],a[1]+b[1]];
const mul=(a,b)=>[a[0]*b[0]-a[1]*b[1],a[0]*b[1]+a[1]*b[0]];
const ex=(t)=>[Math.cos(t),Math.sin(t)];
export function newCircuit(qubits=2){ return { version:1, name:'Untitled circuit', qubits, gates:[] }; }
export function orderedGates(circuit){return [...circuit.gates].sort((a,b)=>a.step-b.step || (a.order??0)-(b.order??0));}
export function validateCircuit(circuit){
 if(!circuit || !Number.isInteger(circuit.qubits) || circuit.qubits<1 || circuit.qubits>MAX_QUBITS) throw Error(`Choose 1–${MAX_QUBITS} qubits.`);
 if(!Array.isArray(circuit.gates) || circuit.gates.length>512) throw Error('Invalid circuit: max 512 gates.');
 for(const g of circuit.gates){
  if(!ALL_GATES.includes(g.type)) throw Error(`Unsupported gate: ${g.type}`);
  if(!Number.isInteger(g.step) || g.step<0 || g.step>512) throw Error('Invalid step.');
  if(!Number.isInteger(g.target) || g.target<0 || g.target>=circuit.qubits) throw Error('Invalid target qubit.');
  if(MULTI_GATES.includes(g.type)){
   if(!Number.isInteger(g.control) || g.control<0 || g.control>=circuit.qubits || g.control===g.target) throw Error('Choose a different valid control qubit.');
  }
  if(g.type==='CCX' && (!Number.isInteger(g.control2) || g.control2<0 || g.control2>=circuit.qubits || [g.target,g.control].includes(g.control2))) throw Error('CCX needs three different qubits.');
  if(['RX','RY','RZ','CP'].includes(g.type) && !Number.isFinite(g.theta)) throw Error('Rotation angle must be finite.');
 }
 return true;
}
export function initialState(n){ const length=2**n; const re=new Float64Array(length); re[0]=1; return {n,re,im:new Float64Array(length)}; }
export function copyState(s){return {n:s.n,re:s.re.slice(),im:s.im.slice()};}
const mat = (a,b,d,e) => [a,b,d,e];
function gateMatrix(g){
 switch(g.type){
 case 'X':return mat(c(0),c(1),c(1),c(0));
 case 'Y':return mat(c(0),c(0,-1),c(0,1),c(0));
 case 'Z':return mat(c(1),c(0),c(0),c(-1));
 case 'H':return mat(c(sq2),c(sq2),c(sq2),c(-sq2));
 case 'S':return mat(c(1),c(0),c(0),c(0,1));
 case 'SDG':return mat(c(1),c(0),c(0),c(0,-1));
 case 'T':return mat(c(1),c(0),c(0),ex(Math.PI/4));
 case 'TDG':return mat(c(1),c(0),c(0),ex(-Math.PI/4));
 case 'RX':{const a=Math.cos(g.theta/2),b=Math.sin(g.theta/2);return mat(c(a),c(0,-b),c(0,-b),c(a));}
 case 'RY':{const a=Math.cos(g.theta/2),b=Math.sin(g.theta/2);return mat(c(a),c(-b),c(b),c(a));}
 case 'RZ':return mat(ex(-g.theta/2),c(0),c(0),ex(g.theta/2));
 default:throw Error('No matrix for gate '+g.type);
 }
}
function applySingle(s,target,m, controlMask=0){
 const bit=1<<target;
 for(let j=0;j<s.re.length;j++){
  if(j&bit || (j&controlMask)!==controlMask)continue;
  const k=j|bit, a=c(s.re[j],s.im[j]), b=c(s.re[k],s.im[k]);
  const lo=add(mul(m[0],a),mul(m[1],b)), hi=add(mul(m[2],a),mul(m[3],b));
  s.re[j]=lo[0];s.im[j]=lo[1];s.re[k]=hi[0];s.im[k]=hi[1];
 }
}
export function applyGate(s,g){
 if(SINGLE_GATES.includes(g.type)){applySingle(s,g.target,gateMatrix(g));return s;}
 const cmask=1<<g.control, tmask=1<<g.target;
 if(g.type==='CX'||g.type==='CCX'){
  const mask=cmask|(g.type==='CCX'?(1<<g.control2):0);
  applySingle(s,g.target,gateMatrix({type:'X'}),mask);
 }else if(g.type==='CZ'||g.type==='CP'){
  const factor=g.type==='CZ'?c(-1):ex(g.theta);
  for(let j=0;j<s.re.length;j++)if((j&cmask)&&(j&tmask)){const z=mul(c(s.re[j],s.im[j]),factor);s.re[j]=z[0];s.im[j]=z[1];}
 }else if(g.type==='SWAP'){
  for(let j=0;j<s.re.length;j++)if((j&cmask)===0 && (j&tmask)!==0){const k=j^cmask^tmask;
   [s.re[j],s.re[k]]=[s.re[k],s.re[j]];[s.im[j],s.im[k]]=[s.im[k],s.im[j]];
  }
 }
 return s;
}
export function simulate(circuit,count=Infinity){
 validateCircuit(circuit);const s=initialState(circuit.qubits);
 for(const g of orderedGates(circuit).slice(0,count))applyGate(s,g);
 return s;
}
export function probabilities(s){return Array.from(s.re,(r,i)=>r*r+s.im[i]*s.im[i]);}
export function formatBits(i,n){return i.toString(2).padStart(n,'0');}
export function formatComplex(r,i){const fix=x=>Math.abs(x)<0.000005?'0':Number(x.toFixed(4)).toString();return `${fix(r)} ${i<0?'−':'+'} ${fix(Math.abs(i))}i`;}
export function sampleShots(s,shots=1000,random=Math.random){
 if(!Number.isInteger(shots)||shots<1||shots>100000)throw Error('Shots must be between 1 and 100,000.');
 const probs=probabilities(s),cdf=[];let sum=0;for(const p of probs){sum+=p;cdf.push(sum);}
 const counts=new Array(probs.length).fill(0);
 for(let j=0;j<shots;j++){const u=random()*sum;let k=0;while(k<cdf.length-1 && u>=cdf[k])k++;counts[k]++;}
 return counts;
}
export function measureQubit(s,target,random=Math.random){
 if(target<0||target>=s.n)throw Error('Invalid qubit');
 let p0=0; for(let j=0;j<s.re.length;j++)if(!(j&(1<<target)))p0+=s.re[j]**2+s.im[j]**2;
 const outcome=random()<p0?0:1;
 const p=outcome?1-p0:p0; const norm=p>1e-15?Math.sqrt(p):1;
 const out=copyState(s);
 for(let j=0;j<out.re.length;j++){
  if(Number(Boolean(j&(1<<target)))!==outcome){out.re[j]=0;out.im[j]=0;}
  else {out.re[j]/=norm;out.im[j]/=norm;}
 }
 return {outcome,state:out,p0};
}
/** Reduced single-qubit Bloch vector; length < 1 for entangled/mixed states. */
export function blochVector(s,target=0){
 const bit=1<<target;let x=0,y=0,z=0;
 for(let j=0;j<s.re.length;j++){
  const p=s.re[j]**2+s.im[j]**2;
  z+=(j&bit)?-p:p;
  if(!(j&bit)){
   const k=j|bit;
   x+=2*(s.re[j]*s.re[k]+s.im[j]*s.im[k]);
   y+=2*(s.re[j]*s.im[k]-s.im[j]*s.re[k]);
  }
 }
 return {x,y,z,purity:Math.min(1,Math.sqrt(x*x+y*y+z*z))};
}
export function circuitDepth(circuit){return circuit.gates.length?Math.max(...circuit.gates.map(g=>g.step))+1:0;}
export function makeExperiment(id){
 const q=(name,qubits,gates,description)=>({version:1,name,qubits,gates:gates.map((g,i)=>({step:i,...g})),description});
 switch(id){
 case 'superposition':return q('Quantum superposition',1,[{type:'H',target:0}],'An H gate creates equal probability amplitudes for |0⟩ and |1⟩.');
 case 'entanglement':return q('Bell-state entanglement',2,[{type:'H',target:0},{type:'CX',target:1,control:0}],'The Bell state produces correlated 00 and 11 measurement outcomes.');
 case 'interference':return q('Quantum interference',1,[{type:'H',target:0},{type:'Z',target:0},{type:'H',target:0}],'Phase differences cause amplitudes to interfere, producing |1⟩.');
 case 'teleportation':return q('Teleportation preparation',3,[{type:'X',target:0},{type:'H',target:1},{type:'CX',control:1,target:2},{type:'CX',control:0,target:1},{type:'H',target:0}],'Prepares the coherent portion of teleportation. Classical measurement and feed-forward are explained in the guide, not simulated here.');
 case 'grover':return q('Grover search — 2 qubits',2,[{type:'H',target:0},{type:'H',target:1},{type:'CZ',control:0,target:1},{type:'H',target:0},{type:'H',target:1},{type:'X',target:0},{type:'X',target:1},{type:'CZ',control:0,target:1},{type:'X',target:0},{type:'X',target:1},{type:'H',target:0},{type:'H',target:1}],'A 2-qubit amplitude amplification demo marking |11⟩.');
 case 'qft':return q('Quantum Fourier transform',3,[{type:'H',target:2},{type:'CP',control:1,target:2,theta:Math.PI/2},{type:'CP',control:0,target:2,theta:Math.PI/4},{type:'H',target:1},{type:'CP',control:0,target:1,theta:Math.PI/2},{type:'H',target:0},{type:'SWAP',control:0,target:2}],'Three-qubit QFT applied to the |000⟩ state.');
 default:throw Error('Unknown experiment.');
 }
}
export function toQASM(circuit){
 validateCircuit(circuit);const lines=['OPENQASM 2.0;','include "qelib1.inc";',`qreg q[${circuit.qubits}];`];
 const fixed={CX:'cx',CZ:'cz',SWAP:'swap',CCX:'ccx',SDG:'sdg',TDG:'tdg'};
 for(const g of orderedGates(circuit)){
  if(g.type==='CP')throw Error('Controlled-phase gate export to OpenQASM 2 is not supported. Use JSON export.');
  const name=fixed[g.type]||g.type.toLowerCase();
  const arg=['RX','RY','RZ'].includes(g.type)?`(${Number(g.theta.toPrecision(14))})`:'';
  const qs=g.type==='CCX'?[g.control,g.control2,g.target]:MULTI_GATES.includes(g.type)?[g.control,g.target]:[g.target];
  lines.push(`${name}${arg} ${qs.map(i=>`q[${i}]`).join(',')};`);
 }
 return lines.join('\n')+'\n';
}
export function fromJSON(text){const obj=JSON.parse(text);validateCircuit(obj);return {version:1,name:String(obj.name||'Imported circuit').slice(0,80),qubits:obj.qubits,gates:obj.gates.map(g=>({...g}))};}
