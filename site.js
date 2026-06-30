const COURSEHELPER_LANG_KEY = "coursehelperSiteLang";

function getRequestedLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");
  if (requested === "zh" || requested === "en") return requested;
  const stored = window.localStorage.getItem(COURSEHELPER_LANG_KEY);
  if (stored === "zh" || stored === "en") return stored;
  return navigator.language && navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function withLangParam(href, lang) {
  if (!href || href.startsWith("mailto:") || href.startsWith("http")) return href;
  const url = new URL(href, window.location.href);
  url.searchParams.set("lang", lang);
  return `${url.pathname.split("/").pop()}${url.search}`;
}

function applyCopy(lang) {
  const copy = window.COURSEHELPER_COPY?.[lang] ?? {};
  Object.entries(copy).forEach(([key, value]) => {
    document.querySelectorAll(`[data-i18n="${key}"]`).forEach((node) => {
      node.textContent = value;
    });
  });
}

function applyLanguage(lang) {
  window.localStorage.setItem(COURSEHELPER_LANG_KEY, lang);
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  applyCopy(lang);
  document.querySelectorAll("[data-lang]").forEach((node) => {
    node.classList.toggle("active", node.getAttribute("data-lang") === lang);
  });
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-lang-button") === lang);
  });
  document.querySelectorAll("a[data-preserve-lang]").forEach((link) => {
    link.setAttribute("href", withLangParam(link.getAttribute("data-base-href") ?? link.getAttribute("href"), lang));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a[data-preserve-lang]").forEach((link) => {
    link.setAttribute("data-base-href", link.getAttribute("href"));
  });
  document.querySelectorAll("[data-lang-button]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.getAttribute("data-lang-button")));
  });
  applyLanguage(getRequestedLanguage());
});
