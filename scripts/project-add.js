// Upload a folder of project images to R2 and create/update content/projects/<slug>.md.
//
//   npm run project:add -- <slug> <folder> [--first] [--overwrite]
//
// Folder layout (every part optional; files are ordered by name, so prefix them 01-, 02-, ...):
//   cover.png                      -> cover
//   gallery/*.png                  -> gallery
//   overview|problem|solution|impact/*.png -> images under that section
//
// New slug: writes a template with TODO placeholders (the production build refuses to ship TODOs).
// Existing slug: adds new images to the file, leaving the text alone.
// --first      number the project 01 and shift the others down (it appears first on the site)
// --overwrite  re-upload images whose R2 key already exists
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, basename } from 'node:path';
import { put, exists, uploadVariants, CONTENT_TYPES, RESIZABLE } from './lib/r2.js';
import { parseProjectFile, stringifyProjectFile, SECTIONS, SECTION_TITLES } from './lib/projectFile.js';

const CONTENT_DIR = 'content/projects';
const IMAGE_EXT = /\.(png|jpe?g|webp|gif|avif)$/i;
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true });
const cleanName = (file) => basename(file, extname(file)).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const [slug, folder] = args.filter((a) => !a.startsWith('--'));
if (!slug || !folder || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run project:add -- <slug> <folder> [--first] [--overwrite]\n(slug: lowercase letters, numbers, dashes)');
  process.exit(1);
}
if (!existsSync(folder) || !(await stat(folder)).isDirectory()) {
  console.error(`Folder not found: ${folder}`);
  process.exit(1);
}

async function listImages(dir) {
  if (!existsSync(dir)) return [];
  return (await readdir(dir)).filter((f) => IMAGE_EXT.test(f)).sort(naturalSort).map((f) => join(dir, f));
}

async function upload(file, key) {
  if (!flags.has('--overwrite') && await exists(key)) {
    console.log(`  = ${key} (already in R2)`);
    return key;
  }
  const body = await readFile(file);
  await put(key, body, CONTENT_TYPES[extname(file).toLowerCase()] || 'application/octet-stream');
  if (RESIZABLE.test(key)) await uploadVariants(key, body, { log: false });
  console.log(`  + ${key}`);
  return key;
}

const base = `portfolio/${slug}`;
const found = { gallery: [], ...Object.fromEntries(SECTIONS.map((s) => [s, []])) };

const coverFile = (await readdir(folder)).find((f) => /^cover\./i.test(f) && IMAGE_EXT.test(f));
const cover = coverFile ? await upload(join(folder, coverFile), `${base}/cover${extname(coverFile).toLowerCase()}`) : null;
for (const group of Object.keys(found)) {
  for (const file of await listImages(join(folder, group))) {
    found[group].push(await upload(file, `${base}/${group}/${cleanName(file)}${extname(file).toLowerCase()}`));
  }
}

const path = join(CONTENT_DIR, `${slug}.md`);
const merge = (current = [], added = []) => [...current, ...added.filter((k) => !current.includes(k))];

let data;
let sections;
if (existsSync(path)) {
  ({ data, sections } = parseProjectFile(await readFile(path, 'utf8'), `${slug}.md`));
  if (cover) data.cover = cover;
  data.gallery = merge(data.gallery, found.gallery);
  for (const s of SECTIONS) {
    if (!found[s].length) continue;
    data.images = { ...data.images, [s]: merge(data.images?.[s], found[s]) };
  }
  console.log(`updated ${path}`);
} else {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
  data = {
    title: 'TODO: Project title',
    slug,
    num: String(files.length + 1).padStart(2, '0'),
    type: 'live',
    role: 'TODO: Your role',
    year: String(new Date().getFullYear()),
    url: 'TODO: https://… (delete this line if there is no live link)',
    headline: 'TODO: One-line headline',
    desc: 'TODO: One or two sentences for the project card.',
    cover: cover || 'TODO: portfolio/<slug>/cover.png',
    gallery: found.gallery,
    ...(SECTIONS.some((s) => found[s].length) && {
      images: Object.fromEntries(SECTIONS.filter((s) => found[s].length).map((s) => [s, found[s]])),
    }),
  };
  sections = Object.fromEntries(SECTIONS.map((s) => [s, `TODO: ${SECTION_TITLES[s]} copy.`]));
  console.log(`created ${path}`);
}

if (flags.has('--first')) {
  const files = (await readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md') && f !== `${slug}.md`);
  const others = [];
  for (const f of files) {
    const parsed = parseProjectFile(await readFile(join(CONTENT_DIR, f), 'utf8'), f);
    others.push({ f, ...parsed });
  }
  others.sort((a, b) => naturalSort(String(a.data.num), String(b.data.num)));
  data.num = '01';
  for (const [i, o] of others.entries()) {
    o.data.num = String(i + 2).padStart(2, '0');
    await writeFile(join(CONTENT_DIR, o.f), stringifyProjectFile(o.data, o.sections));
  }
  console.log(`renumbered: ${slug} is 01, ${others.length} others shifted down`);
}

await writeFile(path, stringifyProjectFile(data, sections));
console.log(`cover: ${data.cover}\ngallery: ${data.gallery.length} image(s)${data.images ? `\nsection images: ${Object.entries(data.images).map(([k, v]) => `${k} ${v.length}`).join(', ')}` : ''}`);
