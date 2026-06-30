/* =============================================
   mipedido.js — Seguimiento e historial de pedidos
   ============================================= */

// ── PROTEGER PÁGINA: requiere sesión ──
const usuario = JSON.parse(localStorage.getItem('mamamia_usuario') || 'null');
if (!usuario) {
    localStorage.setItem('mamamia_redirect', 'mipedido.html');
    location.href = 'login.html';
}

const ESTADOS = [
    { icon: '✅', title: 'Pedido confirmado', desc: 'Tu pago fue recibido y el pedido ingresó al sistema.' },
    { icon: '👨‍🍳', title: 'En preparación', desc: 'Nuestros pizzaiolos están preparando tu pedido.' },
    { icon: '🔥', title: 'En el horno', desc: 'Tu pizza está en nuestro horno de leña a 485°C.' },
    { icon: '🏪', title: 'Listo para recoger', desc: 'Tu pedido está listo en el local. Jr. Grau 245, Chosica.' },
    { icon: '🎉', title: '¡Entregado!', desc: '¡Gracias por tu visita! Esperamos verte pronto.' },
];

const pagoLabels = { yape: '📱 Yape', plin: '💜 Plin', tarjeta: '💳 Tarjeta' };

const pizzaImgs = {
    margherita: 'img/pizza_margherita.png',
    diavola: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    verdure: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80',
    pesto_pollo: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80',
    quattro: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    tartufo: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80',
    americana: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
    hawaiana: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
    carnivora: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    suprema: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
    napolitana: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    siciliana: 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=800&q=80',
    pepperoni: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
    alemana: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&q=80',
    continental: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&q=80',
    cuatroquesos: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80'
};

function getImg(name) {
    const key = Object.keys(pizzaImgs).find(k => name.toLowerCase().includes(k));
    return key ? pizzaImgs[key] : pizzaImgs.margherita;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── HISTORIAL: guardar pedido completado en historial del usuario ──
function getHistorial() {
    const key = `mamamia_historial_${usuario.email}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
}

function saveHistorial(historial) {
    const key = `mamamia_historial_${usuario.email}`;
    localStorage.setItem(key, JSON.stringify(historial));
}

function agregarAlHistorial(pedido) {
    const historial = getHistorial();
    // Evitar duplicados
    if (historial.find(p => p.num === pedido.num)) return;
    historial.unshift(pedido);
    saveHistorial(historial);
}

// ── TRACKER ──
function renderTracker(estado) {
    const container = document.getElementById('trackerSteps');
    const now = new Date();
    container.innerHTML = ESTADOS.map((e, i) => {
        let cls = 'step pending';
        if (i < estado) cls = 'step done';
        else if (i === estado) cls = 'step active';
        const timeStr = i <= estado
            ? new Date(now.getTime() - (estado - i) * 8 * 60000)
                .toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
            : '';
        return `
      <div class="${cls}">
        <div class="step-icon">${i < estado ? '✓' : e.icon}</div>
        <div class="step-body">
          <p class="step-title">${e.title}</p>
          <p class="step-desc">${e.desc}</p>
          ${timeStr ? `<p class="step-time">${timeStr}</p>` : ''}
        </div>
      </div>`;
    }).join('');
}

// ── PEDIDO ACTIVO ──
function renderPedidoActivo() {
    const pedido = JSON.parse(localStorage.getItem('mamamia_pedido') || 'null');

    // Si el pedido no pertenece al usuario actual, ocultarlo
    if (pedido && pedido.userEmail && pedido.userEmail !== usuario.email) {
        document.getElementById('noPedido').classList.remove('hidden');
        document.getElementById('pedidoWrap').classList.add('hidden');
        return;
    }

    if (!pedido) {
        document.getElementById('noPedido').classList.remove('hidden');
        document.getElementById('pedidoWrap').classList.add('hidden');
        return;
    }

    document.getElementById('noPedido').classList.add('hidden');
    document.getElementById('pedidoWrap').classList.remove('hidden');

    document.getElementById('pedidoNum').textContent = pedido.num;
    document.getElementById('pedidoPago').textContent = `${pagoLabels[pedido.pago] || '💳'} Pagado`;

    const tiempos = ['', '20–30 min aprox.', '15–20 min aprox.', '¡Listo para recoger!', ''];
    document.getElementById('tiempoEstimado').textContent = tiempos[pedido.estado] || '';

    renderTracker(pedido.estado);

    const btnCancelar = document.getElementById('btnCancelar');
    btnCancelar.classList.toggle('hidden', pedido.estado > 0);

    document.getElementById('pedidoItems').innerHTML = (pedido.items || []).map(item => `
    <div class="pedido-item-row">
      <img class="pedido-item-img" src="${getImg(item.name)}" alt="${item.name}"/>
      <div class="pedido-item-info">
        <strong>${item.name}</strong>
        <span>${item.size || ''} × ${item.qty}</span>
      </div>
      <span class="pedido-item-price">S/ ${item.price.toFixed(2)}</span>
    </div>`).join('');

    document.getElementById('pSubtotal').textContent = `S/ ${pedido.total}`;
    document.getElementById('pTotal').textContent = `S/ ${pedido.total}`;
    document.getElementById('pedidoContacto').innerHTML = `📞 <strong>${pedido.tel}</strong>`;

    const notasDiv = document.getElementById('pedidoNotas');
    notasDiv.style.display = pedido.notas ? 'block' : 'none';
    if (pedido.notas) notasDiv.innerHTML = `📝 ${pedido.notas}`;

    // Guardar en historial
    agregarAlHistorial(pedido);

    // Avance automático de estado (demo)
    if (pedido.estado < ESTADOS.length - 1) {
        setTimeout(() => {
            pedido.estado++;
            localStorage.setItem('mamamia_pedido', JSON.stringify(pedido));
            renderTracker(pedido.estado);
            document.getElementById('tiempoEstimado').textContent = tiempos[pedido.estado] || '';
            btnCancelar.classList.add('hidden');
            if (pedido.estado === 3) showToast('🏪 ¡Tu pedido está listo para recoger!');
            if (pedido.estado === 4) {
                agregarAlHistorial(pedido);
                renderHistorial();
            }
        }, 20000);
    }
}

// ── HISTORIAL ──
function renderHistorial() {
    const historial = getHistorial();
    const container = document.getElementById('historialList');
    if (!container) return;

    if (historial.length === 0) {
        container.innerHTML = `<p class="historial-vacio">Aún no tienes pedidos anteriores.</p>`;
        return;
    }

    container.innerHTML = historial.map(p => `
    <div class="historial-card">
      <div class="historial-header">
        <div>
          <span class="historial-num">${p.num}</span>
          <span class="historial-fecha">${new Date(p.creado).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <span class="badge ${ESTADOS[p.estado]?.cls || 'entregado'}">${ESTADOS[p.estado]?.icon || '🎉'} ${ESTADOS[p.estado]?.title || 'Entregado'}</span>
      </div>
      <div class="historial-items">
        ${(p.items || []).map(i => `
          <div class="historial-item-row">
            <img src="${getImg(i.name)}" alt="${i.name}"/>
            <span>${i.name} × ${i.qty}</span>
            <span>S/ ${i.price.toFixed(2)}</span>
          </div>`).join('')}
      </div>
      <div class="historial-footer">
        <span>${pagoLabels[p.pago] || '💳'} · ${p.modalidad === 'delivery' ? '🛵 Delivery' : '🏪 Recojo'}</span>
        <span class="historial-total">Total: <strong>S/ ${p.total}</strong></span>
      </div>
    </div>`).join('');
}

function cancelarPedido() {
    if (!confirm('¿Seguro que quieres cancelar tu pedido? Si ya procesaste el pago contáctanos al +51 987 654 321.')) return;
    localStorage.removeItem('mamamia_pedido');
    showToast('❌ Pedido cancelado');
    setTimeout(() => location.reload(), 1500);
}

renderPedidoActivo();
renderHistorial();