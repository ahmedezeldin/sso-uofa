// Small enhancements on top of the pre-rendered pages. Everything works without
// this file; it only adds the mobile menu, live event sorting, copy buttons,
// prayer times and gallery thumbnails.
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Mobile menu ---------------------------------------------------------------
  const toggle = $(".menu-toggle");
  const nav = $("#site-nav");
  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
      nav.classList.toggle("open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    matchMedia("(min-width: 1100px)").addEventListener("change", () => setOpen(false));
  }

  // Remember the chosen language ---------------------------------------------
  $$("[data-set-lang]").forEach((a) =>
    a.addEventListener("click", () => {
      try {
        localStorage.setItem("sso-lang", a.dataset.setLang);
      } catch {}
    }),
  );

  // Keep upcoming/past event lists correct between deploys -------------------
  const today = (() => {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Edmonton", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
    const get = (k) => p.find((x) => x.type === k).value;
    return `${get("year")}-${get("month")}-${get("day")}`;
  })();
  // On the home page, events that just ended join the "recent" list instead.
  const pastList = $('[data-event-list="past"]') || $('[data-event-list="recent"]');
  $$('[data-event-list="upcoming"]').forEach((list) => {
    $$("[data-event-date]", list).forEach((card) => {
      if (card.dataset.eventDate >= today) return;
      pastList ? pastList.prepend(card) : card.remove();
      if (pastList?.dataset.eventList === "recent" && pastList.children.length > 3) pastList.lastElementChild.remove();
    });
    const empty = list.parentElement.querySelector("[data-upcoming-empty]");
    if (empty) empty.hidden = list.children.length > 0;
  });

  // Copy buttons -------------------------------------------------------------
  $$("[data-copy]").forEach((btn) => {
    const label = btn.textContent;
    btn.addEventListener("click", async () => {
      const input = $(btn.dataset.copy);
      try {
        await navigator.clipboard.writeText(input.value);
        btn.textContent = btn.dataset.copied;
        setTimeout(() => (btn.textContent = label), 2000);
      } catch {
        input.focus();
        input.select();
      }
    });
  });

  // Prayer times (public feed used by MSA UofA) ------------------------------
  const prayer = $("[data-prayer]");
  if (prayer) {
    const status = $("[data-prayer-status]", prayer);
    const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
    const keys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    let loadedAt = 0;
    const load = async () => {
      status.textContent = prayer.dataset.msgLoading;
      try {
        const res = await fetch("https://api.msauofa.ca/prayer-times", { cache: "no-store", signal: AbortSignal.timeout(10000) });
        if (!res.ok) throw Error(res.status);
        const data = await res.json();
        if (!keys.every((k) => timePattern.test(data[k]))) throw Error("Unexpected response");
        const fmt = new Intl.DateTimeFormat(prayer.dataset.locale, { timeZone: "UTC", hour: "numeric", minute: "2-digit" });
        const now = new Intl.DateTimeFormat("en-GB", { timeZone: "America/Edmonton", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date());
        const nowMinutes = Number(now.slice(0, 2)) * 60 + Number(now.slice(3, 5));
        let nextFound = false;
        for (const k of keys) {
          const [, h, m, ampm] = data[k].match(timePattern);
          const hours = (Number(h) % 12) + (ampm.toUpperCase() === "PM" ? 12 : 0);
          const item = $(`[data-prayer-key="${k}"]`, prayer);
          $("b", item).textContent = fmt.format(new Date(Date.UTC(2000, 0, 1, hours, Number(m))));
          const isNext = !nextFound && hours * 60 + Number(m) > nowMinutes;
          item.classList.toggle("is-next", isNext);
          item.dataset.next = isNext ? prayer.dataset.msgNext : "";
          if (isNext) nextFound = true;
        }
        // After Isha, tomorrow's Fajr is next.
        if (!nextFound) {
          const fajr = $('[data-prayer-key="Fajr"]', prayer);
          fajr.classList.add("is-next");
          fajr.dataset.next = prayer.dataset.msgNext;
        }
        status.textContent = "";
        loadedAt = Date.now();
      } catch {
        status.textContent = prayer.dataset.msgError;
      }
    };
    load();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && Date.now() - loadedAt > 30 * 60 * 1000) load();
    });
  }

  // Product gallery: highlight the thumbnail for the image in view ------------
  const track = $(".gallery-track");
  if (track && "IntersectionObserver" in window) {
    const thumbs = $$(".gallery-thumbs a");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          thumbs.forEach((t) => t.toggleAttribute("aria-current", t.hash === "#" + entry.target.id));
        }
      },
      { root: track, threshold: 0.6 },
    );
    $$("figure", track).forEach((f) => io.observe(f));
    thumbs.forEach((t) =>
      t.addEventListener("click", (e) => {
        e.preventDefault();
        const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        $(t.hash).scrollIntoView({ behavior, block: "nearest", inline: "start" });
      }),
    );
  }
  // Sudanese easter eggs -----------------------------------------------------
  // Click the jebena, the sun or the felucca in the hero; type "shai" or "sudan"
  // anywhere; look at the footer on a Friday.
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let messages = {};
  try {
    messages = JSON.parse($("#egg-messages")?.textContent || "{}");
  } catch {}
  let toastTimer;
  const toast = (text) => {
    let el = $(".egg-toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "egg-toast";
      el.setAttribute("role", "status");
      document.body.append(el);
    }
    el.textContent = text;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 5000);
  };
  const replay = (el) => {
    el.classList.remove("play");
    el.getBoundingClientRect();
    el.classList.add("play");
  };

  const hero = $(".hero-art");
  if (hero) {
    $$("[data-egg]", hero).forEach((part) =>
      part.addEventListener("click", () => {
        const key = "egg" + part.dataset.egg[0].toUpperCase() + part.dataset.egg.slice(1);
        toast(hero.dataset[key]);
        replay(part);
      }),
    );
  }

  const flagConfetti = () => {
    if (reduceMotion) return;
    const colours = ["#d21034", "#ffffff", "#000000", "#007229"];
    const layer = document.createElement("div");
    layer.className = "confetti";
    layer.setAttribute("aria-hidden", "true");
    for (let i = 0; i < 70; i++) {
      const bit = document.createElement("i");
      bit.style.cssText = `left:${Math.random() * 100}%;background:${colours[i % 4]};animation-delay:${Math.random() * 0.8}s;animation-duration:${2.2 + Math.random() * 1.6}s;--drift:${(Math.random() - 0.5) * 160}px;--spin:${Math.random() * 720}deg`;
      layer.append(bit);
    }
    document.body.append(layer);
    setTimeout(() => layer.remove(), 4800);
  };

  let typed = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.closest?.("input, textarea, select") || e.ctrlKey || e.metaKey || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-12);
    if (typed.endsWith("shai") || typed.endsWith("شاي")) {
      toast(messages.shai);
      typed = "";
    } else if (typed.endsWith("sudan") || typed.endsWith("سودان")) {
      toast(messages.sudan);
      flagConfetti();
      typed = "";
    }
  });

  // A different Sudanese saying in the footer on each visit.
  const proverb = $(".proverb");
  if (proverb) {
    try {
      const list = JSON.parse(proverb.dataset.proverbs);
      const pick = list[Math.floor(Math.random() * list.length)];
      $("blockquote", proverb).textContent = pick.ar;
      $("figcaption", proverb).textContent = pick.gloss;
    } catch {}
  }

  // Jumu'ah Mubarak on Fridays (Edmonton time).
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "America/Edmonton", weekday: "long" }).format(new Date());
  if (weekday === "Friday") $$(".friday").forEach((el) => (el.hidden = false));

  console.log(
    "%cأهلاً بيك! %cKef al-hal? Curious how this site is built? github.com/ahmedezeldin/sso-uofa",
    "font: 700 20px sans-serif; color: #612c32",
    "font: 14px sans-serif; color: #675e54",
  );
})();
