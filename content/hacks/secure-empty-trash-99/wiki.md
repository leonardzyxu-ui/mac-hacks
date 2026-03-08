## What this command does

Secure Empty Trash is a higher-risk Terminal hack for Terminal. Removed on modern macOS; see Compatibility notes. The convenience can be real, but the main question here is not "can I run it?" so much as "do I fully understand why I am running it and how I will back out afterward?"

## Exact command

```sh
srm -v <path-to-file>
```

## Before you run it

1. Open Terminal in an admin-capable account if the command needs elevated privileges.
2. Read `srm -v <path-to-file>` from left to right and make sure every flag still matches your intent.
3. Know what success looks like before you press Return.
4. Know what the rollback step is before you rely on the result.

## When it is actually justified

- when the built-in macOS UI does not expose the behavior you need directly
- when you have a concrete reason for the change rather than vague curiosity
- when you are comfortable restoring the old state immediately after the special case is over

## Main risks

- Security-sensitive or destructive commands are easy to run faster than you can think through their consequences.
- A short command can still alter system-wide behavior in ways that outlive the immediate task.
- Compatibility matters more here than on ordinary shortcuts, because Apple changes or removes some of these behaviors across releases.

## Good to know

This is primarily historical now. Modern macOS versions removed the old Secure Empty Trash workflow, which is why compatibility matters more here than on most entries.
## Compatibility notes

- The repo also marks it as relevant only through macOS 10.11.
- The `srm` tool was removed from macOS Sierra (10.12). On modern macOS (APFS/SSD), secure deletion of individual files is not reliably guaranteed due to wear leveling and snapshots. Prefer FileVault (encryption) and rotating keys, or wiping entire external drives when appropriate.
## Undo or revert

- Treat this as something you understand before you run it, because the rollback path may be limited or manual.
- If the hack affects a system preference, reapply the opposite setting or return the system to its previous state as directly as possible.
