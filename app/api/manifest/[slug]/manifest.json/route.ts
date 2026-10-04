import { NextRequest, NextResponse } from 'next/server';
import { supabase, getBusinessBySlug } from '@/lib/supabase';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import { getOptimizedAppIconUrl, getAppIconMimeType } from '@/lib/pwa-icons';

export const dynamic = 'force-static';

const isGithubPages = process.env.GITHUB_ACTIONS === 'true';
const basePath = isGithubPages ? '/nfc-card-proyect' : '';

export async function generateStaticParams() {
  const mockSlugs = Object.keys(mockBusinessesDatabase);
  try {
    const { data, error } = await supabase.from('businesses').select('slug');
    if (!error && data && data.length > 0) {
      const allSlugs = new Set([...mockSlugs, ...data.map((b) => b.slug.toLowerCase().trim())]);
      return Array.from(allSlugs).map((slug) => ({ slug }));
    }
  } catch (err) {
    console.warn('[Manifest generateStaticParams] Error fetching supabase slugs:', err);
  }
  return mockSlugs.map((slug) => ({ slug }));
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const cleanSlug = (slug || '').toLowerCase().trim();

  let business = null;
  try {
    business = await getBusinessBySlug(cleanSlug);
  } catch (err) {
    console.warn('[Manifest API] Error fetching business from Supabase:', err);
  }

  if (!business) {
    business = mockBusinessesDatabase[cleanSlug] || null;
  }

  // App Name strictly matches the Client's business or personal profile title
  const name = business?.name || 'Tarjeta Digital';
  const shortName = business?.name ? (business.name.length > 20 ? business.name.slice(0, 20) : business.name) : 'Tarjeta NFC';
  const description = business?.bio || `Tarjeta de contacto digital interactiva de ${name}`;
  
  // High-resolution icon URL (guaranteed >= 192x192 / 512x512)
  const iconUrl = getOptimizedAppIconUrl(business?.logoUrl);
  const iconType = getAppIconMimeType(iconUrl);

  const themeColor = business?.customization?.primaryColor || business?.customization?.buttonBgColor || '#2563eb';
  const bgColor = business?.customization?.backgroundColor || '#090d16';

  // Viewer PWA: start_url and scope are strictly locked to this business card slug, never the admin panel
  const cardPath = `${basePath}/${cleanSlug}/`;

  const manifest = {
    id: cardPath,
    name: name,
    short_name: shortName,
    description: description,
    start_url: `${cardPath}?src=pwa_viewer`,
    scope: cardPath,
    display: 'standalone',
    display_override: ['standalone', 'window-controls-overlay', 'minimal-ui'],
    background_color: bgColor,
    theme_color: themeColor,
    orientation: 'portrait-primary',
    icons: [
      {
        src: iconUrl,
        sizes: '192x192',
        type: iconType,
        purpose: 'any',
      },
      {
        src: iconUrl,
        sizes: '512x512',
        type: iconType,
        purpose: 'any maskable',
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=120, stale-while-revalidate=600',
    },
  });
}
