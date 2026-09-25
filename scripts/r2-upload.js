// Upload files to the Cloudflare R2 bucket, with resized WebP copies for images.
//
//   npm run r2:upload -- <local-file> <r2-key> [<local-file> <r2-key> ...]
//   npm run r2:upload -- --site       # upload the site images listed in SITE_UPLOADS
//   npm run r2:upload -- --optimize   # create missing resized copies for every image already in the bucket
//
// Every image also gets optimized/w<width>/<key>.webp for each width in R2_WIDTHS; the site loads those
// when VITE_R2_OPTIMIZED=true (see optimizedSrc in src/utils/assetHelper.js).
//
// Needs R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET in .env.local or .env
// (Cloudflare dashboard -> R2 -> Manage R2 API Tokens, "Object Read & Write" on the site's bucket).
import { readFile } from 'node:fs/promises';
import { extname } from 'node:path';
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand, paginateListObjectsV2 } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import dotenv from 'dotenv';

dotenv.config({ path: ['.env.local', '.env'], quiet: true });

const R2_WIDTHS = [800, 1920]; // keep in sync with src/utils/assetHelper.js
const OPTIMIZE_PREFIXES = ['portfolio/', 'site/'];

const SITE_UPLOADS = [
  ['src/assets/VI_Logo_White.png', 'site/vi-logo-white.png'],
  ['src/assets/VI_Black_Logo.png', 'site/vi-logo-black.png'],
  ['src/assets/hero.png', 'site/hero.png'],
  ['src/assets/ironali-2.png', 'site/ironali-2.png'],
  ['src/assets/whhf mock.png', 'portfolio/whhf/whhf-mock.png'],
];

const CONTENT_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};
const RESIZABLE = /\.(png|jpe?g|webp)$/i;

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, VITE_CLOUDFLARE_URL } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET })
  .filter(([, v]) => !v)
  .map(([k]) => k);
if (missing.length) {
  console.error(`Missing in .env.local/.env: ${missing.join(', ')}`);
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});
const publicBase = (VITE_CLOUDFLARE_URL || '').replace(/\/$/, '');
const publicUrl = (key) => (publicBase ? `${publicBase}/${encodeURI(key)}` : key);

const put = (Key, Body, ContentType) => s3.send(new PutObjectCommand({
  Bucket: R2_BUCKET,
  Key,
  Body,
  ContentType,
  CacheControl: 'public, max-age=604800',
}));

const variantKey = (key, width) => `optimized/w${width}/${key.replace(/\.[^.]+$/, '')}.webp`;

async function exists(Key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadVariants(key, buffer, { skipExisting = false } = {}) {
  for (const width of R2_WIDTHS) {
    const vKey = variantKey(key, width);
    if (skipExisting && await exists(vKey)) continue;
    const webp = await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
    await put(vKey, webp, 'image/webp');
    console.log(`  + ${vKey} (${Math.round(webp.length / 1024)} KB)`);
  }
}

async function uploadFiles(uploads) {
  let failed = 0;
  for (const [file, key] of uploads) {
    try {
      const body = await readFile(file);
      await put(key, body, CONTENT_TYPES[extname(file).toLowerCase()] || 'application/octet-stream');
      console.log(`uploaded ${file} -> ${publicUrl(key)}`);
      if (RESIZABLE.test(key)) await uploadVariants(key, body);
    } catch (err) {
      failed += 1;
      console.error(`failed ${file}: ${err.message}`);
    }
  }
  return failed;
}

async function optimizeBucket() {
  let failed = 0;
  for (const Prefix of OPTIMIZE_PREFIXES) {
    for await (const page of paginateListObjectsV2({ client: s3 }, { Bucket: R2_BUCKET, Prefix })) {
      for (const { Key } of page.Contents || []) {
        if (!RESIZABLE.test(Key)) continue;
        const done = await Promise.all(R2_WIDTHS.map((w) => exists(variantKey(Key, w))));
        if (done.every(Boolean)) continue;
        try {
          console.log(Key);
          const obj = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key }));
          await uploadVariants(Key, Buffer.from(await obj.Body.transformToByteArray()), { skipExisting: true });
        } catch (err) {
          failed += 1;
          console.error(`failed ${Key}: ${err.message}`);
        }
      }
    }
  }
  return failed;
}

const args = process.argv.slice(2);
let failed;
if (args[0] === '--optimize') {
  failed = await optimizeBucket();
} else if (args[0] === '--site') {
  failed = await uploadFiles(SITE_UPLOADS);
} else if (args.length && args.length % 2 === 0) {
  const uploads = [];
  for (let i = 0; i < args.length; i += 2) uploads.push([args[i], args[i + 1]]);
  failed = await uploadFiles(uploads);
} else {
  console.error('Usage: npm run r2:upload -- <local-file> <r2-key> [...]  |  --site  |  --optimize');
  process.exit(1);
}
process.exit(failed ? 1 : 0);
