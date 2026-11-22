/* LUX v0.6.4: Render-driven Get Paid repair. Never adds bottom navigation tabs. */
(()=>{'use strict';
const $=s=>document.querySelector(s);
const cards=[
 ['Golf · 9 Holes','Nine holes · Earn LUX cash','golf-aerial',()=>typeof golfMenu==='function'&&golfMenu()],
 ['Blackjack','Five-seat casino table','casino-table',()=>typeof blackjack==='function'&&blackjack()],
 ['Roulette','European wheel · LUX cash','roulette',()=>typeof roulette==='function'&&roulette()],
 ['Cornhole','Swipe to throw · Play the CPU','cornhole',()=>typeof cornhole==='function'&&cornhole()],
 ['Street Racing','Midnight downtown · Race the CPU','racing-tile',()=>window.luxRacing?.race()],
 ['Card Chasing','NFL & NBA · Mystery packs','card-chasing-tile',()=>window.luxCardChasing?.open()]
];
const assets={ 'racing-tile':'assets/racing-tile.webp','card-chasing-tile':'assets/card-chasing-tile.webp',
'golf-aerial':'assets/item-golf-aerial.webp','casino-table':'assets/item-casino-table.webp','roulette':'assets/item-roulette.webp','cornhole':'assets/item-cornhole.webp'};
function nav(){const bar=$('#app > nav');if(!bar)return;for(const b of bar.querySelectorAll('button')){if(!['home','paid','settings'].includes(b.dataset.nav))b.remove();}bar.querySelectorAll('[data-nav]').forEach(b=>b.style.display='');}
function isPaid(){const main=$('#screen');if(!main)return false;const title=main.querySelector('h1');return !!title&&title.textContent.trim()==='Get Paid';}
function render(){nav();if(!isPaid())return;const main=$('#screen');if(main.querySelector('#lux64-paid'))return;
// Replace only the Get Paid menu; preserve all game functions and saved data.
main.innerHTML='<section id="lux64-paid"><div class="lux64-heading"><h1>Get Paid</h1><p>Choose your next experience</p></div><div id="lux64-grid"></div></section>';
const grid=$('#lux64-grid');for(const [title,sub,art,open] of cards){const button=document.createElement('button');button.type='button';button.className='lux64-card';button.style.backgroundImage=`linear-gradient(90deg,rgba(4,5,7,.84),rgba(4,5,7,.12)),url("${assets[art]}")`;button.innerHTML='<span class="lux64-card-copy"><strong></strong><small></small></span><span class="lux64-chevron">›</span>';button.querySelector('strong').textContent=title;button.querySelector('small').textContent=sub;button.addEventListener('click',open);grid.append(button);}
}
function init(){nav();const screen=$('#screen');if(!screen)return;let scheduled=false;const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;render()})};new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});document.querySelectorAll('#app nav [data-nav="paid"]').forEach(b=>b.addEventListener('click',schedule));schedule();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();