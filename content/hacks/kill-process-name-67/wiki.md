## Overview

`pkill` lets you terminate a process by name instead of hunting for its process ID first. It is the fast command-line way to stop a stuck or misbehaving app when you already know what the process is called.

## How to use it

1. Open Terminal.
2. Run `pkill` with the exact process or app name.
3. Confirm that the app or process exits.
4. Reopen the app if you were using this as a reset.

## Why it matters

This is faster than browsing a long process list when the target is obvious. It is useful for restarting stubborn apps, clearing background helpers, or quickly ending a process during troubleshooting.

## Caveats

- Process names must match what the system expects.
- Killing the wrong process can interrupt more than you intended.
- Unsaved app state can be lost if you use it as a forced exit path.
