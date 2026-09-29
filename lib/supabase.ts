import { createClient } from '@supabase/supabase-js';
import { Business, BusinessLink, NfcCard, QuickAccessConfig } from '@/types/business';
import { mockBusinessesDatabase } from './mock-data';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjiesshwfzvyuhjzwoxb.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_c1_shinlEQTWVH1rIj4_6Q__9P__nFQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper mappers between Supabase snake_case and TypeScript camelCase
export function mapDbToBusiness(row: any, links: BusinessLink[] = [], cards: NfcCard[] = []): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    isVerified: row.is_verified ?? true,
    category: row.category || '',
    bio: row.bio || '',
    bannerUrl: row.banner_url || '',
    logoUrl: row.logo_url || '',
    themeColor: row.theme_color || '#0284c7',
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    email: row.email || '',
    address: row.address || '',
    googleMapsUrl: row.google_maps_url || '',
    catalogUrl: row.catalog_url || '',
    catalogTitle: row.catalog_title || '',
    websiteUrl: row.website_url || '',
    quickAccess: row.quick_access || {
      enabled: true,
      showPhone: true,
      showEmail: true,
      showMaps: true,
      showCatalog: false,
    },
    plan: row.plan || 'PRO',
    accountStatus: row.account_status || 'ACTIVE',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    links: links.sort((a, b) => a.order - b.order),
    cards: cards,
  };
}

export function mapDbToLink(row: any): BusinessLink {
  return {
    id: row.id,
    businessId: row.business_id,
    type: row.type,
    title: row.title,
    subtitle: row.subtitle || undefined,
    url: row.url,
    iconName: row.icon_name,
    order: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
    highlighted: row.highlighted ?? false,
    customColor: row.custom_color || undefined,
  };
}

export function mapDbToCard(row: any): NfcCard {
  return {
    id: row.id,
    cardCode: row.card_code,
    businessId: row.business_id,
    status: row.status,
    totalTaps: row.total_taps || 0,
    lastTapAt: row.last_tap_at || undefined,
    createdAt: row.created_at,
  };
}

/**
 * Fetch a business by its unique slug from Supabase, including links and cards
 */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const { data: bRow, error: bErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', cleanSlug)
      .maybeSingle();

    if (bErr) {
      console.warn('[Supabase] Error fetching business by slug:', bErr.message);
      return mockBusinessesDatabase[cleanSlug] || null;
    }

    if (!bRow) {
      return mockBusinessesDatabase[cleanSlug] || null;
    }

    // Fetch links
    const { data: lRows } = await supabase
      .from('business_links')
      .select('*')
      .eq('business_id', bRow.id)
      .order('sort_order', { ascending: true });

    // Fetch cards
    const { data: cRows } = await supabase
      .from('nfc_cards')
      .select('*')
      .eq('business_id', bRow.id);

    const links = (lRows || []).map(mapDbToLink);
    const cards = (cRows || []).map(mapDbToCard);

    return mapDbToBusiness(bRow, links, cards);
  } catch (err) {
    console.error('[Supabase] Unexpected error in getBusinessBySlug:', err);
    return mockBusinessesDatabase[slug.toLowerCase()] || null;
  }
}

/**
 * Fetch business and card by physical NFC card code (e.g. NX-8821)
 */
export async function getBusinessByCardCode(cardCode: string): Promise<{ business: Business; card: NfcCard } | null> {
  try {
    const cleanCode = cardCode.toUpperCase().trim();
    const { data: cardRow, error: cErr } = await supabase
      .from('nfc_cards')
      .select('*')
      .eq('card_code', cleanCode)
      .maybeSingle();

    if (cErr || !cardRow) {
      console.warn('[Supabase] Card code not found in DB:', cleanCode);
      return null;
    }

    const { data: bRow, error: bErr } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', cardRow.business_id)
      .maybeSingle();

    if (bErr || !bRow) {
      return null;
    }

    const { data: lRows } = await supabase
      .from('business_links')
      .select('*')
      .eq('business_id', bRow.id)
      .order('sort_order', { ascending: true });

    const links = (lRows || []).map(mapDbToLink);
    const card = mapDbToCard(cardRow);
    const business = mapDbToBusiness(bRow, links, [card]);

    return { business, card };
  } catch (err) {
    console.error('[Supabase] Unexpected error in getBusinessByCardCode:', err);
    return null;
  }
}

/**
 * Fetch all businesses (for Super Admin or multi-tenant listing)
 */
export async function getAllBusinesses(): Promise<Business[]> {
  try {
    const { data: bRows, error: bErr } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });

    if (bErr || !bRows || bRows.length === 0) {
      return Object.values(mockBusinessesDatabase);
    }

    const { data: lRows } = await supabase.from('business_links').select('*');
    const { data: cRows } = await supabase.from('nfc_cards').select('*');

    const linksByBiz: Record<string, BusinessLink[]> = {};
    (lRows || []).forEach((r) => {
      const l = mapDbToLink(r);
      if (!linksByBiz[l.businessId]) linksByBiz[l.businessId] = [];
      linksByBiz[l.businessId].push(l);
    });

    const cardsByBiz: Record<string, NfcCard[]> = {};
    (cRows || []).forEach((r) => {
      const c = mapDbToCard(r);
      if (!cardsByBiz[c.businessId]) cardsByBiz[c.businessId] = [];
      cardsByBiz[c.businessId].push(c);
    });

    return bRows.map((b) =>
      mapDbToBusiness(b, linksByBiz[b.id] || [], cardsByBiz[b.id] || [])
    );
  } catch (err) {
    console.error('[Supabase] Error getAllBusinesses:', err);
    return Object.values(mockBusinessesDatabase);
  }
}

/**
 * Save / Update a Business profile and its links to Supabase
 */
export async function saveBusinessToSupabase(business: Business): Promise<{ success: boolean; error?: string }> {
  try {
    const { error: bErr } = await supabase
      .from('businesses')
      .upsert({
        id: business.id,
        slug: business.slug,
        name: business.name,
        is_verified: business.isVerified,
        category: business.category,
        bio: business.bio,
        banner_url: business.bannerUrl,
        logo_url: business.logoUrl,
        theme_color: business.themeColor,
        phone: business.phone,
        whatsapp: business.whatsapp,
        email: business.email,
        address: business.address,
        google_maps_url: business.googleMapsUrl,
        catalog_url: business.catalogUrl || '',
        catalog_title: business.catalogTitle || '',
        website_url: business.websiteUrl || '',
        quick_access: business.quickAccess,
        plan: business.plan || 'PRO',
        account_status: business.accountStatus || 'ACTIVE',
        updated_at: new Date().toISOString(),
      });

    if (bErr) {
      console.error('[Supabase] Error upserting business:', bErr.message);
      return { success: false, error: bErr.message };
    }

    // Sync links: delete existing and reinsert current list
    if (business.links && business.links.length >= 0) {
      await supabase.from('business_links').delete().eq('business_id', business.id);

      if (business.links.length > 0) {
        const linkRows = business.links.map((link, idx) => ({
          id: link.id || `link-${Date.now()}-${idx}`,
          business_id: business.id,
          type: link.type,
          title: link.title,
          subtitle: link.subtitle || '',
          url: link.url,
          icon_name: link.iconName || link.type,
          sort_order: link.order ?? idx,
          is_active: link.isActive ?? true,
          highlighted: link.highlighted ?? false,
          custom_color: link.customColor || null,
        }));

        const { error: lErr } = await supabase.from('business_links').insert(linkRows);
        if (lErr) {
          console.warn('[Supabase] Error saving links:', lErr.message);
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('[Supabase] Unexpected error in saveBusinessToSupabase:', err);
    return { success: false, error: err.message || 'Error desconocido al guardar en Supabase' };
  }
}

/**
 * Record tap or click metric in real-time
 */
export async function trackTapEvent(params: {
  businessId: string;
  cardCode?: string;
  source?: 'NFC' | 'QR' | 'DIRECT';
  deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
  clickedItem?: string;
}) {
  try {
    await supabase.from('tap_metrics').insert({
      business_id: params.businessId,
      card_code: params.cardCode || null,
      source: params.source || 'DIRECT',
      device_type: params.deviceType || (typeof window !== 'undefined' && window.innerWidth < 768 ? 'MOBILE' : 'DESKTOP'),
      clicked_item: params.clickedItem || null,
    });

    // If tap was via a physical NFC card, increment total taps count on the card
    if (params.cardCode) {
      const { data: card } = await supabase
        .from('nfc_cards')
        .select('total_taps')
        .eq('card_code', params.cardCode)
        .maybeSingle();

      if (card) {
        await supabase
          .from('nfc_cards')
          .update({
            total_taps: (card.total_taps || 0) + 1,
            last_tap_at: new Date().toISOString(),
          })
          .eq('card_code', params.cardCode);
      }
    }
  } catch (e) {
    console.warn('[Supabase] Track tap ignored:', e);
  }
}

/**
 * Upload an image (Logo or Banner) directly to Supabase Storage
 */
export async function uploadBusinessAsset(file: File, businessSlug: string, type: 'logo' | 'banner'): Promise<{ url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${businessSlug}/${type}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('business-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      return { error: error.message };
    }

    const { data: pubUrl } = supabase.storage
      .from('business-assets')
      .getPublicUrl(data.path);

    return { url: pubUrl.publicUrl };
  } catch (err: any) {
    return { error: err.message || 'Error al subir imagen a Supabase Storage' };
  }
}
