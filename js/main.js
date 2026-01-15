// ==========================================================
// Mbeya Avocados — main interactions
// File: /js/main.js
// ==========================================================

(function () {
  const drawer = document.querySelector('[data-drawer]');
  const backdrop = document.querySelector('[data-backdrop]');
  const openBtn = document.querySelector('[data-open-drawer]');
  const closeBtn = document.querySelector('[data-close-drawer]');

  function openDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer || !backdrop) return;
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Reveal on scroll
  const els = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.08 });
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('show'));
  }
})();
