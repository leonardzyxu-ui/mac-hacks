## Overview

`Cmd + K` clears the Terminal window contents so you can start with a visually clean screen. This is mostly about readability, not changing shell state. Your current shell session is still alive; the window just stops showing the old clutter.

## How to use it

1. Focus Terminal.
2. Press `Cmd + K`.
3. Continue working in the same shell session.
4. Run `pwd`, `ls`, or another command if you want to re-establish visible context.

## Why it matters

Clear Terminal is useful when your screen is full of logs, command output, or errors and you want a fresh visual workspace without opening a new tab or window. It helps you think more clearly in longer shell sessions.

## Caveats

- Clearing the window does not undo commands you already ran.
- If you actually need the old output, do not clear it before copying or saving it.
- This is different from starting a new shell session.
