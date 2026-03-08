## Overview

`caffeinate` keeps the Mac awake while the command is running. It is a temporary anti-sleep tool, which makes it safer than changing system-wide energy settings just because you need the machine to stay awake for one job.

## How to use it

1. Open Terminal.
2. Run the `caffeinate` command with the flags that fit your case.
3. Leave the command running while the Mac needs to stay awake.
4. Stop it with `Ctrl + C` when you are done.

## Why it matters

This is useful for long downloads, presentations, builds, backups, or any task where sleep would interrupt the work. It gives you a one-session override instead of a persistent settings change you might forget later.

## Caveats

- The command only protects against sleep while it is active.
- Keep power and battery impact in mind on portable Macs.
- If the job spans hours, make sure the machine also has the power and network conditions it needs.
