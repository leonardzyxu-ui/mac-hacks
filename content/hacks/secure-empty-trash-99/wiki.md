## Overview

Secure deletion used to be a more visible part of macOS, but on modern systems it is mostly a historical workflow. The old `srm`-style approach attempted to overwrite data before deletion, which made sense in older storage contexts but is no longer a standard modern Mac feature.

## How to use it

1. Check whether the command or workflow is even supported on the macOS version you are using.
2. If it is supported in your environment, run it only on the exact target you intend.
3. Verify the result carefully.
4. Treat modern compatibility limits as part of the hack, not as a surprise.

## Why it matters

This entry is mainly useful as a compatibility and systems-history note. It explains an older secure-deletion idea that people still search for even though Apple's storage and platform direction moved away from it.

## Caveats

- Modern macOS versions removed or limited the old secure-empty-trash path.
- SSD behavior complicates assumptions about overwrite-based deletion.
- If secure disposal truly matters, broader device and encryption strategy matters more than nostalgia for one old command.
