// All editable site content lives in this file.
// Every piece of visible text is a pair: L("English", "العربية").
// After editing, run `npm run build` (or just push to main; GitHub Actions builds and publishes).

export const L = (en, ar = en) => ({ en, ar });

// ---------------------------------------------------------------------------
// Club-wide links and settings
// ---------------------------------------------------------------------------
export const site = {
  // Public URL of the deployed site, no trailing slash. Used for canonical links,
  // the sitemap and the calendar feed.
  url: "https://ahmedezeldin.com/sso-uofa",
  // Path the site is served under (GitHub Pages project site).
  basePath: "/sso-uofa/",
  name: L("SSO UofA", "منظمة الطلاب السودانيين"),
  fullName: L("Sudanese Students Organization", "منظمة الطلاب السودانيين"),
  instagram: "https://www.instagram.com/sso.uofa/",
  instagramHandle: "@sso.uofa",
  // Opens a direct-message thread with the club on Instagram.
  instagramDM: "https://ig.me/m/sso.uofa",
  membership: "https://campus.hellorubric.com/?s=14548",
  // Paste the volunteer WhatsApp group invite here when it exists.
  // While empty, the volunteer section points people to Instagram instead.
  volunteerWhatsApp: "",
  // Paste a newsletter sign-up link (e.g. a Google Form or Mailchimp page) when ready.
  newsletter: "",
  // Stable identifier used inside calendar event UIDs. Never change it:
  // subscribers' calendars use it to recognise events they already have.
  calendarUidDomain: "ualberta-sudanese-club.classybirch16.chatgpt.site",
};

// ---------------------------------------------------------------------------
// Events
// - `id` must never change once published (calendar subscribers rely on it).
// - `date` is YYYY-MM-DD in Edmonton time. Leave it out for undated highlights.
// - Events move from "Upcoming" to "Past" automatically on the day after `date`.
// - `time`, `venue` and `access` are optional; omit them when not confirmed.
// ---------------------------------------------------------------------------
export const events = [
  {
    id: "nile",
    date: "2026-08-08",
    category: "culture",
    poster: L("Nile<br>Narratives", "حكايات<br>النيل"),
    posterStyle: "nile",
    title: L("Nile Narratives", "حكايات النيل"),
    summary: L(
      "An SSO event bringing a Sudanese story to campus.",
      "فعالية للمنظمة تحمل حكاية سودانية إلى الحرم الجامعي.",
    ),
    source: "https://www.instagram.com/sso.uofa/p/Dbw0WMyNaQv/",
  },
  {
    id: "bbq",
    date: "2026-09-18",
    category: "community",
    poster: L("Good food.<br>Good company.", "أكل حلو.<br>ولمة أحلى."),
    posterStyle: "bbq",
    title: L("Community & solidarity BBQ", "شواء وتضامن مجتمعي"),
    summary: L(
      "Food, connection and solidarity at Main Quad, with SSO among the campus groups taking part.",
      "طعام وتواصل وتضامن في الساحة الرئيسية، بمشاركة المنظمة ضمن مجموعات جامعية أخرى.",
    ),
    venue: L("Main Quad", "الساحة الرئيسية"),
    source: "https://www.instagram.com/sjp.uofa/p/Dc_4t6ikvrI/",
  },
  {
    id: "film",
    category: "culture",
    poster: L("Stories worth<br>sharing.", "حكايات<br>تستاهل تتشاف."),
    posterStyle: "film",
    title: L("Film screening highlights", "لقطات من عروض الأفلام"),
    summary: L(
      "Moments from SSO’s film screenings, saved as an Instagram highlight.",
      "لحظات من عروض الأفلام التي نظمتها المنظمة، محفوظة في قصص إنستغرام المميزة.",
    ),
    source: "https://www.instagram.com/stories/highlights/18100418501237059/",
  },
];

export const eventCategories = {
  culture: L("Culture & stories", "ثقافة وقصص"),
  community: L("Community", "مجتمع"),
};

// ---------------------------------------------------------------------------
// Executive team (checked against the Rubric club directory, 9 October 2026).
// Add `photo: "team/firstname.jpg"` (file in src/assets/team/) when portraits exist.
// ---------------------------------------------------------------------------
export const team = [
  { name: "Sara Shimat", role: L("President", "الرئيسة") },
  { name: "Renad El Shafie", role: L("Vice President Internal", "نائبة الرئيس للشؤون الداخلية") },
  { name: "Shaima Eltayeb", role: L("Vice President External", "نائبة الرئيس للشؤون الخارجية") },
  { name: "Aseel Oshi", role: L("Vice President Events", "نائبة الرئيس للفعاليات") },
  { name: "Murwa Salih", role: L("Treasurer", "أمينة المال") },
];

// ---------------------------------------------------------------------------
// Merch (concept collection; not yet on sale)
// Images live in src/assets/merch/: <id>-studio.jpg, <id>-card.jpg and <id>-1..4.jpg
// ---------------------------------------------------------------------------
export const merch = [
  {
    id: "tee",
    name: L("The Heritage Tee", "تيشيرت التراث"),
    price: 30,
    colour: L("Ivory", "عاجي"),
    swatch: "#e9dfcb",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    summary: L(
      "An ivory tee with a restrained burgundy chest print: Sudan, the Meroë pyramids and SSO UofA.",
      "تيشيرت عاجي بطباعة عنابية بسيطة على الصدر تجمع السودان وأهرامات مروي واسم المنظمة.",
    ),
    story: L(
      "Inspired by Meroë’s pyramid silhouettes and the thread that runs between home and campus.",
      "مستوحى من أهرامات مروي والخيط الذي يربط البيت بالجامعة.",
    ),
    materials: L(
      "Crew neck, short sleeves, fine-knit feel. Fibre composition, weight and print method will be confirmed after sampling.",
      "ياقة دائرية وأكمام قصيرة وملمس ناعم. تُحدد تركيبة الألياف والوزن وطريقة الطباعة بعد اعتماد العينة.",
    ),
    views: [L("On model · front", "على العارض · الأمام"), L("On model · back", "على العارض · الخلف"), L("Print detail", "تفاصيل الطباعة"), L("On campus", "في الجامعة")],
  },
  {
    id: "hoodie",
    name: L("The Meroë Hoodie", "هودي مروي"),
    price: 65,
    colour: L("Deep burgundy", "عنابي داكن"),
    swatch: "#612c32",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    summary: L(
      "A deep burgundy hoodie with a cream heritage graphic on the back. From home to campus.",
      "هودي عنابي برسمة تراثية كريمية على الظهر. من البيت إلى الجامعة.",
    ),
    story: L(
      "Meroë’s pyramids beside the Nile, framed with the words that sum up the club: from home to campus.",
      "أهرامات مروي بجانب النيل، مع العبارة التي تلخص المنظمة: من البيت إلى الجامعة.",
    ),
    materials: L(
      "Brushed-knit body, ribbed cuffs and hem, lined hood. Fibre composition, weight and print method will be confirmed after sampling.",
      "نسيج ناعم وأساور مضلعة وقبعة مبطنة. تُحدد تركيبة الألياف والوزن وطريقة الطباعة بعد اعتماد العينة.",
    ),
    views: [L("On model · front", "على العارض · الأمام"), L("On model · back", "على العارض · الخلف"), L("Print detail", "تفاصيل الطباعة"), L("On campus", "في الجامعة")],
  },
  {
    id: "tote",
    name: L("The Ahlan Tote", "حقيبة أهلاً"),
    price: 20,
    colour: L("Natural canvas", "قماش طبيعي"),
    swatch: "#e5d7be",
    sizes: ["One size"],
    summary: L(
      "Natural canvas, expressive “أهلاً بيك” lettering and a flowing Nile-inspired detail.",
      "قماش طبيعي وعبارة «أهلاً بيك» ولمسة مستوحاة من النيل.",
    ),
    story: L(
      "A warm Sudanese welcome and a line drawing of the Nile: a small reminder of home for every day on campus.",
      "ترحيب سوداني دافئ ورسم للنيل: تذكير صغير بالبيت في كل يوم جامعي.",
    ),
    materials: L(
      "Canvas body with shoulder-length handles. Fabric weight, dimensions and capacity will be confirmed after sampling.",
      "قماش كانفاس بمقابض للكتف. يُحدد وزن القماش والأبعاد والسعة بعد اعتماد العينة.",
    ),
    views: [L("Carried · front", "محمولة · الأمام"), L("Carried · side", "محمولة · الجانب"), L("Print detail", "تفاصيل الطباعة"), L("On campus", "في الجامعة")],
  },
];

// ---------------------------------------------------------------------------
// Links for new students and everyday campus tools (reviewed 9 October 2026)
// ---------------------------------------------------------------------------
export const newStudentLinks = [
  {
    title: L("Find your way", "اعرف طريقك"),
    desc: L("Campus maps and building information.", "خرائط الجامعة ومعلومات المباني."),
    url: "https://www.ualberta.ca/en/maps.html",
  },
  {
    title: L("Settle into campus", "استقر في الجامعة"),
    desc: L("International Student & Visitor Services.", "خدمات الطلاب والزوار الدوليين."),
    url: "https://www.ualberta.ca/en/international/international-student-services/index.html",
  },
  {
    title: L("Find your study spot", "اختر مكان دراستك"),
    desc: L("Libraries, study spaces and research help.", "مكتبات وأماكن دراسة ودعم بحثي."),
    url: "https://library.ualberta.ca/",
  },
  {
    title: L("Ask for support", "اطلب الدعم"),
    desc: L("Accessibility resources and accommodations.", "موارد إمكانية الوصول والتسهيلات."),
    url: "https://www.ualberta.ca/en/current-students/accessibility-resources/index.html",
  },
  {
    title: L("Explore student support", "استكشف دعم الطلاب"),
    desc: L("The UASU Cares resource directory.", "دليل موارد اتحاد الطلاب."),
    url: "https://uasucares.su.ualberta.ca/en/",
  },
];

export const campusTools = [
  {
    title: L("Bear Tracks", "بير تراكس"),
    desc: L("Registration, class schedules and student records.", "التسجيل وجداول المحاضرات والسجلات الطلابية."),
    url: "https://www.ualberta.ca/en/registrar/registration-and-courses/bear-tracks-resources/index.html",
  },
  {
    title: L("Canvas", "كانفاس"),
    desc: L("Getting into your courses and finding Canvas help.", "الوصول إلى مقرراتك والحصول على دعم كانفاس."),
    url: "https://www.ualberta.ca/en/provost/projects-initiatives/canvas/students.html",
  },
  {
    title: L("Dates & deadlines", "التواريخ والمواعيد"),
    desc: L("The University Calendar and key academic deadlines.", "تقويم الجامعة والمواعيد الأكاديمية المهمة."),
    url: "https://www.ualberta.ca/en/registrar/calendar/index.html",
  },
];

// ---------------------------------------------------------------------------
// Little Sudanese touches
// ---------------------------------------------------------------------------
// Sudanese sayings; the footer shows a random one on each visit.
// `en` is the English gloss, `note` the short Arabic explanation shown on Arabic pages.
export const proverbs = [
  { ar: "اللقمة الهنية بتكفي مية", en: "A meal shared with a good heart feeds a hundred.", note: "الأكل بالمحبة بيكفي الكل." },
  { ar: "الجار قبل الدار", en: "Choose your neighbour before your house.", note: "الناس قبل المكان." },
  { ar: "إيد على إيد تجدع بعيد", en: "Hands together throw farther.", note: "بالتعاون بنوصل أبعد." },
  { ar: "البيت بيتك", en: "Make yourself at home. (Literally: the house is your house.)", note: "حبابك عشرة." },
];

// Words that scroll across the band under the hero. Entries with `lang: "ar"` show in Arabic on both pages.
export const tickerWords = [
  { text: L("Culture", "ثقافة") },
  { text: "لمة سودانية", lang: "ar" },
  { text: L("Shai bi laban", "شاي بلبن") },
  { text: L("Connection", "تواصل") },
  { text: L("Legaimat", "لقيمات") },
  { text: "حبابك عشرة", lang: "ar" },
  { text: L("Community", "مجتمع") },
  { text: L("Karkadeh", "كركدي") },
  { text: L("Ful on Fridays", "فول الجمعة") },
];

// ---------------------------------------------------------------------------
// FAQ (home page)
// ---------------------------------------------------------------------------
export const faqs = [
  {
    q: L("Is membership free?", "هل العضوية مجانية؟"),
    a: L(
      "Yes. Membership is free. If an event or merch item costs anything, the price is listed before you sign up or order.",
      "نعم، العضوية مجانية. إذا كانت لفعالية أو منتج تكلفة، تُعلن قبل التسجيل أو الطلب.",
    ),
  },
  {
    q: L("Do I have to be Sudanese to join?", "هل يجب أن أكون سودانياً للانضمام؟"),
    a: L(
      "Not at all. Everyone is welcome, whether you’re Sudanese, have a connection to Sudan, or are simply curious about the culture.",
      "أبداً. الجميع مرحّب بهم، سواء كنت سودانياً أو لديك صلة بالسودان أو مهتماً بالثقافة السودانية.",
    ),
  },
  {
    q: L("How do I become a member?", "كيف أصبح عضواً؟"),
    a: L(
      "Sign up on the club’s Rubric page. It takes a minute with your UAlberta account.",
      "سجّل عبر صفحة المنظمة على روبرك. يستغرق الأمر دقيقة باستخدام حسابك في جامعة ألبرتا.",
    ),
  },
  {
    q: L("Where do I hear about events?", "أين أعرف عن الفعاليات؟"),
    a: L(
      "Subscribe to the club calendar on the Events page once, and new events appear in your calendar app automatically. Announcements also go out on Instagram @sso.uofa.",
      "اشترك مرة واحدة في تقويم المنظمة من صفحة الفعاليات، وستظهر الفعاليات الجديدة في تطبيق التقويم تلقائياً. تُنشر الإعلانات أيضاً على إنستغرام @sso.uofa.",
    ),
  },
  {
    q: L("Can I buy merch yet?", "هل يمكنني شراء المنتجات الآن؟"),
    a: L(
      "Not yet. The first collection is still being sampled. Prices on the site are estimates, and the pre-order window will be announced on Instagram.",
      "ليس بعد. المجموعة الأولى ما زالت في مرحلة العينات. الأسعار في الموقع تقديرية، وسيُعلن عن فترة الطلب المسبق على إنستغرام.",
    ),
  },
  {
    q: L("Will there be food?", "في أكل؟"),
    a: L(
      "Is that even a question? Expect legaimat, shai bi laban and, if we’re lucky, someone’s mum’s cooking.",
      "دا سؤال؟ لقيمات وشاي بلبن، ولو حظنا حلو، أكل من إيد أم واحد فينا.",
    ),
  },
  {
    q: L("Do events start on time?", "الفعاليات بتبدأ في وقتها؟"),
    a: L(
      "We aim for it. Sudanese time is real, but the shai is ready whenever you arrive.",
      "بنحاول. الوقت السوداني حقيقة، بس الشاي جاهز متين ما جيت.",
    ),
  },
  {
    q: L("I’m new to campus. Where should I start?", "أنا جديد في الجامعة. من أين أبدأ؟"),
    a: L(
      "Start with the “New here?” page, then come to a gathering. You don’t need to know anyone already.",
      "ابدأ بصفحة «جديد هنا؟» ثم احضر لقاءً. لا تحتاج لمعرفة أحد مسبقاً.",
    ),
  },
];
