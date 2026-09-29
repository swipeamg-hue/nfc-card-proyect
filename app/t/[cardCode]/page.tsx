import { mockCardsDatabase } from '@/lib/mock-data';
import { NfcRedirectClient } from './nfc-redirect-client';

interface PageProps {
  params: Promise<{ cardCode: string }>;
}

export async function generateStaticParams() {
  return Object.keys(mockCardsDatabase).map((cardCode) => ({
    cardCode,
  }));
}

export default async function NfcRedirectPage({
  params,
}: PageProps) {
  const { cardCode } = await params;
  const cleanCode = (cardCode || '').toUpperCase().trim();
  const targetSlug = mockCardsDatabase[cleanCode] || null;

  return <NfcRedirectClient cardCode={cleanCode} targetSlug={targetSlug} />;
}
