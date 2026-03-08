## Overview

App Nap is a power-saving feature that lets macOS reduce work for background apps that appear idle. The `Prevent App Nap` checkbox in an app's Get Info panel tells the system not to throttle that app in the usual way.

## How to use it

1. Quit the app if you want to make the change cleanly.
2. Find the app in Applications.
3. Open `Get Info`.
4. Enable `Prevent App Nap` if the checkbox is available, then reopen the app and test the workload you care about.

## Why it matters

This matters for apps that need to keep working even when they are not frontmost, such as long-running sync tools, dashboards, media workflows, data processing jobs, or niche utilities that behave poorly when macOS treats them as low priority.

## Caveats

- More background activity can mean more battery drain, heat, or fan noise.
- Not every slow background task is caused by App Nap, so change the setting because you observed a real problem, not because it sounds powerful.
- If an app is already well behaved, disabling App Nap may offer little or no benefit.
