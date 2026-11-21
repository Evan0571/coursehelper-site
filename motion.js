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
    const observer = new IntersectionObserver(([entry]) => {
      state.visible = entry.isIntersecting;
      sync();
    }, { threshold: 0.15 });
    observer.observe(target);
    video.addEventListener("play", () => {
      if (!state.enabled || !state.visible || document.hidden || reduce.matches)
        video.pause();
    });
    video.addEventListener("error", () => {
      state.failed = true;
      target.classList.add("has-media-error");
    });
    document.addEventListener("coursehelper:language", () => {
      if (video.getAttribute("src") && video.getAttribute("src") !== video.dataset.src) {
        video.pause();
        video.removeAttribute("src");
        video.load();
        state.failed = false;
        target.classList.remove("has-media-error");
      }
      sync();
    });
    document.addEventListener("visibilitychange", sync);
    reduce.addEventListener("change", sync);
    navigator.connection?.addEventListener("change", sync);
    return {
      setEnabled(enabled) {
        if (state.enabled === enabled) return;
        state.enabled = enabled;
        observer.disconnect();
        observer.takeRecords();
        state.visible = false;
        // A newly revealed film needs a fresh intersection after the pin and clip have moved.
        if (enabled) observer.observe(target);
        sync();
      },
    };
  }
  const panels = [...document.querySelectorAll(".feature-panel")];
  const spatialProduction = document.documentElement.classList.contains("spatial-preview");
  const chapterPlayers = panels.map((panel) =>
    loop(panel.querySelector("video"), panel.querySelector(".motion-demo")),
  );
  if (!spatialProduction) loop(
    document.getElementById("hero-movie"),
    document.querySelector(".gallery-motion"),
  );
  const story = document.getElementById("feature-story");
  const viewport = story.querySelector(".feature-viewport");
  const track = story.querySelector(".feature-track");
  const lastChapter = panels.length - 1;
  let horizontal;
  function selectChapter(key, behavior = "smooth") {
    const index = panels.findIndex((panel) => panel.dataset.current === key);
    if (index < 0) return;
    // Focus and hash navigation must not scroll the clipped rail itself.
    viewport.scrollLeft = 0;
    if (horizontal) {
      const trigger = horizontal.scrollTrigger;
      const top = trigger.start + (trigger.end - trigger.start) * index / lastChapter;
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
    if (spatialProduction && (location.hash === "#context" || location.hash === "#practice")) {
      const chapter = location.hash === "#context" ? "ask" : "review";
      history.replaceState(history.state, "", "#feature-" + chapter);
    }
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
    if (horizontal && panel) {
      selectChapter(panel.dataset.current, "instant");
    }
  });
  story.addEventListener("keydown", (event) => {
    if (!horizontal || !panels.includes(document.activeElement)) return;
    const i = panels.indexOf(document.activeElement);
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
    if (!direction || !panels[i + direction]) return;
    event.preventDefault();
    panels[i + direction].focus({ preventScroll: true });
  });
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.addEventListener("coursehelper:language", () => {
      const pinned = [horizontal?.scrollTrigger, ScrollTrigger.getById("lecture-margins")]
        .find((trigger) => trigger?.isActive);
      const progress = pinned?.animation.progress();
      ScrollTrigger.refresh();
      if (pinned) {
        window.scrollTo({ top: pinned.start + progress * (pinned.end - pinned.start), behavior: "instant" });
        ScrollTrigger.update();
        pinned.getTween()?.progress(1);
      }
    });
  }
  function initialChapter() {
    window.ScrollTrigger?.refresh();
    if (location.hash === "#study-habits") {
      // Pinning the preceding chapters changes the position of the native anchor.
      document.getElementById("study-habits")?.scrollIntoView({ behavior: "instant" });
      return;
    }
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
      let previousPosition;
      let currentIndex;
      let resumeTimer;
      story.classList.add("is-horizontal");
      panels.forEach((panel) => { panel.tabIndex = 0; });

      function playChapter(index) {
        chapterPlayers.forEach((player, i) => player.setEnabled(i === index));
      }
      function syncPlayback(position) {
        if (previousPosition === position) return;
        const index = Math.round(position);
        if (index !== currentIndex) {
          currentIndex = index;
          story.dataset.chapter = panels[index].dataset.current;
        }
        if (previousPosition === undefined) {
          playChapter(index);
        } else {
          if (resumeTimer === undefined) playChapter(-1);
          clearTimeout(resumeTimer);
          resumeTimer = setTimeout(() => {
            resumeTimer = undefined;
            playChapter(currentIndex);
          }, 140);
        }
        previousPosition = position;
      }
      horizontal = gsap.to(track, {
        x: () => viewport.clientWidth - track.scrollWidth,
        ease: "none",
        onUpdate() { syncPlayback(this.progress() * lastChapter); },
        scrollTrigger: {
          id: "feature-story",
          trigger: story,
          start: "top 112px",
          end: () => "+=" + (track.scrollWidth - viewport.clientWidth),
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (trigger) => syncPlayback(trigger.animation.progress() * lastChapter),
        },
      });
      syncPlayback(horizontal.progress() * lastChapter);
      return () => {
        clearTimeout(resumeTimer);
        horizontal = null;
        story.classList.remove("is-horizontal");
        panels.forEach((panel) => {
          panel.removeAttribute("tabindex");
        });
        delete story.dataset.chapter;
        chapterPlayers.forEach((player) => player.setEnabled(true));
      };
    },
  );
  if (spatialProduction) return;
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
      .querySelectorAll(".section-heading, .practice-copy")
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
