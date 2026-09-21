/* ============================================================
   Копировальный центр «КопиЛайн» — script.js
   Меню, анимации, калькулятор печати, заглушки фото
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. Шапка: фон при скролле ---------- */
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 2. Мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  const closeMenu = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    document.body.classList.remove('lock');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.classList.toggle('lock', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- 3. Плавное появление блоков при скролле ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- 4. Заглушки для фото ----------
     Если файла images/… ещё нет, подставляем аккуратную SVG-заглушку.
     После добавления настоящих фото ничего менять не нужно. */
  const makePlaceholder = (text, emoji) => {
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#eaf2fe"/><stop offset="1" stop-color="#fdeef7"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="600" fill="url(#g)"/>' +
      '<circle cx="120" cy="110" r="70" fill="#ffc93c" opacity=".35"/>' +
      '<circle cx="700" cy="470" r="90" fill="#ff5ca8" opacity=".22"/>' +
      '<circle cx="660" cy="130" r="46" fill="#2b7de9" opacity=".22"/>' +
      '<text x="400" y="310" font-size="96" text-anchor="middle">' + (emoji || '🖨') + '</text>' +
      '<text x="400" y="382" font-size="30" font-family="Arial, sans-serif" fill="#5b6478" text-anchor="middle">' + text + '</text>' +
      '<text x="400" y="420" font-size="19" font-family="Arial, sans-serif" fill="#9aa4bd" text-anchor="middle">добавьте фото: images/…</text>' +
      '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  };

  document.querySelectorAll('img[data-fallback]').forEach(img => {
    const showFallback = () => {
      if (img.dataset.fallbackDone) return;
      img.dataset.fallbackDone = '1';
      img.src = makePlaceholder(img.dataset.fallback, img.dataset.emoji);
    };
    img.addEventListener('error', showFallback);
    // если картинка уже не загрузилась до запуска скрипта
    if (img.complete && img.naturalWidth === 0) showFallback();
  });

  /* ---------- 5. Калькулятор печати ---------- */
  const calcForm = document.getElementById('calc-form');
  if (calcForm) {
    const pagesInput = document.getElementById('calc-pages');
    const totalEl = document.getElementById('calc-total');

    const recalc = () => {
      let pages = parseInt(pagesInput.value, 10);
      if (isNaN(pages) || pages < 1) pages = 1;
      const mode = calcForm.querySelector('input[name="mode"]:checked');
      const price = mode ? +mode.value : 10; // 10 ₽ ч/б, 20 ₽ цвет
      totalEl.textContent = (pages * price).toLocaleString('ru-RU') + ' ₽';
    };

    // Кнопки +/−
    calcForm.querySelectorAll('.calc-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        let pages = parseInt(pagesInput.value, 10) || 1;
        pages = Math.min(9999, Math.max(1, pages + (+btn.dataset.step)));
        pagesInput.value = pages;
        recalc();
      });
    });

    calcForm.addEventListener('input', recalc);
    recalc();
  }

  /* ---------- 6. Текущий год в подвале ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
