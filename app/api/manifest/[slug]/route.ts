import { NextRequest, NextResponse } from 'next/server';
import { getBusinessBySlug } from '@/lib/supabase';
import { mockBusinessesDatabase } from '@/lib/mock-data';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return Object.keys(mockBusinessesDatabase).map((slug) => ({
    slug,
  }));
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

  const name = business?.name || 'Tarjeta NFC Digital';
  const shortName = business?.name ? (business.name.length > 14 ? business.name.slice(0, 14) : business.name) : 'TapCard';
  const description = business?.bio || `Tarjeta de contacto e interactiva oficial de ${name}`;
  const iconUrl = business?.logoUrl || '/images/nexo-logo.jpg';
  const themeColor = business?.customization?.primaryColor || business?.customization?.buttonBgColor || '#2563eb';
  const bgColor = business?.customization?.backgroundColor || '#090d16';

  let iconType = 'image/png';
  if (iconUrl.includes('.svg')) {
    iconType = 'image/svg+xml';
  } else if (iconUrl.includes('.jpg') || iconUrl.includes('.jpeg')) {
    iconType = 'image/jpeg';
  } else if (iconUrl.includes('.webp')) {
    iconType = 'image/webp';
  }

  const manifest = {
    id: `/${cleanSlug}`,
    name: name,
    short_name: shortName,
    description: description,
    start_url: `/${cleanSlug}?src=pwa_installed`,
    scope: '/',
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
