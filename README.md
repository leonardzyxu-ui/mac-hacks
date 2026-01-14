# mac-hacks

Static “Mac Hacks Dictionary” site with search, favorites, filters, and a separate wiki-style HTML page for every hack.

## Usage

- Open `index.html` in a browser.
- Click any hack card to open its wiki page in `hacks/<slug>.html`.
- Use filters to browse by `App`, `Type`, `Topic`, and `Method`.
- On a hack page, click classification chips (App/Type/Topic/Method/Keyword) to jump back to filtered results.

## Content + generation

- Source of truth: `data/hacks.json`
- Generator: `node scripts/generate.mjs` (rebuilds `assets/hacks-data.js` and `hacks/*.html`)
- Optional: add `wiki` fields per hack in `data/hacks.json` (e.g., `wiki.steps`, `wiki.tips`) to override the generated content.
