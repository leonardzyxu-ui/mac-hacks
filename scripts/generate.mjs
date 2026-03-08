import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

const SITE_SRC_DIR = path.join(repoRoot, 'apps', 'site', 'src');
const SITE_ASSETS_SRC_DIR = path.join(SITE_SRC_DIR, 'assets');
const CONTENT_HACKS_DIR = path.join(repoRoot, 'content', 'hacks');
const OUTPUT_DIR = path.join(repoRoot, 'docs');
const OUTPUT_ASSETS_DIR = path.join(OUTPUT_DIR, 'assets');
const OUTPUT_HACKS_DIR = path.join(OUTPUT_DIR, 'hacks');

const CLIENT_FIELDS = [
  'id',
  'title',
  'app',
  'level',
  'type',
  'tahoe',
  'keywords',
  'desc',
  'slug',
  'method',
  'risk',
  'topics',
];

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
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
        return char;
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
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return '';

  return (
    `<div class="flex flex-wrap items-center gap-2">` +
    parts
      .map((part, index) => {
        const key = normalizeKeyToken(part);
        const plus =
          index < parts.length - 1
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

  if (text.includes('warning') || text.includes('risky') || text.includes('impossible to recover')) {
    return 'High';
  }

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
  if (hack.app?.some((app) => ['Safari', 'Chrome'].includes(app)) || /(browser|website|web)/.test(text)) {
    topics.add('Browsers & Web');
  }
  if (hack.type === 'Terminal Hacks' || hack.app?.includes('Terminal')) topics.add('Terminal');
  if (hack.type === 'Settings Hacks' || text.includes('system settings')) {
    topics.add('System Settings');
  }

  if (/(clipboard|copy|paste|cut)/.test(text)) topics.add('Clipboard');
  if (/(screenshot|screen recording|recording|picture in picture|airplay|video)/.test(text)) {
    topics.add('Screenshots & Media');
  }
  if (/(window|tiling|split|mission control|multitasking|dock|launchpad)/.test(text)) {
    topics.add('Window Management');
  }
  if (/(security|gatekeeper|lock|password|wipe)/.test(text)) topics.add('Security & Privacy');
  if (/(performance|cpu|memory|ram|fan|app nap|cache)/.test(text)) topics.add('Performance');
  if (/(network|dns|internet|airdrop|ping|traceroute|icloud)/.test(text)) topics.add('Networking');
  if (/(accessibility|dictation|live speech)/.test(text)) topics.add('Accessibility');
  if (/(custom|appearance|emoji|tint|theme|login message|startup)/.test(text)) {
    topics.add('Customization');
  }
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

function validateHack(hack, folderName) {
  if (!Number.isInteger(hack.id)) {
    throw new Error(`Hack in ${folderName} is missing an integer id`);
  }
  if (!hack.title) {
    throw new Error(`Hack ${folderName} is missing a title`);
  }
  if (!Array.isArray(hack.app) || hack.app.length === 0) {
    throw new Error(`Hack ${folderName} is missing a non-empty app array`);
  }
  if (!hack.level || !hack.type || !hack.desc) {
    throw new Error(`Hack ${folderName} is missing one of level/type/desc`);
  }
  if (hack.slug && hack.slug !== folderName) {
    throw new Error(`Hack ${folderName} has slug ${hack.slug}; folder and slug must match`);
  }
}

function scoreRelated(base, other) {
  const baseApps = new Set(base.app || []);
  const baseTopics = new Set(base.topics || []);
  const baseKeywords = new Set(base.keywords || []);

  const sharedApps = (other.app || []).filter((app) => baseApps.has(app)).length;
  const sharedTopics = (other.topics || []).filter((topic) => baseTopics.has(topic)).length;
  const sharedKeywords = (other.keywords || []).filter((keyword) => baseKeywords.has(keyword))
    .length;

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
    .filter((item) => item.id !== hack.id)
    .map((item) => ({ hack: item, score: scoreRelated(hack, item) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.hack);
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

  for (const [pattern, replacement] of patterns) {
    if (!pattern.test(title)) continue;
    const desired = title.replace(pattern, `${replacement}`).trim();
    const exact = hacks.find(
      (item) => item.id !== hack.id && item.title.toLowerCase() === desired.toLowerCase(),
    );
    if (exact) return exact;
  }

  const flip = title.toLowerCase().includes('disable')
    ? 'enable'
    : title.toLowerCase().includes('enable')
      ? 'disable'
      : null;
  if (!flip) return null;

  const candidate = hacks
    .filter((item) => item.id !== hack.id && item.title.toLowerCase().includes(flip))
    .map((item) => ({ hack: item, score: scoreRelated(hack, item) }))
    .sort((a, b) => b.score - a.score)[0];

  return candidate?.hack || null;
}

function createHeadingId(text, usedIds) {
  const base = slugify(text) || 'section';
  let id = base;
  let suffix = 2;
  while (usedIds.has(id)) {
    id = `${base}-${suffix}`;
    suffix += 1;
  }
  usedIds.add(id);
  return id;
}

function sanitizeHref(rawHref) {
  const href = String(rawHref || '').trim();
  if (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('mailto:') ||
    href.startsWith('../') ||
    href.startsWith('./') ||
    href.startsWith('/')
  ) {
    return escapeHtml(href);
  }
  return '#';
}

function renderInlineMarkdown(text) {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
    return `<a href="${sanitizeHref(href)}">${label}</a>`;
  });
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return html;
}

function renderMarkdown(markdown) {
  const lines = String(markdown || '').replace(/\r\n/g, '\n').split('\n');
  const html = [];
  const headings = [];
  const usedIds = new Set();

  let paragraph = [];
  let unordered = [];
  let ordered = [];
  let codeBlock = null;

  function flushParagraph() {
    if (paragraph.length === 0) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph = [];
  }

  function flushUnordered() {
    if (unordered.length === 0) return;
    html.push(`<ul>${unordered.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ul>`);
    unordered = [];
  }

  function flushOrdered() {
    if (ordered.length === 0) return;
    html.push(`<ol>${ordered.map((item) => `<li>${renderInlineMarkdown(item)}</li>`).join('')}</ol>`);
    ordered = [];
  }

  function flushCodeBlock() {
    if (!codeBlock) return;
    const languageClass = codeBlock.lang ? ` class="language-${escapeHtml(codeBlock.lang)}"` : '';
    html.push(
      `<pre><code${languageClass}>${escapeHtml(codeBlock.lines.join('\n'))}</code></pre>`,
    );
    codeBlock = null;
  }

  function flushAll() {
    flushParagraph();
    flushUnordered();
    flushOrdered();
    flushCodeBlock();
  }

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ');

    if (codeBlock) {
      if (line.trim().startsWith('```')) {
        flushCodeBlock();
      } else {
        codeBlock.lines.push(line);
      }
      continue;
    }

    const fenced = line.match(/^```([a-zA-Z0-9_-]+)?\s*$/);
    if (fenced) {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      codeBlock = { lang: fenced[1] || '', lines: [] };
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushUnordered();
      flushOrdered();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = createHeadingId(text, usedIds);
      html.push(`<h${level} id="${id}">${renderInlineMarkdown(text)}</h${level}>`);
      if (level >= 2 && level <= 3) headings.push({ level, text, id });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      flushParagraph();
      flushOrdered();
      unordered.push(line.replace(/^\s*[-*]\s+/, '').trim());
      continue;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      flushUnordered();
      ordered.push(orderedMatch[1].trim());
      continue;
    }

    paragraph.push(line.trim());
  }

  flushAll();

  return {
    html: html.join('\n'),
    headings,
  };
}

function buildPrerequisites(hack) {
  const prerequisites = [];

  if (hack.compatibility?.macosMin) {
    prerequisites.push(`macOS ${hack.compatibility.macosMin} or later`);
  }

  if (hack.method === 'Terminal' && (hack.command?.includes('sudo') || hack.desc?.includes('sudo'))) {
    prerequisites.push('Administrator password required');
  }

  if (Array.isArray(hack.permissions) && hack.permissions.length > 0) {
    prerequisites.push(`Required permissions: ${hack.permissions.join(', ')}`);
  }

  if (hack.app?.includes('Terminal')) {
    prerequisites.push('Terminal app (built into macOS)');
  }

  if (prerequisites.length === 0) {
    if (hack.method === 'Settings') {
      prerequisites.push('Access to System Settings');
    } else if (hack.method === 'Terminal') {
      prerequisites.push('Terminal app');
      prerequisites.push('Basic familiarity with command line');
    }
  }

  return prerequisites;
}

function buildVerify(hack) {
  const verify = [];

  if (hack.method === 'Terminal') {
    verify.push('The command should complete without error messages');
    if (hack.desc?.includes('killall') || hack.desc?.includes('restart')) {
      verify.push('The affected app or service should restart automatically');
    }
  } else if (hack.method === 'Settings') {
    verify.push('The setting toggle should reflect your new choice');
    verify.push('Changes may take effect immediately or after closing System Settings');
  } else if (hack.method === 'Shortcut') {
    verify.push('The expected action should occur immediately');
    verify.push('If nothing happens, check that the correct window or app is focused');
  }

  return verify.length > 0 ? verify : ['Verify the change took effect as described above'];
}

function buildUndoSteps(hack) {
  if (hack.undoCommand) {
    return [`Run: ${hack.undoCommand}`];
  }

  const undo = [];

  if (hack.method === 'Settings') {
    undo.push('Return to the same System Settings panel');
    undo.push('Toggle the setting back to its original state');
  } else if (hack.method === 'Terminal' && hack.desc?.includes('defaults write')) {
    undo.push('To revert, use `defaults delete` with the same domain and key');
    undo.push('Then restart the affected app or run the related `killall` command');
  }

  return undo.length > 0 ? undo : ['Reverse the steps above or use the linked inverse hack if available'];
}

function buildCompatibility(hack) {
  if (hack.compatibility) {
    return hack.compatibility;
  }

  if (hack.tahoe) {
    return {
      macosMin: '26.0',
      notes: 'Requires macOS Tahoe (26.0) or later',
    };
  }

  return null;
}

function buildSteps(hack) {
  const { lead, rest } = splitLeadSentence(hack.desc);
  const steps = [];

  if (hack.method === 'Terminal') {
    steps.push('Open Terminal.');
    const command = hack.command || extractTerminalCommand(hack.desc);
    if (command) steps.push(`Run: ${command}`);
    else if (lead) steps.push(lead);
    if (rest) steps.push(rest);
    if (hack.risk === 'High') steps.push('Double-check the command before pressing Enter.');
    return steps.filter(Boolean).slice(0, 6);
  }

  if (hack.method === 'Settings') {
    if (hack.settingsPath) {
      steps.push(`Open System Settings → ${hack.settingsPath}`);
    } else if (lead && !lead.toLowerCase().includes('system settings')) {
      steps.push('Open System Settings (or the relevant app).');
    }
    if (lead && !hack.settingsPath) steps.push(lead);
    if (rest) steps.push(rest);
    steps.push('If you want to undo it later, return to the same setting and switch it back.');
    return steps.filter(Boolean).slice(0, 6);
  }

  if (hack.method === 'Shortcut') {
    steps.push('Focus the relevant app or window.');
    const combo = hack.shortcut || extractKeyCombo(hack.desc) || extractKeyCombo(lead);
    if (combo) steps.push(`Press ${combo}.`);
    if (rest) steps.push(rest);
    else if (lead && !combo) steps.push(lead);
    steps.push('Repeat whenever you need it; most shortcuts work everywhere.');
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
    tips.push("If it doesn't work, check the app's menu bar; shortcuts are listed next to commands.");
    tips.push('Some shortcuts differ across keyboard layouts; use the menu-bar command to confirm.');
    tips.push('You can customize many shortcuts in System Settings → Keyboard → Keyboard Shortcuts.');
  } else if (hack.method === 'Settings') {
    tips.push('Use the search box in System Settings to jump directly to the right panel.');
    tips.push('Take note of the original value so you can revert later.');
  } else if (hack.method === 'Terminal') {
    tips.push('Prefer copy and paste for commands and read them fully before running.');
    tips.push('Use `man <command>` or `--help` to understand what a command does.');
    if (hack.risk === 'High') {
      tips.push('Avoid running as admin (`sudo`) unless you understand the impact.');
    }
  } else {
    tips.push('Many UI actions have a keyboard equivalent; try searching the menu bar for it.');
  }

  if ((hack.topics || []).includes('Troubleshooting')) {
    tips.push('If the system looks stuck, try logging out and back in or rebooting.');
  }
  if ((hack.topics || []).includes('Security & Privacy')) {
    tips.push('Treat security changes as temporary and turn protections back on when finished.');
  }

  return Array.from(new Set(tips)).slice(0, 6);
}

function buildTroubleshooting(hack) {
  const items = [];

  if (hack.method === 'Shortcut') {
    items.push('Make sure the correct app or window is focused.');
    items.push('Check the menu bar for the command and its shortcut; apps can override defaults.');
    items.push('Try the shortcut in a different app to confirm your keyboard is working.');
  } else if (hack.method === 'Settings') {
    items.push('Use System Settings search to find the right panel quickly.');
    items.push('Some settings may be hidden or locked by device management.');
  } else if (hack.method === 'Terminal') {
    items.push('If you see “permission denied”, you may need admin rights or a different command.');
    items.push('Read the command fully before running it; avoid `sudo` unless necessary.');
    items.push('If nothing changes, you may need to quit and reopen the relevant app.');
  } else {
    items.push("If you can't find the UI, try searching the app's menu bar.");
  }

  if (hack.risk === 'High') {
    items.push('If you are unsure, test on a non-critical file or setting first.');
  }

  return Array.from(new Set(items)).slice(0, 6);
}

const TOPIC_USE_CASES = {
  Clipboard: ['Move text between apps quickly', 'Copy files in Finder and paste into another folder'],
  'Finder & Files': ['Rename, tag, and organize files faster', 'Preview files without opening apps'],
  'Browsers & Web': ['Manage tabs and history faster', 'Browse with less distraction'],
  'Window Management': ['Switch apps and windows quickly', 'Split-screen and multitask efficiently'],
  'Screenshots & Media': ['Capture a region or window for notes', 'Record quick tutorials or bug reports'],
  'System Settings': ['Tune macOS behavior to your workflow', 'Find hidden toggles that save time'],
  Terminal: ['Advanced customization and power-user tweaks', 'Troubleshoot system behavior with commands'],
  'Security & Privacy': ['Lock down your Mac or data quickly', 'Temporarily adjust install or security controls'],
  Performance: ['Reduce slowdowns during heavy workloads', 'Inspect or reset misbehaving processes'],
  Networking: ['Fix flaky connections or DNS issues', 'Inspect Wi-Fi or Bluetooth details'],
  Accessibility: ['Use voice and assistive features', 'Improve ergonomics and readability'],
  Customization: ['Make the UI feel yours', 'Tweak defaults like startup sounds and appearances'],
  Troubleshooting: ['Reset stuck UI components', 'Boot into a safe state to debug issues'],
  General: ['A handy trick to speed up everyday work'],
};

function buildUseCases(hack) {
  const items = [];
  for (const topic of hack.topics || []) {
    for (const item of TOPIC_USE_CASES[topic] || []) {
      items.push(item);
    }
  }
  return Array.from(new Set(items)).slice(0, 6);
}

function buildOverview(hack) {
  const { lead, rest } = splitLeadSentence(hack.desc);
  const combo = hack.shortcut || extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const command = hack.command || extractTerminalCommand(hack.desc);
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
  const classes =
    variant === 'blue'
      ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/20'
      : variant === 'amber'
        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/20'
        : variant === 'red'
          ? 'bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/20'
          : variant === 'green'
            ? 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/20'
            : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10';
  const base = `px-2 py-1 rounded-lg text-xs font-semibold border ${classes}`;

  if (href) {
    return `<a href="${escapeHtml(href)}" class="${base} hover:opacity-90 transition-opacity">${escapeHtml(label)}</a>`;
  }

  return `<span class="${base}">${escapeHtml(label)}</span>`;
}

function riskVariant(risk) {
  if (risk === 'High') return 'red';
  if (risk === 'Medium') return 'amber';
  return 'green';
}

function getSettingsDeepLink(hack) {
  if (hack.settingsDeepLink) return hack.settingsDeepLink;

  const settingsMap = {
    'Wi-Fi': 'x-apple.systempreferences:com.apple.wifi-settings-extension',
    Bluetooth: 'x-apple.systempreferences:com.apple.BluetoothSettings',
    Network: 'x-apple.systempreferences:com.apple.Network-Settings.extension',
    General: 'x-apple.systempreferences:com.apple.systempreferences.GeneralSettings',
    Appearance: 'x-apple.systempreferences:com.apple.Appearance-Settings.extension',
    'Desktop & Dock': 'x-apple.systempreferences:com.apple.Desktop-Settings.extension',
    Displays: 'x-apple.systempreferences:com.apple.Displays-Settings.extension',
    Keyboard: 'x-apple.systempreferences:com.apple.Keyboard-Settings.extension',
    Trackpad: 'x-apple.systempreferences:com.apple.Trackpad-Settings.extension',
    Accessibility: 'x-apple.systempreferences:com.apple.Accessibility-Settings.extension',
    'Privacy & Security': 'x-apple.systempreferences:com.apple.preference.security',
    Sound: 'x-apple.systempreferences:com.apple.Sound-Settings.extension',
  };

  if (hack.settingsPath) {
    for (const [key, link] of Object.entries(settingsMap)) {
      if (hack.settingsPath.includes(key)) return link;
    }
  }

  return null;
}

function renderWikiSection(wikiMarkdown) {
  if (!String(wikiMarkdown || '').trim()) return '';

  const { html, headings } = renderMarkdown(wikiMarkdown);
  if (!html) return '';

  const toc =
    headings.length > 1
      ? `<aside class="lg:col-span-1">
          <div class="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 sticky top-6">
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">On this page</div>
            <nav class="wiki-toc flex flex-col gap-2 text-sm">
              ${headings
                .map(
                  ({ level, text, id }) =>
                    `<a href="#${escapeHtml(id)}" class="${level === 3 ? 'pl-4 ' : ''}text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">${escapeHtml(
                      text,
                    )}</a>`,
                )
                .join('')}
            </nav>
          </div>
        </aside>`
      : '';

  return `<section class="mt-6 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Detailed guide</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Long-form wiki content authored per hack in Markdown.</p>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      ${toc}
      <article class="wiki-content ${toc ? 'lg:col-span-2' : 'lg:col-span-3'}">
        ${html}
      </article>
    </div>
  </section>`;
}

function renderHackPage(hack, allHacks) {
  const { lead } = splitLeadSentence(hack.desc);
  const combo = hack.shortcut || extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const command = hack.command || extractTerminalCommand(hack.desc);
  const steps = buildSteps(hack);
  const tips = buildTips(hack);
  const troubleshooting = buildTroubleshooting(hack);
  const useCases = buildUseCases(hack);
  const overview = buildOverview(hack);
  const prerequisites = buildPrerequisites(hack);
  const verify = buildVerify(hack);
  const compatibility = buildCompatibility(hack);
  const related = findRelated(allHacks, hack, 8);
  const undo = findUndoHack(allHacks, hack);
  const undoSteps = buildUndoSteps(hack);
  const settingsDeepLink = getSettingsDeepLink(hack);
  const wikiSection = renderWikiSection(hack.wikiMarkdown);

  const atAGlance = [
    ...(hack.app || []).map((app) =>
      renderChip(app, 'slate', `../../index.html?app=${encodeURIComponent(app)}`),
    ),
    renderChip(hack.type, 'slate', `../../index.html?type=${encodeURIComponent(hack.type)}`),
    renderChip(`Level: ${hack.level}`, 'slate'),
    renderChip(
      `Method: ${hack.method}`,
      'blue',
      `../../index.html?method=${encodeURIComponent(hack.method)}`,
    ),
    renderChip(
      `Risk: ${hack.risk}`,
      riskVariant(hack.risk),
      `../../index.html?risk=${encodeURIComponent(hack.risk)}`,
    ),
    ...(hack.tahoe ? [renderChip('Tahoe', 'blue')] : []),
  ].join('');

  const topicsHtml = (hack.topics || [])
    .map((topic) => renderChip(topic, 'blue', `../../index.html?topic=${encodeURIComponent(topic)}`))
    .join('');
  const keywordsHtml = (hack.keywords || [])
    .map((keyword) => renderChip(keyword, 'slate', `../../index.html?q=${encodeURIComponent(keyword)}`))
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
    ? `<a href="../${encodeURIComponent(
        undo.slug,
      )}/" class="underline hover:no-underline text-blue-600 dark:text-blue-400 font-semibold">${escapeHtml(
        undo.title,
      )}</a>`
    : `<span class="text-slate-600 dark:text-slate-300">Return to the same place and switch the setting back, or use the inverse action if available.</span>`;

  const safetyNote =
    hack.risk === 'High'
      ? `<div class="mt-6 bg-red-500/10 border border-red-500/20 rounded-3xl p-6 text-red-800 dark:text-red-200">
          <div class="font-bold mb-1">Safety note</div>
          <div class="text-sm leading-relaxed">This hack can change system behavior or cause data loss. Read the command or path carefully, and make sure you understand how to undo it before proceeding.</div>
        </div>`
      : '';

  const settingsButton =
    settingsDeepLink && hack.method === 'Settings'
      ? `<a href="${escapeHtml(settingsDeepLink)}" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/20 font-semibold transition-colors mt-4">
          <span>Open in System Settings</span>
        </a>`
      : '';

  const prerequisitesHtml =
    prerequisites.length > 0
      ? `<div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Prerequisites</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${prerequisites.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  const verifyHtml =
    verify.length > 0
      ? `<div class="p-4 rounded-2xl bg-green-500/10 dark:bg-green-500/10 border border-green-500/20">
          <div class="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400 mb-2">How to verify</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${verify.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  const compatibilityHtml = compatibility
    ? `<div class="p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/10 border border-blue-500/20">
        <div class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Compatibility</div>
        <div class="text-sm text-slate-700 dark:text-slate-300 space-y-1">
          ${compatibility.macosMin ? `<div><strong>Requires:</strong> macOS ${escapeHtml(compatibility.macosMin)}${compatibility.macosMax ? ` - ${escapeHtml(compatibility.macosMax)}` : '+'}</div>` : ''}
          ${compatibility.removedIn ? `<div class="text-amber-600 dark:text-amber-400"><strong>Removed in:</strong> macOS ${escapeHtml(compatibility.removedIn)}</div>` : ''}
          ${compatibility.notes ? `<div class="text-slate-500">${escapeHtml(compatibility.notes)}</div>` : ''}
        </div>
      </div>`
    : '';

  const undoStepsHtml =
    undoSteps.length > 0
      ? `<div class="mt-4">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Undo steps</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${undoSteps.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>`
      : '';

  const relatedHtml =
    related.length > 0
      ? related
          .map(
            (item) => `
          <a href="../${encodeURIComponent(
            item.slug,
          )}/" class="block p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
            <div class="flex items-center justify-between gap-3">
              <div class="font-semibold text-slate-900 dark:text-white">${escapeHtml(item.title)}</div>
              <div class="text-xs font-mono text-slate-400">${escapeHtml(item.type)}</div>
            </div>
            <div class="mt-1 text-sm text-slate-600 dark:text-slate-300">${escapeHtml(item.desc)}</div>
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
  <title>${escapeHtml(hack.title)} - Mac Hacks Dictionary</title>
  <meta name="description" content="${description}" />

  <script>
    try {
      const pref = localStorage.getItem('mac_hacks_theme');
      if (pref === 'light') document.documentElement.classList.remove('dark');
      if (pref === 'dark') document.documentElement.classList.add('dark');
    } catch {}
  </script>
  <link rel="stylesheet" href="../../assets/tailwind.css" />
  <link rel="stylesheet" href="../../assets/site.css" />
</head>
<body data-hack-id="${hack.id}" data-hack-command="${escapeHtml(command || '')}" class="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 min-h-screen font-sans selection:bg-tahoe-500 selection:text-white pb-20 transition-colors duration-300">
  <div class="max-w-5xl mx-auto px-6 pt-10">
    <div class="flex flex-wrap items-center justify-between gap-3 mb-10">
      <div class="flex items-center gap-2">
        <a href="../../index.html" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
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
          <span class="text-lg" aria-hidden="true" data-fav-icon>🤍</span>
          <span data-fav-label>Save</span>
        </button>
      </div>
    </div>

    <div class="mb-6">
      <div class="text-sm text-slate-500 dark:text-slate-400 font-mono mb-3">Mac Hacks Dictionary</div>
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">${escapeHtml(
        hack.title,
      )}</h1>
      <p class="mt-3 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">${description}</p>
      ${settingsButton}
    </div>

    <div class="flex flex-wrap gap-2 mb-10">${atAGlance}</div>

    <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl mb-6">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-3">Overview</h2>
      <div class="space-y-3 text-slate-700 dark:text-slate-300 leading-relaxed">
        ${overview.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        ${prerequisitesHtml}
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <div class="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Common uses</div>
          <ul class="list-disc ml-5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            ${useCases.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Use whenever it saves you time.</li>'}
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
          ${steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}
        </ol>
      </div>
    </div>

    ${wikiSection}

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      ${verifyHtml ? `<div class="space-y-4">${verifyHtml}${compatibilityHtml || ''}</div>` : ''}
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Troubleshooting</h2>
        <ul class="list-disc ml-5 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          ${troubleshooting.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Classifications</h2>
        <div class="space-y-4">
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Topics</div>
            <div class="mt-2 flex flex-wrap gap-2">${topicsHtml || '<span class="text-slate-500">-</span>'}</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Keywords</div>
            <div class="mt-2 flex flex-wrap gap-2">${keywordsHtml || '<span class="text-slate-500">-</span>'}</div>
          </div>
          <div>
            <div class="text-xs font-semibold uppercase tracking-wider text-slate-400">Undo or revert</div>
            <div class="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">${undoHtml}</div>
            ${undoStepsHtml}
          </div>
        </div>
      </div>

      <div class="bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Tips</h2>
        <ul class="list-disc ml-5 space-y-2 text-slate-700 dark:text-slate-300 leading-relaxed">
          ${tips.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>
    </div>

    <div class="mt-6 bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
      <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Related hacks</h2>
      <div class="space-y-3">${relatedHtml}</div>
    </div>

    ${safetyNote}
  </div>

  <script src="../../assets/hack-page.js"></script>
</body>
</html>`;
}

function toClientHack(hack) {
  const clientHack = {};
  for (const field of CLIENT_FIELDS) {
    if (hack[field] !== undefined) {
      clientHack[field] = hack[field];
    }
  }
  return clientHack;
}

function renderHacksDataJs(hacks) {
  return `const HACKS = ${JSON.stringify(hacks.map(toClientHack), null, 2)};\n`;
}

function renderSiteCss() {
  return `::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.dark ::-webkit-scrollbar-thumb { background: #334155; }

.wiki-content {
  color: #334155;
  line-height: 1.8;
  font-size: 1rem;
}

.dark .wiki-content {
  color: #cbd5e1;
}

.wiki-content > :first-child {
  margin-top: 0;
}

.wiki-content > :last-child {
  margin-bottom: 0;
}

.wiki-content h2,
.wiki-content h3,
.wiki-content h4 {
  color: #0f172a;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.dark .wiki-content h2,
.dark .wiki-content h3,
.dark .wiki-content h4 {
  color: #f8fafc;
}

.wiki-content h2 {
  font-size: 1.5rem;
  margin: 2rem 0 1rem;
}

.wiki-content h3 {
  font-size: 1.2rem;
  margin: 1.5rem 0 0.75rem;
}

.wiki-content h4 {
  font-size: 1.05rem;
  margin: 1.25rem 0 0.5rem;
}

.wiki-content p,
.wiki-content ul,
.wiki-content ol,
.wiki-content pre,
.wiki-content blockquote {
  margin: 1rem 0;
}

.wiki-content ul,
.wiki-content ol {
  padding-left: 1.5rem;
}

.wiki-content ul {
  list-style: disc;
}

.wiki-content ol {
  list-style: decimal;
}

.wiki-content li + li {
  margin-top: 0.35rem;
}

.wiki-content a {
  color: #2563eb;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.dark .wiki-content a {
  color: #60a5fa;
}

.wiki-content code {
  background: rgba(148, 163, 184, 0.14);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.4rem;
  padding: 0.1rem 0.35rem;
  font-size: 0.925em;
}

.dark .wiki-content code {
  background: rgba(15, 23, 42, 0.9);
  border-color: rgba(51, 65, 85, 1);
}

.wiki-content pre {
  background: #020617;
  color: #e2e8f0;
  border: 1px solid #1e293b;
  border-radius: 1rem;
  padding: 1rem;
  overflow-x: auto;
}

.wiki-content pre code {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  color: inherit;
}

.wiki-content strong {
  color: #0f172a;
}

.dark .wiki-content strong {
  color: #f8fafc;
}
`;
}

async function loadHackSources() {
  const entries = await fs.readdir(CONTENT_HACKS_DIR, { withFileTypes: true });
  const hacks = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const folderName = entry.name;
    const dir = path.join(CONTENT_HACKS_DIR, folderName);
    const metaPath = path.join(dir, 'meta.json');

    let meta;
    try {
      meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
    } catch (error) {
      if (error.code === 'ENOENT') continue;
      throw error;
    }

    validateHack(meta, folderName);

    let wikiMarkdown = '';
    try {
      wikiMarkdown = await fs.readFile(path.join(dir, 'wiki.md'), 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    hacks.push(enrichHack({ ...meta, slug: folderName, wikiMarkdown }));
  }

  return hacks.sort((a, b) => a.id - b.id);
}

async function main() {
  const hacks = await loadHackSources();

  await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUTPUT_ASSETS_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_HACKS_DIR, { recursive: true });

  await fs.cp(SITE_ASSETS_SRC_DIR, OUTPUT_ASSETS_DIR, { recursive: true });
  await fs.copyFile(path.join(SITE_SRC_DIR, 'index.html'), path.join(OUTPUT_DIR, 'index.html'));

  await fs.writeFile(path.join(OUTPUT_ASSETS_DIR, 'hacks-data.js'), renderHacksDataJs(hacks), 'utf8');
  await fs.writeFile(path.join(OUTPUT_ASSETS_DIR, 'site.css'), renderSiteCss(), 'utf8');
  await fs.writeFile(path.join(OUTPUT_DIR, '.nojekyll'), '', 'utf8');

  await Promise.all(
    hacks.map(async (hack) => {
      const outDir = path.join(OUTPUT_HACKS_DIR, hack.slug);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, 'index.html'), renderHackPage(hack, hacks), 'utf8');
    }),
  );

  console.log(`Built static site with ${hacks.length} hack pages in docs/`);
}

await main();
