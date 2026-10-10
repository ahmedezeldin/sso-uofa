# SSO UofA website

Public website: https://ahmedezeldin.com/sso-uofa/

GitHub Pages address: https://ahmedezeldin.github.io/sso-uofa/ (redirects to the existing account-level custom domain). Hosting uses GitHub Pages free hosting; no new domain was purchased.

A bilingual student community website with events, a shared calendar subscription, volunteer information and merchandise galleries.

## Updating the site

Edit files in `dist/` and push to `main`. GitHub Actions regenerates the calendar feed and publishes automatically. The event list is in `dist/app.js`; keep event IDs unchanged when editing dates. Calendar revision records are in `calendar-revisions.json`. Run `node scripts/build-calendar.mjs` locally after event edits and commit both the feed and revision file so revision numbers persist.

## Preview locally

Serve the `dist` directory under the `/sso-uofa/` path so navigation matches the published site. The deployment has no dependencies or build step beyond regenerating the calendar feed.

## Launch status

Membership links to the club's public Rubric page. Contact delivery, newsletter subscriptions, WhatsApp registration and paid merchandise ordering are not connected. The checkout reviews a local bag only. Product gallery/model imagery is AI-generated; material specifications and final prices remain subject to physical samples and club approval. No personal form data is sent or saved by the checkout.

This repository is currently maintained under Ahmed's account. It can be transferred to a club-owned GitHub organization when the club is ready.
