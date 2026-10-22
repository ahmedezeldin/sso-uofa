# SSO UofA website

Bilingual (English / Arabic) website for the Sudanese Students Organization at the University of Alberta.

- Live site: https://ahmedezeldin.com/sso-uofa/ (Arabic: `/sso-uofa/ar/`)
- Hosting: GitHub Pages, published by GitHub Actions on every push to `main` and once a day.

## Editing content

Almost everything you'd want to change is in **[`src/content.mjs`](src/content.mjs)**:

| What | Where in `content.mjs` |
| --- | --- |
| Instagram, Rubric, volunteer WhatsApp link, newsletter link | `site` |
| Events (upcoming and past) | `events` |
| Executive team | `team` |
| Merch names, prices, sizes, descriptions | `merch` |
| Links on "New here?" and "Student resources" | `newStudentLinks`, `campusTools` |
| Home page FAQ | `faqs` |

Every piece of text is written as `L("English", "العربية")`, so both languages stay in sync.

### Adding an event

Add an entry to `events`:

```js
{
  id: "eid-dinner-2027",            // unique, never change it after publishing
  date: "2027-03-20",               // YYYY-MM-DD, Edmonton time
  category: "community",            // "culture" or "community"
  poster: L("Eid<br>dinner", "عشاء<br>العيد"),
  posterStyle: "nile",              // "nile", "bbq" or "film"
  title: L("Eid dinner", "عشاء العيد"),
  summary: L("…", "…"),
  time: L("6–9 pm", "٦–٩ مساءً"),   // optional
  venue: L("SUB 4th floor", "…"),   // optional
  source: "https://www.instagram.com/p/…", // optional link to the announcement
},
```

Events move from "Upcoming" to "Past" on their own. The calendar feed (`/sso-events.ics`) updates for everyone subscribed.

### Team photos

Put portraits in `src/assets/team/` (portrait orientation, about 800×1000, JPEG), then add `photo: "team/name.jpg"` to that person in `team`.

### Sudanese touches

The illustration is a kit of parts in [`src/art.mjs`](src/art.mjs) (sun, Meroë pyramids, doum palms, the Nile, felucca, jebena, textiles) reused across the site: the home landscape, a small scene in each page header, the footer skyline, the felucca that sails along the header as you scroll, and the Nile-wave section edges. All animation stops for visitors who prefer reduced motion.

There are a few easter eggs to keep: click the jebena (on the picnic rug), the sun or the felucca in the home landscape; type "shai" or "sudan" anywhere; the footer shows a random Sudanese saying (`proverbs` in `content.mjs`) and says Jumu‘ah Mubarak on Fridays. The words in the scrolling band are `tickerWords`.

## Running it locally

You need [Node.js](https://nodejs.org) 20 or newer. No packages to install.

```bash
npm start
```

That builds the site into `_site/` and serves it at http://localhost:8080/sso-uofa/.

`npm run build` only builds. The build fails, with a message, if content is invalid (a bad date, duplicate event ID, missing merch image) or if any internal link is broken.

When you change an event, the build also updates `calendar-revisions.json`. Commit that file along with your change so calendar apps notice the update.

## How it's put together

```
src/content.mjs      all text and data
src/templates.mjs    page layouts (HTML)
src/art.mjs          the illustration kit (SVG) and scenes
src/assets/          CSS, the small site.js, images
scripts/build.mjs    renders every page in both languages, calendar feeds, sitemap, redirects
scripts/serve.mjs    local preview server
```

Pages are plain HTML generated at build time, so they load fast, work without JavaScript and can be found by search engines. `site.js` only adds the mobile menu, the copy button, live prayer times and live upcoming/past sorting.

## Status

- **Membership** goes to the club's Rubric page.
- **Contact and volunteering** go through Instagram DMs until a WhatsApp invite link or newsletter link is added to `site` in `content.mjs`. The pages switch over automatically.
- **Merch** is a preview only. Prices are estimates and the product images are AI-generated mock-ups.
- Prayer times come from the public feed used by [MSA UofA](https://www.msauofa.ca/).

This repository is maintained under Ahmed's account and can be transferred to a club-owned GitHub organization later.
