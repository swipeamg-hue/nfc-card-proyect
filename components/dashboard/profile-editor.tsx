'use client';

import React, { useState, useRef } from 'react';
import {
  Business,
  BusinessLink,
  LinkType,
  NfcCard,
} from '@/types/business';
import {
  Building2,
  Share2,
  Palette,
  CreditCard,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  Smartphone,
  ExternalLink,
  Star,
  Upload,
  Image as ImageIcon,
  Camera,
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
} from '@/components/ui/svg-icons';

const OFFICIAL_SOCIAL_ICONS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: WhatsAppOfficialIcon, defaultColor: 'bg-[#25D366]' },
  { id: 'instagram', label: 'Instagram', icon: InstagramOfficialIcon, defaultColor: 'bg-pink-600' },
  { id: 'facebook', label: 'Facebook', icon: FacebookOfficialIcon, defaultColor: 'bg-[#1877F2]' },
  { id: 'tiktok', label: 'TikTok', icon: TikTokOfficialIcon, defaultColor: 'bg-black' },
  { id: 'linkedin', label: 'LinkedIn', icon: LinkedinOfficialIcon, defaultColor: 'bg-[#0A66C2]' },
  { id: 'youtube', label: 'YouTube', icon: YouTubeOfficialIcon, defaultColor: 'bg-[#FF0000]' },
  { id: 'x', label: 'X (Twitter)', icon: XOfficialIcon, defaultColor: 'bg-black' },
  { id: 'telegram', label: 'Telegram', icon: TelegramOfficialIcon, defaultColor: 'bg-[#229ED9]' },
];

const SERVICE_SVG_ICONS = [
  { id: 'utensils', label: 'Menú / Restaurante', icon: UtensilsSvg },
  { id: 'calendar', label: 'Reservar Cita', icon: CalendarSvg },
  { id: 'sparkles', label: 'Uñas / Belleza', icon: SparklesBeautySvg },
  { id: 'scissors', label: 'Peluquería / Barba', icon: ScissorsSvg },
  { id: 'coffee', label: 'Café / Bebidas', icon: CoffeeSvg },
  { id: 'shopping-bag', label: 'Catálogo / Tienda', icon: ShoppingBagSvg },
  { id: 'file-text', label: 'Menú PDF', icon: FileTextSvg },
  { id: 'clock', label: 'Horarios', icon: ClockSvg },
  { id: 'credit-card', label: 'Pagos', icon: CreditCardSvg },
  { id: 'star', label: 'Destacado / Reseña', icon: StarSvg },
  { id: 'phone', label: 'Llamar / Teléfono', icon: PhoneSvg },
  { id: 'globe', label: 'Sitio Web', icon: GlobeSvg },
  { id: 'map-pin', label: 'Ubicación / Maps', icon: MapPinSvg },
];

const COLOR_OPTIONS = [
  { id: 'amber', label: 'Naranja / Ámbar (Menú)', bg: 'bg-amber-500' },
  { id: 'purple', label: 'Púrpura (Citas)', bg: 'bg-purple-600' },
  { id: 'pink', label: 'Rosa (Uñas / Belleza)', bg: 'bg-pink-500' },
  { id: 'emerald', label: 'Verde Esmeralda', bg: 'bg-emerald-500' },
  { id: 'blue', label: 'Azul', bg: 'bg-blue-600' },
  { id: 'rose', label: 'Rojo / Rose', bg: 'bg-rose-500' },
  { id: 'dark', label: 'Grafito', bg: 'bg-zinc-800' },
];

interface ProfileEditorProps {
  business: Business;
  onChange: (updated: Business) => void;
}

export function ProfileEditor({ business, onChange }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'links' | 'design' | 'cards'>('info');
  const [newCardCode, setNewCardCode] = useState('');

  // Refs for local desktop file uploads
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);

  // Handle generic property updates
  const updateField = <K extends keyof Business>(key: K, value: Business[K]) => {
    onChange({
      ...business,
      [key]: value,
    });
  };

  // Handle local desktop file upload as Data URL
  const handleFileUpload = (field: 'bannerUrl' | 'logoUrl', file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      alert('La imagen no debe superar los 8MB para un rendimiento óptimo');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateField(field, dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Toggle link active status
  const toggleLinkActive = (id: string) => {
    const updatedLinks = business.links.map((link) =>
      link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    updateField('links', updatedLinks);
  };

  // Move link up or down in order
  const moveLink = (index: number, direction: 'up' | 'down') => {
    const newLinks = [...business.links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    // Reassign order
    const ordered = newLinks.map((link, idx) => ({ ...link, order: idx + 1 }));
    updateField('links', ordered);
  };

  // Update specific link field
  const updateLink = (id: string, updates: Partial<BusinessLink>) => {
    const updatedLinks = business.links.map((link) =>
      link.id === id ? { ...link, ...updates } : link
    );
    updateField('links', updatedLinks);
  };

  // Delete a link
  const deleteLink = (id: string) => {
    const filtered = business.links.filter((l) => l.id !== id);
    updateField('links', filtered);
  };

  // Add a new link with template defaults
  const addLink = (type: LinkType) => {
    const id = 'link-' + Math.random().toString(36).substring(2, 7);
    let title = 'Nuevo Enlace';
    let subtitle = 'Descripción breve';
    let url = 'https://';
    let iconName = 'globe';
    let customColor: string | undefined = undefined;

    if (type === 'whatsapp') {
      title = 'WhatsApp';
      subtitle = 'Chatea con nosotros';
      url = 'https://wa.me/5215500000000';
      iconName = 'whatsapp';
    } else if (type === 'phone') {
      title = 'Llamar ahora';
      subtitle = '+52 55 0000 0000';
      url = 'tel:+525500000000';
      iconName = 'phone';
    } else if (type === 'instagram') {
      title = 'Síguenos en Instagram';
      subtitle = '@tunegocio';
      url = 'https://instagram.com/tunegocio';
      iconName = 'instagram';
    } else if (type === 'facebook') {
      title = 'Visítanos en Facebook';
      subtitle = '/tunegocio';
      url = 'https://facebook.com/tunegocio';
      iconName = 'facebook';
    } else if (type === 'linkedin') {
      title = 'Conéctate en LinkedIn';
      subtitle = 'Empresa en LinkedIn';
      url = 'https://linkedin.com/company/tunegocio';
      iconName = 'linkedin';
    } else if (type === 'tiktok') {
      title = 'TikTok Oficial';
      subtitle = 'Mira nuestros videos y novedades';
      url = 'https://tiktok.com/@tunegocio';
      iconName = 'tiktok';
    } else if (type === 'youtube') {
      title = 'Canal de YouTube';
      subtitle = 'Suscríbete a nuestro canal';
      url = 'https://youtube.com/@tunegocio';
      iconName = 'youtube';
    } else if (type === 'x') {
      title = 'Síguenos en X';
      subtitle = '@tunegocio';
      url = 'https://x.com/tunegocio';
      iconName = 'x';
    } else if (type === 'telegram') {
      title = 'Canal de Telegram';
      subtitle = 'Únete a nuestra comunidad';
      url = 'https://t.me/tunegocio';
      iconName = 'telegram';
    } else if (type === 'catalog') {
      title = 'Ver Catálogo / Menú';
      subtitle = 'Descarga nuestro brochure en PDF';
      url = 'https://ejemplo.com/catalogo.pdf';
      iconName = 'file-text';
    } else if (type === 'menu') {
      title = 'Menú del Restaurante';
      subtitle = 'Consulta nuestros platillos y bebidas';
      url = 'https://ejemplo.com/menu-digital';
      iconName = 'utensils';
      customColor = 'amber';
    } else if (type === 'booking') {
      title = 'Reservar Cita';
      subtitle = 'Agenda tu horario o servicio en línea';
      url = 'https://citas.com/reservar';
      iconName = 'calendar';
      customColor = 'purple';
    } else if (type === 'custom') {
      title = 'Botón Personalizado';
      subtitle = 'Escribe un subtítulo o llamado a la acción';
      url = 'https://';
      iconName = 'sparkles';
      customColor = 'pink';
    }

    const newLink: BusinessLink = {
      id,
      businessId: business.id,
      type,
      title,
      subtitle,
      url,
      iconName,
      customColor,
      order: business.links.length + 1,
      isActive: true,
      highlighted: false,
    };

    updateField('links', [...business.links, newLink]);
  };

  // Add NFC Card to business
  const handleAddCard = () => {
    if (!newCardCode.trim()) return;
    const cleanCode = newCardCode.trim().toUpperCase();
    const existing = business.cards || [];
    if (existing.some((c) => c.cardCode === cleanCode)) {
      alert('Esta tarjeta ya está vinculada a tu perfil');
      return;
    }

    const newCard: NfcCard = {
      id: 'card-' + Date.now(),
      cardCode: cleanCode,
      businessId: business.id,
      status: 'ACTIVE',
      totalTaps: 0,
      createdAt: new Date().toISOString(),
    };

    updateField('cards', [...existing, newCard]);
    setNewCardCode('');
  };

  // Toggle card active/pause
  const toggleCardStatus = (cardId: string) => {
    const updated = (business.cards || []).map((c) =>
      c.id === cardId
        ? { ...c, status: (c.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE') as NfcCard['status'] }
        : c
    );
    updateField('cards', updated);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6">
      {/* Editor Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800 pb-4 mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Información</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'links'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Enlaces ({business.links.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'design'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Multimedia & Tema</span>
        </button>

        <button
          onClick={() => setActiveTab('cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'cards'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Chips NFC ({business.cards?.length || 0})</span>
        </button>
      </div>

      {/* TAB 1: Business Information */}
      {activeTab === 'info' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              value={business.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Ej. Nexo Soluciones"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Slug Público (URL)
              </label>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/50 px-3">
                <span className="text-xs text-slate-400">tapcard.link/</span>
                <input
                  type="text"
                  value={business.slug}
                  onChange={(e) => updateField('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full py-2.5 bg-transparent text-sm focus:outline-none font-medium text-slate-800 dark:text-zinc-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                Giro Comercial / Subtítulo
              </label>
              <input
                type="text"
                value={business.category || ''}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Ej. Consultoría Tecnológica & B2B"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
              Biografía / Propuesta de Valor
            </label>
            <textarea
              rows={3}
              value={business.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Escribe un párrafo conciso sobre tu negocio..."
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                  Insignia Oficial de Verificación
                </span>
                <p className="text-[11px] text-slate-500">
                  Muestra el distintivo azul de negocio autenticado en tu perfil
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={business.isVerified}
              onChange={(e) => updateField('isVerified', e.target.checked)}
              className="w-5 h-5 accent-blue-600 cursor-pointer rounded"
            />
          </div>

          {/* Quick contact info */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Datos para vCard y Accesos Rápidos
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={business.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={business.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                  Dirección Física
                </label>
                <input
                  type="text"
                  value={business.address || ''}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-zinc-400 mb-1">
                  URL Google Maps
                </label>
                <input
                  type="text"
                  value={business.googleMapsUrl || ''}
                  onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Links Manager */}
      {activeTab === 'links' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                Agregar botón rápido:
              </span>
              <span className="text-[11px] text-slate-500">
                Elige un acceso directo o crea uno a tu medida
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => addLink('whatsapp')}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <WhatsAppOfficialIcon className="w-3.5 h-3.5" />
                <span>+ WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('phone')}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <PhoneSvg className="w-3.5 h-3.5" />
                <span>+ Teléfono</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('instagram')}
                className="px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <InstagramOfficialIcon className="w-3.5 h-3.5" />
                <span>+ Instagram</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('tiktok')}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <TikTokOfficialIcon className="w-3.5 h-3.5 text-white" />
                <span>+ TikTok</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('website')}
                className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <GlobeSvg className="w-3.5 h-3.5" />
                <span>+ Sitio Web</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('menu')}
                title="Ideal para restaurantes, cafeterías o bares"
                className="px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <UtensilsSvg className="w-3.5 h-3.5" />
                <span>+ Menú / Carta</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('booking')}
                title="Ideal para salones de uñas, estética o consultorios"
                className="px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-700 dark:text-purple-400 hover:bg-purple-500/25 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <CalendarSvg className="w-3.5 h-3.5" />
                <span>+ Reservar Cita</span>
              </button>
              <button
                type="button"
                onClick={() => addLink('custom')}
                className="px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-95 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <SparklesBeautySvg className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Personalizado</span>
              </button>
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-3">
            {business.links.map((link, idx) => (
              <div
                key={link.id}
                className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  link.highlighted
                    ? 'border-amber-400/70 dark:border-amber-500/50 bg-amber-500/5 dark:bg-amber-950/15 shadow-sm'
                    : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleLinkActive(link.id)}
                      title={link.isActive ? 'Desactivar botón' : 'Activar botón'}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        link.isActive
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-200 dark:bg-zinc-700 text-slate-500'
                      }`}
                    >
                      {link.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                      #{idx + 1} {link.type}
                    </span>

                    {/* Star highlight badge toggle */}
                    <button
                      type="button"
                      onClick={() => updateLink(link.id, { highlighted: !link.highlighted })}
                      title={link.highlighted ? 'Quitar destacado' : 'Destacar botón en el perfil'}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                        link.highlighted
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-300/60'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${link.highlighted ? 'fill-amber-400 text-amber-500' : ''}`} />
                      <span>{link.highlighted ? 'Destacado' : 'Destacar'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveLink(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveLink(idx, 'down')}
                      disabled={idx === business.links.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteLink(link.id)}
                      className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">
                      Título en el botón:
                    </label>
                    <input
                      type="text"
                      value={link.title}
                      onChange={(e) => updateLink(link.id, { title: e.target.value })}
                      placeholder="Ej: Ver Menú Digital o Reservar Cita"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold bg-white dark:bg-zinc-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">
                      Subtítulo o descripción:
                    </label>
                    <input
                      type="text"
                      value={link.subtitle || ''}
                      onChange={(e) => updateLink(link.id, { subtitle: e.target.value })}
                      placeholder="Ej: Platillos del día / Horarios disponibles"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs bg-white dark:bg-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400 mb-1">
                    Enlace de destino (URL):
                  </label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-mono bg-white dark:bg-zinc-900"
                  />
                </div>

                {/* Visual Icon & Color Customization */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-700/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      Ícono del botón:
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Seleccionado: <strong className="text-blue-500">{link.iconName || 'predeterminado'}</strong>
                    </span>
                  </div>

                  {/* 1. Redes Sociales Oficiales */}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                      Redes Sociales Oficiales:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {OFFICIAL_SOCIAL_ICONS.map((item) => {
                        const IconComp = item.icon;
                        const isSelected = link.iconName === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateLink(link.id, { iconName: item.id })}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs font-semibold ring-1 ring-blue-400'
                                : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-md flex items-center justify-center ${item.defaultColor} p-0.5`}>
                              <IconComp className="w-3 h-3 text-white" />
                            </span>
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Servicios & Negocios (SVGs) */}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                      Servicios & Negocios (SVG):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {SERVICE_SVG_ICONS.map((item) => {
                        const IconComp = item.icon;
                        const isSelected = link.iconName === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => updateLink(link.id, { iconName: item.id })}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-xs font-semibold ring-1 ring-blue-400'
                                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800'
                            }`}
                          >
                            <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-600 dark:text-zinc-300'}`} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      Color / Estilo:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {COLOR_OPTIONS.map((col) => {
                        const isSelected = link.customColor === col.id;
                        return (
                          <button
                            key={col.id}
                            type="button"
                            title={col.label}
                            onClick={() => updateLink(link.id, { customColor: col.id })}
                            className={`w-5 h-5 rounded-full ${col.bg} transition-all ${
                              isSelected
                                ? 'ring-2 ring-offset-2 ring-blue-600 dark:ring-white scale-110'
                                : 'opacity-75 hover:opacity-100'
                            }`}
                          />
                        );
                      })}
                      {link.customColor && (
                        <button
                          type="button"
                          onClick={() => updateLink(link.id, { customColor: undefined })}
                          className="text-[10px] text-slate-400 hover:text-slate-600 underline ml-1"
                        >
                          Automático
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Design & Media */}
      {activeTab === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 1. Banner de Portada */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  Foto de Portada (Banner)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Se muestra en la parte superior de tu perfil digital NFC
                </p>
              </div>
              {business.bannerUrl && (
                <button
                  type="button"
                  onClick={() => updateField('bannerUrl', '')}
                  className="text-[11px] text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Quitar foto
                </button>
              )}
            </div>

            {/* Visual Thumbnail */}
            <div
              onClick={() => bannerFileRef.current?.click()}
              className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 dark:border-zinc-700 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer shadow-inner"
            >
              {business.bannerUrl ? (
                <img
                  src={business.bannerUrl}
                  alt="Vista previa del banner"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 dark:text-zinc-500 p-4 text-center">
                  <Upload className="w-8 h-8 mb-1 opacity-50" />
                  <span className="text-xs font-medium">Sin imagen de portada</span>
                  <span className="text-[10px]">Haz clic aquí para subir una foto desde tu equipo</span>
                </div>
              )}

              {/* Upload trigger overlay button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow-lg flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {business.bannerUrl ? 'Cambiar foto de portada' : 'Subir foto desde mi equipo'}
                </span>
              </div>
            </div>

            {/* Hidden Input file for Banner */}
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload('bannerUrl', e.target.files[0]);
                }
              }}
            />

            {/* Main Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => bannerFileRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Subir foto desde mi computadora
              </button>

              <button
                type="button"
                onClick={() => updateField('bannerUrl', '/images/nexo-banner.jpg')}
                className="px-2.5 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 text-xs font-medium transition-colors"
              >
                Usar Banner High-Tech Nexo
              </button>

              <button
                type="button"
                onClick={() => setShowBannerUrlInput(!showBannerUrlInput)}
                className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 ml-auto underline"
              >
                {showBannerUrlInput ? 'Ocultar URL' : 'O pegar enlace (URL)'}
              </button>
            </div>

            {/* Optional URL input toggle */}
            {showBannerUrlInput && (
              <div className="pt-2 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={business.bannerUrl}
                  onChange={(e) => updateField('bannerUrl', e.target.value)}
                  placeholder="https://ejemplo.com/portada.jpg"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-mono bg-white dark:bg-zinc-900"
                />
              </div>
            )}
          </div>

          {/* 2. Avatar / Logo Circular */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-purple-600" />
                  Foto de Perfil / Logo Circular
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Aparece en el círculo central sobre tu foto de portada
                </p>
              </div>
              {business.logoUrl && (
                <button
                  type="button"
                  onClick={() => updateField('logoUrl', '')}
                  className="text-[11px] text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Quitar foto
                </button>
              )}
            </div>

            {/* Circular Preview & Action */}
            <div className="flex items-center gap-4">
              <div
                onClick={() => logoFileRef.current?.click()}
                className="relative w-20 h-20 rounded-full border-2 border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md group cursor-pointer"
                title="Haz clic para cambiar foto de perfil"
              >
                {business.logoUrl ? (
                  <img
                    src={business.logoUrl}
                    alt="Logo circular preview"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                  />
                ) : (
                  <span className="text-lg font-bold text-slate-700 dark:text-zinc-300 uppercase">
                    {business.name.slice(0, 2) || 'LOG'}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Sube tu logotipo o foto personal desde tu computadora (PNG, JPG o WEBP).
                </p>

                {/* Hidden Input file for Logo */}
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload('logoUrl', e.target.files[0]);
                    }
                  }}
                />

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoFileRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Subir foto o logo
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('logoUrl', '/images/nexo-logo.jpg')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200/70 hover:bg-slate-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-slate-700 dark:text-zinc-200 text-xs font-medium transition-colors"
                  >
                    Usar Logo Nexo
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                    className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 underline"
                  >
                    {showLogoUrlInput ? 'Ocultar URL' : 'O pegar enlace (URL)'}
                  </button>
                </div>

                {showLogoUrlInput && (
                  <div className="pt-1 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={business.logoUrl}
                      onChange={(e) => updateField('logoUrl', e.target.value)}
                      placeholder="https://ejemplo.com/logo.png"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs font-mono bg-white dark:bg-zinc-900"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Color de Acento */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-2">
            <label className="block text-xs font-bold text-slate-900 dark:text-zinc-100 mb-1">
              Color de Acento Primario
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={business.themeColor}
                onChange={(e) => updateField('themeColor', e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border border-slate-200 dark:border-zinc-700 p-0.5 bg-white dark:bg-zinc-900"
              />
              <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                {business.themeColor}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Physical NFC Cards */}
      {activeTab === 'cards' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Vincular Nuevo Chip NFC Físico
            </h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mb-3">
              Ingresa el código alfanumérico impreso o grabado en tu tarjeta física NFC para activarla de inmediato.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCardCode}
                onChange={(e) => setNewCardCode(e.target.value)}
                placeholder="Ej. NX-7732"
                className="px-3 py-2 rounded-xl border border-blue-200 dark:border-blue-800 text-xs font-mono uppercase bg-white dark:bg-zinc-800 flex-1"
              />
              <button
                onClick={handleAddCard}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Vincular Tarjeta
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            {(business.cards || []).map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
                    NFC
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                        {card.cardCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          card.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {card.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {card.totalTaps} lecturas registradas
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`/t/${card.cardCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Probar redirección de chip"
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => toggleCardStatus(card.id)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                  >
                    {card.status === 'ACTIVE' ? 'Pausar' : 'Reactivar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
