## Overview

`curl -O` downloads a file directly from a URL into the current Terminal directory. It is the command-line version of clicking a download link in a browser, and it is useful when you want a precise, repeatable fetch instead of a browser-managed download flow.

## How to use it

1. Open Terminal.
2. Change into the folder where you want the file saved, if needed.
3. Run `curl -O` with the target URL.
4. Confirm that the file appears in the directory afterward.

## Why it matters

This is helpful for scripts, repeatable setup steps, server downloads, or situations where you already have a direct file URL and do not want to involve the browser at all.

## Caveats

- The URL has to point to the file you actually want, not just to a webpage.
- Running it in the wrong directory can make the file feel lost later.
- Downloading arbitrary URLs blindly is still a bad idea.
