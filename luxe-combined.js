
/* Luxe Arcade v0.4.5 combined patch. Loaded after premium.js.
   Preserves existing state/localStorage, golf physics and blackjack rules. */
(function(){
'use strict';
const money=n=>'$'+Math.round(n||0).toLocaleString('en-US');
const art=id=>`assets/${id}.webp`;
const assetMap={ranch:'residence-ranch',craftsman:'residence-craftsman',suburban:'residence-suburban',waterfront:'residence-waterfront',penthouse:'residence-penthouse',tuscan:'residence-tuscan',modernestate:'residence-modernestate',grandestate:'residence-grandestate',parents:'residence-parents',basic:'residence-basic',city:'residence-city',lake:'residence-parents',mansion:'residence-mansion',mega:'residence-mega',shack:'residence-shack'};
const days=l=>(l.months||0)*28+(l.weeks||0)*7;
function initBills(l){
 if(!Array.isArray(l.housingBills)){
  l.housingBills=l.unpaid>0?[{id:'legacy',amount:Math.round(l.unpaid),due:days(l),late:false,home:l.home}]:[];
 }
 l.unpaid=Math.round(l.housingBills.reduce((s,b)=>s+b.amount,0));
 return l.housingBills;
}
function lateCheck(l){
 for(const b of initBills(l)){
  if(!b.late && days(l)>b.due+3){const fee=Math.round(b.amount*.10);b.amount+=fee;b.late=true;l.message=`Late housing fee: ${money(fee)} added.`;}
 }
 l.unpaid=Math.round(l.housingBills.reduce((s,b)=>s+b.amount,0));
}
function payHousing(id){
 const l=initLife(),b=initBills(l).find(b=>b.id===id);
 if(!b||state.cash<b.amount)return;
 state.cash-=b.amount;
 if(b.mortgage && l.mortgage && b.home===l.home){
   const m=l.mortgage,interest=m.balance*m.rate;
   m.balance=Math.max(0,m.balance+interest-b.principalPayment);
   if(m.balance<.01)l.mortgage=null;
 }
 l.housingBills=l.housingBills.filter(x=>x!==b);lateCheck(l);
 lifeNotice('Housing payment completed.');finances();
}
function addBill(l){
 const h=currentHome();let amount=0,mortgage=false;
 if(h.kind==='rent')amount=h.price;
 else if(h.kind==='buy'&&l.mortgage?.balance>0){amount=Math.min(l.mortgage.payment,l.mortgage.balance*(1+l.mortgage.rate));mortgage=true;}
 if(amount>0){
   const due=days(l);
   initBills(l).push({id:`${due}-${Math.random().toString(36).slice(2,8)}`,amount:Math.round(amount),principalPayment:amount,due,late:false,home:h.id,mortgage});
   l.message=`New housing bill: ${money(amount)}. Pay it manually in Finances.`;
 }
 lateCheck(l);
}
advanceLifeWeek=function(){
 const l=initLife();l.weeks++;
 if(l.weeks>=4){l.weeks=0;l.months++;if(l.months%12===0)l.age++;addBill(l);}
 lateCheck(l);
 if(l.age>=75){l.age=18;l.months=0;l.weeks=0;for(const b of initBills(l))b.due=days(l);}
 save();
};
finances=function(){
 const l=initLife(),h=currentHome();lateCheck(l);
 const monthly=h.kind==='rent'?h.price:(l.mortgage?.payment||0);
 lifePage('Life & Finances',`<div class="panel"><h2>Private accounts</h2><p>Residence: <b>${h.name}</b></p><p>Cash: <b>${money(state.cash)}</b></p><p>Monthly housing: <b>${money(monthly)}</b></p><p>Mortgage balance: <b>${money(l.mortgage?.balance)}</b></p><p>Outstanding bills: <b>${money(l.unpaid)}</b></p></div><div class="panel"><h2>Manual bill payment</h2><p class="small">Bills are due each in-game month. A one-time 10% late fee applies after 3 in-game days past due. Golf advances time by 7 days per round.</p><div id="bill-list"></div></div>`);
 const box=document.querySelector('#bill-list');
 if(!l.housingBills.length)box.textContent='All paid. No outstanding bills.';
 l.housingBills.forEach(b=>{
   const row=document.createElement('div');row.className='item';
   const detail=document.createElement('div');detail.className='detail';
   const name=document.createElement('strong');name.textContent=money(b.amount)+(b.late?' · Late fee included':' · Due');
   detail.append(name);row.append(detail,btn('Pay Bill',()=>payHousing(b.id),state.cash<b.amount));box.append(row);
 });
 lifeNav(lifestyle);save();
};
// Current owned residence photo, compact label, modern room buttons.
const oldLifestyle=lifestyle;
lifestyle=function(){
 oldLifestyle();
 const h=currentHome(),scene=document.querySelector('.scene');
 if(scene){
  scene.classList.add('residence-photo');
  scene.style.setProperty('--residence-photo',`url("${art(assetMap[h.id]||'residence-parents')}")`);
  const title=scene.querySelector('.scene-title');if(title)title.textContent='YOUR RESIDENCE';
 }
 const info=document.querySelector('.info');
 if(info)info.classList.add('residence-status');
 const panel=document.querySelector('.scene + .panel');
 if(panel){
  const title=panel.querySelector('h2');if(title)title.classList.add('residence-label');
 }
};
paid=function(){
 page('Get Paid',`<div class="paid-premium"><div class="wealth-eyebrow">The game floor</div><h1>Play to <em>progress.</em></h1><p class="muted">Choose your next experience.</p><div id="paid-options"></div></div>`);
 const options=[
  ['Blackjack','Casino table · Fictional chips','casino-table',blackjack],
  ['Golf · Nine Holes','Skill challenge · Earn cash','golf-aerial',golfMenu],
  ['Play to Progress','Choose a game and build your lifestyle','golf-fairway',golfMenu]
 ];
 const wrap=document.querySelector('#paid-options');
 for(const [name,sub,img,fn] of options){
  const b=btn(name,fn);b.className='paid-photo-button';b.style.setProperty('--paid-art',`url("${art(img)}")`);
  const small=document.createElement('small');small.textContent=sub;b.append(small);wrap.append(b);
 }
};
// Casino table photo and active cards stay separate DOM elements.
const originalRenderBJ=renderBJ;
renderBJ=function(){
 originalRenderBJ();
 document.querySelector('.luxe-banner.luxe-blackjack')?.remove();
 const felt=document.querySelector('.felt');
 if(felt){felt.classList.add('casino-photo-felt');felt.setAttribute('aria-label','Overhead blackjack table');}
 const footer=document.querySelector('.felt ~ .panel + p');if(footer)footer.remove();
};
// Golf uses real aerial photographic texture and a legible playable overlay.
paintGolf=function(){
 if(!golf?.canvas)return;
 const c=golf.canvas,ctx=c.getContext('2d'),w=c.width,H=c.height,h=GOLF_HOLES[golf.hole];
 const image=window.__luxeGolfImage;
 ctx.clearRect(0,0,w,H);
 if(image?.complete&&image.naturalWidth){
  const scale=Math.max(w/image.width,H/image.height),sw=w/scale,sh=H/scale;
  ctx.drawImage(image,(image.width-sw)/2,(image.height-sh)/2,sw,sh,0,0,w,H);
 }else{
  const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#497d37');grad.addColorStop(1,'#214e2c');ctx.fillStyle=grad;ctx.fillRect(0,0,w,H);
 }
 ctx.fillStyle='rgba(6,24,13,.28)';ctx.fillRect(0,0,w,H);
 const center=y=>.5+h.bend*(1-y),width=y=>.16+.07*Math.sin(y*Math.PI);
 ctx.beginPath();
 for(let i=0;i<=60;i++){let y=i/60;ctx.lineTo((center(y)-width(y))*w,y*H);}
 for(let i=60;i>=0;i--){let y=i/60;ctx.lineTo((center(y)+width(y))*w,y*H);}
 ctx.closePath();ctx.fillStyle='rgba(98,167,79,.32)';ctx.fill();ctx.strokeStyle='rgba(197,230,164,.58)';ctx.lineWidth=2;ctx.stroke();
 const t=holeTarget();
 ctx.beginPath();ctx.ellipse(t.x*w,t.y*H,49,35,0,0,Math.PI*2);ctx.fillStyle='rgba(119,193,93,.68)';ctx.fill();
 for(const b of [{x:center(.23)+.21,y:.23},{x:center(.41)-.2,y:.41}]){
  ctx.beginPath();ctx.ellipse(b.x*w,b.y*H,27,21,.3,0,Math.PI*2);ctx.fillStyle='rgba(232,210,149,.82)';ctx.fill();
 }
 ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(t.x*w,t.y*H);ctx.lineTo(t.x*w,t.y*H-31);ctx.stroke();
 ctx.fillStyle='#f3d79a';ctx.beginPath();ctx.moveTo(t.x*w,t.y*H-31);ctx.lineTo(t.x*w+22,t.y*H-24);ctx.lineTo(t.x*w,t.y*H-15);ctx.fill();
 if(golf.aim&&!golf.animating){
  const dx=golf.ball.x-golf.aim.x,dy=golf.ball.y-golf.aim.y,mag=Math.hypot(dx,dy);
  if(mag>.001){
   const range=.10+.47*Math.min(mag,.38)/.38;
   ctx.strokeStyle='#f4dba2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(golf.ball.x*w,golf.ball.y*H);ctx.lineTo(golf.aim.x*w,golf.aim.y*H);ctx.stroke();
   if(golf.mode==='easy'){
    ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(golf.ball.x*w,golf.ball.y*H);
    ctx.lineTo(Math.max(.02,Math.min(.98,golf.ball.x+dx/mag*range))*w,Math.max(.025,Math.min(.98,golf.ball.y+dy/mag*range))*H);
    ctx.stroke();ctx.setLineDash([]);
   }
  }
 }
 ctx.shadowColor='#000';ctx.shadowBlur=9;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(golf.ball.x*w,golf.ball.y*H,7,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
 ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText(h.name,13,26);ctx.font='12px system-ui';ctx.fillText(`${h.len} YDS · ${golf.mode.toUpperCase()} MODE`,13,44);
};
window.__luxeGolfImage=new Image();
window.__luxeGolfImage.onload=()=>{if(golf?.canvas)paintGolf()};
window.__luxeGolfImage.src=art('golf-aerial');
HOMES.push(...[{"id": "ranch", "name": "Starter Ranch", "kind": "buy", "price": 210000, "cap": 2, "icon": ""}, {"id": "craftsman", "name": "Craftsman Bungalow", "kind": "buy", "price": 325000, "cap": 2, "icon": ""}, {"id": "suburban", "name": "Suburban Family Home", "kind": "buy", "price": 475000, "cap": 2, "icon": ""}, {"id": "waterfront", "name": "Modern Waterfront Home", "kind": "buy", "price": 1250000, "cap": 2, "icon": ""}, {"id": "penthouse", "name": "City Penthouse", "kind": "buy", "price": 2200000, "cap": 2, "icon": ""}, {"id": "tuscan", "name": "Mediterranean Villa", "kind": "buy", "price": 3500000, "cap": 4, "icon": ""}, {"id": "modernestate", "name": "Modern Pool Estate", "kind": "buy", "price": 5500000, "cap": 4, "icon": ""}, {"id": "grandestate", "name": "Grand Estate", "kind": "buy", "price": 12000000, "cap": 4, "icon": ""}]);
// Housing: preserve original catalog, add shack as an optional cheap rental.
if(!HOMES.some(h=>h.id==='shack'))HOMES.splice(1,0,{id:'shack',name:'Rural Shack',kind:'rent',price:250,cap:2,icon:'🏚️'});
const oldBuyHome=buyHome;
buyHome=function(p){
 oldBuyHome(p);
 const select=document.querySelector('#down');
 if(!select)return;
 // The existing UI uses a cash-only down payment, and this patch
 // adds a resale preview and prevents the old home from being sold at full list price.
 const preview=document.querySelector('#mortgagePreview');
 if(preview){
  const extra=document.createElement('p');extra.className='small';
  extra.textContent='Resale of owned property is 80% of its original list price, less remaining mortgage and outstanding bills.';
  preview.append(extra);
 }
};
sellProperty=function(p){
 const l=initLife(),mortgage=l.mortgage?.balance||0;
 const resale=Math.round(p.price*.8);
 const proceeds=resale-mortgage;
 state.cash+=proceeds;
 l.mortgage=null;delete l.properties[p.id];
 l.message=`Sold ${p.name} for ${money(resale)}. Mortgage payoff: ${money(mortgage)}. Net: ${money(proceeds)}.`;
 save();return proceeds;
};
const oldMoveHome=moveHome;
moveHome=function(p){
 const l=initLife(),old=currentHome();
 if(old.kind==='buy'){
  const price=Math.round(old.price*.8),balance=l.mortgage?.balance||0;
  if(state.cash+price-balance<0){alert('You need enough cash to cover the remaining mortgage after resale.');return;}
  if(!confirm(`Sell ${old.name} for ${money(price)}? Remaining mortgage: ${money(balance)}. Net proceeds: ${money(price-balance)}. Outstanding bills remain payable.`))return;
  // Avoid the original moveHome confirmation and original full-price sale.
  if(p.cap<l.cars.length)return;
  sellProperty(old);l.home=p.id;l.unpaid=0;lateCheck(l);
  lifeNotice(`Moved into ${p.name}. Outstanding bills remain in Finances.`);housing();return;
 }
 const oldBills=initBills(l).slice();oldMoveHome(p);l.housingBills=oldBills;lateCheck(l);save();
};
// Replace the purchase callback installed by the original buyHome,
// so a new home does not silently pay full resale price for an old property.
buyHome=function(p){
 const l=initLife(),old=currentHome();
 lifePage(p.name,`<div class="panel center"><div class="purchase-property-image" style="background-image:url('${art(assetMap[p.id]||'residence-parents')}')"></div><h2>${p.name} · ${money(p.price)}</h2><p>30-year mortgage at 6% annual interest (fictional game).</p><label for="down">Down payment</label><select id="down" class="luxe-select"><option value="5">5%</option><option value="10">10%</option><option value="20" selected>20%</option><option value="30">30%</option><option value="50">50%</option><option value="100">100% · Pay in full</option></select><div id="mortgagePreview"></div><div id="mortgageButtons" class="row"></div></div>`);
 const select=document.querySelector('#down'),preview=document.querySelector('#mortgagePreview'),buttons=document.querySelector('#mortgageButtons');
 function update(){
  const pct=+select.value,deposit=Math.round(p.price*pct/100),loan=p.price-deposit,monthly=loan?mortgagePayment(loan):0;
  const resale=old.kind==='buy'?Math.round(old.price*.8)-(l.mortgage?.balance||0):0;
  preview.innerHTML=`<p>Down payment: <b>${money(deposit)}</b></p><p>Mortgage: <b>${money(monthly)}/month</b></p>${old.kind==='buy'?`<p>Sale proceeds from current property: <b>${money(resale)}</b> (80% resale minus mortgage)</p>`:''}<p class="small">Payments are manual. A one-time 10% late fee applies after the three-day grace period. Taxes and insurance are excluded.</p>`;
  buttons.innerHTML='';
  buttons.append(btn('Purchase Home',()=>{
   if(p.cap<l.cars.length || state.cash+(old.kind==='buy'?Math.round(old.price*.8)-(l.mortgage?.balance||0):0)<deposit)return;
   if(old.kind==='buy'){
    if(!confirm(`Sell your existing ${old.name} at 80% of list price, pay off its mortgage, and buy ${p.name}?`))return;
    sellProperty(old);
   }
   state.cash-=deposit;l.home=p.id;l.properties[p.id]=true;
   l.mortgage=loan?{balance:loan,payment:monthly,rate:.06/12}:null;
   lateCheck(l);lifeNotice(`Purchased ${p.name}. Housing bills are paid manually.`);housing();
  },p.cap<l.cars.length||state.cash+resale<deposit));
 }
 select.onchange=update;update();lifeNav(housing);
};
const oldHousing=housing;
housing=function(){
 oldHousing();
 const area=document.querySelector('#homes');
 if(!area)return;
 for(const row of area.querySelectorAll('.item')){
  const name=row.querySelector('.detail strong')?.textContent;
  const p=HOMES.find(x=>x.name===name);
  if(p){
   const icon=row.querySelector('.emoji');if(icon){icon.textContent='';icon.classList.add('home-thumb');icon.style.backgroundImage=`url("${art(assetMap[p.id]||'residence-parents')}")`;}
   if(p.kind==='buy'&&p.id===initLife().home){
    const action=btn('Sell / List',()=>{
     const l=initLife(),price=Math.round(p.price*.8),balance=l.mortgage?.balance||0;
     if(state.cash+price-balance<0){alert('You need enough cash to cover the remaining mortgage after resale.');return;}
     if(!confirm(`List ${p.name} for ${money(price)}? Mortgage payoff: ${money(balance)}. Net: ${money(price-balance)}. You will return to Parents' House.`))return;
     sellProperty(p);l.home='parents';lateCheck(l);lifeNotice(`Property sold. You now live at Parents' House.`);housing();
    });
    row.append(action);
   }
  }
 }
};
const l=initLife();initBills(l);save();
})();
