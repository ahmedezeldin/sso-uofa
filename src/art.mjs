// The illustration kit: the pieces of the home-page scene (sun, Meroë pyramids, doum palms,
// the Nile, a felucca, a jebena, textiles, birds) as small SVG builders, so the same elements
// can appear and move all over the site. All artwork here is decorative (aria-hidden).
// Animation classes (rise, sway, sail, bob, steam, twinkle, drift…) are styled in site.css.

const C = {
  sun: "#f8e2ae",
  farDune: "#e3aa77",
  nearDune: "#ebbb85",
  bank: "#d48b60",
  bankDeep: "#b9714f",
  stoneLight: "#cf8a5c",
  stoneDark: "#a35f42",
  chapel: "#b8704c",
  door: "#6e3a2e",
  trunk: "#6e3a2e",
  leaf: "#365c49",
  ripple: "#cfe3d8",
  maroon: "#612c32",
  gold: "#e6c9a7",
  clay: "#c98a5e",
  cream: "#fff8e8",
  terracotta: "#b4512f",
};

const svg = (viewBox, body, cls = "", extra = "") =>
  `<svg class="${cls}" viewBox="${viewBox}" aria-hidden="true" focusable="false"${extra}>${body}</svg>`;

// Shared gradient definitions; ids are suffixed so several scenes can live on one page.
const defs = (id) => `<defs>
  <linearGradient id="nile-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6f9e8f"/><stop offset="1" stop-color="#3f6f63"/></linearGradient>
  <pattern id="courses-${id}" width="8" height="11" patternUnits="userSpaceOnUse"><path d="M0 10.5h8" stroke="#4c2227" stroke-opacity=".16"/></pattern>
  <pattern id="weave-${id}" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M15 3 27 15 15 27 3 15Z" fill="none" stroke="#f1dfb8" stroke-width="2"/><path d="M15 10 20 15 15 20 10 15Z" fill="#d68a5c"/></pattern>
</defs>`;

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

// A steep Meroë pyramid with an optional chapel at its base. (x = apex x, base = ground y)
export function pyramid(id, { x, top, base, half, chapel = false, delay = 0 }) {
  const shape = `M${x - half} ${base} ${x} ${top}l${half} ${base - top}Z`;
  const shade = `M${x} ${top}l${half} ${base - top}H${x}Z`;
  const cw = half * 0.55;
  const ch = (base - top) * 0.14;
  return `<g class="rise" style="--d:${delay}s">
  <path d="${shape}" fill="${C.stoneLight}"/><path d="${shade}" fill="${C.stoneDark}"/><path d="${shape}" fill="url(#courses-${id})"/>
  ${chapel ? `<path d="M${x - cw} ${base}l2-${ch}h${cw * 2 - 4}l2 ${ch}Z" fill="${C.chapel}"/><path d="M${x - cw * 0.28} ${base}v-${ch * 0.55}a${cw * 0.28} ${cw * 0.28} 0 0 1 ${cw * 0.56} 0v${ch * 0.55}Z" fill="${C.door}"/>` : ""}
</g>`;
}

// A doum palm: the forked trunk is what sets it apart from a date palm.
export function palm({ x, y, scale = 1, delay = 0 }) {
  const fan = (fx, fy, s) =>
    `<g transform="translate(${fx} ${fy}) scale(${s})">${[-200, -175, -150, -125, -100, -75, -50, -25, 0, 20]
      .map((a) => `<path transform="rotate(${a})" d="M0 0c10-6 26-8 44-2-16 2-30 6-44 6z"/>`)
      .join("")}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="sway" style="--d:${delay}s">
  <path d="M0 0c-2-34 0-56-4-80m0 0c-10-18-22-30-34-40m34 40c6-20 16-34 30-48" fill="none" stroke="${C.trunk}" stroke-width="7" stroke-linecap="round"/>
  <g fill="${C.leaf}">${fan(-38, -120, 1)}${fan(26, -128, 1.05)}</g>
</g></g>`;
}

export function felucca({ x = 0, y = 0, scale = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="bob">
  <path d="M0 26h56l-8 10H8Z" fill="${C.door}"/>
  <path d="M26 26V-28" stroke="${C.door}" stroke-width="2.5"/>
  <path d="M27-26 54 20H27Z" fill="#fbf1de"/>
  <path d="M25-18 6 20h19Z" fill="#f1dfc0"/>
</g></g>`;
}

export function sun({ x, y, r = 60, cls = "" }) {
  return `<g class="sun ${cls}"><circle class="sun-halo" cx="${x}" cy="${y}" r="${r * 1.45}" fill="${C.sun}" opacity=".35"/><circle cx="${x}" cy="${y}" r="${r}" fill="${C.sun}"/></g>`;
}

export function birds({ x, y, scale = 1 }) {
  return `<g transform="translate(${x} ${y}) scale(${scale})"><g class="birds" fill="none" stroke="#7a3f33" stroke-width="2.4" stroke-linecap="round" opacity=".6">
  <path class="flap" d="M0 10q8-7 15 0q7-7 15 0"/><path class="flap" style="--d:.3s" d="M46-20q6-5 11 0q5-5 11 0"/><path class="flap" style="--d:.6s" d="M30 34q5-4 9 0q4-4 9 0"/>
</g></g>`;
}

// Wavy ripple lines that repeat every `period` units, so the group can loop seamlessly.
function ripples(width, period, rows) {
  let out = "";
  for (let x0 = 0; x0 < width + period; x0 += period) {
    for (const [dx, dy, w] of rows) out += `<path d="M${x0 + dx} ${dy}q${w / 4}-${w / 10} ${w / 2} 0t${w / 2} 0"/>`;
  }
  return out;
}

export function jebena({ steam = true } = {}) {
  return `<ellipse cx="74" cy="128" rx="34" ry="5" fill="#4c2227" opacity=".5"/>
<path d="M70 56c-18 0-25 18-20 34" fill="none" stroke="${C.clay}" stroke-width="5" stroke-linecap="round"/>
<path d="M92 104c12-8 20-24 24-44" fill="none" stroke="${C.clay}" stroke-width="6" stroke-linecap="round"/>
<circle cx="74" cy="102" r="26" fill="${C.clay}"/>
<path d="M65 80l3-36h12l3 36Z" fill="${C.clay}"/>
<rect x="63" y="39" width="22" height="6" rx="3" fill="${C.gold}"/>
<path d="M51 96q23 10 46 0" fill="none" stroke="${C.gold}" stroke-width="2.5"/>
<path d="M53 106q21 9 42 0" fill="none" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="3 4"/>
${steam ? `<g class="steam" fill="none" stroke="${C.gold}" stroke-width="2.4" stroke-linecap="round"><path d="M70 32c-5-6 1-10-1-16"/><path style="--d:.5s" d="M80 32c-5-6 1-10-1-16"/></g>` : ""}`;
}

// ---------------------------------------------------------------------------
// Home hero: a full-width landscape that assembles itself and moves with the page
// ---------------------------------------------------------------------------
export function heroScene() {
  const id = "hero";
  const pyramids = [
    { x: 930, top: 196, half: 34, delay: 0.9 },
    { x: 1310, top: 196, half: 30, delay: 1.1 },
    { x: 1010, top: 126, half: 46, delay: 0.5 },
    { x: 1240, top: 116, half: 50, chapel: true, delay: 0.7 },
    { x: 1180, top: 160, half: 40, delay: 0.8 },
    { x: 1090, top: 70, half: 62, chapel: true, delay: 0.3 },
  ];
  const base = 336;
  return svg(
    "0 0 1600 460",
    `${defs(id)}
<g data-depth="0.35">${sun({ x: 1150, y: 110, r: 58, cls: "egg egg-sun rise-sun" }).replace('<g class="sun', '<g data-egg="sun" class="sun')}</g>
<g data-depth="0.3"><g class="drift-birds">${birds({ x: 0, y: 60, scale: 1.2 })}</g></g>
<g data-depth="0.25"><path d="M0 322q200-40 420-16t440-6 440-12 300 12V460H0Z" fill="${C.farDune}"/></g>
<g data-depth="0.18">${pyramids.map((p) => pyramid(id, { ...p, base })).join("")}</g>
<g data-depth="0.1"><path d="M0 344q240-30 520-6t540-8 540-4V460H0Z" fill="${C.nearDune}"/>
  ${palm({ x: 1370, y: 372, scale: 1.05, delay: 0 })}${palm({ x: 1460, y: 378, scale: 0.75, delay: 1.2 })}${palm({ x: 310, y: 368, scale: 0.85, delay: 0.6 })}</g>
<g data-depth="0.05">
  <path d="M0 374q200-16 400-2t400-2 400-4 400 4v40q-200 10-400-4t-400 6-400-6-400 10Z" fill="url(#nile-${id})"/>
  <g class="flow" fill="none" stroke="${C.ripple}" stroke-width="2.4" stroke-linecap="round" opacity=".75">${ripples(1600, 400, [[40, 392, 30], [210, 402, 24], [320, 386, 18]])}</g>
  <g class="sail-across"><g data-egg="felucca" class="egg egg-felucca">${felucca({ x: 0, y: 352, scale: 1 })}</g></g>
</g>
<path d="M0 410q260-12 520 6t520-6 560 4V460H0Z" fill="${C.bank}"/>
<path d="M0 436q300-14 620 0t680-4 300 2V460H0Z" fill="${C.bankDeep}"/>
${picnic(id)}`,
    "hero-scene",
    ' preserveAspectRatio="xMidYMax slice"',
  );
}

// A picnic on the riverbank: a Sudanese textile laid out as a rug, with a jebena and cups.
function picnic(id) {
  return `<g data-egg="jebena" class="egg egg-jebena">
  <path d="M872 446h200l-30-34H902Z" fill="#37614c"/>
  <path d="M880 442h184l-24-26H906Z" fill="url(#weave-${id})"/>
  <g transform="translate(906 344) scale(.74)">${jebena()}</g>
  <g fill="${C.cream}" stroke="${C.clay}" stroke-width="1.5"><path d="M992 420h16l-2.5 12h-11Z"/><path d="M1016 423h16l-2.5 12h-11Z"/></g>
</g>`;
}

// ---------------------------------------------------------------------------
// Small scenes for the header band of each inner page
// ---------------------------------------------------------------------------
function ground(id) {
  return `<path d="M0 156q150-18 300-4t300-6V220H0Z" fill="${C.nearDune}"/>
<path d="M0 172q150-10 300 0t300-2v22q-150 8-300-2T0 196Z" fill="url(#nile-${id})"/>
<g class="flow" fill="none" stroke="${C.ripple}" stroke-width="2" stroke-linecap="round" opacity=".75">${ripples(600, 200, [[30, 184, 22], [130, 190, 16]])}</g>
<path d="M0 194q150-8 300 4t300-4V220H0Z" fill="${C.bank}"/>`;
}

export function vignette(name) {
  const id = "v-" + name;
  const smallPyramids = (x0, d = 0.2) =>
    [pyramid(id, { x: x0, top: 70, base: 160, half: 26, chapel: true, delay: d }), pyramid(id, { x: x0 + 52, top: 96, base: 160, half: 20, delay: d + 0.15 }), pyramid(id, { x: x0 - 44, top: 104, base: 160, half: 18, delay: d + 0.3 })].join("");
  const scenes = {
    events: `${sun({ x: 548, y: 66, r: 24 })}${smallPyramids(420)}${ground(id)}<g class="sail-back">${felucca({ x: 0, y: 150, scale: 0.6 })}</g>`,
    guide: `<g class="rise-sun">${sun({ x: 470, y: 86, r: 34 })}</g>${pyramid(id, { x: 360, top: 112, base: 160, half: 18, delay: 0.4 })}${ground(id)}${palm({ x: 500, y: 176, scale: 0.75 })}${palm({ x: 570, y: 180, scale: 0.55, delay: 0.8 })}`,
    resources: `<g class="moon"><circle cx="530" cy="62" r="28" fill="${C.sun}"/><circle cx="543" cy="54" r="25" fill="var(--sand)"/></g>
      <g fill="${C.terracotta}">${[[330, 52], [400, 34], [460, 96], [580, 30], [590, 104], [350, 110]].map(([x, y], i) => `<path class="twinkle" style="--d:${i * 0.4}s" d="M${x} ${y - 6}l1.6 4.4 4.4 1.6-4.4 1.6-1.6 4.4-1.6-4.4-4.4-1.6 4.4-1.6Z"/>`).join("")}</g>
      ${smallPyramids(430)}${ground(id)}`,
    merch: `${palm({ x: 300, y: 178, scale: 0.75 })}${palm({ x: 580, y: 176, scale: 0.75, delay: 0.7 })}
      <path d="M290 86Q440 126 566 80" fill="none" stroke="${C.trunk}" stroke-width="2"/>
      ${[[360, 101, "#37614c"], [438, 106, C.maroon], [512, 99, C.terracotta]].map(([x, y, col], i) => `<g transform="translate(${x} ${y})"><g class="swing" style="--d:${i * 0.5}s"><rect x="-24" y="0" width="48" height="60" rx="2" fill="${col}"/><rect x="-19" y="5" width="38" height="50" fill="url(#weave-${id})" opacity=".8"/><circle cx="-16" cy="0" r="3" fill="${C.door}"/><circle cx="16" cy="0" r="3" fill="${C.door}"/></g></g>`).join("")}
      ${ground(id)}`,
    team: `${ground(id)}<g transform="translate(372 34)">${jebena()}</g><g fill="${C.cream}" stroke="${C.clay}" stroke-width="2"><path d="M486 140h22l-3 16h-16Z"/><path d="M518 142h22l-3 16h-16Z"/><path d="M330 142h22l-3 16h-16Z"/></g>${palm({ x: 576, y: 178, scale: 0.6, delay: 0.4 })}`,
    contact: `${smallPyramids(400)}${ground(id)}<g class="drift-birds slow">${birds({ x: 0, y: 40, scale: 1 })}</g>${felucca({ x: 500, y: 150, scale: 0.6 })}`,
    lost: `${sun({ x: 540, y: 64, r: 28 })}${ground(id)}<g class="sail-back">${felucca({ x: 0, y: 150, scale: 0.6 })}</g>`,
  };
  return svg("110 24 490 196", `${defs(id)}${scenes[name] || scenes.events}`, `vignette vignette-${name}`, ' preserveAspectRatio="xMaxYMax slice"');
}

// ---------------------------------------------------------------------------
// Site-wide pieces
// ---------------------------------------------------------------------------

// A pyramids-and-palms skyline along the top of the footer.
export function skyline() {
  const id = "sky";
  const p = (x, top, half) => `<path d="M${x - half} 90 ${x} ${top}l${half} ${90 - top}Z"/>`;
  return svg(
    "0 0 1600 90",
    `<g fill="#e4d8c3">${p(220, 30, 22)}${p(262, 46, 16)}${p(186, 52, 14)}${p(1180, 16, 30)}${p(1236, 38, 22)}${p(1132, 44, 18)}${p(1290, 54, 14)}
</g>
    <path d="M0 78q200-14 400 0t400 0 400-4 400 4V90H0Z" fill="#f0e8da"/>
    <g class="flow" fill="none" stroke="#cdbd9f" stroke-width="2" stroke-linecap="round">${ripples(1600, 400, [[60, 84, 26], [260, 86, 20]])}</g>
    <g class="sail-across slow" opacity=".7">${felucca({ x: 0, y: 52, scale: 0.55 })}</g>
    <g fill="#d9c9ad">${[[620, 86, 0.32], [690, 88, 0.24], [1460, 86, 0.3]].map(([x, y, s]) => palm({ x, y, scale: s })).join("")}</g>`,
    "skyline",
    ' preserveAspectRatio="xMidYMax slice"',
  ).replace(/fill="#365c49"/g, 'fill="#d9c9ad"').replace(/stroke="#6e3a2e"/g, 'stroke="#d9c9ad"');
}

// A Nile-wave edge where two sections meet. `fill` is the colour of the neighbouring section;
// "top" hangs into the top of a section, "bottom" rises into its bottom.
export function waveEdge(fill, cls = "") {
  let d = "M0 40V22";
  for (let x = 0; x < 3200; x += 200) d += `q50-16 100 0t100 0`;
  d += "V40Z";
  return `<div class="wave-edge ${cls}" aria-hidden="true"><svg viewBox="0 0 3200 40" preserveAspectRatio="none" focusable="false"><path d="${d}" fill="${fill}"/></svg></div>`;
}

// A tiny felucca that sails along the header as you scroll.
export function voyage() {
  return `<div class="voyage" aria-hidden="true"><svg viewBox="-4 -32 64 72" focusable="false">${felucca({})}</svg></div>`;
}

// A steaming jebena for "the shai's still brewing" moments.
export function brewing() {
  return svg("30 10 100 125", jebena(), "brewing");
}
