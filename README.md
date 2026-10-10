# SSO UofA website

Public website: https://ahmedezeldin.github.io/sso-uofa/

A bilingual student community website with events, a shared calendar subscription, volunteer information and merchandise galleries.

## Updating the site

Edit files in `dist/` and push to `main`. GitHub Actions regenerates the calendar feed and publishes automatically. The event list is in `dist/app.js`; keep event IDs unchanged when editing dates. Calendar revision records are in `calendar-revisions.json`. Run `node scripts/build-calendar.mjs` locally after event edits and commit both the feed and revision file so revision numbers persist.

## Preview locally

From the parent directory: `python3 -m http.server 8767` and open http://localhost:8767/sso-uofa-github/dist/index.html . For the correct GitHub path, create a local `sso-uofa` link to this repository's `dist` directory and open http://localhost:8767/sso-uofa/ .

## Launch status

Membership links to the club's public Rubric page. Contact delivery, newsletter subscriptions, WhatsApp registration and paid merchandise ordering are not connected. The checkout reviews a local bag only. Product gallery/model imagery is AI-generated; material specifications and final prices remain subject to physical samples and club approval. No personal form data is sent or saved by the checkout.

This repository is currently maintained under Ahmed's account. It can be transferred to a club-owned GitHub organization when the club is ready.
