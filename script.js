/* ==========================================================================
   LUMIÈRE PHOTOGRAPHY — Main JavaScript
   script.js
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   1. NAVBAR — Scroll effect & active link
   -------------------------------------------------------------------------- */
(function initNavbar() {
  const navbar   = document.querySelector('.navbar-lumiere');
  const toggle   = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  // Scroll shrink
  const handleScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // Hamburger toggle
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();


/* --------------------------------------------------------------------------
   2. SCROLL REVEAL — Intersection Observer
   -------------------------------------------------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();


/* --------------------------------------------------------------------------
   3. GALLERY FILTER — Portfolio page
   -------------------------------------------------------------------------- */
(function initGalleryFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      items.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();


/* --------------------------------------------------------------------------
   4. LIGHTBOX — Portfolio page
   -------------------------------------------------------------------------- */
(function initLightbox() {
  const overlay  = document.querySelector('.lightbox-overlay');
  const lightImg = document.querySelector('.lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn  = document.querySelector('.lightbox-prev');
  const nextBtn  = document.querySelector('.lightbox-next');
  const caption  = document.querySelector('.lightbox-caption');
  if (!overlay || !lightImg) return;

  let currentIndex = 0;
  let visibleItems = [];

  const getVisibleItems = () =>
    Array.from(document.querySelectorAll('.gallery-item:not(.hidden)'));

  const openLightbox = (index) => {
    visibleItems = getVisibleItems();
    currentIndex = index;
    const item   = visibleItems[currentIndex];
    const img    = item.querySelector('img');
    lightImg.src = img.src.replace(/w=\d+/, 'w=1400'); // get larger version
    lightImg.alt = img.alt;
    if (caption) caption.textContent = img.alt || '';
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { lightImg.src = ''; }, 350);
  };

  const showPrev = () => {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const img = visibleItems[currentIndex].querySelector('img');
    lightImg.src = img.src.replace(/w=\d+/, 'w=1400');
    if (caption) caption.textContent = img.alt || '';
  };

  const showNext = () => {
    visibleItems = getVisibleItems();
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const img = visibleItems[currentIndex].querySelector('img');
    lightImg.src = img.src.replace(/w=\d+/, 'w=1400');
    if (caption) caption.textContent = img.alt || '';
  };

  // Click on gallery items
  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      visibleItems = getVisibleItems();
      const vIdx = visibleItems.indexOf(item);
      openLightbox(vIdx !== -1 ? vIdx : 0);
    });
  });

  closeBtn  && closeBtn.addEventListener('click', closeLightbox);
  prevBtn   && prevBtn.addEventListener('click', showPrev);
  nextBtn   && nextBtn.addEventListener('click', showNext);

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showPrev();
    if (e.key === 'ArrowRight')  showNext();
  });
})();


/* --------------------------------------------------------------------------
   5. CONTACT FORM — WhatsApp redirect
   -------------------------------------------------------------------------- */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = (form.querySelector('[name="name"]')?.value    || '').trim();
    const email   = (form.querySelector('[name="email"]')?.value   || '').trim();
    const service = (form.querySelector('[name="service"]')?.value || '').trim();
    const message = (form.querySelector('[name="message"]')?.value || '').trim();

    const phone   = '919550531453'; // ← Replace with actual WhatsApp number (no + or spaces)

    const text = encodeURIComponent(
      `Hello! I'm ${name} (${email}).\n` +
      (service ? `I'm interested in: ${service}\n` : '') +
      (message ? `Message: ${message}` : '')
    );

    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  });
})();


/* --------------------------------------------------------------------------
   6. SMOOTH ANCHOR SCROLLING (fallback for older browsers)
   -------------------------------------------------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* --------------------------------------------------------------------------
   7. COUNTER ANIMATION — About page stats
   -------------------------------------------------------------------------- */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = (el) => {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* --------------------------------------------------------------------------
   8. CURSOR GLOW (subtle luxury touch — desktop only)
   -------------------------------------------------------------------------- */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
})();
