'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BusinessLink, CardCustomization, ButtonShape, IconColorMode } from '@/types/business';
import {
  WhatsAppOfficialIcon,
  InstagramOfficialIcon,
  FacebookOfficialIcon,
  LinkedinOfficialIcon,
  TikTokOfficialIcon,
  XOfficialIcon,
  YouTubeOfficialIcon,
  TelegramOfficialIcon,
  FileTextSvg,
  GlobeSvg,
  PhoneSvg,
  MapPinSvg,
  GoogleOfficialIcon,
} from '@/components/ui/svg-icons';
import { getBusinessIconComponent } from '@/components/ui/business-icons';

interface ActionCardProps {
  link: BusinessLink;
  globalCustomization?: CardCustomization;
  onTrackClick?: (linkId: string, linkType: string) => void;
}

export function ActionCard({ link, globalCustomization, onTrackClick }: ActionCardProps) {
  if (!link.isActive) return null;

  // Determine active shape, typography and icon color mode
  const shape: ButtonShape = link.shape || globalCustomization?.buttonShape || 'rounded';
  const iconMode: IconColorMode = link.iconColorMode || globalCustomization?.iconColorMode || 'official';
  const iconCustomColor = link.iconColor || globalCustomization?.iconCustomColor;
  const iconBgColor = globalCustomization?.iconBgColor;
  const activeFont = globalCustomization?.customFontName || globalCustomization?.fontFamily;

  // Button background and text color styling
  const customBg = link.buttonBgColor || globalCustomization?.buttonBgColor;
  const customTextColor = link.buttonTextColor || globalCustomization?.buttonTextColor;
  const customBorderColor = globalCustomization?.buttonBorderColor;

  // Glassmorphism calculation (0 = 100% solid flat, 100 = crystal frosted glass)
  const glassLevel = typeof globalCustomization?.glassmorphism === 'number' ? globalCustomization.glassmorphism : 70;
  const t = Math.max(0, Math.min(100, glassLevel)) / 100; // 0 to 1

  // Dynamic blur and background styling
  const blurPx = Math.round(t * 22); // 0px to 22px blur
  const bgOpacity = (0.95 - t * 0.70).toFixed(2); // 0.95 down to 0.25
  const borderOpacity = (0.08 + t * 0.28).toFixed(2); // 0.08 up to 0.36

  let containerBg = customBg;
  if (!containerBg) {
    containerBg = `rgba(15, 23, 42, ${bgOpacity})`;
  } else if (containerBg.startsWith('#') && containerBg.length === 7) {
    const r = parseInt(containerBg.slice(1, 3), 16);
    const g = parseInt(containerBg.slice(3, 5), 16);
    const b = parseInt(containerBg.slice(5, 7), 16);
    containerBg = `rgba(${r}, ${g}, ${b}, ${bgOpacity})`;
  }

  const containerStyle: React.CSSProperties = {
    backgroundColor: containerBg,
    color: customTextColor,
    borderColor: customBorderColor || (t > 0.05 ? `rgba(255, 255, 255, ${borderOpacity})` : undefined),
    backdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(${100 + Math.round(t * 60)}%)` : 'none',
    WebkitBackdropFilter: blurPx > 0 ? `blur(${blurPx}px) saturate(${100 + Math.round(t * 60)}%)` : 'none',
    boxShadow: t > 0.1
      ? `0 6px 24px 0 rgba(0, 0, 0, ${(0.06 + t * 0.20).toFixed(2)}), inset 0 1px 1px 0 rgba(255, 255, 255, ${(t * 0.32).toFixed(2)})`
      : undefined,
    fontFamily: activeFont ? `"${activeFont}", sans-serif` : undefined,
  };

  // Visual configuration for each channel type or custom icon
  const getTheme = () => {
    // Si el usuario eligió modo monocromático o personalizado para los iconos
    if (iconMode === 'monochrome' || iconMode === 'custom') {
      const FallbackIcon = getBusinessIconComponent(link.iconName);
      let rawIcon = <FallbackIcon className="w-5 h-5" />;

      if (link.type === 'whatsapp' || link.iconName === 'whatsapp') rawIcon = <WhatsAppOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'instagram' || link.iconName === 'instagram') rawIcon = <InstagramOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'facebook' || link.iconName === 'facebook') rawIcon = <FacebookOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'linkedin' || link.iconName === 'linkedin') rawIcon = <LinkedinOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'tiktok' || link.iconName === 'tiktok') rawIcon = <TikTokOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'youtube' || link.iconName === 'youtube') rawIcon = <YouTubeOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'x' || link.iconName === 'x') rawIcon = <XOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'telegram' || link.iconName === 'telegram') rawIcon = <TelegramOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'reviews' || link.iconName === 'google') rawIcon = <GoogleOfficialIcon className="w-5 h-5" />;
      else if (link.type === 'phone' || link.iconName === 'phone') rawIcon = <PhoneSvg className="w-5 h-5" />;
      else if (link.type === 'maps' || link.iconName === 'map-pin') rawIcon = <MapPinSvg className="w-5 h-5" />;
      else if (link.type === 'catalog' || link.type === 'menu') rawIcon = <FileTextSvg className="w-5 h-5" />;
      else if (link.type === 'website' || link.iconName === 'globe') rawIcon = <GlobeSvg className="w-5 h-5" />;

      return {
        icon: <div style={{ color: iconCustomColor || '#ffffff' }}>{rawIcon}</div>,
        bgClass: iconBgColor ? '' : 'bg-slate-900/60 dark:bg-white/10',
        customBgColor: iconBgColor || `rgba(255, 255, 255, ${(0.06 + t * 0.12).toFixed(2)})`,
        borderHover: 'hover:border-slate-300 dark:hover:border-zinc-500',
      };
    }

    // MODO OFICIAL: SVGs con sus colores de identidad corporativa
    if (link.type === 'whatsapp' || link.iconName === 'whatsapp') {
      return {
        icon: <WhatsAppOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#25D366]',
        borderHover: 'hover:border-emerald-300',
      };
    }
    if (link.type === 'instagram' || link.iconName === 'instagram') {
      return {
        icon: <InstagramOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
        borderHover: 'hover:border-pink-300',
      };
    }
    if (link.type === 'facebook' || link.iconName === 'facebook') {
      return {
        icon: <FacebookOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#1877F2]',
        borderHover: 'hover:border-sky-300',
      };
    }
    if (link.type === 'linkedin' || link.iconName === 'linkedin') {
      return {
        icon: <LinkedinOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#0A66C2]',
        borderHover: 'hover:border-blue-400',
      };
    }
    if (link.type === 'tiktok' || link.iconName === 'tiktok') {
      return {
        icon: <TikTokOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-black',
        borderHover: 'hover:border-zinc-400',
      };
    }
    if (link.type === 'youtube' || link.iconName === 'youtube') {
      return {
        icon: <YouTubeOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#FF0000]',
        borderHover: 'hover:border-red-300',
      };
    }
    if (link.type === 'x' || link.iconName === 'x') {
      return {
        icon: <XOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-black',
        borderHover: 'hover:border-zinc-400',
      };
    }
    if (link.type === 'telegram' || link.iconName === 'telegram') {
      return {
        icon: <TelegramOfficialIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#229ED9]',
        borderHover: 'hover:border-sky-300',
      };
    }
    if (link.type === 'reviews' || link.iconName === 'google' || link.iconName === 'google-review') {
      return {
        icon: <GoogleOfficialIcon className="w-5 h-5" />,
        bgClass: 'bg-white shadow-xs border border-slate-200 dark:border-zinc-700',
        borderHover: 'hover:border-blue-400',
      };
    }

    if (link.type === 'phone' || link.iconName === 'phone') {
      return {
        icon: <PhoneSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-blue-600',
        borderHover: 'hover:border-blue-300',
      };
    }
    if (link.type === 'maps' || link.iconName === 'map-pin') {
      return {
        icon: <MapPinSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-rose-500',
        borderHover: 'hover:border-rose-300',
      };
    }
    if (link.type === 'catalog' || link.type === 'menu' || link.iconName === 'file-text') {
      return {
        icon: <FileTextSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-amber-600',
        borderHover: 'hover:border-amber-300',
      };
    }
    if (link.type === 'website' || link.iconName === 'globe') {
      return {
        icon: <GlobeSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-cyan-600',
        borderHover: 'hover:border-cyan-300',
      };
    }

    const IconComp = getBusinessIconComponent(link.iconName);
    return {
      icon: <IconComp className="w-5 h-5 text-white" />,
      bgClass: 'bg-slate-800',
      borderHover: 'hover:border-slate-500',
    };
  };

  const theme = getTheme();

  const handleClick = () => {
    if (onTrackClick) {
      onTrackClick(link.id, link.type);
    }
  };

  // Base shape radius classes
  const shapeClasses = {
    rounded: 'rounded-2xl p-3.5',
    pill: 'rounded-full px-5 py-3.5',
    square: 'rounded-lg p-3.5',
    tile: 'rounded-2xl p-3.5 flex flex-col items-center justify-center text-center aspect-square gap-2',
    circle: 'rounded-2xl p-3.5',
  }[shape];

  const iconBoxStyle: React.CSSProperties = {
    backgroundColor: (theme as { customBgColor?: string }).customBgColor || undefined,
    backdropFilter: blurPx > 0 ? `blur(${Math.round(blurPx * 0.5)}px)` : undefined,
    WebkitBackdropFilter: blurPx > 0 ? `blur(${Math.round(blurPx * 0.5)}px)` : undefined,
    border: t > 0.15 ? `1px solid rgba(255, 255, 255, ${(0.05 + t * 0.20).toFixed(2)})` : undefined,
  };

  // Specific layout for TILE shape (Cuadrícula tipo Invitación de Bodas o Menú Iconográfico)
  if (shape === 'tile') {
    return (
      <a
        href={link.url}
        target={link.url.startsWith('tel:') || link.url.startsWith('mailto:') ? '_self' : '_blank'}
        rel="noopener noreferrer"
        onClick={handleClick}
        style={containerStyle}
        className={`group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border ${
          link.highlighted ? 'ring-2 ring-amber-400 shadow-md' : 'shadow-xs'
        } transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer text-center min-h-[96px]`}
      >
        <div
          style={iconBoxStyle}
          className={`w-11 h-11 rounded-xl ${theme.bgClass} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-110 mb-1`}
        >
          {theme.icon}
        </div>
        <span
          style={{
            color: customTextColor,
            fontFamily: activeFont ? `"${activeFont}", sans-serif` : undefined,
          }}
          className="text-xs font-bold text-slate-900 dark:text-zinc-100 line-clamp-1 tracking-tight"
        >
          {link.title}
        </span>
        {link.subtitle && (
          <span
            style={{
              color: customTextColor ? `${customTextColor}aa` : undefined,
              fontFamily: activeFont ? `"${activeFont}", sans-serif` : undefined,
            }}
            className="text-[10px] text-slate-500 dark:text-zinc-400 line-clamp-1"
          >
            {link.subtitle}
          </span>
        )}
      </a>
    );
  }

  // Standard row layouts (Rounded, Pill, Square, Circle)
  return (
    <a
      href={link.url}
      target={link.url.startsWith('tel:') || link.url.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={handleClick}
      style={containerStyle}
      className={`group relative flex items-center justify-between ${shapeClasses} border ${
        link.highlighted
          ? 'border-amber-400/60 dark:border-amber-500/40 shadow-sm ring-1 ring-amber-400/20'
          : ''
      } transition-all duration-200 hover:shadow-md ${theme.borderHover} active:scale-98 cursor-pointer`}
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        {/* Themed Icon Box */}
        <div
          style={iconBoxStyle}
          className={`w-11 h-11 ${shape === 'pill' ? 'rounded-full' : 'rounded-xl'} ${
            theme.bgClass
          } flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}
        >
          {theme.icon}
        </div>

        {/* Labels */}
        <div className="flex flex-col text-left truncate">
          <div className="flex items-center gap-1.5 truncate">
            <span
              style={{
                color: customTextColor,
                fontFamily: activeFont ? `"${activeFont}", sans-serif` : undefined,
              }}
              className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate tracking-tight"
            >
              {link.title}
            </span>
            {link.highlighted && (
              <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                ★ Destacado
              </span>
            )}
          </div>
          {link.subtitle && (
            <span
              style={{
                color: customTextColor ? `${customTextColor}b3` : undefined,
                fontFamily: activeFont ? `"${activeFont}", sans-serif` : undefined,
              }}
              className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5"
            >
              {link.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right Chevron */}
      <div
        style={{ color: customTextColor ? `${customTextColor}88` : undefined }}
        className="flex items-center text-slate-300 dark:text-zinc-600 group-hover:text-slate-500 dark:group-hover:text-zinc-400 transition-colors flex-shrink-0 pl-2"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>
  );
}
