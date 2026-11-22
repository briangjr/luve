/* Luxe Arcade v0.4.4. Only the presentation layer is replaced.
   Game functions (lifestyle/paid/shop) are supplied by existing scripts. */
(function () {
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  function setActive(tab){
    document.querySelectorAll('nav [data-nav]').forEach(b=>{
      const yes=b.dataset.nav===tab;
      b.classList.toggle('active',yes);
      if(yes)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    });
  }
  function addAction(root,label,description,symbol,image,click,index){
    const b=document.createElement('button');
    b.type='button';b.className='wealth-action';
    b.style.setProperty('--action-art',`url("assets/${image}")`);
    b.style.setProperty('--delay', `${index*60+90}ms`);
    const ico=document.createElement('span');ico.className='wealth-action-icon';ico.textContent=symbol;ico.setAttribute('aria-hidden','true');
    const copy=document.createElement('span');copy.className='wealth-action-copy';
    const name=document.createElement('strong');name.textContent=label;
    const desc=document.createElement('small');desc.textContent=description;
    copy.append(name,desc);
    const arrow=document.createElement('span');arrow.className='wealth-action-arrow';arrow.textContent='›';arrow.setAttribute('aria-hidden','true');
    b.append(ico,copy,arrow);b.addEventListener('click',()=>{setActive(label==='Get Paid'?'paid':'');click()});root.append(b);
  }
  home=function(){
    const life=typeof initLife==='function'?initLife():null;
    const age=life?.age??18;
    page('','<div class="wealth-home" id="wealth-home"><div class="wealth-eyebrow">Your private world</div><div class="wealth-intro"><h1 class="wealth-greeting">A life of <span>possibility.</span></h1><span class="wealth-edition">Luxe / Personal</span></div><div class="wealth-overview"><div class="wealth-stat"><span class="wealth-stat-label">Available cash</span><strong class="wealth-stat-value gold" id="wealth-cash"></strong><span class="wealth-stat-foot">Fictional currency</span></div><div class="wealth-stat"><span class="wealth-stat-label">Life progression</span><strong class="wealth-stat-value" id="wealth-age"></strong><span class="wealth-stat-foot" id="wealth-residence"></span></div></div><section class="wealth-hero" aria-label="Luxury home representing a future goal"><div class="wealth-hero-copy"><span class="wealth-hero-eyebrow">The life you build</span><div class="wealth-hero-title">Build your<br><em>empire.</em></div><span class="wealth-hero-description">Play. Progress. Make every move count.</span><span class="wealth-hero-tag">Your journey starts here</span></div></section><div class="wealth-section-head"><h2>Explore your world</h2><span>01 / 03</span></div><div class="wealth-actions" id="wealth-actions"></div><p class="wealth-note">An entertainment experience using fictional money only. No deposits or cashouts.</p></div>');
    document.querySelector('#wealth-cash').textContent=money(state.cash);
    document.querySelector('#wealth-age').textContent='Age '+age;
    document.querySelector('#wealth-residence').textContent=typeof currentHome==='function'?currentHome().name:'Your journey';
    const a=document.querySelector('#wealth-actions');
    addAction(a,'Lifestyle','Residence · Garage · Wardrobe','⌂','lifestyle-suite.webp',lifestyle,0);
    addAction(a,'Get Paid','Six games · Earn cash','♠','get-paid-tables.webp',()=>paid(),1);
    addAction(a,'Spend Money','Cars · Fashion · Property','◇','spend-money-auto.webp',shop,2);
    setActive('home');
    requestAnimationFrame(()=>document.querySelector('#wealth-home')?.classList.add('is-visible'));
  };
  document.querySelectorAll('nav [data-nav]').forEach(button=>button.addEventListener('click',()=>setActive(button.dataset.nav)));
  const originalSave=save;
  // No changes to localStorage or game state; home always reads the same state.
  home();
})();
