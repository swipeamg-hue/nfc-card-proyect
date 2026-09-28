import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import { PublicProfile } from '@/components/nfc/public-profile';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ src?: string; code?: string }>;
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
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const business = mockBusinessesDatabase[slug.toLowerCase()];

  if (!business) {
    notFound();
  }

  const source =
    search.src === 'nfc' ? 'NFC' : search.src === 'qr' ? 'QR' : 'DIRECT';
  const cardCode = search.code;

  return (
    <PublicProfile
      business={business}
      source={source}
      cardCode={cardCode}
    />
  );
}
