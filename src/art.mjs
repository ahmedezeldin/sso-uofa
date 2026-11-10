// The illustration kit: a Sudanese landscape (Jebel Barkal, the Meroë pyramids, doum palms,
// the Nile with a felucca, papyrus, a jebena on a rug) drawn as small SVG builders.
//
// Colours are never hard-coded in the scenes: every fill reads a CSS variable (--sky-1, --dune-2,
// --stone-lit…), and site.css defines those variables for four times of day (data-phase="dawn",
// "day", "dusk", "night"). The same drawing therefore works as a sunrise, noon, sunset or night scene.
//
// Motion follows the "no decorative loops" rule: scenes assemble once (.layer, .rise-sun) and
// otherwise only move with scrolling or when clicked. All artwork is decorative (aria-hidden).

const v = (name) => `style="fill:var(--${name})"`;
const stroke = (name, w) => `style="fill:none;stroke:var(--${name});stroke-width:${w};stroke-linecap:round"`;

const svg = (viewBox, body, cls, aspect = "xMidYMax slice") =>
  `<svg class="${cls}" viewBox="${viewBox}" preserveAspectRatio="${aspect}" aria-hidden="true" focusable="false">${body}</svg>`;

// Gradients and patterns; ids are suffixed so several scenes can share a page.
function defs(id) {
  return `<defs>
  <linearGradient id="nile-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--nile-1)"/><stop offset="1" style="stop-color:var(--nile-2)"/></linearGradient>
  <linearGradient id="haze-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky-3);stop-opacity:0"/><stop offset="1" style="stop-color:var(--sky-3);stop-opacity:.6"/></linearGradient>
  <radialGradient id="glow-${id}"><stop offset="0" style="stop-color:var(--sun-glow);stop-opacity:.75"/><stop offset=".45" style="stop-color:var(--sun-glow);stop-opacity:.25"/><stop offset="1" style="stop-color:var(--sun-glow);stop-opacity:0"/></radialGradient>
  <pattern id="courses-${id}" width="8" height="9" patternUnits="userSpaceOnUse"><path d="M0 8.5h8" stroke="#2a1416" stroke-opacity=".14"/></pattern>
  <pattern id="weave-${id}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M12 2 22 12 12 22 2 12Z" fill="none" stroke="#f1dfb8" stroke-width="1.6"/><path d="M12 8 16 12 12 16 8 12Z" fill="#d68a5c"/></pattern>
</defs>`;
}

// ---------------------------------------------------------------------------
// Elements
// ---------------------------------------------------------------------------

// Jebel Barkal: the flat-topped sandstone mountain near Karima, with the pinnacle at its end.
export function mesa(x, base, s = 1) {
  return `<g transform="translate(${x} ${base}) scale(${s})" ${v("far")}>
  <path d="M0 0 32-62 52-74 112-80 300-86 380-90 410-96 422-140 432-142 438-96 462-80 492-50 540 0Z"/>
  <path d="M560 0 572-16 584 0ZM596 0 610-22 624 0ZM636 0 646-12 656 0Z"/>
</g>`;
}

// A steep Meroë pyramid with its chapel and a shadow cast away from the sun.
export function pyramid(id, { x, top, base, half, chapel = false }) {
  const h = base - top;
  const cw = half * 0.55;
  const ch = h * 0.13;
  return `<g>
  <path class="cast" d="M${x - half} ${base}L${x + half * 0.2} ${base}L${x - half - h * 0.85} ${base + 10}Z" ${v("shadow")}/>
  <path d="M${x - half} ${base}L${x} ${top}V${base}Z" ${v("stone-shade")}/>
  <path d="M${x} ${top}L${x + half} ${base}H${x}Z" ${v("stone-lit")}/>
  <path d="M${x - half} ${base}L${x} ${top}L${x + half} ${base}Z" fill="url(#courses-${id})"/>
  ${chapel ? `<path d="M${x - cw} ${base}l2-${ch}h${cw * 2 - 4}l2 ${ch}Z" ${v("stone-shade")}/><path d="M${x - cw * 0.26} ${base}v-${ch * 0.55}a${cw * 0.26} ${cw * 0.26} 0 0 1 ${cw * 0.52} 0v${ch * 0.55}Z" ${v("trunk")}/>` : ""}
</g>`;
}

// A doum palm: the forked trunk is what sets it apart from a date palm.
export function palm({ x, y, s = 1 }) {
  const fan = (fx, fy, k) =>
    `<g transform="translate(${fx} ${fy}) scale(${k})">${[-205, -182, -160, -138, -116, -94, -72, -50, -28, -6, 14]
      .map((a) => `<path transform="rotate(${a})" d="M0 0c10-7 27-9 46-3-17 2-31 7-46 7z"/>`)
      .join("")}</g>`;
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M0 0c-2-36 0-58-4-84m0 0c-10-18-22-30-34-42m34 42c6-21 16-36 30-50" ${stroke("trunk", 7)}/>
  <g ${v("leaf")}>${fan(-38, -126, 1)}${fan(26, -134, 1.05)}</g>
</g>`;
}

export function felucca(s = 1) {
  return `<g transform="scale(${s})">
  <path d="M0 26h56l-8 10H8Z" ${v("trunk")}/>
  <path d="M26 26V-28" ${stroke("trunk", 2.5)}/>
  <path d="M27-26 54 20H27Z" ${v("sail")}/>
  <path d="M25-18 6 20h19Z" ${v("sail-shade")}/>
</g>`;
}

// Papyrus clump at the water's edge.
function papyrus(x, y, s = 1) {
  const stems = [[-14, -46], [-6, -58], [2, -52], [10, -62], [18, -44]];
  return `<g transform="translate(${x} ${y}) scale(${s})">
  ${stems.map(([dx, dy]) => `<path d="M0 0Q${dx * 0.4} ${dy * 0.5} ${dx} ${dy}" ${stroke("leaf", 2)}/><path d="M${dx} ${dy}l-7-6m7 6 0-9m0 9 7-6" ${stroke("leaf", 1.6)}/>`).join("")}
</g>`;
}

export function jebena(steam = true) {
  return `<ellipse cx="74" cy="128" rx="34" ry="5" fill="#2a1416" opacity=".35"/>
<path d="M70 56c-18 0-25 18-20 34" fill="none" stroke="#c98a5e" stroke-width="5" stroke-linecap="round"/>
<path d="M92 104c12-8 20-24 24-44" fill="none" stroke="#c98a5e" stroke-width="6" stroke-linecap="round"/>
<circle cx="74" cy="102" r="26" fill="#c98a5e"/>
<path d="M82 80l-3-36h-6l1 36Z" fill="#a8693f"/>
<path d="M65 80l3-36h12l3 36Z" fill="#c98a5e"/>
<path d="M88 92a26 26 0 0 1-6 30 26 26 0 0 0 0-46z" fill="#a8693f"/>
<rect x="63" y="39" width="22" height="6" rx="3" fill="#e6c9a7"/>
<path d="M51 96q23 10 46 0" fill="none" stroke="#e6c9a7" stroke-width="2.5"/>
<path d="M53 106q21 9 42 0" fill="none" stroke="#e6c9a7" stroke-width="1.5" stroke-dasharray="3 4"/>
${steam ? `<g class="steam" fill="none" stroke="#e6c9a7" stroke-width="2.2" stroke-linecap="round" opacity=".8"><path d="M70 32c-5-6 1-10-1-16"/><path d="M80 32c-5-6 1-10-1-16"/></g>` : ""}`;
}

// A textile laid out as a rug, with a jebena and two cups: a gathering on the riverbank.
function picnic(id, x, y, s = 1) {
  return `<g transform="translate(${x} ${y}) scale(${s})" data-egg="jebena" class="egg egg-jebena">
  <path d="M0 34h200l-30-34H30Z" fill="#37614c"/>
  <path d="M8 30h184l-24-26H34Z" fill="url(#weave-${id})"/>
  <g transform="translate(34 -68) scale(.74)">${jebena()}</g>
  <g fill="#fff8e8" stroke="#c98a5e" stroke-width="1.5"><path d="M120 8h16l-2.5 12h-11Z"/><path d="M144 11h16l-2.5 12h-11Z"/></g>
</g>`;
}

// Sun with a soft glow, and a crescent moon; site.css shows one or the other by time of day.
function sky(id, { x, y, r, stars, egg = false }) {
  const starDots = stars
    .map(([sx, sy, sr]) => `<circle cx="${sx}" cy="${sy}" r="${sr}"/>`)
    .join("");
  return `<g class="stars" ${v("star")}>${starDots}</g>
<g class="sun-body${egg ? ' egg egg-sun" data-egg="sun' : ""}">
  <circle cx="${x}" cy="${y}" r="${r * 3.4}" fill="url(#glow-${id})"/>
  <circle class="sun-disc" cx="${x}" cy="${y}" r="${r}" ${v("sun")}/>
</g>
<g class="moon-body${egg ? ' egg egg-sun" data-egg="sun' : ""}">
  <path d="M${x + 18} ${y - r * 0.7}a${r * 0.7} ${r * 0.7} 0 1 0 0 ${r * 1.4}a${r * 0.9} ${r * 0.9} 0 0 1 0-${r * 1.4}Z" ${v("moon")}/>
</g>`;
}

function starField(count, w, h, seed = 7) {
  // Deterministic scatter so every build draws the same sky.
  let n = seed;
  const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
  return Array.from({ length: count }, () => [Math.round(rnd() * w), Math.round(rnd() * h), (rnd() * 1.4 + 0.6).toFixed(1)]);
}

function birds(x, y, s = 1) {
  return `<g class="birds" transform="translate(${x} ${y}) scale(${s})" ${stroke("trunk", 2.2)} opacity=".55">
  <path d="M0 10q8-7 15 0q7-7 15 0"/><path d="M46-18q6-5 11 0q5-5 11 0"/><path d="M30 34q5-4 9 0q4-4 9 0"/>
</g>`;
}

// ---------------------------------------------------------------------------
// Home hero: a full-width landscape in depth. Layers assemble once, then drift with scrolling.
// ---------------------------------------------------------------------------
export function heroScene() {
  const id = "hero";
  const pyramids = [
    { x: 905, top: 216, half: 30, base: 322 },
    { x: 1338, top: 228, half: 26, base: 320 },
    { x: 990, top: 152, half: 42, base: 326 },
    { x: 1248, top: 142, half: 46, base: 326, chapel: true },
    { x: 1180, top: 192, half: 34, base: 324 },
    { x: 1090, top: 96, half: 58, base: 330, chapel: true },
  ];
  const layer = (i, depth, body) => `<g data-depth="${depth}"><g class="layer" style="--i:${i}">${body}</g></g>`;
  return svg(
    "0 0 1600 520",
    `${defs(id)}
${layer(0, 0.35, `<g class="rise-sun">${sky(id, { x: 1170, y: 150, r: 52, stars: starField(46, 1600, 260), egg: true })}</g>`)}
${layer(1, 0.3, `${mesa(150, 312, 1)}<rect x="0" y="180" width="1600" height="140" fill="url(#haze-${id})"/>`)}
${layer(2, 0.24, `<path d="M0 300C220 272 380 302 560 294S900 280 1100 290 1420 284 1600 292V520H0Z" ${v("dune-1")}/>`)}
${layer(3, 0.17, pyramids.map((p) => pyramid(id, p)).join(""))}
${layer(4, 0.1, `<path d="M0 350C260 322 480 352 700 344S1100 330 1300 340 1520 336 1600 340V520H0Z" ${v("dune-2")}/>
  <g ${stroke("dune-hi", 2)} opacity=".6"><path d="M180 362q60-10 120 0"/><path d="M560 356q50-8 100 0"/><path d="M1380 352q50-8 100 0"/></g>`)}
${layer(5, 0.05, `<path d="M0 378C300 364 520 380 800 376S1300 368 1600 378V432C1300 442 1000 428 800 434S300 440 0 434Z" fill="url(#nile-${id})"/>
  <g class="glints" ${v("glint")}><rect x="1120" y="386" width="100" height="3" rx="1.5"/><rect x="1136" y="396" width="68" height="3" rx="1.5"/><rect x="1110" y="406" width="120" height="3" rx="1.5"/><rect x="1146" y="416" width="48" height="3" rx="1.5"/><rect x="1128" y="425" width="84" height="2.5" rx="1.25"/></g>
  <g ${stroke("glint", 2)} opacity=".45"><path d="M80 404q14-5 28 0t28 0"/><path d="M420 396q12-5 24 0t24 0"/><path d="M660 414q14-5 28 0"/></g>
  <g class="felucca-ride"><g transform="translate(560 350)" data-egg="felucca" class="egg egg-felucca"><g class="felucca-bob">${felucca(1.15)}</g><g transform="translate(0 86) scale(1 -1)" opacity=".28">${felucca(1.15)}</g></g></g>`)}
${layer(6, 0, `<path d="M0 426C300 414 560 432 840 426S1300 416 1600 426V520H0Z" ${v("dune-3")}/>
  ${papyrus(250, 434, 1)}${papyrus(290, 438, 0.8)}${papyrus(1390, 432, 1.05)}${papyrus(1426, 436, 0.8)}
  ${picnic(id, 780, 440, 0.95)}`)}
${layer(7, 0, `<path d="M0 472C360 458 700 476 1040 468S1440 462 1600 470V520H0Z" ${v("dune-4")}/>
  ${palm({ x: 96, y: 486, s: 1.15 })}${palm({ x: 1505, y: 492, s: 1.55 })}`)}
${birds(560, 120, 1.1)}`,
    "hero-scene",
  );
}

// ---------------------------------------------------------------------------
// Inner pages: a full-width horizon along the bottom of each page header,
// each at its own time of day (the phase is set on the page header in templates.mjs).
// ---------------------------------------------------------------------------
export const pagePhases = { events: "dusk", guide: "dawn", resources: "night", team: "day", contact: "day", lost: "dusk" };

export function horizon(name) {
  const id = "h-" + name;
  const base = `<path d="M0 118C260 100 520 120 800 112S1340 104 1600 114V200H0Z" ${v("dune-1")}/>`;
  const nile = `<path d="M0 142C300 132 600 146 900 140S1400 134 1600 142V176C1300 184 1000 172 800 178S300 182 0 178Z" fill="url(#nile-${id})"/>`;
  const bank = `<path d="M0 172C320 162 640 178 960 172S1400 166 1600 174V200H0Z" ${v("dune-3")}/>`;
  const smallPyr = (x0) =>
    [
      pyramid(id, { x: x0 - 70, top: 66, half: 18, base: 120 }),
      pyramid(id, { x: x0 + 64, top: 72, half: 16, base: 118 }),
      pyramid(id, { x: x0, top: 30, half: 30, base: 122, chapel: true }),
    ].join("");
  const L = (i, body) => `<g class="layer" style="--i:${i}">${body}</g>`;
  const scenes = {
    events: `${L(0, sky(id, { x: 1240, y: 70, r: 26, stars: [] }))}${L(1, mesa(80, 116, 0.5))}${L(2, base + smallPyr(1080))}${L(3, nile + `<g transform="translate(640 120)">${felucca(0.7)}</g>`)}${L(4, bank + palm({ x: 1500, y: 190, s: 0.8 }))}`,
    guide: `${L(0, sky(id, { x: 800, y: 96, r: 30, stars: [] }))}${L(1, mesa(1000, 116, 0.42))}${L(2, base + pyramid(id, { x: 520, top: 70, half: 18, base: 120 }))}${L(3, nile)}${L(4, bank + palm({ x: 140, y: 190, s: 0.8 }) + palm({ x: 1460, y: 194, s: 0.9 }) + papyrus(1300, 180, 0.7))}`,
    resources: `${L(0, sky(id, { x: 1250, y: 56, r: 24, stars: starField(40, 1600, 100, 3) }))}${L(1, mesa(60, 116, 0.5))}${L(2, base + smallPyr(960))}${L(3, nile)}${L(4, bank + palm({ x: 1480, y: 190, s: 0.75 }))}`,
    team: `${L(0, sky(id, { x: 1300, y: 50, r: 22, stars: [] }))}${L(1, mesa(120, 116, 0.45))}${L(2, base + smallPyr(1120))}${L(3, nile)}${L(4, bank + picnic(id, 700, 150, 0.7) + palm({ x: 1500, y: 192, s: 0.8 }) + papyrus(300, 180, 0.7))}`,
    contact: `${L(0, sky(id, { x: 300, y: 56, r: 22, stars: [] }))}${L(1, mesa(1040, 116, 0.42))}${L(2, base)}${L(3, nile + `<g transform="translate(860 120)">${felucca(0.7)}</g>` + birds(560, 40, 0.9))}${L(4, bank + palm({ x: 160, y: 190, s: 0.8 }) + papyrus(1380, 180, 0.7))}`,
    lost: `${L(0, sky(id, { x: 1200, y: 70, r: 26, stars: [] }))}${L(1, base)}${L(2, nile + `<g transform="translate(760 120)">${felucca(0.7)}</g>`)}${L(3, bank)}`,
  };
  return svg("0 0 1600 200", defs(id) + (scenes[name] || scenes.events), "horizon");
}

// ---------------------------------------------------------------------------
// Event posters: small scenes behind each poster title.
// ---------------------------------------------------------------------------
export const posterPhases = { nile: "dusk", bbq: "night", film: "night" };

let posterCount = 0;
export function posterArt(style) {
  const id = `p-${style}-${posterCount++}`;
  const scenes = {
    nile: `${sky(id, { x: 352, y: 46, r: 20, stars: [] })}${mesa(10, 160, 0.32)}
      <path d="M0 158C100 150 220 160 400 154V225H0Z" ${v("dune-1")}/>
      ${pyramid(id, { x: 300, top: 104, half: 18, base: 160 })}${pyramid(id, { x: 340, top: 120, half: 13, base: 160 })}
      <path d="M0 176C120 170 260 180 400 174V206C260 212 120 202 0 208Z" fill="url(#nile-${id})"/>
      <path d="M0 202C140 196 260 206 400 200V225H0Z" ${v("dune-3")}/>`,
    bbq: `${sky(id, { x: 340, y: 46, r: 18, stars: starField(26, 400, 120, 11) })}
      <path d="M-10 60Q200 120 410 56" ${stroke("trunk", 1.5)}/>
      <g style="fill:#ffd28f">${[30, 80, 130, 180, 230, 280, 330, 380].map((x) => { const t = x / 400; const y = 60 + 4 * 58 * t * (1 - t) - 4; return `<circle cx="${x}" cy="${y + 8}" r="4.5"/><circle cx="${x}" cy="${y + 8}" r="11" opacity=".18"/>`; }).join("")}</g>
      <path d="M0 186C120 178 280 190 400 182V225H0Z" ${v("dune-2")}/>
      ${palm({ x: 40, y: 200, s: 0.55 })}${palm({ x: 370, y: 204, s: 0.5 })}`,
    film: `${sky(id, { x: 60, y: 40, r: 16, stars: starField(26, 400, 110, 5) })}
      <path d="M318 196 120 70h196Z" fill="#fff3d6" opacity=".14"/>
      <rect x="110" y="58" width="210" height="100" rx="3" fill="#fff3d6" opacity=".22"/>
      <path d="M0 186C120 178 280 190 400 182V225H0Z" ${v("dune-2")}/>
      ${palm({ x: 380, y: 204, s: 0.5 })}`,
  };
  return svg("0 0 400 225", defs(id) + (scenes[style] || scenes.nile), "poster-art", "xMidYMid slice");
}

// ---------------------------------------------------------------------------
// Site-wide pieces
// ---------------------------------------------------------------------------

// A Jebel Barkal, pyramids and palms skyline along the top of the footer (static silhouettes).
export function skyline() {
  const p = (x, top, half) => `<path d="M${x - half} 90 ${x} ${top}l${half} ${90 - top}Z"/>`;
  return svg(
    "0 0 1600 90",
    `<g fill="#e4d8c3">
    <path d="M60 90 80 62 92 58 260 54 274 50 280 30 286 30 290 50 300 58 330 90Z"/>
    ${p(1180, 16, 30)}${p(1236, 38, 22)}${p(1132, 44, 18)}${p(1290, 54, 14)}
    ${[[640, 90, 0.34], [706, 90, 0.26], [1470, 90, 0.32]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0c-2-36 0-58-4-84m0 0c-10-18-22-30-34-42m34 42c6-21 16-36 30-50" fill="none" stroke="#e4d8c3" stroke-width="9"/><circle cx="-38" cy="-130" r="34"/><circle cx="26" cy="-138" r="36"/></g>`).join("")}
    </g>
    <path d="M0 78q200-14 400 0t400 0 400-4 400 4V90H0Z" fill="#f0e8da"/>`,
    "skyline",
  );
}

// A Nile-wave edge where two sections meet. `fill` is the colour of the neighbouring section;
// "top" hangs into the top of a section, "bottom" rises into its bottom.
export function waveEdge(fill, cls = "") {
  let d = "M0 40V22";
  for (let x = 0; x < 1600; x += 200) d += `q50-16 100 0t100 0`;
  d += "V40Z";
  return `<div class="wave-edge ${cls}" aria-hidden="true"><svg viewBox="0 0 1600 40" preserveAspectRatio="none" focusable="false"><path d="${d}" fill="${fill}"/></svg></div>`;
}

// A tiny felucca that sails along the header as you scroll.
export function voyage() {
  return `<div class="voyage" aria-hidden="true"><svg viewBox="-4 -32 64 72" focusable="false"><path d="M0 26h56l-8 10H8Z" fill="#6e3a2e"/><path d="M26 26V-28" stroke="#6e3a2e" stroke-width="2.5"/><path d="M27-26 54 20H27Z" fill="#fbf1de"/><path d="M25-18 6 20h19Z" fill="#f1dfc0"/></svg></div>`;
}

// A jebena for "the shai's still brewing" moments.
export function brewing() {
  return `<svg class="brewing" viewBox="30 10 100 125" aria-hidden="true" focusable="false">${jebena()}</svg>`;
}
