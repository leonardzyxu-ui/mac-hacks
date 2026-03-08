## Overview

`sudo` runs a command with elevated privileges. That makes it one of the most important and most dangerous command-line tools on the Mac, because it can push an ordinary shell command into system-wide territory very quickly.

## How to use it

1. Make sure you understand the command itself before adding `sudo`.
2. Prefix the command with `sudo`.
3. Enter the administrator password when prompted.
4. Read the outcome carefully instead of assuming privileged access made everything correct.

## Why it matters

Many system-level changes, service controls, and protected file operations require elevated privileges. Learning what `sudo` does is essential if you plan to do any serious Mac administration from Terminal.

## Caveats

- `sudo` does not make a command smart; it only makes it powerful.
- Running the wrong command with admin privileges can do much more damage than running it normally.
- If you do not understand the command, do not paste `sudo` in front of it just because something failed.
