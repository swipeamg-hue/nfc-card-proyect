'use client';

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Business,
  BusinessLink,
  LinkType,
  NfcCard,
  ButtonShape,
  CardCustomization,
} from '@/types/business';
import {
  Building2,
  Share2,
  Palette,
  CreditCard,
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
  Camera,
  Crop,
  Save,
  Pencil,
  Copy,
  Check,
  Download,
  QrCode,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Type,
  Sliders,
} from 'lucide-react';
import { uploadBusinessAsset, getAppBaseUrl } from '@/lib/supabase';
import { ImageCropperModal, CropType } from '@/components/dashboard/image-cropper-modal';
import {
  WhatsAppOfficialIcon,
  InstagramOfficialIcon,
  FacebookOfficialIcon,
  TikTokOfficialIcon,
  YouTubeOfficialIcon,
  LinkedinOfficialIcon,
  XOfficialIcon,
  ThreadsOfficialIcon,
  OnlyFansOfficialIcon,
  TelegramOfficialIcon,
  TwitchOfficialIcon,
  SnapchatOfficialIcon,
  WeChatOfficialIcon,
  GlobeSvg,
  PhoneSvg,
  GoogleOfficialIcon,
} from '@/components/ui/svg-icons';
import { IconPickerModal } from '@/components/dashboard/icon-picker-modal';
import { getBusinessIconComponent } from '@/components/ui/business-icons';
import { FontPicker } from '@/components/ui/font-picker';

const COLOR_OPTIONS = [
  { id: 'amber', label: 'Naranja / Ámbar', bg: 'bg-amber-500' },
  { id: 'purple', label: 'Púrpura / Citas', bg: 'bg-purple-600' },
  { id: 'pink', label: 'Rosa / Belleza', bg: 'bg-pink-500' },
  { id: 'emerald', label: 'Verde Esmeralda', bg: 'bg-emerald-500' },
  { id: 'blue', label: 'Azul Eléctrico', bg: 'bg-blue-600' },
  { id: 'rose', label: 'Rojo / Rose', bg: 'bg-rose-500' },
  { id: 'dark', label: 'Grafito', bg: 'bg-zinc-800' },
];

interface ProfileEditorProps {
  business: Business;
  onChange: (updated: Business) => void;
  onSave?: () => Promise<void> | void;
  isSuperAdmin?: boolean;
}

export function ProfileEditor({
  business,
  onChange,
  onSave,
  isSuperAdmin = false,
}: ProfileEditorProps) {
  const [selectedTab, setSelectedTab] = useState<'info' | 'links' | 'design' | 'cards'>('info');
  const activeTab = !isSuperAdmin && selectedTab === 'cards' ? 'info' : selectedTab;
  const setActiveTab = setSelectedTab;

  const [newCardCode, setNewCardCode] = useState('');

  // Icon Picker Modal State
  const [pickerModalOpen, setPickerModalOpen] = useState(false);
  const [activePickingLinkId, setActivePickingLinkId] = useState<string | null>(null);

  // Link Action feedback
  const [savedLinkId, setSavedLinkId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [isAddLinksExpanded, setIsAddLinksExpanded] = useState(false);

  // QR Code state for NFC tab
  const [qrPng, setQrPng] = useState<string>('');
  const [copiedQr, setCopiedQr] = useState<boolean>(false);

  // Refs for local file uploads
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const logoFileRef = useRef<HTMLInputElement>(null);
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);
  const [showLogoUrlInput, setShowLogoUrlInput] = useState(false);
  const [autoSyncCover, setAutoSyncCover] = useState(true);

  // Image Cropper Modal State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');
  const [cropperType, setCropperType] = useState<CropType>('banner');
  const [cropperField, setCropperField] = useState<'bannerUrl' | 'logoUrl'>('bannerUrl');

  const profileUrl = typeof window !== 'undefined'
    ? `${getAppBaseUrl()}/${business.slug}`
    : `https://tapcard.mx/${business.slug}`;

  useEffect(() => {
    QRCode.toDataURL(
      profileUrl,
      {
        width: 600,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) setQrPng(url);
      }
    );
  }, [profileUrl]);

  const handleDownloadQr = () => {
    if (!qrPng) return;
    const link = document.createElement('a');
    link.href = qrPng;
    link.download = `QR-Oficial-${business.slug}.png`;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopiedQr(true);
    setTimeout(() => setCopiedQr(false), 2000);
  };

  // Handle generic property updates
  const updateField = <K extends keyof Business>(key: K, value: Business[K]) => {
    onChange({
      ...business,
      [key]: value,
    });
  };

  // Handle customization property updates
  const updateCustomization = <K extends keyof CardCustomization>(
    key: K,
    value: CardCustomization[K]
  ) => {
    const current = business.customization || {};
    onChange({
      ...business,
      customization: {
        ...current,
        [key]: value,
      },
    });
  };

  // Handle multiple customization updates at once
  const updateCustomizations = (updates: Partial<CardCustomization>) => {
    const current = business.customization || {};
    onChange({
      ...business,
      customization: {
        ...current,
        ...updates,
      },
    });
  };

  // Trigger file selection and open the cropper modal
  const handleFileSelected = (field: 'bannerUrl' | 'logoUrl', file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, WEBP, etc.)');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      alert('La imagen no debe superar los 15MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setCropperImageSrc(result);
        const isBanner = business.customization?.backgroundMode === 'banner';
        setCropperType(field === 'logoUrl' ? 'circle' : (isBanner ? 'banner' : 'vertical'));
        setCropperField(field);
        setCropperOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Re-open cropper on an already saved image URL
  const handleOpenExistingCropper = (field: 'bannerUrl' | 'logoUrl') => {
    const currentUrl = field === 'bannerUrl' ? business.bannerUrl : business.logoUrl;
    if (!currentUrl) return;
    setCropperImageSrc(currentUrl);
    const isBanner = business.customization?.backgroundMode === 'banner';
    setCropperType(field === 'logoUrl' ? 'circle' : (isBanner ? 'banner' : 'vertical'));
    setCropperField(field);
    setCropperOpen(true);
  };

  // When user finishes cropping in the modal
  const handleCropperConfirm = async (
    croppedDataUrl: string,
    croppedFile: File,
    chosenCropType?: CropType
  ) => {
    const field = cropperField;

    // Automatically align presentation mode if user explicitly chose vertical vs banner in cropper
    if (field === 'bannerUrl' && chosenCropType) {
      if (chosenCropType === 'vertical' && business.customization?.backgroundMode !== 'full') {
        updateCustomization('backgroundMode', 'full');
      } else if (chosenCropType === 'banner' && business.customization?.backgroundMode !== 'banner') {
        updateCustomization('backgroundMode', 'banner');
      }
    }

    // 1. Immediately apply locally for 0ms visual latency
    if (field === 'logoUrl') {
      const shouldSyncBanner = autoSyncCover || !business.bannerUrl;
      onChange({
        ...business,
        logoUrl: croppedDataUrl,
        bannerUrl: shouldSyncBanner ? croppedDataUrl : business.bannerUrl,
      });
    } else {
      updateField(field, croppedDataUrl);
    }

    // 2. Upload the optimized cropped file to Supabase Storage
    try {
      const uploadRes = await uploadBusinessAsset(croppedFile, business.slug, field === 'logoUrl' ? 'logo' : 'banner');
      if (uploadRes.url) {
        if (field === 'logoUrl') {
          const shouldSyncBanner = autoSyncCover || !business.bannerUrl;
          onChange({
            ...business,
            logoUrl: uploadRes.url,
            bannerUrl: shouldSyncBanner ? uploadRes.url : business.bannerUrl,
          });
        } else {
          updateField(field, uploadRes.url);
        }
      }
    } catch (err) {
      console.warn('Storage upload fallback kept local cropped dataURL:', err);
    }
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

  // Explicit diskette save action
  const handleSaveLink = async (linkId: string) => {
    setSavedLinkId(linkId);
    if (onSave) {
      await onSave();
    }
    setTimeout(() => {
      setSavedLinkId(null);
    }, 2000);
  };

  // Upload asset for custom link (image or document)
  const handleLinkAssetUpload = async (linkId: string, type: 'image' | 'doc', file?: File | null) => {
    if (!file) return;
    try {
      const uploadRes = await uploadBusinessAsset(
        file,
        `${business.slug}-${linkId}`,
        type === 'image' ? 'logo' : 'banner'
      );
      if (uploadRes.url) {
        updateLink(linkId, { url: uploadRes.url });
        return;
      }
    } catch (err) {
      console.warn('Fallback link asset to Data URL:', err);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        updateLink(linkId, { url: dataUrl });
      }
    };
    reader.readAsDataURL(file);
  };

  // Add a new link with template defaults
  const addLink = (type: LinkType) => {
    const id = 'link-' + Math.random().toString(36).substring(2, 7);
    let title = 'Nuevo Enlace';
    let subtitle = 'Descripción breve';
    let url = 'https://';
    let iconName = 'globe';
    let customColor: string | undefined = undefined;

    if (type === 'custom') {
      title = 'Botón Personalizado';
      subtitle = 'Servicio o enlace personalizado';
      url = 'https://';
      iconName = 'sparkles';
      customColor = 'blue';
    } else if (type === 'whatsapp') {
      title = 'WhatsApp';
      subtitle = 'Chatea con nosotros';
      url = 'https://wa.me/5215500000000';
      iconName = 'whatsapp';
    } else if (type === 'phone') {
      title = 'Llamar por Teléfono';
      subtitle = '+52 55 0000 0000';
      url = 'tel:+525500000000';
      iconName = 'phone';
    } else if (type === 'instagram') {
      title = 'Síguenos en Instagram';
      subtitle = '@tunegocio';
      url = 'https://instagram.com/tunegocio';
      iconName = 'instagram';
    } else if (type === 'tiktok') {
      title = 'TikTok Oficial';
      subtitle = 'Mira nuestros videos';
      url = 'https://tiktok.com/@tunegocio';
      iconName = 'tiktok';
    } else if (type === 'facebook') {
      title = 'Visítanos en Facebook';
      subtitle = '/tunegocio';
      url = 'https://facebook.com/tunegocio';
      iconName = 'facebook';
    } else if (type === 'youtube') {
      title = 'Canal de YouTube';
      subtitle = 'Suscríbete a nuestro canal';
      url = 'https://youtube.com/@tunegocio';
      iconName = 'youtube';
    } else if (type === 'website') {
      title = 'Sitio Web Oficial';
      subtitle = 'Visita nuestra tienda o portal';
      url = 'https://tunegocio.com';
      iconName = 'globe';
    } else if (type === 'reviews') {
      title = 'Reseñas';
      subtitle = 'Califícanos en Google';
      url = 'https://g.page/r/.../review';
      iconName = 'google';
    } else if (type === 'linkedin') {
      title = 'LinkedIn';
      subtitle = 'Conéctate profesionalmente';
      url = 'https://linkedin.com/in/tunegocio';
      iconName = 'linkedin';
    } else if (type === 'x') {
      title = 'X (Twitter)';
      subtitle = 'Síguenos en X';
      url = 'https://x.com/tunegocio';
      iconName = 'x';
    } else if (type === 'threads') {
      title = 'Threads';
      subtitle = 'Síguenos en Threads';
      url = 'https://threads.net/@tunegocio';
      iconName = 'threads';
    } else if (type === 'onlyfans') {
      title = 'OnlyFans';
      subtitle = 'Contenido exclusivo';
      url = 'https://onlyfans.com/tunegocio';
      iconName = 'onlyfans';
    } else if (type === 'telegram') {
      title = 'Telegram';
      subtitle = 'Canal o chat oficial';
      url = 'https://t.me/tunegocio';
      iconName = 'telegram';
    } else if (type === 'twitch') {
      title = 'Twitch';
      subtitle = 'Transmisiones en vivo';
      url = 'https://twitch.tv/tunegocio';
      iconName = 'twitch';
    } else if (type === 'snapchat') {
      title = 'Snapchat';
      subtitle = 'Agréganos en Snapchat';
      url = 'https://snapchat.com/add/tunegocio';
      iconName = 'snapchat';
    } else if (type === 'wechat') {
      title = 'WeChat';
      subtitle = 'Contáctanos en WeChat';
      url = 'https://weixin.qq.com/...';
      iconName = 'wechat';
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
    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm p-4 sm:p-6">
      {/* Editor Tabs Navigation */}
      <div
        className={`border-b border-slate-200 dark:border-zinc-800 pb-3 sm:pb-4 mb-5 sm:mb-6 ${
          isSuperAdmin
            ? 'flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth'
            : 'grid grid-cols-3 sm:flex sm:items-center gap-1.5 sm:gap-2'
        }`}
      >
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'info'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Building2 className="w-4 h-4 shrink-0" />
          <span className="truncate">Información</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'links'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Share2 className="w-4 h-4 shrink-0" />
          <span className="truncate">Enlaces ({business.links.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('design')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'design'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Palette className="w-4 h-4 shrink-0" />
          <span className="truncate">Multimedia</span>
        </button>

        {isSuperAdmin && (
          <button
            onClick={() => setActiveTab('cards')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
              activeTab === 'cards'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>NFC</span>
          </button>
        )}
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

          <div className={isSuperAdmin ? 'grid grid-cols-1 sm:grid-cols-2 gap-3' : 'space-y-3'}>
            {isSuperAdmin && (
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
            )}

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

          {isSuperAdmin && (
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
          )}

          {/* Tipografía y Colores de Información del Perfil */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 space-y-4">
            {/* Cabecera de Tipografía */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Tipografía de la Tarjeta
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Elige entre la biblioteca completa de Google Fonts o sube la fuente oficial de tu marca (.ttf, .otf, .woff).
                </p>
              </div>
              {business.customization?.fontFamily && business.customization?.fontFamily !== 'Inter' && (
                <button
                  type="button"
                  onClick={() => {
                    updateCustomizations({
                      fontFamily: 'Inter',
                      customFontUrl: '',
                      customFontName: '',
                    });
                  }}
                  className="text-[10px] text-rose-500 hover:underline font-semibold"
                >
                  Restablecer
                </button>
              )}
            </div>

            {/* Selector de Fuentes Google Fonts & Custom Font Loader */}
            <FontPicker
              currentFont={business.customization?.fontFamily || 'Inter'}
              customFontUrl={business.customization?.customFontUrl}
              customFontName={business.customization?.customFontName}
              onFontChange={(fontName, customUrl) => {
                if (customUrl) {
                  updateCustomizations({
                    customFontName: fontName,
                    customFontUrl: customUrl,
                    fontFamily: fontName,
                  });
                } else {
                  updateCustomizations({
                    fontFamily: fontName,
                    customFontName: '',
                    customFontUrl: '',
                  });
                }
              }}
            />

            {/* Separador y Cabecera de Colores de Textos */}
            <div className="border-t border-slate-200/80 dark:border-zinc-700/60 pt-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    Color de Textos e Información
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Elige el color del nombre, subtítulo y biografía para que contrasten perfectamente con tu foto de fondo.
                  </p>
                </div>
                {(business.customization?.nameColor || business.customization?.bioColor) && (
                  <button
                    type="button"
                    onClick={() => {
                      updateCustomizations({
                        nameColor: '',
                        textColor: '',
                        categoryColor: '',
                        bioColor: '',
                        subtitleColor: '',
                      });
                    }}
                    className="text-[10px] text-rose-500 hover:underline font-semibold"
                  >
                    Restablecer colores
                  </button>
                )}
              </div>

              {/* 1. Color del Nombre Comercial / Título */}
              <div className="space-y-2 bg-white dark:bg-zinc-900/70 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                    Color del Nombre / Título:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                      {business.customization?.nameColor || 'Automático'}
                    </span>
                    <label
                      title="Elegir color personalizado libre"
                      className="w-6 h-6 rounded-lg cursor-pointer border border-slate-300 dark:border-zinc-600 flex items-center justify-center overflow-hidden shadow-xs hover:scale-105 transition-transform"
                      style={{ backgroundColor: business.customization?.nameColor || '#FFFFFF' }}
                    >
                      <input
                        type="color"
                        value={business.customization?.nameColor || '#FFFFFF'}
                        onChange={(e) => updateCustomization('nameColor', e.target.value)}
                        className="opacity-0 w-0 h-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Swatches rápidos para Nombre */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {[
                    { label: 'Blanco', value: '#FFFFFF', border: true },
                    { label: 'Carbón', value: '#0F172A' },
                    { label: 'Dorado', value: '#F59E0B' },
                    { label: 'Azul', value: '#3B82F6' },
                    { label: 'Esmeralda', value: '#10B981' },
                    { label: 'Violeta', value: '#8B5CF6' },
                    { label: 'Rojo', value: '#EF4444' },
                  ].map((preset) => {
                    const isSelected = business.customization?.nameColor === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => updateCustomization('nameColor', preset.value)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${preset.border ? 'border border-slate-300 dark:border-zinc-600' : ''}`}
                          style={{ backgroundColor: preset.value }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Color de Subtítulo y Biografía */}
              <div className="space-y-2 bg-white dark:bg-zinc-900/70 p-3 rounded-xl border border-slate-200/80 dark:border-zinc-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                    Color de Subtítulo y Biografía:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                      {business.customization?.bioColor || 'Automático'}
                    </span>
                    <label
                      title="Elegir color personalizado libre"
                      className="w-6 h-6 rounded-lg cursor-pointer border border-slate-300 dark:border-zinc-600 flex items-center justify-center overflow-hidden shadow-xs hover:scale-105 transition-transform"
                      style={{ backgroundColor: business.customization?.bioColor || '#94A3B8' }}
                    >
                      <input
                        type="color"
                        value={business.customization?.bioColor || '#94A3B8'}
                        onChange={(e) =>
                          updateCustomizations({
                            bioColor: e.target.value,
                            categoryColor: e.target.value,
                            subtitleColor: e.target.value,
                          })
                        }
                        className="opacity-0 w-0 h-0 cursor-pointer"
                      />
                    </label>
                  </div>
                </div>

                {/* Swatches rápidos para Subtítulo y Biografía */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {[
                    { label: 'Blanco Suave', value: '#F1F5F9', border: true },
                    { label: 'Gris Plata', value: '#94A3B8' },
                    { label: 'Dorado Claro', value: '#FDE68A' },
                    { label: 'Azul Claro', value: '#93C5FD' },
                    { label: 'Menta', value: '#A7F3D0' },
                    { label: 'Carbón Medio', value: '#334155' },
                  ].map((preset) => {
                    const isSelected = business.customization?.bioColor === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          updateCustomizations({
                            bioColor: preset.value,
                            categoryColor: preset.value,
                            subtitleColor: preset.value,
                          })
                        }
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                          isSelected
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950/60 font-bold text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`w-3 h-3 rounded-full shrink-0 ${preset.border ? 'border border-slate-300 dark:border-zinc-600' : ''}`}
                          style={{ backgroundColor: preset.value }}
                        />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Links Manager */}
      {activeTab === 'links' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-800 space-y-2.5 transition-all">
            {/* Header con botón y flecha SVG de despliegue */}
            <button
              type="button"
              onClick={() => setIsAddLinksExpanded(!isAddLinksExpanded)}
              className="w-full flex items-center justify-between text-left cursor-pointer group select-none"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Agregar botón de enlace:
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  {isAddLinksExpanded ? '17 opciones' : 'Toca para desplegar'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <span>{isAddLinksExpanded ? 'Plegar' : 'Ver todas las opciones'}</span>
                {/* Flecha SVG de despliegue interactiva */}
                <svg
                  className={`w-4 h-4 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-transform duration-300 ${
                    isAddLinksExpanded ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </button>

            {/* Quick add buttons - Opciones Predeterminadas con Colores e Iconos Oficiales */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {/* 1. Botón Personalizado siempre destacado al inicio */}
              <button
                type="button"
                onClick={() => addLink('custom')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-95 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ring-2 ring-blue-400/30 active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>+ Botón Personalizado</span>
              </button>

              {/* 2. Redes de uso más frecuente */}
              <button
                type="button"
                onClick={() => addLink('whatsapp')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 border border-emerald-500/20 cursor-pointer"
              >
                <WhatsAppOfficialIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span>+ WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => addLink('instagram')}
                className="px-2.5 py-1.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 hover:bg-pink-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 border border-pink-500/20 cursor-pointer"
              >
                <InstagramOfficialIcon className="w-3.5 h-3.5" withGradient />
                <span>+ Instagram</span>
              </button>

              <button
                type="button"
                onClick={() => addLink('tiktok')}
                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 border border-zinc-700/60 cursor-pointer"
              >
                <TikTokOfficialIcon className="w-3.5 h-3.5 text-white" />
                <span>+ TikTok</span>
              </button>

              <button
                type="button"
                onClick={() => addLink('reviews')}
                className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-zinc-700 shadow-2xs active:scale-95 cursor-pointer"
              >
                <GoogleOfficialIcon className="w-3.5 h-3.5" />
                <span>+ Reseñas</span>
              </button>

              {/* Botón rápido para desplegar si está plegado */}
              {!isAddLinksExpanded && (
                <button
                  type="button"
                  onClick={() => setIsAddLinksExpanded(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200/80 dark:border-blue-800/80 cursor-pointer shadow-2xs group"
                >
                  <span>+ Más redes (LinkedIn, X, Threads, Twitch...)</span>
                  <svg
                    className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:translate-y-0.5 transition-transform"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              )}

              {/* Redes y opciones adicionales desplegables */}
              {isAddLinksExpanded && (
                <>
                  <button
                    type="button"
                    onClick={() => addLink('linkedin')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] dark:text-[#3ea4f7] hover:bg-[#0A66C2]/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#0A66C2]/25 active:scale-95 cursor-pointer"
                  >
                    <LinkedinOfficialIcon className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>+ LinkedIn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('x')}
                    className="px-2.5 py-1.5 rounded-xl bg-black dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-zinc-700/60 active:scale-95 cursor-pointer"
                  >
                    <XOfficialIcon className="w-3.5 h-3.5 text-white" />
                    <span>+ X</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('threads')}
                    className="px-2.5 py-1.5 rounded-xl bg-black dark:bg-zinc-800 text-white hover:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-semibold transition-all flex items-center gap-1.5 border border-zinc-700/60 active:scale-95 cursor-pointer"
                  >
                    <ThreadsOfficialIcon className="w-3.5 h-3.5 text-white" />
                    <span>+ Threads</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('onlyfans')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#00AFF0]/10 text-[#0092c8] dark:text-[#00AFF0] hover:bg-[#00AFF0]/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#00AFF0]/30 active:scale-95 cursor-pointer"
                  >
                    <OnlyFansOfficialIcon className="w-3.5 h-3.5 text-[#00AFF0]" />
                    <span>+ OnlyFans</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('telegram')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#229ED9]/10 text-[#1b86ba] dark:text-[#229ED9] hover:bg-[#229ED9]/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#229ED9]/30 active:scale-95 cursor-pointer"
                  >
                    <TelegramOfficialIcon className="w-3.5 h-3.5 text-[#229ED9]" />
                    <span>+ Telegram</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('twitch')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#9146FF]/10 text-[#7c2ff0] dark:text-[#b482ff] hover:bg-[#9146FF]/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#9146FF]/30 active:scale-95 cursor-pointer"
                  >
                    <TwitchOfficialIcon className="w-3.5 h-3.5 text-[#9146FF]" />
                    <span>+ Twitch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('snapchat')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#FFFC00]/25 text-amber-900 dark:text-amber-200 hover:bg-[#FFFC00]/40 text-xs font-semibold transition-all flex items-center gap-1.5 border border-amber-400/40 active:scale-95 cursor-pointer"
                  >
                    <SnapchatOfficialIcon className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>+ Snapchat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('wechat')}
                    className="px-2.5 py-1.5 rounded-xl bg-[#07C160]/10 text-[#069a4d] dark:text-[#07C160] hover:bg-[#07C160]/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-[#07C160]/30 active:scale-95 cursor-pointer"
                  >
                    <WeChatOfficialIcon className="w-3.5 h-3.5 text-[#07C160]" />
                    <span>+ WeChat</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('facebook')}
                    className="px-2.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-blue-500/20 active:scale-95 cursor-pointer"
                  >
                    <FacebookOfficialIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>+ Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('youtube')}
                    className="px-2.5 py-1.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-red-500/20 active:scale-95 cursor-pointer"
                  >
                    <YouTubeOfficialIcon className="w-3.5 h-3.5 text-[#FF0000]" />
                    <span>+ YouTube</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('phone')}
                    className="px-2.5 py-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-xs font-semibold transition-all flex items-center gap-1.5 border border-sky-500/20 active:scale-95 cursor-pointer"
                  >
                    <PhoneSvg className="w-3.5 h-3.5" />
                    <span>+ Teléfono</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => addLink('website')}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-300/80 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-300 dark:border-zinc-700 active:scale-95 cursor-pointer"
                  >
                    <GlobeSvg className="w-3.5 h-3.5" />
                    <span>+ Sitio Web</span>
                  </button>

                  {/* Botón para volver a plegar */}
                  <button
                    type="button"
                    onClick={() => setIsAddLinksExpanded(false)}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-200/60 dark:bg-zinc-700/60 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>Plegar opciones</span>
                    <svg
                      className="w-3.5 h-3.5 rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Panel de Personalización de Botones de Enlace (Forma, Colores, Iconos) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/70 dark:from-zinc-900/80 dark:to-zinc-800/50 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                  Estilo de Botones e Iconos SVG
                </h4>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                100% Personalizable
              </span>
            </div>

            {/* 1. Forma de los Botones */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                Forma de los Botones:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'rounded', label: 'Redondeado', sub: 'Estándar', shapeClass: 'rounded-xl' },
                  { id: 'pill', label: 'Píldora', sub: 'Estilo Coach / Café', shapeClass: 'rounded-full' },
                  { id: 'none', label: 'Sin Contenedor', sub: 'Solo Iconos SVG', shapeClass: '' },
                  { id: 'tile', label: 'Azulejos Grid', sub: 'Estilo Bodas / Menú', shapeClass: 'rounded-xl' },
                ].map((opt) => {
                  const isSelected = (business.customization?.buttonShape || 'rounded') === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateCustomization('buttonShape', opt.id as ButtonShape)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs ring-1 ring-blue-500/40'
                          : 'border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                      }`}
                    >
                      {opt.id === 'none' ? (
                        <div className="w-8 h-4 flex items-center justify-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400 dark:bg-zinc-500'}`} />
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400 dark:bg-zinc-500'}`} />
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-400 dark:bg-zinc-500'}`} />
                        </div>
                      ) : (
                        <div className={`w-8 h-4 border-2 ${isSelected ? 'border-blue-600 bg-blue-500/30' : 'border-slate-400 dark:border-zinc-500'} ${opt.shapeClass}`} />
                      )}
                      <span className="text-xs">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">{opt.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Modo de Color de Iconos SVG */}
            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
                Colores de los Iconos SVG:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateCustomization('iconColorMode', 'official')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    (business.customization?.iconColorMode || 'official') === 'official'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs ring-1 ring-blue-500/40'
                      : 'border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs block font-bold">Colores Oficiales SVG</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">
                    WhatsApp verde, Instagram degradado, Google multicolor, etc.
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateCustomization('iconColorMode', 'monochrome')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    business.customization?.iconColorMode === 'monochrome'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs ring-1 ring-blue-500/40'
                      : 'border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs block font-bold">Personalizado / Monocromático</span>
                  <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-normal">
                    Aplica un color uniforme (dorado, verde neón, terracota, blanco)
                  </span>
                </button>
              </div>

              {/* Si eligió modo personalizado/monocromático para los iconos, mostrar selector de color */}
              {business.customization?.iconColorMode === 'monochrome' && (
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 block">
                      Color de Iconos SVG
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400">
                      Tinta unificada para todos los logotipos e iconos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={business.customization?.iconCustomColor || '#ffffff'}
                      onChange={(e) => updateCustomization('iconCustomColor', e.target.value)}
                      className="w-9 h-9 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-700 p-0.5"
                    />
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
                      {business.customization?.iconCustomColor || '#ffffff'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Nivel de Glasmorfismo de los Contenedores SVG */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    Nivel de Glasmorfismo (Efecto Vidrio):
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60">
                    {business.customization?.glassmorphism ?? 70}%
                  </span>
                  {business.customization?.glassmorphism !== undefined && business.customization?.glassmorphism !== 70 && (
                    <button
                      type="button"
                      onClick={() => updateCustomization('glassmorphism', 70)}
                      className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 underline"
                    >
                      Restablecer
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 w-14 text-left">
                  0% Sólido
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={business.customization?.glassmorphism ?? 70}
                  onChange={(e) => updateCustomization('glassmorphism', parseInt(e.target.value, 10))}
                  className="flex-1 accent-blue-600 h-2 bg-slate-200 dark:bg-zinc-700 rounded-lg cursor-pointer"
                />
                <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500 w-16 text-right">
                  100% Cristal
                </span>
              </div>

              <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                {business.customization?.buttonShape === 'none'
                  ? 'Modo Sin Contenedor: Regula directamente el nivel de transparencia de los SVG oficiales flotantes.'
                  : 'Ajusta la transparencia, el desenfoque traslúcido y el reflejo de cristal de los contenedores de los botones e iconos sobre tu fondo.'}
              </p>
            </div>

            {/* 4. Colores de Fondo y Texto del Botón */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    Fondo de Botones
                  </label>
                  {business.customization?.buttonBgColor && (
                    <button
                      type="button"
                      onClick={() => updateCustomization('buttonBgColor', '')}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Restablecer
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={business.customization?.buttonBgColor || '#ffffff'}
                    onChange={(e) => updateCustomization('buttonBgColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-700 p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                    {business.customization?.buttonBgColor || 'Por defecto'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                    Texto de Botones
                  </label>
                  {business.customization?.buttonTextColor && (
                    <button
                      type="button"
                      onClick={() => updateCustomization('buttonTextColor', '')}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Restablecer
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="color"
                    value={business.customization?.buttonTextColor || '#0f172a'}
                    onChange={(e) => updateCustomization('buttonTextColor', e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-zinc-700 p-0.5"
                  />
                  <span className="text-xs font-mono text-slate-600 dark:text-zinc-400">
                    {business.customization?.buttonTextColor || 'Por defecto'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Links list */}
          <div className="space-y-3">
            {business.links.map((link, idx) => {
              const isCustom = link.type === 'custom';
              const IconDisplay = getBusinessIconComponent(link.iconName);

              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    link.highlighted
                      ? 'border-amber-400/70 dark:border-amber-500/50 bg-amber-500/5 dark:bg-amber-950/15 shadow-sm'
                      : 'border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/50'
                  }`}
                >
                  {/* Card Header with Status & Action SVGs ONLY */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
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

                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono truncate">
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

                    {/* SVG Action Buttons WITHOUT TEXT */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => moveLink(idx, 'up')}
                        disabled={idx === 0}
                        title="Mover arriba"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-700 disabled:opacity-25 transition-colors"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveLink(idx, 'down')}
                        disabled={idx === business.links.length - 1}
                        title="Mover abajo"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-700 disabled:opacity-25 transition-colors"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Disket SVG (Save) */}
                      <button
                        type="button"
                        onClick={() => handleSaveLink(link.id)}
                        title={savedLinkId === link.id ? '¡Guardado con éxito!' : 'Guardar botón'}
                        className={`p-1.5 rounded-lg transition-all ${
                          savedLinkId === link.id
                            ? 'bg-emerald-500 text-white shadow-sm scale-110'
                            : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
                        }`}
                      >
                        {savedLinkId === link.id ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                      </button>

                      {/* Pencil SVG (Edit/Toggle details) */}
                      <button
                        type="button"
                        onClick={() => setEditingLinkId(editingLinkId === link.id ? null : link.id)}
                        title="Editar detalles"
                        className={`p-1.5 rounded-lg transition-colors ${
                          editingLinkId === link.id
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:hover:bg-zinc-700'
                        }`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {/* Trash2 SVG (Delete) */}
                      <button
                        type="button"
                        onClick={() => deleteLink(link.id)}
                        title="Eliminar botón"
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
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

                  {/* Link destination */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                        Destino del botón:
                      </label>

                      {isCustom && (
                        <div className="flex items-center gap-1.5">
                          {/* Hidden file inputs for image and doc upload */}
                          <input
                            id={`link-img-${link.id}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleLinkAssetUpload(link.id, 'image', e.target.files[0]);
                              }
                            }}
                          />
                          <input
                            id={`link-doc-${link.id}`}
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                handleLinkAssetUpload(link.id, 'doc', e.target.files[0]);
                              }
                            }}
                          />

                          {/* 1. URL button */}
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`url-input-${link.id}`);
                              input?.focus();
                            }}
                            title="Ingresar dirección web"
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 text-[10px] font-semibold transition-all border border-slate-200 dark:border-zinc-700"
                          >
                            <LinkIcon className="w-3 h-3 text-blue-500" />
                            <span>URL</span>
                          </button>

                          {/* 2. Subir Imagen button */}
                          <button
                            type="button"
                            onClick={() => document.getElementById(`link-img-${link.id}`)?.click()}
                            title="Subir foto o imagen para este botón"
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-[10px] font-semibold transition-all border border-purple-200/60 dark:border-purple-800/60 whitespace-nowrap"
                          >
                            <ImageIcon className="w-3 h-3 text-purple-500" />
                            <span>IMG</span>
                          </button>

                          {/* 3. Subir Documento button */}
                          <button
                            type="button"
                            onClick={() => document.getElementById(`link-doc-${link.id}`)?.click()}
                            title="Subir archivo PDF, catálogo o menú"
                            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-[10px] font-semibold transition-all border border-amber-200/60 dark:border-amber-800/60 whitespace-nowrap"
                          >
                            <FileText className="w-3 h-3 text-amber-500" />
                            <span>DOC</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <input
                      id={`url-input-${link.id}`}
                      type="text"
                      value={link.url}
                      onChange={(e) => updateLink(link.id, { url: e.target.value })}
                      placeholder={isCustom ? 'https://... o haz clic en Subir Imagen / Documento arriba' : 'https://...'}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-mono bg-white dark:bg-zinc-900"
                    />

                    {link.url && (link.url.startsWith('data:image') || link.url.includes('storage') || link.url.endsWith('.pdf')) && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-md border border-emerald-200/80 dark:border-emerald-900/60">
                        <Check className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Archivo adjunto listo y vinculado al botón</span>
                      </div>
                    )}
                  </div>

                  {/* ONLY FOR CUSTOM BUTTONS: Choose SVG icon via modal library & custom colors */}
                  {isCustom && (
                    <div className="pt-2 border-t border-slate-200/80 dark:border-zinc-700/80 space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 uppercase tracking-wider block">
                            Ícono SVG Personalizado:
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Abre la librería para elegir el ícono exacto de tu negocio
                          </span>
                        </div>

                        {/* Button that opens the SVG Icon Library Modal */}
                        <button
                          type="button"
                          onClick={() => {
                            setActivePickingLinkId(link.id);
                            setPickerModalOpen(true);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:border-blue-500 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-all shadow-xs self-start sm:self-auto"
                        >
                          <div className="w-5 h-5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <IconDisplay className="w-3.5 h-3.5" />
                          </div>
                          <span>Elegir Ícono SVG ({link.iconName || 'sparkles'})</span>
                        </button>
                      </div>

                      {/* Color Swatches */}
                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-zinc-800">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                          Color del botón:
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
                              Predeterminado
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Design & Media */}
      {activeTab === 'design' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 1. Foto de Fondo (Antes Portada) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-blue-600" />
                  Foto de Fondo
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  Imagen principal que envuelve el fondo de tu tarjeta (estilo Coach, Café, Bodas o Minimalista).
                </p>
              </div>
              {business.bannerUrl && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenExistingCropper('bannerUrl')}
                    title="Ajustar encuadre y zoom de foto de fondo"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Ajustar encuadre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('bannerUrl', '')}
                    title="Eliminar foto de fondo"
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Clickable Banner / Background Box */}
            <div
              onClick={() => bannerFileRef.current?.click()}
              className={`relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-blue-500 bg-slate-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer shadow-inner transition-all ${
                (business.customization?.backgroundMode || 'full') === 'full'
                  ? 'h-64 sm:h-72 max-w-xs mx-auto aspect-[9/16]'
                  : 'h-40 sm:h-44'
              }`}
            >
              {business.bannerUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={business.bannerUrl}
                    alt="Vista previa de foto de fondo"
                    className={`w-full h-full object-cover transition-transform group-hover:scale-105 duration-200 ${
                      (business.customization?.backgroundMode || 'full') === 'full'
                        ? 'object-top'
                        : 'object-[center_28%]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-xs font-bold drop-shadow">Cambiar foto de fondo</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 p-4 text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                    <Camera className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                    {(business.customization?.backgroundMode || 'full') === 'full'
                      ? 'Subir foto de fondo'
                      : 'Subir foto de portada'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 max-w-[220px]">
                    {(business.customization?.backgroundMode || 'full') === 'full'
                      ? 'Recomendado formato vertical (9:16) para toda la pantalla'
                      : 'Recomendado formato horizontal (16:9) para banner superior'}
                  </span>
                </div>
              )}
            </div>

            {/* Hidden Input file for Banner */}
            <input
              ref={bannerFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileSelected('bannerUrl', e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            {/* Configuración de Modo de Presentación */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 block">
                Modo de Presentación:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateCustomization('backgroundMode', 'full')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    (business.customization?.backgroundMode || 'full') === 'full'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs ring-1 ring-blue-500/30'
                      : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                  }`}
                >
                  Fondo Completo
                </button>
                <button
                  type="button"
                  onClick={() => updateCustomization('backgroundMode', 'banner')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    business.customization?.backgroundMode === 'banner'
                      ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-bold shadow-xs ring-1 ring-blue-500/30'
                      : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:border-slate-300'
                  }`}
                >
                  Banner Superior
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-0.5">
                {(business.customization?.backgroundMode || 'full') === 'full'
                  ? '📱 Fondo Completo: la imagen vertical cubrirá toda la pantalla de la tarjeta móvil sin recortes.'
                  : '🖼️ Banner Superior: se mostrará como encabezado panorámico con avatar superpuesto.'}
              </p>
            </div>

            <div className="flex items-center justify-end text-[11px] text-slate-400 pt-0.5">
              <button
                type="button"
                onClick={() => setShowBannerUrlInput(!showBannerUrlInput)}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 underline"
              >
                {showBannerUrlInput ? 'Ocultar URL' : 'O pegar URL'}
              </button>
            </div>

            {/* Optional URL input toggle */}
            {showBannerUrlInput && (
              <div className="pt-1 animate-in fade-in duration-150">
                <input
                  type="text"
                  value={business.bannerUrl}
                  onChange={(e) => updateField('bannerUrl', e.target.value)}
                  placeholder="https://ejemplo.com/fondo.jpg"
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
                  Foto de Perfil
                </h4>
              </div>
              {business.logoUrl && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenExistingCropper('logoUrl')}
                    title="Ajustar encuadre y zoom de perfil"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5" />
                    <span>Ajustar encuadre</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField('logoUrl', '')}
                    title="Eliminar foto de perfil"
                    className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Circular Preview directly clickable with internal text */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div
                onClick={() => logoFileRef.current?.click()}
                className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-purple-500 bg-slate-100 dark:bg-zinc-900 overflow-hidden flex flex-col items-center justify-center flex-shrink-0 shadow-md group cursor-pointer transition-all p-2 text-center"
              >
                {business.logoUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={business.logoUrl}
                      alt="Logo circular preview"
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
                    />
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1">
                      <Camera className="w-4 h-4 mb-0.5" />
                      <span className="text-[8px] font-bold text-center leading-tight">Cambiar foto</span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 dark:text-zinc-400 p-1 text-center">
                    <Camera className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-1" />
                    <span className="text-[9px] font-bold leading-tight text-slate-800 dark:text-zinc-200">
                      Subir foto
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                {/* Hidden Input file for Logo */}
                <input
                  ref={logoFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileSelected('logoUrl', e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />

                {/* Smart Background Sync Toggle */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/60 dark:border-purple-900/40 text-left">
                    <input
                      type="checkbox"
                      checked={autoSyncCover}
                      onChange={(e) => setAutoSyncCover(e.target.checked)}
                      className="rounded border-slate-300 dark:border-zinc-700 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 text-[11px]">
                      <span className="font-bold text-slate-800 dark:text-zinc-200 block">
                        Fondo Inteligente Automático
                      </span>
                      <span className="text-slate-500 dark:text-zinc-400 block text-[10px]">
                        Al subir tu foto de perfil, se adaptará como fondo de tarjeta automáticamente.
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowLogoUrlInput(!showLogoUrlInput)}
                    className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-zinc-300 underline"
                  >
                    {showLogoUrlInput ? 'Ocultar URL' : 'O pegar URL directa'}
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
        </div>
      )}

      {/* TAB 4: Physical NFC Cards & Official QR for Printing (Super Admin Only) */}
      {isSuperAdmin && activeTab === 'cards' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Card Link Form */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5 mb-1">
              <Smartphone className="w-4 h-4 text-blue-600" />
              Vincular Nuevo Chip NFC Físico
            </h4>
            <p className="text-[11px] text-blue-700 dark:text-blue-400 mb-3">
              Ingresa el código alfanumérico grabado en tu tarjeta física NFC para activarla de inmediato.
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
                type="button"
                onClick={handleAddCard}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Vincular Tarjeta
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
              Chips NFC Registrados ({business.cards?.length || 0}):
            </span>

            {(business.cards || []).length === 0 ? (
              <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 text-center text-xs text-slate-400">
                Aún no has registrado tarjetas o chips NFC físicos.
              </div>
            ) : (
              (business.cards || []).map((card) => (
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
                      type="button"
                      onClick={() => toggleCardStatus(card.id)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300"
                    >
                      {card.status === 'ACTIVE' ? 'Pausar' : 'Reactivar'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ITEM 9: Official QR for physical cards and exhibitor printing directly below registered NFC codes */}
          <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex-shrink-0">
                {qrPng ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrPng}
                      alt="QR Oficial"
                      className="w-32 h-32 object-contain"
                    />
                  </>
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center text-xs text-slate-400">
                    Generando QR...
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Código QR Oficial para Tarjetas y Exhibidores</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Este código QR enlaza directamente a tu perfil público y es el que se imprime o graba en tus tarjetas físicas y exhibidores de mostrador.
                </p>

                <div className="inline-block px-3 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 text-[11px] font-mono text-slate-700 dark:text-zinc-300 break-all">
                  {profileUrl}
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-all active:scale-95"
                  >
                    {copiedQr ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedQr ? 'Copiado' : 'Copiar'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Icon Picker Modal for custom business buttons */}
      <IconPickerModal
        isOpen={pickerModalOpen}
        selectedIconId={business.links.find((l) => l.id === activePickingLinkId)?.iconName}
        onSelect={(iconId) => {
          if (activePickingLinkId) {
            updateLink(activePickingLinkId, { iconName: iconId });
          }
        }}
        onClose={() => {
          setPickerModalOpen(false);
          setActivePickingLinkId(null);
        }}
      />

      {/* Image Cropper Modal for Banner & Logo */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        cropType={cropperType}
        title={
          cropperField === 'logoUrl'
            ? 'Ajustar Foto de Perfil / Logo'
            : (business.customization?.backgroundMode === 'banner'
                ? 'Ajustar Portada (Banner 16:9)'
                : 'Ajustar Foto de Fondo (Vertical 9:16)')
        }
        onConfirm={handleCropperConfirm}
        onClose={() => {
          setCropperOpen(false);
          setCropperImageSrc('');
        }}
      />
    </div>
  );
}
