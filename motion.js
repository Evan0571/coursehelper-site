(() => {
  "use strict";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const handheld = () => document.documentElement.classList.contains("handheld");
  const players = new Map();
  const panels = [...document.querySelectorAll(".feature-panel")];
  const spatialProduction = document.documentElement.classList.contains("spatial-preview");
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const player = players.get(entry.target);
      player.ratio = entry.intersectionRatio;
    }
    syncPlayback();
  }, { threshold: [0, .15, .25, .4, .55, .7, .85, 1] });

  // A phone shows the film already on the page. Give playback to the most visible one.
  function syncPlayback(preferred) {
    let active;
    if (handheld()) {
      for (const player of players.values()) {
        if (player.enabled && player.ratio >= .25 && (!active || player.ratio > active.ratio))
          active = player;
      }
      if (preferred?.enabled && preferred.ratio > 0) active = preferred;
    }
    for (const player of players.values()) {
      const visible = handheld() ? player === active : player.ratio > 0;
      player.sync(visible && player.enabled && !document.hidden);
    }
  }

  function loop(video, target) {
    const panel = target.closest(".feature-panel");
    const player = { enabled: true, ratio: 0, sync, setEnabled };
    let choice = "auto";
    let blocked = false;
    let pending;
    let button, errorNote;
    video.muted = true;
    video.loop = true;

    function updateControls() {
      const error = Boolean(video.error);
      target.classList.toggle("has-media-error", error);
      if (!button) return;
      const zh = document.documentElement.lang.startsWith("zh");
      const label = error ? (zh ? "重试" : "Retry") :
        video.paused ? (zh ? "播放" : "Play") : (zh ? "暂停" : "Pause");
      button.textContent = label;
      button.setAttribute("aria-label", label + " · " + panel.querySelector(".feature-chapter > :last-child").textContent);
      errorNote.textContent = error ? (zh ? "视频暂时无法播放。" : "This video couldn’t load.") : "";
    }
    function sync(visible) {
      const manual = handheld() && choice === "play";
      const allowAuto = !reduce.matches && !navigator.connection?.saveData;
      if (!visible || (!manual && !allowAuto) || (handheld() && choice === "pause") || blocked || video.error) {
        pending = undefined;
        if (!video.paused) video.pause();
        return;
      }
      if (!video.hasAttribute("src")) video.src = video.dataset.src;
      if (!video.paused || pending) return;
      const attempt = video.play();
      pending = attempt;
      attempt.catch(error => {
        if (pending === attempt && error.name !== "AbortError") blocked = true;
      }).finally(() => {
        if (pending === attempt) pending = undefined;
        updateControls();
      });
    }
    function setEnabled(enabled) {
      if (player.enabled === enabled) return;
      player.enabled = enabled;
      player.ratio = 0;
      observer.unobserve(target);
      if (enabled) observer.observe(target);
      syncPlayback();
    }

    if (panel) {
      video.id = panel.id + "-film";
      button = document.createElement("button");
      button.className = "film-toggle";
      button.type = "button";
      button.setAttribute("aria-controls", video.id);
      errorNote = document.createElement("p");
      errorNote.className = "film-error-note";
      errorNote.setAttribute("role", "status");
      target.append(button, errorNote);
      button.addEventListener("click", () => {
        choice = video.paused || video.error ? "play" : "pause";
        blocked = false;
        if (video.error) video.load();
        if (choice === "play") target.classList.add("is-manual");
        syncPlayback(player);
        updateControls();
      });
    }
    for (const event of ["play", "pause", "error", "emptied"]) video.addEventListener(event, updateControls);
    document.addEventListener("coursehelper:language", () => {
      if (video.hasAttribute("src") && video.getAttribute("src") !== video.dataset.src) {
        pending = undefined;
        blocked = false;
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
      updateControls();
      syncPlayback();
    });
    updateControls();
    players.set(target, player);
    observer.observe(target);
    return player;
  }
  document.addEventListener("visibilitychange", () => syncPlayback());
  document.addEventListener("coursehelper:layout", () => syncPlayback());
  reduce.addEventListener("change", () => syncPlayback());
  navigator.connection?.addEventListener("change", () => syncPlayback());
  const chapterPlayers = panels.map(panel =>
    loop(panel.querySelector("video"), panel.querySelector(".motion-demo"))
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
    if (handheld()) return;
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
