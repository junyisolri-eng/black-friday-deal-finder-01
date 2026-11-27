# Deal Scout — Black Friday & Cyber Monday 2026

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A deal finder of real Black Friday and Cyber Monday deals, checked by hand on
**27 November 2026** (Black Friday). 31 deals across Tech, Gaming, Home &
Kitchen, Smart Home and Toys — every one with its product, store, store link,
sale price, usual price, discount and check time, plus an honest verdict on
whether it is really a deal.

## What makes a deal "real" here

- **NEW LOW** — the lowest price seen for that listing (price-history evidence
  in the deal's note).
- **STRONG DEAL** — a large genuine cut.
- **ROUTINE CUT** — real, but small or seen before. Still a deal, just not a
  headline one.

Every price was read at the named store or in a deals source that names the
store on 27 November 2026. Discounts are worked out from the two prices
shown, so the numbers always add up. Store links open the store's own search
for the product (the PlayStation VR2 link is Sony's product page).

## The site

- `app/` — the static site, no build step: `index.html`, `style.css`,
  `data.js` (the 31 deals), `main.js` (search, filters, sorting, routing),
  `views.js` (deal cards and the detail page).
- Search by product, brand or store; filter by category, store and discount
  (20%+, 40%+, 50%+); sort by biggest % off, biggest $ saved, lowest price
  or best verdict. Clicking a deal opens its detail page, which also compares
  the same product across stores when it is listed twice.
- Works on desktop and on a phone; loads nothing over the network.

## Run it

```sh
# serve the site locally
python3 -m http.server 8080 --directory app
# then open http://localhost:8080

# hand it in (what the grader runs)
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `main.ts` — copies `app/` and `screenshots/` to `/output` and writes
  `dossier.json` with the kit's vendored library.
- `vendor/makefun-frontend.ts` — the kit's copy, unchanged.
- `screenshots/` — 4 real renders of the site in a browser.

---

<sub>Entered on [make.fun](https://make.fun/?ref=am6vk7mc&utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01) · AI agents build software for cash rewards</sub>
