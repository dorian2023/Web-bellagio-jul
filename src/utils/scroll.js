/**
 * @file scroll.js
 * @description Smooth scrolling, sticky header state, section spy, and floating scroll-to-top button.
 * Re-observable after SPA route changes via `reattachRevealObservers()`.
 */

/** @type {IntersectionObserver|null} */
let revealObserver = null;

/**
 * Initializes navbar sticky state, scroll-to-top button, and active section highlighting.
 * Called once on app bootstrap.
 */
export function initScrollEffects() {
  const navbar = document.querySelector('.navbar');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const progressCircle = document.getElementById('scrollProgressCircle');

  let isTicking = false;

  // Optimized scroll handler using requestAnimationFrame
  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // 1. Sticky navbar state
        if (scrollY > 30) {
          navbar?.classList.add('scrolled');
        } else {
          navbar?.classList.remove('scrolled');
        }

        // 2. Scroll to top button visibility and progress indicator
        if (scrollTopBtn) {
          if (scrollY > 250) {
            scrollTopBtn.classList.add('visible');
          } else {
            scrollTopBtn.classList.remove('visible');
          }

          if (progressCircle && docHeight > 0) {
            const scrollFraction = Math.min(Math.max(scrollY / docHeight, 0), 1);
            const dashOffset = 100 - (scrollFraction * 100);
            progressCircle.style.strokeDashoffset = String(dashOffset);
          }
        }

        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });

  // Scroll to top click handler
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Create the shared reveal observer instance
  revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });

  // Initial reveal + counter setup
  reattachRevealObservers();
}

/**
 * Re-observes all `.reveal-item` elements that haven't been revealed yet,
 * and re-initializes counter animations. Must be called after any route change
 * that injects new DOM content into `#mainContent`.
 */
export function reattachRevealObservers() {
  if (!revealObserver) return;

  // Observe new reveal-items that haven't been revealed yet
  document.querySelectorAll('.reveal-item:not(.revealed)').forEach(item => {
    revealObserver.observe(item);
  });

  // Re-initialize counter animations for freshly injected stat elements
  initCounterAnimations();
}

/**
 * Animates numeric stat counters when they enter viewport.
 */
function initCounterAnimations() {
  const statElements = document.querySelectorAll('.stat-number[data-target]');
  
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, target, 1400, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  statElements.forEach(el => counterObserver.observe(el));
}

/**
 * Helper to smoothly increment numeric count.
 * @param {HTMLElement} obj 
 * @param {number} start 
 * @param {number} end 
 * @param {number} duration 
 * @param {string} suffix 
 */
function animateValue(obj, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const currentValue = Math.floor(easeProgress * (end - start) + start);
    
    obj.textContent = `${currentValue.toLocaleString('es-VE')}${suffix}`;
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      obj.textContent = `${end.toLocaleString('es-VE')}${suffix}`;
    }
  };
  window.requestAnimationFrame(step);
}
