import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const CONTENT_HACKS_DIR = path.join(repoRoot, 'content', 'hacks');

const FAMILY_SETS = {
  editShortcut: new Set([
    'copy-0',
    'paste-1',
    'cut-2',
    'undo-3',
    'redo-4',
    'select-all-5',
    'paste-without-formatting-42',
    'delete-by-word-44',
    'navigate-by-word-45',
    'navigate-to-start-end-46',
  ]),
  browserShortcut: new Set([
    'new-tab-15',
    'new-window-16',
    'reopen-closed-tab-17',
    'chrome-history-18',
    'incognito-mode-19',
    'chrome-quit-20',
    'find-in-page-32',
    'browser-address-bar-69',
  ]),
  finderShortcut: new Set([
    'quick-look-11',
    'rename-file-23',
    'delete-file-24',
    'empty-trash-36',
    'search-current-folder-48',
    'go-to-folder-72',
    'show-hidden-files-94',
  ]),
  captureShortcut: new Set([
    'screenshot-selection-8',
    'screenshot-window-9',
    'screen-recording-hud-43',
    'print-save-pdf-31',
  ]),
  systemShortcut: new Set([
    'spotlight-search-6',
    'force-quit-7',
    'emoji-picker-10',
    'app-expose-12',
    'switch-apps-13',
    'close-window-14',
    'scroll-to-top-bottom-21',
    'dictation-22',
    'lock-screen-25',
    'clear-terminal-49',
    'settings-shortcut-68',
    'spotlight-workflow-predictor-71',
    'volume-fine-tuning-73',
    'brightness-fine-tuning-74',
    'minimize-all-windows-75',
    'slow-motion-animation-76',
    'cycle-windows-same-app-47',
    'access-menu-bar-95',
    'force-restart-96',
  ]),
  terminalTweak: new Set([
    'add-dock-spacers-97',
    'change-screenshot-location-103',
    'change-screenshot-type-81',
    'custom-login-message-115',
    'disable-shadow-104',
    'disable-startup-chime-100',
    'enable-startup-chime-101',
    'hide-desktop-icons-85',
    're-show-desktop-icons-86',
    'remove-screenshot-shadow-82',
    'reset-dock-57',
    'reset-launchpad-105',
  ]),
  terminalUtility: new Set([
    'check-file-size-65',
    'check-uptime-59',
    'download-file-58',
    'flush-dns-110',
    'kill-process-name-67',
    'list-processes-top-90',
    'matrix-screen-saver-83',
    'network-quality-test-84',
    'prevent-sleep-caffeinate-56',
    'purge-ram-98',
    'stress-test-cpu-106',
    'text-to-audio-66',
    'view-icloud-drive-102',
  ]),
  terminalSafety: new Set([
    'gatekeeper-bypass-109',
    'password-protected-zip-91',
    'secure-empty-trash-99',
    'superuser-do-107',
  ]),
  settingsFinder: new Set(['path-bar-51', 'status-bar-52']),
  settingsAccessibility: new Set([
    'live-speech-55',
    'personal-voice-78',
    'three-finger-drag-80',
    'summarize-text-92',
    'text-replacements-35',
  ]),
  settingsFeature: new Set([
    'airplay-receiver-54',
    'do-not-disturb-33',
    'function-keys-53',
    'hot-corners-34',
    'liquid-glass-transparency-79',
    'quick-note-93',
    'silent-click-50',
    'universal-control-77',
    'wifi-password-view-70',
  ]),
  uiFinder: new Set([
    'batch-rename-60',
    'show-clipboard-28',
    'tags-29',
    'smart-folders-87',
    'tahoe-folder-stamps-41',
    'view-hidden-library-108',
  ]),
  uiPreview: new Set(['crop-to-circle-63', 'extract-image-from-pdf-62']),
  uiAdvanced: new Set([
    'bluetooth-details-89',
    'boot-to-safe-mode-112',
    'hardware-info-64',
    'network-utility-114',
    'target-disk-mode-113',
    'wifi-details-88',
  ]),
  uiSystem: new Set([
    'interactive-widgets-26',
    'window-tiling-hover-27',
    'web-apps-in-dock-30',
    'sound-output-select-37',
    'game-mode-38',
    'picture-in-picture-39',
    'rearrange-menu-bar-40',
    'merge-all-windows-61',
    'prevent-app-nap-111',
  ]),
};

const SPECIAL_NOTES = {
  'access-menu-bar-95':
    'Once the menu bar has focus, use the left and right arrow keys to move between menus, the down arrow to open the highlighted menu, Return to activate a command, and Escape to back out.',
  'chrome-quit-20':
    'Chrome delays quitting on purpose so a stray `Cmd + Q` does not wipe out an entire browsing session while you meant to hit `Cmd + W`.',
  'go-to-folder-72':
    'The Go to Folder sheet accepts absolute paths like `/Library`, home-relative shortcuts like `~/Library`, and pasted paths copied from elsewhere.',
  'screen-recording-hud-43':
    'The HUD is where macOS groups screenshots, timed captures, window recording, full-screen recording, and save-location options in one place.',
  'screenshot-window-9':
    'After `Cmd + Shift + 4`, tapping Space turns the crosshair into a camera pointer that snaps to individual windows.',
  'spotlight-search-6':
    'Spotlight is fastest when you treat it like a launcher and command palette rather than a file browser.',
  'settings-shortcut-68':
    'Many Mac apps wire `Cmd + ,` to Settings or Preferences, but it is still an app-level convention rather than a universal system rule.',
  'sound-output-select-37':
    'The Option-click version of the menu skips System Settings and takes you straight to the current output-device list.',
  'target-disk-mode-113':
    'Older Macs expose this as Target Disk Mode. Newer Macs can require a different recovery-based flow, so treat this as a hardware- and macOS-version-dependent feature.',
  'network-utility-114':
    'Apple removed the visible Network Utility app from newer macOS releases, but the underlying network tools still exist through Terminal and system paths.',
  'secure-empty-trash-99':
    'This is primarily historical now. Modern macOS versions removed the old Secure Empty Trash workflow, which is why compatibility matters more here than on most entries.',
  'gatekeeper-bypass-109':
    'If you use this at all, use it as a short-lived exception for a specific trusted app and then restore normal Gatekeeper behavior immediately afterward.',
  'matrix-screen-saver-83':
    'This is a fun Terminal trick rather than a built-in macOS screen saver, so the point is visual flair, not a persistent system preference.',
  'purge-ram-98':
    'macOS normally manages inactive memory on its own, so this is a niche troubleshooting command rather than something you should run out of habit.',
  'stress-test-cpu-106':
    'This is intentionally abusive to the CPU. The only reason to run it is to test thermals, fan behavior, or how a machine reacts under synthetic load.',
  'personal-voice-78':
    'Personal Voice is a setup-heavy feature. It is closer to training a voice model than flipping on a normal accessibility toggle.',
  'universal-control-77':
    'This works best when the nearby devices are already signed in correctly, unlocked, and within the short-range continuity ecosystem Apple expects.',
  'wifi-details-88':
    'The exact fields shown in the expanded Wi-Fi menu can shift across macOS releases, but the pattern stays the same: Option-click reveals the technical view.',
  'bluetooth-details-89':
    'Like the Wi-Fi menu, the Bluetooth diagnostic menu can expose extra technical fields that are not visible in the normal status-bar view.',
};

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function splitLeadSentence(text) {
  const value = String(text || '').trim();
  for (let i = 0; i < value.length; i += 1) {
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

function enrichHack(hack) {
  const slug = hack.slug || `${slugify(hack.title)}-${hack.id}`;
  const method = hack.method || inferMethod(hack);
  const risk = hack.risk || inferRisk(hack);
  return { ...hack, slug, method, risk };
}

function referenceForHack(hack) {
  const { lead } = splitLeadSentence(hack.desc);
  const command = hack.command || extractTerminalCommand(hack.desc);
  const shortcut = hack.shortcut || extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const settingsPath = hack.settingsPath || (lead.includes('>') ? lead : '');

  if (hack.method === 'Terminal' && command) {
    return { label: 'Command', value: command };
  }
  if (hack.method === 'Shortcut' && shortcut) {
    return { label: 'Shortcut', value: shortcut };
  }
  if (hack.method === 'Settings' && settingsPath) {
    return { label: 'Path', value: settingsPath };
  }
  return { label: 'Reference', value: lead || hack.desc };
}

function appsLabel(hack) {
  return (hack.app || []).join(', ') || 'macOS';
}

function stripQuotes(text) {
  return String(text || '')
    .replace(/^['"`]+/, '')
    .replace(/['"`]+$/, '')
    .trim();
}

function actionSentence(hack) {
  const { lead, rest } = splitLeadSentence(hack.desc);
  const raw = rest || lead || hack.desc || '';
  return stripQuotes(raw).replace(/\s+/g, ' ').trim();
}

function familyForHack(hack) {
  for (const [family, slugs] of Object.entries(FAMILY_SETS)) {
    if (slugs.has(hack.slug)) return family;
  }
  return hack.method === 'Terminal'
    ? 'terminalUtility'
    : hack.method === 'Settings'
      ? 'settingsFeature'
      : hack.method === 'Shortcut'
        ? 'systemShortcut'
        : 'uiSystem';
}

function bulletList(items) {
  return items.filter(Boolean).map((item) => `- ${item}`).join('\n');
}

function numberList(items) {
  return items.filter(Boolean).map((item, index) => `${index + 1}. ${item}`).join('\n');
}

function referenceSection(reference) {
  if (!reference?.value) return '';

  if (reference.label === 'Command') {
    return `## Exact command

\`\`\`sh
${reference.value}
\`\`\`
`;
  }

  if (reference.label === 'Path') {
    return `## Where Apple put it

\`${reference.value}\`
`;
  }

  return `## ${reference.label}

\`${reference.value}\`
`;
}

function shortcutDescriptor(reference) {
  return reference?.label === 'Shortcut' ? 'shortcut' : 'keyboard-led action';
}

function compatibilitySection(hack) {
  const lines = [];

  if (hack.tahoe) {
    lines.push('This entry is marked as Tahoe-specific, so do not expect it on older macOS releases.');
  }

  if (hack.compatibility?.macosMin) {
    lines.push(`Minimum version noted by the repo: macOS ${hack.compatibility.macosMin}.`);
  }

  if (hack.compatibility?.macosMax) {
    lines.push(`The repo also marks it as relevant only through macOS ${hack.compatibility.macosMax}.`);
  }

  if (hack.compatibility?.notes) {
    lines.push(hack.compatibility.notes.trim());
  }

  if (lines.length === 0) return '';

  return `## Compatibility notes

${bulletList(lines)}
`;
}

function extraNoteSection(hack) {
  const note = SPECIAL_NOTES[hack.slug];
  if (!note) return '';

  return `## Good to know

${note}
`;
}

function baseShortcutSteps(hack, reference) {
  const selectionNeeded = /(select|selection|selected|file|text|item)/i.test(hack.desc);
  const interactionStep =
    reference?.label === 'Shortcut'
      ? `Press \`${reference.value}\`.`
      : /^Type\s+/i.test(reference?.value || '')
        ? `Type ${String(reference.value).replace(/^Type\s+/i, '').trim()}.`
        : reference?.value
          ? `Use the interaction described by the hack: ${reference.value}.`
          : 'Trigger the shortcut or interaction.';
  return [
    `Open ${appsLabel(hack)} or put focus on the window where you want the action to happen.`,
    selectionNeeded
      ? 'Select the text, file, object, or field the shortcut should act on.'
      : 'Make sure the right window or control is focused before pressing the keys.',
    interactionStep,
    `Confirm the result: ${actionSentence(hack)}`,
  ];
}

function baseTerminalSteps(hack, reference) {
  return [
    'Open Terminal.',
    reference?.value ? `Paste or type \`${reference.value}\`.` : 'Enter the command carefully.',
    hack.risk === 'High'
      ? 'Read the full command one more time before pressing Return.'
      : 'Press Return to run it.',
    `Check the outcome described by the hack: ${actionSentence(hack)}`,
  ];
}

function baseSettingsSteps(hack, reference) {
  return [
    'Open System Settings.',
    reference?.value
      ? `Navigate to \`${reference.value}\`, or use Settings search to jump there faster.`
      : 'Use Settings search to find the relevant toggle or panel.',
    'Change the option deliberately and note the original value first if you might want to revert it later.',
    `Check that the behavior now matches the hack: ${actionSentence(hack)}`,
  ];
}

function writeEditShortcut(hack) {
  const reference = referenceForHack(hack);
  const title = hack.title.toLowerCase();

  let focus = 'These are direct editing commands, so they matter most when the correct text field, document, or selection is already active.';
  let useCases = [
    'working quickly inside notes, documents, chat boxes, code editors, or Finder lists',
    'staying on the keyboard instead of breaking rhythm to use the Edit menu',
    'repeating a tiny action many times in a row without thinking about it',
  ];
  let watch = [
    'If the wrong thing is selected, the shortcut will act on the wrong thing immediately.',
    'The exact behavior can still vary a bit across apps, especially for rich text, files, and custom editors.',
  ];

  if (/(copy|paste|cut)/.test(title)) {
    focus =
      'Clipboard shortcuts are the basic transport layer of everyday Mac work. They are how text, images, files, and small pieces of context move between apps.';
    watch.push('Cut is not a universal file-moving shortcut in Finder, so do not assume Windows-style behavior everywhere.');
  } else if (/(undo|redo)/.test(title)) {
    focus =
      'Undo and redo are what make experimentation cheap. You can try something, inspect the result, and step backward or forward without manually rebuilding your work.';
    useCases = [
      'editing text, moving files, or changing formatting when you want a fast recovery path',
      'testing an action to see what it changes before you commit to it',
      'walking backward through a short chain of recent actions',
    ];
    watch.push('Undo history depth is app-specific, so older actions may fall off sooner than you expect.');
  } else if (/select all/.test(title)) {
    focus =
      'Select All is mostly about scope. It is the fastest way to say "the next action should apply to everything currently visible in this context."';
    watch.push('In large folders or long documents, selecting everything can make the next destructive action much bigger than intended.');
  } else if (/(delete by word|navigate by word|navigate to start\/end)/.test(title)) {
    focus =
      'These are text-navigation shortcuts. They save time because they operate at the level of words or lines instead of forcing you to move character by character.';
    useCases = [
      'editing prose or code when your hands are already on the keyboard',
      'rewriting or cleaning up text without reaching for the pointer',
      'moving through a line or removing chunks of text faster than backspacing one character at a time',
    ];
    watch.push('They only make sense in fields or editors that actually have text focus.');
  }

  return `## What it does

${hack.title} is a keyboard editing ${shortcutDescriptor(reference)} for ${appsLabel(hack)}. ${actionSentence(hack)} ${focus}

${referenceSection(reference)}
## How to use it

${numberList(baseShortcutSteps(hack, reference))}

## Where it earns its keep

${bulletList(useCases.map((item) => `Use it when you are ${item}.`))}

## What to watch for

${bulletList(watch)}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeBrowserShortcut(hack) {
  const reference = referenceForHack(hack);
  const title = hack.title.toLowerCase();

  let angle =
    'Browser shortcuts are most valuable when you are juggling tabs, links, search terms, and reading context faster than the pointer can keep up.';
  let watch = [
    'Make sure the browser window itself is focused; the same keys can do something else inside web apps or form fields.',
    'Some browser shortcuts are shared between Chrome and Safari, but not every tab or window behavior is identical.',
  ];

  if (/incognito/.test(title)) {
    angle =
      'This is about opening a private browsing session quickly, not about becoming invisible online. It changes local history behavior, not the wider network.';
  } else if (/history/.test(title)) {
    angle =
      'History shortcuts are less about nostalgia and more about recovery: finding a page you saw earlier, retracing research, or reopening something you forgot to bookmark.';
  } else if (/reopen closed tab/.test(title)) {
    angle =
      'This is a recovery shortcut. It saves you from rebuilding a tab you closed by habit or by mistake, especially in the middle of research or shopping.';
  } else if (/address bar/.test(title)) {
    angle =
      'The address bar shortcut is one of the quickest ways to pivot from reading to navigating. It puts the URL field under your hands immediately so you can paste, search, or replace the current location.';
  } else if (/quit/.test(title)) {
    watch.push('Chrome intentionally adds friction here, so do not expect an instant quit on the first accidental tap.');
  }

  return `## In the browser

${hack.title} is a browser-focused ${shortcutDescriptor(reference)} for ${appsLabel(hack)}. ${actionSentence(hack)} ${angle}

${referenceSection(reference)}
## Fast workflow

${numberList(baseShortcutSteps(hack, reference))}

## Good times to use it

${bulletList([
  'when several tabs or windows are open and you want the browser to respond immediately',
  'when you are researching, comparing pages, or recovering something you just closed',
  'when the browser menu has the action but reaching for it would break your flow',
])}

## Limits and gotchas

${bulletList(watch)}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeFinderShortcut(hack) {
  const reference = referenceForHack(hack);

  return `## In Finder

${hack.title} is a Finder ${shortcutDescriptor(reference)} for ${appsLabel(hack)}. ${actionSentence(hack)} The value here is speed inside an already-open file workflow: picking the right item, triggering the command, and moving on without navigating extra menus.

${referenceSection(reference)}
## How to use it

${numberList(baseShortcutSteps(hack, reference))}

## Why people keep this one

${bulletList([
  'It cuts down on extra clicks in file-heavy workflows.',
  'It works well when you already know which file or folder you want to act on.',
  'It helps keep Finder feeling like a fast browser for files instead of a slow control panel.',
])}

## Things to watch

${bulletList([
  'Most Finder shortcuts operate on the currently highlighted item or the currently active Finder window, so selection matters.',
  'If you trigger the shortcut from the wrong app, nothing useful will happen because the command is Finder-specific.',
  'Hidden files, deep paths, and renamed items can still behave differently from normal visible documents, so verify the target before committing.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeCaptureShortcut(hack) {
  const reference = referenceForHack(hack);

  return `## What it captures

${hack.title} is a capture ${shortcutDescriptor(reference)} for ${appsLabel(hack)}. ${actionSentence(hack)} These shortcuts matter because macOS screenshot and print tools are already good; the real trick is learning the exact gesture that gets the right output the first time.

${referenceSection(reference)}
## Capture flow

${numberList(baseShortcutSteps(hack, reference))}

## Why it is worth remembering

${bulletList([
  'It is faster than opening a separate capture app or moving screenshots around afterward.',
  'It helps when you are documenting a bug, sending visual context, or archiving something that is only visible on screen for a moment.',
  'It reduces the amount of cleanup needed after the capture because you are choosing the right mode up front.',
])}

## Practical caveats

${bulletList([
  'Make sure you are using the right capture mode before you start dragging or clicking.',
  'The save location, file format, and shadow behavior can change if you have already customized macOS screenshot defaults.',
  'Timed captures, recording, and PDF export each solve a slightly different problem, so use the mode that matches the output you actually need.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeSystemShortcut(hack) {
  const reference = referenceForHack(hack);

  return `## What it controls

${hack.title} is a system-level ${shortcutDescriptor(reference)} for ${appsLabel(hack)}. ${actionSentence(hack)} Unlike a document-editing shortcut, this kind of command usually changes focus, window state, or a macOS control surface right away, so you feel the result immediately.

${referenceSection(reference)}
## How to trigger it

${numberList(baseShortcutSteps(hack, reference))}

## When it helps

${bulletList([
  'when you want a system action immediately and do not want to search for it with the pointer',
  'when you are switching contexts quickly between apps, windows, or built-in macOS controls',
  'when the command is easy to forget, but very effective once it becomes muscle memory',
])}

## Things to know

${bulletList([
  'Function-key-based shortcuts can behave differently if your keyboard is set to prefer media keys, which is why some Macs need `Fn` in the mix.',
  'Window-management shortcuts depend on the focused app and the currently active window, so context still matters.',
  hack.risk === 'High'
    ? 'This one is high risk compared with ordinary shortcuts, so do not treat it as a casual key combo.'
    : 'If nothing happens, verify focus first; most failures here are about context, not broken keys.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function terminalOutro(hack) {
  if (hack.undoCommand) {
    return `## Undo or revert

- Run \`${hack.undoCommand}\` if you want to reverse the change.
- Reopen the affected app or service after reverting if the result is not immediate.
`;
  }

  if (hack.risk === 'High') {
    return `## Undo or revert

- Treat this as something you understand before you run it, because the rollback path may be limited or manual.
- If the hack affects a system preference, reapply the opposite setting or return the system to its previous state as directly as possible.
`;
  }

  return `## Undo or exit

- If the command changes a preference, revert the same preference directly.
- If it only runs for the current session, stop the process or close Terminal when you are done.
`;
}

function writeTerminalTweak(hack) {
  const reference = referenceForHack(hack);
  const settingsLike = /defaults write/.test(reference.value || hack.command || hack.desc || '');

  return `## What the command changes

${hack.title} is a Terminal tweak for ${appsLabel(hack)}. ${actionSentence(hack)} This family of commands is useful because it changes a preference or system behavior directly, without requiring you to hunt for a visible toggle in the interface.

${referenceSection(reference)}
## Safe way to run it

${numberList(baseTerminalSteps(hack, reference))}

## What changes afterward

${settingsLike
    ? 'Commands built around `defaults write` usually change a stored preference. That means the effect can persist across app relaunches and future sessions until you reverse it.'
    : 'This command changes behavior at the system or app level, so the result can outlast the Terminal window you used to trigger it.'}

${hack.risk === 'High'
    ? 'Because this tweak crosses into higher-risk territory, read the full command carefully and know how you would restore the old behavior before you press Return.'
    : 'Most of these tweaks are not dangerous by themselves, but they are easy to forget later, which is why it helps to keep the undo path close by.'}

## What to watch for

${bulletList([
  'If the command includes `killall`, the named app or service will restart as part of the change.',
  'Preference tweaks can appear to do nothing until the affected app or service is reopened.',
  hack.risk === 'High'
    ? 'Do not run a privileged tweak casually just because it is short.'
    : 'Small cosmetic or workflow tweaks can still be confusing later if you forget that you changed the default.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}${terminalOutro(hack)}`;
}

function writeTerminalUtility(hack) {
  const reference = referenceForHack(hack);

  return `## What it does

${hack.title} is a Terminal utility command for ${appsLabel(hack)}. ${actionSentence(hack)} Unlike a persistent tweak, the point here is usually to inspect something, run a one-off action, or create a result on demand and then move on.

${referenceSection(reference)}
## Running it

${numberList(baseTerminalSteps(hack, reference))}

## Why it is useful

${bulletList([
  'It is often faster than clicking through multiple panels to get the same answer or result.',
  'It gives you an exact command you can repeat later, document, or paste into notes for the same task.',
  'It is a good fit for diagnostics, quick exports, simple downloads, or targeted process control.',
])}

## Read the result carefully

${bulletList([
  'Terminal commands usually tell you what happened in plain output, so read the response instead of guessing.',
  'If the hack is only meant for the current session, closing the process or stopping the command is part of normal use.',
  hack.risk === 'High'
    ? 'If this one pushes hardware or system state, treat it as deliberate testing rather than normal daily workflow.'
    : 'If nothing seems to change, confirm you ran the command in the intended directory, shell, or context.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}${terminalOutro(hack)}`;
}

function writeTerminalSafety(hack) {
  const reference = referenceForHack(hack);

  return `## What this command does

${hack.title} is a higher-risk Terminal hack for ${appsLabel(hack)}. ${actionSentence(hack)} The convenience can be real, but the main question here is not "can I run it?" so much as "do I fully understand why I am running it and how I will back out afterward?"

${referenceSection(reference)}
## Before you run it

${numberList([
  'Open Terminal in an admin-capable account if the command needs elevated privileges.',
  reference?.value ? `Read \`${reference.value}\` from left to right and make sure every flag still matches your intent.` : 'Read the command carefully before you run it.',
  'Know what success looks like before you press Return.',
  'Know what the rollback step is before you rely on the result.',
])}

## When it is actually justified

${bulletList([
  'when the built-in macOS UI does not expose the behavior you need directly',
  'when you have a concrete reason for the change rather than vague curiosity',
  'when you are comfortable restoring the old state immediately after the special case is over',
])}

## Main risks

${bulletList([
  'Security-sensitive or destructive commands are easy to run faster than you can think through their consequences.',
  'A short command can still alter system-wide behavior in ways that outlive the immediate task.',
  'Compatibility matters more here than on ordinary shortcuts, because Apple changes or removes some of these behaviors across releases.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}${terminalOutro(hack)}`;
}

function writeSettingsFinder(hack) {
  const reference = referenceForHack(hack);

  return `## What this changes in Finder

${hack.title} is a Finder presentation setting for ${appsLabel(hack)}. ${actionSentence(hack)} These settings are small, but they matter because Finder is an always-open part of the system; one useful visibility tweak pays off every time you browse files afterward.

${referenceSection(reference)}
## Turn it on

${numberList(baseSettingsSteps(hack, reference))}

## Why people keep it enabled

${bulletList([
  'It makes file navigation more legible without changing your folder structure.',
  'It reduces the amount of guessing while browsing nested folders or checking available space.',
  'It is the sort of Finder tweak that becomes invisible in the best way once it is on.',
])}

## When to turn it back off

${bulletList([
  'If you prefer a cleaner Finder window with less footer information, this is easy to undo.',
  'If the extra interface chrome feels noisy on a small display, that is a reasonable reason to disable it again.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeSettingsAccessibility(hack) {
  const reference = referenceForHack(hack);

  return `## What enabling it changes

${hack.title} is an accessibility-leaning setting for ${appsLabel(hack)}. ${actionSentence(hack)} Even when the feature was designed with accessibility in mind, it can still be broadly useful because it reduces friction, mechanical effort, or communication overhead.

${referenceSection(reference)}
## Turning it on

${numberList(baseSettingsSteps(hack, reference))}

## Good reasons to use it

${bulletList([
  'when a repeated physical action is uncomfortable or slower than it should be',
  'when speech, typing, or pointer input needs a built-in assistive fallback',
  'when a feature intended for accessibility also turns out to be a solid productivity improvement',
])}

## Things to watch

${bulletList([
  'Some accessibility features require extra setup time before they become useful in daily work.',
  'Voice, gesture, and speech features can depend on hardware quality, environment noise, and permissions.',
  'If the behavior feels odd at first, give yourself a few repetitions before deciding whether it belongs in your workflow.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeSettingsFeature(hack) {
  const reference = referenceForHack(hack);

  return `## What this setting does

${hack.title} is a settings-driven feature for ${appsLabel(hack)}. ${actionSentence(hack)} The value here is persistence: you change the system once, and the new behavior stays available in later sessions until you change it back.

${referenceSection(reference)}
## How to enable it

${numberList(baseSettingsSteps(hack, reference))}

## When it is worth turning on

${bulletList([
  'when you want the behavior often enough that a one-time settings change beats a repeated manual workaround',
  'when the feature matches how you actually use the Mac rather than how Apple expects a default user to work',
  'when you are willing to live with the new behavior as an ongoing preference instead of a one-off experiment',
])}

## What to keep in mind

${bulletList([
  'Settings locations can shift across macOS releases even when the feature survives.',
  'Persistent toggles are easy to forget later, so it helps to remember the panel where you enabled them.',
  'If the feature interacts with nearby devices, accounts, or continuity services, those surrounding conditions still matter.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeUiFinder(hack) {
  const reference = referenceForHack(hack);

  return `## What it is

${hack.title} is a Finder-side workflow trick for ${appsLabel(hack)}. ${actionSentence(hack)} These are not deep system hacks so much as features hiding in plain sight, and the main win is knowing that Finder can already do more than many people assume.

${referenceSection(reference)}
## How to use it

${numberList([
  `Open ${appsLabel(hack)} and go to the file or folder context where the feature makes sense.`,
  reference?.value ? `Use the relevant menu path or interaction: ${reference.value}.` : 'Trigger the Finder interaction described by the hack.',
  `Confirm the result: ${actionSentence(hack)}`,
  'Repeat it once or twice so you remember where Apple hid it.',
])}

## Why it is useful

${bulletList([
  'It keeps more of your file-management workflow inside Finder instead of pushing you to separate utilities.',
  'It helps when the same organization or search task comes up repeatedly.',
  'It turns a hidden capability into something you can deliberately reach for again later.',
])}

## Limits

${bulletList([
  'These features still depend on the current Finder window, selection, or search context.',
  'Some Finder tools look obvious only after you have seen them once; until then they are easy to miss.',
  'Folder metadata, tags, and smart views are only useful if you keep using them consistently.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeUiPreview(hack) {
  const reference = referenceForHack(hack);

  return `## What it does in Preview

${hack.title} is a Preview trick for ${appsLabel(hack)}. ${actionSentence(hack)} Preview has a lot of lightweight image and PDF editing power, and hacks like this are useful precisely because they save you from opening a heavier editor for a small job.

${referenceSection(reference)}
## How to do it

${numberList([
  'Open the image or PDF in Preview.',
  reference?.value ? `Use the relevant Preview control or path: ${reference.value}.` : 'Use the Preview tools described by the hack.',
  'Make the selection or shape deliberately so the result is clean before you commit.',
  `Confirm the result: ${actionSentence(hack)}`,
])}

## Good use cases

${bulletList([
  'quick one-off edits, exports, crops, or visual extractions',
  'making a usable asset without opening Photoshop or another heavier tool',
  'cleaning up a screenshot or PDF fragment just enough for sharing',
])}

## Caveats

${bulletList([
  'Preview is great for light edits, but it is not a substitute for a full image editor when precision really matters.',
  'Selections and crops only feel fast when you take a moment to place them accurately the first time.',
  'If the source PDF or image is low quality, Preview cannot invent detail that is not there.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeUiAdvanced(hack) {
  const reference = referenceForHack(hack);

  return `## What it does

${hack.title} is an advanced system feature or diagnostic view for ${appsLabel(hack)}. ${actionSentence(hack)} These entries are useful because they surface deeper system information or boot-time behavior that ordinary settings screens do not expose directly.

${referenceSection(reference)}
## Before you use it

${bulletList([
  'Read the full description once before trying it; advanced system workflows are less forgiving than everyday shortcuts.',
  'If external hardware or another Mac is involved, set that up first instead of improvising halfway through.',
  'If you are troubleshooting, decide what question you are trying to answer before you trigger the feature.',
])}

## How it usually works

${numberList([
  `Start from the relevant system context for ${appsLabel(hack)}.`,
  reference?.value ? `Use the documented interaction or entry point: ${reference.value}.` : 'Trigger the advanced system behavior described by the hack.',
  `Look for the expected result: ${actionSentence(hack)}`,
  'Exit cleanly once you have the information or behavior you needed.',
])}

## Limits and safety

${bulletList([
  'Advanced system features can vary significantly by Mac model and macOS version.',
  'Diagnostic menus often reveal extra data, but they do not automatically fix the underlying problem.',
  hack.risk === 'High'
    ? 'If the feature changes boot or hardware behavior, treat it as a controlled action rather than something to test casually.'
    : 'Use the extra information to guide the next decision, not just to admire the menu.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function writeUiSystem(hack) {
  const reference = referenceForHack(hack);

  return `## What it is

${hack.title} is a system workflow trick for ${appsLabel(hack)}. ${actionSentence(hack)} The power here is usually in knowing where the feature lives and when it is faster than the obvious click-heavy path.

${referenceSection(reference)}
## How to use it

${numberList([
  `Go to the relevant app, window, menu, or desktop context for ${appsLabel(hack)}.`,
  reference?.value ? `Use the interaction described by the hack: ${reference.value}.` : 'Trigger the UI interaction described by the hack.',
  `Confirm the result: ${actionSentence(hack)}`,
  'Repeat the flow once so the feature is easier to find again later.',
])}

## Why people use it

${bulletList([
  'It saves time by avoiding a longer trip through Settings or menus.',
  'It exposes a built-in feature many people never notice until someone points it out.',
  'It makes a specific repeated task feel more native and less improvised.',
])}

## Caveats

${bulletList([
  'UI-driven tricks can move around a little between macOS releases even when the feature survives.',
  'These hacks depend heavily on being in the right context before you try them.',
  'If the feature is not where you expect, search the menu bar or the relevant settings panel before assuming it was removed.',
])}

${extraNoteSection(hack)}${compatibilitySection(hack)}`;
}

function buildWikiMarkdown(hack) {
  const family = familyForHack(hack);

  switch (family) {
    case 'editShortcut':
      return writeEditShortcut(hack);
    case 'browserShortcut':
      return writeBrowserShortcut(hack);
    case 'finderShortcut':
      return writeFinderShortcut(hack);
    case 'captureShortcut':
      return writeCaptureShortcut(hack);
    case 'systemShortcut':
      return writeSystemShortcut(hack);
    case 'terminalTweak':
      return writeTerminalTweak(hack);
    case 'terminalUtility':
      return writeTerminalUtility(hack);
    case 'terminalSafety':
      return writeTerminalSafety(hack);
    case 'settingsFinder':
      return writeSettingsFinder(hack);
    case 'settingsAccessibility':
      return writeSettingsAccessibility(hack);
    case 'settingsFeature':
      return writeSettingsFeature(hack);
    case 'uiFinder':
      return writeUiFinder(hack);
    case 'uiPreview':
      return writeUiPreview(hack);
    case 'uiAdvanced':
      return writeUiAdvanced(hack);
    case 'uiSystem':
    default:
      return writeUiSystem(hack);
  }
}

async function main() {
  const entries = await fs.readdir(CONTENT_HACKS_DIR, { withFileTypes: true });
  let written = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dir = path.join(CONTENT_HACKS_DIR, entry.name);
    const metaPath = path.join(dir, 'meta.json');
    const meta = JSON.parse(await fs.readFile(metaPath, 'utf8'));
    const hack = enrichHack(meta);
    const wikiPath = path.join(dir, 'wiki.md');

    await fs.writeFile(wikiPath, `${buildWikiMarkdown(hack).trim()}\n`, 'utf8');
    written += 1;
  }

  console.log(`Wrote wiki.md for ${written} hacks`);
}

await main();
