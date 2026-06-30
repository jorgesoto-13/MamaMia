/* =============================================
   contacto.js — Formulario de Contacto
   ============================================= */

// Reveal scroll
const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));

// Contador caracteres
function updateChar() {
    const len = document.getElementById('cMensaje').value.length;
    document.getElementById('charCount').textContent = `(${len}/500)`;
}

// Toast
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
}

// Errores
function showErr(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg; el.classList.add('show');
}
function clearErrs() {
    document.querySelectorAll('.field-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
}

// Enviar
function handleContacto() {
    clearErrs();
    const nombre = document.getElementById('cNombre').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const asunto = document.getElementById('cAsunto').value;
    const mensaje = document.getElementById('cMensaje').value.trim();
    let valid = true;

    if (!nombre) { showErr('cNombreErr', 'El nombre es requerido'); valid = false; }
    if (!email) { showErr('cEmailErr', 'El email es requerido'); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { showErr('cEmailErr', 'Email inválido'); valid = false; }
    if (!asunto) { showErr('cAsuntoErr', 'Selecciona un asunto'); valid = false; }
    if (!mensaje) { showErr('cMensajeErr', 'El mensaje es requerido'); valid = false; }

    if (!valid) return;

    const btn = document.querySelector('.btn-enviar');
    btn.textContent = 'Enviando...'; btn.classList.add('loading');

    setTimeout(() => {
        btn.textContent = '✈️ Enviar Mensaje'; btn.classList.remove('loading');
        ['cNombre', 'cEmail', 'cTel', 'cMensaje'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('cAsunto').value = '';
        document.getElementById('charCount').textContent = '(0/500)';
        showToast('✅ Mensaje enviado. Te contactaremos pronto.');
    }, 1500);
}