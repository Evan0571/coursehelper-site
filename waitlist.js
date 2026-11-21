(() => {
  "use strict";
  const form = document.getElementById("waitlist-form");
  if (!form) return;
  const email = document.getElementById("waitlist-email");
  const consent = document.getElementById("waitlist-consent");
  const status = document.getElementById("waitlist-status");
  const button = form.querySelector('button[type="submit"]');
  const endpoint = "https://xphzeeqbmhlsyrgqkcho.supabase.co/functions/v1/coursehelper_waitlist";
  const messages = {
    en: { required: "Enter a valid email address.", consent: "Agree to the launch notification before joining.", pending: "Joining…", success: "You're on the list. We'll email you when CourseHelper launches.", failure: "Unable to join right now. Please try again.", limit: "Too many attempts. Please try again later." },
    zh: { required: "请输入有效的邮箱地址。", consent: "请先同意接收上线通知。", pending: "正在提交…", success: "已加入名单。CourseHelper 上线时我们会通过邮件通知你。", failure: "暂时无法提交，请稍后重试。", limit: "提交过于频繁，请稍后重试。" }
  };
  let currentMessage;
  function renderStatus() {
    if (!currentMessage) return;
    const language = document.documentElement.lang === "zh-Hans" ? "zh" : "en";
    status.textContent = messages[language][currentMessage];
  }
  document.addEventListener("coursehelper:language", renderStatus);
  function show(key, error = false) {
    currentMessage = key;
    renderStatus();
    if (error) status.dataset.error = "";
    else delete status.dataset.error;
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (button.disabled) return;
    if (!email.validity.valid) { show("required", true); email.focus(); return; }
    if (!consent.checked) { show("consent", true); consent.focus(); return; }
    button.disabled = true;
    show("pending");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const language = document.documentElement.lang === "zh-Hans" ? "zh" : "en";
      const source = new URLSearchParams(location.search).get("utm_source")?.toLowerCase();
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          email: email.value, language,
          source: source && /^[a-z0-9_-]{1,40}$/.test(source) ? source : "website",
          consent: true, website: form.elements.website.value
        })
      });
      if (!response.ok) { show(response.status === 429 ? "limit" : "failure", true); return; }
      show("success");
      form.reset();
    } catch { show("failure", true); }
    finally { clearTimeout(timeout); button.disabled = false; }
  });
})();
