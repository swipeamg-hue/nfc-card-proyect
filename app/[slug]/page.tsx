import { Metadata } from 'next';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import { ProfileViewer } from '@/components/nfc/profile-viewer';
import { getBusinessBySlug } from '@/lib/supabase';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(mockBusinessesDatabase).map((slug) => ({
    slug,
  }));
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
      title: 'Perfil Digital NFC | TapCard',
    };
  }

  const logo = business.logoUrl || '/images/nexo-logo.jpg';

  return {
    title: `${business.name} | Tarjeta de Contacto Digital NFC`,
    description: business.bio || `${business.name} - ${business.category}`,
    manifest: `/api/manifest/${cleanSlug}`,
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
