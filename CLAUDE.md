# My Hub

A personal **PWA dashboard launcher** — a home screen that links to several dashboards, used on iPhone, Mac, and Windows. Owned by GitHub user **cree02**.

- **Live:** https://cree02.github.io/my-hub/ (GitHub Pages, served from the `/my-hub/` subpath)
- **No build step, no Node.js.** Plain static HTML + in-browser React/Babel where needed. Do not add a bundler or framework tooling.
- The user is **non-technical** and deploys by uploading files through the GitHub web UI. Keep changes simple and self-contained; explain any required upload steps plainly.

## Structure
- `index.html` — the hub home screen (cards linking to each dashboard)
- `manifest.json` — PWA manifest. `start_url` and `scope` MUST stay `/my-hub/` or the installed app 404s.
- `sw.js` — service worker. Precache paths are **relative** (so they work on the subpath). Bump the `CACHE` version string (e.g. `hub-v6` → `hub-v7`) on EVERY change to a cached file, or devices serve stale copies.
- `icons/` — app icons (`icon-192.png`, `icon-512.png`), "Hub & Spokes" design.
- `dashboards/`:
  - `ledger.html` — "Chris & James" shared expense tracker. Data lives in **Firebase Realtime Database** (project `chris-james-ledger`, path `transactions`), NOT in the HTML. Loads with one-time `get()` then `onChildAdded/Changed/Removed` for live updates (do not revert to a single `onValue` — it could blank the list on a slow sync). ME="Chris", THEM="James".
  - `one-on-one-hub.html` — "1:1 Hub". React/Babel app with landing → manager/employee login → dashboards.
  - `first-101.html` — "First 1:1 Guide". Uses **localStorage** (per-device). Has a "Finish & Export" → "Save as PDF" flow via the browser print dialog.

## Conventions
- Every dashboard has a **← Hub** button linking back to `https://cree02.github.io/my-hub/`.
- Match each dashboard's existing visual style (dark navy/blue hub; the 1:1 Hub and ledger have their own palettes).
- After changing any cached file, **bump the `sw.js` CACHE version**.
- When adding a new dashboard: drop its HTML in `dashboards/`, add a ← Hub button, add a card in `index.html`, add it to the `sw.js` precache list, and bump the cache.
