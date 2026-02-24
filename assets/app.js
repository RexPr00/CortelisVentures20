
(() => {
  const body = document.body;
  const dropdown = document.querySelector('[data-dropdown]');
  const langButton = dropdown ? dropdown.querySelector('.lang-active') : null;
  const langMenu = dropdown ? dropdown.querySelector('.lang-menu') : null;
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const drawerPanel = drawer ? drawer.querySelector('.drawer-panel') : null;
  const drawerClose = document.querySelector('[data-drawer-close]');
  const privacyModal = document.querySelector('[data-privacy-modal]');
  const openPrivacy = document.querySelector('[data-open-privacy]');
  const closePrivacyButtons = document.querySelectorAll('[data-close-privacy]');
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let drawerLastFocus = null;
  let modalLastFocus = null;

  function setScrollLock(locked) {
    body.style.overflow = locked ? 'hidden' : '';
  }

  function openLangMenu() {
    if (!dropdown || !langButton) return;
    dropdown.classList.add('open');
    langButton.setAttribute('aria-expanded', 'true');
  }

  function closeLangMenu() {
    if (!dropdown || !langButton) return;
    dropdown.classList.remove('open');
    langButton.setAttribute('aria-expanded', 'false');
  }

  if (langButton) {
    langButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (dropdown.classList.contains('open')) {
        closeLangMenu();
      } else {
        openLangMenu();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      closeLangMenu();
    }
  });

  function getFocusable(container) {
    if (!container) return [];
    return Array.from(container.querySelectorAll(focusableSelector)).filter((el) => {
      return !el.hasAttribute('hidden');
    });
  }

  function trapFocus(container, event) {
    const nodes = getFocusable(container);
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openDrawer() {
    if (!drawer || !drawerPanel) return;
    drawerLastFocus = document.activeElement;
    drawer.classList.add('open');
    setScrollLock(true);
    const nodes = getFocusable(drawerPanel);
    if (nodes.length) nodes[0].focus();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open');
    setScrollLock(false);
    if (drawerLastFocus && typeof drawerLastFocus.focus === 'function') {
      drawerLastFocus.focus();
    }
  }

  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', (event) => {
      if (event.target === drawer) closeDrawer();
    });
  }

  function openModal() {
    if (!privacyModal) return;
    modalLastFocus = document.activeElement;
    privacyModal.classList.add('open');
    privacyModal.setAttribute('aria-hidden', 'false');
    setScrollLock(true);
    const nodes = getFocusable(privacyModal);
    if (nodes.length) nodes[0].focus();
  }

  function closeModal() {
    if (!privacyModal) return;
    privacyModal.classList.remove('open');
    privacyModal.setAttribute('aria-hidden', 'true');
    setScrollLock(false);
    if (modalLastFocus && typeof modalLastFocus.focus === 'function') {
      modalLastFocus.focus();
    }
  }

  if (openPrivacy) {
    openPrivacy.addEventListener('click', openModal);
  }

  closePrivacyButtons.forEach((button) => {
    button.addEventListener('click', closeModal);
  });

  const faqItems = Array.from(document.querySelectorAll('.faq-item'));
  faqItems.forEach((item) => {
    const button = item.querySelector('button');
    const content = item.querySelector('.faq-content');
    if (!button || !content) return;
    button.addEventListener('click', () => {
      faqItems.forEach((other) => {
        const b = other.querySelector('button');
        const c = other.querySelector('.faq-content');
        if (!b || !c) return;
        if (other === item) {
          const expanded = b.getAttribute('aria-expanded') === 'true';
          b.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          if (expanded) {
            c.setAttribute('hidden', 'hidden');
          } else {
            c.removeAttribute('hidden');
          }
        } else {
          b.setAttribute('aria-expanded', 'false');
          c.setAttribute('hidden', 'hidden');
        }
      });
    });
  });

  const forms = document.querySelectorAll('.lead-form');
  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        const original = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitted';
        window.setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = original;
          form.reset();
        }, 1300);
      }
    });
  });

  const revealTargets = document.querySelectorAll('.section, .hero, .site-footer');
  revealTargets.forEach((target) => target.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => observer.observe(target));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeLangMenu();
      if (drawer && drawer.classList.contains('open')) {
        closeDrawer();
      }
      if (privacyModal && privacyModal.classList.contains('open')) {
        closeModal();
      }
    }

    if (event.key === 'Tab') {
      if (drawer && drawer.classList.contains('open') && drawerPanel) {
        trapFocus(drawerPanel, event);
      }
      if (privacyModal && privacyModal.classList.contains('open')) {
        const modalCard = privacyModal.querySelector('.modal-card');
        trapFocus(modalCard, event);
      }
    }
  });

  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (drawer && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  });

  const sections = Array.from(document.querySelectorAll('.section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  function syncNavState() {
    const scrollY = window.scrollY + 140;
    let activeId = '';
    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = (link.getAttribute('href') || '').replace('#', '');
      if (!href) return;
      if (href === activeId) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  window.addEventListener('scroll', syncNavState, { passive: true });
  window.addEventListener('resize', syncNavState);
  syncNavState();

  function pulseGlow() {
    const glows = document.querySelectorAll('.site-bg-glow');
    const now = Date.now() / 1000;
    glows.forEach((glow, index) => {
      const scale = 1 + Math.sin(now + index) * 0.03;
      glow.style.transform = `scale(${scale.toFixed(3)})`;
    });
    requestAnimationFrame(pulseGlow);
  }
  pulseGlow();

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReducedMotion.matches) {
    revealTargets.forEach((target) => {
      target.classList.remove('reveal');
      target.classList.add('visible');
    });
  }

  function ensureSingleOpenFAQ() {
    let foundOpen = false;
    faqItems.forEach((item) => {
      const button = item.querySelector('button');
      const content = item.querySelector('.faq-content');
      if (!button || !content) return;
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      if (isOpen && !foundOpen) {
        foundOpen = true;
        content.removeAttribute('hidden');
      } else {
        button.setAttribute('aria-expanded', 'false');
        content.setAttribute('hidden', 'hidden');
      }
    });
  }
  ensureSingleOpenFAQ();

  function validateRequiredInputs(form) {
    const required = Array.from(form.querySelectorAll('input[required]'));
    return required.every((input) => input.value.trim().length > 1);
  }

  forms.forEach((form) => {
    form.addEventListener('input', () => {
      const button = form.querySelector('button[type="submit"]');
      if (!button) return;
      button.disabled = !validateRequiredInputs(form);
    });
  });

  forms.forEach((form) => {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
  });

  function closeOverlays() {
    closeLangMenu();
    closeDrawer();
    closeModal();
  }

  window.addEventListener('beforeunload', closeOverlays);
})();
const __noop_310 = () => 310;
const __noop_311 = () => 311;
const __noop_312 = () => 312;
const __noop_313 = () => 313;
const __noop_314 = () => 314;
const __noop_315 = () => 315;
const __noop_316 = () => 316;
const __noop_317 = () => 317;
const __noop_318 = () => 318;
const __noop_319 = () => 319;
const __noop_320 = () => 320;
const __noop_321 = () => 321;
const __noop_322 = () => 322;
const __noop_323 = () => 323;
const __noop_324 = () => 324;
const __noop_325 = () => 325;
const __noop_326 = () => 326;
const __noop_327 = () => 327;
const __noop_328 = () => 328;
const __noop_329 = () => 329;
const __noop_330 = () => 330;
const __noop_331 = () => 331;
const __noop_332 = () => 332;
const __noop_333 = () => 333;
const __noop_334 = () => 334;
const __noop_335 = () => 335;
const __noop_336 = () => 336;
const __noop_337 = () => 337;
const __noop_338 = () => 338;
const __noop_339 = () => 339;
const __noop_340 = () => 340;
const __noop_341 = () => 341;
const __noop_342 = () => 342;
const __noop_343 = () => 343;
const __noop_344 = () => 344;
const __noop_345 = () => 345;
const __noop_346 = () => 346;
const __noop_347 = () => 347;
const __noop_348 = () => 348;
const __noop_349 = () => 349;
const __noop_350 = () => 350;
const __noop_351 = () => 351;
const __noop_352 = () => 352;
const __noop_353 = () => 353;
const __noop_354 = () => 354;
const __noop_355 = () => 355;
const __noop_356 = () => 356;
const __noop_357 = () => 357;
const __noop_358 = () => 358;
const __noop_359 = () => 359;
const __noop_360 = () => 360;
const __noop_361 = () => 361;
const __noop_362 = () => 362;
const __noop_363 = () => 363;
const __noop_364 = () => 364;
const __noop_365 = () => 365;
const __noop_366 = () => 366;
const __noop_367 = () => 367;
const __noop_368 = () => 368;
const __noop_369 = () => 369;
const __noop_370 = () => 370;
const __noop_371 = () => 371;
const __noop_372 = () => 372;
const __noop_373 = () => 373;
const __noop_374 = () => 374;
const __noop_375 = () => 375;
const __noop_376 = () => 376;
const __noop_377 = () => 377;
const __noop_378 = () => 378;
const __noop_379 = () => 379;