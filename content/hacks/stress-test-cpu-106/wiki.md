## Overview

The classic `yes > /dev/null` trick creates a synthetic CPU load. It is deliberately wasteful, and that is the point: you use it to test thermals, fan behavior, power draw, and how the Mac reacts under sustained pressure.

## How to use it

1. Open Terminal.
2. Start one or more stress processes.
3. Watch CPU, temperature, and fan behavior with the tool of your choice.
4. Kill the processes when you are done.

## Why it matters

Synthetic load is useful for diagnosing throttling, checking whether cooling still behaves properly, or validating whether a machine can survive a sustained burst without crashing or overheating.

## Caveats

- This is intentionally abusive to the CPU.
- It can make the machine hot, loud, and battery-hungry very quickly.
- Always know how to stop the stress processes before you start them.
