/* =============================================
   carrito.js
   ============================================= */

let cart = JSON.parse(localStorage.getItem('mamamia_cart') || '[]');
const pizzaImgs = {
  margherita: 'img/pizza_margherita.png',
  diavola: 'img/pizza_margherita.png',
  verdure: 'img/pizza_margherita.png',
  prosciutto: 'img/pizza_margherita.png',
  quattro: 'img/pizza_margherita.png',
  tartufo: 'img/pizza_margherita.png',
};
const defaultImg = 'img/pizza_margherita.png';

function getImg(name) {
  const key = Object.keys(pizzaImgs).find(k => name.toLowerCase().includes(k));
  return key ? pizzaImgs[key] : defaultImg;
}

function render() {
  const list = document.getElementById('itemsList');
  const empty = document.getElementById('emptyCart');
  const actions = document.getElementById('carritoActions');
  const right = document.getElementById('carritoRight');
  const resumen = document.getElementById('resumenItems');
  const count = document.getElementById('carritoCount');
  const cartBadge = document.getElementById('cartCount');

  const total = cart.reduce((s, i) => s + i.price, 0);
  const items = cart.length;

  // Badge nav
  if (cartBadge) cartBadge.textContent = items;
  count.textContent = `${items} producto${items !== 1 ? 's' : ''} en tu pedido`;

  if (items === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    actions.classList.add('hidden');
    right.classList.add('hidden');
    return;
  }

  empty.classList.add('hidden');
  actions.classList.remove('hidden');
  right.classList.remove('hidden');

  // Items list
  list.innerHTML = cart.map((item, i) => `
    <div class="item-card">
      <img class="item-img" src="${getImg(item.name)}" alt="${item.name}"/>
      <div class="item-info">
        <h4>${item.name}</h4>
        <p class="item-size">${capitalize(item.size)} (${sizeMap[item.size] || ''})</p>
        <div class="item-tags">
          ${(item.extras || []).map(e => `<span class="item-tag extra">+${e}</span>`).join('')}
          ${item.drink ? `<span class="item-tag drink">${item.drink}</span>` : ''}
        </div>
      </div>
      <div class="item-right">
        <button class="item-delete" onclick="deleteItem(${i})" title="Eliminar">🗑</button>
        <div class="qty-controls">
          <button class="qty-btn-c" onclick="changeQty(${i},-1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn-c plus" onclick="changeQty(${i},1)">+</button>
        </div>
        <span class="item-price">S/ ${item.price.toFixed(2)}</span>
      </div>
    </div>
  `).join('');

  // Resumen
  resumen.innerHTML = cart.map(item =>
    `<div class="resumen-item"><span>${item.name} x${item.qty}</span><span>S/ ${item.price.toFixed(2)}</span></div>`
  ).join('');

  document.getElementById('resSubtotal').textContent = `S/ ${total.toFixed(2)}`;
  document.getElementById('resTotal').textContent = `S/ ${total.toFixed(2)}`;
  document.getElementById('btnTotal').textContent = `S/ ${total.toFixed(2)}`;
}

const sizeMap = { personal: '25cm', mediana: '33cm', familiar: '42cm' };
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

function deleteItem(i) {
  cart.splice(i, 1);
  save(); render();
}

function changeQty(i, delta) {
  if (cart[i].qty + delta < 1) return;
  // Recalcular precio unitario
  const unit = cart[i].price / cart[i].qty;
  cart[i].qty += delta;
  cart[i].price = parseFloat((unit * cart[i].qty).toFixed(2));
  save(); render();
}

function vaciarCarrito() {
  if (!confirm('¿Seguro que quieres vaciar el carrito?')) return;
  cart = []; save(); render();
}

function save() { localStorage.setItem('mamamia_cart', JSON.stringify(cart)); }

function selectPago(el) {
  const esTarjeta = el.value === 'tarjeta';
  const modalDelivery = document.getElementById('modalDelivery');
  if (!modalDelivery) return;
  if (esTarjeta) {
    modalDelivery.classList.remove('disabled');
  } else {
    // Si no es tarjeta, forzar recojo
    modalDelivery.classList.add('disabled');
    document.querySelector('input[name="modalidad"][value="recojo"]').checked = true;
    document.getElementById('modalRecojo').classList.add('active-modal');
    document.getElementById('modalDelivery').classList.remove('active-modal');
    document.getElementById('direccionWrap').classList.add('hidden');
  }
}

function onModalidad() {
  const val = document.querySelector('input[name="modalidad"]:checked')?.value;
  document.getElementById('modalRecojo').classList.toggle('active-modal', val === 'recojo');
  document.getElementById('modalDelivery').classList.toggle('active-modal', val === 'delivery');
  document.getElementById('direccionWrap').classList.toggle('hidden', val !== 'delivery');
}

// Inicializar: delivery deshabilitado por defecto (requiere tarjeta)
window.addEventListener('DOMContentLoaded', () => {
  const modalDelivery = document.getElementById('modalDelivery');
  if (modalDelivery) modalDelivery.classList.add('disabled');
});

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function confirmarPedido() {
  const tel = document.getElementById('telefono').value.trim();
  const err = document.getElementById('telErr');
  const modalidad = document.querySelector('input[name="modalidad"]:checked')?.value || 'recojo';
  const direccion = document.getElementById('direccion')?.value.trim();
  const dirErr = document.getElementById('dirErr');

  let valid = true;
  if (!tel) { err.textContent = 'El teléfono es requerido'; valid = false; }
  else err.textContent = '';
  if (modalidad === 'delivery' && !direccion) {
    dirErr.textContent = 'La dirección es requerida'; valid = false;
  } else if (dirErr) dirErr.textContent = '';

  if (!valid || cart.length === 0) { if (cart.length === 0) showToast('Tu carrito está vacío'); return; }

  const pago = document.querySelector('input[name="pago"]:checked')?.value || 'yape';
  const notas = document.getElementById('notas').value.trim();
  const total = cart.reduce((s, i) => s + i.price, 0);
  const num = 'MM-' + Math.floor(100000 + Math.random() * 900000);

  const pedido = {
    num, pago, tel, notas, modalidad,
    direccion: modalidad === 'delivery' ? direccion : 'Jr. Grau 245, Chosica',
    items: [...cart],
    total: total.toFixed(2),
    estado: 0,
    creado: new Date().toISOString()
  };

  localStorage.setItem('mamamia_pedido_pendiente', JSON.stringify(pedido));
  location.href = 'pago.html';
}

render();