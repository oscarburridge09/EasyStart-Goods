const cart=[];
const drawer=document.getElementById('drawer');
const overlay=document.getElementById('overlay');
const items=document.getElementById('items');
const count=document.getElementById('count');
const total=document.getElementById('total');
const money=n=>'£'+n.toFixed(2);
function render(){
  count.textContent=cart.reduce((s,x)=>s+x.qty,0);
  total.textContent=money(cart.reduce((s,x)=>s+x.price*x.qty,0));
  if(!cart.length){items.innerHTML='<p>Your basket is empty.</p>';return}
  items.innerHTML=cart.map((x,i)=>`<div class="item"><div><b>${x.name}</b><small>${x.qty} × ${money(x.price)}</small></div><button class="remove" data-i="${i}">Remove</button></div>`).join('');
  document.querySelectorAll('.remove').forEach(b=>b.onclick=()=>{cart.splice(+b.dataset.i,1);render()});
}
function openBasket(){drawer.classList.add('open');overlay.classList.add('show')}
function closeBasket(){drawer.classList.remove('open');overlay.classList.remove('show')}
document.querySelectorAll('.add').forEach(b=>b.onclick=()=>{
  let x=cart.find(x=>x.name===b.dataset.name);
  x?x.qty++:cart.push({name:b.dataset.name,price:+b.dataset.price,qty:1});
  render();openBasket();
});
document.getElementById('basketBtn').onclick=openBasket;
document.getElementById('close').onclick=closeBasket;
overlay.onclick=closeBasket;
document.getElementById('checkout').onclick=()=>alert(cart.length?'Demo checkout: connect Stripe, PayPal or another payment provider to accept live orders.':'Your basket is empty.');

// Interactive adventure finder
const quizSteps=[...document.querySelectorAll('.quiz-step')];
const quizResult=document.getElementById('quizResult');
const quizReset=document.getElementById('quizReset');
let quizStep=0;
let quizAnswers=[];
const suggestions={
  fish:{name:'First Catch Fishing Kit',price:'£150',text:'You picked a calm, practical adventure. The full fishing kit brings the rod, reel, landing net and tackle together.'},
  dog:{name:'Welcome Home Paw-ckage',price:'£41.99',text:'You picked a new-dog adventure. The Paw-ckage covers walks, play, grooming and those first-week essentials.'},
  bike:{name:'Mountain Bike Starter Bundle',price:'£49.99',text:'You picked a trail adventure. The bike bundle focuses on pumping, small repairs, chain care, hydration and carrying the kit.'},
  beach:{name:'Beach Sports & Activity Bundle',price:'£59.99',text:'You picked a play-filled beach day. The bundle combines volleyball, beach tennis, sun and practical carry essentials.'}
};
document.querySelectorAll('.quiz-options button').forEach(btn=>btn.addEventListener('click',()=>{
  quizAnswers[quizStep]=btn.dataset.value;
  quizSteps[quizStep].classList.remove('active');
  quizStep++;
  if(quizStep<quizSteps.length){quizSteps[quizStep].classList.add('active');return}
  const first=quizAnswers[0];
  const pick=suggestions[first]||suggestions.fish;
  quizResult.innerHTML=`<span class="eyebrow">YOUR MATCH</span><strong>${pick.name}</strong><p>${pick.text}</p><button class="btn dark quiz-add" data-name="${pick.name}" data-price="${pick.price.replace('£','')}">Add ${pick.price} to basket</button>`;
  quizResult.hidden=false;quizReset.hidden=false;
  quizResult.querySelector('.quiz-add').onclick=e=>{
    const b=e.currentTarget;
    let x=cart.find(x=>x.name===b.dataset.name);
    x?x.qty++:cart.push({name:b.dataset.name,price:+b.dataset.price,qty:1});
    render();openBasket();
  };
}));
quizReset?.addEventListener('click',()=>{
  quizStep=0;quizAnswers=[];quizResult.hidden=true;quizReset.hidden=true;
  quizSteps.forEach((s,i)=>s.classList.toggle('active',i===0));
});

// Local-only review form
const reviewForm=document.getElementById('reviewForm');
const reviewSaved=document.getElementById('reviewSaved');
reviewForm?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('reviewName').value.trim();
  const stars=document.getElementById('reviewStars').value;
  const text=document.getElementById('reviewText').value.trim();
  localStorage.setItem('firstCatchReview',JSON.stringify({name,stars,text}));
  reviewSaved.textContent='Saved on this device — thank you!';
  reviewForm.reset();
});
const savedReview=localStorage.getItem('firstCatchReview');
if(savedReview) reviewSaved.textContent='You have a saved review on this device.';

render();
