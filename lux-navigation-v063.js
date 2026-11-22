/* LUX v0.6.3: Get Paid navigation integration; no new bottom tabs. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
function enforceNav(){const nav=$('#app nav');if(!nav)return;nav.querySelectorAll('button:not([data-nav="home"]):not([data-nav="paid"]):not([data-nav="settings"])').forEach(el=>el.remove());nav.querySelectorAll('[data-nav]').forEach(el=>{el.style.display=['home','paid','settings'].includes(el.dataset.nav)?'':'none'});}
function tile(title,subtitle,image,fn,cls){const b=document.createElement('button');b.type='button';b.className='paid-photo-button lux63-tile '+cls;b.style.setProperty('--lux63-image',`url("assets/${image}")`);b.innerHTML=`<span class="lux63-copy"><strong>${title}</strong><small>${subtitle}</small></span><span class="lux63-arrow">›</span>`;b.onclick=fn;return b;}
function addPaid(){enforceNav();const wrap=$('#paid-options')||$('#screen .tiles')||$('#screen');if(!wrap||$('#lux63-racing'))return;
const r=tile('Street Racing','Midnight downtown · Race the CPU','racing-tile.webp',()=>window.luxRacing?.race(),'lux63-racing');r.id='lux63-racing';
const c=tile('Card Chasing','NFL & NBA · Mystery packs','card-chasing-tile.webp',()=>window.luxCardChasing?.open(),'lux63-cards');c.id='lux63-cards';
wrap.append(r,c);
}
// The original game uses global function navigation. Wrap its Get Paid page, without replacing other features.
if(typeof paid==='function'){const original=paid;paid=function(){original();addPaid()};}
function sync(){enforceNav();const screen=$('#screen');if(screen&&!screen.dataset.lux63Observed){screen.dataset.lux63Observed='yes';let queued=false;const mo=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enforceNav();if($('#paid-options')&&!$('#lux63-racing'))addPaid()})});mo.observe(screen,{childList:true,subtree:true});}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync);else sync();
})();