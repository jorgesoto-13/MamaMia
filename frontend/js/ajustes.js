/* =============================================
   ajustes.js — Ajustes de cuenta
   ============================================= */

// Proteger página
const usuario = JSON.parse(localStorage.getItem('mamamia_usuario') || 'null');
if (!usuario) { location.href = 'login.html'; }

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── INICIALIZAR ──
function init() {
    document.getElementById('perfilAvatar').textContent = usuario.nombre.charAt(0).toUpperCase();
    document.getElementById('perfilNombre').textContent = usuario.nombre;
    document.getElementById('perfilEmail').textContent = usuario.email;

    // Cargar ajustes guardados
    const ajustes = JSON.parse(localStorage.getItem(`mamamia_ajustes_${usuario.email}`) || '{}');

    if (ajustes.togPedido === false) document.getElementById('togPedido').classList.remove('active');
    if (ajustes.togPromo === false) document.getElementById('togPromo').classList.remove('active');
    if (ajustes.togRecord === true) document.getElementById('togRecord').classList.add('active');
    if (ajustes.togOscuro === true) document.getElementById('togOscuro').classList.add('active');
    if (ajustes.togDatos === false) document.getElementById('togDatos').classList.remove('active');
    if (ajustes.togHistorial === true) document.getElementById('togHistorial').classList.add('active');

    // Aplicar modo oscuro si estaba activo
    if (ajustes.togOscuro) document.body.classList.add('dark-mode');
}

// ── MODO OSCURO ──
function toggleDarkMode() {
    const tog = document.getElementById('togOscuro');
    tog.classList.toggle('active');
    document.body.classList.toggle('dark-mode', tog.classList.contains('active'));
}

// ── GUARDAR AJUSTES ──
function guardarAjustes() {
    const ajustes = {
        togPedido: document.getElementById('togPedido').classList.contains('active'),
        togPromo: document.getElementById('togPromo').classList.contains('active'),
        togRecord: document.getElementById('togRecord').classList.contains('active'),
        togOscuro: document.getElementById('togOscuro').classList.contains('active'),
        togDatos: document.getElementById('togDatos').classList.contains('active'),
        togHistorial: document.getElementById('togHistorial').classList.contains('active'),
    };
    localStorage.setItem(`mamamia_ajustes_${usuario.email}`, JSON.stringify(ajustes));
    showToast('✅ Ajustes guardados correctamente');
}

// ── ZONA DE PELIGRO ──
function cerrarTodo() {
    if (!confirm('¿Cerrar sesión en todos los dispositivos?')) return;
    localStorage.removeItem('mamamia_usuario');
    localStorage.removeItem('mamamia_pedido');
    localStorage.removeItem('mamamia_pedido_pendiente');
    location.href = 'login.html';
}

function eliminarCuenta() {
    if (!confirm('¿Estás seguro? Esta acción es irreversible y eliminará todos tus datos.')) return;
    if (!confirm('Última confirmación: ¿eliminar cuenta permanentemente?')) return;

    // Limpiar todos los datos del usuario
    const keys = Object.keys(localStorage).filter(k => k.includes(usuario.email));
    keys.forEach(k => localStorage.removeItem(k));
    localStorage.removeItem('mamamia_usuario');
    localStorage.removeItem('mamamia_pedido');
    localStorage.removeItem('mamamia_cart');

    showToast('Cuenta eliminada. Hasta pronto.');
    setTimeout(() => location.href = 'index.html', 1500);
}

init();