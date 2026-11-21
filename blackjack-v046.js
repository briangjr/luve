/* Luxe Arcade Blackjack update: five seats, splits, touch betting, payouts. */
(function(){'use strict';
let bj=null,selected=25,seat=0,animationTimer=null,sequence=0;
let previouslyVisible=new WeakSet();
const $b=s=>document.querySelector(s), fmt=n=>Math.round(n).toLocaleString('en-US');
const denominations=[5,25,100,500];
const rank=c=>c.r;
const cardValue=h=>value(h.cards);
const isNatural=h=>h.cards.length===2&&value(h.cards)===21&&!h.split;
const sameRank=(a,b)=>a.r===b.r;
function bank(){return Math.max(0,Math.floor(Number(state.cash)||0));}
function spend(n){if(n>bank()||n<=0)return false;state.cash-=n;save();return true;}
function refund(n){state.cash+=n;save();}
function hand(cards,bet,split=false){return {cards,bet,split,done:false,result:'',returned:0};}
function create(){previouslyVisible=new WeakSet();bj={phase:'bet',bets:[0,0,0,0,0],shoe:deck(),hands:[],dealer:[],turn:0,message:'Select a chip denomination and place bets using your cash balance.',lastBets:null,settled:[],invested:0,roundNet:0,reveal:0,modal:false};selected=25;seat=0;render();}
function takeCard(){if(bj.shoe.length<24)bj.shoe=deck();return bj.shoe.pop();}
function setBet(i,n){
 if(bj.phase!=='bet'||i<0||i>4)return;
 const old=bj.bets[i],diff=n-old;
 if(!Number.isInteger(n)||n<0){bj.message='Select a valid chip amount.';render();return;}
 if(diff>bank()){bj.message=`Not enough money for this bet. You have ${fmt(bank())} available.`;render();return;}if(diff>0)spend(diff);else if(diff<0)refund(-diff);bj.bets[i]=n;seat=i;
 bj.message=diff>0?`Added $${fmt(diff)} to Hand ${i+1}. Tap another hand or DEAL CARDS.`:'Bet updated.';
 render();if(diff>0)animateChipToSeat(i,diff);}
function add(i,n){setBet(i,bj.bets[i]+n)}
function deal(){
 if(bj.phase!=='bet'||!bj.bets.some(Boolean))return;
 bj.lastBets=bj.bets.slice();bj.invested=bj.bets.reduce((a,b)=>a+b,0);
 bj.hands=[];bj.dealer=[takeCard(),takeCard()];
 for(let i=0;i<5;i++)bj.hands.push(bj.bets[i]?[hand([takeCard(),takeCard()],bj.bets[i])]:[]);
 bj.phase='dealing';bj.turn=0;bj.reveal=0;bj.modal=false;
 bj.message='Dealing cards from the shoe…';render();
 const token=++sequence;
 const count=2+bj.hands.reduce((n,g)=>n+(g[0]?.cards.length||0),0);
 function step(){
   if(token!==sequence||!bj||bj.phase!=='dealing')return;
   bj.reveal++;render();
   if(bj.reveal<count)setTimeout(step,360);
   else setTimeout(()=>{
     if(token!==sequence||bj.phase!=='dealing')return;
     bj.phase='play';bj.message='Play each hand. Dealer stands on all 17s.';
     if(natural(bj.dealer))settle();else nextTurn();
   },440);
 }
 setTimeout(step,300);
}
function natural(cards){return cards.length===2&&value(cards)===21;}
function active(){const s=bj.hands[bj.turn];return s?.find(h=>!h.done)||null;}
function nextTurn(){while(bj.turn<5){const h=active();if(h){if(isNatural(h)||cardValue(h)===21){h.done=true;continue;}render();return;}bj.turn++;}dealerPlay();}
function hit(){const h=active();if(!h)return;h.cards.push(takeCard());if(cardValue(h)>=21)h.done=true;bj.message='Card dealt from dealer shoe.';nextTurn();}
function stand(){const h=active();if(!h)return;h.done=true;nextTurn();}
function split(){const h=active();if(!h||h.cards.length!==2||!sameRank(h.cards[0],h.cards[1])||!spend(h.bet))return;bj.invested+=h.bet;const group=bj.hands[bj.turn],idx=group.indexOf(h);const a=hand([h.cards[0],takeCard()],h.bet,true),b=hand([h.cards[1],takeCard()],h.bet,true);group.splice(idx,1,a,b);bj.message='Split hands play independently. Split aces may be hit.';render();animateChipToSeat(bj.turn,h.bet);}
function double(){const h=active();if(!h||h.cards.length!==2||!spend(h.bet))return;bj.invested+=h.bet;h.bet*=2;h.cards.push(takeCard());h.done=true;nextTurn();}
function dealerPlay(){bj.phase='dealer';bj.message='Dealer reveals the hole card…';render();
 const token=++sequence;
 setTimeout(function drawDealer(){
  if(token!==sequence||!bj||bj.phase!=='dealer')return;
  if(value(bj.dealer)<17){bj.dealer.push(takeCard());bj.message='Dealer draws a card…';render();setTimeout(drawDealer,650);}
  else settle();
 },750);}
function settle(){bj.phase='done';const dv=value(bj.dealer),dn=natural(bj.dealer);let won=0;bj.settled=[];for(let i=0;i<5;i++)for(const h of bj.hands[i]){const p=cardValue(h),pn=isNatural(h);let payout=0;if(p>21){h.result='Bust';}else if(pn&&!dn){payout=Math.floor(h.bet*2.5);h.result='Blackjack 3:2';}else if(dn&&!pn){h.result='Dealer blackjack';}else if(dv>21||p>dv){payout=h.bet*2;h.result='Win';}else if(p===dv){payout=h.bet;h.result='Push';}else h.result='Loss';h.returned=payout;if(payout){refund(payout);won+=payout;}bj.settled.push({i,payout,result:h.result});}bj.roundNet=won-bj.invested;window.luxCreditGame?.(bj.roundNet>0);
 bj.message=`Round complete · ${bj.roundNet>=0?'+':'−'}$${fmt(Math.abs(bj.roundNet))} ${bj.roundNet>=0?'profit':'loss'}.`;
 bj.modal=true;render();bj.settled.forEach((x,j)=>{if(x.payout)setTimeout(()=>animate('dealer',`seat-${x.i}`,x.payout),j*180+200);else setTimeout(()=>animate(`seat-${x.i}`,'dealer',0),j*180+200);});}
function repeat(mult){if(bj.phase!=='done')return;const bets=bj.lastBets.map(n=>n*mult),total=bets.reduce((a,b)=>a+b,0);if(total>bank()){bj.message=`Not enough money: need ${fmt(total)}, have ${fmt(bank())}.`;render();return;}bj.phase='bet';bj.bets=[0,0,0,0,0];bj.hands=[];bj.dealer=[];bj.modal=false;for(let i=0;i<5;i++)if(bets[i]){spend(bets[i]);bj.bets[i]=bets[i];}deal();}
function newBets(){bj.phase='bet';bj.bets=[0,0,0,0,0];bj.hands=[];bj.dealer=[];bj.modal=false;bj.turn=0;bj.message='Place new bets on any seats.';render();}
function cards(cs,hidden=false){return cs.map((c,i)=>{const fresh=!previouslyVisible.has(c);previouslyVisible.add(c);const motion=fresh?' bj-new-card':'';return hidden&&i===1?`<span class="bj-card bj-back${motion}">◆</span>`:`<span class="bj-card${motion} ${'♥♦'.includes(c.s)?'bj-red':''}">${c.r}<small>${c.s}</small></span>`}).join('');}
function render(){
 if(!bj)return;
 const betting=bj.phase==='bet',done=bj.phase==='done',playing=bj.phase==='play',h=playing?active():null;
 const dealing=bj.phase==='dealing';
 let visible=bj.reveal;
 const dealerCards=dealing?bj.dealer.slice(0,Math.min(2,visible)):bj.dealer;
 if(dealing)visible=Math.max(0,visible-2);
 const seatHTML=Array.from({length:5},(_,i)=>{
   const group=bj.hands[i]||[],on=playing&&i===bj.turn;
   const shown=group.map(x=>{
      let cs=x.cards;
      if(dealing){const shownCount=Math.min(cs.length,visible);cs=cs.slice(0,shownCount);visible=Math.max(0,visible-shownCount);}
      return `<div class="bj-hand">${cards(cs)}<span>${x.result||(!dealing&&x.cards.length?value(x.cards):'')}</span></div>`;
   }).join('');
   const stake=group.length?group.reduce((sum,x)=>sum+x.bet,0):bj.bets[i];
   return `<button type="button" class="bj-seat ${on?'bj-active':''} ${betting&&i===seat?'bj-selected':''}" data-seat="${i}" id="seat-${i}" aria-label="Seat ${i+1}, $${stake} wager">
    <span class="bj-seat-label">HAND ${i+1}</span><div class="bj-seat-cards">${shown}</div>
    <span class="bj-stack">${stake?`<span class="bj-mini-chips" aria-hidden="true"><i></i><i></i><i></i></span><span class="bj-stake-amount">$${fmt(stake)}</span>`:'+ BET'}</span></button>`;
 }).join('');
 page('Blackjack',`<section class="bj-app">
 <div class="bj-top"><span>PRIVATE TABLE · FIVE HANDS</span><strong>$${fmt(bank())} CASH</strong></div>
 <div class="bj-table"><div class="bj-dealer" id="dealer"><span>DEALER ${bj.dealer.length&&!playing&&!dealing?value(bj.dealer):''}</span>
 <div class="bj-shoe" aria-hidden="true">▰<small>SHOE</small></div><div class="bj-dealer-cards">${cards(dealerCards,playing||dealing)}</div></div>
 <div class="bj-seats">${seatHTML}</div><div class="bj-table-caption">BLACKJACK PAYS 3 TO 2 · DEALER STANDS ON 17</div></div>
 <p class="bj-message" role="status">${bj.message}</p><div id="bj-controls"></div><div id="bj-flying" aria-hidden="true"></div>
 ${done&&bj.modal?`<div class="bj-overlay" id="bj-overlay"><div class="bj-result-dialog" role="dialog" aria-modal="true" aria-label="Round result">
 <div class="bj-result-kicker">ROUND COMPLETE</div><div class="bj-net ${bj.roundNet>=0?'positive':'negative'}">${bj.roundNet>=0?'+':'−'}$${fmt(Math.abs(bj.roundNet))}</div>
 <div class="bj-result-label">${bj.roundNet>0?'TOTAL PROFIT':bj.roundNet<0?'TOTAL LOSS':'BREAK EVEN'}</div>
 <div class="bj-result-stats"><span>Total wagered <b >$${fmt(bj.invested)}</b></span><span>Returned <b >$${fmt(bj.invested+bj.roundNet)}</b></span></div>
 <button id="bj-result-close">View Table & Continue</button></div></div>`:''}
 </section>`);
 const controls=$b('#bj-controls');
 document.querySelectorAll('[data-seat]').forEach(el=>{
  const i=Number(el.dataset.seat);
  el.onclick=()=>{if(betting){seat=i;add(i,selected);}};
  el.ondragover=e=>{if(betting)e.preventDefault()};
  el.ondrop=e=>{e.preventDefault();if(betting){seat=i;add(i,Number(e.dataTransfer.getData('text/plain'))||selected);}};
 });
 if(betting){
  controls.innerHTML=`<div class="bj-tray"><div class="bj-tray-label">SELECT A CHIP · TAP A HAND TO BET</div>
  <div class="bj-chiprow">${denominations.map(n=>`<button draggable="true" data-chip="${n}" class="bj-chip ${selected===n?'chosen':''}" >$${fmt(n)}</button>`).join('')}</div>
  <div class="bj-summary">Total wager: <b>$${fmt(bj.bets.reduce((a,b)=>a+b,0))}</b></div>
  <div class="bj-buttons bj-bet-actions"><button id="bj-clear">Clear Bets</button><button class="bj-primary" id="bj-deal" ${bj.bets.some(Boolean)?'':'disabled'}>DEAL CARDS <span>➜</span></button></div></div>`;
  controls.querySelectorAll('[data-chip]').forEach(el=>{el.onclick=()=>{selected=+el.dataset.chip;bj.message=`$${fmt(selected)} chip selected. Tap a hand to place it.`;render()};el.ondragstart=e=>e.dataTransfer.setData('text/plain',el.dataset.chip)});
  $b('#bj-clear').onclick=()=>{for(let i=0;i<5;i++)if(bj.bets[i])refund(bj.bets[i]);bj.bets.fill(0);render()};
  $b('#bj-deal').onclick=deal;
 }else if(playing){
  controls.innerHTML=`<div class="bj-turn">HAND ${bj.turn+1} · $${fmt(h.bet)} · Split ${bj.hands[bj.turn].indexOf(h)+1}/${bj.hands[bj.turn].length}</div>
  <div class="bj-buttons bj-play-actions"><button class="bj-primary" id="bj-hit">HIT</button><button id="bj-stand">STAND</button>
  <button id="bj-double" ${h.cards.length===2&&bank()>=h.bet?'':'disabled'}>DOUBLE</button>
  <button id="bj-split" ${h.cards.length===2&&sameRank(h.cards[0],h.cards[1])&&bank()>=h.bet?'':'disabled'}>SPLIT</button></div>`;
  $b('#bj-hit').onclick=hit;$b('#bj-stand').onclick=stand;$b('#bj-double').onclick=double;$b('#bj-split').onclick=split;
 }else if(done){
  controls.innerHTML=`<div class="bj-buttons bj-repeat"><button class="bj-primary" id="bj-repeat">Same Bet & Deal</button><button id="bj-twice">Double Bets & Deal</button><button id="bj-new">New Bet</button></div>`;
  $b('#bj-repeat').onclick=()=>repeat(1);$b('#bj-twice').onclick=()=>repeat(2);$b('#bj-new').onclick=newBets;
 }else controls.innerHTML='<div class="bj-dealing-label">DEALING IN PROGRESS…</div>';
 if(done&&bj.modal)$b('#bj-result-close').onclick=()=>{bj.modal=false;render()};
}
function animateChipToSeat(i,amount){
 const target=document.getElementById(`seat-${i}`), origin=document.querySelector(`[data-chip="${selected}"]`)||document.querySelector('.bj-chip');
 if(!target||!origin)return;
 const a=origin.getBoundingClientRect(),b=target.getBoundingClientRect();
 const count=Math.min(3,Math.max(1,Math.ceil(amount/100)));
 for(let j=0;j<count;j++){
  const token=document.createElement('span');token.className='bj-fly bj-bet-fly';
  token.textContent='◉';token.style.left=(a.left+a.width/2)+'px';token.style.top=(a.top+a.height/2)+'px';
  token.style.setProperty('--dx',(b.left+b.width/2-a.left-a.width/2)+'px');
  token.style.setProperty('--dy',(b.top+b.height*.83-a.top-a.height/2)+'px');
  token.style.animationDelay=(j*90)+'ms';token.style.zIndex='99999';document.body.append(token);
  token.addEventListener('animationend',()=>token.remove(),{once:true});
 }
}
function animate(from,to,amount){const a=document.getElementById(from),b=document.getElementById(to),layer=$b('#bj-flying');if(!a||!b||!layer)return;const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();const chip=document.createElement('span');chip.className='bj-fly';chip.textContent='◉';chip.style.left=(ar.left+ar.width/2)+'px';chip.style.top=(ar.top+ar.height/2)+'px';chip.style.setProperty('--dx',(br.left+br.width/2-ar.left-ar.width/2)+'px');chip.style.setProperty('--dy',(br.top+br.height/2-ar.top-ar.height/2)+'px');document.body.append(chip);chip.addEventListener('animationend',()=>chip.remove(),{once:true});}
blackjack=create;
})();
