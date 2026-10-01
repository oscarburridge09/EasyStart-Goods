const cart = [];
const drawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

function money(n){ return `£${n.toFixed(2)}`; }

function renderCart(){
  cartCount.textContent = cart.reduce((sum,item)=>sum+item.qty,0);
  const total = cart.reduce((sum,item)=>sum + item.price*item.qty,0);
  cartTotal.textContent = money(total);
  if(!cart.length){
    cartItems.innerHTML = '<p class="empty">Your basket is empty.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item,i)=>`
    <div class="cart-item">
      <div><strong>${item.name}</strong><small>${item.qty} × ${money(item.price)}</small></div>
      <button class="remove" data-remove="${i}">Remove</button>
    </div>`).join('');
  document.querySelectorAll('[data-remove]').forEach(btn=>{
    btn.addEventListener('click',()=>{ cart.splice(Number(btn.dataset.remove),1); renderCart(); });
  });
}
function openCart(){drawer.classList.add('open');overlay.classList.add('show');drawer.setAttribute('aria-hidden','false')}
function closeCart(){drawer.classList.remove('open');overlay.classList.remove('show');drawer.setAttribute('aria-hidden','true')}

document.querySelectorAll('.add-to-cart').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const name=btn.dataset.name, price=Number(btn.dataset.price);
    const existing=cart.find(x=>x.name===name);
    if(existing) existing.qty++; else cart.push({name,price,qty:1});
    renderCart(); openCart();
  });
});
document.getElementById('cartButton').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
overlay.addEventListener('click',closeCart);
document.getElementById('checkout').addEventListener('click',()=>{
  if(!cart.length){ alert('Your basket is empty.'); return; }
  alert('Demo checkout: connect Stripe, PayPal, or your preferred payment provider here.');
});
renderCart();
