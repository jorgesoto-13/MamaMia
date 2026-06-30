/* =============================================
   main.js — JS global Mama Mia
   Compartido por todas las páginas
   ============================================= */

// Nav: sombra al hacer scroll
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
}

// Nav: marcar link activo según página actual
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === currentPage);
});

// Badge carrito global — visible en TODAS las páginas
function updateNavCartBadge() {
    const cart = JSON.parse(localStorage.getItem('mamamia_cart') || '[]');
    const total = cart.reduce((s, i) => s + (i.qty || 1), 0);
    const badge = document.getElementById('navCartBadge');
    if (!badge) return;
    if (total > 0) {
        badge.textContent = total;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Actualizar nav según sesión
function updateNavUser() {
    const usuario = JSON.parse(localStorage.getItem('mamamia_usuario') || 'null');
    const btn = document.querySelector('.nav-signin');
    if (!btn) return;

    if (usuario) {
        btn.outerHTML = `
      <div class="nav-user" id="navUser">
        <button class="nav-user-btn" onclick="toggleUserMenu()">
          <span class="nav-user-avatar">${usuario.nombre.charAt(0).toUpperCase()}</span>
          ${usuario.nombre}
          <span class="nav-user-arrow" id="navArrow">▾</span>
        </button>
        <div class="nav-user-dropdown hidden" id="userDropdown">
          <div class="dropdown-header">
            <p class="dropdown-name">${usuario.nombre}</p>
            <p class="dropdown-email">${usuario.email}</p>
          </div>
          <a href="Mipedido.html" class="dropdown-item">📦 Mi pedido</a>
          <a href="perfil.html" class="dropdown-item">👤 Mi perfil</a>
          <a href="ajustes.html" class="dropdown-item">⚙️ Ajustes</a>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item logout" onclick="cerrarSesion()">🚪 Cerrar sesión</button>
        </div>
      </div>
    `;
    }
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    const arrow = document.getElementById('navArrow');
    if (!dropdown) return;
    dropdown.classList.toggle('hidden');
    const isOpen = !dropdown.classList.contains('hidden');
    arrow.style.transform = isOpen ? 'rotate(180deg)' : '';
}

function cerrarSesion() {
    if (confirm('¿Cerrar sesión?')) {
        localStorage.removeItem('mamamia_usuario');
        localStorage.removeItem('mamamia_pedido');
        localStorage.removeItem('mamamia_pedido_pendiente');
        location.href = 'index.html';
    }
}

// Cerrar dropdown al hacer clic fuera
document.addEventListener('click', (e) => {
    const user = document.getElementById('navUser');
    if (user && !user.contains(e.target)) {
        const dropdown = document.getElementById('userDropdown');
        const arrow = document.getElementById('navArrow');
        if (dropdown) dropdown.classList.add('hidden');
        if (arrow) arrow.style.transform = '';
    }
});

updateNavUser();

// Ejecutar al cargar y escuchar cambios de localStorage (otras pestañas)
updateNavCartBadge();
window.addEventListener('storage', updateNavCartBadge);
window.addEventListener('cartUpdated', updateNavCartBadge);
