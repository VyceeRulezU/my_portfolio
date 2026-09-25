import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { SANITY_CONFIG } from './sanityConfig';

export const client = createClient({
  ...SANITY_CONFIG,
  useCdn: true,
});

const builder = createImageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}
