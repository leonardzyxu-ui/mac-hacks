## What the command changes

Change Screenshot Location is a Terminal tweak for Terminal. Change save location from Desktop to elsewhere. This family of commands is useful because it changes a preference or system behavior directly, without requiring you to hunt for a visible toggle in the interface.

## Exact command

```sh
mkdir -p "$HOME/Pictures/Screenshots" && defaults write com.apple.screencapture location "$HOME/Pictures/Screenshots" && killall SystemUIServer
```

## Safe way to run it

1. Open Terminal.
2. Paste or type `mkdir -p "$HOME/Pictures/Screenshots" && defaults write com.apple.screencapture location "$HOME/Pictures/Screenshots" && killall SystemUIServer`.
3. Press Return to run it.
4. Check the outcome described by the hack: Change save location from Desktop to elsewhere.

## What changes afterward

Commands built around `defaults write` usually change a stored preference. That means the effect can persist across app relaunches and future sessions until you reverse it.

Most of these tweaks are not dangerous by themselves, but they are easy to forget later, which is why it helps to keep the undo path close by.

## What to watch for

- If the command includes `killall`, the named app or service will restart as part of the change.
- Preference tweaks can appear to do nothing until the affected app or service is reopened.
- Small cosmetic or workflow tweaks can still be confusing later if you forget that you changed the default.

## Undo or revert

- Run `defaults write com.apple.screencapture location "$HOME/Desktop" && killall SystemUIServer` if you want to reverse the change.
- Reopen the affected app or service after reverting if the result is not immediate.
