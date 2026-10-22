// Page templates. Each page function receives a context `c` for one language and
// returns the HTML for <main>. `layout` wraps it with the shared head, header and footer.
import {
  site,
  events,
  eventCategories,
  team,
  merch,
  newStudentLinks,
  campusTools,
  faqs,
  proverbs,
  tickerWords,
} from "./content.mjs";
import { heroScene, vignette, skyline, waveEdge, voyage, brewing } from "./art.mjs";

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

// Pages that exist in both languages. `path` is relative to the language root.
export const pages = {
  home: { path: "", title: null, description: L2("Sudanese Students Organization at the University of Alberta: culture, connection and community.", "منظمة الطلاب السودانيين في جامعة ألبرتا: ثقافة وتواصل ومجتمع.") },
  events: { path: "events.html", title: L2("Events", "الفعاليات"), description: L2("Upcoming SSO gatherings, past highlights and a calendar you can subscribe to.", "لقاءات المنظمة القادمة واللقطات السابقة وتقويم يمكنك الاشتراك فيه.") },
  guide: { path: "guide.html", title: L2("New here?", "جديد هنا؟"), description: L2("A few starting points for your first weeks at the University of Alberta.", "نقاط بداية لأسابيعك الأولى في جامعة ألبرتا.") },
  resources: { path: "resources.html", title: L2("Student resources", "موارد الطلاب"), description: L2("Campus prayer times and the university tools you use every week.", "مواقيت الصلاة في الجامعة والأدوات الجامعية التي تستخدمها كل أسبوع.") },
  merch: { path: "merch.html", title: L2("Merch", "المنتجات"), description: L2("The first SSO UofA collection, inspired by Sudan and made for campus life.", "أول مجموعة لمنظمة الطلاب السودانيين، مستوحاة من السودان ومصممة لحياة الجامعة.") },
  team: { path: "team.html", title: L2("Our team", "فريقنا"), description: L2("Meet the SSO UofA executive team.", "تعرّف على الفريق التنفيذي للمنظمة.") },
  contact: { path: "contact.html", title: L2("Get involved", "شارك معنا"), description: L2("Join SSO, volunteer, suggest a collaboration or send the team a message.", "انضم للمنظمة أو تطوّع أو اقترح تعاوناً أو راسل الفريق.") },
};
for (const p of merch) {
  pages["product-" + p.id] = { path: `merch/${p.id}.html`, title: p.name, description: p.summary, product: p };
}
function L2(en, ar) {
  return { en, ar };
}

const navItems = ["events", "guide", "resources", "merch", "team", "contact"];

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------
const external = 'target="_blank" rel="noopener"';

function arrow(c) {
  return `<span class="arrow" aria-hidden="true">${c.lang === "ar" ? "←" : "→"}</span>`;
}
function extIcon() {
  return `<svg class="ext" viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
}
function sectionHead(c, { kicker, title, intro, id, level = 2 }) {
  return `<div class="section-head">
  <p class="eyebrow">${kicker}</p>
  <h${level}${id ? ` id="${id}"` : ""}>${title}</h${level}>
  ${intro ? `<p class="intro">${intro}</p>` : ""}
</div>`;
}
// Inner-page header band; `scene` picks the small animated illustration on its end side (see art.mjs).
function pageHead(c, { kicker, title, intro, scene }) {
  return `<div class="page-head"><div class="wrap">${sectionHead(c, { kicker, title, intro, level: 1 })}</div>${scene ? vignette(scene) : ""}</div>`;
}

export function formatDate(c, iso, opts = { year: "numeric", month: "long", day: "numeric" }) {
  return new Intl.DateTimeFormat(c.locale, { timeZone: "UTC", ...opts }).format(new Date(iso + "T12:00:00Z"));
}
function price(c, n) {
  return new Intl.NumberFormat(c.locale, { style: "currency", currency: "CAD", currencyDisplay: "code", maximumFractionDigits: 0 }).format(n);
}

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------
export function layout(c, key, main) {
  const page = pages[key];
  const title = page.title ? `${c.t(page.title)} · SSO UofA` : c.tr("SSO UofA · Sudanese Students Organization at the University of Alberta", "منظمة الطلاب السودانيين · جامعة ألبرتا");
  const other = c.lang === "en" ? "ar" : "en";
  const langSwitch = c.urlFor(key, other);
  const canonical = site.url + c.urlFor(key).slice(site.basePath.length - 1);
  const alt = (lang) => site.url + c.urlFor(key, lang).slice(site.basePath.length - 1);
  return `<!doctype html>
<html lang="${c.lang}" dir="${c.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(c.t(page.description))}">
<meta name="theme-color" content="#612c32">
<link rel="canonical" href="${canonical}">
<link rel="alternate" hreflang="en" href="${alt("en")}">
<link rel="alternate" hreflang="ar" href="${alt("ar")}">
<link rel="alternate" hreflang="x-default" href="${alt("en")}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SSO UofA">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(c.t(page.description))}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.url}/assets/${page.product ? `merch/${page.product.id}-studio.jpg` : "og-image.jpg"}">
<meta property="og:locale" content="${c.lang === "ar" ? "ar_SD" : "en_CA"}">
<link rel="icon" href="${c.asset("club-logo.jpg")}" type="image/jpeg">
<link rel="apple-touch-icon" href="${c.asset("club-logo.jpg")}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${c.asset("site.css")}">
<script>document.documentElement.classList.add("js");${
    c.lang === "en"
      ? `try{if(localStorage.getItem("sso-lang")==="ar")location.replace(${JSON.stringify(c.urlFor(key, "ar"))}+location.hash)}catch(e){}`
      : ""
  }</script>
<script src="${c.asset("site.js")}" defer></script>
<script type="application/json" id="egg-messages">${JSON.stringify({
    shai: c.tr("Shai with milk or without? (With. Obviously.)", "شاي بلبن ولا سادة؟ (بلبن طبعاً)"),
    sudan: c.tr("السودان في القلب · Sudan, always in our hearts.", "السودان في القلب."),
  }).replace(/</g, "\\u003c")}</script>
</head>
<body data-page="${key.startsWith("product-") ? "product" : key}">
<a class="skip" href="#main">${c.tr("Skip to content", "انتقل إلى المحتوى")}</a>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="${c.urlFor("home")}">
      <img src="${c.asset("club-logo.jpg")}" alt="" width="44" height="44">
      <span><b>SSO <span>UofA</span></b><small>${c.tr("Sudanese Students Organization", "منظمة الطلاب السودانيين")}</small></span>
    </a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-label-open="${c.tr("Open menu", "فتح القائمة")}" data-label-close="${c.tr("Close menu", "إغلاق القائمة")}" aria-label="${c.tr("Open menu", "فتح القائمة")}"><span></span><span></span><span></span></button>
    <nav id="site-nav" class="site-nav" aria-label="${c.tr("Main", "الرئيسية")}">
      <ul>${navItems
        .map((n) => {
          const current = key === n || (n === "merch" && key.startsWith("product-"));
          return `<li><a href="${c.urlFor(n)}"${current ? ' aria-current="page"' : ""}>${c.t(pages[n].title)}</a></li>`;
        })
        .join("")}</ul>
      <a class="lang-switch" href="${langSwitch}" hreflang="${other}" lang="${other}" data-set-lang="${other}">${other === "ar" ? "العربية" : "English"}</a>
      <a class="button small" href="${site.membership}" ${external}>${c.tr("Become a member", "انضم للمنظمة")}</a>
    </nav>
  </div>
  ${voyage()}
</header>
<main id="main">
${main}
</main>
<footer class="site-footer">
  ${skyline()}
  <div class="wrap footer-grid">
    <div>
      <a class="brand" href="${c.urlFor("home")}"><img src="${c.asset("club-logo.jpg")}" alt="" width="44" height="44" loading="lazy"><span><b>SSO <span>UofA</span></b><small>${c.tr("Sudanese Students Organization", "منظمة الطلاب السودانيين")}</small></span></a>
      <p>${c.tr("Sudanese roots. Edmonton connections. A shared home at the University of Alberta.", "جذور سودانية وروابط في إدمونتون. بيت يجمعنا في جامعة ألبرتا.")}</p>
      <figure class="proverb" data-proverbs="${esc(JSON.stringify(proverbs.map((p) => ({ ar: p.ar, gloss: c.lang === "en" ? p.en : p.note }))))}">
        <blockquote lang="ar">${proverbs[0].ar}</blockquote>
        <figcaption>${c.lang === "en" ? proverbs[0].en : proverbs[0].note}</figcaption>
      </figure>
    </div>
    <nav aria-label="${c.tr("Footer", "تذييل الصفحة")}">
      <ul class="footer-links">
        ${navItems.map((n) => `<li><a href="${c.urlFor(n)}">${c.t(pages[n].title)}</a></li>`).join("")}
        <li><a href="${site.instagram}" ${external}>Instagram ${extIcon()}</a></li>
        <li><a href="${site.membership}" ${external}>Rubric ${extIcon()}</a></li>
      </ul>
    </nav>
  </div>
  <div class="wrap footer-bottom">
    <p>${c.tr("We acknowledge that Edmonton is on Treaty 6 territory and the Métis homeland.", "نقر بأن إدمونتون تقع على أراضي المعاهدة السادسة وموطن شعب الميتي.")}</p>
    <p><span class="friday" hidden>${c.tr("Jumu‘ah Mubarak", "جمعة مباركة")} · </span>© ${c.year} SSO UofA · ${c.tr("From Sudan, with love.", "من السودان، بكل حب.")}</p>
  </div>
</footer>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
// Decorative artwork behind each event poster's title.
function posterArt(style) {
  const art = {
    nile: `<circle cx="318" cy="62" r="30" fill="#e6c9a7" opacity=".22"/>
      <g fill="#e6c9a7" opacity=".16"><path d="M18 190 52 64l34 126Z"/><path d="M70 190 96 96l26 94Z"/><path d="M300 190l26-90 26 90Z"/><path d="M340 190l20-66 20 66Z"/></g>
      <g fill="none" stroke="#7fae9e" stroke-width="3" stroke-linecap="round" opacity=".55"><path d="M-10 200q25-10 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0"/><path d="M-10 214q25-10 50 0t50 0 50 0 50 0 50 0 50 0 50 0 50 0 50 0" opacity=".6"/></g>`,
    bbq: `<g fill="none" stroke="#9e6647" stroke-width="2" opacity=".45"><path d="M40 20 80 60 40 100 0 60Z"/><path d="M40 40 60 60 40 80 20 60Z"/><path d="M360 125l40 40-40 40-40-40Z"/><path d="M360 145l20 20-20 20-20-20Z"/></g>
      <g fill="#b4512f" opacity=".5"><circle cx="110" cy="190" r="4"/><circle cx="300" cy="40" r="3"/><circle cx="330" cy="70" r="5"/><circle cx="80" cy="150" r="3"/><circle cx="290" cy="190" r="3"/></g>
      <path d="M0 225h400" stroke="#9e6647" stroke-width="10" stroke-dasharray="20 10" opacity=".35"/>`,
    film: `<g transform="rotate(-14 200 112)" opacity=".28"><rect x="-40" y="150" width="480" height="58" fill="#1f3a2d"/>
      <g fill="#e6c9a7">${Array.from({ length: 16 }, (_, i) => `<rect x="${-30 + i * 30}" y="156" width="14" height="9" rx="2"/><rect x="${-30 + i * 30}" y="193" width="14" height="9" rx="2"/>`).join("")}</g></g>
      <circle cx="350" cy="50" r="26" fill="none" stroke="#e6c9a7" stroke-width="3" opacity=".3"/><circle cx="350" cy="50" r="6" fill="#e6c9a7" opacity=".3"/>`,
  };
  return `<svg class="poster-art" viewBox="0 0 400 225" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${art[style] || art.nile}</svg>`;
}

function eventCard(c, e, { headingLevel = 3 } = {}) {
  const h = `h${headingLevel}`;
  const dateLabel = e.date ? formatDate(c, e.date) : c.tr("Instagram highlight", "قصص مميزة");
  const details = [
    e.time && [c.tr("Time", "الوقت"), c.t(e.time)],
    e.venue && [c.tr("Where", "المكان"), c.t(e.venue)],
    e.access && [c.tr("Accessibility", "إمكانية الوصول"), c.t(e.access)],
  ].filter(Boolean);
  return `<article class="event-card"${e.date ? ` data-event-date="${e.date}"` : ""}>
  <div class="poster poster-${e.posterStyle}" aria-hidden="true">${posterArt(e.posterStyle)}<span>SSO UofA</span><b>${c.t(e.poster)}</b></div>
  <div class="event-body">
    <p class="event-meta"><span class="tag">${c.t(eventCategories[e.category])}</span>${e.date ? `<time datetime="${e.date}">${dateLabel}</time>` : `<span>${dateLabel}</span>`}</p>
    <${h}>${c.t(e.title)}</${h}>
    <p>${c.t(e.summary)}</p>
    ${details.length ? `<dl class="event-details">${details.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>` : ""}
    <p class="event-actions">
      ${e.source ? `<a class="text-link" href="${e.source}" ${external}>${c.tr("View on Instagram", "عرض على إنستغرام")} ${extIcon()}</a>` : ""}
      ${e.date ? `<a class="text-link only-upcoming" href="${c.base}assets/events/${e.id}.ics" download>${c.tr("Add to calendar", "أضف إلى التقويم")}</a>` : ""}
    </p>
  </div>
</article>`;
}

// Events are sorted into "upcoming" and "past" at build time; site.js re-sorts them
// in the browser so the lists stay correct between deploys.
function eventLists(c, today) {
  const dated = events.filter((e) => e.date).sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = dated.filter((e) => e.date >= today);
  const past = [...dated.filter((e) => e.date < today).reverse(), ...events.filter((e) => !e.date)];
  return { upcoming, past };
}

function upcomingEmpty(c) {
  return `<div class="empty-state" data-upcoming-empty>
  ${brewing()}
  <h3>${c.tr("No dates yet. The shai’s still brewing.", "لسه ما في مواعيد. الشاي لسه بيتعمل.")}</h3>
  <p>${c.tr("New gatherings are posted on Instagram first. Subscribe to the club calendar and they’ll appear in yours automatically.", "تُنشر اللقاءات الجديدة على إنستغرام أولاً. اشترك في تقويم المنظمة وستظهر في تقويمك تلقائياً.")}</p>
  <p class="actions"><a class="button" href="${c.urlFor("events")}#subscribe">${c.tr("Subscribe to the calendar", "اشترك في التقويم")}</a><a class="button ghost" href="${site.instagram}" ${external}>${c.tr("Follow on Instagram", "تابعنا على إنستغرام")} ${extIcon()}</a></p>
</div>`;
}

function subscribePanel(c) {
  const feed = `${site.url}/sso-events.ics`;
  const webcal = feed.replace(/^https:/, "webcal:");
  const google = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`;
  const outlook = `https://outlook.live.com/calendar/0/addfromweb?url=${encodeURIComponent(feed)}&name=${encodeURIComponent("SSO UofA Events")}`;
  return `<section class="subscribe" id="subscribe" aria-labelledby="subscribe-title">
  <div>
    <p class="eyebrow">${c.tr("Subscribe once, stay in the loop", "اشترك مرة وخليك على اطلاع")}</p>
    <h2 id="subscribe-title">${c.tr("Put SSO in your calendar.", "خلي المنظمة في تقويمك.")}</h2>
    <p>${c.tr("New events and schedule changes show up in your calendar app automatically. How often it refreshes depends on the app.", "تظهر الفعاليات الجديدة وتغييرات المواعيد في تطبيق التقويم تلقائياً. تعتمد سرعة التحديث على التطبيق.")}</p>
  </div>
  <div class="subscribe-actions">
    <a class="button" href="${google}" ${external}>Google Calendar</a>
    <a class="button" href="${webcal}">${c.tr("Apple Calendar", "تقويم آبل")}</a>
    <a class="button" href="${outlook}" ${external}>Outlook</a>
    <label for="feed-url">${c.tr("Or copy the feed link into any calendar app", "أو انسخ رابط التقويم إلى أي تطبيق")}</label>
    <div class="copy-row"><input id="feed-url" value="${feed}" readonly dir="ltr"><button type="button" class="button ghost" data-copy="#feed-url" data-copied="${c.tr("Copied", "تم النسخ")}">${c.tr("Copy", "نسخ")}</button></div>
  </div>
</section>`;
}

function eventsPage(c) {
  const { upcoming, past } = eventLists(c, c.today);
  return `${pageHead(c, {
    scene: "events",
    kicker: c.tr("Around the community", "في مجتمعنا"),
    title: c.tr("Good things happen when we gather.", "الحاجات الحلوة بتبدأ باللمة."),
    intro: c.tr("What’s coming up, how to never miss it, and moments from past gatherings.", "الفعاليات القادمة، وكيف لا تفوتك، ولحظات من لقاءات سابقة."),
  })}
<section class="wrap section" aria-labelledby="upcoming-title">
  <h2 id="upcoming-title" class="list-title">${c.tr("Upcoming", "القادمة")}</h2>
  <div class="event-grid" data-event-list="upcoming">${upcoming.map((e) => eventCard(c, e)).join("")}</div>
  ${upcomingEmpty(c).replace("<div", upcoming.length ? "<div hidden" : "<div")}
</section>
<div class="wrap">${subscribePanel(c)}</div>
<section class="wrap section" id="past" aria-labelledby="past-title">
  <h2 id="past-title" class="list-title">${c.tr("Past events & highlights", "فعاليات سابقة ولقطات")}</h2>
  <div class="event-grid" data-event-list="past">${past.map((e) => eventCard(c, e)).join("")}</div>
  <p class="fine-print">${c.tr("Posters are illustrations made for this website, not official event artwork.", "الملصقات رسومات صُممت لهذا الموقع وليست ملصقات رسمية للفعاليات.")}</p>
</section>`;
}

// ---------------------------------------------------------------------------
// Home
// ---------------------------------------------------------------------------
function homePage(c) {
  const { upcoming, past } = eventLists(c, c.today);
  const recent = past.filter((e) => e.date).slice(0, 3);
  const star = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v20M2 12h20M5 5l14 14M5 19 19 5" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>`;
  return `<section class="hero"
  data-egg-jebena="${esc(c.tr("The jebena’s always on. Come for coffee, leave with friends.", "الجبنة دايماً شغالة. تعال اشرب جبنة وارجع بأصحاب."))}"
  data-egg-sun="${esc(c.tr("We brought the Khartoum sun with us. Edmonton winter doesn’t scare us.", "جبنا شمس الخرطوم معانا… شتاء إدمنتون ما بيخوفنا."))}"
  data-egg-felucca="${esc(c.tr("All aboard! Next stop: Al-Mogran, where the Blue and White Nile meet.", "اركب المركب! المحطة الجاية المقرن، ملتقى النيلين."))}">
  <div class="wrap hero-inner">
    <div class="hero-copy">
      <p class="eyebrow">${c.tr("University of Alberta · Edmonton", "جامعة ألبرتا · إدمونتون")}</p>
      <h1>${c.tr("Wherever we gather,<br>it’s <em>home.</em>", "وين ما اتلمّينا،<br>دا <em>البيت.</em>")}</h1>
      <p class="lead">${c.tr("Culture that connects us and friendships that stay with us. A home on campus for Sudanese students, and for everyone curious to share in it.", "ثقافة تجمعنا وصداقات تبقى معنا. بيت في الجامعة للطلاب السودانيين ولكل من يرغب في مشاركتنا.")}</p>
      <p class="actions">
        <a class="button" href="${site.membership}" ${external}>${c.tr("Become a member, it’s free", "انضم للمنظمة مجاناً")}</a>
        <a class="button ghost" href="${c.urlFor("events")}">${c.tr("See what’s on", "شوف الفعاليات")}</a>
      </p>
    </div>
    <p class="hero-note" lang="ar" dir="rtl" aria-hidden="true">أهلاً بيك</p>
  </div>
  ${heroScene()}
</section>
<div class="ticker" aria-hidden="true"><div class="ticker-track" dir="ltr">${[0, 1]
  .map(() => `<div class="ticker-set">${tickerWords.map((w) => `<span${w.lang ? ` lang="${w.lang}"` : ""}>${w.lang ? w.text : c.t(w.text)}</span>${star}`).join("")}</div>`)
  .join("")}</div></div>
<section class="wrap section about" aria-labelledby="about-title">
  ${sectionHead(c, {
    id: "about-title",
    kicker: c.tr("The space between here & home", "المسافة بين هنا والبيت"),
    title: c.tr("Different journeys. A shared table.", "رحلات مختلفة. ولمة بتجمعنا."),
    intro: c.tr("SSO brings Sudanese culture, friendship and community to the University of Alberta, wherever your journey began.", "تجمع المنظمة الثقافة السودانية والصداقات والمجتمع في جامعة ألبرتا، مهما كانت بداية رحلتك."),
  })}
  <ol class="values">
    <li><b>${c.tr("Celebrate culture", "احتفاء بالثقافة")}</b><p>${c.tr("Our stories, music, food and the everyday things that feel like home.", "قصصنا وموسيقانا وأكلنا وتفاصيلنا اليومية التي تشبه البيت.")}</p></li>
    <li><b>${c.tr("Make connections", "روابط وصداقات")}</b><p>${c.tr("Familiar faces, new friends, and a campus that feels a little smaller.", "وجوه مألوفة وأصدقاء جدد وجامعة تبدو أقرب.")}</p></li>
    <li><b>${c.tr("Show up together", "مع بعض")}</b><p>${c.tr("Student-led gatherings, conversations and a hand when someone needs one.", "لقاءات ونقاشات يقودها الطلاب، ويد ممدودة لمن يحتاجها.")}</p></li>
  </ol>
</section>
<section class="band" aria-labelledby="next-title">
  ${waveEdge("var(--cream)", "top")}
  <div class="wrap section">
    <div class="section-row">
      ${sectionHead(c, { id: "next-title", kicker: c.tr("Next on the calendar", "القادم في التقويم"), title: c.tr("Come to a gathering.", "تعال للمة.") })}
      <a class="text-link" href="${c.urlFor("events")}">${c.tr("All events", "كل الفعاليات")} ${arrow(c)}</a>
    </div>
    <div class="event-grid" data-event-list="upcoming">${upcoming.slice(0, 3).map((e) => eventCard(c, e)).join("")}</div>
    <div data-upcoming-empty${upcoming.length ? " hidden" : ""}>
      <div class="next-note">
        ${brewing()}
        <p><b>${c.tr("No new dates yet. The shai’s still brewing.", "لسه ما في مواعيد جديدة. الشاي لسه بيتعمل.")}</b> ${c.tr("Subscribe to the club calendar and new gatherings appear in yours automatically. Until then, here’s what we’ve been up to.", "اشترك في تقويم المنظمة وستظهر اللقاءات الجديدة في تقويمك تلقائياً. وإلى ذلك الحين، هذا ما كنا نفعله.")}</p>
        <a class="button small" href="${c.urlFor("events")}#subscribe">${c.tr("Subscribe", "اشترك")}</a>
      </div>
      <div class="event-grid" data-event-list="recent">${recent.map((e) => eventCard(c, e)).join("")}</div>
    </div>
  </div>
</section>
<section class="wrap section" aria-labelledby="merch-teaser-title">
  <div class="section-row">
    ${sectionHead(c, { id: "merch-teaser-title", kicker: c.tr("Coming soon", "قريباً"), title: c.tr("Wear a little piece of home.", "خذ معك حتة من البيت.") })}
    <a class="text-link" href="${c.urlFor("merch")}">${c.tr("See the collection", "شوف المجموعة")} ${arrow(c)}</a>
  </div>
  <div class="merch-grid compact">${merch.map((p) => merchCard(c, p)).join("")}</div>
</section>
<section class="join" aria-labelledby="join-title">
  ${waveEdge("var(--cream)", "top")}
  ${waveEdge("var(--cream)", "bottom")}
  <div class="wrap join-grid">
    <div>
      <p class="eyebrow">${c.tr("There’s room for you here", "في مكان ليك هنا")}</p>
      <h2 id="join-title">${c.tr("Come for the culture.<br>Stay for the people.", "تعال عشان الثقافة.<br>خليك عشان الناس.")}</h2>
      <p>${c.tr("Membership is free and open to everyone.", "العضوية مجانية ومفتوحة للجميع.")}</p>
    </div>
    <ol class="join-ways">
      <li><a href="${site.membership}" ${external}><b>${c.tr("Become a member", "انضم للمنظمة")}</b><span>${c.tr("Sign up on Rubric in a minute with your UAlberta account.", "سجّل في روبرك خلال دقيقة بحسابك الجامعي.")}</span></a></li>
      <li><a href="${c.urlFor("contact")}#volunteer"><b>${c.tr("Lend a hand", "شارك بجهدك")}</b><span>${c.tr("Join the volunteer pool and pick the shifts that suit you.", "انضم لقائمة المتطوعين واختر المهام التي تناسبك.")}</span></a></li>
      <li><a href="${c.urlFor("contact")}#message"><b>${c.tr("Bring an idea", "تعال بفكرة")}</b><span>${c.tr("Pitch an event, a collaboration or a conversation worth having.", "اقترح فعالية أو تعاوناً أو نقاشاً يستحق.")}</span></a></li>
    </ol>
  </div>
</section>
<section class="wrap section faq" aria-labelledby="faq-title">
  ${sectionHead(c, { id: "faq-title", kicker: c.tr("FAQ", "أسئلة شائعة"), title: c.tr("Before you say hello.", "قبل ما تقول مرحب.") })}
  <div class="faq-list">${faqs.map((f) => `<details><summary>${c.t(f.q)}</summary><p>${c.t(f.a)}</p></details>`).join("")}</div>
</section>`;
}

// ---------------------------------------------------------------------------
// New here?
// ---------------------------------------------------------------------------
function linkCards(c, list, startAt = 1) {
  return list
    .map(
      (r, i) => `<li><a class="link-card" href="${r.url}" ${external}>
  <span class="num">${String(i + startAt).padStart(2, "0")}</span>
  <b>${c.t(r.title)} ${extIcon()}</b>
  <span>${c.t(r.desc)}</span>
</a></li>`,
    )
    .join("");
}

function guidePage(c) {
  return `${pageHead(c, {
    scene: "guide",
    kicker: c.tr("Your first few weeks", "أسابيعك الأولى"),
    title: c.tr("New here? You belong.", "جديد هنا؟ في مكان ليك."),
    intro: c.tr("You don’t need to know anyone already. Here’s how to find your feet, and your people.", "لا تحتاج لمعرفة أحد مسبقاً. هكذا تجد طريقك وناسك."),
  })}
<section class="wrap section" aria-labelledby="steps-title">
  <h2 id="steps-title" class="list-title">${c.tr("Three easy first steps", "ثلاث خطوات أولى سهلة")}</h2>
  <ol class="steps">
    <li><b>${c.tr("Become a member", "انضم للمنظمة")}</b><p>${c.tr("Free, and takes a minute on Rubric.", "مجاناً وخلال دقيقة على روبرك.")}</p><a class="text-link" href="${site.membership}" ${external}>${c.tr("Join on Rubric", "انضم عبر روبرك")} ${extIcon()}</a></li>
    <li><b>${c.tr("Subscribe to the calendar", "اشترك في التقويم")}</b><p>${c.tr("Every gathering lands in your calendar automatically.", "كل لقاء يصل إلى تقويمك تلقائياً.")}</p><a class="text-link" href="${c.urlFor("events")}#subscribe">${c.tr("Subscribe", "اشترك")} ${arrow(c)}</a></li>
    <li><b>${c.tr("Come and say hi", "تعال وسلّم")}</b><p>${c.tr("Bring a friend, or come alone and leave with a few.", "تعال مع صديق، أو تعال لوحدك وارجع بأصدقاء.")}</p><a class="text-link" href="${c.urlFor("events")}">${c.tr("See events", "شوف الفعاليات")} ${arrow(c)}</a></li>
  </ol>
</section>
<section class="wrap section" aria-labelledby="campus-title">
  <h2 id="campus-title" class="list-title">${c.tr("Getting around campus", "التنقل في الجامعة")}</h2>
  <ul class="link-grid">
    ${linkCards(c, newStudentLinks)}
    <li><a class="link-card" href="${c.urlFor("resources")}"><span class="num">${String(newStudentLinks.length + 1).padStart(2, "0")}</span><b>${c.tr("Prayer times & campus tools", "مواقيت الصلاة وأدوات الجامعة")}</b><span>${c.tr("Today’s prayer times, Bear Tracks, Canvas and key dates.", "مواقيت الصلاة اليوم وبير تراكس وكانفاس والمواعيد المهمة.")}</span></a></li>
  </ul>
  <p class="fine-print">${c.tr("Links reviewed 9 October 2026. These are independent university services, not SSO partnerships.", "رُوجعت الروابط في ٩ أكتوبر ٢٠٢٦. هذه خدمات جامعية مستقلة وليست شراكات للمنظمة.")}</p>
</section>`;
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------
function resourcesPage(c) {
  const prayers = [
    ["Fajr", "الفجر"],
    ["Dhuhr", "الظهر"],
    ["Asr", "العصر"],
    ["Maghrib", "المغرب"],
    ["Isha", "العشاء"],
  ];
  return `${pageHead(c, {
    scene: "resources",
    kicker: c.tr("Campus, made easier", "الجامعة أسهل"),
    title: c.tr("Student resources.", "موارد الطلاب."),
    intro: c.tr("Today’s prayer times and the university tools you’ll use every week.", "مواقيت الصلاة اليوم والأدوات الجامعية التي تستخدمها كل أسبوع."),
  })}
<section class="wrap section prayer" id="prayer" aria-labelledby="prayer-title" data-prayer data-locale="${c.locale}"
  data-msg-loading="${c.tr("Loading today’s times…", "جارٍ تحميل مواقيت اليوم…")}"
  data-msg-error="${c.tr("Prayer times couldn’t be loaded right now.", "تعذر تحميل مواقيت الصلاة الآن.")}"
  data-msg-next="${c.tr("Next", "التالية")}">
  <div class="section-row">
    <div class="section-head"><p class="eyebrow">${c.tr("A moment for prayer", "وقت للصلاة")}</p><h2 id="prayer-title">${c.tr("Prayer times · Edmonton", "مواقيت الصلاة · إدمونتون")}</h2></div>
    <a class="text-link" href="https://www.msauofa.ca/" ${external}>${c.tr("Source: MSA UofA", "المصدر: جمعية الطلاب المسلمين")} ${extIcon()}</a>
  </div>
  <ul class="prayer-grid">${prayers.map(([k, ar]) => `<li data-prayer-key="${k}"><span>${c.tr(k, ar)}</span><b>–</b></li>`).join("")}</ul>
  <p class="fine-print" data-prayer-status role="status">${c.tr("Prayer times need JavaScript. You can find them on the MSA UofA website.", "تحتاج مواقيت الصلاة إلى JavaScript. يمكنك إيجادها على موقع جمعية الطلاب المسلمين.")}</p>
  <p class="fine-print">${c.tr("Start times. Congregational and Jumu‘ah times may differ.", "أوقات دخول الصلاة. قد تختلف أوقات الجماعة والجمعة.")}</p>
</section>
<section class="wrap section" aria-labelledby="tools-title">
  <h2 id="tools-title" class="list-title">${c.tr("Everyday campus tools", "أدوات الجامعة اليومية")}</h2>
  <ul class="link-grid">${linkCards(c, campusTools)}</ul>
  <p class="fine-print">${c.tr("Official university pages, reviewed 9 October 2026.", "صفحات رسمية للجامعة، رُوجعت في ٩ أكتوبر ٢٠٢٦.")}</p>
</section>`;
}

// ---------------------------------------------------------------------------
// Merch
// ---------------------------------------------------------------------------
function merchCard(c, p) {
  return `<article class="merch-card">
  <a href="${c.urlFor("product-" + p.id)}">
    <div class="merch-media">
      <img src="${c.asset(`merch/${p.id}-card.jpg`)}" alt="" width="480" height="480" loading="lazy">
      <img class="merch-alt" src="${c.asset(`merch/${p.id}-1.jpg`)}" alt="" width="627" height="627" loading="lazy">
    </div>
    <div class="merch-body"><h3>${c.t(p.name)}</h3><span class="price">${price(c, p.price)}</span></div>
    <p>${c.t(p.summary)}</p>
  </a>
</article>`;
}

function merchPage(c) {
  return `${pageHead(c, {
    scene: "merch",
    kicker: c.tr("Wear a little piece of home", "خذ معك حتة من البيت"),
    title: c.tr("The SSO collection.", "مجموعة المنظمة."),
    intro: c.tr("Inspired by Sudan, made for campus life. Our first small drop is being sampled now.", "مستوحاة من السودان ومصممة لحياة الجامعة. أول إطلاق صغير في مرحلة العينات الآن."),
  })}
<section class="wrap section">
  <div class="notice"><b>${c.tr("Pre-orders aren’t open yet.", "الطلب المسبق لم يُفتح بعد.")}</b> ${c.tr("Prices are estimates in CAD. Final prices, sizing and campus pickup will be announced on Instagram before orders open.", "الأسعار تقديرية بالدولار الكندي. تُعلن الأسعار النهائية والمقاسات والاستلام في الجامعة على إنستغرام قبل فتح الطلبات.")} <a href="${site.instagram}" ${external}>${site.instagramHandle}</a></div>
  <div class="merch-grid">${merch.map((p) => merchCard(c, p)).join("")}</div>
  <p class="fine-print">${c.tr("Product imagery is AI-generated to show the intended designs. Physical samples may differ.", "صور المنتجات مولدة بالذكاء الاصطناعي لعرض التصاميم المقترحة. قد تختلف العينات الفعلية.")}</p>
</section>`;
}

function productPage(c, p) {
  const shots = [
    { src: `merch/${p.id}-studio.jpg`, w: 1000, label: c.tr("Studio", "استوديو") },
    ...p.views.map((v, i) => ({ src: `merch/${p.id}-${i + 1}.jpg`, w: 627, label: c.t(v) })),
  ];
  const others = merch.filter((x) => x.id !== p.id);
  return `<div class="wrap">
  <nav class="breadcrumb" aria-label="${c.tr("Breadcrumb", "مسار التنقل")}"><a href="${c.urlFor("merch")}">${c.tr("The collection", "المجموعة")}</a><span aria-hidden="true">/</span><span aria-current="page">${c.t(p.name)}</span></nav>
</div>
<section class="wrap product">
  <div class="gallery">
    <div class="gallery-track" tabindex="0" aria-label="${c.tr("Product images", "صور المنتج")}">
      ${shots
        .map(
          (s, i) => `<figure id="view-${i + 1}"><img src="${c.asset(s.src)}" alt="${esc(c.t(p.name) + " · " + s.label)}" width="${s.w}" height="${s.w}"${i ? ' loading="lazy"' : ' fetchpriority="high"'}><figcaption>${s.label}</figcaption></figure>`,
        )
        .join("")}
    </div>
    <ul class="gallery-thumbs">
      ${shots.map((s, i) => `<li><a href="#view-${i + 1}"${i === 0 ? ' aria-current="true"' : ""}><img src="${c.asset(s.src.replace("-studio", "-card"))}" alt="${esc(s.label)}" width="80" height="80" loading="lazy"></a></li>`).join("")}
    </ul>
  </div>
  <div class="product-info">
    <p class="eyebrow">${c.tr("Heritage collection · Coming soon", "مجموعة التراث · قريباً")}</p>
    <h1>${c.t(p.name)}</h1>
    <p class="product-price"><span class="price">${price(c, p.price)}</span> <small>${c.tr("estimated", "تقديري")}</small></p>
    <p class="lead">${c.t(p.summary)}</p>
    <dl class="product-facts">
      <div><dt>${c.tr("Colour", "اللون")}</dt><dd><i class="swatch" style="background:${p.swatch}"></i>${c.t(p.colour)}</dd></div>
      <div><dt>${c.tr("Sizes", "المقاسات")}</dt><dd>${p.sizes.map((s) => (s === "One size" ? c.tr("One size", "مقاس واحد") : s)).join(" · ")}</dd></div>
    </dl>
    <div class="notice"><b>${c.tr("Pre-orders open soon.", "الطلب المسبق قريباً.")}</b> ${c.tr("Follow us so you don’t miss the drop. Pickup will be on campus.", "تابعنا حتى لا يفوتك الإطلاق. الاستلام سيكون في الجامعة.")}</div>
    <p class="actions"><a class="button" href="${site.instagram}" ${external}>${c.tr("Get notified on Instagram", "تابع الإطلاق على إنستغرام")} ${extIcon()}</a></p>
    <div class="product-specs">
      <details open><summary>${c.tr("The design story", "حكاية التصميم")}</summary><p>${c.t(p.story)}</p></details>
      <details><summary>${c.tr("Materials", "الخامات")}</summary><p>${c.t(p.materials)}</p></details>
      <details><summary>${c.tr("Fit & care", "المقاس والعناية")}</summary><p>${c.tr("A size guide and care instructions will be published with the pre-order. The photos show the intended look, not a measured fit.", "يُنشر دليل المقاسات والعناية مع الطلب المسبق. الصور توضح المظهر المقترح وليست قياساً للمقاس.")}</p></details>
    </div>
    <p class="fine-print">${c.tr("AI-generated imagery. Physical samples may differ.", "صور مولدة بالذكاء الاصطناعي. قد تختلف العينات الفعلية.")}</p>
  </div>
</section>
<section class="wrap section" aria-labelledby="more-title">
  <h2 id="more-title" class="list-title">${c.tr("More from the collection", "المزيد من المجموعة")}</h2>
  <div class="merch-grid compact two">${others.map((x) => merchCard(c, x)).join("")}</div>
</section>`;
}

// ---------------------------------------------------------------------------
// Team
// ---------------------------------------------------------------------------
function teamPage(c) {
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  return `${pageHead(c, {
    scene: "team",
    kicker: c.tr("The people behind the community", "الناس وراء اللمة"),
    title: c.tr("Meet the executive team.", "تعرّف على الفريق التنفيذي."),
    intro: c.tr("The students who keep SSO running this year.", "الطلاب الذين يقودون المنظمة هذا العام."),
  })}
<section class="wrap section">
  <ul class="team-grid">
    ${team
      .map(
        (m, i) => `<li class="team-card" style="--tone:${i % 4}">
      ${m.photo ? `<img src="${c.asset(m.photo)}" alt="" width="400" height="500" loading="lazy">` : `<div class="portrait" aria-hidden="true"><span>${initials(m.name)}</span></div>`}
      <p class="role">${c.t(m.role)}</p>
      <h2 dir="ltr">${m.name}</h2>
    </li>`,
      )
      .join("")}
  </ul>
  <p class="fine-print">${c.tr("Names and roles from the club’s Rubric directory, checked 9 October 2026.", "الأسماء والمناصب من دليل المنظمة على روبرك، تم التحقق منها في ٩ أكتوبر ٢٠٢٦.")} <a href="${site.membership}" ${external}>${c.tr("View the directory", "عرض الدليل")} ${extIcon()}</a></p>
</section>`;
}

// ---------------------------------------------------------------------------
// Get involved / contact
// ---------------------------------------------------------------------------
function contactPage(c) {
  const topics = [
    [c.tr("Questions", "الأسئلة"), c.tr("Anything about SSO, membership or events.", "أي شيء عن المنظمة أو العضوية أو الفعاليات.")],
    [c.tr("Ideas & feedback", "أفكار وملاحظات"), c.tr("An event you’d love to see, or something we could do better.", "فعالية تتمنى أن تراها، أو شيء يمكننا تحسينه.")],
    [c.tr("Partnerships", "الشراكات"), c.tr("Collaborations with other clubs, sponsors and campus groups.", "التعاون مع الأندية الأخرى والرعاة والمجموعات الجامعية.")],
    [c.tr("Concerns", "الشكاوى"), c.tr("Something you want the executive team to hear. We treat these privately.", "شيء تريد أن يسمعه الفريق التنفيذي. نتعامل معها بخصوصية.")],
  ];
  return `${pageHead(c, {
    scene: "contact",
    kicker: c.tr("There’s room for you here", "في مكان ليك هنا"),
    title: c.tr("Get involved.", "شارك معنا."),
    intro: c.tr("Become a member, lend a hand, or just say hello.", "انضم للمنظمة، أو شارك بجهدك، أو قول مرحب."),
  })}
<div class="wrap involve-grid">
  <section class="card" aria-labelledby="member-title">
    <p class="eyebrow">01</p>
    <h2 id="member-title">${c.tr("Become a member", "انضم للمنظمة")}</h2>
    <p>${c.tr("Membership is free and open to everyone. Sign up on Rubric with your UAlberta account to hear about every gathering.", "العضوية مجانية ومفتوحة للجميع. سجّل في روبرك بحسابك الجامعي لتعرف عن كل لقاء.")}</p>
    <p class="actions"><a class="button" href="${site.membership}" ${external}>${c.tr("Join on Rubric", "انضم عبر روبرك")} ${extIcon()}</a></p>
  </section>
  <section class="card" id="volunteer" aria-labelledby="volunteer-title">
    <p class="eyebrow">02</p>
    <h2 id="volunteer-title">${c.tr("Volunteer", "تطوّع")}</h2>
    <p>${c.tr("Volunteers coordinate in one WhatsApp group. Shifts are posted there, and you pick only the ones that suit you.", "يتنسق المتطوعون في مجموعة واتساب واحدة. تُنشر المهام هناك وتختار ما يناسبك فقط.")}</p>
    ${
      site.volunteerWhatsApp
        ? `<p class="actions"><a class="button" href="${site.volunteerWhatsApp}" ${external}>${c.tr("Join the volunteer group", "انضم لمجموعة المتطوعين")} ${extIcon()}</a></p><p class="fine-print">${c.tr("Your phone number will be visible to other group members.", "سيكون رقم هاتفك ظاهراً لأعضاء المجموعة.")}</p>`
        : `<p class="actions"><a class="button" href="${site.instagramDM}" ${external}>${c.tr("Message us to volunteer", "راسلنا للتطوع")} ${extIcon()}</a></p><p class="fine-print">${c.tr("The group link is shared directly while volunteer sign-up is being set up.", "يُرسل رابط المجموعة مباشرة إلى أن يُجهَّز التسجيل للتطوع.")}</p>`
    }
  </section>
  <section class="card wide" id="message" aria-labelledby="message-title">
    <p class="eyebrow">03</p>
    <h2 id="message-title">${c.tr("Send us a message", "راسلنا")}</h2>
    <p>${c.tr("The fastest way to reach the team is a direct message on Instagram. We usually reply within a few days.", "أسرع طريقة للوصول إلى الفريق هي رسالة مباشرة على إنستغرام. نرد عادة خلال أيام.")}</p>
    <ul class="topic-list">${topics.map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join("")}</ul>
    <p class="actions"><a class="button" href="${site.instagramDM}" ${external}>${c.tr("Message", "راسل")} ${site.instagramHandle} ${extIcon()}</a></p>
  </section>
  ${
    site.newsletter
      ? `<section class="card wide" aria-labelledby="news-title"><p class="eyebrow">04</p><h2 id="news-title">${c.tr("Get the newsletter", "اشترك في النشرة")}</h2><p>${c.tr("Upcoming gatherings and community news, now and then.", "اللقاءات القادمة وأخبار المجتمع بين حين وآخر.")}</p><p class="actions"><a class="button" href="${site.newsletter}" ${external}>${c.tr("Subscribe", "اشترك")} ${extIcon()}</a></p></section>`
      : ""
  }
</div>`;
}

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------
export function notFoundPage(c) {
  return `${pageHead(c, {
    scene: "lost",
    kicker: "404",
    title: c.tr("This page went out for ful and never came back.", "الصفحة دي مشت تجيب فول وما رجعت."),
    intro: c.tr("The link may be old, or the page may have moved. Let’s get you back to the lamma.", "ممكن الرابط قديم أو الصفحة اتنقلت. خلينا نرجعك للمة."),
  })}
<div class="wrap section"><p class="actions"><a class="button" href="${c.urlFor("home")}">${c.tr("Back to home", "العودة للرئيسية")}</a><a class="button ghost" href="${c.urlFor("events")}">${c.tr("See events", "شوف الفعاليات")}</a></p></div>`;
}

export function renderPage(c, key) {
  const page = pages[key];
  if (page.product) return productPage(c, page.product);
  return { home: homePage, events: eventsPage, guide: guidePage, resources: resourcesPage, merch: merchPage, team: teamPage, contact: contactPage }[key](c);
}
