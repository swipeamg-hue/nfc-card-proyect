import { mockBusinessesDatabase } from '@/lib/mock-data';
import { generateVCardString } from '@/lib/vcard';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return Object.keys(mockBusinessesDatabase).map((slug) => ({
    slug,
  }));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const business = mockBusinessesDatabase[slug.toLowerCase()];

  if (!business) {
    return new Response('Perfil de negocio no encontrado', { status: 404 });
  }

  const vcard = generateVCardString(business);

  return new Response(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${business.slug}.vcf"`,
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
