(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const players = [];
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
    state.reset = (src) => {
      video.pause();
      state.failed = false;
      target.classList.remove("has-media-error");
      video.removeAttribute("src");
      video.dataset.src = src;
      video.load();
      sync();
    };
    players.push(state);
    return state;
  }
  const panel = document.getElementById("feature-panel");
  const demo = document.getElementById("motion-demo");
  const video = document.getElementById("feature-movie");
  const feature = loop(video, demo);
  loop(
    document.getElementById("hero-movie"),
    document.querySelector(".gallery-motion"),
  );
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  let current;
  function render(key) {
    if (!["organize", "capture", "ask", "review"].includes(key)) return;
    demo.hidden = false;
    panel.classList.add("has-movie");
    const poster = `assets/motion/v3/${key}-poster.webp`;
    document.getElementById("movie-poster").src = poster;
    video.poster = poster;
    demo.querySelector(".film-note").textContent =
      document.documentElement.lang.startsWith("zh")
        ? "App 操作演示 · 示例内容"
        : "APP WALKTHROUGH · SAMPLE CONTENT";
    if (current !== key) {
      current = key;
      feature.reset(`assets/motion/v3/${key}.mp4?v=actions`);
    }
    if (window.gsap && !reduce.matches) {
      gsap.fromTo(
        ".feature-copy > h3, .feature-copy > p, .feature-details",
        { y: 12, opacity: 0.35 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.055,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true,
        },
      );
    }
    feature.sync();
    window.ScrollTrigger?.refresh();
  }
  document.addEventListener("coursehelper:feature", (e) =>
    render(e.detail.key),
  );
  render(panel.dataset.current);
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
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
