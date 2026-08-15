// Place at the end of <body> (or run after DOMContentLoaded). No config needed.
(() => {
  const themeToggleEl = document.getElementById('themeToggle');
  const THEME_KEY = 'theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function isDarkActive() {
    const stored = getStoredTheme();
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  themeToggleEl.setAttribute('aria-pressed', String(isDarkActive()));

  themeToggleEl.addEventListener('click', () => {
    const nextTheme = isDarkActive() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    try {
      localStorage.setItem(THEME_KEY, nextTheme);
    } catch {
      // Storage unavailable (e.g. private browsing); theme just won't persist.
    }
    themeToggleEl.setAttribute('aria-pressed', String(isDarkActive()));
  });
})();
