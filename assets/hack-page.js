(function () {
  const FAVORITES_KEY = 'mac_hacks_favorites';
  const THEME_KEY = 'mac_hacks_theme';

  function readFavorites() {
    try {
      return new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'));
    } catch {
      return new Set();
    }
  }

  function writeFavorites(favs) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
  }

  function applyStoredTheme() {
    const pref = localStorage.getItem(THEME_KEY);
    if (pref === 'light') document.documentElement.classList.remove('dark');
    if (pref === 'dark') document.documentElement.classList.add('dark');
  }

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      THEME_KEY,
      document.documentElement.classList.contains('dark') ? 'dark' : 'light',
    );
  }

  async function copyToClipboard(text) {
    const value = String(text ?? '');
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      window.prompt('Copy to clipboard:', value);
    }
  }

  function renderFavoriteButton(button, isFav) {
    if (!button) return;
    button.dataset.fav = String(isFav);

    const icon = button.querySelector('[data-fav-icon]');
    const label = button.querySelector('[data-fav-label]');
    if (icon) icon.textContent = isFav ? '❤️' : '🤍';
    if (label) label.textContent = isFav ? 'Saved' : 'Save';

    button.classList.toggle('bg-red-500/10', isFav);
    button.classList.toggle('text-red-600', isFav);
    button.classList.toggle('dark:text-red-400', isFav);
    button.classList.toggle('border-red-500/20', isFav);
  }

  document.addEventListener('DOMContentLoaded', () => {
    applyStoredTheme();

    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    const hackId = Number(document.body.dataset.hackId);
    const favBtn = document.getElementById('fav-toggle');
    const favs = readFavorites();

    const updateFavUi = () => renderFavoriteButton(favBtn, favs.has(hackId));
    updateFavUi();

    if (favBtn && Number.isFinite(hackId)) {
      favBtn.addEventListener('click', () => {
        if (favs.has(hackId)) favs.delete(hackId);
        else favs.add(hackId);
        writeFavorites(favs);
        updateFavUi();
      });
    }

    const copyLinkBtn = document.getElementById('copy-link');
    if (copyLinkBtn) copyLinkBtn.addEventListener('click', () => copyToClipboard(location.href));

    const cmd = document.body.dataset.hackCommand;
    const copyCmdBtn = document.getElementById('copy-command');
    if (copyCmdBtn && cmd) copyCmdBtn.addEventListener('click', () => copyToClipboard(cmd));
  });
})();
