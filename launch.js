window.COURSEHELPER_COPY = {
  zh: {
    pageTitle: "CourseHelper iPhone 版 · 从课堂到复习", skip: "跳到正文", navigation: "主导航", language: "语言",
    demoNav: "探索课程", practiceNav: "试做小测", platform: "即将登陆 iPhone", titleLine: "从这一堂课，", titleEm: "到课后复习。",
    lead: "课表、课堂录音和笔记，都留在对应的课程里。遇到疑问可以追问原文，复习时还能用课堂内容出一组小测。",
    email: "邮箱地址", placeholder: "输入你的邮箱", join: "加入候补名单", consent: "我同意接收 CourseHelper 上线通知邮件。", privacy: "隐私政策",
    demoCaption: "App 实录 · 示例课程", chooseDemo: "选择演示内容", today: "课表", lecture: "课堂", study: "复习",
    sourceLabel: "课程问答", sourceTitle: "找到答案，", sourceEm: "也找到出处。",
    sourceLead: "用中文或英文提问。点开回答里的引用，就能回到课堂原文。",
    sample: "问答示例", question: "酶为什么能加快反应？", answer: "酶提供了一条活化能更低的反应路径。", sourceLink: "查看课堂转录 · 00:30",
    quote: "“把活化能想成最开始要翻过的小山。酶提供另一条更低的路径，却不改变起点和终点。”",
    faqTitle: "常见问题", supportLink: "联系支持", availabilityQ: "什么时候可以下载？", availabilityA: "CourseHelper 正在准备登陆 iPhone。",
    notify: "留下邮箱，上线时我们会通知你。", pricingQ: "加入候补名单需要付费吗？",
    pricingA: "加入名单免费。App 内部分转录和 AI 功能有用量限制，或需要付费方案。选择方案前可以查看价格和对应额度。",
    recordQ: "我可以录下课堂吗？", recordA: "获得必要许可后，你可以录制或导入课堂音频。请先确认授课老师和学校的录音要求。",
    removeQ: "我可以退出候补名单吗？", removeA: "可以。请用报名时的邮箱联系我们，申请移除。", privacyDetails: "候补名单隐私说明与联系方式",
    readInLecture: "回到示例课次看原文",
    tourAction: "探索示例课程", updatesLink: "接收上线通知", tourLabel: "走进示例课程", tourTitle: "这周的生物课。",
    scheduleTitle: "一周的安排，从大纲开始。", scheduleBody: "导入教学大纲，也可以手动添加课程。确认每周上课的时间，再存入课表。",
    scheduleSample: "课表示例", biology: "生物学入门", meetDays: "周二、周四", meetLocation: "讲课 · 生命科学楼 204", dueLabel: "下节课前",
    readChapter: "阅读第 6 章", dueDetail: "带上画好的能量曲线。",
    notebookTitle: "一节课的内容，放在一起。", notebookBody: "获得许可后录下课堂，或导入已有音频。打开这节课，就能查转录、读摘要，翻到自己当时记下的问题。",
    sampleLecture: "课次示例", lessonName: "酶与细胞能量", views: "查看课次内容", summary: "摘要", transcript: "转录", notes: "笔记", files: "资料",
    keyIdea: "课堂重点", keyText: "酶降低了反应所需的活化能，反应起点和终点的能量保持不变。", nextClass: "下节课前", nextText: "画出有酶和无酶时的两条能量曲线。",
    passageA: "把活化能想成最开始要翻过的小山。酶提供另一条更低的路径，却不改变起点和终点。", passageB: "底物在活性位点结合，产物离开后，酶仍然可以继续催化。",
    notesTitle: "我的课堂笔记", noteText: "把两条曲线画在同一组坐标轴上，分别标出起点、峰值和终点。", officeHours: "答疑时想问", noteQuestion: "pH 的变化会怎样影响活性位点的形状？",
    courseMaterials: "课程资料", slides: "课堂幻灯片 · 酶的基础", slideText: "学习目标：解释活化能、识别活性位点，并预测温度的影响。", reading: "阅读材料 · 速率与平衡", readingText: "即使一个反应在能量上有利，它也可能进行得很慢。速率描述的是反应进行的快慢。",
    practiceLabel: "课后复习", practiceTitle: "合上笔记，<br>试着答一题。", practiceBody: "用一门课或一节课的内容制作闪卡、小测和学习指南。下面两道题，就来自刚才的生物课。",
    sampleQuiz: "小测示例 · BIO 140", answers: "答案选项", quizOne: "酶催化了一次反应后，会发生什么？", q1a: "酶会在这次反应中耗尽。", q1b: "酶还可以催化下一次反应。", why1: "产物离开活性位点后，酶就能再次发挥作用。",
    quizTwo: "温度过高时，酶的催化效率为什么可能下降？", q2a: "酶的活性位点可能改变形状。", q2b: "酶的分子停止了运动。", why2: "高温可能改变蛋白质的形状，让底物更难与活性位点结合。",
    bilingualQ: "能用中文复习英文课吗？", bilingualA: "可以。你可以切换 App 的界面语言，用中文或英文提问，并在生成复习资料时选择语言。", backTop: "回到顶部",
    launchTitle: "上线时，给你发封邮件。",
    support: "支持", terms: "使用条款", footer: "页脚", viewer: "App 演示", enlarge: "放大演示画面", close: "关闭"
  }
};
(() => {
  "use strict";
  const showcase = document.querySelector(".showcase");
  const stage = showcase.querySelector(".photo-stage");
  const poster = document.getElementById("demo-poster");
  const film = document.getElementById("demo-film");
  const playback = showcase.querySelector(".playback");
  const controls = showcase.querySelector(".scene-switch");
  const scenes = [...controls.querySelectorAll("button")];
  const error = showcase.querySelector(".demo-error");
  const expand = showcase.querySelector(".expand");
  const viewer = document.querySelector(".viewer");
  const slot = document.querySelector(".viewer-slot");
  const position = document.createComment("Inline app demo");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const messages = {
    en: { today: "Today’s class schedule and calendar", lecture: "A lecture summary and its timestamped transcript", study: "A flashcard question and its revealed answer",
      play: "Play demo", pause: "Pause demo", replay: "Replay demo", error: "The video couldn’t load. Press play to try again." },
    zh: { today: "今日课表与日历", lecture: "课堂摘要与带时间戳的转录", study: "复习闪卡与揭晓的答案",
      play: "播放演示", pause: "暂停演示", replay: "重新播放", error: "视频暂时无法播放，点播放按钮重试。" }
  };
  const assetRoot = "assets/launch-demo/";
  let lang = "en";
  let scene = "today";
  let visible = false;
  const allowAuto = () => !reduce.matches && !navigator.connection?.saveData;
  let pausedByUser = false;
  let wantsPlayback = allowAuto();
  let revision = 0;
  function updateControl() {
    const playing = !film.paused && !film.ended;
    playback.classList.toggle("is-playing", playing);
    playback.setAttribute("aria-label", messages[lang][playing ? "pause" : film.ended ? "replay" : "play"]);
  }
  function updatePlayback() {
    const current = ++revision;
    if (!wantsPlayback || !visible || document.hidden) {
      film.pause();
      updateControl();
      return;
    }
    if (!film.getAttribute("src")) film.src = assetRoot + scene + "-" + lang + ".mp4";
    film.play().catch(() => {
      if (current !== revision) return;
      wantsPlayback = false;
      updateControl();
    });
  }
  function select(next) {
    revision++;
    film.pause();
    film.classList.remove("playing-frame");
    film.removeAttribute("src");
    film.load();
    scene = next;
    poster.src = assetRoot + scene + "-" + lang + ".webp";
    poster.alt = messages[lang][scene];
    error.hidden = true;
    for (const button of scenes) button.setAttribute("aria-pressed", String(button.dataset.scene === scene));
    updatePlayback();
  }
  for (const button of scenes) button.addEventListener("click", () => {
    if (button.dataset.scene === scene) return;
    wantsPlayback = !pausedByUser && allowAuto();
    select(button.dataset.scene);
  });
  film.addEventListener("playing", () => {
    const current = revision;
    const reveal = () => { if (current === revision) film.classList.add("playing-frame"); };
    if (film.requestVideoFrameCallback) film.requestVideoFrameCallback(reveal);
    else reveal();
    updateControl();
  });
  film.addEventListener("pause", updateControl);
  film.addEventListener("ended", () => { wantsPlayback = false; updateControl(); });
  film.addEventListener("error", () => {
    if (!film.getAttribute("src")) return;
    wantsPlayback = false;
    film.classList.remove("playing-frame");
    error.textContent = messages[lang].error;
    error.hidden = false;
    updateControl();
  });
  playback.addEventListener("click", () => {
    if (film.error) { film.removeAttribute("src"); film.load(); error.hidden = true; }
    wantsPlayback = film.paused || film.ended;
    pausedByUser = !wantsPlayback;
    if (film.ended) film.currentTime = 0;
    updatePlayback();
  });
  const observer = new IntersectionObserver(entries => {
    visible = entries[entries.length - 1].intersectionRatio >= .18;
    updatePlayback();
  }, {threshold: .18});
  observer.observe(stage);
  document.addEventListener("visibilitychange", updatePlayback);
  reduce.addEventListener("change", () => {
    if (reduce.matches) { wantsPlayback = false; updatePlayback(); }
  });
  if (typeof viewer.showModal === "function") {
    showcase.before(position);
    expand.hidden = false;
    expand.addEventListener("click", () => {
      slot.append(showcase);
      viewer.showModal();
      visible = true;
      updatePlayback();
    });
    viewer.querySelector(".close-viewer").addEventListener("click", () => viewer.close());
    viewer.addEventListener("click", event => {
      if (event.target !== viewer) return;
      const rect = viewer.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close();
    });
    viewer.addEventListener("close", () => {
      position.after(showcase);
      expand.focus({preventScroll: true});
      updatePlayback();
    });
  }
  const notebook = document.querySelector(".notebook-switch");
  const views = [...notebook.querySelectorAll("[data-view]")];
  for (const button of views) {
    button.addEventListener("click", () => {
      for (const view of views) {
        const selected = view === button;
        view.setAttribute("aria-pressed", String(selected));
        document.getElementById(view.getAttribute("aria-controls")).hidden = !selected;
      }
    });
  }
  notebook.hidden = false;
  function openTranscript() {
    notebook.querySelector('[data-view="transcript"]').click();
    const transcript = document.getElementById("lesson-transcript");
    transcript.focus({preventScroll: true});
    document.getElementById("lecture-notebook").scrollIntoView({block: "start"});
  }
  const citation = document.querySelector(".citation-link");
  citation.hidden = false;
  citation.addEventListener("click", event => {
    // Following the same fragment again does not fire hashchange.
    if (location.hash === citation.hash) {
      event.preventDefault();
      openTranscript();
    }
  });

  const practice = document.getElementById("practice");
  const questions = [...practice.querySelectorAll(".quiz-item")];
  const feedback = practice.querySelector(".quiz-feedback");
  const nextQuestion = practice.querySelector(".quiz-next");
  const quizCopy = {
    en: { correct: "Correct.", incorrect: "Try again.", next: "Next question", restart: "Start over" },
    zh: { correct: "答对了。", incorrect: "再试一次。", next: "下一题", restart: "重新开始" }
  };
  let questionIndex = 0;
  function updateQuiz() {
    const current = questions[questionIndex];
    const checked = current.querySelector('[aria-pressed="true"]');
    const correct = checked?.dataset.correct === "true";
    feedback.textContent = checked ? quizCopy[lang][correct ? "correct" : "incorrect"] + " " + current.querySelector(".quiz-reason").textContent : "";
    nextQuestion.hidden = !correct;
    nextQuestion.textContent = quizCopy[lang][questionIndex < questions.length - 1 ? "next" : "restart"];
  }
  for (const question of questions) {
    const options = question.querySelector(".quiz-options");
    options.hidden = false;
    options.addEventListener("click", event => {
      const choice = event.target.closest("button");
      if (!choice) return;
      for (const button of options.querySelectorAll("button")) button.setAttribute("aria-pressed", String(button === choice));
      updateQuiz();
    });
  }
  nextQuestion.addEventListener("click", () => {
    questions[questionIndex].hidden = true;
    questionIndex = (questionIndex + 1) % questions.length;
    const current = questions[questionIndex];
    current.hidden = false;
    for (const answer of current.querySelectorAll("button")) answer.setAttribute("aria-pressed", "false");
    document.getElementById("quiz-progress").textContent = (questionIndex + 1) + " / " + questions.length;
    updateQuiz();
    current.querySelector("h3").focus();
  });
  const legacyScenes = { organize: "today", capture: "lecture", review: "study" };
  function followSectionLink() {
    const hash = location.hash.slice(1);
    if (hash === "lesson-transcript") { openTranscript(); return; }
    const feature = hash.startsWith("feature-") ? hash.slice(8) : hash ? null : new URLSearchParams(location.search).get("feature");
    const next = Object.hasOwn(legacyScenes, feature) ? legacyScenes[feature] : null;
    if (next) { select(next); showcase.scrollIntoView(); }
    else if (feature === "ask") document.getElementById("context").scrollIntoView();
  }
  addEventListener("hashchange", followSectionLink);
  document.addEventListener("coursehelper:language", event => {
    lang = event.detail.lang;
    updateQuiz();
    select(scene);
  });
  controls.hidden = false;
  playback.hidden = false;
  window.addEventListener("pageshow", event => {
    if (!event.persisted) requestAnimationFrame(followSectionLink);
  });
})();
