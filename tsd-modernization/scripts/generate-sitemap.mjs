/* Post-build sitemap generator.
 *
 * Walks the prerendered dist/ tree, finds every index.html, and
 * generates dist/sitemap.xml. Keeping this as a post-build step
 * means new routes (anything vite-react-ssg renders) appear in the
 * sitemap automatically — no hand-editing public/sitemap.xml.
 *
 * Per-route priority/changefreq overrides live in PRIORITY_META
 * below. Routes not in the table fall back to DEFAULT_META.
 */

import { readdirSync, writeFileSync } from "fs";
import { join, relative } from "path";

const DIST_DIR = "dist";
const BASE_URL = "https://tsd-modernization.com";

const PRIORITY_META = {
  "/": { priority: 1.0, changefreq: "weekly" },
  "/services": { priority: 0.9, changefreq: "monthly" },
  "/services/ai-integration": { priority: 0.8, changefreq: "monthly" },
  "/services/websites": { priority: 0.8, changefreq: "monthly" },
  "/services/process-modernization": { priority: 0.8, changefreq: "monthly" },
  "/why-us": { priority: 0.8, changefreq: "monthly" },
  "/process": { priority: 0.7, changefreq: "monthly" },
  "/pricing": { priority: 0.9, changefreq: "monthly" },
  "/ai-receptionist": { priority: 0.8, changefreq: "monthly" },
  "/testimonials": { priority: 0.6, changefreq: "monthly" },
  "/team": { priority: 0.6, changefreq: "monthly" },
  "/contact": { priority: 0.9, changefreq: "monthly" },
};
const DEFAULT_META = { priority: 0.5, changefreq: "monthly" };

function findRoutes(rootDir) {
  const found = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        // Skip hidden dirs and the static asset bundle dir
        if (entry.name.startsWith(".") || entry.name === "assets") continue;
        stack.push(full);
      } else if (entry.name === "index.html") {
        const rel = relative(rootDir, full).replace(/\\/g, "/");
        let route = "/" + rel.replace(/\/?index\.html$/, "");
        // collapse "/" + "" → "/"
        if (route === "/") route = "/";
        found.push(route);
      }
    }
  }
  return found.sort();
}

const routes = findRoutes(DIST_DIR);
const urlNodes = routes
  .map((r) => {
    const meta = PRIORITY_META[r] || DEFAULT_META;
    const loc = BASE_URL + (r === "/" ? "/" : r);
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority.toFixed(1)}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlNodes}
</urlset>
`;

writeFileSync(join(DIST_DIR, "sitemap.xml"), xml);
// Also keep public/sitemap.xml in sync so dev mode serves the right thing
// and route additions show up in git diff after a build. Skipped silently
// if public/ doesn't exist for any reason.
try {
  writeFileSync("public/sitemap.xml", xml);
} catch (e) { /* no-op */ }
console.log(`✓ Generated sitemap.xml (${routes.length} routes)`);
