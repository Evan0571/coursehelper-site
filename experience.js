(() => {
  "use strict";
  if (new URLSearchParams(location.search).get("experience") !== "spatial")
    return;
  const template = document.getElementById("spatial-template");
  const main = document.getElementById("main");
  if (!template || !main) return;
  main.prepend(template.content.cloneNode(true));
  document.documentElement.classList.add("spatial-preview");
  const scene = document.getElementById("experience");
  const stage = scene.querySelector(".spatial-stage");
  const cards = [...scene.querySelectorAll("[data-spatial-feature]")];
  cards.forEach((card) => {
    const motion = document.createElement("span");
    motion.className = "spatial-card-motion";
    motion.append(card.querySelector(".spatial-card-face"));
    card.append(motion);
  });
  scene.querySelector(".spatial-recall-stack").outerHTML =
    `<span class="spatial-review-kit" aria-hidden="true">
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="7" y="5" width="13" height="16" rx="3"/><path d="M4 17V6a3 3 0 0 1 3-3h9M11 10h5M11 14h4"/></svg></span>
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 7 2 2 3-4M12 7h8M4 15h4v4H4zM12 17h8"/></svg></span>
    <span class="kit-letters">Aa</span>
    <span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1ZM12 6v14"/></svg></span>
  </span>`;
  const phone = scene.querySelector(".spatial-device");
  const dragPose = scene.querySelector(".spatial-phone-drag");
  const parallax = scene.querySelector(".spatial-parallax");
  const poster = scene.querySelector(".spatial-poster");
  const video = scene.querySelector("video");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const base = "assets/motion/v3/";
  const version = "20261104-spatial";
  const phonePose = {
    pitch: 5,
    yaw: -14,
    roll: innerWidth <= 620 ? -7 : -9,
    turn: 0,
    lean: 0,
  };
  let phone3d = null;
  let phoneImport = null;
  function syncPhonePose() {
    if (phone3d) {
      phone3d.requestDraw();
    } else {
      scene.querySelector(".spatial-phone-pose").style.transform =
        `rotate(${phonePose.roll}deg)`;
      dragPose.style.transform = `rotateY(${phonePose.turn}deg) rotateZ(${phonePose.lean}deg)`;
    }
  }
  function enablePhone3d() {
    if (reduce.matches || navigator.connection?.saveData || phoneImport) return;
    phoneImport = import("./assets/experiences/phone3d.js?v=20261104-body2")
      .then(({ mountPhone }) => {
        phone3d = mountPhone({
          host: phone,
          stage,
          video,
          poster,
          pose: phonePose,
          onFallback() {
            phone3d = null;
            syncPhonePose();
          },
        });
        if (phone3d) {
          scene.querySelector(".spatial-phone-pose").style.transform = "none";
          dragPose.style.transform = "none";
          syncPhonePose();
        }
      })
      .catch(() => {
        phoneImport = null;
      });
  }
  let selected = "organize";
  let visible = false;
  let mediaFailed = false;
  let syncCardMotion = () => {};
  let language;
  const copy = {
    en: {
      line1: "Less scattered.",
      line2: "More understood.",
      unfoldTitle: "One course. Everything connected.",
      unfoldBody: "Your schedule, recordings, questions, and review.",
      course: "Your course",
      biology: "Cell biology",
      monday: "MON",
      recording: "Keep the lecture",
      lecture: "Enzymes & cellular energy",
      ask: "Work it out",
      question: "How do enzymes lower activation energy?",
      source: "With sources from class",
      review: "Make it stick",
      recall: "Flashcards, quizzes & study guides.",
      hint: "Drag the phone. Pick a card.",
      explore: "Scroll to explore",
      demo: "Interactive preview · Sample content · App UI in English",
      original: "Original site",
      rotate:
        "Rotate the phone. Use left and right arrow keys; Escape to reset.",
      poster: "CourseHelper app demonstration: ",
      organize: "Course organization",
      capture: "Lecture recording",
      reviewName: "Flashcard review",
      askName: "Questions and sources",
    },
    zh: {
      line1: "少一点散乱。",
      line2: "多一点理解。",
      unfoldTitle: "一门课，所有思路接起来。",
      unfoldBody: "课表、录音、提问与复习，留在同一门课里。",
      course: "安排课程",
      biology: "细胞生物学",
      monday: "周一",
      recording: "留下课堂",
      lecture: "酶与细胞能量",
      ask: "继续理解",
      question: "酶如何降低活化能？",
      source: "回答连着课堂来源",
      review: "把它记住",
      recall: "闪卡、测验与学习指南。",
      hint: "拖动手机，点击卡片。",
      explore: "向下探索",
      demo: "交互预览 · 示例内容 · App 界面为英文",
      original: "查看原版",
      rotate: "转动手机。也可用左右方向键转动，Esc 复位。",
      poster: "CourseHelper 操作演示：",
      organize: "课程整理",
      capture: "课堂录音",
      reviewName: "闪卡复习",
      askName: "提问与引用",
    },
  };
  const names = {
    organize: "organize",
    capture: "capture",
    ask: "askName",
    review: "reviewName",
  };
  function translate() {
    language = document.documentElement.lang === "zh-Hans" ? "zh" : "en";
    scene.querySelectorAll("[data-spatial-copy]").forEach((el) => {
      el.textContent = copy[language][el.dataset.spatialCopy];
    });
    phone.setAttribute("aria-label", copy[language].rotate);
    poster.alt = copy[language].poster + copy[language][names[selected]];
    const original = new URL(location.href);
    original.searchParams.delete("experience");
    original.searchParams.set("lang", language);
    original.hash = "";
    scene.querySelector("[data-spatial-original]").href =
      original.pathname + original.search;
  }
  document.addEventListener("coursehelper:language", translate);
  translate();
  // A fixed illustrative waveform; it does not claim that the browser is recording.
  const heights = [
    4, 7, 12, 6, 16, 26, 18, 32, 41, 29, 19, 12, 8, 14, 23, 37, 48, 32, 21, 13,
    8, 5, 10, 19, 34, 43, 28, 16, 9, 5, 3,
  ];
  scene.querySelector(".spatial-wave").replaceChildren(
    ...heights.map((height) => {
      const bar = document.createElement("i");
      bar.style.setProperty("--bar-height", height + "px");
      bar.style.setProperty("--wave-delay", (height % 13) * -0.17 + "s");
      return bar;
    }),
  );
  function canPlay() {
    return (
      visible &&
      !document.hidden &&
      !reduce.matches &&
      !navigator.connection?.saveData &&
      !mediaFailed
    );
  }
  function syncMedia() {
    scene.classList.toggle(
      "is-motion-active",
      visible &&
        !document.hidden &&
        !reduce.matches &&
        !navigator.connection?.saveData,
    );
    syncCardMotion();
    if (!canPlay()) {
      video.pause();
      return;
    }
    const src = base + selected + ".mp4?v=" + version;
    if (video.getAttribute("src") !== src) {
      video.classList.remove("is-ready");
      video.src = src;
      video.load();
    }
    video.play().catch(() => {});
  }
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncMedia();
    },
    { threshold: 0.25 },
  ).observe(stage);
  video.addEventListener("playing", () => {
    if (canPlay()) video.classList.add("is-ready");
    else video.pause();
  });
  video.addEventListener("error", () => {
    mediaFailed = true;
    video.classList.remove("is-ready");
  });
  function select(feature) {
    if (feature === selected) return;
    selected = feature;
    mediaFailed = false;
    video.pause();
    video.classList.remove("is-ready");
    poster.src = base + selected + "-poster.webp";
    poster.alt = copy[language].poster + copy[language][names[selected]];
    cards.forEach((card) => {
      const active = card.dataset.spatialFeature === selected;
      card.classList.toggle("is-selected", active);
      card.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("spatial-announcement").textContent =
      copy[language][names[selected]];
    syncMedia();
  }
  cards.forEach((card) =>
    card.addEventListener("click", () => select(card.dataset.spatialFeature)),
  );
  cards.forEach((card) => {
    let bounds;
    const face = card.querySelector(".spatial-card-face");
    card.addEventListener("pointerenter", () => {
      bounds = card.getBoundingClientRect();
    });
    card.addEventListener("pointermove", (event) => {
      if (event.pointerType !== "mouse" || reduce.matches || !bounds) return;
      face.style.setProperty(
        "--light-x",
        Math.max(
          0,
          Math.min(100, ((event.clientX - bounds.left) / bounds.width) * 100),
        ) + "%",
      );
      face.style.setProperty(
        "--light-y",
        Math.max(
          0,
          Math.min(100, ((event.clientY - bounds.top) / bounds.height) * 100),
        ) + "%",
      );
    });
  });
  document.addEventListener("visibilitychange", syncMedia);
  navigator.connection?.addEventListener("change", syncMedia);
  navigator.connection?.addEventListener("change", enablePhone3d);
  reduce.addEventListener("change", () => {
    video.classList.remove("is-ready");
    syncMedia();
    syncPhoneAccess();
    enablePhone3d();
  });
  function syncPhoneAccess() {
    phone.setAttribute("aria-disabled", String(reduce.matches));
    phone.tabIndex = reduce.matches ? -1 : 0;
  }
  syncPhoneAccess();
  enablePhone3d();
  if (!window.gsap || !window.ScrollTrigger) {
    scene.classList.add("is-static");
    phone.setAttribute("aria-disabled", "true");
    phone.tabIndex = -1;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (!reduce.matches && !navigator.connection?.saveData) {
    gsap.from(scene.querySelectorAll(".spatial-card-face"), {
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: "power2.out",
      clearProps: "opacity",
    });
  }
  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 620px)",
      narrow: "(max-width: 960px)",
      compact: "(max-width: 760px)",
      short: "(max-height: 740px)",
    },
    (context) => {
      const { motion, mobile, short } = context.conditions;
      if (!motion) return;
      let drag = null;
      let angle = 0;
      const limitTurn = gsap.utils.clamp(-24, 24);
      const floats = cards.map((card, index) =>
        gsap.to(card.querySelector(".spatial-card-motion"), {
          y: index % 2 ? 2.5 : -2.5,
          duration: 2.8 + index * 0.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        }),
      );
      syncCardMotion = () =>
        floats.forEach((float) => {
          if (
            visible &&
            !document.hidden &&
            !reduce.matches &&
            !navigator.connection?.saveData
          )
            float.resume();
          else float.pause();
        });
      syncCardMotion();
      phonePose.pitch = 5;
      phonePose.yaw = -14;
      phonePose.roll = mobile ? -7 : -9;
      phonePose.turn = 0;
      phonePose.lean = 0;
      syncPhonePose();
      const rotateY = gsap.quickTo(phonePose, "turn", {
        duration: 0.45,
        ease: "power3.out",
        onUpdate: syncPhonePose,
      });
      const rotateZ = gsap.quickTo(phonePose, "lean", {
        duration: 0.45,
        ease: "power3.out",
        onUpdate: syncPhonePose,
      });
      const driftY = gsap.quickTo(parallax, "y", {
        duration: 0.8,
        ease: "power3.out",
      });
      const driftX = gsap.quickTo(parallax, "x", {
        duration: 0.8,
        ease: "power3.out",
      });
      const pointerDown = (event) => {
        if (event.button !== 0) return;
        drag = { x: event.clientX, y: event.clientY, angle };
        phone.setPointerCapture(event.pointerId);
        phone.classList.add("is-dragging");
      };
      const pointerMove = (event) => {
        if (drag) {
          angle = limitTurn(drag.angle + (event.clientX - drag.x) * 0.24);
          rotateY(angle);
          rotateZ(gsap.utils.clamp(-7, 7, (event.clientY - drag.y) * -0.08));
        } else if (event.pointerType === "mouse" && !mobile) {
          driftX((event.clientX / innerWidth - 0.5) * 8);
          driftY((event.clientY / innerHeight - 0.5) * 5);
        }
      };
      const reset = () => {
        drag = null;
        angle = 0;
        phone.classList.remove("is-dragging");
        rotateY(0);
        rotateZ(0);
      };
      const key = (event) => {
        if (event.key === "Escape") reset();
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          angle = limitTurn(angle + (event.key === "ArrowLeft" ? -6 : 6));
          rotateY(angle);
        }
      };
      const leave = () => {
        driftY(0);
        driftX(0);
      };
      phone.addEventListener("pointerdown", pointerDown);
      stage.addEventListener("pointermove", pointerMove);
      phone.addEventListener("pointerup", reset);
      phone.addEventListener("pointercancel", reset);
      phone.addEventListener("keydown", key);
      stage.addEventListener("pointerleave", leave);
      if (!short) {
        let scrollChapter = 0;
        let openingHidden = false;
        let unfoldedHidden = true;
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: "spatial-intro",
            trigger: scene,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            const progress = this.progress();
            const next = Math.min(3, Math.floor(progress * 4));
            if (next !== scrollChapter) {
              scrollChapter = next;
              select(cards[next].dataset.spatialFeature);
            }
            if (openingHidden !== progress > 0.32) {
              openingHidden = progress > 0.32;
              scene
                .querySelector(".spatial-opening")
                .setAttribute("aria-hidden", String(openingHidden));
            }
            if (unfoldedHidden !== progress < 0.5) {
              unfoldedHidden = progress < 0.5;
              scene
                .querySelector(".spatial-unfolded")
                .setAttribute("aria-hidden", String(unfoldedHidden));
            }
          },
        });
        timeline
          .to(
            ".spatial-opening",
            {
              y: -55,
              autoAlpha: 0,
              scale: 0.92,
              duration: 0.32,
              ease: "power1.in",
            },
            0,
          )
          .fromTo(
            ".spatial-unfolded",
            { y: 30 },
            { y: 0, autoAlpha: 1, duration: 0.3, ease: "power2.out" },
            0.36,
          )
          .to(
            ".spatial-world",
            { y: mobile ? -30 : -50, duration: 1, ease: "none" },
            0,
          )
          .to(
            phonePose,
            {
              pitch: 0,
              yaw: 0,
              roll: 0,
              duration: 0.8,
              ease: "power1.inOut",
              onUpdate: syncPhonePose,
            },
            0.05,
          )
          .to(
            ".spatial-orbit",
            {
              rotationX: 55,
              rotation: 8,
              scale: 1.08,
              duration: 1,
              ease: "none",
            },
            0,
          );
        if (!mobile) {
          const narrow = innerWidth <= 960;
          const spread = narrow
            ? Math.min(245, innerWidth * 0.31)
            : Math.min(innerWidth * 0.265, 390);
          timeline
            .to(
              ".spatial-course",
              { x: -spread, y: -95, rotation: -3, duration: 0.8 },
              0.1,
            )
            .to(
              ".spatial-recording",
              { x: spread, y: -80, rotation: 4, duration: 0.8 },
              0.1,
            )
            .to(
              ".spatial-question",
              {
                x: -spread + 25,
                y: innerHeight < 820 ? 78 : 130,
                rotation: 2,
                duration: 0.8,
              },
              0.15,
            )
            .to(
              ".spatial-recall",
              {
                x: spread - 25,
                y: innerHeight < 820 ? 83 : 135,
                rotation: -3,
                duration: 0.8,
              },
              0.15,
            );
        } else {
          timeline.to(cards, { rotation: 0, duration: 0.8 }, 0.1);
        }
      }
      return () => {
        drag = null;
        floats.forEach((float) => float.kill());
        syncCardMotion = () => {};
        phone.classList.remove("is-dragging");
        [rotateY, rotateZ, driftY, driftX].forEach((update) =>
          update.tween.kill(),
        );
        gsap.set(parallax, { clearProps: "transform" });
        phonePose.turn = 0;
        phonePose.lean = 0;
        syncPhonePose();
        scene.querySelector(".spatial-opening").removeAttribute("aria-hidden");
        scene
          .querySelector(".spatial-unfolded")
          .setAttribute("aria-hidden", "true");
        phone.removeEventListener("pointerdown", pointerDown);
        stage.removeEventListener("pointermove", pointerMove);
        phone.removeEventListener("pointerup", reset);
        phone.removeEventListener("pointercancel", reset);
        phone.removeEventListener("keydown", key);
        stage.removeEventListener("pointerleave", leave);
      };
    },
  );
})();
