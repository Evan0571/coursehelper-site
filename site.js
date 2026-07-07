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
  document.querySelectorAll(".reveal").forEach((target) => {
    target.classList.add("is-visible");
  });
}

function setupMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) {
    revealWithoutGsap();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.62, overwrite: "auto" });

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const replayOnScroll = {
      toggleActions: "restart none none reverse",
    };

    const heroTimeline = gsap.timeline({
      defaults: { ease: "power4.out" },
    });

    heroTimeline
      .fromTo(
        ".hero-copy > *",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08 },
      )
      .fromTo(
        ".hero-stage",
        { autoAlpha: 0, y: 24, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.78 },
        "-=0.46",
      )
      .fromTo(
        ".hero-device",
        { autoAlpha: 0, y: 34, rotation: -2.2, scale: 0.96 },
        { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.82 },
        "-=0.44",
      )
      .fromTo(
        ".audio-panel, .summary-panel",
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.12 },
        "-=0.34",
      )
      .fromTo(
        ".floating-review span",
        { autoAlpha: 0, x: -18 },
        { autoAlpha: 1, x: 0, duration: 0.52, stagger: 0.08 },
        "-=0.24",
      );

    const ambientTweens = [
      gsap.to(".hero-device", {
        y: -10,
        rotation: -0.8,
        duration: 5.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        paused: true,
      }),
    gsap.to(".floating-review", {
      y: 4,
      x: -3,
      duration: 5.8,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
        paused: true,
      }),
    ];

    let ambientReady = false;
    let heroInView = true;

    function updateAmbient() {
      ambientTweens.forEach((tween) => {
        if (ambientReady && heroInView) {
          tween.play();
        } else {
          tween.pause();
        }
      });
    }

    heroTimeline.call(() => {
      ambientReady = true;
      updateAmbient();
    });

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => {
        heroInView = true;
        updateAmbient();
      },
      onEnterBack: () => {
        heroInView = true;
        updateAmbient();
      },
      onLeave: () => {
        heroInView = false;
        updateAmbient();
      },
      onLeaveBack: () => {
        heroInView = false;
        updateAmbient();
      },
    });

    const productProof = document.querySelector(".product-proof");
    if (productProof) {
      const proofPhones = productProof.querySelectorAll(".phone-frame:not(.proof-calendar)");
      const proofHotspots = productProof.querySelectorAll(".proof-calendar-target");
      const proofTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: productProof,
          start: "top 78%",
          ...replayOnScroll,
        },
        defaults: { ease: "power4.out" },
      });

      proofTimeline
        .fromTo(
          proofPhones,
          { autoAlpha: 0, y: 34, rotation: -1.6, scale: 0.96 },
          { autoAlpha: 1, y: 0, rotation: 0, scale: 1, duration: 0.74, stagger: 0.06 },
        )
        .fromTo(
          proofHotspots,
          { autoAlpha: 0, y: 34, scale: 0.96 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.54, stagger: 0.06 },
          "<",
        )
        .fromTo(
          productProof.querySelectorAll(".proof-copy > *"),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.07 },
          "-=0.38",
        );
    }

    gsap.utils.toArray(".section-intro, .workflow-map, .review-copy").forEach((block) => {
      gsap.fromTo(
        block.children,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.62,
          stagger: 0.07,
          scrollTrigger: {
            trigger: block,
            start: "top 84%",
            ...replayOnScroll,
          },
        },
      );
    });

    gsap.utils.toArray(".scenario").forEach((scenario, index) => {
      const copyItems = scenario.querySelectorAll(".scenario-copy > *");
      const phone = scenario.querySelector(".phone-frame");
      const isReverse = scenario.classList.contains("reverse");
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scenario,
          start: "top 78%",
          ...replayOnScroll,
        },
        defaults: { ease: "power4.out" },
      });

      timeline
        .fromTo(
          copyItems,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.58, stagger: 0.07 },
        )
        .fromTo(
          phone,
          {
            autoAlpha: 0,
            y: 36,
            x: isReverse ? -18 : 18,
            rotation: isReverse ? 1.4 : -1.4,
            scale: 0.965,
          },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            rotation: 0,
            scale: 1,
            duration: 0.72,
          },
          index === 0 ? "-=0.34" : "-=0.28",
        );
    });

    gsap.fromTo(
      ".review-card",
      { autoAlpha: 0, y: 28, scale: 0.965 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.62,
        stagger: 0.08,
        scrollTrigger: {
          trigger: ".review-rail",
          start: "top 82%",
          ...replayOnScroll,
        },
      },
    );

    const closingSection = document.querySelector(".closing-section");
    if (closingSection) {
      const closingTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: closingSection,
          start: "top 82%",
          ...replayOnScroll,
        },
        defaults: { ease: "power4.out" },
      });

      closingTimeline
        .fromTo(
          closingSection.querySelectorAll(".closing-copy > *"),
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.62, stagger: 0.07 },
        )
        .fromTo(
          closingSection.querySelectorAll(".loop-step"),
          { autoAlpha: 0, x: 20 },
          { autoAlpha: 1, x: 0, duration: 0.56, stagger: 0.09 },
          "-=0.32",
        );
    }

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });
}

function setupReviewCarousel() {
  const rail = document.querySelector(".review-rail");
  if (!rail) {
    return;
  }

  if (rail.hasAttribute("data-static-rail")) {
    return;
  }

  const originalCards = Array.from(rail.querySelectorAll(".review-card:not([data-clone])"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (originalCards.length < 2 || reducedMotion.matches) {
    return;
  }

  if (!rail.dataset.loopReady) {
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.clone = "true";
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("a, button, [tabindex]").forEach((node) => node.setAttribute("tabindex", "-1"));
      rail.appendChild(clone);
    });
    rail.dataset.loopReady = "true";
  }

  const cards = Array.from(rail.querySelectorAll(".review-card"));
  let timerId = null;
  let paused = false;
  let resetId = null;
  let activeIndex = 0;

  function getStep() {
    if (cards.length < 2) {
      return rail.clientWidth;
    }

    const first = cards[0].getBoundingClientRect();
    const second = cards[1].getBoundingClientRect();
    return Math.abs(second.left - first.left) || rail.clientWidth;
  }

  function resetPosition() {
    window.clearTimeout(resetId);
    resetId = null;
    activeIndex = 0;
    rail.classList.add("is-resetting");
    const previousScrollBehavior = rail.style.scrollBehavior;
    rail.style.scrollBehavior = "auto";
    rail.scrollLeft = 0;
    rail.scrollTo({ left: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rail.style.scrollBehavior = previousScrollBehavior;
        rail.classList.remove("is-resetting");
      });
    });
  }

  function syncActiveIndex() {
    const step = getStep();
    activeIndex = step ? Math.round(rail.scrollLeft / step) % originalCards.length : 0;
  }

  function advance() {
    if (paused) {
      return;
    }

    const step = getStep();
    if (!step) {
      return;
    }

    activeIndex += 1;
    const target = activeIndex * step;
    rail.scrollTo({ left: target, behavior: "smooth" });

    if (activeIndex >= originalCards.length) {
      window.clearTimeout(resetId);
      resetId = window.setTimeout(resetPosition, 1150);
    }
  }

  function start() {
    if (timerId) {
      return;
    }
    timerId = window.setInterval(advance, 2800);
  }

  function stop() {
    window.clearInterval(timerId);
    timerId = null;
  }

  function setPaused(value) {
    paused = value;
  }

  rail.addEventListener("pointerenter", () => setPaused(true));
  rail.addEventListener("pointerleave", () => {
    syncActiveIndex();
    setPaused(false);
  });
  rail.addEventListener("focusin", () => setPaused(true));
  rail.addEventListener("focusout", () => {
    syncActiveIndex();
    setPaused(false);
  });
  window.addEventListener("resize", resetPosition);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
          resetPosition();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(rail);
    return;
  }

  start();
}

function setupScreenDemos() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("[data-screen-demo]").forEach((demo) => {
    const screens = Array.from(demo.querySelectorAll("[data-demo-screen]"));
    const triggers = Array.from(demo.querySelectorAll("[data-demo-target]"));
    const menuToggles = Array.from(demo.querySelectorAll("[data-demo-menu-toggle]"));
    const demoMenus = Array.from(demo.querySelectorAll("[data-demo-menu]"));
    const stage = demo.querySelector(".screen-stage");
    if (!screens.length || !triggers.length) {
      return;
    }

    const autoCycleEnabled =
      demo.getAttribute("data-auto-cycle") === "true" &&
      screens.length > 1 &&
      !reducedMotion.matches;
    const autoCycleInterval = Math.max(1200, Number(demo.getAttribute("data-auto-cycle-interval")) || 1800);
    let autoCycleTimer = 0;
    let autoCyclePaused = false;
    let autoCycleInView = !("IntersectionObserver" in window);

    function clearAutoCycle() {
      if (autoCycleTimer) {
        window.clearTimeout(autoCycleTimer);
        autoCycleTimer = 0;
      }
    }

    function getActiveState() {
      return demo.querySelector(".demo-screen.is-active")?.getAttribute("data-demo-screen");
    }

    function getNextState() {
      const activeState = getActiveState();
      const activeIndex = screens.findIndex((screen) => screen.getAttribute("data-demo-screen") === activeState);
      const nextScreen = screens[(activeIndex + 1 + screens.length) % screens.length];
      return nextScreen?.getAttribute("data-demo-screen");
    }

    function scheduleAutoCycle(delay = autoCycleInterval) {
      clearAutoCycle();
      if (!autoCycleEnabled || autoCyclePaused || !autoCycleInView || document.hidden) {
        return;
      }

      autoCycleTimer = window.setTimeout(() => {
        const nextState = getNextState();
        if (nextState) {
          setState(nextState, { fromAutoCycle: true });
        }
        scheduleAutoCycle();
      }, delay);
    }

    function pauseAutoCycle() {
      autoCyclePaused = true;
      clearAutoCycle();
    }

    function resumeAutoCycle(delay = 700) {
      autoCyclePaused = false;
      scheduleAutoCycle(delay);
    }

    function closeDemoMenus() {
      demoMenus.forEach((menu) => {
        menu.setAttribute("aria-hidden", "true");
      });
      menuToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
      demo.classList.remove("is-demo-menu-open");
    }

    function setDemoMenuOpen(menuName, open) {
      let openedMenu = null;
      demoMenus.forEach((menu) => {
        const isTarget = menu.getAttribute("data-demo-menu") === menuName;
        const shouldOpen = open && isTarget;
        menu.setAttribute("aria-hidden", String(!shouldOpen));
        if (shouldOpen) {
          openedMenu = menu;
        }
      });
      menuToggles.forEach((toggle) => {
        const controlsMenu = toggle.getAttribute("data-demo-menu-toggle") === menuName;
        toggle.setAttribute("aria-expanded", String(open && controlsMenu));
      });
      demo.classList.toggle("is-demo-menu-open", Boolean(openedMenu));
    }

    function getMenuSelectedState(state) {
      return state === "lecture-record" ? "lecture-transcript" : state;
    }

    function updateTriggerStates(targetState) {
      const menuSelectedState = getMenuSelectedState(targetState);
      triggers.forEach((trigger) => {
        const triggerTarget = trigger.getAttribute("data-demo-target");
        const activeTarget = trigger.hasAttribute("data-demo-menu-option") ? menuSelectedState : targetState;
        const isActive = triggerTarget === activeTarget;
        trigger.classList.toggle("is-active", isActive);
        if (trigger.matches("button")) {
          trigger.setAttribute("aria-pressed", String(isActive));
        }
      });
    }

    if (stage) {
      stage.addEventListener(
        "wheel",
        (event) => {
          if (!stage.classList.contains("is-scrollable") || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
            return;
          }

          const maxScroll = stage.scrollHeight - stage.clientHeight;
          if (maxScroll <= 1) {
            return;
          }

          const previousTop = stage.scrollTop;
          const nextTop = Math.max(0, Math.min(maxScroll, previousTop + event.deltaY));
          const consumed = nextTop - previousTop;
          const remaining = event.deltaY - consumed;
          stage.scrollTop = nextTop;

          if (Math.abs(remaining) > 0.5) {
            window.scrollBy({ top: remaining, behavior: "auto" });
          }

          event.preventDefault();
        },
        { passive: false },
      );
    }

    function updateStageScrollability() {
      if (!stage) {
        return;
      }

      const activeScreen = demo.querySelector(".demo-screen.is-active");
      if (!activeScreen) {
        stage.classList.remove("is-scrollable");
        return;
      }

      const wantsScroll = activeScreen.getAttribute("data-scrollable-screen") === "true";
      if (!wantsScroll) {
        stage.classList.remove("is-scrollable");
        stage.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      const apply = () => {
        const renderedWidth = stage.clientWidth || activeScreen.getBoundingClientRect().width;
        const naturalRatio =
          activeScreen.naturalWidth > 0 && activeScreen.naturalHeight > 0
            ? activeScreen.naturalHeight / activeScreen.naturalWidth
            : 1;
        const imageHeight = renderedWidth * naturalRatio;
        const isScrollable = imageHeight > stage.clientHeight + 8;
        stage.classList.toggle("is-scrollable", isScrollable);
        const frameHeight = Number(activeScreen.getAttribute("data-scroll-frame-height"));
        if (isScrollable && frameHeight > 0 && activeScreen.naturalWidth > 0) {
          const coverWidth = Math.max(stage.clientWidth, stage.clientHeight * activeScreen.naturalWidth / frameHeight);
          const coverOffset = (stage.clientWidth - coverWidth) / 2;
          activeScreen.style.setProperty("--scroll-cover-width", `${coverWidth}px`);
          activeScreen.style.setProperty("--scroll-cover-offset", `${coverOffset}px`);
        } else {
          activeScreen.style.removeProperty("--scroll-cover-width");
          activeScreen.style.removeProperty("--scroll-cover-offset");
        }
        if (!isScrollable) {
          stage.scrollTo({ top: 0, behavior: "auto" });
        }
      };

      if (activeScreen.complete) {
        requestAnimationFrame(apply);
      } else {
        activeScreen.addEventListener("load", () => requestAnimationFrame(apply), { once: true });
      }
    }

    function setState(targetState, options = {}) {
      const current = demo.querySelector(".demo-screen.is-active");
      const next = screens.find((screen) => screen.getAttribute("data-demo-screen") === targetState);
      if (!next) {
        return;
      }
      if (next === current) {
        updateTriggerStates(targetState);
        closeDemoMenus();
        return;
      }

      demo.setAttribute("data-active-demo", targetState);
      closeDemoMenus();

      screens.forEach((screen) => {
        if (screen !== current) {
          screen.classList.remove("is-leaving");
        }
      });

      if (window.gsap) {
        window.gsap.killTweensOf(screens);
      }

      screens.forEach((screen) => {
        const isActive = screen === next;
        if (screen === current) {
          screen.classList.add("is-leaving");
          screen.classList.remove("is-active");
        } else {
          screen.classList.toggle("is-active", isActive);
        }
      });

      if (stage) {
        stage.scrollTo({ top: 0, behavior: "auto" });
      }
      updateStageScrollability();

      updateTriggerStates(targetState);

      if (window.gsap && !reducedMotion.matches) {
        window.gsap.set(next, { autoAlpha: 1, scale: 1, clearProps: "transform" });
        if (current) {
          window.gsap.to(current, {
            autoAlpha: 0,
            duration: 0.14,
            ease: "power3.out",
            overwrite: true,
            onComplete: () => {
              current.classList.remove("is-leaving");
              window.gsap.set(current, { clearProps: "opacity,visibility,transform" });
            },
          });
        }
      } else if (current) {
        window.setTimeout(() => {
          current.classList.remove("is-leaving");
        }, 260);
      }

      if (autoCycleEnabled && !options.fromAutoCycle) {
        scheduleAutoCycle(autoCycleInterval + 1200);
      }
    }

    const initialActiveScreen = demo.querySelector(".demo-screen.is-active");
    const initialState = initialActiveScreen?.getAttribute("data-demo-screen");
    if (initialState) {
      demo.setAttribute("data-active-demo", initialState);
    }

    triggers.forEach((trigger) => {
      const targetState = trigger.getAttribute("data-demo-target");
      trigger.addEventListener("click", () => setState(targetState));
    });
    if (initialState) {
      updateTriggerStates(initialState);
    }

    menuToggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const menuName = toggle.getAttribute("data-demo-menu-toggle");
        const willOpen = toggle.getAttribute("aria-expanded") !== "true";
        setDemoMenuOpen(menuName, willOpen);
        if (willOpen) {
          pauseAutoCycle();
        }
      });
    });

    demo.addEventListener("click", (event) => {
      if (event.target.closest("[data-demo-menu], [data-demo-menu-toggle]")) {
        return;
      }
      closeDemoMenus();
    });

    demo.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDemoMenus();
      }
    });

    updateStageScrollability();
    window.addEventListener("resize", updateStageScrollability);

    if (autoCycleEnabled) {
      const pauseSurface = demo.querySelector(".interactive-phone") || stage;
      if (pauseSurface) {
        pauseSurface.addEventListener("pointerenter", pauseAutoCycle);
        pauseSurface.addEventListener("pointerleave", () => resumeAutoCycle());
        pauseSurface.addEventListener("focusin", pauseAutoCycle);
        pauseSurface.addEventListener("focusout", () => resumeAutoCycle());
      }

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          clearAutoCycle();
        } else {
          scheduleAutoCycle(700);
        }
      });

      if ("IntersectionObserver" in window) {
        const autoCycleObserver = new IntersectionObserver(
          ([entry]) => {
            autoCycleInView = entry.isIntersecting;
            if (autoCycleInView) {
              scheduleAutoCycle(1400);
            } else {
              clearAutoCycle();
            }
          },
          { threshold: 0.36 },
        );
        autoCycleObserver.observe(demo);
      } else {
        scheduleAutoCycle(1400);
      }
    }
  });
}

function setupProofCalendarToggle() {
  document.querySelectorAll(".proof-media").forEach((media) => {
    const trigger = media.querySelector(".proof-calendar-target");
    const calendar = media.querySelector(".proof-calendar");
    if (!trigger || !calendar) {
      return;
    }

    function setOpen(isOpen) {
      media.classList.toggle("is-calendar-open", isOpen);
      trigger.setAttribute("aria-expanded", String(isOpen));
      calendar.setAttribute("aria-hidden", String(!isOpen));
    }

    trigger.addEventListener("click", () => {
      setOpen(!media.classList.contains("is-calendar-open"));
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.blur();
      }
    });

    setOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[data-preserve-lang]").forEach((link) => {
    link.setAttribute("data-base-href", link.getAttribute("href"));
  });

  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-lang-button")));
  });

  applyLanguage(getRequestedLanguage());
  setupProofCalendarToggle();
  setupScreenDemos();
  setupReviewCarousel();
  setupMotion();
});
