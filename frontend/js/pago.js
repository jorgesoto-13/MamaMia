/* =============================================
   pago.js — Simulación de pago
   ============================================= */

// Leer pedido pendiente (guardado desde carrito.js)
const pedidoPendiente = JSON.parse(localStorage.getItem('mamamia_pedido_pendiente') || 'null');

// Si no hay pedido pendiente, redirigir al carrito
if (!pedidoPendiente) {
    location.href = 'carrito.html';
}

let metodoActual = pedidoPendiente?.pago || 'yape';

// ── INICIALIZAR RESUMEN ──
function initResumen() {
    if (!pedidoPendiente) return;

    const items = pedidoPendiente.items || [];
    const total = parseFloat(pedidoPendiente.total);
    const modalidad = pedidoPendiente.modalidad || 'recojo';

    // Items
    const container = document.getElementById('resumenPagoItems');
    container.innerHTML = items.map(i =>
        `<div class="resumen-item-p">
      <span><strong>${i.name}</strong> x${i.qty}</span>
      <span>S/ ${i.price.toFixed(2)}</span>
    </div>`
    ).join('');

    // Modalidad
    document.getElementById('resModalidad').textContent =
        modalidad === 'delivery' ? '🛵 Delivery' : '🏪 Recojo en local';

    if (modalidad === 'delivery' && pedidoPendiente.direccion) {
        document.getElementById('resDeliveryRow').style.display = 'flex';
        document.getElementById('resDireccion').textContent = pedidoPendiente.direccion;
    }

    document.getElementById('resSubtotalP').textContent = `S/ ${total.toFixed(2)}`;
    document.getElementById('resTotalP').textContent = `S/ ${total.toFixed(2)}`;

    // Montos en botones
    ['Yape', 'Plin', 'Tarjeta'].forEach(m => {
        const el = document.getElementById(`btnMonto${m}`);
        if (el) el.textContent = `S/ ${total.toFixed(2)}`;
    });

    // Mostrar panel del método guardado desde carrito
    selMetodo(metodoActual);
}

// ── SELECCIONAR MÉTODO ──
function selMetodo(metodo) {
    metodoActual = metodo;

    // Paneles
    ['yape', 'plin', 'tarjeta'].forEach(m => {
        document.getElementById(`panel${capitalize(m)}`).classList.toggle('hidden', m !== metodo);
    });

    // Botones selector
    ['yape', 'plin', 'tarjeta'].forEach(m => {
        document.getElementById(`sel${capitalize(m)}`).classList.toggle('active', m === metodo);
    });
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ── FORMATO TARJETA ──
function formatCard(input) {
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = val.replace(/(.{4})/g, '$1 ').trim();
    document.getElementById('previewNumero').textContent =
        (val + '................').substring(0, 16).replace(/(.{4})/g, '$1 ').trim().replace(/\d/g, (_, i) => i < val.length ? val[Math.floor(i / 5) * 4 + i % 5] : '•') || '•••• •••• •••• ••••';
    // Simplificado: mostrar directo
    document.getElementById('previewNumero').textContent =
        input.value || '•••• •••• •••• ••••';
}

function formatExp(input) {
    let val = input.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    input.value = val;
    document.getElementById('previewExp').textContent = input.value || 'MM/AA';
}

function previewUpdate() {
    const nombre = document.getElementById('cardName').value.toUpperCase();
    document.getElementById('previewNombre').textContent = nombre || 'TU NOMBRE';
}

// ── VALIDAR TARJETA ──
function validarTarjeta() {
    const num = document.getElementById('cardNum').value.replace(/\s/g, '');
    const name = document.getElementById('cardName').value.trim();
    const exp = document.getElementById('cardExp').value;
    const cvv = document.getElementById('cardCvv').value;
    const err = document.getElementById('cardErr');

    if (num.length < 16) { err.textContent = 'Número de tarjeta inválido'; return false; }
    if (!name) { err.textContent = 'Ingresa el nombre del titular'; return false; }
    if (exp.length < 5) { err.textContent = 'Fecha de vencimiento inválida'; return false; }
    if (cvv.length < 3) { err.textContent = 'CVV inválido'; return false; }
    err.textContent = '';
    return true;
}

// ── SIMULAR PAGO ──
function simularPago() {
    if (metodoActual === 'tarjeta' && !validarTarjeta()) return;

    const overlay = document.getElementById('procesandoOverlay');
    overlay.classList.remove('hidden');

    const numAleatorio = 'MM-' + Math.floor(100000 + Math.random() * 900000);

    // Rescatamos el teléfono y dirección del pedido guardado previamente, o usamos valores por defecto
    const telInput = document.getElementById('telefono') ? document.getElementById('telefono').value : (pedidoPendiente.tel || "999999999");
    const dirInput = document.getElementById('direccion') ? document.getElementById('direccion').value : (pedidoPendiente.direccion || "Recojo en local");

    // ¡NUEVO!: Obtenemos al usuario que inició sesión desde la memoria del navegador
    const usuarioLocal = JSON.parse(localStorage.getItem('mamamia_usuario')) || { nombre: "Cliente Anónimo" };

    // Preparamos los datos reales para Spring Boot
    const pedidoDB = {
        numPedido: numAleatorio,
        clienteNombre: usuarioLocal.nombre, // <--- Aquí se envía el nombre real a Railway
        telefono: telInput,
        direccion: dirInput,
        modalidad: pedidoPendiente.modalidad || "recojo",
        metodoPago: metodoActual,
        total: parseFloat(pedidoPendiente.total),
        estado: 0
    };

    // Enviamos el pedido a la base de datos
    fetch('https://pizzeria-mamamia-production-5cf6.up.railway.app/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoDB)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al guardar en BD");
        return response.json();
    })
    .then(data => {
        // Simulamos un tiempo de procesamiento para el pago
        setTimeout(() => {
            overlay.classList.add('hidden');
            const pedidoLocal = { ...pedidoPendiente };
            pedidoLocal.estado = 0;
            pedidoLocal.pagado = true;
            pedidoLocal.metodoPago = metodoActual;
            pedidoLocal.creado = new Date().toISOString();
            pedidoLocal.num = numAleatorio;
            pedidoLocal.userEmail = usuarioLocal.email; // Asociar también el email al pedido local

            // Guardamos el pedido definitivo en el navegador del cliente
            localStorage.setItem('mamamia_pedido', JSON.stringify(pedidoLocal));
            localStorage.removeItem('mamamia_pedido_pendiente');
            localStorage.removeItem('mamamia_cart');
            window.dispatchEvent(new CustomEvent('cartUpdated'));

            // Redirigir al historial de pedidos
            location.href = 'Mipedido.html';
        }, 1500);
    })
    .catch(error => {
        overlay.classList.add('hidden');
        showToast('Error conectando con el servidor', 'error');
    });
}

initResumen();