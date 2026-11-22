
(()=>{
'use strict';
const CARDS=[
["NFL","Patrick Mahomes",2017,"Panini Prizm",900],["NFL","Josh Allen",2018,"Panini Prizm",300],["NFL","Lamar Jackson",2018,"Panini Prizm",180],["NFL","Joe Burrow",2020,"Panini Prizm",130],["NFL","Justin Jefferson",2020,"Panini Prizm",90],["NFL","C.J. Stroud",2023,"Panini Prizm",80],
["NBA","LeBron James",2003,"Topps",650],["NBA","Stephen Curry",2009,"Topps",450],["NBA","Luka Doncic",2018,"Panini Prizm",280],["NBA","Victor Wembanyama",2023,"Panini Prizm",140],["NBA","Cade Cunningham",2021,"Panini Prizm",55],["NBA","Anthony Edwards",2020,"Panini Prizm",85]
].map((a,i)=>({id:'c'+i,sport:a[0],player:a[1],year:a[2],set:a[3],value:a[4],front:null,back:null}));
const KEY='lux_collectibles_v062';
let state;try{state=JSON.parse(localStorage.getItem(KEY))||{owned:[],history:[]}}catch{state={owned:[],history:[]}};
let root=null,tab='packs',reveal=[],revealIndex=0,flipped=false;
const money=n=>'$'+Math.round(n).toLocaleString('en-US');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const getBalance=()=>Number(window.LUXCollectiblesBridge?.getBalance?.()??0);
const changeBalance=n=>window.LUXCollectiblesBridge?.changeBalance?.(n)===true;
const drawCard=(c,big=false)=>`<div class="card ${big?'big':''}" data-card="${c.id}">${c[flipped?'back':'front']?`<img src="${esc(c[flipped?'back':'front'])}" alt="Card image">`:`<div style="font-size:42px">✦</div><small>Card image not supplied</small>`}<strong>${esc(c.player)}</strong><small>${esc(c.year)} ${esc(c.set)} · ${esc(c.sport)}</small><b class="gold">${money(c.value)} LUX</b></div>`;
const list=arr=>`<div class="cards">${arr.map(c=>drawCard(c)).join('')}</div>`;
function render(){
if(!root)return;
root.innerHTML=`<header><b style="letter-spacing:3px">LUX <span class="gold">COLLECTIBLES</span></b><button data-action="close">Close ✕</button></header><div class="tabs"><button data-action="packs">Packs</button><button data-action="collection">Collection (${state.owned.length})</button></div><main>${tab==='packs'?`<div class="panel"><h2>Virtual mystery packs</h2><p>Choose NFL or NBA. Each pack reveals 3 virtual cards.</p><p class="gold">Balance: ${money(getBalance())}</p><div class="actions"><button data-action="buy" data-sport="NFL">NFL · $100</button><button data-action="buy" data-sport="NBA">NBA · $100</button></div></div><p class="notice">Illustrative card metadata and fictional game values. Real card photos are not included yet. No physical ownership or real-money redemption.</p>`:tab==='collection'?`<div class="panel"><h2>Your collection</h2><p>${state.owned.length} cards · game value ${money(state.owned.reduce((s,id)=>s+(CARDS.find(c=>c.id===id)?.value||0),0))}</p><p class="notice">Tap a card to sell it for fictional LUX cash.</p></div>${list(state.owned.map(id=>CARDS.find(c=>c.id===id)).filter(Boolean))}`:tab==='reveal'?`<div class="reveal">${drawCard(reveal[revealIndex],true)}<p style="text-align:center">Card ${revealIndex+1} of ${reveal.length}</p><div class="actions"><button data-action="flip">Flip</button><button data-action="next">${revealIndex+1===reveal.length?'Finish':'Next card →'}</button></div></div>`:''}</main>`;
}
function pick(pool){const a=new Uint32Array(1);crypto.getRandomValues(a);return pool[a[0]%pool.length]}
function buy(sport){
if(!window.LUXCollectiblesBridge?.getBalance||!window.LUXCollectiblesBridge?.changeBalance){alert('Connect the LUX cash balance first; see README.');return}
if(getBalance()<100){alert('Not enough LUX cash.');return}
if(!changeBalance(-100)){alert('Purchase not completed.');return}
const pool=CARDS.filter(c=>c.sport===sport);reveal=Array.from({length:3},()=>pick(pool));revealIndex=0;flipped=false;
state.owned.push(...reveal.map(c=>c.id));state.history.push({sport,at:new Date().toISOString(),cards:reveal.map(c=>c.id)});save();tab='reveal';render();
}
function sell(id){
const idx=state.owned.indexOf(id);if(idx<0)return;
const c=CARDS.find(c=>c.id===id);if(!c)return;
if(!window.LUXCollectiblesBridge?.changeBalance){alert('Connect the LUX balance first.');return}
if(!confirm(`Sell ${c.player} for ${money(c.value)} fictional LUX cash?`))return;
if(!changeBalance(c.value)){alert('Sale could not be completed.');return}
state.owned.splice(idx,1);save();render();
}
function click(e){
const b=e.target.closest('[data-action]');if(b){const a=b.dataset.action;
if(a==='close')close();
if(a==='packs'||a==='collection'){tab=a;render()}
if(a==='buy')buy(b.dataset.sport);
if(a==='flip'){flipped=!flipped;render()}
if(a==='next'){if(++revealIndex>=reveal.length)tab='collection';flipped=false;render()}
return}
const card=e.target.closest('[data-card]');if(card&&tab==='collection')sell(card.dataset.card);
}
function open(){if(root)return;root=document.createElement('section');root.id='lux-collectibles';root.addEventListener('click',click);document.body.appendChild(root);tab='packs';render()}
function close(){root?.remove();root=null}
window.LUXCollectibles={open,close,cardCatalog:CARDS};
})();
