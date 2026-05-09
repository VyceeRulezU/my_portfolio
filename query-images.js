import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: '9hecsvz8',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-09',
});

client.fetch('*[_type == "project"]{title, img, processImages}')
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(console.error);
