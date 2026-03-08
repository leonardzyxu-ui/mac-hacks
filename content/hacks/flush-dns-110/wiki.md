## Overview

Flushing DNS clears the Mac's local DNS cache so hostname lookups are resolved fresh again. This is a troubleshooting command: it is useful when a site should have moved, a domain is resolving incorrectly, or cached network information seems stale.

## How to use it

1. Open Terminal.
2. Run the flush-DNS command with administrator privileges if required.
3. Retry the hostname or website you were testing.
4. Compare the new behavior with what happened before the flush.

## Why it matters

DNS problems are frustrating because they look like internet problems even when the network connection itself is fine. Clearing the cache is a quick way to remove one layer of stale state before digging deeper.

## Caveats

- This only clears cached lookup data; it does not fix upstream DNS outages.
- The exact command can vary across macOS versions.
- If the problem is elsewhere in the network path, flushing DNS will not magically solve it.
