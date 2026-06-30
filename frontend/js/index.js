/* =============================================
   index.js — JS exclusivo del Inicio / Landing
   ============================================= */

// Hero: zoom-out suave al cargar
window.addEventListener('load', () => {
    const heroBg = document.getElementById('heroBg');
    if (heroBg) heroBg.classList.add('loaded');
});

// Scroll reveal: cards aparecen al entrar en pantalla
const revealEls = document.querySelectorAll('.pizza-card, .why-card, .cta-content');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));