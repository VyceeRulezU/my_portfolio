// Sync project content between the repo (source of truth) and Sanity (backup / fallback).
//
//   npm run content:push              # repo -> Sanity: mirror every content/projects/*.md into Sanity
//   npm run content:pull [-- --force] # Sanity -> repo: write content/projects/<slug>.md, copying Sanity-hosted
//                                     #   images into R2 (used for the initial migration; --force overwrites files)
//
// Private case studies (`private: true`) keep their body in Sanity only (the GitHub repo is public);
// push never overwrites their sections, and the site fetches them through /api/unlock.
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join } from 'node:path';
import { createClient } from '@sanity/client';
import { SANITY_CONFIG } from '../src/utils/sanityConfig.js';
import { parseProjectFile, stringifyProjectFile, SECTIONS } from './lib/projectFile.js';
import { portableTextToMarkdown, markdownToPortableText } from './lib/portableText.js';
import { put, exists, uploadVariants, publicBase, CONTENT_TYPES } from './lib/r2.js';

const CONTENT_DIR = 'content/projects';
// Sanity slugs that get a cleaner slug in the repo; the old one stays working as an alias.
const SLUG_RENAMES = { 'Copy Deployment Chrome Extension': 'typebridge' };

const sanity = createClient({ ...SANITY_CONFIG, useCdn: false, token: process.env.SANITY_WRITE_TOKEN });
const GALLERY_API = process.env.VITE_GALLERY_API_URL;

const keyFromUrl = (url) => decodeURI(url.replace(`${publicBase}/`, ''));
const urlFromKey = (key) => `${publicBase}/${encodeURI(key)}`;
const pad = (n) => String(n).padStart(2, '0');

// Copy a Sanity image asset into R2 at `baseKey` + its original extension (skips work already done).
async function copySanityImage(image, baseKey) {
  const ref = image?.asset?._ref;
  const match = ref && /^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/.exec(ref);
  if (!match) return null;
  const [, id, size, ext] = match;
  const key = `${baseKey}.${ext}`;
  if (!(await exists(key))) {
    const res = await fetch(`https://cdn.sanity.io/images/${SANITY_CONFIG.projectId}/${SANITY_CONFIG.dataset}/${id}-${size}.${ext}`);
    if (!res.ok) throw new Error(`download ${ref}: HTTP ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());
    await put(key, body, CONTENT_TYPES[`.${ext}`] || 'application/octet-stream');
    if (/^(png|jpe?g|webp)$/i.test(ext)) await uploadVariants(key, body, { log: false });
  }
  return key;
}

async function copyAll(images = [], prefix) {
  const keys = [];
  for (const [i, img] of images.entries()) {
    const key = await copySanityImage(img, `${prefix}/${pad(i + 1)}`);
    if (key) keys.push(key);
  }
  return keys;
}

async function r2Folder(folder, exclude) {
  if (!GALLERY_API) return [];
  const res = await fetch(`${GALLERY_API}?project=${encodeURIComponent(folder)}`);
  if (!res.ok) return [];
  const { images = [] } = await res.json();
  return images.map(keyFromUrl).filter((key) => key !== exclude);
}

async function pull({ force }) {
  await mkdir(CONTENT_DIR, { recursive: true });
  const docs = await sanity.fetch(`*[_type == "project" && !(_id in path("drafts.**"))] | order(num asc)`);
  for (const doc of docs) {
    const sanitySlug = doc.slug.current;
    const slug = SLUG_RENAMES[sanitySlug] || sanitySlug;
    const file = join(CONTENT_DIR, `${slug}.md`);
    if (existsSync(file) && !force) {
      console.log(`skip ${file} (exists; --force to overwrite)`);
      continue;
    }
    const base = `portfolio/${slug}`;

    const cover = doc.imgUrl ? keyFromUrl(doc.imgUrl) : await copySanityImage(doc.img, `${base}/cover`);
    let gallery = await copyAll(doc.processImages, `${base}/gallery`);
    if (!gallery.length) gallery = await r2Folder(doc.r2Folder || sanitySlug, cover);
    const images = {};
    for (const sec of SECTIONS) {
      const keys = await copyAll(doc[`${sec}Images`], `${base}/${sec}`);
      if (keys.length) images[sec] = keys;
    }

    const data = {
      title: doc.title,
      slug,
      ...(slug !== sanitySlug && { aliases: [sanitySlug] }),
      num: doc.num,
      type: doc.type,
      role: doc.role,
      year: doc.year,
      ...(doc.url && { url: doc.url }),
      ...(doc.isPrivate && { private: true }),
      headline: doc.headline,
      desc: doc.desc,
      cover,
      gallery,
      ...(Object.keys(images).length && { images }),
    };
    const sections = doc.isPrivate
      ? {}
      : Object.fromEntries(SECTIONS.map((s) => [s, portableTextToMarkdown(doc[s])]));
    await writeFile(file, stringifyProjectFile(data, sections));
    console.log(`wrote ${file} (gallery ${gallery.length}, section images ${Object.values(images).flat().length})`);
  }
}

async function push() {
  const files = (await readdir(CONTENT_DIR)).filter((f) => extname(f) === '.md');
  const existing = await sanity.fetch(`*[_type == "project" && !(_id in path("drafts.**"))] { _id, "slug": slug.current }`);
  const tx = sanity.transaction();
  for (const f of files) {
    const { data, sections } = parseProjectFile(await readFile(join(CONTENT_DIR, f), 'utf8'), f);
    const match = existing.find((d) => d.slug === data.slug || data.aliases?.includes(d.slug));
    const _id = match?._id || data.slug;
    const fields = {
      title: data.title,
      num: String(data.num),
      type: data.type,
      role: data.role,
      year: data.year != null ? String(data.year) : undefined,
      url: data.url,
      headline: data.headline,
      desc: data.desc,
      isPrivate: Boolean(data.private),
      imgUrl: data.cover ? urlFromKey(data.cover) : undefined,
      r2Images: {
        gallery: (data.gallery || []).map(urlFromKey),
        ...Object.fromEntries(SECTIONS.map((s) => [s, (data.images?.[s] || []).map(urlFromKey)])),
      },
      ...(!data.private && Object.fromEntries(SECTIONS.map((s) => [s, markdownToPortableText(sections[s] || '')]))),
    };
    Object.keys(fields).forEach((k) => fields[k] === undefined && delete fields[k]);
    tx.createIfNotExists({ _id, _type: 'project', title: data.title, slug: { _type: 'slug', current: data.slug } });
    tx.patch(_id, { set: fields });
    console.log(`${match ? 'update' : 'create'} ${_id} <- ${f}`);
  }
  await tx.commit({ autoGenerateArrayKeys: true });
  console.log(`pushed ${files.length} projects to Sanity`);
}

const [command, flag] = process.argv.slice(2);
if (command === 'pull') await pull({ force: flag === '--force' });
else if (command === 'push') await push();
else {
  console.error('Usage: npm run content:push  |  npm run content:pull [-- --force]');
  process.exit(1);
}
