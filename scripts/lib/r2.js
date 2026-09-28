// Shared R2 helpers for the Node scripts (credentials from .env.local / .env).
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'], quiet: true });

export const R2_WIDTHS = [800, 1920]; // keep in sync with src/utils/assetHelper.js

export const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};
export const RESIZABLE = /\.(png|jpe?g|webp)$/i;

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, VITE_CLOUDFLARE_URL } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`Missing in .env.local/.env: ${missing.join(', ')}`);
  process.exit(1);
}

export const BUCKET = R2_BUCKET;
export const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

export const publicBase = (VITE_CLOUDFLARE_URL || '').replace(/\/$/, '');
export const publicUrl = (key) => (publicBase ? `${publicBase}/${encodeURI(key)}` : key);

export const put = (Key, Body, ContentType) => s3.send(new PutObjectCommand({
  Bucket: BUCKET,
  Key,
  Body,
  ContentType,
  CacheControl: 'public, max-age=604800',
}));

export const getObject = async (Key) => {
  const obj = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key }));
  return Buffer.from(await obj.Body.transformToByteArray());
};

export async function exists(Key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET, Key }));
    return true;
  } catch {
    return false;
  }
}

export const variantKey = (key, width) => `optimized/w${width}/${key.replace(/\.[^.]+$/, '')}.webp`;

// Upload the resized WebP copies (optimized/w<width>/<key>.webp) the site loads via optimizedSrc().
export async function uploadVariants(key, buffer, { skipExisting = false, log = true } = {}) {
  for (const width of R2_WIDTHS) {
    const vKey = variantKey(key, width);
    if (skipExisting && await exists(vKey)) continue;
    const webp = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    await put(vKey, webp, 'image/webp');
    if (log) console.log(`  + ${vKey} (${Math.round(webp.length / 1024)} KB)`);
  }
}
