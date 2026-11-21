(() => {
  "use strict";
  document.documentElement.classList.add("has-js");
  const storageKey = "coursehelperSiteLang";
  const isMarketing = document.body.classList.contains("marketing");
  const english = {};
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    english[node.dataset.i18n] = node.innerHTML;
  });
  const chinese = {
    skip: "跳到正文",
    navExplore: "探索产品",
    navFaq: "常见问题",
    navContact: "加入候补名单",
    waitlistDescription: "即将登陆 iPhone。留下邮箱，上线时我们会发送一封通知。",
    waitlistLabel: "邮箱地址",
    waitlistPlaceholder: "输入你的邮箱",
    waitlistButton: "加入候补名单",
    waitlistConsent: "我同意收到 CourseHelper 上线通知邮件，也可以随时申请删除邮箱。",
    heroLine1: "少一点散乱。",
    heroLine2: "多一点理解。",
    heroDescription:
      "课表、录音、笔记与复习，集中在一处。",
    heroPrimary: "加入候补名单",
    heroPlatform: "为 iPhone 打造，围绕你的课堂。",
    galleryCourse: "每门课，都有自己的空间。",
    galleryAi: "带着课堂内容，继续问。",
    gallerySummary: "抓住一节课的重点。",
    galleryFlashcards: "让学过的，留下来。",
    galleryReview: "找到适合你的复习方式。",
    galleryCaption: "走进 CourseHelper · 示例课程与演示内容",
    exploreTitle: "学习的每一部分，都有归处。",
    tabOrganize: "安排课程",
    tabCapture: "留下课堂",
    tabAsk: "继续理解",
    tabReview: "把它记住",
    filmNote: "App 操作演示 · 示例内容",
    exampleNote: "示例内容",
    practiceTitle: "读过。<br>想起。<br>真的理解。",
    practiceBody:
      "用课堂内容生成闪卡、测验、术语和学习指南。",
    practiceTag1: "闪卡",
    practiceTag2: "测验",
    practiceTag3: "学习指南",
    demoHeading: "试着翻一张闪卡",
    flipHint: "点一下，查看答案",
    demoNote: "交互示例",
    nextCard: "下一张",
    detailsTitle: "每个人都有<br><span>自己的学习节奏。</span>",
    detailTitle1: "用熟悉的语言学习",
    detailBody1: "界面可选中文或英文，课堂摘要也能单独选语言。",
    detailTitle2: "接着上次的思路",
    detailBody2: "回到一门课，就能找到之前的对话、笔记和课堂资料。",
    detailTitle3: "先看一门示例课",
    detailBody3: "添加自己的课程前，可以先翻看示例课里的课堂笔记。",
    faqTitle: "开始前，<br>聊几个问题。",
    faqContact: "还有别的问题？",
    faqQ1: "CourseHelper 适合谁？",
    faqA1:
      "适合想把课程、课堂内容与复习放在一起的学生。中英文支持尤其适合身处英语授课环境、需要在两种语言之间理解和思考的留学生。",
    faqQ2: "一门课程里可以放些什么？",
    faqA2:
      "课次、课程信息、文件、链接和学习对话。在每节课里，可以查看转录、摘要、笔记和资料，再基于这些内容创建复习材料。",
    faqQ3: "可以导入已有的课堂录音吗？",
    faqA3: "可以。获得许可后，在对应课次导入音频，也可以当场录音。支持本机转录的设备会将音频留在手机上，并把转录文字保存到你的账号。云端转录会上传一份音频，并使用云端转录额度。",
    faqQ6: "怎么对照课堂资料核实 AI 的回答？",
    faqA6: "回答引用了课堂资料时，点编号即可查看出处。如果原文可用，还可以打开对应的笔记、逐字稿或文件，读一读前后文。",
    faqQ4: "怎样体验 CourseHelper？",
    faqA4: "CourseHelper 正在准备上线。加入候补名单，上线时我们会发邮件通知。",
    faqA4Link: "加入候补名单",
    faqQ5: "在哪里了解隐私和账号信息？",
    faqA5:
      "隐私政策说明了数据、服务提供方与账号控制方式。账号或数据删除相关问题，也可以联系支持。",
    privacyLink: "阅读隐私政策",
    closingTitle: "给理解，<br>留一点空间。",
    closingCta: "聊聊 CourseHelper",
    footerSupport: "支持",
    footerPrivacy: "隐私政策",
    footerTerms: "使用条款",
    backToTop: "回到顶部",
  };
  const featureData = {
    organize: {
      en: {
        title: "Where did we<br>leave off?",
        body: "Open a course and pick a class by date to revisit its key points.",
        alt: "A computing course with three class sessions listed by date",
      },
      zh: {
        title: "上节课，<br>讲到哪儿了？",
        body: "打开课程，按日期找到上节课的摘要。",
        alt: "计算机课程中按日期排列的三节课",
      },
    },
    capture: {
      en: {
        title: "Find the moment<br>you missed.",
        body: "Follow the timestamps to find your lecturer’s exact words.",
        alt: "A lecture transcript with timestamped passages",
      },
      zh: {
        title: "回到没听懂的<br>那一分钟。",
        body: "按时间戳翻看转写，找到老师讲的那句话。",
        alt: "带时间戳的课堂逐字稿",
      },
    },
    ask: {
      en: {
        title: "Ask a question.<br>Check the source.",
        body: "Open a source in an AI answer to see the class material it cites.",
        alt: "A question about spaced practice in the class assistant",
      },
      zh: {
        title: "问完 AI，<br>再看原文。",
        body: "展开回答里的来源，看看它引用了哪份课堂资料。",
        alt: "在课次 AI 中询问为什么要间隔复习",
      },
    },
    review: {
      en: {
        title: "Can you answer<br>from memory?",
        body: "Try a flashcard from class, then flip it to check your answer.",
        alt: "A flashcard question with a Reveal answer button",
      },
      zh: {
        title: "翻面之前，<br>你还记得吗？",
        body: "用课堂闪卡考考自己，再翻面核对答案。",
        alt: "课堂闪卡的问题面，下方有显示答案按钮",
      },
    },
  };
  const cards = {
    en: [
      [
        "What does an enzyme change about a chemical reaction?",
        "It lowers the activation energy, helping the reaction happen faster without being used up.",
      ],
      [
        "Why does an enzyme’s shape matter?",
        "Its active site fits specific substrates. A change in shape can reduce or stop its activity.",
      ],
      [
        "What can happen to an enzyme at a very high temperature?",
        "It can denature. The active site changes shape, so the substrate no longer fits as well.",
      ],
    ],
    zh: [
      [
        "酶会改变化学反应的什么？",
        "它降低反应所需的活化能，让反应更快发生，而自身不会被消耗。",
      ],
      [
        "为什么酶的形状很重要？",
        "酶的活性位点与特定底物相匹配。形状改变，可能使酶的活性降低或消失。",
      ],
      [
        "温度过高，酶可能会发生什么？",
        "酶可能发生变性，活性位点的形状改变，底物就不再容易与它结合。",
      ],
    ],
  };
  let language = "en";
  let cardIndex = 0;
  let answerShown = false;
  let flipVersion = 0;
  let flipping = false;
  function stopCardMotion() {
    flipVersion += 1;
    flipping = false;
    document
      .querySelector(".flashcard-rotor")
      ?.getAnimations()
      .forEach((animation) => animation.cancel());
  }
  async function flipCard() {
    if (flipping) return;
    const rotor = document.querySelector(".flashcard-rotor");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      answerShown = !answerShown;
      renderCard();
      return;
    }
    flipping = true;
    const version = ++flipVersion;
    try {
      const close = rotor.animate(
        [{ transform: "rotateY(0deg)" }, { transform: "rotateY(85deg)" }],
        { duration: 150, easing: "ease-in", fill: "forwards" },
      );
      await close.finished;
      if (version !== flipVersion) return;
      answerShown = !answerShown;
      renderCard();
      close.cancel();
      // One visible face avoids Safari's native-button 3D/backface rendering bugs.
      await rotor.animate(
        [{ transform: "rotateY(-85deg)" }, { transform: "rotateY(0deg)" }],
        { duration: 230, easing: "cubic-bezier(.16,1,.3,1)" },
      ).finished;
    } catch {
      // Language and next-card actions cancel an in-flight turn.
    } finally {
      if (version === flipVersion) flipping = false;
    }
  }
  function requestedLanguage() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (["en", "zh"].includes(requested)) return requested;
    try {
      const stored = localStorage.getItem(storageKey);
      if (["en", "zh"].includes(stored)) return stored;
    } catch {
      /* Private browsing may disable storage. */
    }
    return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  }
  function preserveLanguage(link) {
    const original = link.dataset.baseHref || link.getAttribute("href");
    link.dataset.baseHref = original;
    if (!original || original.startsWith("#")) return;
    const url = new URL(original, location.href);
    if (
      url.origin !== location.origin ||
      !["http:", "https:", "file:"].includes(url.protocol)
    )
      return;
    url.searchParams.set("lang", language);
    link.href = url.href;
  }
  function renderFeatures() {
    document.querySelectorAll(".feature-panel").forEach((panel) => {
      const copy = featureData[panel.dataset.current][language];
      panel.querySelector("h3").innerHTML = copy.title;
      panel.querySelector(".feature-description").textContent = copy.body;
      panel.querySelector(".movie-poster").alt = copy.alt;
    });
    document.dispatchEvent(new CustomEvent("coursehelper:language"));
  }
  function renderCard() {
    if (!isMarketing || !document.getElementById("flashcard")) return;
    document
      .getElementById("flashcard")
      .setAttribute("aria-pressed", String(answerShown));
    document
      .getElementById("flashcard")
      .setAttribute(
        "aria-describedby",
        answerShown ? "card-answer-hint" : "flashcard-hint",
      );
    document.getElementById("card-content").textContent =
      cards[language][cardIndex][0];
    const answer = document.getElementById("card-answer");
    if (answer) answer.textContent = cards[language][cardIndex][1];
    document.getElementById("card-counter").textContent =
      `0${cardIndex + 1} / 03`;
    document.getElementById("card-side").textContent =
      language === "zh" ? "问题" : "QUESTION";
    document.getElementById("card-answer-side").textContent =
      language === "zh" ? "答案" : "ANSWER";
    document.getElementById("card-answer-hint").textContent =
      language === "zh" ? "点一下，回到问题" : "Tap to return to the question";
    document.querySelectorAll(".flashcard-subject").forEach((node) => {
      node.textContent =
        language === "zh" ? "生物学 · 酶" : "BIOLOGY · ENZYMES";
    });
    document
      .querySelector(".flashcard-front")
      .setAttribute("aria-hidden", String(answerShown));
    document
      .querySelector(".flashcard-back")
      .setAttribute("aria-hidden", String(!answerShown));
    document.querySelector('[data-i18n="flipHint"]').textContent =
      language === "zh" ? "点一下，查看答案" : "Tap to reveal the answer";
    document.getElementById("card-announcement").textContent =
      `${language === "zh" ? `第 ${cardIndex + 1} 张，共 3 张` : `Card ${cardIndex + 1} of 3`}. ${cards[language][cardIndex][answerShown ? 1 : 0]}`;
  }
  function applyLanguage(lang, updateUrl = false) {
    if (isMarketing) stopCardMotion();
    language = lang;
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
    try {
      localStorage.setItem(storageKey, lang);
    } catch {
      /* Language still works without persistence. */
    }
    const copy = isMarketing
      ? lang === "zh"
        ? chinese
        : english
      : window.COURSEHELPER_COPY?.[lang] || {};
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      const value = copy[node.dataset.i18n];
      if (value !== undefined) node.innerHTML = value;
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
      const value = copy[node.dataset.i18nPlaceholder] ?? english[node.dataset.i18nPlaceholder];
      if (value !== undefined) node.placeholder = value;
    });
    document
      .querySelectorAll("[data-lang]")
      .forEach((node) =>
        node.classList.toggle("active", node.dataset.lang === lang),
      );
    document.querySelectorAll("[data-lang-button]").forEach((button) => {
      const selected = button.dataset.langButton === lang;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document
      .querySelectorAll("a[data-preserve-lang]")
      .forEach(preserveLanguage);
    if (isMarketing) {
      document.title =
        lang === "zh"
          ? "CourseHelper — 给理解，留一点空间。"
          : "CourseHelper — Make room for understanding.";
      document.querySelector('meta[name="description"]').content =
        lang === "zh"
          ? "课表、课堂、笔记与复习，终于放在一起。CourseHelper 为英语课堂中的学习与理解，提供专注的 iPhone 学习空间。"
          : "Your courses, lectures, notes, and review. Finally together. CourseHelper brings the context of your classes into one calm study workspace for iPhone.";
      document
        .querySelector('[data-gallery-direction="-1"]')
        .setAttribute(
          "aria-label",
          lang === "zh" ? "上一组界面" : "Previous app screens",
        );
      document
        .querySelector('[data-gallery-direction="1"]')
        .setAttribute(
          "aria-label",
          lang === "zh" ? "下一组界面" : "Next app screens",
        );
      const mediaRoot = "assets/experiences/media-20261121/" + lang + "/";
      document.querySelectorAll("img[data-product-image]").forEach((img) => {
        if (img.dataset.altZh) {
          img.dataset.altEn ??= img.alt;
          img.alt = lang === "zh" ? img.dataset.altZh : img.dataset.altEn;
        }
        const src = mediaRoot + img.dataset.productImage;
        if (img.getAttribute("src") !== src) img.src = src;
      });
      document.querySelectorAll("video[data-src]").forEach((video) => {
        const name = video.dataset.src.split("/").pop();
        video.dataset.src = mediaRoot + name;
        video.poster = mediaRoot + name.replace(".mp4", "-poster.webp");
      });
      renderFeatures();
      renderCard();
    }
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      try {
        history.replaceState(null, "", url);
      } catch {
        /* Local file previews can restrict history updates. */
      }
    }
  }
  document
    .querySelectorAll("[data-lang-button]")
    .forEach((button) =>
      button.addEventListener("click", () =>
        applyLanguage(button.dataset.langButton, true),
      ),
    );
  document.querySelectorAll("[data-select-feature]").forEach((link) =>
    link.addEventListener("click", (event) => {
      const key = link.dataset.selectFeature;
      const target = document.getElementById(`feature-${key}`);
      if (!target) return;
      event.preventDefault();
      history.pushState(null, "", `#feature-${key}`);
      const navigation = new CustomEvent("coursehelper:select-feature", {
        detail: { key },
        cancelable: true,
      });
      if (document.dispatchEvent(navigation)) target.scrollIntoView();
    }),
  );
  document.getElementById("flashcard")?.addEventListener("click", flipCard);
  document.getElementById("next-card")?.addEventListener("click", () => {
    stopCardMotion();
    cardIndex = (cardIndex + 1) % cards.en.length;
    answerShown = false;
    renderCard();
    const card = document.getElementById("flashcard");
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      card.getAnimations().forEach((animation) => animation.cancel());
      card.animate(
        [
          { opacity: 0.3, transform: "translateY(12px) scale(.98)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 380, easing: "cubic-bezier(.22,1,.36,1)" },
      );
    }
  });
  const gallery = document.querySelector(".gallery-track");
  if (gallery) {
    const previous = document.querySelector('[data-gallery-direction="-1"]');
    const next = document.querySelector('[data-gallery-direction="1"]');
    const updateGallery = () => {
      previous.disabled = gallery.scrollLeft <= 1;
      next.disabled =
        gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2;
    };
    [previous, next].forEach((button) =>
      button.addEventListener("click", () => {
        gallery.scrollBy({
          left:
            Number(button.dataset.galleryDirection) *
            (gallery.querySelector(".gallery-card").offsetWidth + 18),
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      }),
    );
    gallery.addEventListener("scroll", updateGallery, { passive: true });
    new ResizeObserver(updateGallery).observe(gallery);
    updateGallery();
  }
  applyLanguage(requestedLanguage());
})();
