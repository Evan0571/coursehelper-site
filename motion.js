(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  function loop(video, target) {
    const state = { video, visible: false, enabled: true, failed: false };
    video.muted = true;
    video.loop = true;
    const sync = () => {
      if (
        state.enabled &&
        state.visible &&
        !state.failed &&
        !document.hidden &&
        !reduce.matches &&
        !navigator.connection?.saveData
      ) {
        if (!video.getAttribute("src") && video.dataset.src) {
          video.src = video.dataset.src;
          video.load();
        }
        if (video.paused) video.play().catch(() => {});
      } else video.pause();
    };
    new IntersectionObserver(
      (entries) => {
        state.visible = entries[0].isIntersecting;
        sync();
      },
      { threshold: 0.15 },
    ).observe(target);
    video.addEventListener("play", () => {
      if (!state.enabled || !state.visible || document.hidden || reduce.matches)
        video.pause();
    });
    video.addEventListener("error", () => {
      state.failed = true;
      target.classList.add("has-media-error");
    });
    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", sync);
    navigator.connection?.addEventListener("change", sync);
    state.sync = sync;
    return state;
  }
  const panels = [...document.querySelectorAll(".feature-panel")];
  const chapterPlayers = panels.map((panel) =>
    loop(panel.querySelector("video"), panel.querySelector(".motion-demo")),
  );
  loop(
    document.getElementById("hero-movie"),
    document.querySelector(".gallery-motion"),
  );
  const story = document.getElementById("feature-story");
  const viewport = story.querySelector(".feature-viewport");
  const track = story.querySelector(".feature-track");
  let horizontal;
  function selectChapter(key, behavior = "smooth") {
    const index = panels.findIndex((panel) => panel.dataset.current === key);
    if (index < 0) return;
    // Focus and hash navigation must not scroll the clipped rail itself.
    viewport.scrollLeft = 0;
    if (horizontal) {
      const trigger = horizontal.scrollTrigger;
      const top =
        trigger.start +
        ((trigger.end - trigger.start) * index) / (panels.length - 1);
      window.scrollTo({ top, behavior });
      if (behavior === "instant") {
        ScrollTrigger.update();
        trigger.getTween()?.progress(1);
      }
    } else panels[index].scrollIntoView({ behavior, block: "start" });
  }
  document.addEventListener("coursehelper:select-feature", (event) => {
    event.preventDefault();
    selectChapter(event.detail.key, reduce.matches ? "instant" : "smooth");
  });
  function hashChapter() {
    const key = location.hash.replace("#feature-", "");
    if (panels.some((panel) => panel.dataset.current === key)) {
      selectChapter(key, "instant");
      return true;
    }
    return false;
  }
  window.addEventListener("hashchange", hashChapter);
  story.addEventListener("focusin", (event) => {
    const panel = event.target.closest(".feature-panel");
    if (horizontal && panel) selectChapter(panel.dataset.current, "instant");
  });
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.addEventListener("coursehelper:language", () =>
      ScrollTrigger.refresh(),
    );
  }
  function initialChapter() {
    window.ScrollTrigger?.refresh();
    const key = new URLSearchParams(location.search).get("feature");
    if (
      !hashChapter() &&
      panels.some((panel) => panel.dataset.current === key)
    ) {
      selectChapter(key, "instant");
    }
  }
  if (document.readyState === "complete") requestAnimationFrame(initialChapter);
  else
    window.addEventListener(
      "load",
      () => requestAnimationFrame(initialChapter),
      { once: true },
    );
  if (!window.gsap || !window.ScrollTrigger) return;
  const mm = gsap.matchMedia();
  mm.add(
    "(min-width: 960px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)",
    () => {
      story.classList.add("is-horizontal");
      let currentIndex = -1;
      function syncChapter() {
        const index = Math.round(
          (horizontal?.progress() || 0) * (panels.length - 1),
        );
        if (index === currentIndex) return;
        currentIndex = index;
        story.dataset.chapter = panels[index].dataset.current;
        chapterPlayers.forEach((player, i) => {
          player.enabled = i === index;
          player.sync();
        });
      }
      horizontal = gsap.to(track, {
        x: () => -(track.scrollWidth - viewport.clientWidth),
        ease: "none",
        onUpdate: syncChapter,
        scrollTrigger: {
          id: "feature-story",
          trigger: story,
          start: "top 112px",
          end: () =>
            "+=" +
            (panels.length - 1) *
              Math.max(innerHeight, viewport.clientWidth + 24),
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      syncChapter();
      return () => {
        horizontal = null;
        story.classList.remove("is-horizontal");
        delete story.dataset.chapter;
        viewport.scrollLeft = 0;
        chapterPlayers.forEach((player) => {
          player.enabled = true;
          player.sync();
        });
      };
    },
  );
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(".hero h1 > span", {
      y: 26,
      opacity: 0,
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
    gsap.from(".hero-description, .hero-actions", {
      y: 14,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      delay: 0.15,
      clearProps: "transform,opacity",
    });
    document
      .querySelectorAll(
        ".intro-grid, .section-heading, .ai-copy, .practice-copy, .details-grid article",
      )
      .forEach((el) => {
        gsap.from(el, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
    gsap.from(".context-orbit", {
      scale: 0.9,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power2.out",
      clearProps: "transform,opacity",
      scrollTrigger: {
        trigger: ".context-visual",
        start: "top 85%",
        once: true,
      },
    });
    gsap.fromTo(
      ".context-lines path",
      { strokeDashoffset: 50 },
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".context-visual",
          start: "top 85%",
          once: true,
        },
      },
    );
    document.querySelectorAll(".gallery-card").forEach((el) => {
      const hover = gsap.to(el, {
        y: -6,
        duration: 0.3,
        ease: "power2.out",
        paused: true,
      });
      const enter = () => hover.play(),
        leave = () => hover.reverse();
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });
  });
})();
