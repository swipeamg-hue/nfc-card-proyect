'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { BusinessLink } from '@/types/business';
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
  onTrackClick?: (linkId: string, linkType: string) => void;
}

export function ActionCard({ link, onTrackClick }: ActionCardProps) {
  if (!link.isActive) return null;

  // Visual configuration for each channel type or custom icon
  const getTheme = () => {
    // 1. Redes sociales con SVGs OFICIALES
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

    // 2. Comunicación y utilidades básicas (SVGs)
    if (link.type === 'phone' || link.iconName === 'phone') {
      return {
        icon: <PhoneSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#2563EB]',
        borderHover: 'hover:border-blue-300',
      };
    }
    if (link.type === 'website' || link.iconName === 'globe') {
      return {
        icon: <GlobeSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-gradient-to-r from-sky-600 to-cyan-500',
        borderHover: 'hover:border-cyan-300',
      };
    }
    if (link.type === 'maps' || link.iconName === 'map-pin') {
      return {
        icon: <MapPinSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-rose-500',
        borderHover: 'hover:border-rose-300',
      };
    }
    if (link.type === 'catalog' || link.iconName === 'file-text') {
      return {
        icon: <FileTextSvg className="w-5 h-5 text-white" />,
        bgClass: 'bg-amber-600',
        borderHover: 'hover:border-amber-300',
      };
    }

    // 3. Servicios y botones temáticos con SVGs dedicados
    const iconName = link.iconName || '';
    const DynamicIcon = getBusinessIconComponent(iconName);
    const iconElement = <DynamicIcon className="w-5 h-5 text-white" />;
    let defaultBg = 'bg-slate-700';
    let defaultBorder = 'hover:border-slate-400';

    if (link.type === 'menu' || iconName === 'utensils') {
      defaultBg = 'bg-gradient-to-r from-amber-500 to-orange-500';
      defaultBorder = 'hover:border-amber-400';
    } else if (link.type === 'booking' || iconName === 'calendar') {
      defaultBg = 'bg-gradient-to-r from-violet-600 to-indigo-600';
      defaultBorder = 'hover:border-purple-300';
    } else if (iconName === 'sparkles') {
      defaultBg = 'bg-gradient-to-r from-pink-500 to-rose-500';
      defaultBorder = 'hover:border-pink-300';
    } else if (iconName === 'scissors') {
      defaultBg = 'bg-gradient-to-r from-rose-500 to-pink-600';
      defaultBorder = 'hover:border-rose-300';
    } else if (iconName === 'coffee') {
      defaultBg = 'bg-gradient-to-r from-amber-700 to-yellow-800';
      defaultBorder = 'hover:border-amber-400';
    } else if (iconName === 'shopping-bag') {
      defaultBg = 'bg-gradient-to-r from-emerald-600 to-teal-600';
      defaultBorder = 'hover:border-emerald-300';
    } else if (iconName === 'star') {
      defaultBg = 'bg-gradient-to-r from-amber-400 to-yellow-500';
      defaultBorder = 'hover:border-yellow-300';
    } else if (iconName === 'clock') {
      defaultBg = 'bg-gradient-to-r from-blue-600 to-indigo-600';
      defaultBorder = 'hover:border-blue-300';
    } else if (iconName === 'credit-card') {
      defaultBg = 'bg-slate-800';
      defaultBorder = 'hover:border-slate-500';
    }

    // Apply customColor if user specifically selected one
    if (link.customColor === 'amber') {
      defaultBg = 'bg-gradient-to-r from-amber-500 to-orange-500';
      defaultBorder = 'hover:border-amber-400';
    } else if (link.customColor === 'purple') {
      defaultBg = 'bg-gradient-to-r from-violet-600 to-purple-600';
      defaultBorder = 'hover:border-purple-300';
    } else if (link.customColor === 'pink') {
      defaultBg = 'bg-gradient-to-r from-pink-500 to-rose-500';
      defaultBorder = 'hover:border-pink-300';
    } else if (link.customColor === 'emerald') {
      defaultBg = 'bg-gradient-to-r from-emerald-500 to-teal-600';
      defaultBorder = 'hover:border-emerald-300';
    } else if (link.customColor === 'blue') {
      defaultBg = 'bg-gradient-to-r from-blue-600 to-cyan-600';
      defaultBorder = 'hover:border-blue-300';
    } else if (link.customColor === 'rose') {
      defaultBg = 'bg-gradient-to-r from-rose-500 to-red-600';
      defaultBorder = 'hover:border-rose-300';
    } else if (link.customColor === 'dark') {
      defaultBg = 'bg-zinc-800';
      defaultBorder = 'hover:border-zinc-500';
    }

    return {
      icon: iconElement,
      bgClass: defaultBg,
      borderHover: defaultBorder,
    };
  };

  const theme = getTheme();

  const handleClick = () => {
    if (onTrackClick) {
      onTrackClick(link.id, link.type);
    }
  };

  return (
    <a
      href={link.url}
      target={link.url.startsWith('tel:') || link.url.startsWith('mailto:') ? '_self' : '_blank'}
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative flex items-center justify-between p-3.5 bg-white/90 dark:bg-zinc-900/85 backdrop-blur-md rounded-2xl border ${
        link.highlighted
          ? 'border-amber-400/60 dark:border-amber-500/40 shadow-sm ring-1 ring-amber-400/20'
          : 'border-slate-100 dark:border-zinc-800 shadow-sm'
      } transition-all duration-200 hover:shadow-md ${theme.borderHover} active:scale-95 cursor-pointer`}
    >
      <div className="flex items-center gap-3.5 overflow-hidden">
        {/* Themed Icon Box */}
        <div
          className={`w-11 h-11 rounded-xl ${theme.bgClass} flex items-center justify-center flex-shrink-0 shadow-sm transition-transform duration-200 group-hover:scale-105`}
        >
          {theme.icon}
        </div>

        {/* Labels */}
        <div className="flex flex-col text-left truncate">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate tracking-tight">
              {link.title}
            </span>
            {link.highlighted && (
              <span className="flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
                ★ Destacado
              </span>
            )}
          </div>
          {link.subtitle && (
            <span className="text-xs text-slate-500 dark:text-zinc-400 truncate mt-0.5">
              {link.subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Right Chevron */}
      <div className="flex items-center text-slate-300 dark:text-zinc-600 group-hover:text-slate-500 dark:group-hover:text-zinc-400 transition-colors flex-shrink-0 pl-2">
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </a>
  );
}
