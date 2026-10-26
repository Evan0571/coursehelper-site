(() => {
  "use strict";
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const connection = navigator.connection;
  const copy = {
    en: {
      sample: "APP DEMO · SAMPLE DATA",
      sampleShort: "APP DEMO · SAMPLE DATA",
      animated: "ANIMATED PREVIEW · SAMPLE DATA",
      animatedShort: "ANIMATED PREVIEW",
      play: "Play demo",
      pause: "Pause demo",
      replay: "Replay demo",
      progress: "Demo progress",
      steps: "Demo steps",
      error:
        "The video couldn’t load. You can still explore the sample interface above.",
      capture: [
        "Keep the moment",
        "Save the recording",
        "Choose transcription",
      ],
      review: ["Recall the idea", "Reveal the answer"],
      captureDescription:
        "Record. Save. Choose how to transcribe. A short walkthrough with sample data.",
      reviewDescription:
        "A moment to think, a tap to reveal, a little more understood.",
      captureLabel:
        "App demo: recording, saving and choosing a transcription method. Sample data.",
      reviewLabel:
        "Animated interface preview: thinking through a biology flashcard and revealing the answer. Sample data.",
    },
    zh: {
      sample: "APP 操作演示 · 示例数据",
      sampleShort: "APP 演示 · 示例数据",
      animated: "界面动效示意 · 示例数据",
      animatedShort: "界面动效示意 · 示例数据",
      play: "播放演示",
      pause: "暂停演示",
      replay: "重新播放",
      progress: "演示进度",
      steps: "演示步骤",
      error: "视频暂时无法加载，你仍可以查看上方的示例界面。",
      capture: ["留下课堂", "保存录音", "选择转录方式"],
      review: ["试着回想", "翻开答案"],
      captureDescription:
        "录音、保存、选择转录方式。用一段操作，走近你的课堂。",
      reviewDescription: "先想一想，再翻开答案。让理解，多停留一会儿。",
      captureLabel: "App 操作演示：录音、保存和选择转录方式。使用示例数据。",
      reviewLabel:
        "界面动效示意：回想生物学闪卡的问题，再翻开答案。使用示例数据。",
    },
  };
  const clips = {
    capture: { starts: [0, 1.1, 7.4], duration: 11.2 },
    review: { starts: [0, 1.95], duration: 5.5 },
  };
  const panel = document.getElementById("feature-panel");
  const demo = document.getElementById("motion-demo");
  const video = document.getElementById("feature-movie");
  const progress = document.getElementById("movie-progress");
  const chapters = document.getElementById("movie-chapters");
  const time = document.getElementById("movie-time");
  const error = document.getElementById("motion-error");
  let language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
  let activeClip = null;
  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

  function player(element, button, visibilityTarget) {
    const state = {
      element,
      button,
      inView: false,
      userPaused: false,
      explicit: false,
      failed: false,
      enabled: true,
      pendingSeek: null,
      completed: false,
    };
    element.muted = true;
    const label = () => {
      const playing = !element.paused && !state.failed;
      button.setAttribute(
        "aria-label",
        copy[language][playing ? "pause" : state.completed ? "replay" : "play"],
      );
      button.title = button.getAttribute("aria-label");
      button.dataset.playing = String(playing);
      visibilityTarget.classList.toggle("is-playing", playing);
    };
    const load = () => {
      if (!element.getAttribute("src") && element.dataset.src) {
        element.src = element.dataset.src;
        element.load();
      }
    };
    const canPlay = () =>
      state.enabled &&
      state.inView &&
      !document.hidden &&
      !state.userPaused &&
      !state.completed &&
      !state.failed &&
      (state.explicit || (!reducedMotion.matches && !connection?.saveData));
    const reconcile = () => {
      if (canPlay()) {
        load();
        if (element.paused) element.play().catch(() => label());
      } else element.pause();
      label();
    };
    const seek = (seconds, startPlaying = false) => {
      if (state.failed) return;
      state.pendingSeek = seconds;
      state.completed = false;
      if (startPlaying) {
        state.userPaused = false;
        state.explicit = true;
      }
      load();
      if (element.readyState >= 1) {
        element.currentTime = Math.min(seconds, element.duration || seconds);
        state.pendingSeek = null;
      }
      reconcile();
    };
    element.addEventListener("loadedmetadata", () => {
      if (state.pendingSeek !== null) {
        element.currentTime = Math.min(state.pendingSeek, element.duration);
        state.pendingSeek = null;
      }
    });
    button.addEventListener("click", () => {
      if (state.completed) {
        seek(0, true);
        return;
      }
      state.userPaused = !element.paused;
      if (!state.userPaused) state.explicit = true;
      reconcile();
    });
    element.addEventListener("play", () => {
      // A delayed play request must not keep a hidden preview running.
      if (!canPlay()) element.pause();
      label();
    });
    element.addEventListener("pause", label);
    element.addEventListener("ended", () => {
      state.completed = true;
      label();
    });
    element.addEventListener("error", () => {
      state.failed = true;
      element.pause();
      button.disabled = true;
      visibilityTarget.classList.add("has-media-error");
      label();
    });
    new IntersectionObserver(
      (entries) => {
        state.inView = entries[0].isIntersecting;
        reconcile();
      },
      { threshold: 0.3 },
    ).observe(visibilityTarget);
    document.addEventListener("visibilitychange", reconcile);
    reducedMotion.addEventListener("change", () => {
      state.explicit = false;
      reconcile();
    });
    connection?.addEventListener("change", reconcile);
    return Object.assign(state, {
      label,
      reconcile,
      seek,
      reset() {
        element.pause();
        element.removeAttribute("src");
        element.load();
        state.pendingSeek = null;
        state.failed = false;
        state.explicit = false;
        state.completed = false;
        button.disabled = false;
        visibilityTarget.classList.remove("has-media-error");
      },
    });
  }

  const feature = player(video, document.getElementById("movie-toggle"), demo);
  const hero = player(
    document.getElementById("hero-movie"),
    document.getElementById("hero-movie-toggle"),
    document.querySelector(".gallery-motion"),
  );
  document.querySelector(".hero-movie-bar").hidden = false;

  function updateProgress() {
    if (!activeClip) return;
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : clips[activeClip].duration;
    const current = video.currentTime || 0;
    const percent = (current / duration) * 100;
    progress.value = percent;
    progress.style.setProperty("--progress", `${percent}%`);
    progress.setAttribute(
      "aria-valuetext",
      `${formatTime(current)} / ${formatTime(duration)}`,
    );
    time.textContent = formatTime(current);
    const index = clips[activeClip].starts.findLastIndex(
      (start) => current + 0.05 >= start,
    );
    [...chapters.children].forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === index)),
    );
  }
  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("loadedmetadata", updateProgress);
  video.addEventListener("error", () => {
    error.textContent = copy[language].error;
    error.hidden = false;
    progress.disabled = true;
    document.getElementById("movie-replay").disabled = true;
    [...chapters.children].forEach((button) => (button.disabled = true));
  });
  progress.addEventListener("input", () => {
    const duration = Number.isFinite(video.duration)
      ? video.duration
      : clips[activeClip].duration;
    feature.seek((Number(progress.value) / 100) * duration);
    updateProgress();
  });
  document
    .getElementById("movie-replay")
    .addEventListener("click", () => feature.seek(0, true));

  function render(key) {
    const nextClip = clips[key] ? key : null;
    language = document.documentElement.lang.startsWith("zh") ? "zh" : "en";
    document.querySelectorAll("[data-motion-copy]").forEach((node) => {
      node.textContent = copy[language][node.dataset.motionCopy];
    });
    feature.enabled = Boolean(nextClip);
    demo.hidden = !nextClip;
    panel.classList.toggle("has-movie", Boolean(nextClip));
    if (nextClip !== activeClip) {
      feature.reset();
      activeClip = nextClip;
      error.hidden = true;
      progress.disabled = false;
      document.getElementById("movie-replay").disabled = false;
      if (nextClip) {
        video.dataset.src = `assets/motion/${nextClip}.mp4?v=20261026-mobile2`;
        video.poster = `assets/motion/${nextClip}-poster.webp?v=20261026-mobile2`;
        document
          .querySelector(".motion-phone")
          .style.setProperty("--poster", `url("${video.poster}")`);
      } else delete video.dataset.src;
    }
    if (nextClip) {
      demo.querySelector('[data-motion-copy="sample"]').textContent =
        copy[language][nextClip === "review" ? "animated" : "sample"];
      video.setAttribute("aria-label", copy[language][`${nextClip}Label`]);
      document.getElementById("motion-description").textContent =
        copy[language][`${nextClip}Description`];
      document
        .getElementById("movie-replay")
        .setAttribute("aria-label", copy[language].replay);
      progress.setAttribute("aria-label", copy[language].progress);
      chapters.setAttribute("aria-label", copy[language].steps);
      chapters.style.setProperty(
        "--chapter-count",
        clips[nextClip].starts.length,
      );
      chapters.replaceChildren(
        ...copy[language][nextClip].map((title, i) => {
          const button = document.createElement("button");
          button.type = "button";
          button.disabled = feature.failed;
          const number = document.createElement("span");
          number.textContent = `0${i + 1}`;
          number.setAttribute("aria-hidden", "true");
          button.append(number, document.createTextNode(title));
          button.addEventListener("click", () => {
            feature.seek(clips[nextClip].starts[i], true);
            updateProgress();
          });
          return button;
        }),
      );
      if (feature.failed) error.textContent = copy[language].error;
      updateProgress();
    }
    feature.reconcile();
    hero.label();
  }
  document.addEventListener("coursehelper:feature", (event) =>
    render(event.detail.key),
  );
  render(panel.dataset.current);

  // One entrance per element. Product videos have their own visibility lifecycle.
  const reveal = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          reveal.unobserve(entry.target);
        }
      }),
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(
      ".intro-grid, .ai-copy, .context-visual, .details-grid article",
    )
    .forEach((node) => {
      node.classList.add("motion-reveal");
      reveal.observe(node);
    });
})();
