/** Interactive Bloch sphere, drawn with Canvas 2D and perspective projection. */
export function mountBloch(canvas, vector){
 if(!canvas)return;
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const size=240,dpr=Math.min(window.devicePixelRatio||1,2);
 canvas.width=size*dpr;canvas.height=size*dpr;ctx.scale(dpr,dpr);
 let yaw=.7,pitch=-.35,drag=null;
 const rot=([x,y,z])=>{
  const a=x*Math.cos(yaw)-y*Math.sin(yaw),b=x*Math.sin(yaw)+y*Math.cos(yaw);
  const yy=b*Math.cos(pitch)-z*Math.sin(pitch),zz=b*Math.sin(pitch)+z*Math.cos(pitch);
  return {x:a,y:yy,z:zz};
 };
 const point=(v)=>{const t=rot(v);return [120+t.x*83,120-t.z*83,t.y];};
 function line(points,color,width=1,dash=[]){ctx.beginPath();ctx.setLineDash(dash);points.forEach((p,i)=>i?ctx.lineTo(...p.slice(0,2)):ctx.moveTo(...p.slice(0,2)));ctx.strokeStyle=color;ctx.lineWidth=width;ctx.stroke();ctx.setLineDash([]);}
 function draw(){
  ctx.clearRect(0,0,size,size);
  const halo=ctx.createRadialGradient(120,120,3,120,120,111);halo.addColorStop(0,'#1049684d');halo.addColorStop(1,'#0b1a2300');ctx.fillStyle=halo;ctx.fillRect(0,0,size,size);
  const sphere=ctx.createRadialGradient(94,78,6,125,135,95);sphere.addColorStop(0,'#17415a46');sphere.addColorStop(.8,'#0718275a');sphere.addColorStop(1,'#0c2c4588');ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(120,120,83,0,Math.PI*2);ctx.fill();
  ctx.lineWidth=1.7;ctx.strokeStyle='#55d9f0b0';ctx.stroke();
  const equator=[];for(let a=0;a<=Math.PI*2+.01;a+=.07)equator.push(point([Math.cos(a),Math.sin(a),0]));line(equator,'#57a6c26e',1.4);
  for(const axis of [[[0,0,-1],[0,0,1]], [[-1,0,0],[1,0,0]], [[0,-1,0],[0,1,0]]])line(axis.map(point),'#31739755',1,[3,5]);
  for(let a=0;a<Math.PI*2;a+=Math.PI/8){const p=point([Math.cos(a),Math.sin(a),0]);ctx.fillStyle='#3fbad89a';ctx.beginPath();ctx.arc(p[0],p[1],1.1,0,Math.PI*2);ctx.fill();}
  const o=point([0,0,0]),p=point([vector.x,vector.y,vector.z]);
  if(vector.purity>.02){ctx.shadowColor='#65eeff';ctx.shadowBlur=17;line([o,p],'#b8fbff',3);ctx.shadowBlur=0;ctx.beginPath();ctx.arc(p[0],p[1],5,0,Math.PI*2);ctx.fillStyle='#76e9ff';ctx.fill();}
  else{ctx.beginPath();ctx.arc(120,120,7,0,Math.PI*2);ctx.fillStyle='#a68dff';ctx.fill();}
  const top=point([0,0,1]),bottom=point([0,0,-1]);ctx.font='11px ui-monospace, monospace';ctx.fillStyle='#b1d8f0';ctx.fillText('|0⟩',top[0]+7,top[1]-4);ctx.fillText('|1⟩',bottom[0]+7,bottom[1]+11);
 }
 canvas.onpointerdown=e=>{drag={x:e.clientX,y:e.clientY,yaw,pitch};canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{if(!drag)return;yaw=drag.yaw+(e.clientX-drag.x)/100;pitch=Math.max(-1.5,Math.min(1.5,drag.pitch+(e.clientY-drag.y)/120));draw();};
 canvas.onpointerup=()=>{drag=null;};canvas.onpointercancel=()=>{drag=null;};draw();
}
