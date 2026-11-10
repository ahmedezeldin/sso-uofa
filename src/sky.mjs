// Which sky to draw on the home page: "dawn", "day", "dusk" or "night" in Edmonton right now.
//
// Sunrise and sunset come from NOAA's simplified solar equations, which are accurate to a
// minute or two. The build inlines this function into the page (see templates.mjs) so the
// right sky is there on first paint, so it must stay self-contained: no imports, no globals.
export function skyPhase(date = new Date()) {
  const LAT = 53.5461;
  const LNG = -113.4938;
  const rad = Math.PI / 180;

  // Day of the year, then the "fractional year" angle the equations are written in.
  const year = date.getUTCFullYear();
  const dayOfYear = Math.floor((Date.UTC(year, date.getUTCMonth(), date.getUTCDate()) - Date.UTC(year, 0, 0)) / 864e5);
  const g = ((2 * Math.PI) / 365) * (dayOfYear - 1);

  // Equation of time (minutes) and the sun's declination (radians).
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(g) -
      0.032077 * Math.sin(g) -
      0.014615 * Math.cos(2 * g) -
      0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 -
    0.399912 * Math.cos(g) +
    0.070257 * Math.sin(g) -
    0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) -
    0.002697 * Math.cos(3 * g) +
    0.00148 * Math.sin(3 * g);

  // Hour angle of sunrise/sunset (degrees), clamped for the polar edge cases.
  const cosHa = Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl);
  const hourAngle = Math.acos(Math.min(1, Math.max(-1, cosHa))) / rad;

  // Minutes since local midnight in Edmonton, and Edmonton's current UTC offset.
  const [h, m] = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Edmonton",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .split(":");
  const local = Number(h) * 60 + Number(m);
  const utc = date.getUTCHours() * 60 + date.getUTCMinutes();
  const offset = ((local - utc + 2160) % 1440) - 720;

  const sunrise = 720 - 4 * (LNG + hourAngle) - eqTime + offset;
  const sunset = 720 - 4 * (LNG - hourAngle) - eqTime + offset;

  if (local < sunrise - 50 || local > sunset + 50) return "night";
  if (local < sunrise + 60) return "dawn";
  if (local > sunset - 70) return "dusk";
  return "day";
}
