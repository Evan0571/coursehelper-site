// Shared across the landing, support, legal, and recovery pages.
(() => {
  "use strict";
  document.documentElement.classList.add("has-js");
  const storageKey = "coursehelperSiteLang";
  const nodes = [...document.querySelectorAll("[data-i18n]")];
  const english = new Map(nodes.map(node => [node, node.innerHTML]));
  const labels = [...document.querySelectorAll("[data-label]")];
  const englishLabels = new Map(labels.map(node => [node, node.getAttribute("aria-label")]));
  const fields = [...document.querySelectorAll("[data-placeholder]")];
  const placeholders = new Map(fields.map(node => [node, node.placeholder]));
  const links = [...document.querySelectorAll("a[data-preserve-lang]")].map(node => [node, node.getAttribute("href")]);
  const buttons = document.querySelectorAll("[data-lang-button]");
  const supported = lang => lang === "en" || lang === "zh";
  function requestedLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (supported(query)) return query;
    try {
      const stored = localStorage.getItem(storageKey);
      if (supported(stored)) return stored;
    } catch { /* Storage is optional. */ }
    return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
  }
  function applyLanguage(lang, updateUrl = false) {
    const dictionary = window.COURSEHELPER_COPY?.[lang] || {};
    document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
    for (const node of nodes) node.innerHTML = dictionary[node.dataset.i18n] ?? english.get(node);
    for (const node of labels) node.setAttribute("aria-label", dictionary[node.dataset.label] ?? englishLabels.get(node));
    for (const node of fields) node.placeholder = dictionary[node.dataset.placeholder] ?? placeholders.get(node);
    for (const node of document.querySelectorAll("[data-lang]")) node.classList.toggle("active", node.dataset.lang === lang);
    for (const button of buttons) {
      const selected = button.dataset.langButton === lang;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    }
    for (const [node, path] of links) {
      if (!path || path.startsWith("#")) continue;
      const url = new URL(path, location.href);
      if (url.origin !== location.origin || !["http:", "https:", "file:"].includes(url.protocol)) continue;
      url.searchParams.set("lang", lang);
      node.href = url.href;
    }
    try { localStorage.setItem(storageKey, lang); } catch { /* Still works in private browsing. */ }
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set("lang", lang);
      try { history.replaceState(null, "", url); } catch { /* Local file previews may restrict history. */ }
    }
    document.dispatchEvent(new CustomEvent("coursehelper:language", {detail: {lang}}));
  }
  for (const button of buttons) button.addEventListener("click", () => applyLanguage(button.dataset.langButton, true));
  applyLanguage(requestedLanguage());
})();
