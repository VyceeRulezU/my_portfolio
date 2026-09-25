const R2_BASE = (import.meta.env.VITE_CLOUDFLARE_URL || '').replace(/\/$/, '');
// Set once `npm run r2:upload -- --optimize` has generated the resized WebP copies in R2.
const R2_OPTIMIZED = import.meta.env.VITE_R2_OPTIMIZED === 'true';

/**
 * Resolve an asset path against the R2 public bucket (VITE_CLOUDFLARE_URL).
 * Full http(s) URLs are returned unchanged; without VITE_CLOUDFLARE_URL the path is returned as-is.
 */
export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http') || !R2_BASE) return path;
  return `${R2_BASE}${path.startsWith('/') ? path : `/${path}`}`;
};

export const R2_WIDTHS = [800, 1920];

/**
 * URL of the resized WebP copy of an R2 image (optimized/w<width>/<key>.webp), or the
 * original URL for non-R2 images or when the optimized copies aren't enabled.
 */
export const optimizedSrc = (url, width) => {
  if (!R2_OPTIMIZED || !url || !R2_BASE || !url.startsWith(`${R2_BASE}/`)) return url;
  const key = decodeURI(url.slice(R2_BASE.length + 1)).replace(/\.(png|jpe?g|webp|gif)$/i, '');
  const w = R2_WIDTHS.find((size) => size >= width) || R2_WIDTHS[R2_WIDTHS.length - 1];
  return `${R2_BASE}/${encodeURI(`optimized/w${w}/${key}.webp`)}`;
};

// Site-wide images served from R2 (uploaded with `npm run r2:upload -- --site`).
export const SITE_IMAGES = {
  logoWhite: getAssetUrl('/site/vi-logo-white.png'),
  logoBlack: getAssetUrl('/site/vi-logo-black.png'),
  heroLeft: getAssetUrl('/site/hero.png'),
  heroRight: getAssetUrl('/site/ironali-2.png'),
};
