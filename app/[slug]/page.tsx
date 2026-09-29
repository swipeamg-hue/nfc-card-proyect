import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import { PublicProfile } from '@/components/nfc/public-profile';

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
  const business = mockBusinessesDatabase[slug.toLowerCase()];

  if (!business) {
    return {
      title: 'Perfil no encontrado | TapCard NFC',
    };
  }

  return {
    title: `${business.name} | Tarjeta de Contacto Digital NFC`,
    description: business.bio || `${business.name} - ${business.category}`,
    openGraph: {
      title: `${business.name} - Perfil Digital Oficial`,
      description: business.bio,
      images: business.bannerUrl ? [business.bannerUrl] : [],
    },
  };
}

export default async function BusinessProfilePage({
  params,
}: PageProps) {
  const { slug } = await params;

  const business = mockBusinessesDatabase[slug.toLowerCase()];

  if (!business) {
    notFound();
  }

  return (
    <PublicProfile
      business={business}
    />
  );
}
