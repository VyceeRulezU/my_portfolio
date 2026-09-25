import { createHash, timingSafeEqual } from 'node:crypto';
import { createClient } from '@sanity/client';
import { SANITY_CONFIG } from '../src/utils/sanityConfig.js';
import { GATED_FIELDS } from '../src/utils/projectQueries.js';

// Vercel serverless function: checks a private project's password and returns its gated content.
const client = createClient({
  ...SANITY_CONFIG,
  useCdn: false,
  token: process.env.SANITY_READ_TOKEN,
});

const digest = (value) => createHash('sha256').update(String(value)).digest();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, password } = req.body ?? {};
  if (typeof slug !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'slug and password are required' });
  }

  const doc = await client.fetch(
    `*[_type == "project" && slug.current == $slug][0] { password, ${GATED_FIELDS} }`,
    { slug },
  );

  if (!doc?.password || !timingSafeEqual(digest(password), digest(doc.password))) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  const { password: _password, ...content } = doc;
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json(content);
}
