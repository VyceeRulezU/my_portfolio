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

export async function removeGalleryImages(projectId, galleryField, imagesToRemove) {
  try {
    if (!projectId || !galleryField || !imagesToRemove || imagesToRemove.length === 0) {
      throw new Error('Project ID, gallery field, and images array are required');
    }

    // Fetch the current project to get the full gallery array
    const project = await client.fetch(`*[_id == $id][0]`, { id: projectId });
    if (!project) {
      throw new Error('Project not found');
    }

    // Get the current gallery array
    const currentGallery = project[galleryField] || [];
    
    // Filter out the images to remove by comparing asset IDs
    const updatedGallery = currentGallery.filter(img => {
      if (!img?.asset?._ref) return true;
      return !imagesToRemove.includes(img.asset._ref);
    });

    // Update the project with the new gallery array
    const response = await client
      .patch(projectId)
      .set({ [galleryField]: updatedGallery })
      .commit();

    return response;
  } catch (error) {
    console.error('Error removing gallery images:', error);
    throw error;
  }
}
