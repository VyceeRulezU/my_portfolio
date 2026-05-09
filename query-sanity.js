import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-09',
});

client.fetch('*[_type == "project"]{title, "slug": slug.current}')
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
