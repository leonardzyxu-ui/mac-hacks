## Overview

This Terminal tweak changes where macOS saves screenshots. By default, screenshots often land on the Desktop, which is fine until the Desktop turns into a pile of capture debris. Moving them into a dedicated folder makes screenshot-heavy workflows much cleaner.

## How to use it

1. Create the folder you want screenshots to live in.
2. Run the screenshot-location command in Terminal.
3. Let `SystemUIServer` restart if the command triggers it.
4. Take a test screenshot and confirm the file now goes to the new folder.

## Why it matters

If you take screenshots regularly for support, writing, design, or bug reporting, this tweak keeps the Desktop from becoming a dumping ground. It also gives you one place to review, sort, and clean up captures later.

## Caveats

- The destination folder needs to exist.
- If the command is wrong, screenshots may continue going to the old location.
- If you later forget the custom path, screenshot files can feel like they disappeared when they really just moved.
