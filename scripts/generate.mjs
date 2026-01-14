import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const DATA_PATH = path.join(repoRoot, 'data', 'hacks.json');
const ASSETS_DIR = path.join(repoRoot, 'assets');
const HACKS_DIR = path.join(repoRoot, 'hacks');

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return c;
    }
  });
}

function splitLeadSentence(text) {
  const value = String(text || '').trim();
  for (let i = 0; i < value.length; i++) {
    if (value[i] !== '.') continue;
    const prev = value[i - 1];
    const next = value[i + 1];
    if (prev === undefined) continue;
    if (/\s/.test(prev)) continue;
    if (next && next !== ' ') continue;

    const tail = value.slice(Math.max(0, i - 4), i + 1).toLowerCase();
    if (tail.endsWith('e.g.') || tail.endsWith('i.e.') || tail.endsWith('etc.')) continue;

    return {
      lead: value.slice(0, i).trim(),
      rest: value.slice(i + 1).trim(),
    };
  }
  return { lead: value, rest: '' };
}

function extractTerminalCommand(desc) {
  const text = String(desc || '');
  const typeMatch = text.match(/Type ['"]([^'"]+)['"]/i);
  if (typeMatch?.[1]) return typeMatch[1].trim();
  const quoteMatch = text.match(/['"]([^'"]+)['"]/);
  if (quoteMatch?.[1]) return quoteMatch[1].trim();
  return null;
}

function extractKeyCombo(text) {
  const value = String(text || '');
  const match = value.match(
    /(Cmd|Command|Ctrl|Control|Option|Opt|Shift|Fn|F\d+)\s*\+\s*[^.]+/i,
  );
  if (!match?.[0]) return null;
  return match[0].split(',')[0].trim();
}

function normalizeKeyToken(token) {
  const raw = String(token || '').trim();
  const lower = raw.toLowerCase();
  if (lower === 'cmd' || lower === 'command') return '⌘';
  if (lower === 'option' || lower === 'opt') return '⌥';
  if (lower === 'ctrl' || lower === 'control') return '⌃';
  if (lower === 'shift') return '⇧';
  if (lower === 'return' || lower === 'enter') return '↩︎';
  if (lower === 'delete') return '⌫';
  return raw;
}

function renderKeycaps(combo) {
  const parts = String(combo || '')
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length === 0) return '';
  return (
    `<div class="flex flex-wrap items-center gap-2">` +
    parts
      .map((part, idx) => {
        const key = normalizeKeyToken(part);
        const plus =
          idx < parts.length - 1
            ? `<span class="text-slate-400 dark:text-slate-500 font-mono">+</span>`
            : '';
        return `<kbd class="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-200 shadow-sm">${escapeHtml(
          key,
        )}</kbd>${plus}`;
      })
      .join('') +
    `</div>`
  );
}

function inferMethod(hack) {
  if (hack.type === 'Terminal Hacks' || hack.app?.includes('Terminal')) return 'Terminal';
  if (hack.type === 'Settings Hacks' || /system settings/i.test(hack.desc || '')) return 'Settings';
  if (hack.type === 'Keyboard Commands') return 'Shortcut';
  return 'UI';
}

function inferRisk(hack) {
  const text = [hack.title, hack.desc, hack.type, ...(hack.keywords || []), ...(hack.app || [])]
    .join(' ')
    .toLowerCase();
  if (text.includes('warning') || text.includes('risky') || text.includes('impossible to recover'))
    return 'High';

  if (hack.type === 'Terminal Hacks' || hack.app?.includes('Terminal')) {
    if (/(^|\s)sudo\s|\bspctl\b|\bnvram\b|\bsrm\b|\/library\//.test(text)) return 'High';
    if (text.includes('defaults write')) return 'Medium';
    return 'Medium';
  }

  if (text.includes('force restart') || text.includes('hard reboot')) return 'High';
  return 'Low';
}

function inferTopics(hack) {
  const text = [hack.title, hack.desc, hack.type, ...(hack.keywords || []), ...(hack.app || [])]
    .join(' ')
    .toLowerCase();
  const topics = new Set();

  if (hack.app?.includes('Finder') || text.includes('finder')) topics.add('Finder & Files');
  if (hack.app?.some((a) => ['Safari', 'Chrome'].includes(a)) || /(browser|website|web)/.test(text))
    topics.add('Browsers & Web');
  if (hack.type === 'Terminal Hacks' || hack.app?.includes('Terminal')) topics.add('Terminal');
  if (hack.type === 'Settings Hacks' || text.includes('system settings')) topics.add('System Settings');

  if (/(clipboard|copy|paste|cut)/.test(text)) topics.add('Clipboard');
  if (/(screenshot|screen recording|recording|picture in picture|airplay|video)/.test(text))
    topics.add('Screenshots & Media');
  if (/(window|tiling|split|mission control|multitasking|dock|launchpad)/.test(text))
    topics.add('Window Management');
  if (/(security|gatekeeper|lock|password|wipe)/.test(text)) topics.add('Security & Privacy');
  if (/(performance|cpu|memory|ram|fan|app nap|cache)/.test(text)) topics.add('Performance');
  if (/(network|dns|internet|airdrop|ping|traceroute|icloud)/.test(text)) topics.add('Networking');
  if (/(accessibility|dictation|live speech)/.test(text)) topics.add('Accessibility');
  if (/(custom|appearance|emoji|tint|theme|login message|startup)/.test(text))
    topics.add('Customization');
  if (/(reset|fix|troubleshoot|safe mode)/.test(text)) topics.add('Troubleshooting');

  if (topics.size === 0) topics.add('General');
  return Array.from(topics).sort();
}

function enrichHack(hack) {
  const slug = hack.slug || `${slugify(hack.title)}-${hack.id}`;
  const method = hack.method || inferMethod(hack);
  const risk = hack.risk || inferRisk(hack);
  const topics =
    Array.isArray(hack.topics) && hack.topics.length > 0 ? hack.topics : inferTopics(hack);
  return { ...hack, slug, method, risk, topics };
}

function scoreRelated(base, other) {
  const baseApps = new Set(base.app || []);
  const baseTopics = new Set(base.topics || []);
  const baseKeywords = new Set(base.keywords || []);

  const sharedApps = (other.app || []).filter((a) => baseApps.has(a)).length;
  const sharedTopics = (other.topics || []).filter((t) => baseTopics.has(t)).length;
  const sharedKeywords = (other.keywords || []).filter((k) => baseKeywords.has(k)).length;

  let score = 0;
  if (sharedApps) score += sharedApps * 3;
  if (sharedTopics) score += sharedTopics * 2;
  if (sharedKeywords) score += sharedKeywords;
  if (other.type === base.type) score += 2;
  if (other.level === base.level) score += 1;
  return score;
}

function findRelated(hacks, hack, limit = 8) {
  return hacks
    .filter((h) => h.id !== hack.id)
    .map((h) => ({ h, score: scoreRelated(hack, h) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.h);
}

function findUndoHack(hacks, hack) {
  const title = String(hack.title || '');
  const patterns = [
    [/(^|\s)Disable\s+/i, 'Enable '],
    [/(^|\s)Enable\s+/i, 'Disable '],
    [/(^|\s)Hide\s+/i, 'Show '],
    [/(^|\s)Show\s+/i, 'Hide '],
    [/(^|\s)Re-Show\s+/i, 'Hide '],
  ];

  for (const [re, replacement] of patterns) {
    const match = title.match(re);
    if (!match) continue;
    const rest = title.replace(re, '').trim();
    const desired = `${replacement}${rest}`.trim();
    const candidates = hacks
      .filter((h) => h.id !== hack.id && h.title.toLowerCase() === desired.toLowerCase())
      .slice(0, 1);
    if (candidates.length) return candidates[0];
  }

  // Fallback: best match that flips enable/disable and shares keywords/apps.
  const flip =
    title.toLowerCase().includes('disable')
      ? 'enable'
      : title.toLowerCase().includes('enable')
        ? 'disable'
        : null;
  if (!flip) return null;

  const candidates = hacks
    .filter((h) => h.id !== hack.id && h.title.toLowerCase().includes(flip))
    .map((h) => ({ h, score: scoreRelated(hack, h) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 1);
  return candidates[0]?.h || null;
}

function buildSteps(hack) {
  const { lead, rest } = splitLeadSentence(hack.desc);
  const steps = [];

  if (hack.method === 'Terminal') {
    steps.push('Open Terminal.');
    const cmd = extractTerminalCommand(hack.desc);
    if (cmd) steps.push(`Run: ${cmd}`);
    else if (lead) steps.push(lead);
    if (rest) steps.push(rest);
    if (hack.risk === 'High') steps.push('Double-check the command before pressing Enter.');
    return steps.filter(Boolean).slice(0, 6);
  }

  if (hack.method === 'Settings') {
    if (lead && !lead.toLowerCase().includes('system settings')) {
      steps.push('Open System Settings (or the relevant app).');
    }
    if (lead) steps.push(lead);
    if (rest) steps.push(rest);
    steps.push('If you want to undo it later, return to the same setting and switch it back.');
    return steps.filter(Boolean).slice(0, 6);
  }

  if (hack.method === 'Shortcut') {
    steps.push('Focus the relevant app or window.');
    const combo = extractKeyCombo(hack.desc) || extractKeyCombo(lead);
    if (combo) steps.push(`Press ${combo}.`);
    if (rest) steps.push(rest);
    else if (lead && !combo) steps.push(lead);
    steps.push('Repeat whenever you need it—most shortcuts work everywhere.');
    return steps.filter(Boolean).slice(0, 6);
  }

  if (lead) steps.push(lead);
  if (rest) steps.push(rest);
  steps.push('Look for the same action in the menu bar if you prefer clicking.');
  return steps.filter(Boolean).slice(0, 6);
}

function buildTips(hack) {
  const tips = [];
  if (hack.method === 'Shortcut') {
    tips.push('If it doesn’t work, check the app’s menu bar—shortcuts are listed next to commands.');
    tips.push('Some shortcuts differ across keyboard layouts; try the menu-bar command to confirm.');
    tips.push(
      'You can customize many shortcuts in System Settings → Keyboard → Keyboard Shortcuts.',
    );
  } else if (hack.method === 'Settings') {
    tips.push('Use the search box in System Settings to jump directly to the right panel.');
    tips.push('Take note of the original value so you can revert later.');
  } else if (hack.method === 'Terminal') {
    tips.push('Prefer copy/paste for commands and read them fully before running.');
    tips.push('Use `man <command>` (or `--help`) to understand what a command does.');
    if (hack.risk === 'High') tips.push('Avoid running as admin (`sudo`) unless you understand the impact.');
  } else {
    tips.push('Many UI actions have a keyboard equivalent—try searching the menu bar for it.');
  }

  if ((hack.topics || []).includes('Troubleshooting')) tips.push('If the system looks “stuck”, try logging out/in or rebooting.');
  if ((hack.topics || []).includes('Security & Privacy'))
    tips.push('Treat security changes as temporary—turn protections back on when finished.');

  return Array.from(new Set(tips)).slice(0, 6);
}

function buildTroubleshooting(hack) {
  const items = [];

  if (hack.method === 'Shortcut') {
    items.push('Make sure the correct app/window is focused.');
    items.push('Check the menu bar for the command and its shortcut (apps can override defaults).');
    items.push('Try the shortcut in a different app to confirm your keyboard is working.');
  } else if (hack.method === 'Settings') {
    items.push('Use System Settings search to find the right panel quickly.');
    items.push('Some settings may be hidden or locked by device management (MDM).');
  } else if (hack.method === 'Terminal') {
    items.push('If you see “permission denied”, you may need admin rights or a different command.');
    items.push('Read the command fully before running it; avoid `sudo` unless necessary.');
    items.push('If nothing changes, you may need to quit/reopen the relevant app for the setting to apply.');
  } else {
    items.push('If you can’t find the UI, try searching the app’s menu bar.');
  }

  if (hack.risk === 'High') items.push('If you’re unsure, test on a non-critical file or setting first.');
  return Array.from(new Set(items)).slice(0, 6);
}

const TOPIC_USE_CASES = {
  'Clipboard': ['Move text between apps quickly', 'Copy files in Finder and paste into another folder'],
  'Finder & Files': ['Rename, tag, and organize files faster', 'Preview files without opening apps'],
  'Browsers & Web': ['Manage tabs and history faster', 'Browse with less distraction (e.g., private windows)'],
  'Window Management': ['Switch apps/windows quickly', 'Split-screen and multitask efficiently'],
  'Screenshots & Media': ['Capture a region/window for notes', 'Record quick tutorials or bug reports'],
  'System Settings': ['Tune macOS behavior to your workflow', 'Find hidden toggles that save time'],
  'Terminal': ['Advanced customization and power-user tweaks', 'Troubleshoot system behavior with commands'],
  'Security & Privacy': ['Lock down your Mac or data quickly', 'Temporarily adjust install/security controls'],
  'Performance': ['Reduce slowdowns during heavy workloads', 'Inspect or reset misbehaving processes'],
  'Networking': ['Fix flaky connections or DNS issues', 'Inspect Wi‑Fi/Bluetooth details'],
  'Accessibility': ['Use voice/assistive features', 'Improve ergonomics and readability'],
  'Customization': ['Make the UI feel “yours”', 'Tweak defaults like startup sounds and appearances'],
  'Troubleshooting': ['Reset stuck UI components', 'Boot into a safe state to debug issues'],
  'General': ['A handy trick to speed up everyday work'],
};

function buildUseCases(hack) {
  const items = [];
  for (const topic of hack.topics || []) {
    for (const item of TOPIC_USE_CASES[topic] || []) items.push(item);
  }
  return Array.from(new Set(items)).slice(0, 6);
}

function buildOverview(hack) {
  const { lead, rest } = splitLeadSentence(hack.desc);
  const combo = extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const command = extractTerminalCommand(hack.desc);

  const apps = (hack.app || []).join(', ') || 'macOS';
  const first =
    hack.method === 'Terminal' && command
      ? `This hack is a Terminal command for ${apps}.`
      : hack.method === 'Shortcut' && combo
        ? `This hack is a keyboard shortcut for ${apps}.`
        : hack.method === 'Settings'
          ? `This hack is a settings tweak for ${apps}.`
          : `This hack is a workflow tip for ${apps}.`;

  const second = rest ? rest : hack.desc;
  return [first, second].filter(Boolean);
}

function renderChip(label, variant = 'slate', href = null) {
  const cls =
    variant === 'blue'
      ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/20'
      : variant === 'amber'
        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/20'
        : variant === 'red'
          ? 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/20'
          : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10';
  const base = `px-2 py-1 rounded-lg text-xs font-semibold border ${cls}`;
  if (href) {
    return `<a href="${escapeHtml(
      href,
    )}" class="${base} hover:opacity-90 transition-opacity">${escapeHtml(label)}</a>`;
  }
  return `<span class="${base}">${escapeHtml(label)}</span>`;
}

function riskVariant(risk) {
  if (risk === 'High') return 'red';
  if (risk === 'Medium') return 'amber';
  return 'slate';
}

function renderHackPage(hack, allHacks) {
  const { lead } = splitLeadSentence(hack.desc);
  const combo = extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const command = extractTerminalCommand(hack.desc);
  const steps = Array.isArray(hack.wiki?.steps) ? hack.wiki.steps : buildSteps(hack);
  const tips = Array.isArray(hack.wiki?.tips) ? hack.wiki.tips : buildTips(hack);
  const troubleshooting = Array.isArray(hack.wiki?.troubleshooting)
    ? hack.wiki.troubleshooting
    : buildTroubleshooting(hack);
  const useCases = Array.isArray(hack.wiki?.useCases) ? hack.wiki.useCases : buildUseCases(hack);
  const overview = Array.isArray(hack.wiki?.overview) ? hack.wiki.overview : buildOverview(hack);
  const related = findRelated(allHacks, hack, 8);
  const undo = findUndoHack(allHacks, hack);

  const atAGlance = [
    ...(hack.app || []).map((a) => renderChip(a, 'slate', `../index.html?app=${encodeURIComponent(a)}`)),
    renderChip(hack.type, 'slate', `../index.html?type=${encodeURIComponent(hack.type)}`),
    renderChip(`Level: ${hack.level}`, 'slate'),
    renderChip(`Method: ${hack.method}`, 'blue', `../index.html?method=${encodeURIComponent(hack.method)}`),
    renderChip(`Risk: ${hack.risk}`, riskVariant(hack.risk)),
    ...(hack.tahoe ? [renderChip('Tahoe', 'blue')] : []),
  ].join('');

  const topicsHtml = (hack.topics || [])
    .map((t) => renderChip(t, 'blue', `../index.html?topic=${encodeURIComponent(t)}`))
    .join('');
  const keywordsHtml = (hack.keywords || [])
    .map((k) => renderChip(k, 'slate', `../index.html?q=${encodeURIComponent(k)}`))
    .join('');

  const quickRefLabel =
    hack.method === 'Terminal' ? 'Command' : hack.method === 'Shortcut' ? 'Shortcut' : 'Reference';
  const quickRefValue =
    hack.method === 'Terminal'
      ? command || hack.desc
      : hack.method === 'Shortcut' && combo
        ? combo
        : lead || hack.desc;

  const quickRefHtml =
    hack.method === 'Terminal'
      ? `<pre class="bg-slate-950 text-slate-100 rounded-2xl p-4 overflow-auto border border-slate-800 text-sm"><code>${escapeHtml(
          quickRefValue,
        )}</code></pre>`
      : hack.method === 'Shortcut' && combo
        ? renderKeycaps(combo)
        : `<div class="bg-slate-100 dark:bg-slate-950 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 font-mono text-sm text-slate-700 dark:text-slate-200">${escapeHtml(
            quickRefValue,
          )}</div>`;

  const undoHtml = undo
    ? `<a href="./${encodeURIComponent(
        undo.slug,
      )}.html" class="underline hover:no-underline text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(
        undo.title,
      )}</a>`
    : `<span class="text-slate-600 dark:text-slate-300">Return to the same place and switch the setting back, or use the inverse action if available.</span>`;

  const safetyNote =
    hack.risk === 'High'
      ? `<div class="mt-6 bg-red-500/10 border border-red-500/20 rounded-3xl p-6 text-red-800 dark:text-red-200">
          <div class="font-bold mb-1">Safety note</div>
          <div class="text-sm leading-relaxed">This hack can change system behavior or cause data loss. Read the command/path carefully, and make sure you understand how to undo it before proceeding.</div>
        </div>`
      : '';

  const relatedHtml = related.length
    ? related
        .map(
          (r) => `
          <a href="./${encodeURIComponent(r.slug)}.html" class="block p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <div class="flex items-center justify-between gap-3">
              <div class="font-semibold text-slate-900 dark:text-white">${escapeHtml(r.title)}</div>
              <div class="text-xs font-mono text-slate-400">${escapeHtml(r.type)}</div>
            </div>
            <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(r.desc)}</div>
          </a>
        `,
        )
        .join('')
    : `<div class="text-slate-500">No related hacks found.</div>`;

  const description = escapeHtml(hack.desc);

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(hack.title)} — Mac Hacks Dictionary</title>
  <meta name="description" content="${description}" />

  <script>
    try {
      const pref = localStorage.getItem('mac_hacks_theme');
      if (pref === 'light') document.documentElement.classList.remove('dark');
      if (pref === 'dark') document.documentElement.classList.add('dark');
    } catch {}
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          borderRadius: { '4xl': '2rem' },
          colors: { tahoe: { 500: '#0ea5e9', 900: '#0c4a6e' } },
          fontFamily: {
            sans: ['SF Pro Display', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link rel="stylesheet" href="../assets/site.css" />
</head>
<body data-hack-id="${hack.id}" data-hack-command="${escapeHtml(command || '')}" class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 min-h-screen font-sans selection:bg-tahoe-500 selection:text-white pb-20 transition-colors duration-300">
  <div class="max-w-5xl mx-auto px-6 pt-10">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-10">
      <div class="flex items-center gap-2">
        <a href="../index.html" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span aria-hidden="true">←</span>
          All hacks
        </a>
        <button id="copy-link" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          Copy link
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button id="theme-toggle" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          Toggle theme
        </button>
        <button id="fav-toggle" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 shadow-lg hover:opacity-90 transition-opacity">
          <span class="text-lg" aria-hidden="true">🤍</span>
          Save
        </button>
      </div>
    </div>

    <div class="mb-6">
      <div class="text-sm text-slate-500 dark:text-slate-400 font-mono mb-3">Mac Hacks Dictionary</div>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">${escapeHtml(
        hack.title,
      )}</h1>
      <p class="mt-3 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">${description}</p>
    </div>

    <div class="flex flex-wrap gap-2 mb-10">${atAGlance}</div>

    <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl mb-6">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-3">Overview</h2>
      <div class="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
        ${overview.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Common uses</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${useCases.map((u) => `<li>${escapeHtml(u)}</li>`).join('') || '<li>Use whenever it saves you time.</li>'}
          </ul>
        </div>
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Troubleshooting</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${troubleshooting.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Quick reference</h2>
          <button id="copy-command" class="${
            hack.method === 'Terminal' && command ? '' : 'hidden '
          }text-sm px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Copy</button>
        </div>
        <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">${escapeHtml(
          quickRefLabel,
        )}</div>
        ${quickRefHtml}
      </div>

      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">How to use</h2>
        <ol class="list-decimal ml-5 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          ${steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
        </ol>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Classifications</h2>
        <div class="space-y-4">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Topics</div>
            <div class="mt-2 flex flex-wrap gap-2">${topicsHtml || '<span class=\"text-slate-500\">—</span>'}</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Keywords</div>
            <div class="mt-2 flex flex-wrap gap-2">${keywordsHtml || '<span class=\"text-slate-500\">—</span>'}</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Undo / revert</div>
            <div class="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${undoHtml}</div>
          </div>
        </div>
      </div>

      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Tips</h2>
        <ul class="list-disc ml-5 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          ${tips.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="mt-6 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Related hacks</h2>
      <div class="space-y-3">${relatedHtml}</div>
    </div>

    ${safetyNote}
  </div>

  <script src="../assets/hack-page.js"></script>
</body>
</html>`;
}

function renderHacksDataJs(hacks) {
  return `const HACKS = ${JSON.stringify(hacks, null, 2)};\n`;
}

function renderSiteCss() {
  return `::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }
`;
}

async function main() {
  const raw = JSON.parse(await fs.readFile(DATA_PATH, 'utf8'));
  const hacks = raw.map(enrichHack);

  await fs.mkdir(ASSETS_DIR, { recursive: true });
  await fs.mkdir(HACKS_DIR, { recursive: true });

  await fs.writeFile(path.join(ASSETS_DIR, 'hacks-data.js'), renderHacksDataJs(hacks), 'utf8');
  await fs.writeFile(path.join(ASSETS_DIR, 'site.css'), renderSiteCss(), 'utf8');

  // Clean previously generated pages (keeps the folder tidy if slugs change).
  for (const entry of await fs.readdir(HACKS_DIR, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    if (!entry.name.endsWith('.html')) continue;
    await fs.unlink(path.join(HACKS_DIR, entry.name));
  }

  // Hack pages
  await Promise.all(
    hacks.map(async (hack) => {
      const html = renderHackPage(hack, hacks);
      const outPath = path.join(HACKS_DIR, `${hack.slug}.html`);
      await fs.writeFile(outPath, html, 'utf8');
    }),
  );

  console.log(`Generated ${hacks.length} hack pages in ${path.relative(repoRoot, HACKS_DIR)}/`);
}

await main();
