## Overview

Redo is the forward half of the undo system. `Cmd + Shift + Z` reapplies an action that you just undid. It is useful when you stepped back too far, changed your mind after undoing, or want to compare before and after states quickly without rebuilding the edit manually.

## How to use it

1. Undo something with `Cmd + Z`.
2. Decide that you actually want the undone action back.
3. Press `Cmd + Shift + Z`.
4. Repeat if the app supports multiple redo steps.

## Why it matters

Redo sounds minor until you start using Undo aggressively. Once Undo becomes normal, Redo becomes the correction for your correction. It keeps the editing loop fluid because you can move backward and forward through recent changes without fear of losing track of what you were testing.

## Caveats

- Not every app implements Redo the same way.
- Some apps use a different shortcut or a different menu label.
- If you make a new edit after undoing, the redo chain is often cleared.
