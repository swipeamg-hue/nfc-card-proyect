export type LinkType =
  | 'whatsapp'
  | 'phone'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'x'
  | 'telegram'
  | 'website'
  | 'catalog'
  | 'email'
  | 'maps'
  | 'menu'
  | 'booking'
  | 'reviews'
  | 'custom';

export interface BusinessLink {
  id: string;
  businessId: string;
  type: LinkType;
  title: string;
  subtitle?: string;
  url: string;
  iconName: string;
  order: number;
  isActive: boolean;
  highlighted?: boolean;
  customColor?: string;
}

export interface NfcCard {
  id: string;
  cardCode: string; // e.g. "NX-8821"
  businessId: string;
  status: 'ACTIVE' | 'PAUSED' | 'UNASSIGNED';
  totalTaps: number;
  lastTapAt?: string;
  createdAt: string;
}

export interface TapMetric {
  id: string;
  businessId: string;
  source: 'NFC' | 'QR' | 'DIRECT';
  deviceType?: 'MOBILE' | 'DESKTOP' | 'TABLET';
  clickedItem?: string; // 'whatsapp', 'vcard', 'phone', etc.
  createdAt: string;
}

export interface QuickAccessConfig {
  enabled: boolean;
  showPhone?: boolean;
  showEmail?: boolean;
  showMaps?: boolean;
  showCatalog?: boolean;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  isVerified: boolean;
  category: string;
  bio: string;
  bannerUrl: string;
  logoUrl: string;
  themeColor: string; // e.g. "#0f172a"
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  catalogUrl?: string;
  catalogTitle?: string;
  websiteUrl: string;
  quickAccess?: QuickAccessConfig;
  cards?: NfcCard[];
  links: BusinessLink[];
  plan?: 'STARTER' | 'PRO' | 'ENTERPRISE';
  accountStatus?: 'ACTIVE' | 'TRIAL' | 'PAUSED';
  createdAt?: string;
  updatedAt?: string;
}
