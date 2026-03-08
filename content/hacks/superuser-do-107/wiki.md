## What this command does

Superuser Do is a higher-risk Terminal hack for Terminal. Use with caution. The convenience can be real, but the main question here is not "can I run it?" so much as "do I fully understand why I am running it and how I will back out afterward?"

## Exact command

```sh
sudo
```

## Before you run it

1. Open Terminal in an admin-capable account if the command needs elevated privileges.
2. Read `sudo` from left to right and make sure every flag still matches your intent.
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

## Undo or revert

- Treat this as something you understand before you run it, because the rollback path may be limited or manual.
- If the hack affects a system preference, reapply the opposite setting or return the system to its previous state as directly as possible.
