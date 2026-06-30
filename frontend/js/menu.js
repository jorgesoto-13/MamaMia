/* =============================================
   menu.js — Lógica del Menú de Pizzas
   ============================================= */

// ── DATOS DE PIZZAS ──
const pizzas = {
    margherita: {
        name: 'Margherita Classica',
        desc: 'La reina de las pizzas. Salsa de tomate San Marzano, mozzarella fior di latte y albahaca fresca sobre masa napolitana perfecta.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 28.90,
        img: 'img/pizza_margherita.png',
        ingredients: ['Salsa San Marzano', 'Mozzarella fior di latte', 'Albahaca fresca', 'Aceite de oliva extra virgen'],
        related: ['diavola', 'verdure', 'pesto_pollo']
    },
    diavola: {
        name: 'Diávola Ardiente',
        desc: 'Para los amantes del picante. Pepperoni premium, jalapeños frescos y salsa arrabiata sobre base crujiente de horno de leña.',
        cat: 'Especiales', catColor: '#C8372D',
        basePrice: 34.90,
        img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
        ingredients: ['Salsa arrabiata', 'Pepperoni premium', 'Jalapeños frescos', 'Mozzarella', 'Orégano'],
        related: ['margherita', 'quattro', 'tartufo']
    },
    verdure: {
        name: 'Verdure di Stagione',
        desc: 'Un jardín sobre masa. Calabacín, pimientos asados, berenjenas, tomates cherry y rúcula fresca con queso de cabra.',
        cat: 'Vegetarianas', catColor: '#4A9E6E',
        basePrice: 30.90,
        img: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=800&q=80',
        ingredients: ['Calabacín', 'Pimientos asados', 'Berenjenas', 'Tomates cherry', 'Rúcula', 'Queso de cabra'],
        related: ['margherita', 'pesto_pollo', 'quattro']
    },
    pesto_pollo: {
        name: 'Pizza Pesto y Pollo',
        desc: 'Base de salsa pesto genovés artesanal, mozzarella, jugosos trozos de pollo a la parrilla y tomates cherry frescos.',
        cat: 'Gourmet', catColor: '#8B5CF6',
        basePrice: 42.90,
        img: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80',
        ingredients: ['Pesto genovés', 'Mozzarella', 'Pollo a la parrilla', 'Tomates cherry', 'Parmesano'],
        related: ['tartufo', 'margherita', 'siciliana']
    },
    quattro: {
        name: 'Quattro Stagioni',
        desc: 'Las cuatro estaciones en una pizza. Champiñones, aceitunas negras, alcachofas y jamón cocido, cada ingrediente en su sección.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 38.90,
        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        ingredients: ['Champiñones', 'Aceitunas negras', 'Alcachofas', 'Jamón cocido', 'Mozzarella'],
        related: ['margherita', 'verdure', 'pesto_pollo']
    },
    tartufo: {
        name: 'Tartufo Nero',
        desc: 'La pizza más exclusiva de la casa. Base de crema de trufa negra, mozzarella de búfala, champiñones porcini y virutas de trufa.',
        cat: 'Gourmet', catColor: '#8B5CF6',
        basePrice: 46.90,
        img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=800&q=80',
        ingredients: ['Crema de trufa negra', 'Mozzarella de búfala', 'Porcini', 'Virutas de trufa', 'Aceite de trufa'],
        related: ['pesto_pollo', 'diavola', 'quattro']
    },
    americana: {
        name: 'Americana Clásica',
        desc: 'La favorita de los niños. Queso mozzarella fundido y abundante jamón inglés sobre nuestra base tradicional.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 25.90,
        img: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Jamón inglés', 'Orégano'],
        related: ['hawaiana', 'margherita', 'pepperoni']
    },
    hawaiana: {
        name: 'Hawaiana',
        desc: 'Un clásico tropical. Jamón inglés y trozos de piña fresca asada para un toque dulce perfecto.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 28.90,
        img: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Jamón inglés', 'Piña asada'],
        related: ['americana', 'suprema', 'pepperoni']
    },
    carnivora: {
        name: 'Carnívora',
        desc: 'Para los amantes de la carne. Pepperoni, jamón, salchicha italiana, tocino y carne molida.',
        cat: 'Especiales', catColor: '#C8372D',
        basePrice: 38.90,
        img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Pepperoni', 'Jamón', 'Tocino', 'Salchicha'],
        related: ['diavola', 'suprema', 'alemana']
    },
    suprema: {
        name: 'Suprema',
        desc: 'La combinación perfecta. Pepperoni, salchicha, champiñones, cebolla roja, pimientos y aceitunas negras.',
        cat: 'Especiales', catColor: '#C8372D',
        basePrice: 39.90,
        img: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80',
        ingredients: ['Pepperoni', 'Salchicha', 'Champiñones', 'Pimientos', 'Cebolla roja', 'Aceitunas'],
        related: ['carnivora', 'quattro', 'continental']
    },
    napolitana: {
        name: 'Auténtica Napolitana',
        desc: 'Simple y deliciosa. Tomate en rodajas frescas, abundante ajo, orégano y un toque de anchoas.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 26.90,
        img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
        ingredients: ['Tomates frescos', 'Ajo', 'Orégano', 'Anchoas', 'Aceite de oliva'],
        related: ['margherita', 'siciliana', 'verdure']
    },
    siciliana: {
        name: 'Siciliana',
        desc: 'Sabor del sur de Italia. Alcaparras, anchoas, aceitunas negras y un toque de ají sobre base roja.',
        cat: 'Gourmet', catColor: '#8B5CF6',
        basePrice: 35.90,
        img: 'https://images.unsplash.com/photo-1552539618-7eec9b4d1796?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Alcaparras', 'Anchoas', 'Aceitunas negras', 'Ají seco'],
        related: ['napolitana', 'pesto_pollo', 'tartufo']
    },
    pepperoni: {
        name: 'Pepperoni Lover',
        desc: 'Doble porción de pepperoni premium americano sobre una capa generosa de queso mozzarella.',
        cat: 'Clásicas', catColor: '#D4A843',
        basePrice: 29.90,
        img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Doble Pepperoni', 'Orégano'],
        related: ['americana', 'carnivora', 'diavola']
    },
    alemana: {
        name: 'Alemana',
        desc: 'Un sabor robusto. Salchicha blanca, tocino crujiente y cebolla blanca sobre queso fundido.',
        cat: 'Especiales', catColor: '#C8372D',
        basePrice: 36.90,
        img: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Salchicha blanca', 'Tocino', 'Cebolla'],
        related: ['carnivora', 'quattro', 'suprema']
    },
    continental: {
        name: 'Continental',
        desc: 'Fresca y variada. Champiñones, cebolla, pimiento verde, aceitunas y trozos de tomate fresco.',
        cat: 'Vegetarianas', catColor: '#4A9E6E',
        basePrice: 32.90,
        img: 'https://images.unsplash.com/photo-1588315029754-2dd089d39a1a?w=800&q=80',
        ingredients: ['Salsa de tomate', 'Mozzarella', 'Champiñones', 'Cebolla', 'Pimiento', 'Aceitunas'],
        related: ['verdure', 'quattro', 'suprema']
    },
    cuatroquesos: {
        name: 'Cuatro Quesos',
        desc: 'Una explosión láctea. Mozzarella, Gorgonzola, Parmesano y queso Provolone derretidos a la perfección.',
        cat: 'Gourmet', catColor: '#8B5CF6',
        basePrice: 40.90,
        img: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=800&q=80',
        ingredients: ['Base blanca', 'Mozzarella', 'Gorgonzola', 'Parmesano', 'Provolone'],
        related: ['tartufo', 'pesto_pollo', 'siciliana']
    }
};

// ── ESTADO ──
let currentPizza = null;
let selectedSize = { size: 'mediana', extra: 5 };
let qty = 1;
let cart = JSON.parse(localStorage.getItem('mamamia_cart') || '[]');

// ── SCROLL REVEAL CARDS ──
const cards = document.querySelectorAll('.pizza-card');
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.1 });
cards.forEach(c => ro.observe(c));

// ── FILTROS ──
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

// ── ABRIR MODAL ──
function openDetail(id) {
    currentPizza = pizzas[id];
    if (!currentPizza) return;

    qty = 1;
    selectedSize = { size: 'mediana', extra: 5 };

    // Rellenar datos
    document.getElementById('modalImg').src = currentPizza.img;
    document.getElementById('modalImg').alt = currentPizza.name;
    document.getElementById('modalName').textContent = currentPizza.name;
    document.getElementById('modalDesc').textContent = currentPizza.desc;

    const cat = document.getElementById('modalCat');
    cat.textContent = currentPizza.cat;
    cat.style.background = currentPizza.catColor;

    // Ingredientes base
    const tagList = document.getElementById('modalIngredients');
    tagList.innerHTML = currentPizza.ingredients.map(i => `<span class="tag">${i}</span>`).join('');

    // Precios tamaños
    const base = currentPizza.basePrice;
    document.getElementById('pricePersonal').textContent = `S/ ${base.toFixed(2)}`;
    document.getElementById('priceMediana').textContent = `S/ ${(base + 5).toFixed(2)}`;
    document.getElementById('priceFamiliar').textContent = `S/ ${(base + 11).toFixed(2)}`;

    // Reset tamaño activo
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
    document.querySelector('[data-size="mediana"]').classList.add('active');

    // Reset extras
    document.querySelectorAll('.extra-item input').forEach(i => i.checked = false);
    document.querySelectorAll('.drink-item input[value="0"]').forEach(i => i.checked = true);

    // Related
    const relGrid = document.getElementById('relatedGrid');
    relGrid.innerHTML = currentPizza.related.map(rId => {
        const r = pizzas[rId];
        return `<a class="related-item" href="#" onclick="event.preventDefault();closeDetailBtn();setTimeout(()=>openDetail('${rId}'),350)">
      <img class="related-img" src="${r.img}" alt="${r.name}"/>
      <div>
        <div class="related-name">${r.name}</div>
        <div class="related-price">Desde S/ ${r.basePrice.toFixed(2)}</div>
      </div>
    </a>`;
    }).join('');

    // Qty
    document.getElementById('qtyVal').textContent = '1';
    updateTotal();

    // Abrir overlay
    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'flex';
    requestAnimationFrame(() => overlay.classList.add('open'));
    document.body.style.overflow = 'hidden';
}

// ── CERRAR MODAL ──
function closeDetail(e) {
    if (e.target === document.getElementById('modalOverlay')) closeDetailBtn();
}
function closeDetailBtn() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('open');
    setTimeout(() => { overlay.style.display = 'none'; }, 380);
    document.body.style.overflow = '';
}
// Cerrar con ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDetailBtn(); });

// ── SELECCIONAR TAMAÑO ──
function selectSize(el) {
    document.querySelectorAll('.size-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedSize = { size: el.dataset.size, extra: Number(el.dataset.price) };
    updateTotal();
}

// ── CAMBIAR CANTIDAD ──
function changeQty(delta) {
    qty = Math.max(1, qty + delta);
    document.getElementById('qtyVal').textContent = qty;
    updateTotal();
}

// ── CALCULAR TOTAL ──
function updateTotal() {
    if (!currentPizza) return;
    let total = currentPizza.basePrice + selectedSize.extra;

    // Extras
    document.querySelectorAll('.extra-item input:checked').forEach(i => {
        total += Number(i.dataset.price);
    });

    // Bebida
    const drink = document.querySelector('.drink-item input:checked');
    if (drink && drink.dataset.price) total += Number(drink.dataset.price);

    total *= qty;
    document.getElementById('totalPrice').textContent = `S/ ${total.toFixed(2)}`;
}

// ── AGREGAR AL CARRITO ──
function addToCart() {
    if (!currentPizza) return;

    // Verificar sesión
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
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    showToast();
    closeDetailBtn();
}

// ── BADGE CARRITO ──
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

// ── TOAST ──
function showToast() {
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
}

// Init badge
updateCartBadge();