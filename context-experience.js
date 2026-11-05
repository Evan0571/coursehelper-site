(() => {
  "use strict";
  if (!document.documentElement.classList.contains("spatial-preview")) return;
  const legacy = document.querySelector(".context-visual");
  if (!legacy) return;
  const icon = (paths) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  const transcriptIcon = icon(
    '<path d="M4 10v4m4-7v10m4-13v16m4-13v10m4-7v4"/>',
  );
  const notesIcon = icon(
    '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  );
  const slidesIcon = icon(
    '<path d="M5 3h9l5 5v13H5zM14 3v6h5M9 13h6M9 17h4"/>',
  );
  const arrow = icon('<path d="M7 17 17 7M7 7h10v10"/>');
  const board = document.createElement("div");
  board.className = "context-workspace";
  board.innerHTML = `
    <div class="context-scene">
      <div class="context-folder" aria-hidden="true"><span>BIO 140</span></div>
      <article class="context-paper" id="context-source" role="tabpanel" tabindex="0" aria-labelledby="context-tab-transcript">
        <div class="context-paper-top"><span class="context-course-code">BIO 140</span><span class="context-document-kind"></span></div>
        <h3 data-context-copy="lecture">Enzymes & cellular energy</h3>
        <div class="context-excerpt"></div>
        <div class="context-paper-footer"><span data-context-copy="course">Cell biology</span><span class="context-page-number" aria-hidden="true">01</span></div>
      </article>
      <div class="context-answer">
        <div class="context-answer-heading"><img src="/assets/coursehelper-icon-87df7b088471.png" width="26" height="26" alt=""/><span data-context-copy="question">How do enzymes lower activation energy?</span></div>
        <p data-context-copy="answer">They offer another reaction pathway with a lower energy barrier. The overall energy change stays the same.</p>
        <div class="context-source-heading" data-context-copy="sources">Sources</div>
        <div class="context-source-tabs" role="tablist" aria-label="Sources">
          <button type="button" role="tab" id="context-tab-transcript" aria-controls="context-source" aria-selected="true" data-source="transcript">${transcriptIcon}<span data-context-copy="transcript">Transcript</span><span class="source-ref">1</span></button>
          <button type="button" role="tab" id="context-tab-notes" aria-controls="context-source" aria-selected="false" tabindex="-1" data-source="notes">${notesIcon}<span data-context-copy="notes">Notes</span><span class="source-ref">2</span></button>
          <button type="button" role="tab" id="context-tab-slides" aria-controls="context-source" aria-selected="false" tabindex="-1" data-source="slides">${slidesIcon}<span data-context-copy="slides">Slides</span><span class="source-ref">3</span></button>
        </div>
      </div>
    </div>
    <div class="context-workspace-footer"><span data-context-copy="sample">Interactive sample</span><a href="#feature-ask" data-context-demo><span data-context-copy="demo">See it in the app</span>${arrow}</a></div>
  `;
  legacy.replaceWith(board);
  document.querySelector(".ai-section").id = "context";
  document.getElementById("practice")?.remove();
  document.querySelectorAll('a[href="#practice"]').forEach((link) => {
    if (link.closest(".nav-links")) {
      link.href = "#context";
      link.removeAttribute("data-i18n");
      link.dataset.contextCopy = "nav";
    } else link.href = "#feature-review";
  });
  if (location.hash === "#practice") {
    const url = new URL(location.href);
    url.hash = "feature-review";
    history.replaceState(null, "", url);
  }
  const copy = {
    en: {
      nav: "In context",
      lecture: "Enzymes & cellular energy",
      course: "Cell biology",
      question: "How do enzymes lower activation energy?",
      answer:
        "They offer another reaction pathway with a lower energy barrier. The overall energy change stays the same.",
      sources: "Sources",
      transcript: "Transcript",
      notes: "Notes",
      slides: "Slides",
      sample: "Interactive sample",
      demo: "See it in the app",
      documents: {
        transcript: {
          kind: "LECTURE TRANSCRIPT",
          title: "A different pathway",
          html: "<p>To start a reaction, molecules need enough energy to reach the transition state.</p><p><mark>Enzymes lower this activation energy by providing an alternative reaction pathway.</mark></p><p>The energy difference between the reactants and products stays the same.</p>",
        },
        notes: {
          kind: "CLASS NOTES",
          title: "The key distinction",
          html: '<p class="context-note-term">Activation energy</p><p>The energy needed to start a reaction.</p><p><mark>Enzymes lower the barrier. They do not change the reaction’s overall energy change.</mark></p><p class="context-note-margin">A different route. The same start and finish.</p>',
        },
        slides: {
          kind: "COURSE MATERIALS",
          title: "Enzyme catalysis",
          html: '<div class="context-file-label">PDF <span>BIO 140 · Lecture slides</span></div><p>Enzymes act as catalysts, helping reactions proceed along a different pathway.</p><p><mark>A lower activation energy makes the reaction easier to begin.</mark></p><p>Reactants and products keep the same relative energy levels.</p>',
        },
      },
    },
    zh: {
      nav: "课堂上下文",
      lecture: "酶与细胞能量",
      course: "细胞生物学",
      question: "酶如何降低活化能？",
      answer: "酶提供了能量门槛更低的反应路径，而反应前后的总能量差保持不变。",
      sources: "来源",
      transcript: "课堂转录",
      notes: "课堂笔记",
      slides: "课程资料",
      sample: "交互示例 · 示例内容",
      demo: "查看 App 操作",
      documents: {
        transcript: {
          kind: "课堂转录",
          title: "另一条反应路径",
          html: "<p>反应开始前，分子需要获得足够的能量，才能达到过渡态。</p><p><mark>酶通过提供另一条反应路径，降低反应所需的活化能。</mark></p><p>反应物与生成物之间的能量差保持不变。</p>",
        },
        notes: {
          kind: "课堂笔记",
          title: "记住这个区别",
          html: '<p class="context-note-term">活化能</p><p>开始一次反应所需的能量。</p><p><mark>酶降低反应的能量门槛，并不改变反应前后的总能量差。</mark></p><p class="context-note-margin">路径不同，起点与终点不变。</p>',
        },
        slides: {
          kind: "课程资料",
          title: "酶的催化作用",
          html: '<div class="context-file-label">PDF <span>BIO 140 · 课程幻灯片</span></div><p>酶是一种催化剂，帮助反应沿着另一条路径进行。</p><p><mark>更低的活化能，让反应更容易开始。</mark></p><p>反应物与生成物的相对能量关系保持不变。</p>',
        },
      },
    },
  };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const panel = board.querySelector(".context-paper");
  const excerpt = board.querySelector(".context-excerpt");
  const tabs = [...board.querySelectorAll("[data-source]")];
  let source = "transcript",
    language,
    transition;
  function render() {
    const current = copy[language],
      doc = current.documents[source];
    board.querySelector(".context-document-kind").textContent = doc.kind;
    excerpt.innerHTML = Object.entries(current.documents)
      .map(
        ([key, document]) =>
          `<div class="context-document${key === source ? " is-active" : ""}" aria-hidden="${key !== source}"><h4>${document.title}</h4>${document.html}</div>`,
      )
      .join("");
    board.querySelector(".context-page-number").textContent =
      "0" + (tabs.findIndex((tab) => tab.dataset.source === source) + 1);
    panel.setAttribute("aria-labelledby", "context-tab-" + source);
    board.dataset.source = source;
  }
  function translate() {
    language = document.documentElement.lang === "zh-Hans" ? "zh" : "en";
    document
      .querySelectorAll("[data-context-copy]")
      .forEach(
        (el) => (el.textContent = copy[language][el.dataset.contextCopy]),
      );
    board
      .querySelector('[role="tablist"]')
      .setAttribute("aria-label", copy[language].sources);
    render();
  }
  function select(key) {
    if (key === source) return;
    source = key;
    transition?.kill();
    tabs.forEach((tab) => {
      const active = tab.dataset.source === key;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    render();
    if (window.gsap && !reduce.matches && !navigator.connection?.saveData) {
      transition = gsap.fromTo(
        excerpt,
        { y: 9, opacity: 0.25 },
        {
          y: 0,
          opacity: 1,
          duration: 0.38,
          ease: "power2.out",
          clearProps: "transform,opacity",
          overwrite: true,
        },
      );
      gsap.fromTo(
        excerpt.querySelector(".is-active mark"),
        { backgroundSize: "0% 100%" },
        {
          backgroundSize: "100% 100%",
          duration: 0.65,
          ease: "power2.out",
          overwrite: true,
        },
      );
    }
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(tab.dataset.source));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft")
        next = (index + tabs.length - 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      select(tabs[next].dataset.source);
    });
  });
  board
    .querySelector("[data-context-demo]")
    .addEventListener("click", (event) => {
      event.preventDefault();
      history.pushState(null, "", "#feature-ask");
      const navigation = new CustomEvent("coursehelper:select-feature", {
        detail: { key: "ask" },
        cancelable: true,
      });
      if (document.dispatchEvent(navigation))
        document.getElementById("feature-ask").scrollIntoView();
    });
  document.addEventListener("coursehelper:language", translate);
  reduce.addEventListener("change", () => {
    if (reduce.matches && window.gsap) {
      transition?.kill();
      gsap.set(excerpt, { clearProps: "transform,opacity" });
    }
  });
  translate();
  if (window.gsap && window.ScrollTrigger) {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      if (navigator.connection?.saveData) return;
      gsap.from(".context-folder", {
        rotation: -4,
        y: 25,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: board, start: "top 85%", once: true },
      });
      gsap.from(panel, {
        y: 30,
        opacity: 0,
        duration: 0.9,
        delay: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: board, start: "top 85%", once: true },
      });
      gsap.from(".context-answer", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        delay: 0.22,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: board, start: "top 85%", once: true },
      });
    });
  }
})();
