# mac-hacks

Static Mac Hacks site built for GitHub Pages.

The repo is now split into source content, source app files, and generated deploy output:

- `apps/site/src/`: hand-authored site shell and browser JS
- `content/hacks/<slug>/`: one folder per hack
- `docs/`: generated static site that GitHub Pages can serve directly
- `scripts/generate.mjs`: static site generator

## Content model

Each hack lives in its own directory:

- `content/hacks/<slug>/meta.json`: metadata used for cards, filters, and generated quick-reference sections
- `content/hacks/<slug>/wiki.md`: optional long-form markdown for the detailed wiki page

This keeps long wiki content out of the homepage dataset. The homepage only gets summary metadata through generated `docs/assets/hacks-data.js`.

## Build

Run:

```sh
npm run build
```

This rebuilds `docs/` from:

- `apps/site/src/index.html`
- `apps/site/src/assets/*`
- `content/hacks/*`

## GitHub Pages

Deploy the `docs/` directory. The generated site is fully static:

- homepage: `docs/index.html`
- one page per hack: `docs/hacks/<slug>/index.html`

## Legacy seed data

The original one-file dataset was preserved as a migration artifact at `scripts/legacy/hacks.seed.json`. It is not the active source of truth anymore.
