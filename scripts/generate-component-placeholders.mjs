import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/components');

const COLORS = {
  blue: '#3b82f6',
  black: '#1f2937',
  red: '#ef4444',
  green: '#22c55e',
  brown: '#a16207',
  gray: '#6b7280',
};

const components = [
  { type: 'probe', name: 'Probe', class: 'blue' },
  { type: 'capsule', name: 'Eagle', class: 'blue' },
  { type: 'capsule', name: 'Vostok', class: 'black' },
  { type: 'capsule', name: 'Apollo', class: 'black' },
  { type: 'capsule', name: 'Aldrin', class: 'blue' },
  { type: 'rocket', name: 'Juno', class: 'red' },
  { type: 'rocket', name: 'Atlas', class: 'red' },
  { type: 'rocket', name: 'Soyuz', class: 'red' },
  { type: 'rocket', name: 'Saturn', class: 'red' },
  { type: 'rocket', name: 'Ion', class: 'blue' },
  { type: 'other', name: 'Supplies', class: 'green' },
  { type: 'other', name: 'Supplies 5x', class: 'green' },
  { type: 'other', name: 'Sample', class: 'brown' },
];

const astronauts = [
  'Buzz Aldrin', 'Neil Armstrong', 'Michael Collins', 'John Glenn', 'Yuri Gagarin',
  'Valentina Tereshkova', 'Alan Shepard', 'James Lovell',
];

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function cardSvg(label, color, subtitle = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 160" role="img" aria-label="${label}">
  <rect width="120" height="160" rx="8" fill="${color}" stroke="#e5e7eb" stroke-width="2"/>
  <text x="60" y="72" text-anchor="middle" font-size="14" font-family="system-ui,sans-serif" fill="#f8fafc">${label}</text>
  ${subtitle ? `<text x="60" y="92" text-anchor="middle" font-size="10" font-family="system-ui,sans-serif" fill="#e5e7eb">${subtitle}</text>` : ''}
  <text x="60" y="140" text-anchor="middle" font-size="9" font-family="system-ui,sans-serif" fill="#cbd5e1">placeholder</text>
</svg>`;
}

await mkdir(outDir, { recursive: true });

for (const item of components) {
  const file = `${item.type}-${slug(item.name)}.svg`;
  await writeFile(path.join(outDir, file), cardSvg(item.name, COLORS[item.class] ?? '#475569', item.type));
}

for (const name of astronauts) {
  await writeFile(path.join(outDir, `astronaut-${slug(name)}.svg`), cardSvg(name, '#334155', 'astronaut'));
}

console.log(`Generated ${components.length + astronauts.length} component/personnel placeholders`);
