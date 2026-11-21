(() => {
  "use strict";
  // Spatial introduction is now the default landing experience.
  const template = document.getElementById("spatial-template");
  const main = document.getElementById("main");
  if (!template || !main) return;
  main.prepend(template.content.cloneNode(true));
  document.documentElement.classList.add("spatial-preview");
  // The fourth feature chapter already includes the flashcard walkthrough.
  document.getElementById("practice")?.remove();
  const scene = document.getElementById("experience");
  const stage = scene.querySelector(".spatial-stage");
  const desk = scene.querySelector(".desk-cover");
  const opening = stage.querySelector(".spatial-opening");
  const unfolded = stage.querySelector(".spatial-unfolded");
  const world = stage.querySelector(".spatial-world");
  const margins = main.querySelector(".product-walkthrough");
  const stepTemplate = margins.querySelector("template");
  const cards = [...scene.querySelectorAll("[data-spatial-feature]")];
  cards.forEach((card) => {
    const motion = document.createElement("span");
    motion.className = "spatial-card-motion";
    motion.append(card.querySelector(".spatial-card-face"));
    card.append(motion);
  });
  const phone = scene.querySelector(".spatial-device");
  const travel = world.querySelector(".spatial-phone-travel");
  const dragPose = scene.querySelector(".spatial-phone-drag");
  const parallax = scene.querySelector(".spatial-parallax");
  const lowerScreen = scene.querySelector(".spatial-poster");
  const upperScreen = new Image(1200, 2608);
  upperScreen.alt = "";
  upperScreen.style.opacity = "0";
  lowerScreen.after(upperScreen);
  let poster = lowerScreen;
  let wantedScreen = poster.getAttribute("src");
  let switchingScreen = false;
  const handheld = matchMedia("(max-width: 959px), (pointer: coarse) and (max-width: 1100px) and (max-height: 650px)");
  document.documentElement.classList.toggle("handheld", handheld.matches);
  let coverWidth;
  function sizeHandheldCover() {
    if (!handheld.matches) {
      coverWidth = undefined;
      desk.style.removeProperty("--cover-vh");
      return;
    }
    const width = desk.clientWidth;
    if (width === coverWidth) return;
    // Mobile browser bars resize the viewport during a swipe. Reframe only on a width change.
    coverWidth = width;
    desk.style.setProperty("--cover-vh", document.documentElement.clientHeight / 100 + "px");
  }
  sizeHandheldCover();
  new ResizeObserver(sizeHandheldCover).observe(desk);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const media = (name) => "assets/experiences/media-20261121/" + language + "/" + name;
  const phonePose = {
    displayScale: 1,
    screenBlend: 0,
    pitch: 5,
    yaw: -14,
    roll: innerWidth <= 620 ? -7 : -9,
    turn: 0,
    lean: 0,
    hoverPitch: 0,
    hoverYaw: 0,
    hoverLight: 0,
    get lightX() {
      return 0.48 + 1.74 * Math.sin((this.yaw + 14 + this.turn + this.hoverYaw) * Math.PI / 180);
    },
    get lightY() {
      return 0.42 - 2.25 * Math.sin((this.pitch - 5 + this.hoverPitch + this.lean * 0.6) * Math.PI / 180);
    },
    get lightStrength() {
      return 0.16 + 0.84 * Math.max(this.hoverLight, Math.min(1, Math.abs(this.turn) / 17));
    },
  };
  let phone3d = null;
  let phoneImport = null;
  function syncPhonePose() {
    if (phone3d) {
      phone3d.requestDraw();
    } else {
      scene.querySelector(".spatial-phone-pose").style.transform =
        `perspective(calc(var(--phone-width) * 5.66)) rotateY(${phonePose.yaw + phonePose.hoverYaw}deg) rotateX(${phonePose.pitch + phonePose.hoverPitch}deg) rotate(${phonePose.roll}deg)`;
      phone.style.setProperty("--phone-light-x", `${phonePose.lightX * 100}%`);
      phone.style.setProperty("--phone-light-y", `${phonePose.lightY * 100}%`);
      phone.style.setProperty("--phone-light-strength", phonePose.lightStrength);
      dragPose.style.transform = `rotateY(${phonePose.turn}deg) rotateZ(${phonePose.lean}deg)`;
    }
  }
  function enablePhone3d() {
    if (handheld.matches || reduce.matches || navigator.connection?.saveData || phoneImport) return;
    phoneImport = import("./assets/experiences/phone3d.js?v=20261121-full-frame")
      .then(({ mountPhone }) => {
        if (handheld.matches) { phoneImport = null; return; }
        phone3d = mountPhone({
          host: phone,
          stage,
          poster: lowerScreen,
          overlay: upperScreen,
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
  const aiSources = "sources.webp";
  const answerScreen = "ai-answer.webp";
  // One camera position keeps the question, answer and open citation in the same shot.
  const conversationFraming = 0.49;
  const tourScreens = {
    classes: {
      side: "left", src: "courses.webp", focus: 0.41, strip: 40,
      en: ["Choose a course.", "Your courses are grouped by term. Open one to find its schedule and materials."],
      zh: ["选一门课。", "按学期找到课程，打开就能看课表和资料。"],
    },
    session: {
      side: "left", src: "session.webp", focus: 0.41, strip: 43,
      en: ["Open the lecture.", "Its recording, transcript, notes, and materials all live in the same session."],
      zh: ["打开这节课。", "这节课的录音、逐字稿、笔记和资料，都能在这里找到。"],
    },
    library: {
      side: "right", src: "library.webp", focus: 0.38, strip: 38,
      en: ["Choose how to review.", "Open a flashcard set, take a quiz, or read a study guide from the same course."],
      zh: ["选一种方式复习。", "在同一门课里翻闪卡、做测验，或打开学习指南。"],
    },
    start: {
      side: "left", src: "start.webp", focus: 0.68, strip: 81,
      en: ["Keep the lecture audio.", "With permission, record in class or import an audio file you already have."],
      zh: ["留下课堂音频。", "获得许可后，可以当场录音，也可以导入已有音频。"],
    },
    recording: {
      side: "left", src: "recording.webp", focus: 0.54, strip: 68,
      en: ["Mark a question as you listen.", "Flag a moment during recording so you can come back to it after class."],
      zh: ["听到疑问，随手标记。", "录音时为这一刻做个标记，课后可以回到这里。"],
    },
    saved: {
      side: "right", src: "saved.webp", focus: 0.62, strip: 55,
      en: ["Turn audio into text.", "After saving, choose a transcription method. The app shows the estimated cost before you start."],
      zh: ["把录音转成文字。", "保存后选择转录方式，开始前可以查看预计用量。"],
    },
    summary: {
      side: "right", src: "summary.webp", focus: 0.45, strip: 43,
      en: ["Revisit the lecture.", "Open the summary after class to read through the key concepts."],
      zh: ["课后，先看重点。", "打开这节课的摘要，回顾课堂上讲过的关键概念。"],
    },
    emphasis: {
      side: "right", src: "summary-detail.webp", focus: 0.72, strip: 71,
      en: ["What did the professor emphasize?", "The summary keeps the professor’s emphasis and worked examples together."],
      zh: ["老师强调了什么？", "在摘要里对照老师强调的内容和课堂例题。"],
    },
    courseAsk: {
      side: "right", src: "course-overview.webp", focus: 0.15, strip: 9,
      en: ["Start with your course.", "Open Ask AI from the sparkle beside the course title."],
      zh: ["从这门课开始。", "点课程右上角的星形按钮，就能带着这门课的资料问 AI。"],
    },
    askedQuestion: {
      side: "right", src: answerScreen, framing: conversationFraming, focus: 0.211, radius: 0.034, strip: 17,
      en: ["Ask about your class.", "Choose a point that didn’t click in class and ask AI to explain it."],
      zh: ["把课堂上的疑问交给 AI。", "用自己的话提问，让 AI 解释课上没听懂的地方。"],
    },
    question: {
      side: "left", src: "ask-poster.webp", focus: 0.58, strip: 58,
      en: ["Ask in your own words.", "The course name above your question shows which class you’re asking about."],
      zh: ["用自己的话提问。", "看一眼输入框上方的课程名，就知道这次提问用的是哪门课的资料。"],
    },
    answer: {
      side: "left", src: answerScreen, framing: conversationFraming, focus: 0.444, radius: 0.12, strip: 43,
      en: ["Read the AI answer.", "Here, AI explains the concept and gives an analogy to help it click."],
      zh: ["读 AI 的解释。", "在这段回答里，AI 先解释概念，再用一个类比帮助理解。"],
    },
    sources: {
      side: "left", src: aiSources, framing: conversationFraming, focus: 0.64, radius: 0.12, strip: 63,
      en: ["See where the answer came from.", "The expanded citation shows the class note, a short excerpt, and a link to the original."],
      zh: ["看这段回答的出处。", "展开的引用里有课堂笔记的摘录，也有原文入口。"],
    },
    addMenu: {
      side: "left", src: "composer-menu.webp", framing: 0.89, focus: 0.81, radius: 0.165, strip: 83,
      en: ["Add to your question.", "Use the plus menu to take a photo, choose a photo or file, or open Quick actions."],
      zh: ["给问题加点资料。", "用加号拍照、选照片或文件，也可以打开快捷操作。"],
    },
    recall: {
      side: "right", src: "review-poster.webp", focus: 0.35, strip: 38,
      en: ["Test your recall.", "Try answering a flashcard from your class before revealing the back."],
      zh: ["先试着回忆。", "翻看根据课堂内容制作的闪卡，先自己回答。"],
    },
    flip: {
      side: "right", src: "flip.webp", focus: 0.35, strip: 38,
      en: ["Check your answer.", "Reveal the back of the card. Source evidence is there when you want to check the original material."],
      zh: ["翻面核对答案。", "核对答案后，还可以查看这张闪卡引用的课堂资料。"],
    },
  };
  const aiSteps = ["askedQuestion", "sources", "addMenu"];
  const tours = {
    overview: ["classes", "session", "library", ...aiSteps],
    organize: ["classes", "session", "library"],
    capture: ["start", "recording", "saved", "summary"],
    ask: ["courseAsk", ...aiSteps],
    review: ["library", "recall", "flip", "question"],
  };
  const stepActions = {
    summary: { screen: "emphasis", en: ["See emphasis and examples", "Back to key concepts"], zh: ["看老师强调的内容和例题", "回到关键概念"] },
    question: { screen: "answer", en: ["See sample answer", "Back to the question"], zh: ["查看示例回答", "回到问题"] },
  };
  const tourSteps = tours.overview.map(() => {
    const step = stepTemplate.content.firstElementChild.cloneNode(true);
    margins.append(step);
    return step;
  });
  stepTemplate.remove();
  const openActions = new Set();
  let tourIndex = -1;
  // The opening handset shows a course. Scrolling follows its AI conversation
  // unless the visitor chooses one of the feature cards.
  let selected = null;
  const tourFeature = () => selected ?? "overview";
  const activePath = () => tours[tourFeature()];
  const hasReadingSequence = () => selected === null || selected === "ask";
  let rebuildTourMotion = () => {};
  let visible = false;
  let syncCardMotion = () => {};
  let language;
  let inDetail = false;
  let measureDetail = () => {};
  let stillDetail;
  function updatePosterDescription() {
    const title = tourIndex < 0 ? copy[language][selected ? names[selected] : "today"] : currentScreen()[language][0];
    poster.alt = copy[language].poster + title;
    phone.setAttribute("aria-label", inDetail ? poster.alt : copy[language].rotate);
    if (stillDetail) {
      if (stillDetail.getAttribute("src") !== wantedScreen) stillDetail.src = wantedScreen;
      stillDetail.alt = poster.alt;
    }
  }
  const copy = {
    en: {
      exploreFeatures: "Explore features",
      line1: "Less scattered.",
      line2: "More understood.",
      description: "Your courses, lectures, notes, and review. In one place.",
      unfoldTitle: "One course. Everything connected.",
      unfoldBody: "Your schedule, recordings, questions, and review.",
      course: "Courses",
      schedule: "Weekly schedule",
      courseContents: "Sessions and materials",
      monday: "MON",
      recording: "Lecture recording",
      recordingShort: "Record",
      captureAction: "Record or import audio",
      ask: "Ask AI",
      questionLead: "Ask about ",
      questionTerm: "your class",
      source: "Source",
      sourceTitle: "Lecture slides",
      review: "Review tools",
      reviewShort: "Review",
      flashPrompt: "Flashcard",
      flashResponse: "Answer",
      flashAction: "Reveal answer",
      flashSource: "Source evidence",
      flashcards: "Flashcards",
      reviewTools: ", quizzes & study guides",
      demo: "App demo",
      rotate:
        "Rotate the phone. Use left and right arrow keys; Escape to reset.",
      poster: "CourseHelper app demonstration: ",
      today: "Today’s classes",
      organize: "Course organization",
      capture: "Lecture recording",
      reviewName: "Flashcard review",
      askName: "Questions and sources",
    },
    zh: {
      exploreFeatures: "了解功能",
      line1: "少一点散乱。",
      line2: "多一点理解。",
      description: "课程、课堂录音、笔记和复习，都在同一个地方。",
      unfoldTitle: "一门课，所有思路接起来。",
      unfoldBody: "课表、录音、提问与复习，留在同一门课里。",
      course: "课程",
      schedule: "每周课表",
      courseContents: "课次与资料",
      monday: "周一",
      recording: "课堂录音",
      recordingShort: "录音",
      captureAction: "录制或导入音频",
      ask: "课程问答",
      questionLead: "带着",
      questionTerm: "课堂资料提问",
      source: "引用来源",
      sourceTitle: "课堂讲义",
      review: "复习工具",
      reviewShort: "复习",
      flashPrompt: "闪卡",
      flashResponse: "答案",
      flashAction: "翻看答案",
      flashSource: "查看依据",
      flashcards: "闪卡",
      reviewTools: "、测验与学习指南",
      demo: "功能演示",
      rotate: "转动手机。也可用左右方向键转动，Esc 复位。",
      poster: "CourseHelper 操作演示：",
      today: "今天的课程",
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
  function screenAt(index) {
    const path = activePath();
    const id = path[Math.max(0, Math.min(index, path.length - 1))];
    return tourScreens[openActions.has(index) ? stepActions[id].screen : id];
  }
  function currentScreen() {
    return screenAt(tourIndex);
  }
  function displayBlend(value) {
    phonePose.screenBlend = value;
    upperScreen.style.opacity = String(value);
    phone3d?.requestDraw();
  }
  // Both endpoints are the simulator captures. The answer stays painted while its
  // backdrop dims and the citation sheet slides into its captured position.
  function makeSourceMotion(answer, sources) {
    const layer = document.createElement("span");
    layer.className = "source-motion";
    layer.setAttribute("aria-hidden", "true");
    layer.style.setProperty("--answer-image", `url("${answer}")`);
    layer.style.setProperty("--sources-image", `url("${sources}")`);
    layer.append(document.createElement("span"));
    return layer;
  }
  function moveSourceSheet(layer, initiallyOpen, target) {
    let position = initiallyOpen ? 1 : 0;
    let last = performance.now();
    return new Promise(resolve => {
      function frame(now) {
        const open = target();
        if (open == null || !layer.isConnected) return resolve();
        const distance = (now - last) / 560;
        last = now;
        position = reduce.matches || document.hidden ? Number(open) :
          Math.min(1, Math.max(0, position + (open ? distance : -distance)));
        const progress = position * position * (3 - 2 * position);
        layer.style.setProperty("--sheet-progress", progress);
        if (position === Number(open)) resolve();
        else requestAnimationFrame(frame);
      }
      frame(last);
    });
  }
  function blendScreens(next) {
    const to = next === upperScreen ? 1 : 0;
    const from = phonePose.screenBlend;
    const start = performance.now();
    return new Promise((resolve) => {
      function paint(now) {
        const t = reduce.matches || document.hidden ? 1 : Math.max(0, Math.min(1, (now - start) / 230));
        const mix = t * t * (3 - 2 * t);
        displayBlend(from + (to - from) * mix);
        if (t < 1) requestAnimationFrame(paint);
        else resolve();
      }
      paint(start);
    });
  }
  async function showWantedScreen() {
    if (switchingScreen) return;
    switchingScreen = true;
    try {
      while (poster.getAttribute("src") !== wantedScreen) {
        const src = wantedScreen;
        const next = poster === lowerScreen ? upperScreen : lowerScreen;
        if (next.getAttribute("src") !== src) next.src = src;
        try {
          await next.decode();
        } catch {
          if (src !== wantedScreen) continue;
          return;
        }
        // A fast scroll can skip several pages while an image is decoding.
        if (src !== wantedScreen) continue;
        const answer = media(answerScreen);
        const sources = media(aiSources);
        const previous = poster.getAttribute("src");
        if (!stillDetail && !reduce.matches && ((previous === answer && src === sources) ||
            (previous === sources && src === answer))) {
          const layer = makeSourceMotion(answer, sources);
          upperScreen.after(layer);
          try {
            await moveSourceSheet(layer, previous === sources, () =>
              wantedScreen === sources ? true : wantedScreen === answer ? false : null);
            if (src !== wantedScreen) continue;
            displayBlend(next === upperScreen ? 1 : 0);
          } finally {
            layer.remove();
          }
        } else {
          await blendScreens(next);
        }
        poster.classList.remove("spatial-poster");
        poster.alt = "";
        poster = next;
        poster.classList.add("spatial-poster");
        updatePosterDescription();
      }
    } finally {
      switchingScreen = false;
    }
  }
  function updatePhoneScreen() {
    wantedScreen = media(tourIndex < 0 ? (selected ? selected + "-poster.webp" : "today.webp") : currentScreen().src);
    showWantedScreen();
    updatePosterDescription();
    measureDetail();
  }
  function setTourIndex(index) {
    if (index === tourIndex) return;
    tourIndex = index;
    stage.classList.toggle("is-touring", index >= 0);
    stage.classList.toggle("is-reading-ai", index >= 0 && hasReadingSequence() && currentScreen().radius !== undefined);
    updatePhoneScreen();
  }
  const stripObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const layer = entry.target.querySelector(".source-motion");
      if (!layer) continue;
      if (entry.intersectionRatio >= 0.55) {
        stripObserver.unobserve(entry.target);
        moveSourceSheet(layer, false, () => true);
      }
    }
  }, { threshold: 0.55 });
  function renderStep(step, index) {
    const path = activePath();
    const strip = step.querySelector(".tour-screen-strip");
    stripObserver.unobserve(strip);
    strip.querySelector(".source-motion")?.remove();
    step.hidden = index >= path.length;
    if (step.hidden) return;
    const id = path[index];
    const screen = screenAt(index);
    const [title, description] = screen[language];
    const img = step.querySelector("img");
    const src = media(screen.src);
    if (img.getAttribute("src") !== src) img.src = src;
    img.style.objectPosition = "50% " + screen.strip + "%";
    if (id === "sources" && !reduce.matches && !navigator.connection?.saveData) {
      const layer = makeSourceMotion(media(answerScreen), src);
      layer.style.setProperty("--strip-position", screen.strip + "%");
      strip.append(layer);
      stripObserver.observe(strip);
    }
    step.querySelector(".tour-demo-label").textContent = copy[language].demo;
    step.querySelector(".tour-title").textContent = title;
    step.querySelector(".tour-description").textContent = description;
    step.dataset.screen = id;
    step.dataset.side = screen.side;
    // Keep related captions beside their control, with enough space at either edge for both languages.
    let captionPosition = hasReadingSequence() ? 0.15 + screen.focus * 0.78 : 0.32 + screen.focus * 0.36;
    if (hasReadingSequence() && screen.framing !== undefined) {
      captionPosition = 0.51 + (screen.focus - screen.framing) * 1.85;
    }
    step.style.setProperty("--space-before", captionPosition + "fr");
    step.style.setProperty("--space-after", (1 - captionPosition) + "fr");
    const action = index === path.length - 1 && stepActions[id];
    const button = step.querySelector(".tour-action");
    button.hidden = !action;
    if (action) {
      const open = openActions.has(index);
      button.firstElementChild.textContent = action[language][open ? 1 : 0];
      button.classList.toggle("is-open", open);
    }
  }
  function renderTour() {
    if (handheld.matches) return;
    margins.dataset.tour = tourFeature();
    stage.classList.toggle("has-reading-sequence", hasReadingSequence());
    tourSteps.forEach(renderStep);
  }
  tourSteps.forEach((step, index) => {
    step.querySelector(".tour-action").addEventListener("click", () => {
      if (openActions.has(index)) openActions.delete(index);
      else openActions.add(index);
      renderStep(step, index);
      if (tourIndex === index) updatePhoneScreen();
      document.getElementById("spatial-announcement").textContent = screenAt(index)[language].join(" ");
    });
  });
  function translate() {
    language = document.documentElement.lang === "zh-Hans" ? "zh" : "en";
    scene.querySelectorAll("[data-spatial-copy]").forEach((el) => {
      el.textContent = copy[language][el.dataset.spatialCopy];
    });
    const photo = desk.querySelector(".desk-photo");
    const deskRoot = "assets/experiences/media-20261121/" + (language === "zh" ? "zh/" : "");
    photo.querySelector("source").srcset = deskRoot + "desk-portrait.webp?v=checklist";
    photo.querySelector("img").src = deskRoot + "desk-landscape.webp?v=checklist";
    const deskDisplay = scene.querySelector(".desk-native-display");
    const deskSrc = media("desk-display.webp");
    if (deskDisplay.getAttribute("src") !== deskSrc) deskDisplay.src = deskSrc;
    renderTour();
    updatePhoneScreen();
  }
  document.addEventListener("coursehelper:language", translate);
  translate();
  // Illustrative speech levels. Both colors of the waveform share this SVG path.
  const lectureWave = scene.querySelector("#spatial-lecture-wave");
  const lectureLevels = [
    2, 4, 6, 3, 7, 12, 8, 15, 19, 13, 8, 5, 3, 6, 10, 17, 21, 14, 9, 6,
    3, 2, 4, 8, 16, 19, 12, 7, 4, 2, 1, 2, 3, 7, 13, 18, 11, 6, 10, 16,
    9, 4, 2, 1, 1, 3, 8, 15, 20, 12, 6, 3, 2, 1,
  ];
  function drawLectureWave(position) {
    const offset = Math.floor(position);
    const fraction = position - offset;
    const blend = fraction * fraction * (3 - 2 * fraction);
    let path = "";
    for (let bar = 0; bar < 31; bar++) {
      const index = (bar + offset) % lectureLevels.length;
      const level = lectureLevels[index];
      const next = lectureLevels[(index + 1) % lectureLevels.length];
      const amplitude = level + (next - level) * blend;
      path += `M${3 + 6 * bar} ${(23 - amplitude).toFixed(1)}v${(2 * amplitude).toFixed(1)}`;
    }
    lectureWave.setAttribute("d", path);
  }
  drawLectureWave(0);
  function syncStageMotion() {
    scene.classList.toggle(
      "is-motion-active",
      visible &&
        !document.hidden &&
        !reduce.matches &&
        !navigator.connection?.saveData,
    );
    syncCardMotion();
  }
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      syncStageMotion();
    },
    { threshold: 0.25 },
  ).observe(stage);
  function select(feature) {
    if (feature === selected) return;
    const length = activePath().length;
    selected = feature;
    openActions.clear();
    renderTour();
    if (length !== activePath().length) rebuildTourMotion();
    updatePhoneScreen();
    cards.forEach((card) => {
      const active = card.dataset.spatialFeature === selected;
      card.classList.toggle("is-selected", active);
      card.setAttribute("aria-pressed", String(active));
    });
    document.getElementById("spatial-announcement").textContent =
      copy[language][names[selected]];
  }
  cards.forEach((card) =>
    card.addEventListener("click", () => select(card.dataset.spatialFeature)),
  );
  cards.forEach((card) => {
    const pose = { x: 0.5, y: 0.5, lift: 0 };
    let targetX = 0.5, targetY = 0.5;
    let release = null;
    let frame = 0, lastTime = 0;

    function render(time) {
      frame = 0;
      if (release) {
        const progress = Math.max(0, (time - release.start) / 620);
        if (progress >= 1) {
          resetTilt();
          return;
        }
        // Ease out of the held pose and land with zero velocity.
        const weight = (1 - progress) ** 3 * (1 + 3 * progress);
        pose.x = 0.5 + (release.x - 0.5) * weight;
        pose.y = 0.5 + (release.y - 0.5) * weight;
        pose.lift = release.lift * weight;
      } else {
        const blend = 1 - Math.exp(-Math.max(0, time - lastTime) / 40);
        pose.x += (targetX - pose.x) * blend;
        pose.y += (targetY - pose.y) * blend;
        pose.lift += (1 - pose.lift) * blend;
      }
      lastTime = time;
      card.style.setProperty("--card-pointer-x", pose.x.toFixed(4));
      card.style.setProperty("--card-pointer-y", pose.y.toFixed(4));
      card.style.setProperty("--card-lift", pose.lift.toFixed(4));
      const distance = Math.max(Math.abs(targetX - pose.x), Math.abs(targetY - pose.y), 1 - pose.lift);
      if (release || distance > 0.0001) frame = requestAnimationFrame(render);
    }
    function schedule() {
      if (frame) return;
      lastTime = performance.now();
      frame = requestAnimationFrame(render);
    }
    function tilt(event) {
      if (event.pointerType !== "mouse" || reduce.matches || world.inert) return;
      // Measure the hit area, not the rotating face.
      const bounds = card.getBoundingClientRect();
      targetX = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      targetY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      release = null;
      if (!card.classList.contains("is-tilting")) {
        card.classList.add("is-tilting");
        syncCardMotion();
      }
      schedule();
    }
    function releaseTilt() {
      if (release || !card.classList.contains("is-tilting")) return;
      release = { ...pose, start: performance.now() };
      schedule();
    }
    function resetTilt() {
      cancelAnimationFrame(frame);
      frame = 0;
      release = null;
      Object.assign(pose, { x: 0.5, y: 0.5, lift: 0 });
      card.classList.remove("is-tilting");
      card.style.removeProperty("--card-pointer-x");
      card.style.removeProperty("--card-pointer-y");
      card.style.removeProperty("--card-lift");
      syncCardMotion();
    }
    card.addEventListener("pointerenter", tilt);
    card.addEventListener("pointermove", tilt);
    card.addEventListener("pointerleave", releaseTilt);
    card.addEventListener("pointercancel", releaseTilt);
    window.addEventListener("blur", releaseTilt);
    reduce.addEventListener("change", resetTilt);
  });
  document.addEventListener("visibilitychange", syncStageMotion);
  navigator.connection?.addEventListener("change", syncStageMotion);
  navigator.connection?.addEventListener("change", enablePhone3d);
  reduce.addEventListener("change", () => {
    syncStageMotion();
    syncPhoneAccess();
    enablePhone3d();
  });
  function syncPhoneAccess() {
    phone.setAttribute("aria-disabled", String(reduce.matches || inDetail));
    phone.tabIndex = reduce.matches || inDetail ? -1 : 0;
  }
  syncPhoneAccess();
  enablePhone3d();
  function layoutGallery() {
    if (stage.clientWidth <= 620) return;
    const card = cards[0];
    const scale = parseFloat(getComputedStyle(card).zoom) || 1;
    // Allow for the outer corners of both the tilted card and the phone chassis.
    const cardRadius = (card.offsetWidth / 2 + 18) * scale;
    const column = phone.offsetWidth * 0.76 + 36 + cardRadius;
    const available = world.clientWidth / 2 - 14;
    const fit = Math.min(1, available / (column + cardRadius));
    world.style.setProperty("--gallery-fit", fit);
    world.style.setProperty("--card-column", (column / scale) + "px");
    const remaining = (available / fit - column - cardRadius) / scale;
    world.style.setProperty("--open-distance", Math.min(55, Math.max(0, Math.floor(remaining))) + "px");
  }
  layoutGallery();
  new ResizeObserver(layoutGallery).observe(world);
  function showHandheldDesk() {
    desk.removeAttribute("aria-hidden");
    desk.append(opening);
    stage.hidden = margins.hidden = true;
    return () => {
      stage.hidden = margins.hidden = false;
      stage.prepend(opening);
      desk.setAttribute("aria-hidden", "true");
    };
  }
  handheld.addEventListener("change", () => {
    document.documentElement.classList.toggle("handheld", handheld.matches);
    sizeHandheldCover();
    if (handheld.matches && phone3d) {
      phone3d.dispose();
      phone3d = phoneImport = null;
    } else if (!handheld.matches) {
      renderTour();
      enablePhone3d();
    }
    document.dispatchEvent(new Event("coursehelper:layout"));
  });
  function showStillDesk() {
    scene.classList.add("desk-still");
    desk.removeAttribute("aria-hidden");
    desk.append(opening);
    stillDetail = new Image(1200, 2608);
    stillDetail.className = "spatial-still-detail";
    updatePosterDescription();
    scene.append(stillDetail);
    unfolded.setAttribute("aria-hidden", "false");
    return () => {
      stillDetail.remove();
      stillDetail = null;
      stage.prepend(opening);
      desk.setAttribute("aria-hidden", "true");
      unfolded.setAttribute("aria-hidden", "true");
      scene.classList.remove("desk-still");
    };
  }
  if (!window.gsap || !window.ScrollTrigger) {
    scene.classList.add("is-static");
    if (handheld.matches) showHandheldDesk();
    else showStillDesk();
    phone.setAttribute("aria-disabled", "true");
    phone.tabIndex = -1;
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (!reduce.matches && window.scrollY <= 16) opening.classList.add("desk-focus-in");
  const deskDistance = () => desk.offsetHeight * 1.05;
  function animateDeskEntrance(releaseHover) {
    scene.classList.add("desk-motion");
    stage.prepend(desk);
    const anchor = desk.querySelector(".desk-handset");
    const titleAnchor = desk.querySelector(".desk-title-anchor");
    const photo = desk.querySelector(".desk-photo");
    const print = anchor.querySelector(".desk-print-mount");
    const livePhone = travel.querySelector(".spatial-phone-pose");
    travel.append(print);
    const lines = opening.querySelectorAll("h1 > span, .spatial-description");
    // Read layout coordinates, which stay stable while either scroll animation is running.
    const zoom = () => parseFloat(getComputedStyle(parallax).zoom) || 1;
    const dx = () => anchor.offsetLeft - world.offsetLeft - parallax.offsetLeft * zoom();
    const dy = () => anchor.offsetTop - world.offsetTop - parallax.offsetTop * zoom();
    const startScale = () => anchor.offsetWidth / (phone.offsetWidth * zoom());
    const closeUpScale = () => Math.max(1.16, startScale() * 1.22);
    const availableWidth = () => titleAnchor.offsetWidth;
    const titleScale = () => Math.min(stage.clientWidth <= 620 ? 1.13 : 1.26,
      availableWidth() / Math.max(lines[0].offsetWidth, lines[1].offsetWidth));
    const captionScale = () => Math.min(stage.clientWidth <= 620 ? 1.15 : 1.45,
      availableWidth() / lines[2].offsetWidth);
    const galleryDetails = [...cards, world.querySelector(".spatial-orbit"), world.querySelector(".spatial-ground")];
    world.inert = true;
    syncCardMotion();
    travel.classList.add("on-desk");

    function syncDeskState(timeline) {
      if (timeline.progress() > 0.02) opening.classList.remove("desk-focus-in");
      const onDesk = timeline.time() < 1.06;
      if (world.inert !== onDesk) {
        if (onDesk) releaseHover();
        world.inert = onDesk;
        syncCardMotion();
      }
      travel.classList.toggle("on-desk", timeline.progress() < 0.86);
    }
    const tl = gsap.timeline({
      defaults: { ease: "power1.inOut" },
      scrollTrigger: {
        id: "desk-entrance",
        trigger: scene,
        start: "top top",
        end: () => "+=" + deskDistance(),
        scrub: 0.35,
        invalidateOnRefresh: true,
        onRefresh: (trigger) => syncDeskState(trigger.animation),
      },
      onUpdate() { syncDeskState(this); },
    });
    tl.fromTo(travel, {
      x: () => dx() / zoom(), y: () => dy() / zoom(),
      scaleX: startScale, scaleY: () => startScale() * 0.908, skewX: 5.6,
    }, {
      x: () => dx() * 0.90 / zoom(), y: () => dy() * 0.90 / zoom(),
      scaleX: closeUpScale, scaleY: () => closeUpScale() * 0.908,
      duration: 0.42,
    }, 0)
      .to(travel, { x: 0, y: 0, skewX: 0, scale: 1, duration: 0.58 }, 0.42)
      // Desk pose measured from the four screen edges in the approved photograph.
      .fromTo(phonePose, { pitch: 19.4, yaw: 1.6, roll: -9.5 }, {
        pitch: 5, yaw: -14, roll: innerWidth <= 620 ? -7 : -9,
        duration: 0.43, onUpdate: syncPhonePose,
      }, 0.53)
      .fromTo(livePhone, { opacity: 0 }, { opacity: 1, duration: 0.10 }, 0.40)
      .fromTo(print, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.18 }, 0.49)
      .fromTo(travel, { "--desk-screen-light": 0.91 }, { "--desk-screen-light": 1, duration: 0.65 }, 0.22)
      .fromTo(photo, { x: 0, y: 0, scale: 1 }, {
        x: () => -dx() * 0.10, y: () => -dy() * 0.10, scale: 1.22, duration: 0.42,
      }, 0)
      .to(photo, { x: () => -dx() * 0.20, y: () => -dy() * 0.20, scale: 1.36, duration: 0.40 }, 0.42)
      .fromTo(desk, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.50 }, 0.26)
      .fromTo(travel, { "--desk-shadow": 1 }, { "--desk-shadow": 0, duration: 0.55 }, 0.20)
      .fromTo(lines, {
        x: (_, el) => titleAnchor.offsetLeft - opening.offsetLeft - el.offsetLeft,
      }, { x: 0, duration: 0.55 }, 0.44)
      .fromTo(lines, {
        y: (_, el) => titleAnchor.offsetTop - opening.offsetTop
          + (el.offsetTop - lines[0].offsetTop) * (titleScale() - 1),
        scale: i => i < 2 ? titleScale() : captionScale(),
        transformOrigin: "left top",
      }, { y: 0, scale: 1, duration: 0.55 }, 0.02)
      .to(opening, { "--opening-secondary": "#8a8a8a", "--opening-caption": "#666666", duration: 0.68 }, 0.16)
      .fromTo(galleryDetails, { autoAlpha: 0 }, {
        autoAlpha: i => i === cards.length ? 0.42 : 1, duration: 0.18,
      }, 1);

    return () => {
      opening.classList.remove("desk-focus-in");
      world.inert = false;
      travel.classList.remove("on-desk");
      anchor.append(print);
      scene.insertBefore(desk, stage);
      scene.classList.remove("desk-motion");
    };
  }
  const mm = gsap.matchMedia();
  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduced: "(prefers-reduced-motion: reduce)",
      handheld: handheld.media,
      mobile: "(max-width: 620px)",
      narrow: "(max-width: 960px)",
      compact: "(max-width: 760px)",
      short: "(max-height: 740px)",
      sideNotes: "(min-width: 1100px) and (min-height: 500px)",
    },
    (context) => {
      const { motion, mobile, short, sideNotes } = context.conditions;
      if (context.conditions.handheld) return showHandheldDesk();
      if (!motion) return showStillDesk();
      const marginPages = () => sideNotes ? activePath().length * (selected === null ? 0.7 : 0.9) : 0;
      if (sideNotes) {
        scene.classList.add("has-side-notes");
        scene.style.setProperty("--margin-travel", marginPages() * 100 + "svh");
        stage.append(margins);
      }
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
      const wave = { position: 0 };
      const recordingMotion = gsap.to(wave, {
        position: lectureLevels.length,
        duration: lectureLevels.length / 11,
        ease: "none",
        repeat: -1,
        paused: true,
        onUpdate: () => drawLectureWave(wave.position),
      });
      syncCardMotion = () => {
        const active = scene.classList.contains("is-motion-active") && !inDetail;
        recordingMotion.paused(!active || world.inert);
        floats.forEach((float, index) => {
          if (active && !cards[index].classList.contains("is-tilting"))
            float.resume();
          else float.pause();
        });
      };
      syncCardMotion();
      phonePose.pitch = 5;
      phonePose.yaw = -14;
      phonePose.roll = mobile ? -7 : -9;
      phonePose.turn = 0;
      phonePose.lean = 0;
      syncPhonePose();
      const follow = { duration: 0.32, ease: "power2.out", onUpdate: syncPhonePose };
      const hoverPitch = gsap.quickTo(phonePose, "hoverPitch", follow);
      const hoverYaw = gsap.quickTo(phonePose, "hoverYaw", follow);
      const hoverLight = gsap.quickTo(phonePose, "hoverLight", follow);
      let hoveringPhone = false;
      function releaseHover() {
        if (!hoveringPhone) return;
        hoveringPhone = false;
        hoverPitch(0);
        hoverYaw(0);
        hoverLight(0);
      }
      function followPhone(event) {
        // Use the gallery anchor, so turning the handset cannot move its hit area.
        const center = travel.getBoundingClientRect();
        const zoom = parseFloat(getComputedStyle(parallax).zoom) || 1;
        const dx = event.clientX - center.left, dy = event.clientY - center.top;
        const roll = phonePose.roll * Math.PI / 180;
        const x = (dx * Math.cos(roll) + dy * Math.sin(roll)) / (phone.offsetWidth * zoom / 2);
        const y = (dy * Math.cos(roll) - dx * Math.sin(roll)) / (phone.offsetHeight * zoom / 2);
        if (Math.abs(x) > 1 || Math.abs(y) > 1) {
          releaseHover();
          return false;
        }
        if (!hoveringPhone) hoverLight(1);
        hoveringPhone = true;
        hoverYaw(x * 17);
        hoverPitch(-y * 12);
        return true;
      }
      const resetDesk = animateDeskEntrance(releaseHover);
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
        if (event.button !== 0 || inDetail) return;
        releaseHover();
        drag = { x: event.clientX, y: event.clientY, angle };
        phone.setPointerCapture(event.pointerId);
        phone.classList.add("is-dragging");
      };
      const pointerMove = (event) => {
        if (inDetail) return;
        if (drag) {
          angle = limitTurn(drag.angle + (event.clientX - drag.x) * 0.24);
          rotateY(angle);
          rotateZ(gsap.utils.clamp(-7, 7, (event.clientY - drag.y) * -0.08));
        } else if (event.pointerType === "mouse" && !world.inert) {
          const onCard = event.target.closest(".spatial-card");
          if (onCard) releaseHover();
          if (onCard || followPhone(event)) {
            driftX.tween.pause();
            driftY.tween.pause();
            return;
          }
          if (mobile) return;
          driftX((event.clientX / innerWidth - 0.5) * 8);
          driftY((event.clientY / innerHeight - 0.5) * 5);
        }
      };
      const reset = () => {
        releaseHover();
        drag = null;
        angle = 0;
        phone.classList.remove("is-dragging");
        rotateY(0);
        rotateZ(0);
      };
      const key = (event) => {
        if (inDetail) return;
        releaseHover();
        if (event.key === "Escape") reset();
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          angle = limitTurn(angle + (event.key === "ArrowLeft" ? -6 : 6));
          rotateY(angle);
        }
      };
      const leave = () => {
        releaseHover();
        driftY(0);
        driftX(0);
      };
      phone.addEventListener("pointerdown", pointerDown);
      stage.addEventListener("pointermove", pointerMove);
      phone.addEventListener("pointerup", reset);
      phone.addEventListener("pointercancel", reset);
      phone.addEventListener("keydown", key);
      stage.addEventListener("pointerleave", leave);
      window.addEventListener("blur", reset);
      // Work back from the sticky boundary so adding the notes does not retime the zoom.
      const marginDistance = () => marginPages() * desk.offsetHeight;
      const detailEnd = () => "bottom top+=" + (stage.offsetHeight + marginDistance());
      const galleryEnd = () => "bottom top+=" + (stage.offsetHeight + marginDistance() + desk.offsetHeight);
      if (!short) {
        let openingHidden = false;
        let unfoldedHidden = true;
        const timeline = gsap.timeline({
          scrollTrigger: {
            id: "spatial-intro",
            trigger: scene,
            start: () => "top+=" + deskDistance() + " top",
            end: galleryEnd,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
          onUpdate() {
            const progress = this.progress();
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
          timeline
            .to(world, { "--gallery-open": 1, duration: 0.8 }, 0.1)
            .to(
              ".spatial-course",
              { y: -95, rotation: -3, duration: 0.8 },
              0.1,
            )
            .to(
              ".spatial-recording",
              { y: -80, rotation: 4, duration: 0.8 },
              0.1,
            )
            .to(
              ".spatial-question",
              {
                y: innerHeight < 820 ? 78 : 130,
                rotation: 2,
                duration: 0.8,
              },
              0.15,
            )
            .to(
              ".spatial-recall",
              {
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
      const header = document.querySelector(".site-header");
      let renderScale = 1;
      let positionFocus = () => {};
      function setDetailResolution(scale) {
        if (phonePose.displayScale === scale) return;
        phonePose.displayScale = scale;
        phone3d?.resize();
      }
      measureDetail = () => {
        const zoom = parseFloat(getComputedStyle(parallax).zoom) || 1;
        const height = desk.offsetHeight;
        const width = Math.min(stage.clientWidth * 0.88, Math.max(340, height * 0.7), 640);
        renderScale = width / phone.offsetWidth;
        const deviceHeight = phone.offsetHeight * renderScale;
        const top = header.offsetHeight + parseFloat(getComputedStyle(header).top) + 24;
        const available = Math.max(1, height - top - 18);
        const overflow = Math.max(0, deviceHeight - available);
        const galleryCenter = world.offsetTop + parallax.offsetTop * zoom + (short ? 0 : mobile ? -30 : -50);
        // Cache the layout here so scrubbing only writes the camera and reading band.
        positionFocus = (focus, radius = 0.05, framing = focus) => {
          const reading = hasReadingSequence();
          const cameraFocus = reading ? framing : focus;
          const viewportFocus = reading ? 0.20 + cameraFocus * 0.74 : 0.5;
          const crop = Math.min(overflow, Math.max(0, deviceHeight * cameraFocus - available * viewportFocus));
          const center = top + Math.max(0, available - deviceHeight) / 2 + deviceHeight / 2 - crop;
          travel.style.setProperty("--detail-shift", (center - galleryCenter) / zoom + "px");
          if (reading) {
            phone.style.setProperty("--reading-focus", focus * 100 + "%");
            phone.style.setProperty("--reading-radius", radius * 100 + "%");
          }
        };
        const screen = currentScreen();
        positionFocus(screen.focus, screen.radius, screen.framing);
        stage.style.setProperty("--detail-header-height", (top - 6) + "px");
        stage.style.setProperty("--detail-phone-width", width + "px");
        travel.style.setProperty("--detail-scale", renderScale / zoom);
        travel.style.setProperty("--detail-start-scale", zoom / renderScale);
        if (inDetail) setDetailResolution(renderScale);
      };
      function setDetailActive(active) {
        if (inDetail === active) return;
        inDetail = active;
        stage.classList.toggle("is-in-detail", active);
        for (const card of cards) card.inert = active;
        opening.inert = unfolded.inert = active;
        if (active) {
          reset();
          driftX(0);
          driftY(0);
        }
        syncPhoneAccess();
        updatePosterDescription();
        syncCardMotion();
        setDetailResolution(active ? renderScale : 1);
      }
      function syncDetail(timeline) {
        setDetailActive(timeline.time() > 0.14);
        stage.classList.toggle("is-front-detail", timeline.progress() >= 0.999);
      }
      measureDetail();
      const detail = gsap.timeline({
        scrollTrigger: {
          id: "screen-detail", trigger: scene, start: galleryEnd,
          end: detailEnd,
          scrub: 0.4, invalidateOnRefresh: true,
          onRefresh(trigger) {
            measureDetail();
            syncDetail(trigger.animation);
          },
        },
        onUpdate() { syncDetail(this); },
      });
      detail.fromTo(stage, { "--detail-ink": 1 }, {
        "--detail-ink": 0, duration: 0.34, ease: "sine.inOut", immediateRender: false,
      }, 0.14).fromTo(travel, { "--detail-progress": 0 }, {
        "--detail-progress": 1, duration: 0.77, ease: "power1.inOut", immediateRender: false,
      }, 0.23);
      if (short) {
        detail.fromTo(phonePose, { pitch: 5, yaw: -14, roll: mobile ? -7 : -9 }, {
          pitch: 0, yaw: 0, roll: 0, duration: 0.35,
          onUpdate: syncPhonePose, immediateRender: false,
        }, 0.16);
      }
      function buildTourMotion() {
        const steps = tourSteps.slice(0, activePath().length);
        const lastTourIndex = steps.length - 1;
        if (sideNotes) {
          const beat = 1;
          const syncTourScreen = (time) => {
            setTourIndex(time < 0.06 ? -1 : Math.min(lastTourIndex, Math.floor(time / beat)));
            if (tourIndex < 0 || !hasReadingSequence()) return;
            // Hold each passage for reading, then pan to the next as the caption changes.
            const position = gsap.utils.clamp(0, lastTourIndex, time / beat - 0.60);
            const from = Math.floor(position);
            const start = screenAt(from);
            const end = screenAt(Math.min(lastTourIndex, from + 1));
            const t = Math.min(1, (position - from) / 0.70);
            const mix = t * t * (3 - 2 * t);
            positionFocus(
              gsap.utils.interpolate(start.focus, end.focus, mix),
              gsap.utils.interpolate(start.radius ?? 0.05, end.radius ?? 0.05, mix),
              gsap.utils.interpolate(start.framing ?? start.focus, end.framing ?? end.focus, mix),
            );
          };
          const tour = gsap.timeline({
            scrollTrigger: {
              id: "lecture-margins", trigger: scene, start: detailEnd,
              end: () => "bottom top+=" + (stage.offsetHeight + desk.offsetHeight * 0.2),
              scrub: 0.4, invalidateOnRefresh: true,
              onRefresh: trigger => syncTourScreen(trigger.animation.time()),
            },
            onUpdate() { syncTourScreen(this.time()); },
          });
          steps.forEach((step, index) => {
            const at = index * beat;
            tour.fromTo(step, { autoAlpha: 0, y: 12 }, {
              autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out",
            }, at + 0.06);
            if (index < lastTourIndex) {
              tour.to(step, { autoAlpha: 0, y: -8, duration: 0.22, ease: "sine.in" }, at + 0.76);
            }
          });
        } else {
          for (const item of steps) {
            gsap.fromTo(item, { autoAlpha: 0, y: 32 }, {
              autoAlpha: 1, y: 0, ease: "power1.out",
              scrollTrigger: { trigger: item, start: "top 98%", end: "top 72%", scrub: 0.3 },
            });
          }
        }
      }
      let tourMotion = gsap.context(buildTourMotion);
      rebuildTourMotion = () => {
        tourMotion.revert();
        if (sideNotes) scene.style.setProperty("--margin-travel", marginPages() * 100 + "svh");
        tourMotion = gsap.context(buildTourMotion);
        ScrollTrigger.refresh();
      };
      return () => {
        rebuildTourMotion = () => {};
        tourMotion.revert();
        if (sideNotes) {
          setTourIndex(-1);
          scene.after(margins);
          scene.classList.remove("has-side-notes");
          scene.style.removeProperty("--margin-travel");
        }
        setDetailActive(false);
        stage.classList.remove("is-front-detail");
        measureDetail = () => {};
        stage.style.removeProperty("--detail-header-height");
        stage.style.removeProperty("--detail-phone-width");
        travel.style.removeProperty("--detail-scale");
        travel.style.removeProperty("--detail-start-scale");
        travel.style.removeProperty("--detail-shift");
        resetDesk();
        drag = null;
        recordingMotion.kill();
        drawLectureWave(0);
        floats.forEach((float) => float.kill());
        syncCardMotion = () => {};
        phone.classList.remove("is-dragging");
        [rotateY, rotateZ, driftY, driftX, hoverPitch, hoverYaw, hoverLight].forEach((update) =>
          update.tween.kill(),
        );
        gsap.set(parallax, { clearProps: "transform" });
        phonePose.turn = 0;
        phonePose.lean = 0;
        phonePose.hoverPitch = 0;
        phonePose.hoverYaw = 0;
        phonePose.hoverLight = 0;
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
        window.removeEventListener("blur", reset);
      };
    },
  );
})();
