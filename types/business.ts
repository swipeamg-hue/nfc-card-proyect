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
  | 'threads'
  | 'onlyfans'
  | 'twitch'
  | 'snapchat'
  | 'wechat'
  | 'custom';

export type ButtonShape = 'rounded' | 'pill' | 'square' | 'tile' | 'circle' | 'none';
export type IconColorMode = 'official' | 'monochrome' | 'custom';
export type BackgroundStyle = 'full' | 'top-fade' | 'banner';
export type BackgroundOverlay = 'dark' | 'light' | 'soft-gradient' | 'none';

export interface CardCustomization {
  // Fondo de la tarjeta (Foto de Fondo)
  backgroundMode?: BackgroundStyle; // 'full', 'top-fade', 'banner'
  backgroundOverlay?: BackgroundOverlay; // 'dark', 'light', 'soft-gradient', 'none'
  backgroundOpacity?: number; // 0 a 100
  backgroundColor?: string; // Color personalizado de fondo / gradiente difuminado (para modo banner y top-fade)
  gradientColor?: string; // Color complementario para gradiente difuminado

  // Estilo global de botones de enlace
  buttonShape?: ButtonShape;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
  glassmorphism?: number; // 0 a 100: nivel de efecto vidrio traslúcido y desenfoque de los contenedores

  // Iconos SVG
  iconColorMode?: IconColorMode; // 'official' (colores de marca oficiales) o 'monochrome' / 'custom'
  iconCustomColor?: string; // Color personalizado del icono (ej. dorado, verde neón, terracota)
  iconBgColor?: string; // Color del recuadro del icono

  // Tipografía
  fontFamily?: string; // Ej: 'Inter', 'Playfair Display', 'Great Vibes', 'Montserrat', 'Outfit'
  fontCategory?: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace' | 'custom';
  customFontUrl?: string; // Data URL o URL externa de fuente personalizada (.woff2, .ttf)
  customFontName?: string;

  // Colores de textos e información del perfil
  textColor?: string; // Color del texto principal
  nameColor?: string; // Color personalizado del nombre del negocio
  subtitleColor?: string; // Color del giro comercial / subtítulo
  categoryColor?: string; // Color del giro comercial / subtítulo
  bioColor?: string; // Color de la biografía / descripción
}

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
  shape?: ButtonShape;
  buttonBgColor?: string;
  buttonTextColor?: string;
  iconColor?: string;
  iconColorMode?: IconColorMode;
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
  backgroundUrl?: string;
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
  customization?: CardCustomization;
  plan?: 'STARTER' | 'PRO' | 'ENTERPRISE';
  accountStatus?: 'ACTIVE' | 'TRIAL' | 'PAUSED';
  createdAt?: string;
  updatedAt?: string;
}
