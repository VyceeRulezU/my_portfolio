/**
 * Helper to get the correct asset URL.
 * If VITE_CLOUDFLARE_URL is defined in .env, it prefixes the path.
 * Otherwise, it returns the path as is (falling back to local /public or /assets).
 */
export const getAssetUrl = (path) => {
  const cloudflareUrl = import.meta.env.VITE_CLOUDFLARE_URL;
  
  if (!path) return '';
  
  // If we already have a full URL (http/https), return it as is
  if (path.startsWith('http')) return path;
  
  // Prefix with Cloudflare URL if available
  if (cloudflareUrl) {
    // Ensure cloudflareUrl doesn't have a trailing slash if path has a leading one
    const baseUrl = cloudflareUrl.endsWith('/') ? cloudflareUrl.slice(0, -1) : cloudflareUrl;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${cleanPath}`;
  }
  
  return path;
};
