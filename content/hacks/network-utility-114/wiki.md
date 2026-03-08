## Overview

Network Utility was the old graphical grab bag for commands like ping, traceroute, and port lookups. On newer versions of macOS, it is less visible and in some setups effectively replaced by Terminal-based tools, but the idea behind the hack is still useful: macOS already includes serious networking diagnostics if you know where to look.

## How to use it

1. Decide what you are actually testing: reachability, route, name resolution, or open ports.
2. If the app is available on your system, launch it from its deeper system location.
3. If it is not, use the Terminal equivalents instead of hunting endlessly through Applications.
4. Run the smallest diagnostic that answers the question.

## Why it matters

Most "the internet is broken" problems are not really internet problems. They are DNS issues, a bad route, a dead host, a firewall rule, or a local network problem. A simple built-in diagnostic can tell you which category you are in before you waste time restarting random hardware.

## Caveats

- Network Utility availability varies across macOS versions.
- These tools explain symptoms; they do not automatically fix them.
- Use production hosts carefully when testing, especially if you are generating repeated requests.
