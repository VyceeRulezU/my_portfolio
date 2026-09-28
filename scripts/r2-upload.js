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
import { paginateListObjectsV2 } from '@aws-sdk/client-s3';
import {
  s3, BUCKET, R2_WIDTHS, CONTENT_TYPES, RESIZABLE, put, getObject, exists, variantKey, uploadVariants, publicUrl,
} from './lib/r2.js';

const OPTIMIZE_PREFIXES = ['portfolio/', 'site/'];

const SITE_UPLOADS = [
  ['src/assets/VI_Logo_White.png', 'site/vi-logo-white.png'],
  ['src/assets/VI_Black_Logo.png', 'site/vi-logo-black.png'],
  ['src/assets/hero.png', 'site/hero.png'],
  ['src/assets/ironali-2.png', 'site/ironali-2.png'],
];

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
    for await (const page of paginateListObjectsV2({ client: s3 }, { Bucket: BUCKET, Prefix })) {
      for (const { Key } of page.Contents || []) {
        if (!RESIZABLE.test(Key)) continue;
        const done = await Promise.all(R2_WIDTHS.map((w) => exists(variantKey(Key, w))));
        if (done.every(Boolean)) continue;
        try {
          console.log(Key);
          await uploadVariants(Key, await getObject(Key), { skipExisting: true });
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
