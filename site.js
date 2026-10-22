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
    navPractice: "试着复习",
    navFaq: "常见问题",
    navContact: "联系了解",
    heroEyebrow: "课堂有条理，思路更清晰。",
    heroLine1: "少一点散乱。",
    heroLine2: "多一点理解。",
    heroDescription:
      "课表、课堂、笔记与复习，终于放在一起。给学习一个专注的空间，也给思考留一点余地。",
    heroPrimary: "认识 CourseHelper",
    heroPlatform: "为 iPhone 打造，围绕你的课堂。",
    galleryCourse: "每门课，都有自己的空间。",
    galleryAi: "带着课堂内容，继续问。",
    gallerySummary: "抓住一节课的重点。",
    galleryFlashcards: "让学过的，留下来。",
    galleryReview: "找到适合你的复习方式。",
    galleryCaption: "走进 CourseHelper · 内置 Example 课程与演示内容",
    introEyebrow: "少一些来回切换，多一些前后连接。",
    introTitle: "一门课，远不止一个文件夹。",
    introBody:
      "是想再听一遍的讲解，是记在页边的疑问，也是终于想通的那个概念。从第一节课到下一次复习，CourseHelper 把这些片段连在一起。",
    chainCourse: "课程",
    chainLecture: "课堂",
    chainUnderstanding: "理解",
    exploreEyebrow: "从课前，一直陪你到课后。",
    exploreTitle: "学习的每一部分，都有归处。",
    exploreAside: "慢慢看，按你的节奏。<br>一个空间，串起整个学习日。",
    tabOrganize: "安排课程",
    tabCapture: "留下课堂",
    tabAsk: "继续理解",
    tabReview: "把它记住",
    featureLink: "了解 CourseHelper 的更多信息",
    exampleNote: "示例内容",
    aiEyebrow: "让每个问题，都有课堂作为背景。",
    aiLine1: "带上你的问题。",
    aiLine2: "接着这门课聊。",
    aiBody:
      "从一门课或一节课堂发起提问，结合已经保存的资料，沿着引用回看来源。让对话始终围绕你正在学的内容。",
    aiDetail1: "课程与课次上下文",
    aiDetail2: "回答附带来源引用",
    aiDetail3: "用中文或英文提问",
    contextCenter: "理解，从上下文开始。",
    contextTranscript: "课堂转录",
    contextQuestions: "你的问题",
    contextNotes: "课堂笔记",
    contextMaterials: "课程资料",
    practiceEyebrow: "用片刻回想，把理解留下来。",
    practiceTitle: "读过。<br>想起。<br>真的理解。",
    practiceBody:
      "把课堂内容变成闪卡、测验、关键术语与学习指南。换一种方式，重新走近学过的知识。",
    practiceTag1: "闪卡",
    practiceTag2: "测验",
    practiceTag3: "学习指南",
    demoHeading: "试着翻一张闪卡",
    flipHint: "点一下，查看答案",
    demoNote: "这是一个交互示例。你的复习，从自己的课堂开始。",
    nextCard: "下一张",
    detailsTitle: "贴近你真正的<br>学习习惯。",
    detailsAside: "那些小细节，<br>让学习继续向前。",
    detailTitle1: "两种语言，你的节奏。",
    detailBody1:
      "中英文界面随时切换，选择可用的转录和摘要语言。用最有助于思考的语言提问，慢慢理清英语课堂里的概念。",
    detailTitle2: "随时接上之前的思路。",
    detailBody2:
      "回到一门课，接着上次的对话，找到上一节课记下的笔记。学习的过程，也有一个可以回去的地方。",
    detailTitle3: "从一门示例课开始。",
    detailBody3:
      "内置 Example 课程与交互式引导，带你看一节课如何被整理、理解和复习。熟悉以后，再把自己的课堂放进来。",
    faqEyebrow: "你可能想知道",
    faqTitle: "开始前，<br>聊几个问题。",
    faqContact: "还有别的问题？",
    faqQ1: "CourseHelper 适合谁？",
    faqA1:
      "适合想把课程、课堂内容与复习放在一起的学生。中英文支持尤其适合身处英语授课环境、需要在两种语言之间理解和思考的留学生。",
    faqQ2: "一门课程里可以放些什么？",
    faqA2:
      "课次、课程信息、文件、链接和学习对话。在每节课里，可以查看转录、摘要、笔记和资料，再基于这些内容创建复习材料。",
    faqQ3: "录音和 AI 功能怎样使用？",
    faqA3:
      "获得必要许可后，你可以录制或导入课堂音频。转录和 AI 功能取决于所选服务、网络与可用额度；你可以在 App 中查看当前方案与可用额度。",
    faqQ4: "怎样体验 CourseHelper？",
    faqA4: "欢迎联系我们，了解当前可用版本和体验方式。",
    faqA4Link: "联系 CourseHelper →",
    faqQ5: "在哪里了解隐私和账号信息？",
    faqA5:
      "隐私政策说明了数据、服务提供方与账号控制方式。账号或数据删除相关问题，也可以联系支持。",
    privacyLink: "阅读隐私政策 →",
    closingTitle: "给理解，<br>留一点空间。",
    closingBody: "少一点散乱，多一点准备。迎接下一堂课。",
    closingCta: "聊聊 CourseHelper",
    footerSupport: "支持",
    footerPrivacy: "隐私政策",
    footerTerms: "使用条款",
    backToTop: "回到顶部 ↑",
  };
  const featureData = {
    organize: {
      image: "course-overview.webp",
      en: {
        title: "Your semester.<br>A little more settled.",
        body: "Start with your schedule and to-dos. Open a course to find its class sessions, materials, and details right where you left them.",
        details: [
          "Daily schedule and cross-course tasks",
          "Course details and weekly class sessions",
          "Files and links, kept with the right course",
        ],
        caption: "A little structure. A lot less searching.",
        alt: "Example course overview with sessions and course navigation",
      },
      zh: {
        title: "这一学期，<br>更有条理一点。",
        body: "从今天的课表和待办开始，打开课程，就能找到每周的课次、资料和课程信息。学习需要的东西，各就各位。",
        details: [
          "当天课表与跨课程待办",
          "课程信息与按周排列的课次",
          "按课程归档的文件和链接",
        ],
        caption: "有一点条理，少很多翻找。",
        alt: "Example 课程概览，显示课次和课程入口",
      },
    },
    capture: {
      image: "lecture-summary.webp",
      en: {
        title: "Class ends.<br>The ideas stay.",
        body: "Record or import permitted class audio. Keep the transcript, key ideas, your own notes, and supporting materials together in the same lecture.",
        details: [
          "Lecture audio and timestamped transcripts",
          "Summaries with key concepts",
          "Your notes, alongside the class materials",
        ],
        caption: "From a full lecture to a clearer picture.",
        alt: "Example lecture summary showing its overview and key concepts",
      },
      zh: {
        title: "下课了，<br>思路还在。",
        body: "录制或导入获得许可的课堂音频。把转录、重点、自己的笔记和相关资料，一起留在这节课里。",
        details: [
          "课堂音频与带时间戳的转录",
          "课堂摘要与关键概念",
          "和课堂资料放在一起的个人笔记",
        ],
        caption: "从整节课堂，看见清晰的重点。",
        alt: "Example 课堂摘要，显示概览和关键概念",
      },
    },
    ask: {
      image: "ai-home.webp",
      en: {
        title: "A good question.<br>A place to follow it.",
        body: "Choose a course or lecture, bring a question, and work through it with AI. Check the referenced material and keep exploring from there.",
        details: [
          "Questions grounded in your selected context",
          "References you can follow back to the source",
          "Conversations you can return to later",
        ],
        caption: "Stay curious. Keep your course close.",
        alt: "CourseHelper AI start screen with course selection and quick actions",
      },
      zh: {
        title: "一个好问题，<br>值得接着想。",
        body: "选好课程或课次，带着疑问与 AI 一起梳理。查看回答引用的资料，从那里继续探索。",
        details: [
          "围绕所选课程与课次提问",
          "可回看原文的来源引用",
          "以后还可以接着聊的学习对话",
        ],
        caption: "保留好奇，也保留课堂的上下文。",
        alt: "CourseHelper AI 首页，显示选择课程与快捷操作",
      },
    },
    review: {
      image: "flashcard-answer.webp",
      en: {
        title: "Past the reread.<br>Into what you know.",
        body: "Build review from your course content. Try a flashcard, test yourself with a quiz, or reconnect the ideas with a study guide.",
        details: [
          "Flashcards, quizzes, and key terms",
          "Study guides and mixed review",
          "Choose the scope and language of your review",
        ],
        caption: "Small questions. Stronger connections.",
        alt: "Example flashcard revealing an explanation of activation energy",
      },
      zh: {
        title: "不只再读一遍。<br>试着真的记住。",
        body: "从课堂内容创建复习。翻一张闪卡，做一组测验，或者用学习指南把零散的概念重新串起来。",
        details: [
          "闪卡、测验与关键术语",
          "学习指南和混合复习",
          "选择复习范围与语言",
        ],
        caption: "小小的问题，把知识连接起来。",
        alt: "Example 闪卡答案，解释酶与活化能",
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
  let activeFeature = "organize";
  let cardIndex = 0;
  let answerShown = false;
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
  function renderFeature(key, moveFocus = false) {
    if (!isMarketing || !featureData[key]) return;
    activeFeature = key;
    const keys = Object.keys(featureData);
    const feature = featureData[key];
    const copy = feature[language];
    document.querySelectorAll("[data-feature]").forEach((button) => {
      const selected = button.dataset.feature === key;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) button.focus();
    });
    const panel = document.getElementById("feature-panel");
    panel.dataset.current = key;
    panel.setAttribute("aria-labelledby", `tab-${key}`);
    document.querySelector(".feature-index").textContent =
      `0${keys.indexOf(key) + 1} / 04`;
    document.getElementById("feature-title").innerHTML = copy.title;
    document.getElementById("feature-description").textContent = copy.body;
    document.getElementById("feature-details").replaceChildren(
      ...copy.details.map((detail) => {
        const item = document.createElement("li");
        item.textContent = detail;
        return item;
      }),
    );
    const image = document.getElementById("feature-image");
    image.src = `assets/screens/v2/${feature.image}`;
    image.alt = copy.alt;
    document.getElementById("feature-caption").textContent = copy.caption;
  }
  function renderCard() {
    if (!isMarketing) return;
    document
      .getElementById("flashcard")
      .setAttribute("aria-pressed", String(answerShown));
    document.getElementById("card-content").textContent =
      cards[language][cardIndex][answerShown ? 1 : 0];
    document.getElementById("card-counter").textContent =
      `0${cardIndex + 1} / 03`;
    document.getElementById("card-side").textContent =
      language === "zh"
        ? answerShown
          ? "答案"
          : "问题"
        : answerShown
          ? "ANSWER"
          : "QUESTION";
    document.querySelector(".flashcard-subject").textContent =
      language === "zh" ? "生物学 · 酶" : "BIOLOGY · ENZYMES";
    document.querySelector('[data-i18n="flipHint"]').textContent =
      language === "zh"
        ? answerShown
          ? "点一下，回到问题"
          : "点一下，查看答案"
        : answerShown
          ? "Tap to return to the question"
          : "Tap to reveal the answer";
    document.getElementById("card-announcement").textContent =
      `${language === "zh" ? `第 ${cardIndex + 1} 张，共 3 张` : `Card ${cardIndex + 1} of 3`}. ${document.getElementById("card-side").textContent}. ${document.getElementById("card-content").textContent}`;
  }
  function applyLanguage(lang, updateUrl = false) {
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
      renderFeature(activeFeature);
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
  document.querySelectorAll("[data-feature]").forEach((button) => {
    button.addEventListener("click", () =>
      renderFeature(button.dataset.feature),
    );
    button.addEventListener("keydown", (event) => {
      const keys = Object.keys(featureData);
      let index = keys.indexOf(activeFeature);
      if (event.key === "ArrowRight") index = (index + 1) % keys.length;
      else if (event.key === "ArrowLeft")
        index = (index - 1 + keys.length) % keys.length;
      else if (event.key === "Home") index = 0;
      else if (event.key === "End") index = keys.length - 1;
      else return;
      event.preventDefault();
      renderFeature(keys[index], true);
    });
  });
  document
    .querySelectorAll("[data-select-feature]")
    .forEach((link) =>
      link.addEventListener("click", () =>
        renderFeature(link.dataset.selectFeature),
      ),
    );
  document.getElementById("flashcard")?.addEventListener("click", () => {
    answerShown = !answerShown;
    renderCard();
  });
  document.getElementById("next-card")?.addEventListener("click", () => {
    cardIndex = (cardIndex + 1) % cards.en.length;
    answerShown = false;
    renderCard();
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
