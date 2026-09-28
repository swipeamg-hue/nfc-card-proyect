import { Business } from '@/types/business';

/**
 * Generates an RFC 2426 compliant vCard 3.0 string from a Business profile.
 * Compatible with iOS Contacts and Android Google Contacts.
 */
export function generateVCardString(business: Business): string {
  // Sanitize values to prevent multiline injection
  const sanitize = (str?: string) => (str ? str.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;') : '');

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:;${business.name};;;`,
    `FN:${business.name}`,
    `ORG:${business.name}`,
  ];

  if (business.category) {
    lines.push(`TITLE:${business.category}`);
    lines.push(`ROLE:${business.category}`);
  }

  if (business.phone) {
    // Standard phone
    const cleanPhone = business.phone.replace(/\s+/g, '');
    lines.push(`TEL;TYPE=WORK,VOICE:${cleanPhone}`);
    lines.push(`TEL;TYPE=CELL:${cleanPhone}`);
  }

  if (business.whatsapp && business.whatsapp !== business.phone) {
    const cleanWa = business.whatsapp.replace(/\s+/g, '');
    lines.push(`TEL;TYPE=CELL,pref:${cleanWa}`);
  }

  if (business.email) {
    lines.push(`EMAIL;TYPE=WORK,INTERNET:${business.email}`);
  }

  if (business.websiteUrl) {
    lines.push(`URL;TYPE=WORK:${business.websiteUrl}`);
  }

  if (business.googleMapsUrl) {
    lines.push(`URL;TYPE=LOCATION:${business.googleMapsUrl}`);
  }

  if (business.address) {
    // ADR format: ;;street;city;region;postal code;country
    lines.push(`ADR;TYPE=WORK:;;${sanitize(business.address)};;;;`);
    lines.push(`LABEL;TYPE=WORK:${sanitize(business.address)}`);
  }

  if (business.bio) {
    lines.push(`NOTE:${sanitize(business.bio)}`);
  }

  lines.push('REV:' + new Date().toISOString());
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Triggers instant browser download of the vCard as a .vcf file
 */
export function downloadVCard(business: Business): void {
  const vcardText = generateVCardString(business);
  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${business.slug || 'contacto'}.vcf`;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
