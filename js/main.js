/**
 * ALPHALEAD ACADEMY — MAIN APP CONTROLLER
 * Navigation, Pathway Selector, Header Scroll, and Scroll-to-Top
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initPathwaySelector();
  initScrollTop();
  initActiveNavHighlighter();
  initMobileVerticalTabs();
  initFoundersMobileCarousel();
  initReviewsCarousel();
});

/**
 * 1. Header scroll effect
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Navigation Toggle & Drawer
 */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggle || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const openMenu = () => {
    drawer.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    drawer.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', toggleMenu);

  // Close when clicking nav links inside drawer
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close when clicking modal trigger inside drawer
  drawer.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close on click outside drawer and toggle button
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/**
 * 3. Interactive Pathway Selector
 */
function initPathwaySelector() {
  const tabs = document.querySelectorAll('.pathway-tab');
  const panels = document.querySelectorAll('.pathway-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      // Update active tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update active panels
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === targetId) {
          p.classList.add('active');
        }
      });
    });
  });
}

/**
 * 4. Scroll To Top Button
 */
function initScrollTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 5. Active Nav Item Tracking on Scroll
 */
function initActiveNavHighlighter() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === `#${id}` || href.endsWith(`#${id}`)) {
            link.classList.add('active');
          } else if (href.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/**
 * 6. Mobile Vertical Tabs Switcher (Audit Action 6)
 */
function initMobileVerticalTabs() {
  const tabBtns = document.querySelectorAll('.mobile-vertical-tab-btn');
  const sections = document.querySelectorAll('.tabbed-vertical-section');
  if (!tabBtns.length || !sections.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab-target');

      // Update button active state
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Show matching section only (in mobile view)
      sections.forEach(sec => {
        if (sec.id === targetId) {
          sec.classList.add('active');
        } else {
          sec.classList.remove('active');
        }
      });
    });
  });
}

/**
 * 7. Founder Stories Mobile Carousel Indicators
 */
function initFoundersMobileCarousel() {
  const carousel = document.getElementById('foundersCarousel');
  const dots = document.querySelectorAll('.founder-dot');
  if (!carousel || !dots.length) return;

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-founder-dot') || '0', 10);
      const items = carousel.querySelectorAll('.founder-profile-grid');
      if (items[idx]) {
        items[idx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    });
  });

  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    const width = carousel.offsetWidth;
    const activeIndex = Math.round(scrollLeft / width);
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }, { passive: true });
}

/**
 * 8. Reviews Carousel on Mobile
 */
function initReviewsCarousel() {
  const grid = document.getElementById('reviewsGrid');
  const prevBtn = document.getElementById('reviewPrevBtn');
  const nextBtn = document.getElementById('reviewNextBtn');
  const indicator = document.getElementById('reviewPageIndicator');
  if (!grid || !prevBtn || !nextBtn || !indicator) return;

  const cards = grid.querySelectorAll('.review-card');
  const total = cards.length;

  const updateIndicator = () => {
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 14; // include gap
    const scrollLeft = grid.scrollLeft;
    const currentIndex = Math.min(total, Math.max(1, Math.round(scrollLeft / cardWidth) + 1));
    indicator.textContent = `${currentIndex} / ${total}`;
  };

  prevBtn.addEventListener('click', () => {
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 14;
    grid.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    if (cards.length === 0) return;
    const cardWidth = cards[0].offsetWidth + 14;
    grid.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  grid.addEventListener('scroll', updateIndicator, { passive: true });
}

