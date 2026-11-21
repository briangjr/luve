/* Premium home: real controls, decorative-only hero, existing game routes retained. */
(function(){
 const originalHome=home;
 home=function(){
   page('','<div class="premium-home"><div class="home-kicker">THE LUXURY LIFE SIMULATOR</div><div class="premium-hero" aria-label="Luxe Arcade luxury skyline"><div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div><div class="hero-core"><div class="hero-monogram">LA</div><div class="hero-line"></div><div class="hero-caption">BUILD YOUR EMPIRE</div></div><div class="hero-shine"></div></div><div class="home-headline">Your world. <em>Your rules.</em></div><div class="home-subtitle">Play games. Build wealth. Live luxuriously.</div><div class="premium-actions" id="premium-actions"></div><p class="premium-disclaimer">VIRTUAL MONEY ONLY · NO REAL-MONEY GAMBLING</p></div>');
   const a=document.querySelector('#premium-actions');
   [['Lifestyle','Your residence, garage & wardrobe','⌂',lifestyle],['Get Paid','Golf & casino games','♠',paid],['Spend Money','Cars, homes & luxury upgrades','◇',shop]].forEach(([name,detail,icon,action])=>{const b=document.createElement('button');b.className='premium-action';b.type='button';b.innerHTML='<span class="action-symbol" aria-hidden="true">'+icon+'</span><span class="action-copy"><strong>'+name+'</strong><small>'+detail+'</small></span><span class="action-chevron" aria-hidden="true">›</span>';b.addEventListener('click',action);a.appendChild(b)});
 };
 document.querySelector('[data-nav="home"]').onclick=()=>home();
 home();
})();
