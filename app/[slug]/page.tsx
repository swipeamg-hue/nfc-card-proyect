import { Metadata } from 'next';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import { ProfileViewer } from '@/components/nfc/profile-viewer';
import { supabase, getBusinessBySlug } from '@/lib/supabase';
import { getOptimizedAppIconUrl } from '@/lib/pwa-icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

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
    console.warn('[Page generateStaticParams] Error fetching supabase slugs:', err);
  }
  return mockSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();
  let business = null;
  try {
    business = await getBusinessBySlug(cleanSlug);
  } catch (err) {
    console.warn('[Page Metadata] error fetching business:', err);
  }

  if (!business) {
    business = mockBusinessesDatabase[cleanSlug] || null;
  }
  if (!business) {
    return {
      title: 'Tarjeta Digital NFC',
    };
  }

  const logo = getOptimizedAppIconUrl(business.logoUrl);

  // App Name must strictly be the Client's business or personal profile name
  return {
    title: business.name,
    description: business.bio || `${business.name} - ${business.category}`,
    manifest: `${basePath}/api/manifest/${cleanSlug}/manifest.json`,
    appleWebApp: {
      capable: true,
      title: business.name,
      statusBarStyle: 'black-translucent',
    },
    icons: {
      icon: logo,
      apple: logo,
    },
    openGraph: {
      title: `${business.name} - Perfil Digital Oficial`,
      description: business.bio,
      images: business.bannerUrl ? [business.bannerUrl] : (logo ? [logo] : []),
    },
  };
}

export default async function BusinessProfilePage({
  params,
}: PageProps) {
  const { slug } = await params;
  const initialBusiness = mockBusinessesDatabase[slug.toLowerCase()] || null;

  return (
    <ProfileViewer
      slug={slug}
      initialBusiness={initialBusiness}
    />
  );
}
