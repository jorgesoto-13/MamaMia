/* =============================================
   nosotros.js — Animaciones Nosotros
   ============================================= */

window.addEventListener('load', () => {
    document.getElementById('nosBg')?.classList.add('loaded');
});

const revealEls = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
    });
}, { threshold: 0.1 });
revealEls.forEach(el => ro.observe(el));