import { client, urlFor } from './sanity';
import { getAssetUrl } from './assetHelper';
import { PROJECTS_QUERY, PROJECT_QUERY } from './projectQueries';
import { ALL_PROJECTS } from '../data/projectsData';

const GALLERY_API = import.meta.env.VITE_GALLERY_API_URL;
const IMAGE_SECTIONS = ['overview', 'problem', 'solution', 'impact'];

// Sanity image object -> CDN URL at the requested width (WebP/AVIF where supported).
// Plain strings are treated as R2 paths/URLs.
export function imageSrc(img, width = 1600) {
  if (!img) return null;
  if (typeof img === 'string') return getAssetUrl(img);
  if (img.asset) return urlFor(img).width(width).fit('max').auto('format').url();
  return null;
}

const imageList = (imgs, width) => (imgs || []).map((img) => imageSrc(img, width)).filter(Boolean);

function toCard(p) {
  return {
    ...p,
    id: p.id || p.slug?.current || p._id,
    img: p.imgUrl || imageSrc(p.img, 800),
  };
}

function withSectionImages(p) {
  const out = { ...p };
  IMAGE_SECTIONS.forEach((sec) => {
    out[`${sec}Images`] = imageList(p[`${sec}Images`], 1600);
  });
  return out;
}

function toDetail(p) {
  return withSectionImages({
    ...toCard(p),
    heroImg: p.imgUrl || imageSrc(p.img, 2400),
    // Local fallback data only has stock placeholders here; real galleries come from Sanity or R2.
    processImages: p._id ? p.processImages || [] : [],
  });
}

let projectsPromise;

// All projects for listings. Cached for the session; falls back to local data if Sanity is unreachable.
export function getProjects() {
  if (!projectsPromise) {
    projectsPromise = client
      .fetch(PROJECTS_QUERY)
      .then((list) => list.map(toCard))
      .catch((err) => {
        console.error('Sanity projects fetch failed, using local data:', err);
        projectsPromise = undefined;
        return ALL_PROJECTS.map(toCard);
      });
  }
  return projectsPromise;
}

export async function getProject(slug) {
  try {
    const doc = await client.fetch(PROJECT_QUERY, { slug });
    if (doc) return toDetail(doc);
  } catch (err) {
    console.error('Sanity project fetch failed, using local data:', err);
  }
  const local = ALL_PROJECTS.find((p) => p.id === slug);
  return local ? toDetail(local) : null;
}

// Gallery images as { thumb, full }: Sanity "Process Images" first, otherwise everything in R2 under
// portfolio/<r2Folder or slug>/ (R2 images are resized by SmartImg when optimized copies are enabled).
export async function getGallery(project) {
  const fromSanity = (project.processImages || [])
    .filter((img) => img?.asset)
    .map((img) => ({ thumb: imageSrc(img, 800), full: imageSrc(img, 1920) }));
  if (fromSanity.length || !GALLERY_API) return fromSanity;

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

// Verifies the password server-side (/api/unlock) and returns the gated case-study content.
export async function unlockProject(slug, password) {
  const res = await fetch('/api/unlock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, password }),
  });
  if (!res.ok) return null;
  return withSectionImages(await res.json());
}
