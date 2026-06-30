/* =============================================
   perfil.js — Mi Perfil
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
    // Sidebar
    document.getElementById('perfilAvatar').textContent = usuario.nombre.charAt(0).toUpperCase();
    document.getElementById('perfilNombre').textContent = usuario.nombre;
    document.getElementById('perfilEmail').textContent = usuario.email;

    // Cargar datos guardados
    const datos = JSON.parse(localStorage.getItem(`mamamia_perfil_${usuario.email}`) || '{}');
    if (datos.nombre) document.getElementById('fNombre').value = datos.nombre;
    if (datos.apellido) document.getElementById('fApellido').value = datos.apellido;
    if (datos.telefono) document.getElementById('fTelefono').value = datos.telefono;
    if (datos.nacimiento) document.getElementById('fNacimiento').value = datos.nacimiento;
    document.getElementById('fEmail').value = usuario.email;

    // Stats del historial
    const historial = JSON.parse(localStorage.getItem(`mamamia_historial_${usuario.email}`) || '[]');
    const totalGastado = historial.reduce((s, p) => s + parseFloat(p.total || 0), 0);
    document.getElementById('statTotalPedidos').textContent = historial.length;
    document.getElementById('statTotalGastado').textContent = `S/ ${totalGastado.toFixed(2)}`;

    // Pizza favorita
    const conteo = {};
    historial.forEach(p => (p.items || []).forEach(i => { conteo[i.name] = (conteo[i.name] || 0) + i.qty; }));
    const favorita = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('statFavorita').textContent = favorita
        ? favorita[0].split(' ')[0]
        : '—';

    // Foto de perfil guardada
    const foto = localStorage.getItem(`mamamia_foto_${usuario.email}`);
    if (foto) {
        const av = document.getElementById('perfilAvatar');
        av.innerHTML = `<img src="${foto}" alt="foto"/>`;
    }

    renderDirecciones();
}

// ── TABS ──
function showTab(id) {
    document.querySelectorAll('.perfil-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.perfil-nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(`tab-${id}`).classList.add('active');
    document.querySelectorAll('.perfil-nav-item').forEach(n => {
        if (n.getAttribute('onclick')?.includes(id)) n.classList.add('active');
    });
}

// ── GUARDAR DATOS ──
function guardarDatos() {
    const datos = {
        nombre: document.getElementById('fNombre').value.trim(),
        apellido: document.getElementById('fApellido').value.trim(),
        telefono: document.getElementById('fTelefono').value.trim(),
        nacimiento: document.getElementById('fNacimiento').value,
    };
    localStorage.setItem(`mamamia_perfil_${usuario.email}`, JSON.stringify(datos));

    // Actualizar nombre en sesión
    if (datos.nombre) {
        usuario.nombre = datos.nombre;
        localStorage.setItem('mamamia_usuario', JSON.stringify(usuario));
        document.getElementById('perfilNombre').textContent = datos.nombre;
    }
    showToast('✅ Datos guardados correctamente');
}

// ── CAMBIAR FOTO ──
function cambiarFoto(input) {
    const file = input.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { showToast('❌ La imagen no debe superar 3MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        localStorage.setItem(`mamamia_foto_${usuario.email}`, e.target.result);
        const av = document.getElementById('perfilAvatar');
        av.innerHTML = `<img src="${e.target.result}" alt="foto"/>`;
        showToast('✅ Foto actualizada');
    };
    reader.readAsDataURL(file);
}

// ── CAMBIAR CONTRASEÑA ──
function cambiarPassword() {
    const actual = document.getElementById('passActual').value;
    const nueva = document.getElementById('passNueva').value;
    const confirm = document.getElementById('passConfirm').value;
    const err = document.getElementById('passErr');

    if (!actual) { err.textContent = 'Ingresa tu contraseña actual'; return; }
    if (nueva.length < 6) { err.textContent = 'Mínimo 6 caracteres'; return; }
    if (nueva !== confirm) { err.textContent = 'Las contraseñas no coinciden'; return; }
    err.textContent = '';

    showToast('✅ Contraseña actualizada correctamente');
    ['passActual', 'passNueva', 'passConfirm'].forEach(id => document.getElementById(id).value = '');
}

// ── DIRECCIONES ──
function getDirecciones() {
    return JSON.parse(localStorage.getItem(`mamamia_dirs_${usuario.email}`) || '[]');
}

function renderDirecciones() {
    const dirs = getDirecciones();
    const container = document.getElementById('direccionesList');
    if (!container) return;
    if (dirs.length === 0) {
        container.innerHTML = `<p style="font-size:0.84rem;color:var(--light-gray);padding:0.5rem 0">No tienes direcciones guardadas.</p>`;
        return;
    }
    container.innerHTML = dirs.map((d, i) => `
    <div class="dir-item">
      <span class="dir-icon">📍</span>
      <span class="dir-text">${d}</span>
      <button class="dir-delete" onclick="eliminarDir(${i})">🗑</button>
    </div>`).join('');
}

function agregarDireccion() {
    const dir = prompt('Ingresa la dirección:');
    if (!dir?.trim()) return;
    const dirs = getDirecciones();
    dirs.push(dir.trim());
    localStorage.setItem(`mamamia_dirs_${usuario.email}`, JSON.stringify(dirs));
    renderDirecciones();
    showToast('✅ Dirección agregada');
}

function eliminarDir(i) {
    const dirs = getDirecciones();
    dirs.splice(i, 1);
    localStorage.setItem(`mamamia_dirs_${usuario.email}`, JSON.stringify(dirs));
    renderDirecciones();
    showToast('🗑 Dirección eliminada');
}

init();