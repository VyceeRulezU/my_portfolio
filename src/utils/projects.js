import { client, urlFor } from './sanity';
import { getAssetUrl } from './assetHelper';
import { PROJECT_QUERY } from './projectQueries';

// Source of truth: content/projects/*.md (compiled by the project-content plugin in vite.config.js).
// Sanity is only consulted for slugs that aren't in the repo, and for private case-study bodies.
const files = import.meta.glob('/content/projects/*.md', { eager: true, import: 'default' });

const GALLERY_API = import.meta.env.VITE_GALLERY_API_URL;
const IMAGE_SECTIONS = ['overview', 'problem', 'solution', 'impact'];

// R2 key (e.g. "portfolio/grh/cover.png") or full URL -> public URL.
const r2Url = (key) => (!key ? null : key.startsWith('http') ? key : getAssetUrl(`/${encodeURI(key)}`));

function fromFile(file) {
  const project = {
    ...file,
    id: file.slug,
    isPrivate: Boolean(file.private),
    hasPassword: Boolean(file.private),
    img: r2Url(file.cover),
    heroImg: r2Url(file.cover),
    gallery: (file.gallery || []).map((key) => ({ thumb: r2Url(key), full: r2Url(key) })),
  };
  IMAGE_SECTIONS.forEach((sec) => {
    project[`${sec}Images`] = (file.images?.[sec] || []).map(r2Url);
  });
  return project;
}

export const PROJECTS = Object.values(files)
  .map(fromFile)
  .sort((a, b) => String(a.num).localeCompare(String(b.num), undefined, { numeric: true }));

export const findProject = (slug) => PROJECTS.find((p) => p.id === slug || p.aliases?.includes(slug));

// ---------- Sanity fallback ----------

// Sanity image object -> CDN URL at the requested width (WebP/AVIF where supported).
export function imageSrc(img, width = 1600) {
  if (!img) return null;
  if (typeof img === 'string') return getAssetUrl(img);
  if (img.asset) return urlFor(img).width(width).fit('max').auto('format').url();
  return null;
}

const imageList = (imgs, width) => (imgs || []).map((img) => imageSrc(img, width)).filter(Boolean);

function withSectionImages(p) {
  const out = { ...p };
  IMAGE_SECTIONS.forEach((sec) => {
    out[`${sec}Images`] = p.r2Images?.[sec]?.length ? p.r2Images[sec] : imageList(p[`${sec}Images`], 1600);
  });
  return out;
}

function fromSanity(doc) {
  return withSectionImages({
    ...doc,
    img: doc.imgUrl || imageSrc(doc.img, 800),
    heroImg: doc.imgUrl || imageSrc(doc.img, 2400),
    source: 'sanity',
  });
}

export async function getProject(slug) {
  const local = findProject(slug);
  if (local) return local;
  try {
    const doc = await client.fetch(PROJECT_QUERY, { slug });
    return doc ? fromSanity(doc) : null;
  } catch (err) {
    console.error('Sanity fallback fetch failed:', err);
    return null;
  }
}

// Gallery images as { thumb, full }. Repo projects list them explicitly; Sanity fallbacks use
// r2Images.gallery, then "Process Images", then everything in R2 under portfolio/<r2Folder or slug>/.
export async function getGallery(project) {
  if (project.source !== 'sanity') return project.gallery || [];
  if (project.r2Images?.gallery?.length) return project.r2Images.gallery.map((url) => ({ thumb: url, full: url }));

  const fromProcess = (project.processImages || [])
    .filter((img) => img?.asset)
    .map((img) => ({ thumb: imageSrc(img, 800), full: imageSrc(img, 1920) }));
  if (fromProcess.length || !GALLERY_API) return fromProcess;

  const folder = project.r2Folder || project.id;
  try {
    const res = await fetch(`${GALLERY_API}?project=${encodeURIComponent(folder)}`);
    if (!res.ok) return [];
    const { images = [] } = await res.json();
    const thumb = project.img && decodeURI(project.img);
    return images
      .filter((url) => decodeURI(url) !== thumb)
      .map((url) => encodeURI(decodeURI(url)))
      .map((url) => ({ thumb: url, full: url }));
  } catch {
    return [];
  }
}

// Verifies the password server-side (/api/unlock) and returns the gated case-study content from Sanity.
export async function unlockProject(slug, password) {
  const res = await fetch('/api/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, password }),
  });
  if (!res.ok) return null;
  return withSectionImages(await res.json());
}
