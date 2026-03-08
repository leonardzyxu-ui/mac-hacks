## Overview

`sudo purge` forces macOS to clear inactive memory caches. This is not a normal daily-maintenance command. It is a niche troubleshooting move for specific situations where you want to free cached memory aggressively before testing something else.

## How to use it

1. Open Terminal.
2. Run the command with administrator privileges.
3. Wait for it to finish.
4. Launch or retest the workload you were concerned about.

## Why it matters

The command can be useful in controlled testing when you want to compare before and after states, or when you want to remove cached memory from the equation before opening a heavy app.

## Caveats

- macOS normally manages memory well on its own.
- Clearing caches is not the same as "fixing RAM."
- Use this as a specific experiment, not as a superstition or ritual.
