(() => {
  "use strict";
  const form = document.getElementById("waitlist-form");
  if (!form) return;
  const {email, consent, website} = form.elements;
  const status = document.getElementById("waitlist-status");
  const button = form.querySelector('button[type="submit"]');
  const endpoint = "https://xphzeeqbmhlsyrgqkcho.supabase.co/functions/v1/coursehelper_waitlist";
  const messages = {
    en: { email: "Enter a valid email address.", consent: "Tick the box to agree to a launch email.", pending: "Joining…", success: "You’re on the list. We’ll email you when CourseHelper launches.", failure: "We couldn’t confirm your signup. Please try again.", limit: "Too many attempts. Please try again later." },
    zh: { email: "请输入有效的邮箱地址。", consent: "请先勾选同意接收上线通知。", pending: "正在提交…", success: "已加入候补名单。CourseHelper 上线时，我们会给你发邮件。", failure: "暂时无法确认报名，请重试。", limit: "提交过于频繁，请稍后重试。" }
  };
  const language = () => document.documentElement.lang === "zh-Hans" ? "zh" : "en";
  let state = "";
  function show(next) {
    state = next;
    status.textContent = messages[language()][state] || "";
    status.dataset.state = state;
    status.toggleAttribute("data-error", ["email", "consent", "failure", "limit"].includes(state));
    email.setAttribute("aria-invalid", String(state === "email"));
    consent.setAttribute("aria-invalid", String(state === "consent"));
  }
  form.hidden = false;
  form.addEventListener("input", () => { if (state !== "pending") show(""); });
  document.addEventListener("coursehelper:language", () => show(state));
  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (state === "pending" || state === "success") return;
    email.value = email.value.trim();
    if (!email.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { show("email"); email.focus(); return; }
    if (!consent.checked) { show("consent"); consent.focus(); return; }
    const source = new URLSearchParams(location.search).get("utm_source")?.toLowerCase();
    const signup = {email: email.value, language: language(), source: source && /^[a-z0-9_-]{1,40}$/.test(source) ? source : "website", consent: consent.checked, website: website.value};
    button.disabled = email.disabled = consent.disabled = true;
    show("pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoint, {method: "POST", headers: {"Content-Type": "application/json"}, signal: controller.signal, body: JSON.stringify(signup)});
      if (!response.ok) { show(response.status === 429 ? "limit" : "failure"); return; }
      const result = await response.json();
      if (result.ok !== true) { show("failure"); return; }
      form.reset();
      form.hidden = true;
      show("success");
      status.focus({preventScroll: true});
    } catch { show("failure"); }
    finally { clearTimeout(timeout); button.disabled = email.disabled = consent.disabled = false; }
  });
})();
