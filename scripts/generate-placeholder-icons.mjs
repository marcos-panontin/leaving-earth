import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/placeholders');

const base = (content) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-hidden="true">${content}</svg>`;

const icons = {
  mass: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <text x="32" y="42" text-anchor="middle" font-size="28" font-family="system-ui,sans-serif" fill="#e2e8f0">M</text>
  `),
  thrust: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <path d="M32 48V20M32 20l-10 12M32 20l10 12" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  `),
  hourglass: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <path d="M20 16h24l-8 16 8 16H20l8-16-8-16z" fill="none" stroke="#fbbf24" stroke-width="3" stroke-linejoin="round"/>
  `),
  aerobraking: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <path d="M16 40c12-8 20-8 32 0M24 28h16" stroke="#fb923c" stroke-width="3" stroke-linecap="round" fill="none"/>
    <circle cx="44" cy="24" r="6" fill="#fb923c"/>
  `),
  'solar-radiation': base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="32" cy="32" r="10" fill="#facc15"/>
    <g stroke="#facc15" stroke-width="3" stroke-linecap="round">
      <path d="M32 10v8M32 46v8M10 32h8M46 32h8M16 16l6 6M42 42l6 6M48 16l-6 6M22 42l-6 6"/>
    </g>
  `),
  reentry: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <path d="M18 18c10 18 18 26 28 28-8 2-16 8-22 18" fill="none" stroke="#f87171" stroke-width="3" stroke-linecap="round"/>
  `),
  landing: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <path d="M32 14v24M24 46h16" stroke="#4ade80" stroke-width="3" stroke-linecap="round"/>
    <path d="M20 38h24l-4 8H24l-4-8z" fill="#4ade80"/>
  `),
  exclamation: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <text x="32" y="46" text-anchor="middle" font-size="36" font-family="system-ui,sans-serif" fill="#f472b6">!</text>
  `),
  jupiter: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="32" cy="32" r="14" fill="#c08457"/>
    <path d="M18 28h28M16 36h32" stroke="#f5deb3" stroke-width="2" opacity="0.8"/>
    <text x="32" y="54" text-anchor="middle" font-size="10" fill="#e2e8f0">J</text>
  `),
  saturn: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <ellipse cx="32" cy="34" rx="22" ry="6" fill="none" stroke="#e8be87" stroke-width="3"/>
    <circle cx="32" cy="30" r="10" fill="#e8be87"/>
    <text x="32" y="54" text-anchor="middle" font-size="10" fill="#e2e8f0">S</text>
  `),
  uranus: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="32" cy="32" r="12" fill="#a0edd8"/>
    <text x="32" y="54" text-anchor="middle" font-size="10" fill="#e2e8f0">U</text>
  `),
  neptune: base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <circle cx="32" cy="32" r="12" fill="#a0d8ed"/>
    <text x="32" y="54" text-anchor="middle" font-size="10" fill="#e2e8f0">N</text>
  `),
};

for (let n = 0; n <= 12; n += 1) {
  icons[String(n)] = base(`
    <rect x="4" y="4" width="56" height="56" rx="8" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
    <text x="32" y="42" text-anchor="middle" font-size="${n > 9 ? 24 : 30}" font-family="system-ui,sans-serif" fill="#f8fafc">${n}</text>
  `);
}

await mkdir(outDir, { recursive: true });

for (const [name, svg] of Object.entries(icons)) {
  await writeFile(path.join(outDir, `${name}.svg`), svg.trim());
}

console.log(`Generated ${Object.keys(icons).length} placeholder icons in ${outDir}`);
