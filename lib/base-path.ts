/**
 * Helper to determine the basePath for assets, service workers, and manifests.
 * Handles GitHub Pages deployment (/nfc-card-proyect) and local/custom domain root deployments.
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/nfc-card-proyect')) {
      return '/nfc-card-proyect';
    }
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

/**
 * Resolves a local or relative asset URL with the correct basePath if needed.
 */
export function resolveAssetUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const basePath = getBasePath();
  if (url.startsWith(basePath) && basePath !== '') {
    return url;
  }
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${basePath}${cleanUrl}`;
}
