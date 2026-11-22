/* LUX 0.6.5: working Get Paid gallery, six cards, no extra nav tabs. */
(()=>{'use strict';
const games=[
 ['Golf · 9 Holes','Nine holes · Earn LUX cash','golf-tile.webp',()=>golfMenu()],
 ['Blackjack','Five-seat casino table','blackjack-tile.webp',()=>blackjack()],
 ['Roulette','European wheel · LUX cash','roulette-tile.webp',()=>roulette()],
 ['Cornhole','Swipe to throw · Play the CPU','cornhole-tile.webp',()=>cornhole()],
 ['Street Racing','Midnight downtown · Race the CPU','racing-tile.webp',()=>window.luxRacing.race()],
 ['Card Chasing','NFL & NBA · Mystery packs','card-chasing-tile.webp',()=>window.luxCardChasing.open()]
];
const main=document.querySelector('#screen');if(!main)return;
function trimNav(){document.querySelectorAll('#app > nav button').forEach(b=>{if(!['home','paid','settings'].includes(b.dataset.nav))b.remove()})}
function render(){trimNav();const h=main.querySelector('h1');if(!h||h.textContent.trim()!=='Get Paid'||main.querySelector('#lux65-paid'))return;
 main.innerHTML='<section id="lux65-paid"><div class="lux65-heading"><h1>Get Paid</h1><small>CHOOSE YOUR EXPERIENCE</small></div><div id="lux65-grid"></div></section>';
 const grid=main.querySelector('#lux65-grid');games.forEach(([title,sub,img,action])=>{const b=document.createElement('button');b.type='button';b.className='lux65-card';b.style.backgroundImage='linear-gradient(0deg,rgba(0,0,0,.92),rgba(0,0,0,.03) 80%),url("assets/'+img+'")';const info=document.createElement('span');info.className='lux65-copy';const strong=document.createElement('strong');strong.textContent=title;const small=document.createElement('small');small.textContent=sub;info.append(strong,small);b.append(info);b.addEventListener('click',()=>{try{action()}catch(err){console.error('LUX tile launch failed',title,err);alert('Unable to open '+title+'. Check that all update files were uploaded.')}});grid.append(b)})
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})};new MutationObserver(schedule).observe(main,{childList:true,subtree:false});document.querySelectorAll('#app nav [data-nav="paid"]').forEach(b=>b.addEventListener('click',schedule));render();
})();