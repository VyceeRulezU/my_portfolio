import { createClient } from '@sanity/client';
import { ALL_PROJECTS } from './src/data/projectsData.js';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
  apiVersion: '2024-05-09',
});

const CLOUDFLARE_URL = process.env.VITE_CLOUDFLARE_URL || '';

async function uploadImage(url) {
  if (!url) return null;
  
  // Construct full URL if it's a relative path
  const fullUrl = url.startsWith('http') 
    ? url 
    : `${CLOUDFLARE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;

  console.log(`  Uploading image: ${fullUrl}`);
  
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${fullUrl}: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const asset = await client.assets.upload('image', buffer, {
      filename: url.split('/').pop(),
    });

    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(`  ❌ Failed to upload image ${url}:`, err.message);
    return null;
  }
}

async function migrate() {
  console.log('Starting migration with images...');

  for (const project of ALL_PROJECTS) {
    console.log(`Migrating ${project.title}...`);

    const mainImage = await uploadImage(project.img);
    const processImages = [];
    
    if (project.processImages && project.processImages.length > 0) {
      for (const [idx, imgUrl] of project.processImages.entries()) {
        const uploaded = await uploadImage(imgUrl);
        if (uploaded) {
          processImages.push({
            ...uploaded,
            _key: `img_${idx}_${Math.random().toString(36).substring(2, 9)}`
          });
        }
      }
    }


    const doc = {
      _type: 'project',
      _id: project.id,
      title: project.title,
      slug: { _type: 'slug', current: project.id },
      num: project.num,
      type: project.type,
      role: project.role,
      year: project.year,
      desc: project.desc,
      headline: project.headline,
      problem: project.problem,
      solution: project.solution,
      overview: project.overview,
      impact: project.impact,
      img: mainImage || undefined,
      processImages: processImages.length > 0 ? processImages : undefined,
      url: project.url === '#' ? undefined : project.url,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✅ ${project.title} migrated.`);
    } catch (err) {
      console.error(`❌ Failed to migrate ${project.title}:`, err.message);
    }
  }

  console.log('Migration complete!');
}

migrate();
