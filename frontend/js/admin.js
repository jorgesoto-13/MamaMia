/* =============================================
   admin.js — Panel Administrativo Mama Mia
   ============================================= */

// ── DATOS DE DEMO ──
const PRODUCTOS = [
    { id: 1, nombre: 'Margherita Classica', cat: 'clasicas', desc: 'Salsa San Marzano, mozzarella fior di latte y albahaca fresca.', precios: { personal: 28.90, mediana: 33.90, familiar: 39.90 }, estado: 'activo', img: 'img/pizza_margherita.png', vendidos: 48 },
    { id: 2, nombre: 'Diávola Ardiente', cat: 'especiales', desc: 'Pepperoni premium, jalapeños y salsa arrabiata.', precios: { personal: 34.90, mediana: 39.90, familiar: 45.90 }, estado: 'activo', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', vendidos: 35 },
    { id: 3, nombre: 'Verdure di Stagione', cat: 'vegetarianas', desc: 'Calabacín, pimientos, berenjenas y tomates cherry.', precios: { personal: 30.90, mediana: 35.90, familiar: 41.90 }, estado: 'activo', img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80', vendidos: 22 },
    { id: 4, nombre: 'Pizza Pesto y Pollo', cat: 'gourmet', desc: 'Base de salsa pesto genovés artesanal, mozzarella, pollo a la parrilla y tomates cherry.', precios: { personal: 42.90, mediana: 47.90, familiar: 54.90 }, estado: 'activo', img: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80', vendidos: 18 },
    { id: 5, nombre: 'Quattro Stagioni', cat: 'clasicas', desc: 'Champiñones, aceitunas, alcachofas y jamón cocido.', precios: { personal: 38.90, mediana: 43.90, familiar: 49.90 }, estado: 'activo', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80', vendidos: 14 },
    { id: 6, nombre: 'Tartufo Nero', cat: 'gourmet', desc: 'Crema de trufa negra, mozzarella de búfala y porcini.', precios: { personal: 46.90, mediana: 51.90, familiar: 58.90 }, estado: 'inactivo', img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80', vendidos: 9 },
];

const PEDIDOS = [
    { num: 'MM-183421', cliente: 'Ana Torres', items: 'Margherita x1', modalidad: 'recojo', pago: 'yape', total: 33.90, estado: 1, hora: '10:32' },
    { num: 'MM-183420', cliente: 'Carlos Ríos', items: 'Diávola x2', modalidad: 'delivery', pago: 'tarjeta', total: 89.80, estado: 2, hora: '10:18' },
    { num: 'MM-183419', cliente: 'Lucía Mamani', items: 'Verdure x1, Pepsi x1', modalidad: 'recojo', pago: 'plin', total: 35.90, estado: 3, hora: '09:55' },
    { num: 'MM-183418', cliente: 'Pedro Quispe', items: 'Quattro x1', modalidad: 'recojo', pago: 'yape', total: 43.90, estado: 4, hora: '09:30' },
    { num: 'MM-183417', cliente: 'María Flores', items: 'Prosciutto x1', modalidad: 'delivery', pago: 'tarjeta', total: 54.90, estado: 4, hora: '09:10' },
    { num: 'MM-183416', cliente: 'José Ramos', items: 'Tartufo x1', modalidad: 'recojo', pago: 'yape', total: 51.90, estado: 4, hora: '08:48' },
];

const USUARIOS = [
    { nombre: 'Ana Torres', email: 'ana@gmail.com', pedidos: 5, registro: '15/03/2026', estado: 'activo' },
    { nombre: 'Carlos Ríos', email: 'carlos@gmail.com', pedidos: 12, registro: '02/01/2026', estado: 'activo' },
    { nombre: 'Lucía Mamani', email: 'lucia@gmail.com', pedidos: 3, registro: '20/04/2026', estado: 'activo' },
    { nombre: 'Pedro Quispe', email: 'pedro@gmail.com', pedidos: 8, registro: '10/02/2026', estado: 'activo' },
    { nombre: 'María Flores', email: 'maria@gmail.com', pedidos: 1, registro: '25/04/2026', estado: 'inactivo' },
];

const ESTADOS_LABELS = [
    { label: 'Confirmado', icon: '✅', cls: 'confirmado' },
    { label: 'Preparando', icon: '👨‍🍳', cls: 'preparando' },
    { label: 'En el horno', icon: '🔥', cls: 'horno' },
    { label: 'Listo', icon: '🏪', cls: 'listo' },
    { label: 'Entregado', icon: '🎉', cls: 'entregado' },
];

const PAGO_LABELS = { yape: '📱 Yape', plin: '💜 Plin', tarjeta: '💳 Tarjeta' };

let productosFiltrados = [...PRODUCTOS];
let pedidosFiltrados = [...PEDIDOS];
let usuariosFiltrados = [...USUARIOS];
let pedidoEditando = null;
let productoEditando = null;

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
    // Fecha topbar
    document.getElementById('topbarDate').textContent =
        new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });

    // Badge pedidos pendientes
    const pendientes = PEDIDOS.filter(p => p.estado < 3).length;
    document.getElementById('badgePedidos').textContent = pendientes;

    renderDashboard();
    renderPedidos();
    renderProductos();
    renderUsuarios();
    renderReportes();
});

// ── NAVEGACIÓN ──
function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`sec-${id}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => {
        if (n.getAttribute('onclick')?.includes(id)) n.classList.add('active');
    });
    const titles = { dashboard: 'Dashboard', pedidos: 'Pedidos', productos: 'Productos', usuarios: 'Usuarios', reportes: 'Reportes', configuracion: 'Configuración' };
    document.getElementById('topbarTitle').textContent = titles[id] || id;
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// ── DASHBOARD ──
function renderDashboard() {
    // Pedidos recientes
    const tbody = document.getElementById('dashPedidos');
    tbody.innerHTML = PEDIDOS.slice(0, 5).map(p => `
    <tr>
      <td><strong>${p.num}</strong></td>
      <td>${p.cliente}</td>
      <td>S/ ${p.total.toFixed(2)}</td>
      <td><span class="badge ${ESTADOS_LABELS[p.estado].cls}">${ESTADOS_LABELS[p.estado].icon} ${ESTADOS_LABELS[p.estado].label}</span></td>
    </tr>`).join('');

    // Ranking pizzas
    const ranking = document.getElementById('dashRanking');
    const sorted = [...PRODUCTOS].sort((a, b) => b.vendidos - a.vendidos).slice(0, 4);
    const max = sorted[0].vendidos;
    ranking.innerHTML = sorted.map((p, i) => `
    <div class="rank-item">
      <span class="rank-num">${i + 1}</span>
      <div class="rank-bar-wrap">
        <p class="rank-name">${p.nombre}</p>
        <div class="rank-bar" style="width:${(p.vendidos / max * 100)}%"></div>
      </div>
      <span class="rank-count">${p.vendidos} pedidos</span>
    </div>`).join('');

    // Métodos de pago
    const pagos = { yape: 5, plin: 3, tarjeta: 4 };
    const totalPagos = Object.values(pagos).reduce((a, b) => a + b, 0);
    const colores = { yape: '#16A34A', plin: '#7C3AED', tarjeta: '#1D4ED8' };
    document.getElementById('pagoBars').innerHTML = Object.entries(pagos).map(([k, v]) => `
    <div class="pago-bar-item">
      <span class="pago-bar-label">${PAGO_LABELS[k]}</span>
      <div class="pago-bar-track">
        <div class="pago-bar-fill" style="width:${v / totalPagos * 100}%;background:${colores[k]}"></div>
      </div>
      <span class="pago-bar-pct">${Math.round(v / totalPagos * 100)}%</span>
    </div>`).join('');
}

// ── PEDIDOS ──
function renderPedidos(lista = pedidosFiltrados) {
    document.getElementById('bodyPedidos').innerHTML = lista.map((p, i) => `
    <tr>
      <td><strong>${p.num}</strong><br><span style="font-size:0.72rem;color:var(--light-gray)">${p.hora}</span></td>
      <td>${p.cliente}</td>
      <td style="font-size:0.78rem;color:var(--gray)">${p.items}</td>
      <td>${p.modalidad === 'delivery' ? '🛵 Delivery' : '🏪 Recojo'}</td>
      <td>${PAGO_LABELS[p.pago]}</td>
      <td><strong>S/ ${p.total.toFixed(2)}</strong></td>
      <td><span class="badge ${ESTADOS_LABELS[p.estado].cls}">${ESTADOS_LABELS[p.estado].icon} ${ESTADOS_LABELS[p.estado].label}</span></td>
      <td>
        <button class="action-btn" onclick="openEstadoModal(${i})" title="Cambiar estado">✏️</button>
        <button class="action-btn" title="Ver detalle">👁</button>
        <button class="action-btn danger" title="Eliminar">🗑</button>
      </td>
    </tr>`).join('');
}

function filterPedidos(estado, btn) {
    document.querySelectorAll('#sec-pedidos .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const estadoMap = { todos: -1, pendiente: 0, preparando: 1, listo: 3, entregado: 4 };
    const idx = estadoMap[estado];
    pedidosFiltrados = idx === -1 ? [...PEDIDOS] : PEDIDOS.filter(p => p.estado === idx);
    renderPedidos();
}

function searchPedidos(q) {
    const term = q.toLowerCase();
    pedidosFiltrados = PEDIDOS.filter(p =>
        p.num.toLowerCase().includes(term) || p.cliente.toLowerCase().includes(term)
    );
    renderPedidos();
}

// Modal estado
function openEstadoModal(idx) {
    pedidoEditando = idx;
    const p = pedidosFiltrados[idx];
    document.getElementById('modalPedidoNum').textContent = `Pedido ${p.num} — ${p.cliente}`;
    document.getElementById('estadoOptions').innerHTML = ESTADOS_LABELS.map((e, i) => `
    <button class="estado-opt ${p.estado === i ? 'current' : ''}" onclick="cambiarEstado(${idx},${i})">
      ${e.icon} ${e.label}
    </button>`).join('');
    document.getElementById('modalEstado').classList.remove('hidden');
}

function closeEstadoModal() {
    document.getElementById('modalEstado').classList.add('hidden');
}

function cambiarEstado(pedidoIdx, nuevoEstado) {
    pedidosFiltrados[pedidoIdx].estado = nuevoEstado;
    const realIdx = PEDIDOS.findIndex(p => p.num === pedidosFiltrados[pedidoIdx].num);
    if (realIdx !== -1) PEDIDOS[realIdx].estado = nuevoEstado;
    closeEstadoModal();
    renderPedidos();
    renderDashboard();
    showToast(`✅ Estado actualizado a: ${ESTADOS_LABELS[nuevoEstado].label}`);
}

// ── PRODUCTOS ──
function renderProductos(lista = productosFiltrados) {
    document.getElementById('productosGrid').innerHTML = lista.map((p, i) => `
    <div class="producto-card">
      <img class="producto-img" src="${p.img}" alt="${p.nombre}"/>
      <div class="producto-body">
        <p class="producto-cat">${p.cat}</p>
        <h3 class="producto-name">${p.nombre}</h3>
        <p class="producto-desc">${p.desc}</p>
        <div class="producto-precios">
          <span class="precio-tag">Personal S/${p.precios.personal}</span>
          <span class="precio-tag">Med S/${p.precios.mediana}</span>
          <span class="precio-tag">Fam S/${p.precios.familiar}</span>
        </div>
        <div style="margin-bottom:0.6rem">
          <span class="badge ${p.estado}">${p.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}</span>
        </div>
        <div class="producto-actions">
          <button class="action-btn" onclick="openProductoModal(${i})">✏️ Editar</button>
          <button class="action-btn danger" onclick="eliminarProducto(${i})">🗑 Eliminar</button>
        </div>
      </div>
    </div>`).join('');
}

function filterProductos(cat, btn) {
    document.querySelectorAll('#sec-productos .filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    productosFiltrados = cat === 'todos' ? [...PRODUCTOS] : PRODUCTOS.filter(p => p.cat === cat);
    renderProductos();
}

function previewImagen(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
        showToast('❌ La imagen no debe superar 5MB');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('imgPreview');
        const placeholder = document.getElementById('imgPlaceholder');
        preview.src = e.target.result;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function openProductoModal(idx = null) {
    productoEditando = idx;
    const title = document.getElementById('modalProductoTitle');
    // Al abrir modal nuevo (idx === null), resetear imagen
    document.getElementById('imgPreview').style.display = 'none';
    document.getElementById('imgPlaceholder').style.display = 'flex';
    document.getElementById('imgPreview').src = '';
    document.getElementById('pImagen').value = '';
    if (idx !== null) {
        const p = productosFiltrados[idx];
        title.textContent = 'Editar pizza';
        document.getElementById('pNombre').value = p.nombre;
        document.getElementById('pCategoria').value = p.cat;
        document.getElementById('pDesc').value = p.desc;
        document.getElementById('pPersonal').value = p.precios.personal;
        document.getElementById('pMediana').value = p.precios.mediana;
        document.getElementById('pFamiliar').value = p.precios.familiar;
        document.getElementById('pEstado').value = p.estado;
        // Mostrar imagen actual del producto
        const preview = document.getElementById('imgPreview');
        const placeholder = document.getElementById('imgPlaceholder');
        preview.src = p.img;
        preview.style.display = 'block';
        placeholder.style.display = 'none';

    } else {
        title.textContent = 'Agregar pizza';
        ['pNombre', 'pDesc', 'pPersonal', 'pMediana', 'pFamiliar'].forEach(id => document.getElementById(id).value = '');
    }
    document.getElementById('modalProducto').classList.remove('hidden');
}

function closeProductoModal() { document.getElementById('modalProducto').classList.add('hidden'); }

function saveProducto() {
    const nombre = document.getElementById('pNombre').value.trim();
    if (!nombre) { showToast('❌ El nombre es requerido'); return; }
    closeProductoModal();
    renderProductos();
    showToast(productoEditando !== null ? '✅ Pizza actualizada' : '✅ Pizza agregada');
}

function eliminarProducto(idx) {
    if (!confirm(`¿Eliminar "${productosFiltrados[idx].nombre}"?`)) return;
    productosFiltrados.splice(idx, 1);
    renderProductos();
    showToast('🗑 Producto eliminado');
}

// ── USUARIOS ──
function renderUsuarios(lista = usuariosFiltrados) {
    document.getElementById('bodyUsuarios').innerHTML = lista.map(u => `
    <tr>
      <td><div class="user-avatar">${u.nombre.charAt(0)}</div></td>
      <td><strong>${u.nombre}</strong></td>
      <td style="color:var(--gray);font-size:0.8rem">${u.email}</td>
      <td>${u.pedidos}</td>
      <td style="font-size:0.78rem;color:var(--gray)">${u.registro}</td>
      <td><span class="badge ${u.estado}">${u.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}</span></td>
      <td>
        <button class="action-btn" title="Ver perfil">👁</button>
        <button class="action-btn danger" title="Eliminar">🗑</button>
      </td>
    </tr>`).join('');
}

function searchUsuarios(q) {
    const term = q.toLowerCase();
    usuariosFiltrados = USUARIOS.filter(u =>
        u.nombre.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    renderUsuarios();
}

function openUsuarioModal() { showToast('⚙️ Funcionalidad próximamente'); }

// ── REPORTES ──
function renderReportes() {
    // Barras semanales
    const dias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const ventas = [180, 240, 195, 310, 280, 420, 390];
    const maxVenta = Math.max(...ventas);
    document.getElementById('chartSemana').innerHTML = dias.map((d, i) => `
    <div class="bar-col">
      <span class="bar-val">S/${ventas[i]}</span>
      <div class="bar-fill" style="height:${ventas[i] / maxVenta * 130}px;background:${i === 5 || i === 6 ? 'var(--red)' : '#FBBFBB'}"></div>
      <span class="bar-label">${d}</span>
    </div>`).join('');

    // Donut categorías
    const cats = [
        { label: 'Clásicas', pct: 42, color: '#C8372D' },
        { label: 'Especiales', pct: 28, color: '#D97706' },
        { label: 'Gourmet', pct: 18, color: '#7C3AED' },
        { label: 'Vegetarianas', pct: 12, color: '#16A34A' },
    ];
    let offset = 0;
    const r = 50; const circ = 2 * Math.PI * r;
    const segments = cats.map(c => {
        const dash = (c.pct / 100) * circ;
        const seg = `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${c.color}" stroke-width="18"
      stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${-offset}" transform="rotate(-90 60 60)"/>`;
        offset += dash; return seg;
    }).join('');

    document.getElementById('donutChart').innerHTML = `
    <svg class="donut-svg" width="120" height="120" viewBox="0 0 120 120">${segments}</svg>
    <div class="donut-legend">
      ${cats.map(c => `<div class="legend-item"><div class="legend-dot" style="background:${c.color}"></div>${c.label} <strong>${c.pct}%</strong></div>`).join('')}
    </div>`;

    // Resumen financiero
    document.getElementById('resumenFin').innerHTML = `
    <div class="fin-item"><p class="fin-label">Ingresos del mes</p><p class="fin-val green">S/ 8,420</p></div>
    <div class="fin-item"><p class="fin-label">Total pedidos</p><p class="fin-val">186</p></div>
    <div class="fin-item"><p class="fin-label">Ticket promedio</p><p class="fin-val">S/ 45.27</p></div>
    <div class="fin-item"><p class="fin-label">Pedidos cancelados</p><p class="fin-val red">3</p></div>`;
}

// ── CONFIGURACIÓN ──
function toggleAbierto() { document.getElementById('toggleAbierto').classList.toggle('active'); }
function toggleDelivery() { document.getElementById('toggleDelivery').classList.toggle('active'); }
function saveConfig() { showToast('✅ Configuración guardada'); }

// ── TOAST ──
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}