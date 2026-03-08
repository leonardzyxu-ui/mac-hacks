## Overview

`networkQuality` runs Apple's built-in network test, which focuses on responsiveness as well as throughput. That makes it more useful than a raw speed number when you are trying to understand how the connection will actually feel.

## How to use it

1. Open Terminal.
2. Run `networkQuality`.
3. Wait for the test to complete.
4. Read the reported upload, download, and responsiveness values.

## Why it matters

This is a strong first check when internet performance feels wrong. It helps distinguish "the network is slow" from "the network is high-latency" and gives you something concrete before you start blaming the browser or a specific app.

## Caveats

- Results reflect the current network conditions, not a permanent truth.
- Wi-Fi quality, router load, and background traffic can all skew the result.
- One test is useful, but comparing a few runs is often more informative.
