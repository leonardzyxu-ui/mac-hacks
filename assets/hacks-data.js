const HACKS = [
  {
    "id": 0,
    "title": "Copy",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "clipboard",
      "duplicate",
      "text"
    ],
    "desc": "Cmd + C. Copies the selected text, image, or file to your clipboard, ready to be pasted elsewhere.",
    "slug": "copy-0",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Clipboard"
    ]
  },
  {
    "id": 1,
    "title": "Paste",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "clipboard",
      "insert",
      "move"
    ],
    "desc": "Cmd + V. Inserts the contents of your clipboard into the current field or folder.",
    "slug": "paste-1",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Clipboard"
    ]
  },
  {
    "id": 2,
    "title": "Cut",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "move",
      "remove",
      "clipboard"
    ],
    "desc": "Cmd + X. Removes the selection and copies it to the clipboard (Move operation).",
    "slug": "cut-2",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Clipboard"
    ]
  },
  {
    "id": 3,
    "title": "Undo",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "oops",
      "back",
      "revert"
    ],
    "desc": "Cmd + Z. Instantly undoes your last action. Press multiple times to go further back.",
    "slug": "undo-3",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 4,
    "title": "Redo",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "restore",
      "forward",
      "revert"
    ],
    "desc": "Cmd + Shift + Z. Re-applies an action you just Undid.",
    "slug": "redo-4",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 5,
    "title": "Select All",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "highlight",
      "everything",
      "grab"
    ],
    "desc": "Cmd + A. Highlights every item in a folder or every word in a document.",
    "slug": "select-all-5",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 6,
    "title": "Spotlight Search",
    "app": [
      "Spotlight"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "find",
      "open",
      "launch",
      "calculate",
      "math"
    ],
    "desc": "Cmd + Space. The brain of your Mac. Type to open apps, find files, or do math instantly.",
    "slug": "spotlight-search-6",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 7,
    "title": "Force Quit",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "frozen",
      "stuck",
      "close",
      "kill",
      "stop"
    ],
    "desc": "Cmd + Option + Esc. Opens the Force Quit menu to kill apps that are frozen or not responding.",
    "slug": "force-quit-7",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 8,
    "title": "Screenshot (Selection)",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "capture",
      "image",
      "snip",
      "clip"
    ],
    "desc": "Cmd + Shift + 4. Turns cursor into a crosshair. Drag to capture a specific part of the screen.",
    "slug": "screenshot-selection-8",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Screenshots & Media"
    ]
  },
  {
    "id": 9,
    "title": "Screenshot (Window)",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "capture",
      "clean",
      "shadow",
      "spacebar"
    ],
    "desc": "Cmd + Shift + 4, then hit Spacebar. Click any window to capture it perfectly with a transparent shadow.",
    "slug": "screenshot-window-9",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Screenshots & Media",
      "Window Management"
    ]
  },
  {
    "id": 10,
    "title": "Emoji Picker",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "smile",
      "icon",
      "symbol",
      "text"
    ],
    "desc": "Ctrl + Cmd + Space. Opens the emoji and symbol picker anywhere you can type text.",
    "slug": "emoji-picker-10",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Customization"
    ]
  },
  {
    "id": 11,
    "title": "Quick Look",
    "app": [
      "Finder"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "preview",
      "view",
      "spacebar"
    ],
    "desc": "Select any file in Finder and press Spacebar to instantly preview it without opening the app.",
    "slug": "quick-look-11",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 12,
    "title": "App Expose",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "view",
      "windows",
      "mission control",
      "swipe"
    ],
    "desc": "Ctrl + Down Arrow (or Swipe Down with 3 fingers). Shows all open windows of the CURRENT app only.",
    "slug": "app-expose-12",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Security & Privacy",
      "Window Management"
    ]
  },
  {
    "id": 13,
    "title": "Switch Apps",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "navigate",
      "multitasking",
      "tab"
    ],
    "desc": "Cmd + Tab. Hold Cmd and tap Tab to quickly cycle through your open applications.",
    "slug": "switch-apps-13",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 14,
    "title": "Close Window",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "quit",
      "exit"
    ],
    "desc": "Cmd + W. Closes the current window (tabs/documents) but keeps the app running in the dock.",
    "slug": "close-window-14",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 15,
    "title": "New Tab",
    "app": [
      "Safari",
      "Chrome",
      "Finder"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "browse",
      "window"
    ],
    "desc": "Cmd + T. Opens a new tab in Web Browsers and even Finder windows.",
    "slug": "new-tab-15",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Finder & Files",
      "Window Management"
    ]
  },
  {
    "id": 16,
    "title": "New Window",
    "app": [
      "Chrome",
      "Safari",
      "Finder"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "browse",
      "fresh",
      "open"
    ],
    "desc": "Cmd + N. Opens a completely new window instance for the active application.",
    "slug": "new-window-16",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Finder & Files",
      "Window Management"
    ]
  },
  {
    "id": 17,
    "title": "Reopen Closed Tab",
    "app": [
      "Safari",
      "Chrome"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "oops",
      "undo",
      "browser"
    ],
    "desc": "Cmd + Shift + T. Magically brings back the last browser tab you accidentally closed.",
    "slug": "reopen-closed-tab-17",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 18,
    "title": "Chrome History",
    "app": [
      "Chrome"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "log",
      "past",
      "website",
      "visited"
    ],
    "desc": "Cmd + Y. Instantly opens your Chrome browsing history page.",
    "slug": "chrome-history-18",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 19,
    "title": "Incognito Mode",
    "app": [
      "Chrome"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "private",
      "hidden",
      "secret"
    ],
    "desc": "Cmd + Shift + N. Opens a new Incognito (Private) window in Chrome.",
    "slug": "incognito-mode-19",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Window Management"
    ]
  },
  {
    "id": 20,
    "title": "Chrome Quit",
    "app": [
      "Chrome"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "exit",
      "close",
      "stop"
    ],
    "desc": "Hold Cmd + Q (or press Q twice). Chrome requires a 'slow' quit to prevent accidents.",
    "slug": "chrome-quit-20",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 21,
    "title": "Scroll to Top/Bottom",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "navigate",
      "page",
      "arrow"
    ],
    "desc": "Cmd + Up/Down Arrow. Instantly jumps to the very top or bottom of a document or webpage.",
    "slug": "scroll-to-top-bottom-21",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 22,
    "title": "Dictation",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "voice",
      "speak",
      "type",
      "mic"
    ],
    "desc": "Press F5 (or Fn + F5). Starts the microphone so you can type with your voice.",
    "slug": "dictation-22",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Accessibility"
    ]
  },
  {
    "id": 23,
    "title": "Rename File",
    "app": [
      "Finder"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "change",
      "title",
      "name"
    ],
    "desc": "Select a file and press Return (Enter). This enters rename mode (unlike Windows, which opens the file).",
    "slug": "rename-file-23",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files",
      "Window Management"
    ]
  },
  {
    "id": 24,
    "title": "Delete File",
    "app": [
      "Finder"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "trash",
      "remove",
      "bin"
    ],
    "desc": "Cmd + Delete. Moves the selected file to the Trash.",
    "slug": "delete-file-24",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 25,
    "title": "Lock Screen",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "security",
      "sleep",
      "away"
    ],
    "desc": "Cmd + Ctrl + Q. Instantly locks your Mac screen (requires password to re-enter).",
    "slug": "lock-screen-25",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Security & Privacy"
    ]
  },
  {
    "id": 26,
    "title": "Interactive Widgets",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "desktop",
      "home",
      "gadget"
    ],
    "desc": "Right-click Desktop > Edit Widgets. You can check off reminders or play podcasts directly from the desktop.",
    "slug": "interactive-widgets-26",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 27,
    "title": "Window Tiling (Hover)",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "split",
      "organize",
      "view"
    ],
    "desc": "Hover over the green maximize button (top left). Choose 'Tile Window to Left/Right' for split screen.",
    "slug": "window-tiling-hover-27",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 28,
    "title": "Show Clipboard",
    "app": [
      "Finder"
    ],
    "level": "Simple",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "paste",
      "history",
      "copy"
    ],
    "desc": "Finder > Edit > Show Clipboard. Opens a window showing exactly what is currently copied.",
    "slug": "show-clipboard-28",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Clipboard",
      "Finder & Files",
      "Window Management"
    ]
  },
  {
    "id": 29,
    "title": "Tags",
    "app": [
      "Finder"
    ],
    "level": "Simple",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "color",
      "organize",
      "label"
    ],
    "desc": "Right-click files to assign colored tags (Red, Blue). You can then search for 'Red' to find them all.",
    "slug": "tags-29",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 30,
    "title": "Web Apps in Dock",
    "app": [
      "Safari"
    ],
    "level": "High",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "pwa",
      "shortcut",
      "app"
    ],
    "desc": "Safari > File > Add to Dock. Turns any website into a standalone app icon in your Dock.",
    "slug": "web-apps-in-dock-30",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Clipboard",
      "Window Management"
    ]
  },
  {
    "id": 31,
    "title": "Print / Save PDF",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "paper",
      "pdf",
      "save"
    ],
    "desc": "Cmd + P. Opens print dialog. Click the small 'PDF' arrow at the bottom to save as a file.",
    "slug": "print-save-pdf-31",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 32,
    "title": "Find in Page",
    "app": [
      "System"
    ],
    "level": "Simple",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "search",
      "locate",
      "text"
    ],
    "desc": "Cmd + F. Opens a search bar to find specific text within the current web page or document.",
    "slug": "find-in-page-32",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 33,
    "title": "Do Not Disturb",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "silence",
      "notification",
      "focus",
      "quiet"
    ],
    "desc": "Option + Click the Date/Time in the menu bar. Instantly toggles 'Do Not Disturb' mode on/off.",
    "slug": "do-not-disturb-33",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "System Settings"
    ]
  },
  {
    "id": 34,
    "title": "Hot Corners",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "corner",
      "mouse",
      "shortcut"
    ],
    "desc": "System Settings > Desktop & Dock > Hot Corners. Trigger actions (like Lock Screen) by moving mouse to a corner.",
    "slug": "hot-corners-34",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Clipboard",
      "Security & Privacy",
      "System Settings",
      "Window Management"
    ]
  },
  {
    "id": 35,
    "title": "Text Replacements",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "shortcut",
      "expand",
      "email",
      "typing"
    ],
    "desc": "System Settings > Keyboard > Text Replacements. Set a shortcut like '@@' to auto-expand to your full email address.",
    "slug": "text-replacements-35",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Clipboard",
      "Networking",
      "System Settings"
    ]
  },
  {
    "id": 36,
    "title": "Empty Trash",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "clean",
      "delete",
      "permanent"
    ],
    "desc": "Cmd + Shift + Delete. Empties the trash (asks for confirmation). Add 'Option' to skip confirmation.",
    "slug": "empty-trash-36",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 37,
    "title": "Sound Output Select",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "audio",
      "headphones",
      "speaker"
    ],
    "desc": "Option + Click the Sound icon in the menu bar. Allows you to quickly switch between Speakers/Headphones.",
    "slug": "sound-output-select-37",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 38,
    "title": "Game Mode",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "performance",
      "cpu",
      "gpu",
      "play"
    ],
    "desc": "Auto-triggers in full-screen games. Prioritizes CPU/GPU for the game and reduces background usage.",
    "slug": "game-mode-38",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Performance"
    ]
  },
  {
    "id": 39,
    "title": "Picture in Picture",
    "app": [
      "Safari"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "youtube",
      "video",
      "float"
    ],
    "desc": "Right-click a YouTube video TWICE. Select 'Picture in Picture' to float the video while you work.",
    "slug": "picture-in-picture-39",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Screenshots & Media"
    ]
  },
  {
    "id": 40,
    "title": "Rearrange Menu Bar",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "organize",
      "icons",
      "move",
      "drag"
    ],
    "desc": "Hold Cmd + Drag icons in the top menu bar. You can rearrange them or drag them out to remove them.",
    "slug": "rearrange-menu-bar-40",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 41,
    "title": "Tahoe Folder Stamps",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": true,
    "keywords": [
      "icon",
      "custom",
      "emoji",
      "color"
    ],
    "desc": "Right-click folder > 'Appearance'. Replace standard blue icons with Emojis or Tint Colors. (Tahoe Exclusive).",
    "slug": "tahoe-folder-stamps-41",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Customization",
      "Finder & Files"
    ]
  },
  {
    "id": 42,
    "title": "Paste Without Formatting",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "clean",
      "text",
      "style"
    ],
    "desc": "Cmd + Option + Shift + V. Pastes text matching the destination's font/style, ignoring the original format.",
    "slug": "paste-without-formatting-42",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Clipboard"
    ]
  },
  {
    "id": 43,
    "title": "Screen Recording HUD",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "video",
      "record",
      "screen"
    ],
    "desc": "Cmd + Shift + 5. Opens the advanced HUD for recording video or taking timed screenshots.",
    "slug": "screen-recording-hud-43",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Screenshots & Media"
    ]
  },
  {
    "id": 44,
    "title": "Delete by Word",
    "app": [
      "Text"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "edit",
      "remove",
      "typing"
    ],
    "desc": "Option + Delete. Removes the entire word behind the cursor instead of just one letter.",
    "slug": "delete-by-word-44",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Networking"
    ]
  },
  {
    "id": 45,
    "title": "Navigate by Word",
    "app": [
      "Text"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "move",
      "cursor",
      "jump"
    ],
    "desc": "Option + Left/Right Arrow. Jumps the cursor one entire word at a time.",
    "slug": "navigate-by-word-45",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 46,
    "title": "Navigate to Start/End",
    "app": [
      "Text"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "line",
      "move",
      "cursor"
    ],
    "desc": "Cmd + Left/Right Arrow. Jumps the cursor instantly to the start or end of the current line.",
    "slug": "navigate-to-start-end-46",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 47,
    "title": "Cycle Windows (Same App)",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "switch",
      "tab",
      "tilde"
    ],
    "desc": "Cmd + ~ (Tilde). Switches between different windows of the SAME app (e.g., two Word docs).",
    "slug": "cycle-windows-same-app-47",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 48,
    "title": "Search Current Folder",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "find",
      "scope",
      "limit"
    ],
    "desc": "Cmd + F inside a folder. Then click 'Current Folder' near the top to search ONLY that specific location.",
    "slug": "search-current-folder-48",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 49,
    "title": "Clear Terminal",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "clean",
      "wipe",
      "screen"
    ],
    "desc": "Cmd + K. Instantly clears all previous text and output in the Terminal window.",
    "slug": "clear-terminal-49",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Security & Privacy",
      "Terminal",
      "Window Management"
    ]
  },
  {
    "id": 50,
    "title": "Silent Click",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "trackpad",
      "haptic",
      "noise"
    ],
    "desc": "System Settings > Trackpad. Turn off 'Force Click' and 'Sound' for a completely silent trackpad.",
    "slug": "silent-click-50",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "System Settings"
    ]
  },
  {
    "id": 51,
    "title": "Path Bar",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "location",
      "breadcrump",
      "where"
    ],
    "desc": "Finder > View > Show Path Bar. Shows the file trail (User > Docs > Folder) at the bottom of the window.",
    "slug": "path-bar-51",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Finder & Files",
      "System Settings",
      "Window Management"
    ]
  },
  {
    "id": 52,
    "title": "Status Bar",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "count",
      "space",
      "storage"
    ],
    "desc": "Finder > View > Show Status Bar. Displays item count and remaining disk space at the bottom.",
    "slug": "status-bar-52",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Finder & Files",
      "System Settings"
    ]
  },
  {
    "id": 53,
    "title": "Function Keys",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "fn",
      "touchbar",
      "control"
    ],
    "desc": "System Settings > Keyboard. Set 'Press Fn to' to 'Show F1, F2, etc.' for pro function key access.",
    "slug": "function-keys-53",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "System Settings"
    ]
  },
  {
    "id": 54,
    "title": "AirPlay Receiver",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "mirror",
      "iphone",
      "screen"
    ],
    "desc": "System Settings > General > AirDrop. Allow your Mac to act as a screen/speaker for your iPhone.",
    "slug": "airplay-receiver-54",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Networking",
      "Screenshots & Media",
      "System Settings"
    ]
  },
  {
    "id": 55,
    "title": "Live Speech",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "accessibility",
      "talk",
      "type"
    ],
    "desc": "System Settings > Accessibility > Live Speech. Type to have your Mac speak for you during FaceTime calls.",
    "slug": "live-speech-55",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Accessibility",
      "System Settings"
    ]
  },
  {
    "id": 56,
    "title": "Prevent Sleep (Caffeinate)",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "awake",
      "coffee",
      "caffeinate"
    ],
    "desc": "Type 'caffeinate -d' in Terminal. Keeps screen awake indefinitely. Press Ctrl+C to stop.",
    "slug": "prevent-sleep-caffeinate-56",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal"
    ]
  },
  {
    "id": 57,
    "title": "Reset Dock",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "fix",
      "restart",
      "glitch"
    ],
    "desc": "Type 'killall Dock'. Restarts the Dock process if it gets stuck, frozen, or glitchy.",
    "slug": "reset-dock-57",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal",
      "Troubleshooting",
      "Window Management"
    ]
  },
  {
    "id": 58,
    "title": "Download File",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "curl",
      "web",
      "get"
    ],
    "desc": "Type 'curl -O [URL]'. Downloads the file from the URL directly to your Home folder.",
    "slug": "download-file-58",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Browsers & Web",
      "Terminal"
    ]
  },
  {
    "id": 59,
    "title": "Check Uptime",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "time",
      "status",
      "boot"
    ],
    "desc": "Type 'uptime'. Shows exactly how long your Mac has been running since the last full restart.",
    "slug": "check-uptime-59",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal"
    ]
  },
  {
    "id": 60,
    "title": "Batch Rename",
    "app": [
      "Finder"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "bulk",
      "change",
      "files"
    ],
    "desc": "Select multiple files > Right Click > Rename. Find & Replace text or add numbers to all files at once.",
    "slug": "batch-rename-60",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 61,
    "title": "Merge All Windows",
    "app": [
      "Finder",
      "Safari"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "combine",
      "tabs",
      "organize"
    ],
    "desc": "Window > Merge All Windows. Combines scattered windows of an app into one single window with tabs.",
    "slug": "merge-all-windows-61",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "Finder & Files",
      "Window Management"
    ]
  },
  {
    "id": 62,
    "title": "Extract Image from PDF",
    "app": [
      "Preview"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "copy",
      "snip",
      "export"
    ],
    "desc": "In Preview, use Selection tool to grab an area. Cmd+C (Copy), then Cmd+N (New) to create an image file from it.",
    "slug": "extract-image-from-pdf-62",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Clipboard"
    ]
  },
  {
    "id": 63,
    "title": "Crop to Circle",
    "app": [
      "Preview"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "edit",
      "image",
      "shape"
    ],
    "desc": "Preview > Markup. Select Ellipse tool. Hold Shift to draw a circle. Crop to create a perfect round icon.",
    "slug": "crop-to-circle-63",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 64,
    "title": "Hardware Info",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "specs",
      "serial",
      "model"
    ],
    "desc": "Hold Option + Click Apple Menu. 'About This Mac' becomes 'System Information', showing deep hardware specs.",
    "slug": "hardware-info-64",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 65,
    "title": "Check File Size",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "storage",
      "disk",
      "space"
    ],
    "desc": "Type 'du -sh [folder path]'. Calculates and displays the total size of a specific folder.",
    "slug": "check-file-size-65",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal"
    ]
  },
  {
    "id": 66,
    "title": "Text to Audio",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "speak",
      "mp3",
      "convert"
    ],
    "desc": "Type 'say -o output.aiff -f text.txt'. Converts a text file into a spoken audio file.",
    "slug": "text-to-audio-66",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal"
    ]
  },
  {
    "id": 67,
    "title": "Kill Process Name",
    "app": [
      "Terminal"
    ],
    "level": "Medium",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "force",
      "stop",
      "program"
    ],
    "desc": "Type 'pkill [App Name]' (e.g., pkill Safari). Instantly force closes the specified application.",
    "slug": "kill-process-name-67",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 68,
    "title": "Settings Shortcut",
    "app": [
      "System"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "preferences",
      "config",
      "universal"
    ],
    "desc": "Cmd + , (Comma). Opens the Settings/Preferences window for almost ANY open application.",
    "slug": "settings-shortcut-68",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Clipboard",
      "Window Management"
    ]
  },
  {
    "id": 69,
    "title": "Browser Address Bar",
    "app": [
      "Chrome",
      "Safari"
    ],
    "level": "Medium",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "url",
      "type",
      "search"
    ],
    "desc": "Cmd + L. Instantly highlights the URL bar so you can type a new search or website address.",
    "slug": "browser-address-bar-69",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Browsers & Web"
    ]
  },
  {
    "id": 70,
    "title": "WiFi Password View",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "network",
      "share",
      "copy"
    ],
    "desc": "System Settings > Wi-Fi. Click the '...' next to a network > Copy Password. Useful for sharing.",
    "slug": "wifi-password-view-70",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Clipboard",
      "Networking",
      "Security & Privacy",
      "System Settings"
    ]
  },
  {
    "id": 71,
    "title": "Spotlight Workflow Predictor",
    "app": [
      "Spotlight"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": true,
    "keywords": [
      "ai",
      "suggestion",
      "context"
    ],
    "desc": "Type 'Work' or 'Relax'. Spotlight AI sets up your window layout and playlists. (Tahoe Exclusive).",
    "slug": "spotlight-workflow-predictor-71",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 72,
    "title": "Go to Folder",
    "app": [
      "Finder"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "navigate",
      "path",
      "hidden"
    ],
    "desc": "Cmd + Shift + G. Allows you to type a direct file path (e.g., ~/Library) to jump to hidden folders.",
    "slug": "go-to-folder-72",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 73,
    "title": "Volume Fine Tuning",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "audio",
      "precise",
      "level"
    ],
    "desc": "Option + Shift + Volume Keys. Adjusts volume in tiny 1/4 increments for perfect audio control.",
    "slug": "volume-fine-tuning-73",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 74,
    "title": "Brightness Fine Tuning",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "display",
      "precise",
      "level"
    ],
    "desc": "Option + Shift + Brightness Keys. Adjusts screen brightness in tiny 1/4 increments.",
    "slug": "brightness-fine-tuning-74",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 75,
    "title": "Minimize All Windows",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "desktop",
      "hide",
      "clear"
    ],
    "desc": "Cmd + Option + M. Minimizes ALL windows of the current app. (Hold Shift to see it in slow motion!).",
    "slug": "minimize-all-windows-75",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Window Management"
    ]
  },
  {
    "id": 76,
    "title": "Slow Motion Animation",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "fun",
      "effect",
      "genie"
    ],
    "desc": "Hold Shift while clicking the yellow Minimize button. Plays the Genie effect in super slow motion.",
    "slug": "slow-motion-animation-76",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 77,
    "title": "Universal Control",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "ipad",
      "mouse",
      "share"
    ],
    "desc": "System Settings > Displays. Push mouse off screen edge to seamlessly control a nearby iPad.",
    "slug": "universal-control-77",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "System Settings"
    ]
  },
  {
    "id": 78,
    "title": "Personal Voice",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": true,
    "keywords": [
      "ai",
      "speech",
      "clone"
    ],
    "desc": "Settings > Accessibility > Personal Voice. Train the Mac to speak in YOUR own voice using AI.",
    "slug": "personal-voice-78",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Accessibility",
      "System Settings"
    ]
  },
  {
    "id": 79,
    "title": "Liquid Glass Transparency",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": true,
    "keywords": [
      "ui",
      "visual",
      "depth"
    ],
    "desc": "Settings > Appearance. Toggles the advanced 'Tahoe' depth blur effect on window sidebars.",
    "slug": "liquid-glass-transparency-79",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Customization",
      "System Settings",
      "Window Management"
    ]
  },
  {
    "id": 80,
    "title": "Three Finger Drag",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "trackpad",
      "move",
      "gesture"
    ],
    "desc": "Accessibility > Pointer Control > Trackpad Options. Enable dragging windows with 3 fingers (no click needed).",
    "slug": "three-finger-drag-80",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Accessibility",
      "System Settings",
      "Window Management"
    ]
  },
  {
    "id": 81,
    "title": "Change Screenshot Type",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "format",
      "jpg",
      "png"
    ],
    "desc": "'defaults write com.apple.screencapture type jpg'. Saves screenshots as smaller JPGs instead of PNGs.",
    "slug": "change-screenshot-type-81",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Screenshots & Media",
      "Terminal"
    ]
  },
  {
    "id": 82,
    "title": "Remove Screenshot Shadow",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "clean",
      "flat",
      "image"
    ],
    "desc": "'defaults write com.apple.screencapture disable-shadow -bool TRUE'. Removes the drop shadow from window captures.",
    "slug": "remove-screenshot-shadow-82",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Screenshots & Media",
      "Terminal",
      "Window Management"
    ]
  },
  {
    "id": 83,
    "title": "Matrix Screen Saver",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "fun",
      "hacker",
      "code"
    ],
    "desc": "Install Homebrew, then type 'cmatrix'. Turns your terminal into the famous Matrix digital rain.",
    "slug": "matrix-screen-saver-83",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal"
    ]
  },
  {
    "id": 84,
    "title": "Network Quality Test",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "speed",
      "internet",
      "wifi"
    ],
    "desc": "Type 'networkQuality'. Runs Apple's built-in internet speed and responsiveness test.",
    "slug": "network-quality-test-84",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Networking",
      "Terminal"
    ]
  },
  {
    "id": 85,
    "title": "Hide Desktop Icons",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "clean",
      "presentation",
      "clutter"
    ],
    "desc": "'defaults write com.apple.finder CreateDesktop false; killall Finder'. Hides all icons for a clean desktop.",
    "slug": "hide-desktop-icons-85",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Finder & Files",
      "Terminal"
    ]
  },
  {
    "id": 86,
    "title": "Re-Show Desktop Icons",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "restore",
      "view",
      "files"
    ],
    "desc": "'defaults write com.apple.finder CreateDesktop true; killall Finder'. Restores hidden desktop icons.",
    "slug": "re-show-desktop-icons-86",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Finder & Files",
      "Terminal"
    ]
  },
  {
    "id": 87,
    "title": "Smart Folders",
    "app": [
      "Finder"
    ],
    "level": "High",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "search",
      "automation",
      "organize"
    ],
    "desc": "Finder > File > New Smart Folder. Auto-groups files based on rules (e.g., 'All PDFs created this week').",
    "slug": "smart-folders-87",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 88,
    "title": "WiFi Details",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "ip",
      "router",
      "technical"
    ],
    "desc": "Hold Option + Click WiFi Icon. Shows advanced stats like IP Address, Noise Level, and Router Channel.",
    "slug": "wifi-details-88",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 89,
    "title": "Bluetooth Details",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "signal",
      "codec",
      "tech"
    ],
    "desc": "Hold Shift + Option + Click Bluetooth Icon. Shows technical details like Codec and signal strength.",
    "slug": "bluetooth-details-89",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 90,
    "title": "List Processes (Top)",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "cpu",
      "monitor",
      "activity"
    ],
    "desc": "Type 'top -o cpu'. Displays a real-time, text-based task manager sorted by CPU usage.",
    "slug": "list-processes-top-90",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 91,
    "title": "Password Protected Zip",
    "app": [
      "Terminal"
    ],
    "level": "High",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "security",
      "encrypt",
      "archive"
    ],
    "desc": "'zip -er archive.zip [folder]'. Creates a secure zip file that requires a password to open.",
    "slug": "password-protected-zip-91",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Security & Privacy",
      "Terminal"
    ]
  },
  {
    "id": 92,
    "title": "Summarize Text",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "ai",
      "shorten",
      "read"
    ],
    "desc": "Keyboard Settings > Services > Summarize. Select text > Right Click > Summarize. (Old school AI!).",
    "slug": "summarize-text-92",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "System Settings"
    ]
  },
  {
    "id": 93,
    "title": "Quick Note",
    "app": [
      "System"
    ],
    "level": "High",
    "type": "Settings Hacks",
    "tahoe": false,
    "keywords": [
      "write",
      "corner",
      "memo"
    ],
    "desc": "Bottom-Right Hot Corner. Move mouse there to instantly create a Note (often links to current website).",
    "slug": "quick-note-93",
    "method": "Settings",
    "risk": "Low",
    "topics": [
      "Browsers & Web",
      "System Settings"
    ]
  },
  {
    "id": 94,
    "title": "Show Hidden Files",
    "app": [
      "Finder"
    ],
    "level": "Professional",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "system",
      "dotfiles",
      "view"
    ],
    "desc": "Cmd + Shift + . (Period). Toggles visibility of system files (like .gitignore or .DS_Store).",
    "slug": "show-hidden-files-94",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 95,
    "title": "Access Menu Bar",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "keyboard",
      "navigate",
      "mouse-free"
    ],
    "desc": "Ctrl + F2. Focuses the Apple Menu so you can navigate menus using only arrow keys.",
    "slug": "access-menu-bar-95",
    "method": "Shortcut",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 96,
    "title": "Force Restart",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Keyboard Commands",
    "tahoe": false,
    "keywords": [
      "emergency",
      "boot",
      "power"
    ],
    "desc": "Cmd + Ctrl + Power Button. Forces an instant hard reboot. (WARNING: Unsaved data will be lost).",
    "slug": "force-restart-96",
    "method": "Shortcut",
    "risk": "High",
    "topics": [
      "General"
    ]
  },
  {
    "id": 97,
    "title": "Add Dock Spacers",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "organize",
      "gap",
      "separator"
    ],
    "desc": "'defaults write com.apple.dock persistent-apps -array-add...'. Adds invisible spacers to organize the Dock.",
    "slug": "add-dock-spacers-97",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal",
      "Window Management"
    ]
  },
  {
    "id": 98,
    "title": "Purge RAM",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "memory",
      "speed",
      "cache"
    ],
    "desc": "Type 'sudo purge'. Forces the Mac to dump inactive memory. Useful before launching heavy apps.",
    "slug": "purge-ram-98",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 99,
    "title": "Secure Empty Trash",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "delete",
      "wipe",
      "nsa"
    ],
    "desc": "'srm -v [file]'. Securely overwrites the file 35 times before deleting. Impossible to recover.",
    "slug": "secure-empty-trash-99",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Security & Privacy",
      "Terminal"
    ]
  },
  {
    "id": 100,
    "title": "Disable Startup Chime",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "sound",
      "boot",
      "quiet"
    ],
    "desc": "'sudo nvram SystemAudioVolume=%80'. Permanently mutes the iconic Mac startup sound.",
    "slug": "disable-startup-chime-100",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Customization",
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 101,
    "title": "Enable Startup Chime",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "sound",
      "boot",
      "classic"
    ],
    "desc": "'sudo nvram -d SystemAudioVolume'. Restores the startup sound if previously disabled.",
    "slug": "enable-startup-chime-101",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Customization",
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 102,
    "title": "View iCloud Drive",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "cloud",
      "navigate",
      "path"
    ],
    "desc": "Type 'cd ~/Library/Mobile\\ Documents'. Navigates to the hidden local folder for iCloud data.",
    "slug": "view-icloud-drive-102",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Networking",
      "Terminal"
    ]
  },
  {
    "id": 103,
    "title": "Change Screenshot Location",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "save",
      "folder",
      "desktop"
    ],
    "desc": "'defaults write com.apple.screencapture location [path]'. Change save location from Desktop to elsewhere.",
    "slug": "change-screenshot-location-103",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Screenshots & Media",
      "Terminal"
    ]
  },
  {
    "id": 104,
    "title": "Disable Shadow",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "clean",
      "flat",
      "window"
    ],
    "desc": "'defaults write com.apple.screencapture disable-shadow -bool TRUE'. Removes window screenshot shadows.",
    "slug": "disable-shadow-104",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Screenshots & Media",
      "Terminal",
      "Window Management"
    ]
  },
  {
    "id": 105,
    "title": "Reset Launchpad",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "layout",
      "organize",
      "default"
    ],
    "desc": "'defaults write com.apple.dock ResetLaunchPad -bool true; killall Dock'. Resets Launchpad to factory layout.",
    "slug": "reset-launchpad-105",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Terminal",
      "Troubleshooting",
      "Window Management"
    ]
  },
  {
    "id": 106,
    "title": "Stress Test CPU",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "benchmark",
      "heat",
      "fan"
    ],
    "desc": "Type 'yes > /dev/null &'. Runs a 100% CPU load process. (Kill with 'killall yes').",
    "slug": "stress-test-cpu-106",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Performance",
      "Terminal"
    ]
  },
  {
    "id": 107,
    "title": "Superuser Do",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "admin",
      "root",
      "permission"
    ],
    "desc": "Prefixing commands with 'sudo' (e.g. sudo purge) runs them as Administrator. Use with caution.",
    "slug": "superuser-do-107",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Terminal",
      "Troubleshooting"
    ]
  },
  {
    "id": 108,
    "title": "View Hidden Library",
    "app": [
      "Finder"
    ],
    "level": "Professional",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "folder",
      "user",
      "settings"
    ],
    "desc": "In Finder, click 'Go' in the menu bar and hold 'Option'. The hidden 'Library' folder appears.",
    "slug": "view-hidden-library-108",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Finder & Files"
    ]
  },
  {
    "id": 109,
    "title": "Gatekeeper Bypass",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "security",
      "install",
      "unsigned"
    ],
    "desc": "'sudo spctl --master-disable'. Allows installing apps from 'Anywhere' (Risky, but useful for devs).",
    "slug": "gatekeeper-bypass-109",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Security & Privacy",
      "Terminal"
    ]
  },
  {
    "id": 110,
    "title": "Flush DNS",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "network",
      "internet",
      "fix"
    ],
    "desc": "'sudo dscacheutil -flushcache'. Resets how Mac resolves websites. Fixes some connection errors.",
    "slug": "flush-dns-110",
    "method": "Terminal",
    "risk": "Medium",
    "topics": [
      "Browsers & Web",
      "Networking",
      "Performance",
      "Terminal",
      "Troubleshooting"
    ]
  },
  {
    "id": 111,
    "title": "Prevent App Nap",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "performance",
      "background",
      "sleep"
    ],
    "desc": "Right-click App > Get Info > Prevent App Nap. Stops macOS from slowing the app when in background.",
    "slug": "prevent-app-nap-111",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Performance"
    ]
  },
  {
    "id": 112,
    "title": "Boot to Safe Mode",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "troubleshoot",
      "fix",
      "startup"
    ],
    "desc": "Shut down. Hold Power button until options appear. Shift-click 'Continue in Safe Mode'.",
    "slug": "boot-to-safe-mode-112",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Customization",
      "Troubleshooting"
    ]
  },
  {
    "id": 113,
    "title": "Target Disk Mode",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "transfer",
      "harddrive",
      "usbc"
    ],
    "desc": "Connect two Macs via USB-C. Boot one holding 'T'. It mounts as an external hard drive on the other.",
    "slug": "target-disk-mode-113",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "General"
    ]
  },
  {
    "id": 114,
    "title": "Network Utility",
    "app": [
      "System"
    ],
    "level": "Professional",
    "type": "Other",
    "tahoe": false,
    "keywords": [
      "ping",
      "trace",
      "lookup"
    ],
    "desc": "Hidden tool. Accessible via Terminal or CoreServices. Used for Pinging and Traceroute.",
    "slug": "network-utility-114",
    "method": "UI",
    "risk": "Low",
    "topics": [
      "Networking"
    ]
  },
  {
    "id": 115,
    "title": "Custom Login Message",
    "app": [
      "Terminal"
    ],
    "level": "Professional",
    "type": "Terminal Hacks",
    "tahoe": false,
    "keywords": [
      "lockscreen",
      "text",
      "lost"
    ],
    "desc": "'sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText \"Your Text\"'.",
    "slug": "custom-login-message-115",
    "method": "Terminal",
    "risk": "High",
    "topics": [
      "Customization",
      "Security & Privacy",
      "Terminal",
      "Window Management"
    ]
  }
];
