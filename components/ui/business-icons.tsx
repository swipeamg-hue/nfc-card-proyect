'use client';

import React from 'react';
import {
  Pizza,
  Beer,
  Wine,
  Cake,
  ChefHat,
  Crown,
  Heart,
  Gem,
  Shirt,
  ShoppingCart,
  Tag,
  Store,
  Gift,
  Package,
  Briefcase,
  Scale,
  Calculator,
  Laptop,
  MessageCircle,
  Send,
  Activity,
  Dumbbell,
  Stethoscope,
  Trophy,
  Car,
  Wrench,
  Home,
  Key,
  Camera,
  Music,
  Building,
  Shield,
  Palette,
  Headphones,
  BookOpen,
} from 'lucide-react';

import {
  WhatsAppOfficialIcon,
  InstagramOfficialIcon,
  FacebookOfficialIcon,
  LinkedinOfficialIcon,
  TikTokOfficialIcon,
  XOfficialIcon,
  YouTubeOfficialIcon,
  TelegramOfficialIcon,
  ThreadsOfficialIcon,
  OnlyFansOfficialIcon,
  TwitchOfficialIcon,
  SnapchatOfficialIcon,
  WeChatOfficialIcon,
  UtensilsSvg,
  CalendarSvg,
  SparklesBeautySvg,
  ScissorsSvg,
  CoffeeSvg,
  ShoppingBagSvg,
  FileTextSvg,
  ClockSvg,
  CreditCardSvg,
  StarSvg,
  GlobeSvg,
  PhoneSvg,
  MapPinSvg,
  MailSvg,
  GoogleOfficialIcon,
  UberEatsOfficialIcon,
  DidiFoodOfficialIcon,
  RappiOfficialIcon,
  MercadoLibreOfficialIcon,
  AmazonOfficialIcon,
  ShopifyOfficialIcon,
} from './svg-icons';

export interface BusinessIconItem {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BUSINESS_ICON_CATEGORIES: { name: string; items: BusinessIconItem[] }[] = [
  {
    name: 'Restaurantes, Cafés & Gastronomía',
    items: [
      { id: 'utensils', name: 'Menú / Restaurante', category: 'Gastronomía', icon: UtensilsSvg },
      { id: 'coffee', name: 'Café & Bebidas', category: 'Gastronomía', icon: CoffeeSvg },
      { id: 'pizza', name: 'Pizzería / Comida Rápida', category: 'Gastronomía', icon: Pizza },
      { id: 'beer', name: 'Bar / Cervecería', category: 'Gastronomía', icon: Beer },
      { id: 'wine', name: 'Vinos & Licores', category: 'Gastronomía', icon: Wine },
      { id: 'cake', name: 'Pastelería / Postres', category: 'Gastronomía', icon: Cake },
      { id: 'chef-hat', name: 'Chef / Especialidades', category: 'Gastronomía', icon: ChefHat },
    ],
  },
  {
    name: 'Belleza, Barbería & Moda',
    items: [
      { id: 'scissors', name: 'Peluquería / Barba', category: 'Belleza', icon: ScissorsSvg },
      { id: 'sparkles', name: 'Uñas / Spa / Estética', category: 'Belleza', icon: SparklesBeautySvg },
      { id: 'crown', name: 'VIP / Exclusivo', category: 'Belleza', icon: Crown },
      { id: 'gem', name: 'Joyería / Accesorios', category: 'Belleza', icon: Gem },
      { id: 'shirt', name: 'Boutique / Moda', category: 'Belleza', icon: Shirt },
      { id: 'palette', name: 'Maquillaje / Arte', category: 'Belleza', icon: Palette },
    ],
  },
  {
    name: 'Tiendas, Comercio & Catálogos',
    items: [
      { id: 'shopping-bag', name: 'Catálogo / Tienda', category: 'Comercio', icon: ShoppingBagSvg },
      { id: 'ubereats', name: 'Uber Eats', category: 'Delivery', icon: UberEatsOfficialIcon },
      { id: 'didifood', name: 'DiDi Food', category: 'Delivery', icon: DidiFoodOfficialIcon },
      { id: 'rappi', name: 'Rappi', category: 'Delivery', icon: RappiOfficialIcon },
      { id: 'mercadolibre', name: 'Mercado Libre', category: 'Comercio', icon: MercadoLibreOfficialIcon },
      { id: 'amazon', name: 'Amazon', category: 'Comercio', icon: AmazonOfficialIcon },
      { id: 'shopify', name: 'Shopify', category: 'Comercio', icon: ShopifyOfficialIcon },
      { id: 'shopping-cart', name: 'Carrito de Compras', category: 'Comercio', icon: ShoppingCart },
      { id: 'store', name: 'Sucursal / Local', category: 'Comercio', icon: Store },
      { id: 'tag', name: 'Promociones / Descuentos', category: 'Comercio', icon: Tag },
      { id: 'gift', name: 'Regalos / Detalles', category: 'Comercio', icon: Gift },
      { id: 'package', name: 'Envíos / Paquetería', category: 'Comercio', icon: Package },
      { id: 'credit-card', name: 'Pagos / Cuentas', category: 'Comercio', icon: CreditCardSvg },
    ],
  },
  {
    name: 'Servicios Profesionales & Empresas',
    items: [
      { id: 'calendar', name: 'Reservar Cita', category: 'Servicios', icon: CalendarSvg },
      { id: 'clock', name: 'Horarios / Turnos', category: 'Servicios', icon: ClockSvg },
      { id: 'briefcase', name: 'Consultoría / Negocios', category: 'Servicios', icon: Briefcase },
      { id: 'file-text', name: 'Menú PDF / Brochure', category: 'Servicios', icon: FileTextSvg },
      { id: 'laptop', name: 'Tecnología / Software', category: 'Servicios', icon: Laptop },
      { id: 'scale', name: 'Legal / Abogados', category: 'Servicios', icon: Scale },
      { id: 'calculator', name: 'Finanzas / Contabilidad', category: 'Servicios', icon: Calculator },
      { id: 'shield', name: 'Seguridad / Seguros', category: 'Servicios', icon: Shield },
    ],
  },
  {
    name: 'Contacto & Ubicación',
    items: [
      { id: 'phone', name: 'Llamar por Teléfono', category: 'Contacto', icon: PhoneSvg },
      { id: 'map-pin', name: 'Ubicación / Google Maps', category: 'Contacto', icon: MapPinSvg },
      { id: 'mail', name: 'Correo Electrónico', category: 'Contacto', icon: MailSvg },
      { id: 'globe', name: 'Sitio Web Oficial', category: 'Contacto', icon: GlobeSvg },
      { id: 'message-circle', name: 'Mensaje Directo', category: 'Contacto', icon: MessageCircle },
      { id: 'send', name: 'Enviar Mensaje', category: 'Contacto', icon: Send },
      { id: 'google', name: 'Google Reseñas (Oficial)', category: 'Contacto', icon: GoogleOfficialIcon },
      { id: 'star', name: 'Reseñas en Google', category: 'Contacto', icon: StarSvg },
    ],
  },
  {
    name: 'Redes Sociales & Canales Oficiales',
    items: [
      { id: 'whatsapp', name: 'WhatsApp', category: 'Redes', icon: WhatsAppOfficialIcon },
      { id: 'instagram', name: 'Instagram', category: 'Redes', icon: InstagramOfficialIcon },
      { id: 'tiktok', name: 'TikTok', category: 'Redes', icon: TikTokOfficialIcon },
      { id: 'facebook', name: 'Facebook', category: 'Redes', icon: FacebookOfficialIcon },
      { id: 'youtube', name: 'YouTube', category: 'Redes', icon: YouTubeOfficialIcon },
      { id: 'linkedin', name: 'LinkedIn', category: 'Redes', icon: LinkedinOfficialIcon },
      { id: 'x', name: 'X (Twitter)', category: 'Redes', icon: XOfficialIcon },
      { id: 'threads', name: 'Threads', category: 'Redes', icon: ThreadsOfficialIcon },
      { id: 'telegram', name: 'Telegram', category: 'Redes', icon: TelegramOfficialIcon },
      { id: 'twitch', name: 'Twitch', category: 'Redes', icon: TwitchOfficialIcon },
      { id: 'onlyfans', name: 'OnlyFans', category: 'Redes', icon: OnlyFansOfficialIcon },
      { id: 'snapchat', name: 'Snapchat', category: 'Redes', icon: SnapchatOfficialIcon },
      { id: 'wechat', name: 'WeChat', category: 'Redes', icon: WeChatOfficialIcon },
    ],
  },
  {
    name: 'Salud, Bienestar & Deportes',
    items: [
      { id: 'activity', name: 'Clínica / Salud', category: 'Salud', icon: Activity },
      { id: 'stethoscope', name: 'Médicos & Dentistas', category: 'Salud', icon: Stethoscope },
      { id: 'heart', name: 'Bienestar / Terapia', category: 'Salud', icon: Heart },
      { id: 'dumbbell', name: 'Gimnasio & Fitness', category: 'Salud', icon: Dumbbell },
      { id: 'trophy', name: 'Torneos / Deporte', category: 'Salud', icon: Trophy },
    ],
  },
  {
    name: 'Inmobiliaria, Hogar, Autos & Creativos',
    items: [
      { id: 'home', name: 'Inmobiliaria / Bienes Raíces', category: 'Especiales', icon: Home },
      { id: 'building', name: 'Edificio / Oficinas', category: 'Especiales', icon: Building },
      { id: 'key', name: 'Renta / Cerrajería', category: 'Especiales', icon: Key },
      { id: 'car', name: 'Taller / Venta de Autos', category: 'Especiales', icon: Car },
      { id: 'wrench', name: 'Servicio Técnico / Reparación', category: 'Especiales', icon: Wrench },
      { id: 'camera', name: 'Fotografía & Video', category: 'Especiales', icon: Camera },
      { id: 'music', name: 'DJ / Eventos Musicales', category: 'Especiales', icon: Music },
      { id: 'headphones', name: 'Podcast / Audio', category: 'Especiales', icon: Headphones },
      { id: 'book-open', name: 'Cursos / Educación', category: 'Especiales', icon: BookOpen },
    ],
  },
];

// Flat array of all icons
export const ALL_BUSINESS_ICONS: BusinessIconItem[] = BUSINESS_ICON_CATEGORIES.flatMap((c) => c.items);

// Helper to look up an icon component by string ID
export function getBusinessIconComponent(iconId?: string): React.ComponentType<{ className?: string }> {
  if (!iconId) return GlobeSvg;
  // Social icons check
  if (iconId === 'whatsapp') return WhatsAppOfficialIcon;
  if (iconId === 'instagram') return InstagramOfficialIcon;
  if (iconId === 'facebook') return FacebookOfficialIcon;
  if (iconId === 'tiktok') return TikTokOfficialIcon;
  if (iconId === 'linkedin') return LinkedinOfficialIcon;
  if (iconId === 'youtube') return YouTubeOfficialIcon;
  if (iconId === 'x') return XOfficialIcon;
  if (iconId === 'telegram') return TelegramOfficialIcon;
  if (iconId === 'threads') return ThreadsOfficialIcon;
  if (iconId === 'onlyfans') return OnlyFansOfficialIcon;
  if (iconId === 'twitch') return TwitchOfficialIcon;
  if (iconId === 'snapchat') return SnapchatOfficialIcon;
  if (iconId === 'wechat') return WeChatOfficialIcon;
  if (iconId === 'ubereats') return UberEatsOfficialIcon;
  if (iconId === 'didifood') return DidiFoodOfficialIcon;
  if (iconId === 'rappi') return RappiOfficialIcon;
  if (iconId === 'mercadolibre') return MercadoLibreOfficialIcon;
  if (iconId === 'amazon') return AmazonOfficialIcon;
  if (iconId === 'shopify') return ShopifyOfficialIcon;
  if (iconId === 'google' || iconId === 'reviews' || iconId === 'google-review') return GoogleOfficialIcon;

  const found = ALL_BUSINESS_ICONS.find((item) => item.id === iconId);
  return found ? found.icon : GlobeSvg;
}
