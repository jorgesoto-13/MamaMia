/* =============================================
   menu.js — Lógica Dinámica Conectada a Railway
   ============================================= */

// ── 1. ESTADO GLOBAL ──
let pizzas = {};
let currentPizza = null;
let selectedSize = { size: 'mediana', extra: 0 };
let qty = 1;
let cart = JSON.parse(localStorage.getItem('mamamia_cart') || '[]');

// ── 2. SCROLL REVEAL (Animaciones) ──
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            ro.unobserve(e.target);
        }
    });
}, { threshold: 0.1 });

// ── 3. CARGA DINÁMICA DESDE LA BASE DE DATOS (RAILWAY) ──
// ── 3. CARGA DINÁMICA DESDE LA BASE DE DATOS (RAILWAY) ──
async function cargarMenuDinamicamente() {
    try {
        // Hacemos la petición a tu backend en la nube
        const response = await fetch('https://pizzeria-mamamia-production-5cf6.up.railway.app/api/productos');
        if (!response.ok) throw new Error('Falló la conexión');
        const productosBD = await response.json();

        const grid = document.getElementById('menuGrid');
        if (!grid) return;
        grid.innerHTML = ''; // Limpiar la grilla

        productosBD.forEach(producto => {
            if (producto.estado !== 'activo') return;

            // Determinar color de etiqueta según la categoría
            let color = '#D4A843';
            if (producto.categoria === 'Especiales') color = '#C8372D';
            if (producto.categoria === 'Vegetarianas') color = '#4A9E6E';
            if (producto.categoria === 'Gourmet') color = '#8B5CF6';

            // Guardar en el diccionario local para usarlo en el modal
            pizzas[producto.id] = {
                id: producto.id,
                name: producto.nombre,
                desc: producto.descripcion,
                cat: producto.categoria,
                catColor: color,
                basePrice: producto.precioPersonal,
                medianaPrice: producto.precioMediana,
                familiarPrice: producto.precioFamiliar,
                img: producto.imagenUrl || 'img/pizza_margherita.png',
                ingredients: ['Queso Mozzarella', 'Salsa de Tomate'],
                related: []
            };

            // Construir la tarjeta HTML con el diseño EXACTO de JC
            const card = document.createElement('div');
            card.className = 'pizza-card';
            card.dataset.cat = producto.categoria.toLowerCase(); // Para que funcionen los botones de filtro

            card.innerHTML = `
              <div class="pizza-img-wrap">
                <img src="${pizzas[producto.id].img}" alt="${producto.nombre}" loading="lazy"/>
                <span class="pizza-cat" style="background:${color}">${producto.categoria}</span>
              </div>
              <div class="pizza-body">
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="pizza-foot">
                  <div>
                    <div class="pizza-from">Desde</div>
                    <div class="pizza-price">S/ ${producto.precioPersonal.toFixed(2)}</div>
                  </div>
                  <button class="btn-ver" onclick="openDetail('${producto.id}')">Ver más →</button>
                </div>
              </div>
            `;
            grid.appendChild(card);

            // Activar animación al hacer scroll
            ro.observe(card);
        });

    } catch (error) {
        console.error("Error cargando pizzas:", error);
        showToast('Error al cargar el menú de la nube', 'error');
    }
}

// Cargar pizzas en cuanto se abra la página
document.addEventListener('DOMContentLoaded', cargarMenuDinamicamente);

// ── 4. FILTROS POR CATEGORÍA ──
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.cat;
        document.querySelectorAll('.pizza-card').forEach(card => {
            if (cat === 'todas' || card.dataset.cat === cat) {
                card.classList.remove('hidden');
                card.style.animation = 'none';
                requestAnimationFrame(() => {
                    card.style.animation = '';
                    card.classList.remove('visible');
                    setTimeout(() => card.classList.add('visible'), 50);
                });
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ── 5. ABRIR MODAL ──
function openDetail(id) {
    currentPizza = pizzas[id];
    if (!currentPizza) return;

    qty = 1;

    // Rellenar datos visuales
    document.getElementById('modalImg').src = currentPizza.img;
    document.getElementById('modalImg').alt = currentPizza.name;
    document.getElementById('modalName').textContent = currentPizza.name;
    document.getElementById('modalDesc').textContent = currentPizza.desc;

    const cat = document.getElementById('modalCat');
    cat.textContent = currentPizza.cat;
    cat.style.background = currentPizza.catColor;

    // Ingredientes
    const tagList = document.getElementById('modalIngredients');
    tagList.innerHTML = currentPizza.ingredients.map(i => `<span class="tag">${i}</span>`).join('');

    // Precios dinámicos desde la Base de Datos
    document.getElementById('pricePersonal').textContent = `S/ ${currentPizza.basePrice.toFixed(2)}`;
    document.getElementById('priceMediana').textContent = `S/ ${currentPizza.medianaPrice.toFixed(2)}`;
    document.getElementById('priceFamiliar').textContent = `S/ ${currentPizza.familiarPrice.toFixed(2)}`;

    // Reset tamaño activo a mediana por defecto
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-size="mediana"]').classList.add('active');

    // Calcular el extra de la mediana para el inicio
    selectedSize = { size: 'mediana', extra: currentPizza.medianaPrice - currentPizza.basePrice };

    // Reset extras y bebidas
    document.querySelectorAll('.extra-item input').forEach(i => i.checked = false);
    document.querySelectorAll('.drink-item input[value="0"]').forEach(i => i.checked = true);

    // Limpiar pizzas relacionadas
    const relGrid = document.getElementById('relatedGrid');
    relGrid.innerHTML = '';

    // Cantidad inicial
    document.getElementById('qtyVal').textContent = '1';
    updateTotal();

    // Abrir overlay animado
    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

// ── 6. CERRAR MODAL ──
function closeDetail(e) {
    if (e.target === document.getElementById('modalOverlay')) closeDetailBtn();
}
function closeDetailBtn() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 380);
    document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailBtn(); });

// ── 7. SELECCIONAR TAMAÑO (Actualizado para Precios Dinámicos) ──
function selectSize(el) {
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');

    const size = el.dataset.size;
    let extraPrecio = 0;

    // Calculamos la diferencia basándonos en los datos reales de la BD
    if (size === 'mediana') extraPrecio = currentPizza.medianaPrice - currentPizza.basePrice;
    if (size === 'familiar') extraPrecio = currentPizza.familiarPrice - currentPizza.basePrice;

    selectedSize = { size: size, extra: extraPrecio };
    updateTotal();
}

// ── 8. CAMBIAR CANTIDAD ──
function changeQty(delta) {
    qty = Math.max(1, qty + delta);
    document.getElementById('qtyVal').textContent = qty;
    updateTotal();
}

// ── 9. CALCULAR TOTAL ──
function updateTotal() {
    if (!currentPizza) return;
    let total = currentPizza.basePrice + selectedSize.extra;

    // Sumar Extras
    document.querySelectorAll('.extra-item input:checked').forEach(i => {
        total += Number(i.dataset.price);
    });

    // Sumar Bebida
    const drink = document.querySelector('.drink-item input:checked');
    if (drink && drink.dataset.price) total += Number(drink.dataset.price);

    total *= qty;
    document.getElementById('totalPrice').textContent = `S/ ${total.toFixed(2)}`;
}

// ── 10. AGREGAR AL CARRITO ──
function addToCart() {
    if (!currentPizza) return;

    // Verificar si el usuario inició sesión
    const usuario = JSON.parse(localStorage.getItem('mamamia_usuario') || 'null');
    if (!usuario) {
        localStorage.setItem('mamamia_redirect', 'menu.html');
        showToast('⚠️ Debes iniciar sesión primero');
        setTimeout(() => location.href = 'login.html', 1200);
        return;
    }

    const extras = [];
    document.querySelectorAll('.extra-item input:checked').forEach(i => {
        extras.push(i.nextElementSibling.nextElementSibling.textContent);
    });

    const drink = document.querySelector('.drink-item input:checked');
    const drinkName = drink && drink.dataset.price ? drink.parentElement.querySelector('.drink-name').textContent : null;

    const item = {
        id: Date.now(),
        name: currentPizza.name,
        size: selectedSize.size,
        extras,
        drink: drinkName,
        qty,
        price: parseFloat(document.getElementById('totalPrice').textContent.replace('S/ ', ''))
    };

    cart.push(item);
    localStorage.setItem('mamamia_cart', JSON.stringify(cart));
    updateCartBadge();
    window.dispatchEvent(new CustomEvent('cartUpdated')); // Notificar al header si lo hay

    // Mostrar Toast nativo del DOM
    const toast = document.getElementById('toast');
    if(toast) {
        toast.textContent = "🍕 Agregado al carrito";
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2800);
    }

    closeDetailBtn();
}

// ── 11. BADGE DEL CARRITO EN LA NAVEGACIÓN ──
function updateCartBadge() {
    const total = cart.reduce((sum, i) => sum + i.qty, 0);
    const badge = document.getElementById('navCartBadge');
    if (!badge) return;
    if (total > 0) {
        badge.textContent = total;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// ── 12. TOAST GENÉRICO ──
function showToast(msg = '🍕 Agregado al carrito', type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// Inicializar el carrito visualmente al cargar
updateCartBadge();