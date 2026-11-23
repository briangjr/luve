
(function(){
'use strict';
const api={};
let root,canvas,ctx,raf,ball,hole,aim=0,power=.48,shots=0,done=false,drag=false,last=0,opts={},speed=0,velocity={x:0,y:0};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
function draw(){
 if(!canvas)return;
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);
 const grass=ctx.createLinearGradient(0,0,w,h);grass.addColorStop(0,'#317c49');grass.addColorStop(1,'#174b31');
 ctx.fillStyle=grass;ctx.fillRect(0,0,w,h);
 for(let i=0;i<22;i++){ctx.strokeStyle='rgba(255,255,255,.025)';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(i*30-120,0);ctx.lineTo(i*30+180,h);ctx.stroke()}
 ctx.fillStyle='#11251b';ctx.beginPath();ctx.ellipse(hole.x+3,hole.y+3,12,7,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#080d0b';ctx.beginPath();ctx.ellipse(hole.x,hole.y,10,6,0,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle='#e7ece9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(hole.x,hole.y);ctx.lineTo(hole.x,hole.y-57);ctx.stroke();
 ctx.fillStyle='#f2d279';ctx.beginPath();ctx.moveTo(hole.x,hole.y-57);ctx.lineTo(hole.x+29,hole.y-47);ctx.lineTo(hole.x,hole.y-37);ctx.fill();
 if(!done&&speed<.03){ctx.save();ctx.setLineDash([6,5]);ctx.strokeStyle='#fff7c9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ball.x,ball.y);ctx.lineTo(ball.x+Math.cos(aim)*Math.min(48,35+power*20),ball.y+Math.sin(aim)*Math.min(48,35+power*20));ctx.stroke();ctx.restore()}
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(ball.x+3,ball.y+5,10,6,0,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ball.x,ball.y,8,0,Math.PI*2);ctx.fill();
 ctx.fillStyle='#cfd6d6';ctx.beginPath();ctx.arc(ball.x-2,ball.y-3,2,0,Math.PI*2);ctx.fill();
}
function frame(t){
 const dt=Math.min((t-last||16)/16.67,2);last=t;
 if(speed>.02&&!done){
   ball.x+=velocity.x*dt;ball.y+=velocity.y*dt;
   velocity.x*=Math.pow(.973,dt);velocity.y*=Math.pow(.973,dt);speed=Math.hypot(velocity.x,velocity.y);
   if(ball.x<9||ball.x>canvas.width-9){ball.x=clamp(ball.x,9,canvas.width-9);velocity.x*=-.45}
   if(ball.y<9||ball.y>canvas.height-9){ball.y=clamp(ball.y,9,canvas.height-9);velocity.y*=-.45}
   if(Math.hypot(ball.x-hole.x,ball.y-hole.y)<12 && speed<5){done=true;speed=0;root.querySelector('[data-putt-status]').textContent='HOLED OUT · '+shots+' putt'+(shots===1?'':'s');root.querySelector('[data-putt-hit]').disabled=true; if(opts.onSink)opts.onSink({putts:shots,totalStrokes:(opts.strokesBeforeGreen||0)+shots});}
 }
 draw();raf=requestAnimationFrame(frame);
}
function start(options={}){
 stop();opts=options;
 root=document.createElement('section');root.className='lux-putting';root.innerHTML=`<div class="lux-putting-head"><strong>ON THE GREEN</strong><span data-putt-status>Line up your putt</span></div><canvas width="360" height="470" aria-label="Putting green"></canvas><div class="lux-putting-help">Drag on the green to aim · short guide only</div><label class="lux-putting-power">PUTT STRENGTH <input data-putt-power type="range" min="8" max="100" value="48"><output data-putt-val>48%</output></label><button class="lux-putting-hit" data-putt-hit>PUTT</button><button class="lux-putting-exit" data-putt-exit>Back to course</button>`;
 (options.container||document.body).appendChild(root);canvas=root.querySelector('canvas');ctx=canvas.getContext('2d');
 ball={x:90,y:385};hole={x:260,y:115};shots=0;done=false;aim=Math.atan2(hole.y-ball.y,hole.x-ball.x);power=.48;speed=0;velocity={x:0,y:0};
 const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
 canvas.addEventListener('pointerdown',e=>{if(done||speed>.03)return;drag=true;canvas.setPointerCapture(e.pointerId);const q=point(e);aim=Math.atan2(q.y-ball.y,q.x-ball.x)});
 canvas.addEventListener('pointermove',e=>{if(!drag||done||speed>.03)return;const q=point(e);aim=Math.atan2(q.y-ball.y,q.x-ball.x)});
 canvas.addEventListener('pointerup',()=>drag=false);
 root.querySelector('[data-putt-power]').addEventListener('input',e=>{power=+e.target.value/100;root.querySelector('[data-putt-val]').textContent=e.target.value+'%'});
 root.querySelector('[data-putt-hit]').onclick=()=>{if(done||speed>.03)return;shots++;let force=2+power*11;velocity={x:Math.cos(aim)*force,y:Math.sin(aim)*force};speed=force;root.querySelector('[data-putt-status]').textContent='Putt '+shots};
 root.querySelector('[data-putt-exit]').onclick=()=>{stop();if(opts.onExit)opts.onExit()};
 last=0;raf=requestAnimationFrame(frame);return root;
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;if(root)root.remove();root=null;canvas=null;}
api.start=start;api.stop=stop;window.LUXPutting=api;
})();
