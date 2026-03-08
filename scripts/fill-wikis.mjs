import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const CONTENT_HACKS_DIR = path.join(repoRoot, 'content', 'hacks');

const TOPIC_USE_CASES = {
  Clipboard: [
    'moving text between notes, chat, mail, and documents without breaking your flow',
    'duplicating files or snippets before making edits',
    'collecting research from multiple windows into one place',
  ],
  'Finder & Files': [
    'sorting, renaming, or previewing files faster in Finder',
    'cleaning up folders without opening extra windows',
    'moving through file-heavy workflows with less clicking',
  ],
  'Browsers & Web': [
    'managing tabs and windows while researching or comparing pages',
    'switching web context quickly without leaving the keyboard',
    'keeping browsing tasks light and repeatable',
  ],
  'Window Management': [
    'moving quickly between apps, windows, and layouts',
    'reducing context-switching friction during multitasking',
    'keeping the desktop readable while several apps are open',
  ],
  'Screenshots & Media': [
    'capturing visual context for notes, bug reports, or tutorials',
    'sharing exactly what is on screen without extra editing',
    'working with screenshots, recordings, or media previews more deliberately',
  ],
  'System Settings': [
    'changing a persistent macOS behavior instead of a one-time action',
    'tuning the system so it matches how you actually work',
    'making a preference easier to reach or easier to live with every day',
  ],
  Terminal: [
    'making a system-level change faster than digging through the interface',
    'repeating an advanced action exactly and consistently',
    'working on troubleshooting or customization tasks that are easier in Terminal',
  ],
  'Security & Privacy': [
    'tightening or loosening a security control for a specific reason',
    'handling a trust-sensitive task more deliberately',
    'understanding the tradeoff between convenience and protection',
  ],
  Performance: [
    'squeezing more responsiveness out of a busy machine',
    'diagnosing a slowdown before restarting everything',
    'reducing resource overhead during heavy work',
  ],
  Networking: [
    'checking or fixing connectivity problems with less guesswork',
    'getting better visibility into Wi-Fi, Bluetooth, or DNS behavior',
    'making network troubleshooting more repeatable',
  ],
  Accessibility: [
    'removing friction from typing, speech, or input',
    'making the Mac easier to operate for longer sessions',
    'using built-in assistive tools instead of third-party utilities',
  ],
  Customization: [
    'making macOS feel more intentional and personal',
    'changing a default that annoys you every day',
    'matching the system to your preferences instead of the other way around',
  ],
  Troubleshooting: [
    'recovering from a stuck or confusing system state',
    'resetting behavior that is no longer acting as expected',
    'getting to a known-good baseline before deeper debugging',
  ],
  General: [
    'removing a small but frequent point of friction',
    'building muscle memory for a task you repeat often',
    'learning a reliable macOS behavior that pays off over time',
  ],
};

const TOPIC_EXPLANATIONS = {
  Clipboard:
    'Clipboard actions compound over time because copying and pasting sit in the middle of writing, research, file management, and communication.',
  'Finder & Files':
    'File-management tricks matter because they save time every time you sort, rename, move, preview, or recover something in Finder.',
  'Browsers & Web':
    'Browser-oriented tricks are valuable because web work tends to involve constant tab churn, repeated searches, and frequent context switching.',
  'Window Management':
    'Window-management tricks are worthwhile because they reduce the cost of multitasking instead of asking you to open fewer things.',
  'Screenshots & Media':
    'Media and capture tricks are useful because visual communication usually benefits from speed, precision, and repeatability.',
  'System Settings':
    'Settings changes have outsized impact because one careful adjustment can improve every future session on the same Mac.',
  Terminal:
    'Terminal-based tricks matter because they make advanced behavior explicit, repeatable, and easier to document.',
  'Security & Privacy':
    'Security-oriented changes deserve more explanation because the convenience gain is only worth it when you understand the tradeoff.',
  Performance:
    'Performance tweaks are most helpful when they change how the machine feels during real work, not just during synthetic tests.',
  Networking:
    'Networking tricks help because connectivity problems are hard to reason about unless you can check one thing at a time.',
  Accessibility:
    'Accessibility features often help everyone, not just edge cases, because they reduce mechanical effort and cognitive overhead.',
  Customization:
    'Customization matters because the defaults are fine for many people, but the best setup is still the one that disappears into your workflow.',
  Troubleshooting:
    'Troubleshooting tricks are valuable because they shorten the path from confusion to a stable, testable state.',
  General:
    'General-purpose hacks are often worth learning because they remove a little friction from a lot of otherwise ordinary work.',
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

function appsLabel(hack) {
  return (hack.app || []).join(', ') || 'macOS';
}

function referenceForHack(hack) {
  const { lead } = splitLeadSentence(hack.desc);
  const command = hack.command || extractTerminalCommand(hack.desc);
  const shortcut = hack.shortcut || extractKeyCombo(hack.desc) || extractKeyCombo(lead);
  const settingsPath = hack.settingsPath || (lead.includes('>') ? lead : '');

  if (hack.method === 'Terminal' && command) {
    return { label: 'command', value: command };
  }
  if (hack.method === 'Shortcut' && shortcut) {
    return { label: 'shortcut', value: shortcut };
  }
  if (hack.method === 'Settings' && settingsPath) {
    return { label: 'settings path', value: settingsPath };
  }
  return { label: 'reference', value: lead || hack.desc };
}

function parseExistingSections(markdown) {
  const sections = new Map();
  let current = null;
  for (const rawLine of String(markdown || '').split('\n')) {
    const line = rawLine.trimEnd();
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      current = heading[1].trim().toLowerCase();
      sections.set(current, []);
      continue;
    }
    if (!current) continue;
    sections.get(current).push(line);
  }
  return sections;
}

function sectionItems(sections, names) {
  for (const name of names) {
    const lines = sections.get(name);
    if (!lines) continue;
    const items = lines
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[-*]\s+/, '').replace(/^\d+\.\s+/, '').trim())
      .filter(Boolean);
    if (items.length > 0) return items;
  }
  return [];
}

function unique(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function buildUseCases(hack) {
  const items = [];
  for (const topic of hack.topics || []) {
    items.push(...(TOPIC_USE_CASES[topic] || []));
  }
  if (hack.method === 'Shortcut') {
    items.push('keeping your hands on the keyboard instead of reaching for menus');
  }
  if (hack.method === 'Terminal') {
    items.push('making the same system change consistently on demand');
  }
  if (hack.method === 'Settings') {
    items.push('changing a behavior once and benefiting from it every future session');
  }
  return unique(items).slice(0, 4);
}

function buildPrerequisites(hack, existingPrereqs) {
  if (existingPrereqs.length > 0) return existingPrereqs;

  const items = [];
  if (hack.compatibility?.macosMin) items.push(`Use macOS ${hack.compatibility.macosMin} or later.`);
  if (hack.compatibility?.macosMax) items.push(`Treat this as an older-macOS technique; it may not exist after macOS ${hack.compatibility.macosMax}.`);
  if (hack.tahoe) items.push('This feature is tied to macOS Tahoe or later.');
  if (hack.method === 'Terminal') items.push('Open Terminal and read the command fully before running it.');
  if (hack.method === 'Terminal' && referenceForHack(hack).value.includes('sudo')) {
    items.push('Be ready to enter an administrator password.');
  }
  if (hack.method === 'Shortcut') items.push('Make sure the correct app, window, or field is focused first.');
  if (hack.method === 'Shortcut' && /(select|selection|selected|file|text|item)/i.test(hack.desc)) {
    items.push('Have the right text, file, or item selected before pressing the shortcut.');
  }
  if (hack.method === 'Settings') items.push('You need access to System Settings and permission to change the setting on this Mac.');
  if (items.length === 0) items.push('No special setup is usually required beyond being in the right app or context.');
  return unique(items).slice(0, 4);
}

function buildSteps(hack, existingSteps) {
  if (existingSteps.length > 0) return existingSteps;

  const { lead, rest } = splitLeadSentence(hack.desc);
  const reference = referenceForHack(hack);

  if (hack.method === 'Terminal') {
    return [
      'Open Terminal.',
      reference.value ? `Paste or type \`${reference.value}\`.` : 'Enter the relevant command.',
      'Review the command one more time before pressing Return.',
      'If the command changes a setting, reopen the affected app or service if needed.',
      'Confirm the result before you move on to other work.',
    ];
  }

  if (hack.method === 'Shortcut') {
    return [
      'Open the app or window where you want the action to happen.',
      /(select|selection|selected|file|text|item)/i.test(hack.desc)
        ? 'Select the text, file, or object the shortcut should act on.'
        : 'Put the cursor or focus in the place where the shortcut should act.',
      reference.value ? `Press \`${reference.value}\`.` : 'Trigger the shortcut.',
      rest ? `Look for the expected result: ${rest}` : 'Watch for the expected result.',
      'Repeat it a few times so the motion becomes automatic.',
    ];
  }

  if (hack.method === 'Settings') {
    return [
      'Open System Settings.',
      reference.value ? `Navigate to \`${reference.value}\`, or search for the relevant setting.` : 'Search for the relevant setting or panel.',
      'Change the option deliberately and note the original value before you leave.',
      'Close the panel or reopen the affected app if the change is not immediate.',
      'Confirm that the behavior now matches what you expected.',
    ];
  }

  return unique([
    lead || 'Open the relevant app or part of the system.',
    rest || 'Perform the interaction described above.',
    'Watch for the expected behavior change.',
    'Repeat the sequence once or twice until it feels predictable.',
  ]);
}

function buildVerify(hack, existingVerify) {
  if (existingVerify.length > 0) return existingVerify;

  const items = [];
  if (hack.method === 'Terminal') {
    items.push('The command should finish without an obvious error message.');
    items.push('The affected app or service should reflect the change afterward.');
  } else if (hack.method === 'Shortcut') {
    items.push('The action should happen immediately when you press the shortcut.');
    items.push('If nothing happens, check focus and selection first.');
  } else if (hack.method === 'Settings') {
    items.push('The setting should stay in the state you selected.');
    items.push('The system or app should start behaving differently in the expected way.');
  } else {
    items.push('You should see the exact UI result described by the hack.');
  }
  return items;
}

function buildUndo(hack, existingUndo) {
  if (existingUndo.length > 0) return existingUndo;

  if (hack.undoCommand) {
    return [`Run \`${hack.undoCommand}\` to reverse the change.`];
  }
  if (hack.method === 'Settings') {
    return [
      'Return to the same System Settings panel.',
      'Switch the setting back to its previous value.',
    ];
  }
  if (hack.method === 'Terminal' && /defaults write/i.test(hack.command || hack.desc || '')) {
    return [
      'Use the matching `defaults delete` or opposite `defaults write` command.',
      'Restart the affected app or service after reverting the setting.',
    ];
  }
  if (/secure|force restart|empty trash|delete/i.test(`${hack.title} ${hack.desc}`) && hack.risk === 'High') {
    return [
      'There may be no clean undo, so treat the action as intentional before you run it.',
      'If recovery matters, rely on backups, snapshots, or an app-specific recovery path.',
    ];
  }
  if (hack.method === 'Shortcut') {
    return [
      'Repeat the opposite action if one exists, or use the app\'s normal Undo command.',
      'If the shortcut only reveals a view or menu, dismiss it and continue working.',
    ];
  }
  return ['Reverse the same action manually if you no longer want the result.'];
}

function buildMistakes(hack) {
  const items = [];

  if (hack.method === 'Shortcut') {
    items.push('Pressing the shortcut while the wrong window is focused.');
    items.push('Forgetting to select the text, file, or object first when the action needs a target.');
    items.push('Assuming every app handles the shortcut identically.');
  } else if (hack.method === 'Terminal') {
    items.push('Running the command before reading it carefully.');
    items.push('Expecting an instant visual change without reopening the affected app or service.');
    items.push('Using `sudo` casually instead of treating it as a privileged action.');
  } else if (hack.method === 'Settings') {
    items.push('Changing the wrong toggle because a nearby option sounds similar.');
    items.push('Forgetting the original value, which makes reverting harder later.');
    items.push('Assuming the setting exists in exactly the same place on every macOS version.');
  } else {
    items.push('Trying the interaction in the wrong app or part of the system.');
    items.push('Expecting the UI to look identical in every macOS release.');
    items.push('Skipping the final check and assuming the action worked.');
  }

  if (hack.risk === 'High') {
    items.push('Treating a high-risk change as if it were only a cosmetic preference.');
  }

  return unique(items).slice(0, 4);
}

function buildTroubleshooting(hack, existingTips, existingTroubleshooting) {
  const items = [...existingTips, ...existingTroubleshooting];
  if (items.length > 0) return unique(items).slice(0, 5);

  if (hack.method === 'Shortcut') {
    return [
      'Check the app menu to confirm the shortcut and the exact action name.',
      'Try the same shortcut in another app to rule out an app-specific override.',
      'If the action depends on a selection, recreate the selection and try again.',
    ];
  }

  if (hack.method === 'Terminal') {
    return [
      'Read the terminal output carefully instead of guessing what failed.',
      'If the command needs admin rights, confirm you are using the correct account.',
      'If the setting seems unchanged, reopen the relevant app or service and test again.',
    ];
  }

  if (hack.method === 'Settings') {
    return [
      'Use System Settings search if you cannot find the panel quickly.',
      'If the option is missing, check whether your macOS version or device policy changed it.',
      'Log out, restart the app, or reboot if the behavior seems stuck.',
    ];
  }

  return [
    'Repeat the steps slowly once from the beginning.',
    'Check whether the feature depends on a specific app, selection, or system state.',
    'If the behavior still feels wrong, restart the relevant app and test again.',
  ];
}

function buildMethodParagraph(hack, reference) {
  if (hack.method === 'Shortcut') {
    return `The important thing to understand about a shortcut like ${hack.title} is context. The keyboard combination \`${reference.value}\` is fast because it bypasses the menu bar, but it still acts on whatever is currently focused. That means the most reliable way to use it is to slow down for one second, confirm that the right app or selection is active, and then press the keys as one deliberate motion.`;
  }

  if (hack.method === 'Terminal') {
    return `Terminal hacks reward precision. Unlike a graphical toggle, the command is explicit, repeatable, and easy to document, but it also means you are responsible for reading every flag and every path before you press Return. That is especially important here because the reference command is \`${reference.value}\`, and changes at this layer can outlive the app session that triggered them.`;
  }

  if (hack.method === 'Settings') {
    return `Settings-based hacks are useful because they usually change a behavior at the system or app level rather than only helping once. The tradeoff is that a settings change can keep affecting your Mac long after you forget you turned it on, so it helps to think of this as a persistent preference decision, not just a quick experiment.`;
  }

  return `UI-driven hacks like this one are easy to underestimate because they often look like small clicks or hover gestures. In practice, though, the value comes from recognizing that macOS hides a lot of power in plain sight, and learning where that interaction lives means you stop re-discovering it from scratch every time you need it.`;
}

function buildWhyParagraph(hack) {
  const topic = (hack.topics || [])[0] || 'General';
  const topicExplanation = TOPIC_EXPLANATIONS[topic] || TOPIC_EXPLANATIONS.General;
  return `${topicExplanation} ${hack.title} belongs to the ${topic} area, so its real value is not just the isolated trick itself; it is the fact that it turns a repeated task into something more predictable, easier to explain, and easier to trust when you are moving quickly.`;
}

function buildRiskParagraph(hack) {
  if (hack.risk === 'High') {
    return `Because this hack is high risk, the right mindset is caution before convenience. You want to know what success looks like, what failure looks like, and what your exit path is before you commit to the change. That does not mean you should avoid the hack entirely; it means you should use it with the same seriousness you would apply to any system-level change.`;
  }
  if (hack.risk === 'Medium') {
    return `This is not usually the kind of hack that damages a machine by itself, but it can still affect how macOS behaves in ways that surprise you later. A short pause before you confirm the change is usually enough to keep it productive instead of distracting.`;
  }
  return `The risk here is generally low, which shifts the emphasis away from safety and toward consistency. The biggest gain comes from practicing the habit until it becomes the default way you handle that task.`;
}

function buildPracticalExamples(hack, useCases) {
  const items = [...useCases];
  if (hack.app?.includes('Finder')) items.push('while organizing folders or cleaning up downloads');
  if (hack.app?.includes('Chrome') || hack.app?.includes('Safari')) {
    items.push('during research sessions where tabs, pages, and copied references pile up quickly');
  }
  if (hack.app?.includes('Terminal')) {
    items.push('when you want a documented, repeatable way to apply the same change later');
  }
  if (items.length === 0) items.push('whenever the same friction point appears more than once in a normal day');
  return unique(items).slice(0, 4);
}

function referenceSectionMarkdown(hack, reference) {
  if (!reference.value) return '';

  if (hack.method === 'Terminal') {
    return `## Exact command

\`\`\`sh
${reference.value}
\`\`\`

Treat the command above as the canonical version for this hack. If you are copying it from the page, paste it into Terminal, read it once, and only then execute it.
`;
  }

  if (hack.method === 'Shortcut') {
    return `## Shortcut to remember

The core shortcut is \`${reference.value}\`. Once you have the right app or selection focused, the whole point is that the action should feel immediate and repeatable.
`;
  }

  if (hack.method === 'Settings') {
    return `## Where to find it

The most relevant settings path is \`${reference.value}\`. If that exact label moves in a future macOS version, use System Settings search and look for the same feature name instead of assuming the hack disappeared.
`;
  }

  return `## Interaction to remember

The important interaction is: ${reference.value}. Keeping that phrasing in mind makes the trick easier to find again later.
`;
}

function buildWikiMarkdown(hack, existingMarkdown) {
  const sections = parseExistingSections(existingMarkdown);
  const existingPrereqs = sectionItems(sections, ['prerequisites']);
  const existingSteps = sectionItems(sections, ['steps']);
  const existingVerify = sectionItems(sections, ['how to verify', 'verify']);
  const existingUndo = sectionItems(sections, ['undo']);
  const existingTips = sectionItems(sections, ['tips']);
  const existingTroubleshooting = sectionItems(sections, ['troubleshooting']);

  const { rest } = splitLeadSentence(hack.desc);
  const reference = referenceForHack(hack);
  const useCases = buildUseCases(hack);
  const prerequisites = buildPrerequisites(hack, existingPrereqs);
  const steps = buildSteps(hack, existingSteps);
  const verify = buildVerify(hack, existingVerify);
  const undo = buildUndo(hack, existingUndo);
  const mistakes = buildMistakes(hack);
  const troubleshooting = buildTroubleshooting(hack, existingTips, existingTroubleshooting);
  const examples = buildPracticalExamples(hack, useCases);

  const intro1 = `${hack.title} is a ${hack.method.toLowerCase()}-driven macOS hack for ${appsLabel(hack)}. ${rest || hack.desc} In isolation that may sound small, but this kind of action is exactly the sort of thing that shapes how smooth or clumsy a normal day on a Mac feels.`;
  const intro2 = `This hack is tagged ${hack.level} and ${hack.risk.toLowerCase()} risk. ${buildRiskParagraph(hack)} ${buildWhyParagraph(hack)}`;
  const beforeStart = `Before you use ${hack.title}, think about the context around it instead of only the action itself. The right window, the right selection, the right permissions, and the right macOS version all matter more than most people expect. That is true for beginner-friendly tricks just as much as it is for professional ones, because the difference between a smooth result and a confusing one is often just a missing assumption.`;
  const stepWrap = `If you treat the steps above as a repeatable sequence rather than a one-off experiment, the hack becomes much easier to trust. Repetition matters here: the first success teaches the mechanic, but the second and third uses are what turn it into a real workflow habit.`;
  const whyThisHelps = buildMethodParagraph(hack, reference);
  const commonMistakesIntro = `Most problems with ${hack.title} come from context, not complexity. People usually either trigger it in the wrong place, expect a different result than the feature was designed to give, or forget that macOS can vary a bit between apps and versions.`;
  const verifyIntro = `Verification is important because it keeps this from becoming cargo-cult behavior. Rather than assuming the hack worked, use a quick check so you know whether the expected result actually happened.`;
  const undoIntro = `Undo is part of the workflow, not an afterthought. Even if you expect to keep the change, it is worth knowing how you would back out of it before you rely on it heavily.`;
  const examplesOutro = `The broader point is that ${hack.title} becomes more valuable the moment it shows up in a real task you already do. When you can connect the trick to your own workflow, it stops being trivia and starts being leverage.`;
  const troubleshootingIntro = `If the hack does not behave the way you expect, avoid random retries. A short, methodical check is usually enough to tell you whether the issue is focus, permissions, version differences, or simply a misunderstood expectation.`;

  return `## What this hack does

${intro1}

${intro2}

${referenceSectionMarkdown(hack, reference)}
## When to use it

${useCases.map((item) => `- Use it when you are ${item}.`).join('\n')}

## Before you start

${beforeStart}

${prerequisites.map((item) => `- ${item}`).join('\n')}

## Step-by-step

${steps.map((item, index) => `${index + 1}. ${item}`).join('\n')}

${stepWrap}

## Why this helps

${whyThisHelps}

${buildWhyParagraph(hack)}

## Common mistakes

${commonMistakesIntro}

${mistakes.map((item) => `- ${item}`).join('\n')}

## How to verify

${verifyIntro}

${verify.map((item) => `- ${item}`).join('\n')}

## Undo or recovery

${undoIntro}

${undo.map((item) => `- ${item}`).join('\n')}

## Practical examples

${examples.map((item) => `- A good real-world moment for this hack is ${item}.`).join('\n')}

${examplesOutro}

## Troubleshooting notes

${troubleshootingIntro}

${troubleshooting.map((item) => `- ${item}`).join('\n')}
`;
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

    let existingMarkdown = '';
    const wikiPath = path.join(dir, 'wiki.md');
    try {
      existingMarkdown = await fs.readFile(wikiPath, 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const nextMarkdown = `${buildWikiMarkdown(hack, existingMarkdown).trim()}\n`;
    await fs.writeFile(wikiPath, nextMarkdown, 'utf8');
    written += 1;
  }

  console.log(`Wrote wiki.md for ${written} hacks`);
}

await main();
