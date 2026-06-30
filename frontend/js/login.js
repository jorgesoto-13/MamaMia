/* =============================================
   login.js — Lógica de Login, Registro y Admin
   ============================================= */

// ── SWITCH TABS CLIENTE ──
function switchTab(tab) {
    const isLogin = tab === 'login';

    document.getElementById('tabLogin').classList.toggle('active', isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
    document.getElementById('formLogin').classList.toggle('hidden', !isLogin);
    document.getElementById('formRegister').classList.toggle('hidden', isLogin);

    // Cambiar header
    document.getElementById('cardTitle').textContent = isLogin ? 'Bienvenido de vuelta' : 'Crea tu cuenta';
    document.getElementById('cardSub').textContent = isLogin ? 'Accede para pedir tus pizzas favoritas' : 'Únete a la familia Mama Mia';

    clearErrors();
}

// ── SWITCH A ADMIN ──
function switchToAdmin() {
    const client = document.getElementById('clientCard');
    const admin = document.getElementById('adminCard');

    client.style.animation = 'none';
    client.style.opacity = '0';
    client.style.transform = 'translateY(-20px)';
    client.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
        client.classList.add('hidden');
        admin.classList.remove('hidden');
        admin.style.animation = 'none';
        admin.style.opacity = '0';
        admin.style.transform = 'translateY(28px)';
        requestAnimationFrame(() => {
            admin.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(.22,.68,0,1.1)';
            admin.style.opacity = '1';
            admin.style.transform = 'translateY(0)';
        });
    }, 280);
}

// ── SWITCH A CLIENTE ──
function switchToClient() {
    const client = document.getElementById('clientCard');
    const admin = document.getElementById('adminCard');

    admin.style.opacity = '0';
    admin.style.transform = 'translateY(-20px)';
    admin.style.transition = 'opacity 0.3s, transform 0.3s';

    setTimeout(() => {
        admin.classList.add('hidden');
        client.classList.remove('hidden');
        client.style.opacity = '0';
        client.style.transform = 'translateY(28px)';
        requestAnimationFrame(() => {
            client.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(.22,.68,0,1.1)';
            client.style.opacity = '1';
            client.style.transform = 'translateY(0)';
        });
    }, 280);
}

// ── TOGGLE CONTRASEÑA ──
function togglePass(inputId, btn) {
    const input = document.getElementById(inputId);
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.style.color = isHidden ? 'var(--red)' : '';
}

// ── MOSTRAR ERROR ──
function showError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    const input = el.previousElementSibling?.tagName === 'INPUT'
        ? el.previousElementSibling
        : el.previousElementSibling?.querySelector('input');
    if (input) input.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.field-error').forEach(e => {
        e.classList.remove('show'); e.textContent = '';
    });
    document.querySelectorAll('input.error').forEach(i => i.classList.remove('error'));
}

// ── TOAST ──
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── LOADING BUTTON ──
function setLoading(btn, state) {
    btn.classList.toggle('loading', state);
    btn.textContent = state ? '' : btn.dataset.label;
}

// ── HANDLE LOGIN ──
function handleLogin() {
    clearErrors();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPass').value;
    let valid = true;

    if (!email) { showError('loginEmailErr', 'El email es requerido'); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { showError('loginEmailErr', 'Email inválido'); valid = false; }
    if (!pass) { showError('loginPassErr', 'La contraseña es requerida'); valid = false; }

    if (!valid) return;

    const btn = document.querySelector('#formLogin .btn-submit');
    btn.dataset.label = btn.textContent;
    btn.classList.add('loading');
    btn.textContent = '';

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = btn.dataset.label;

        // Redirigir admin si corresponde
        if (email === 'admin@mamamia.com') {
            showToast('✅ Acceso admin detectado, redirigiendo...');
            setTimeout(() => location.href = 'admin.html', 1200);
        } else {
            // Guardar sesión simulada
            const usuario = { nombre: email.split('@')[0], email };
            localStorage.setItem('mamamia_usuario', JSON.stringify(usuario));

            showToast('✅ ¡Bienvenido de vuelta!');
            setTimeout(() => location.href = 'index.html', 1200);
        }
    }, 1400);
}

// ── HANDLE REGISTRO ──
function handleRegister() {
    clearErrors();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const pass = document.getElementById('regPass').value;
    const pass2 = document.getElementById('regPass2').value;
    let valid = true;

    if (!name) { showError('regNameErr', 'El nombre es requerido'); valid = false; }
    if (!email) { showError('regEmailErr', 'El email es requerido'); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { showError('regEmailErr', 'Email inválido'); valid = false; }
    if (!pass || pass.length < 6) { showError('regPassErr', 'Mínimo 6 caracteres'); valid = false; }
    if (pass !== pass2) { showError('regPass2Err', 'Las contraseñas no coinciden'); valid = false; }

    if (!valid) return;

    const btn = document.querySelector('#formRegister .btn-submit');
    btn.dataset.label = btn.textContent;
    btn.classList.add('loading');
    btn.textContent = '';

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = btn.dataset.label;
        showToast('🎉 Cuenta creada con éxito');
        setTimeout(() => location.href = 'index.html', 1200);
    }, 1400);
}

// ── HANDLE ADMIN ──
function handleAdmin() {
    clearErrors();
    const email = document.getElementById('adminEmail').value.trim();
    const pass = document.getElementById('adminPass').value;
    let valid = true;

    if (!email) { showError('adminEmailErr', 'El email es requerido'); valid = false; }
    if (!pass) { showError('adminPassErr', 'La contraseña es requerida'); valid = false; }

    if (!valid) return;

    const btn = document.querySelector('#adminCard .btn-submit');
    btn.dataset.label = btn.textContent;
    btn.classList.add('loading');
    btn.textContent = '';

    setTimeout(() => {
        btn.classList.remove('loading');
        btn.textContent = btn.dataset.label;

        if (email === 'admin@mamamia.com') {
            showToast('✅ Acceso concedido');
            setTimeout(() => location.href = 'admin.html', 1000);
        } else {
            showToast('❌ Credenciales incorrectas', 'error');
        }
    }, 1400);
}

// ── ENTER KEY ──
document.addEventListener('keydown', e => {
    if (e.key !== 'Enter') return;
    const adminVisible = !document.getElementById('adminCard').classList.contains('hidden');
    if (adminVisible) handleAdmin();
    else if (!document.getElementById('formLogin').classList.contains('hidden')) handleLogin();
    else handleRegister();
});