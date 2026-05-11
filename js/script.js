const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year
const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Mobile menu toggle
const menuToggle = $("[data-menu-toggle]");
const drawer = $("[data-mobile-drawer]");
if (menuToggle && drawer) {
  menuToggle.addEventListener("click", () => {
    drawer.classList.toggle("is-open");
  });

  $$(".mobile-menu__link", drawer).forEach((a) => {
    a.addEventListener("click", () => drawer.classList.remove("is-open"));
  });
}

// Theme toggle (optional, matches screenshots vibe)
const themeToggle = $("[data-theme-toggle]");
if (themeToggle) {
  const KEY = "atelier_theme";
  const setTheme = (t) => {
    if (t) document.documentElement.setAttribute("data-theme", t);
    else document.documentElement.removeAttribute("data-theme");
  };

  const saved = localStorage.getItem(KEY);
  if (saved === "dark" || saved === "light") setTheme(saved);

  themeToggle.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme") || "light";
    const next = cur === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem(KEY, next);
  });
}

// Accordion (FAQ)
const acc = $("[data-accordion]");
if (acc) {
  const buttons = $$(".qa", acc);
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      buttons.forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const panel = b.nextElementSibling;
        if (panel) panel.hidden = true;
      });
      btn.setAttribute("aria-expanded", expanded ? "false" : "true");
      const panel = btn.nextElementSibling;
      if (panel) panel.hidden = expanded;
    });
  });
}

// Simple slider (Testimonials)
const slider = $("[data-slider]");
if (slider) {
  const track = $("[data-slider-track]", slider);
  const prev = $("[data-slider-prev]", slider);
  const next = $("[data-slider-next]", slider);
  const dotsWrap = $("[data-slider-dots]", slider);
  const cards = track ? Array.from(track.children) : [];

  let index = 0;
  const clamp = (n) => Math.max(0, Math.min(n, cards.length - 1));

  const renderDots = () => {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = "";
    cards.forEach((_, i) => {
      const d = document.createElement("button");
      d.type = "button";
      d.className = "dot" + (i === index ? " is-active" : "");
      d.setAttribute("aria-label", `Go to slide ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(d);
    });
  };

  const goTo = (i) => {
    index = clamp(i);
    const targetCard = cards[index];
    if (targetCard) {
      track.scrollTo({ left: targetCard.offsetLeft, behavior: 'smooth' });
    }
    renderDots();
  };

  const nextSlide = () => goTo(index + 1);
  const prevSlide = () => goTo(index - 1);

  if (next) next.addEventListener("click", nextSlide);
  if (prev) prev.addEventListener("click", prevSlide);

  // Keep index in sync on resize/scroll snapping
  const syncIndex = () => {
    if (!track) return;
    const w = track.clientWidth || 1;
    index = clamp(Math.round(track.scrollLeft / w));
    renderDots();
  };

  track?.addEventListener("scroll", () => {
    window.clearTimeout(track.__t);
    track.__t = window.setTimeout(syncIndex, 80);
  });
  window.addEventListener("resize", syncIndex);

  renderDots();
}

// Back to top
const toTop = $("[data-to-top]");
if (toTop) {
  const onScroll = () => {
    if (window.scrollY > 600) toTop.classList.add("is-visible");
    else toTop.classList.remove("is-visible");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Hero section background change
const heroBg = document.querySelector('.hero__bg');
const categoryButtons = document.querySelectorAll('.pill[data-banner]');
const heroBannerClasses = ['bg1', 'bg2', 'bg3', 'bg4'];

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('is-active'));
    button.classList.add('is-active');

    heroBg.classList.remove(...heroBannerClasses);
    heroBg.classList.add(button.dataset.banner);
  });
});

const heroTitleEl = document.querySelector('.hero__title');
const heroSubtitleEl = document.querySelector('.hero__subtitle');

const loadHeroTemplate = async () => {
  try {
    const response = await fetch('/api/sections/hero');
    if (!response.ok) return;

    const section = await response.json();
    const heroData = section.data || {};

    if (heroData.headline) {
      heroTitleEl.innerHTML = heroData.headline;
    }
    if (heroData.subtitle) {
      heroSubtitleEl.textContent = heroData.subtitle;
    }

    if (Array.isArray(heroData.categories)) {
      heroData.categories.forEach((category) => {
        const button = document.querySelector(`.pill[data-banner="${category.key}"]`);
        if (button) {
          const span = button.querySelector('span');
          if (span) span.textContent = `(${category.count})`;
        }
      });
    }
  } catch (err) {
    console.warn('Hero section API not available', err);
  }
};

loadHeroTemplate();

heroBg.classList.add('bg1');

