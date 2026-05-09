import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: '9hecsvz8',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-09',
  token: process.env.SANITY_WRITE_TOKEN,
});

async function migrateStringsToBlocks() {
  const projects = await client.fetch('*[_type == "project"]');
  
  for (const project of projects) {
    const patch = {};
    let needsPatch = false;

    ['problem', 'solution', 'overview', 'impact'].forEach(field => {
      const val = project[field];
      const isLegacyString = typeof val === 'string';
      const isMissingKeys = Array.isArray(val) && val.length > 0 && !val[0]._key;

      if (isLegacyString || isMissingKeys) {
        const textValue = isLegacyString ? val : (val[0].children?.[0]?.text || '');
        patch[field] = [
          {
            _type: 'block',
            _key: Math.random().toString(36).substring(2, 9),
            children: [
              {
                _type: 'span',
                _key: Math.random().toString(36).substring(2, 9),
                text: textValue
              }
            ],
            markDefs: [],
            style: 'normal'
          }
        ];
        needsPatch = true;
      }
    });

    if (needsPatch) {
      console.log(`Migrating ${project.title}...`);
      await client.patch(project._id).set(patch).commit();
    }
  }
  console.log('Done!');
}

migrateStringsToBlocks().catch(console.error);
