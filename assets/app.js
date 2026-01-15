/**
 * Mac Hacks Dictionary - Main Application Logic
 * Handles search, filters, favorites, theme toggle, and Firebase sync
 */

(function () {
  'use strict';

  // Constants
  const THEME_KEY = 'mac_hacks_theme';
  const LEVEL_KEY = 'mac_hacks_level';
  const FAVORITES_KEY = 'mac_hacks_favorites';

  // Application state
  const state = {
    level: localStorage.getItem(LEVEL_KEY) || null,
    favorites: new Set(JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]')),
    search: '',
    filterApp: 'All',
    filterType: 'All',
    filterTopic: 'All',
    filterMethod: 'All',
    filterRisk: 'All',
    mode: 'browse',
  };

  // DOM Elements (cached on init)
  let elements = {};

  // Theme management
  function applyStoredTheme() {
    const pref = localStorage.getItem(THEME_KEY);
    if (pref === 'light') document.documentElement.classList.remove('dark');
    if (pref === 'dark') document.documentElement.classList.add('dark');
  }

  function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem(
      THEME_KEY,
      document.documentElement.classList.contains('dark') ? 'dark' : 'light'
    );
  }

  // Settings menu
  function toggleSettings() {
    elements.settingsMenu?.classList.toggle('hidden');
  }

  // Modal management
  function reopenOnboarding() {
    toggleSettings();
    elements.modalCloseBtn?.classList.remove('hidden');
    elements.onboardingModal?.classList.remove('hidden');
    setTimeout(() => elements.onboardingModal?.classList.remove('opacity-0'), 10);
  }

  function closeModal() {
    if (!state.level) return;
    const modal = elements.onboardingModal;
    if (!modal) return;
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 500);
  }

  function setLevel(lvl) {
    state.level = lvl;
    localStorage.setItem(LEVEL_KEY, lvl);
    closeModal();
    renderHackOfTheDay();
    renderGrid();
  }

  // Favorites management
  function saveFavs() {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(state.favorites)));
  }

  function showFavorites() {
    toggleSettings();
    state.mode = 'favorites';
    state.search = '';
    if (elements.searchInput) elements.searchInput.value = '';
    elements.filterStatus?.classList.remove('hidden');
    if (elements.activeBadge) elements.activeBadge.innerText = 'Favorites';
    elements.hotdWrapper?.classList.add('hidden');
    renderGrid();
  }

  async function toggleFav(event, id) {
    if (event?.stopPropagation) event.stopPropagation();
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    saveFavs();
    renderGrid();

    // Firebase sync
    if (window.isFirebaseActive && window.auth?.currentUser) {
      try {
        await window.setDoc(
          window.doc(window.db, 'users', window.auth.currentUser.uid),
          { favorites: Array.from(state.favorites) },
          { merge: true }
        );
      } catch (e) {
        console.warn('Failed to sync favorites:', e);
      }
    }
  }

  // Filter management
  function updateFilter(key, val) {
    if (key === 'app') state.filterApp = val;
    if (key === 'type') state.filterType = val;
    if (key === 'topic') state.filterTopic = val;
    if (key === 'method') state.filterMethod = val;
    if (key === 'risk') state.filterRisk = val;
    renderGrid();
  }

  function clearSearch() {
    state.search = '';
    state.filterApp = 'All';
    state.filterType = 'All';
    state.filterTopic = 'All';
    state.filterMethod = 'All';
    state.filterRisk = 'All';
    state.mode = 'browse';

    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.filterApp) elements.filterApp.value = 'All';
    if (elements.filterType) elements.filterType.value = 'All';
    if (elements.filterTopic) elements.filterTopic.value = 'All';
    if (elements.filterMethod) elements.filterMethod.value = 'All';
    if (elements.filterRisk) elements.filterRisk.value = 'All';

    try {
      history.replaceState(null, '', window.location.pathname);
    } catch {}

    elements.filterStatus?.classList.add('hidden');
    renderHackOfTheDay();
    renderGrid();
  }

  // Query params handling
  function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);

    const q = params.get('q');
    if (q && q.trim().length > 0) {
      state.search = q.trim().toLowerCase();
      state.mode = 'search';
      if (elements.searchInput) elements.searchInput.value = q.trim();
      elements.landingSection?.classList.remove('min-h-[50vh]', 'pt-20');
      elements.landingSection?.classList.add('min-h-[20vh]', 'pt-10');
      elements.hotdWrapper?.classList.add('hidden');
    }

    const app = params.get('app');
    if (app) {
      state.filterApp = app;
      if (elements.filterApp) elements.filterApp.value = app;
    }

    const type = params.get('type');
    if (type) {
      state.filterType = type;
      if (elements.filterType) elements.filterType.value = type;
    }

    const topic = params.get('topic');
    if (topic) {
      state.filterTopic = topic;
      if (elements.filterTopic) elements.filterTopic.value = topic;
    }

    const method = params.get('method');
    if (method) {
      state.filterMethod = method;
      if (elements.filterMethod) elements.filterMethod.value = method;
    }

    const risk = params.get('risk');
    if (risk) {
      state.filterRisk = risk;
      if (elements.filterRisk) elements.filterRisk.value = risk;
    }
  }

  // Dropdown population
  function populateDropdowns() {
    if (typeof HACKS === 'undefined' || !HACKS) return;

    const apps = [...new Set(HACKS.flatMap((h) => h.app))].sort();
    const types = [...new Set(HACKS.map((h) => h.type))].sort();
    const topics = [...new Set(HACKS.flatMap((h) => h.topics || []))].sort();
    const methods = [...new Set(HACKS.map((h) => h.method).filter(Boolean))].sort();
    const risks = ['Low', 'Medium', 'High'];

    if (elements.filterApp) {
      apps.forEach((app) => {
        const opt = document.createElement('option');
        opt.value = app;
        opt.innerText = app;
        elements.filterApp.appendChild(opt);
      });
    }

    if (elements.filterType) {
      types.forEach((type) => {
        const opt = document.createElement('option');
        opt.value = type;
        opt.innerText = type;
        elements.filterType.appendChild(opt);
      });
    }

    if (elements.filterTopic) {
      topics.forEach((topic) => {
        const opt = document.createElement('option');
        opt.value = topic;
        opt.innerText = topic;
        elements.filterTopic.appendChild(opt);
      });
    }

    if (elements.filterMethod) {
      methods.forEach((method) => {
        const opt = document.createElement('option');
        opt.value = method;
        opt.innerText = method;
        elements.filterMethod.appendChild(opt);
      });
    }

    if (elements.filterRisk) {
      risks.forEach((risk) => {
        const opt = document.createElement('option');
        opt.value = risk;
        opt.innerText = risk;
        elements.filterRisk.appendChild(opt);
      });
    }
  }

  // Hack of the Day
  function renderHackOfTheDay() {
    if (!state.level || state.mode !== 'browse') {
      elements.hotdWrapper?.classList.add('hidden');
      return;
    }

    if (typeof HACKS === 'undefined' || !HACKS) return;

    const today = new Date().toDateString();
    const seed = today + state.level;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash |= 0;
    }

    const eligible = HACKS.filter((h) => h.level === state.level);
    if (eligible.length === 0) return;

    const index = Math.abs(hash) % eligible.length;
    const hack = eligible[index];

    const hotdApp = document.getElementById('hotd-app');
    const hotdTitle = document.getElementById('hotd-title');
    const hotdDesc = document.getElementById('hotd-desc');
    const hotdLevel = document.getElementById('hotd-level');
    const hotdOpen = document.getElementById('hotd-open');

    if (hotdApp) hotdApp.innerText = hack.app.join(', ');
    if (hotdTitle) hotdTitle.innerText = hack.title;
    if (hotdDesc) hotdDesc.innerText = hack.desc;
    if (hotdLevel) hotdLevel.innerText = hack.level;
    if (hotdOpen) hotdOpen.onclick = () => goToHack(hack.id);

    elements.hotdWrapper?.classList.remove('hidden');
  }

  // Search matching
  function matchesSearch(hack, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    const inTitle = hack.title?.toLowerCase().includes(q);
    const inDesc = hack.desc?.toLowerCase().includes(q);
    const inKeys = hack.keywords?.some((k) => k.toLowerCase().includes(q));
    const inApp = hack.app?.some((a) => a.toLowerCase().includes(q));
    const inType = hack.type?.toLowerCase().includes(q);
    const inTopics = hack.topics?.some((t) => t.toLowerCase().includes(q));
    const inMethod = hack.method?.toLowerCase().includes(q);
    return Boolean(inTitle || inDesc || inKeys || inApp || inType || inTopics || inMethod);
  }

  // Grid rendering
  function renderGrid() {
    const grid = elements.hacksGrid;
    if (!grid) return;

    if (typeof HACKS === 'undefined' || !HACKS) {
      grid.innerHTML = '<div class="text-red-500">Error: Hacks data not loaded.</div>';
      return;
    }

    const query = state.search.trim().toLowerCase();
    const filtered = HACKS.filter((hack) => {
      if (state.mode === 'browse') {
        if (!state.level) return false;
        if (hack.level !== state.level) return false;
      }
      if (state.mode === 'favorites' && !state.favorites.has(hack.id)) return false;
      if (!matchesSearch(hack, query)) return false;
      if (state.filterApp !== 'All' && !hack.app.includes(state.filterApp)) return false;
      if (state.filterType !== 'All' && hack.type !== state.filterType) return false;
      if (state.filterTopic !== 'All' && !(hack.topics || []).includes(state.filterTopic)) return false;
      if (state.filterMethod !== 'All' && hack.method !== state.filterMethod) return false;
      if (state.filterRisk !== 'All' && hack.risk !== state.filterRisk) return false;
      return true;
    });

    // Update filter status
    const hasAnyFilter =
      state.filterApp !== 'All' ||
      state.filterType !== 'All' ||
      state.filterTopic !== 'All' ||
      state.filterMethod !== 'All' ||
      state.filterRisk !== 'All';

    if (state.mode === 'favorites') {
      elements.filterStatus?.classList.remove('hidden');
      if (elements.activeBadge) elements.activeBadge.innerText = 'Favorites';
    } else if (query.length > 0) {
      elements.filterStatus?.classList.remove('hidden');
      if (elements.activeBadge) elements.activeBadge.innerText = `Search: "${query}"`;
    } else if (hasAnyFilter) {
      const parts = [];
      if (state.filterApp !== 'All') parts.push(`App: ${state.filterApp}`);
      if (state.filterType !== 'All') parts.push(`Type: ${state.filterType}`);
      if (state.filterTopic !== 'All') parts.push(`Topic: ${state.filterTopic}`);
      if (state.filterMethod !== 'All') parts.push(`Method: ${state.filterMethod}`);
      if (state.filterRisk !== 'All') parts.push(`Risk: ${state.filterRisk}`);
      elements.filterStatus?.classList.remove('hidden');
      if (elements.activeBadge) elements.activeBadge.innerText = parts.join(' • ') || 'Filtered';
    } else {
      elements.filterStatus?.classList.add('hidden');
    }

    // Render cards
    grid.innerHTML = filtered
      .map((hack) => {
        const isFav = state.favorites.has(hack.id);
        const riskClass =
          hack.risk === 'High'
            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
            : hack.risk === 'Medium'
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
            : 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';

        return `
          <div onclick="window.goToHack(${hack.id})" onkeydown="window.hackCardKeydown(event, ${hack.id})" role="button" tabindex="0" class="cursor-pointer bg-white dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-white/5 rounded-[1.5rem] p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:-translate-y-1 hover:shadow-xl group focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-950">
            <div class="flex justify-between items-start mb-4">
              <div class="flex flex-wrap gap-2">
                ${hack.app.map((a) => `<span class="px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">${a}</span>`).join('')}
                ${hack.tahoe ? `<span class="px-2 py-1 bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold border border-blue-500/20 dark:border-blue-500/30">Tahoe</span>` : ''}
              </div>
              <button onclick="window.toggleFav(event, ${hack.id})" class="text-slate-400 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition-colors ${isFav ? 'text-red-500 dark:text-red-500' : ''}">
                <svg class="w-6 h-6" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              </button>
            </div>
            
            <h3 class="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${hack.title}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">${hack.desc}</p>
            
            <div class="flex justify-between items-center mt-auto pt-4 border-t border-slate-100 dark:border-white/5">
              <div class="flex gap-2">
                <span class="text-xs text-slate-400 dark:text-slate-500 font-mono">${hack.type}</span>
                <span class="px-2 py-0.5 rounded text-xs font-medium border ${riskClass}">${hack.risk}</span>
              </div>
              <span class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-600 border border-slate-200 dark:border-slate-800">${hack.level}</span>
            </div>
          </div>
        `;
      })
      .join('');

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-20">
          <div class="text-6xl mb-4">🔦</div>
          <h3 class="text-xl font-bold text-slate-700 dark:text-slate-300">No hacks found</h3>
          <p class="text-slate-500 mt-2">Try adjusting your search terms or filters.</p>
        </div>
      `;
    }
  }

  // Navigation
  function hackCardKeydown(event, id) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToHack(id);
    }
  }

  function goToHack(id) {
    if (typeof HACKS === 'undefined' || !HACKS) return;
    const hack = HACKS.find((h) => h.id === id);
    if (!hack) return;
    elements.settingsMenu?.classList.add('hidden');
    window.location.href = `hacks/${encodeURIComponent(hack.slug)}.html`;
  }

  // Safe filter toggle
  function toggleSafeOnly() {
    if (state.filterRisk === 'Low') {
      state.filterRisk = 'All';
      if (elements.filterRisk) elements.filterRisk.value = 'All';
    } else {
      state.filterRisk = 'Low';
      if (elements.filterRisk) elements.filterRisk.value = 'Low';
    }
    renderGrid();
  }

  // Initialize
  async function init() {
    applyStoredTheme();

    // Cache DOM elements
    elements = {
      settingsMenu: document.getElementById('settings-menu'),
      onboardingModal: document.getElementById('onboarding-modal'),
      modalCloseBtn: document.getElementById('modal-close-btn'),
      landingSection: document.getElementById('landing-section'),
      hotdWrapper: document.getElementById('hotd-wrapper'),
      filterStatus: document.getElementById('filter-status'),
      activeBadge: document.getElementById('active-filter-badge'),
      hacksGrid: document.getElementById('hacks-grid'),
      searchInput: document.getElementById('search-input'),
      filterApp: document.getElementById('filter-app'),
      filterType: document.getElementById('filter-type'),
      filterTopic: document.getElementById('filter-topic'),
      filterMethod: document.getElementById('filter-method'),
      filterRisk: document.getElementById('filter-risk'),
    };

    // Show onboarding if no level set
    if (!state.level) {
      elements.modalCloseBtn?.classList.add('hidden');
      elements.onboardingModal?.classList.remove('hidden');
      setTimeout(() => elements.onboardingModal?.classList.remove('opacity-0'), 100);
    } else {
      renderHackOfTheDay();
    }

    // Firebase sync
    if (window.isFirebaseActive && window.onAuthStateChanged && window.auth) {
      window.onAuthStateChanged(window.auth, async (user) => {
        if (user) {
          try {
            const userDoc = await window.getDoc(window.doc(window.db, 'users', user.uid));
            if (userDoc.exists()) {
              const serverFavs = userDoc.data().favorites || [];
              serverFavs.forEach((id) => state.favorites.add(id));
              saveFavs();
              renderGrid();
            } else {
              await window.setDoc(window.doc(window.db, 'users', user.uid), {
                favorites: Array.from(state.favorites),
              });
            }
          } catch (e) {
            console.warn('Firebase sync failed:', e);
          }
        } else {
          try {
            window.signInAnonymously(window.auth);
          } catch (e) {
            console.warn('Anonymous sign-in failed:', e);
          }
        }
      });
    }

    populateDropdowns();
    applyQueryParams();

    // Search input handler
    elements.searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      state.search = query;
      if (query.length > 0) {
        state.mode = 'search';
        elements.landingSection?.classList.remove('min-h-[50vh]', 'pt-20');
        elements.landingSection?.classList.add('min-h-[20vh]', 'pt-10');
        elements.filterStatus?.classList.remove('hidden');
        elements.hotdWrapper?.classList.add('hidden');
        if (elements.activeBadge) elements.activeBadge.innerText = `Search: "${query}"`;
      } else {
        state.mode = 'browse';
        elements.landingSection?.classList.add('min-h-[50vh]', 'pt-20');
        elements.landingSection?.classList.remove('min-h-[20vh]', 'pt-10');
        elements.filterStatus?.classList.add('hidden');
        renderHackOfTheDay();
      }
      renderGrid();
    });

    renderGrid();
  }

  // Expose functions globally
  window.toggleSettings = toggleSettings;
  window.toggleTheme = toggleTheme;
  window.reopenOnboarding = reopenOnboarding;
  window.closeModal = closeModal;
  window.setLevel = setLevel;
  window.showFavorites = showFavorites;
  window.toggleFav = toggleFav;
  window.updateFilter = updateFilter;
  window.clearSearch = clearSearch;
  window.goToHack = goToHack;
  window.hackCardKeydown = hackCardKeydown;
  window.toggleSafeOnly = toggleSafeOnly;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', init);
})();
