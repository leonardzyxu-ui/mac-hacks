## Overview

`uptime` tells you how long the Mac has been running since the last reboot and also gives a quick snapshot of system load. It is a simple diagnostic command, but it answers an important question immediately: has this machine actually been restarted recently?

## How to use it

1. Open Terminal.
2. Run `uptime`.
3. Read the time-since-boot value.
4. Note the load figures if you are already troubleshooting responsiveness.

## Why it matters

Uptime is useful during support, debugging, and general sanity checks. It helps explain weird long-running behavior, reveals whether "I restarted already" is true, and gives a little context about current system load at the same time.

## Caveats

- A long uptime is not automatically bad.
- Load averages are informative, but they are not the whole performance story.
- If the machine was sleeping rather than rebooted, uptime keeps counting.
