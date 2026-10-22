// Builds the static site into _site/: both languages, calendar feeds, redirects
// for old URLs and the sitemap. No dependencies; needs Node 20+.
//
//   node scripts/build.mjs
//
// It also updates calendar-revisions.json when an event changes; commit that file
// so calendar apps see the new revision number.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { site, events, merch } from "../src/content.mjs";
import { pages, layout, renderPage, notFoundPage, esc } from "../src/templates.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = path.join(root, "src");
const out = path.join(root, "_site");
const revisionsFile = path.join(root, "calendar-revisions.json");
const base = site.basePath;

// ---------------------------------------------------------------------------
// Validate content before building anything
// ---------------------------------------------------------------------------
const problems = [];
const ids = new Set();
for (const e of events) {
  if (ids.has(e.id)) problems.push(`Duplicate event id "${e.id}"`);
  ids.add(e.id);
  if (e.date && (!/^\d{4}-\d{2}-\d{2}$/.test(e.date) || new Date(e.date + "T12:00:00Z").toISOString().slice(0, 10) !== e.date))
    problems.push(`Event "${e.id}" has an invalid date "${e.date}" (use YYYY-MM-DD)`);
  for (const k of ["title", "summary", "poster"]) if (!e[k]?.en || !e[k]?.ar) problems.push(`Event "${e.id}" is missing ${k} in English or Arabic`);
}
for (const p of merch) {
  for (const f of ["studio", "card", "1", "2", "3", "4"]) {
    if (!fs.existsSync(path.join(src, "assets/merch", `${p.id}-${f}.jpg`))) problems.push(`Missing image src/assets/merch/${p.id}-${f}.jpg`);
  }
}
if (problems.length) {
  console.error("Content problems:\n  " + problems.join("\n  "));
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Assets (copied with content hashes for cache busting)
// ---------------------------------------------------------------------------
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(src, "assets"), path.join(out, "assets"), { recursive: true });
const hashes = new Map();
function asset(p) {
  if (!hashes.has(p)) {
    const file = path.join(src, "assets", p);
    if (!fs.existsSync(file)) throw Error(`Missing asset: ${p}`);
    hashes.set(p, crypto.createHash("sha1").update(fs.readFileSync(file)).digest("hex").slice(0, 8));
  }
  return `${base}assets/${p}?v=${hashes.get(p)}`;
}

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------
function edmontonToday() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  const get = (k) => parts.find((x) => x.type === k).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
// SITE_TODAY=YYYY-MM-DD overrides the build date (handy for previewing how events will be sorted).
const today = process.env.SITE_TODAY || edmontonToday();

function context(lang) {
  const c = {
    lang,
    dir: lang === "ar" ? "rtl" : "ltr",
    locale: lang === "ar" ? "ar-SD" : "en-CA",
    year: today.slice(0, 4),
    today,
    t: (pair) => pair[lang],
    tr: (en, ar) => (lang === "ar" ? ar : en),
    base,
    asset,
    urlFor: (key, l = lang) => base + (l === "ar" ? "ar/" : "") + pages[key].path,
  };
  return c;
}

function write(rel, html) {
  const file = path.join(out, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}

let count = 0;
for (const lang of ["en", "ar"]) {
  const c = context(lang);
  for (const key of Object.keys(pages)) {
    const rel = (lang === "ar" ? "ar/" : "") + (pages[key].path || "index.html");
    write(rel, layout(c, key, renderPage(c, key)));
    count++;
  }
}

// 404 (GitHub Pages serves /404.html for every missing path; ar/404.html is its translation)
pages["404"] = { path: "404.html", title: { en: "Page not found", ar: "الصفحة غير موجودة" }, description: { en: "Page not found.", ar: "الصفحة غير موجودة." } };
for (const lang of ["en", "ar"]) {
  const c = context(lang);
  const html = layout(c, "404", notFoundPage(c))
    .replace(/<link rel="(canonical|alternate)"[^>]*>\n/g, "")
    .replace("<head>", '<head>\n<meta name="robots" content="noindex">')
    .replace(/try\{if\(localStorage[^<]*/, "");
  write((lang === "ar" ? "ar/" : "") + "404.html", html);
}
delete pages["404"];

// Redirects for URLs from the previous version of the site
function redirect(rel, to, script = "") {
  write(
    rel,
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moved · SSO UofA</title><meta name="robots" content="noindex"><link rel="canonical" href="${site.url}${to.slice(base.length - 1)}"><meta http-equiv="refresh" content="0;url=${esc(to)}">${script ? `<script>${script}</script>` : ""}</head><body><p>This page moved to <a href="${esc(to)}">${esc(to)}</a>.</p></body></html>\n`,
  );
}
redirect("volunteer.html", `${base}contact.html#volunteer`);
redirect("gallery.html", `${base}events.html#past`);
redirect("checkout.html", `${base}merch.html`);
redirect("manage.html", base);
const productIds = JSON.stringify(merch.map((p) => p.id));
redirect(
  "product.html",
  `${base}merch.html`,
  `var i=new URLSearchParams(location.search).get("item");if(${productIds}.indexOf(i)>-1)location.replace("${base}merch/"+i+".html")`,
);

// ---------------------------------------------------------------------------
// Calendar feeds
// ---------------------------------------------------------------------------
const oldRevisions = fs.existsSync(revisionsFile) ? JSON.parse(fs.readFileSync(revisionsFile, "utf8")) : {};
const revisions = {};
const stampNow = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const dated = events.filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date));
for (const e of dated) {
  const hash = crypto.createHash("sha256").update(JSON.stringify(e)).digest("hex");
  const prev = oldRevisions[e.id];
  revisions[e.id] = prev?.hash === hash ? prev : { hash, stamp: stampNow, sequence: prev ? prev.sequence + 1 : 0 };
}

const icsText = (s) => s.replace(/<br>/g, " ").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
function fold(line) {
  // RFC 5545: lines longer than 75 octets are folded with CRLF + space.
  const parts = [];
  let part = "";
  let size = 0;
  for (const ch of line) {
    const bytes = Buffer.byteLength(ch);
    if (size + bytes > 73) {
      parts.push(part);
      part = " " + ch;
      size = 1 + bytes;
    } else {
      part += ch;
      size += bytes;
    }
  }
  parts.push(part);
  return parts.join("\r\n");
}
function calendar(list) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SSO UofA//Community Calendar//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:SSO UofA Events", "X-WR-TIMEZONE:America/Edmonton", "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H"];
  for (const e of list) {
    const next = new Date(e.date + "T12:00:00Z");
    next.setUTCDate(next.getUTCDate() + 1);
    const rev = revisions[e.id];
    const description = [e.summary.en, e.time && `Time: ${e.time.en}`, e.venue && `Where: ${e.venue.en}`, e.source && `Details: ${e.source}`].filter(Boolean).join("\n");
    lines.push(
      "BEGIN:VEVENT",
      `UID:sso-${e.id}@${site.calendarUidDomain}`,
      `DTSTAMP:${rev.stamp}`,
      `SEQUENCE:${rev.sequence}`,
      `DTSTART;VALUE=DATE:${e.date.replaceAll("-", "")}`,
      `DTEND;VALUE=DATE:${next.toISOString().slice(0, 10).replaceAll("-", "")}`,
      `SUMMARY:${icsText(e.title.en)}`,
      `DESCRIPTION:${icsText(description)}`,
      ...(e.venue ? [`LOCATION:${icsText(e.venue.en)}`] : []),
      ...(e.source ? [`URL:${e.source}`] : []),
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
write("sso-events.ics", calendar(dated));
for (const e of dated) {
  fs.mkdirSync(path.join(out, "assets/events"), { recursive: true });
  fs.writeFileSync(path.join(out, "assets/events", `${e.id}.ics`), calendar([e]));
}
fs.writeFileSync(revisionsFile, JSON.stringify(revisions, null, 2) + "\n");

// ---------------------------------------------------------------------------
// Sitemap, robots, GitHub Pages marker
// ---------------------------------------------------------------------------
const urls = Object.keys(pages).flatMap((key) => ["en", "ar"].map((l) => site.url + context(l).urlFor(key).slice(base.length - 1)));
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
write(".nojekyll", "");

// ---------------------------------------------------------------------------
// Check every internal link and asset reference resolves to a built file
// ---------------------------------------------------------------------------
const broken = [];
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));
}
for (const file of walk(out).filter((f) => f.endsWith(".html"))) {
  const html = fs.readFileSync(file, "utf8");
  for (const [, url] of html.matchAll(/(?:href|src|content)="([^"]+)"/g)) {
    let target = url.replace(/&amp;/g, "&");
    if (target.startsWith(site.url)) target = base + target.slice(site.url.length + 1);
    if (!target.startsWith(base)) continue;
    const clean = decodeURIComponent(target.split(/[?#]/)[0].slice(base.length));
    const resolved = path.join(out, clean || "index.html");
    const exists = fs.existsSync(resolved) && (fs.statSync(resolved).isFile() || fs.existsSync(path.join(resolved, "index.html")));
    if (!exists) broken.push(`${path.relative(out, file)} → ${url}`);
  }
}
if (broken.length) {
  console.error("Broken internal links:\n  " + [...new Set(broken)].join("\n  "));
  process.exit(1);
}

console.log(`Built ${count} pages and ${dated.length} calendar events into _site/ (Edmonton date ${today}).`);
