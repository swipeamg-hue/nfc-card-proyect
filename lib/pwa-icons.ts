/**
 * PWA Icon Optimization Utilities
 * Ensures avatar and logo images meet Chrome & iOS PWA installation criteria (minimum 192x192 / 512x512).
 */
import { resolveAssetUrl } from './base-path';

export function getOptimizedAppIconUrl(url?: string | null): string {
  if (!url) {
    return resolveAssetUrl('/images/nexo-logo.jpg');
  }

  // 1. Google Account profile avatars: upgrade thumbnail (e.g. s96) to high-res 512px
  if (url.includes('googleusercontent.com')) {
    if (/=s\d+(-c)?/.test(url)) {
      return url.replace(/=s\d+(-c)?/g, '=s512-c');
    }
    return `${url}=s512-c`;
  }

  // 2. Unsplash stock photos: request high-resolution square (512x512)
  if (url.includes('unsplash.com')) {
    if (url.includes('w=')) {
      return url.replace(/w=\d+/g, 'w=512').replace(/h=\d+/g, 'h=512');
    }
    return `${url}&w=512&h=512&auto=format&fit=crop`;
  }

  // 3. Relative local paths: ensure basePath is prepended
  return resolveAssetUrl(url);
}

export function getAppIconMimeType(url: string): string {
  if (!url) return 'image/jpeg';
  if (url.includes('googleusercontent.com')) {
    return 'image/jpeg';
  }
  if (url.includes('.svg')) {
    return 'image/svg+xml';
  }
  if (url.includes('.jpg') || url.includes('.jpeg')) {
    return 'image/jpeg';
  }
  if (url.includes('.webp')) {
    return 'image/webp';
  }
  return 'image/png';
}
