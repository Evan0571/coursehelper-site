window.COURSEHELPER_COPY = {
  zh: {
    pageTitle: "CourseHelper iPhone 版 · 从课堂到复习", skip: "跳到正文", navigation: "主导航", language: "语言",
    demoNav: "产品演示", faqNav: "常见问题", platform: "即将登陆 iPhone", titleLine: "从这一堂课，", titleEm: "到课后复习。",
    lead: "录下课堂，回看没听懂的那一段，再把笔记变成闪卡。所有内容，都留在这门课里。",
    email: "邮箱地址", placeholder: "输入你的邮箱", join: "加入候补名单", consent: "我同意接收 CourseHelper 上线通知邮件。", privacy: "隐私政策",
    demoCaption: "App 实录 · 示例课程", chooseDemo: "选择演示内容", today: "课表", lecture: "课堂", study: "复习",
    sourceLabel: "课程问答", sourceTitle: "找到答案，", sourceEm: "也找到出处。",
    sourceLead: "用中文或英文提问。点开回答里的引用，就能回到课堂原文。",
    sample: "问答示例", question: "酶为什么能加快反应？", answer: "酶提供了一条活化能更低的反应路径。", sourceLink: "查看课堂转录",
    quote: "“酶提供了另一条反应路径，从而降低了反应所需的活化能。”",
    faqTitle: "常见问题", supportLink: "联系支持", availabilityQ: "什么时候可以下载？", availabilityA: "CourseHelper 正在准备登陆 iPhone。",
    notify: "留下邮箱，上线时我们会通知你。", pricingQ: "加入候补名单需要付费吗？",
    pricingA: "加入名单免费。App 内部分转录和 AI 功能有用量限制，或需要付费方案。选择方案前可以查看价格和对应额度。",
    recordQ: "我可以录下课堂吗？", recordA: "获得必要许可后，你可以录制或导入课堂音频。请先确认授课老师和学校的录音要求。",
    removeQ: "我可以退出候补名单吗？", removeA: "可以。请用报名时的邮箱联系我们，申请移除。", privacyDetails: "候补名单隐私说明与联系方式",
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
  const legacyScenes = { organize: "today", capture: "lecture", review: "study" };
  function navigateOldLink() {
    const hash = location.hash.slice(1);
    const feature = hash.startsWith("feature-") ? hash.slice(8) : hash ? null : new URLSearchParams(location.search).get("feature");
    const next = Object.hasOwn(legacyScenes, feature) ? legacyScenes[feature] : hash === "practice" ? "study" : null;
    if (next) { select(next); showcase.scrollIntoView(); }
    else if (feature === "ask") document.getElementById("context").scrollIntoView();
  }
  addEventListener("hashchange", navigateOldLink);
  document.addEventListener("coursehelper:language", event => {
    lang = event.detail.lang;
    select(scene);
  });
  controls.hidden = false;
  playback.hidden = false;
  window.addEventListener("pageshow", event => {
    if (!event.persisted) requestAnimationFrame(navigateOldLink);
  });
})();
