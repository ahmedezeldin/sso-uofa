// Local preview server: serves _site/ under /sso-uofa/ to match GitHub Pages.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../_site", import.meta.url));
const base = "/sso-uofa/";
const port = Number(process.env.PORT) || 8080;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ics": "text/calendar; charset=utf-8",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/" || url.pathname === "/sso-uofa") {
      res.writeHead(302, { Location: base });
      return res.end();
    }
    if (!url.pathname.startsWith(base)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    let file = path.join(root, decodeURIComponent(url.pathname.slice(base.length)));
    if (!file.startsWith(root)) {
      res.writeHead(403);
      return res.end();
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      res.writeHead(404, { "Content-Type": types[".html"] });
      const notFound = path.join(root, "404.html");
      return res.end(fs.existsSync(notFound) ? fs.readFileSync(notFound) : "Not found");
    }
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, () => console.log(`Serving ${root} at http://localhost:${port}${base}`));
