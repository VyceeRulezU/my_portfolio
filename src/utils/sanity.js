import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';



export const client = createClient({
  projectId: '9hecsvz8',
  dataset: 'production',
  useCdn: false, // set to false for real-time updates
  apiVersion: '2024-05-09', // use current date
});



const builder = createImageUrlBuilder(client);


export function urlFor(source) {
  return builder.image(source);
}

export async function deleteProject(projectId) {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    const response = await client.delete(projectId);
    return response;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
}
