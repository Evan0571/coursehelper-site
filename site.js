document.documentElement.classList.add("has-js");

const COURSEHELPER_LANG_KEY = "coursehelperSiteLang";

function getStoredLanguage() {
  try {
    return window.localStorage.getItem(COURSEHELPER_LANG_KEY);
  } catch {
    return null;
  }
}

function setStoredLanguage(lang) {
  try {
    window.localStorage.setItem(COURSEHELPER_LANG_KEY, lang);
  } catch {
    // Local file previews can block storage. Language still works for this page load.
  }
}

function getRequestedLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");
  if (requested === "zh" || requested === "en") {
    return requested;
  }

  const stored = getStoredLanguage();
  if (stored === "zh" || stored === "en") {
    return stored;
  }

  return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function withLangParam(href, lang) {
  if (!href || href.startsWith("mailto:") || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  const url = new URL(href, window.location.href);
  url.searchParams.set("lang", lang);
  return `${url.pathname.split("/").pop()}${url.search}${url.hash}`;
}

function applyCopy(lang) {
  const copy = window.COURSEHELPER_COPY?.[lang] ?? {};
  Object.entries(copy).forEach(([key, value]) => {
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });
}

function applyLanguage(lang) {
  setStoredLanguage(lang);
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  applyCopy(lang);

  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.classList.toggle("active", node.getAttribute("data-lang") === lang);
  });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-lang-button") === lang);
  });

  document.querySelectorAll("a[data-preserve-lang]").forEach((link) => {
    link.setAttribute("href", withLangParam(link.getAttribute("data-base-href") ?? link.getAttribute("href"), lang));
  });

  if (window.ScrollTrigger) {
    window.ScrollTrigger.refresh();
  }
}

function revealWithoutGsap() {
  const targets = document.querySelectorAll(".motion-reveal");
  if (!targets.length) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  targets.forEach((target) => observer.observe(target));
}

function setActiveStory(index) {
  document.querySelectorAll("[data-story-step]").forEach((step) => {
    step.classList.toggle("is-active", step.getAttribute("data-story-step") === String(index));
  });

  document.querySelectorAll("[data-preview-step]").forEach((card) => {
    const active = card.getAttribute("data-preview-step") === String(index);
    card.classList.toggle("is-active", active);
    if (window.gsap) {
      window.gsap.to(card, {
        autoAlpha: active ? 1 : 0,
        y: active ? 0 : 24,
        scale: active ? 1 : 0.985,
        duration: 0.42,
        ease: "power3.out"
      });
    }
  });

  document.querySelectorAll(".story-progress span").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === index);
  });
}

function setupGsapMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    revealWithoutGsap();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.62, overwrite: "auto" });

  const mm = gsap.matchMedia();

  mm.add({
    reduceMotion: "(prefers-reduced-motion: reduce)",
    canAnimate: "(prefers-reduced-motion: no-preference)"
  }, (context) => {
    const { reduceMotion } = context.conditions;
    if (reduceMotion) {
      document.querySelectorAll(".motion-reveal").forEach((target) => target.classList.add("is-visible"));
      return;
    }

    gsap.set(".motion-reveal", { autoAlpha: 0, y: 24 });
    gsap.to(".hero-copy.motion-reveal", { autoAlpha: 1, y: 0, duration: 0.72 });
    gsap.to(".hero-stage.motion-reveal", { autoAlpha: 1, y: 0, duration: 0.82, delay: 0.12 });
    gsap.to(".hero-device", { y: -10, rotationY: -3, duration: 4.8, ease: "sine.inOut", repeat: -1, yoyo: true });
    gsap.to(".floating-review", { y: 12, duration: 4.2, ease: "sine.inOut", repeat: -1, yoyo: true });

    ScrollTrigger.batch(".motion-reveal:not(.hero-copy):not(.hero-stage)", {
      start: "top 82%",
      once: true,
      onEnter: (batch) => {
        batch.forEach((item) => item.classList.add("is-visible"));
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.68,
          stagger: 0.08
        });
      }
    });

    document.querySelectorAll("[data-story-step]").forEach((step) => {
      const index = Number(step.getAttribute("data-story-step"));
      ScrollTrigger.create({
        trigger: step,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => setActiveStory(index),
        onEnterBack: () => setActiveStory(index)
      });
    });

    document.querySelectorAll("[data-preview-step]").forEach((card) => {
      if (!card.classList.contains("is-active")) {
        gsap.set(card, { autoAlpha: 0, y: 24, scale: 0.98 });
      }
    });

    setActiveStory(0);
  });

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[data-preserve-lang]").forEach((link) => {
    link.setAttribute("data-base-href", link.getAttribute("href"));
  });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-lang-button")));
  });

  applyLanguage(getRequestedLanguage());
  setupGsapMotion();
});
