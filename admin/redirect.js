(() => {
  const supported = value => value === 'zh' || value === 'en';
  let language = new URLSearchParams(location.search).get('lang');
  if (!supported(language)) {
    try { language = localStorage.getItem('coursehelperSiteLang'); } catch { /* Storage is optional. */ }
  }
  if (!supported(language)) language = navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en';

  // The destination is fixed. Forward only the language, never arbitrary URLs, query strings or fragments.
  const destination = new URL('https://admin.coursehelper.app/');
  destination.searchParams.set('lang', language);
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.getElementById('redirect-status').textContent = language === 'zh' ? '正在打开管理后台…' : 'Opening the admin workspace…';
  const link = document.getElementById('admin-link');
  link.href = destination.href;
  link.textContent = language === 'zh' ? '继续前往管理后台' : 'Continue to admin';
  location.replace(destination.href);
})();
