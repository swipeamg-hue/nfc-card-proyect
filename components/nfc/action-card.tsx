'use client';

import React from 'react';
import {
  Phone,
  MessageCircle,
  Globe,
  FileText,
  Mail,
  MapPin,
  ChevronRight,
  ExternalLink,
  Utensils,
  Calendar,
  Sparkles,
  Scissors,
  Coffee,
  ShoppingBag,
  Star,
  Clock,
  CreditCard,
  Heart,
  BookOpen,
} from 'lucide-react';
import { BusinessLink } from '@/types/business';

// Clean standard brand SVG icons
function InstagramIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  );
}

function LinkedinIcon({ className = 'w-5 h-5 text-white' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
    </svg>
  );
}

interface ActionCardProps {
  link: BusinessLink;
  onTrackClick?: (linkId: string, linkType: string) => void;
}

export function ActionCard({ link, onTrackClick }: ActionCardProps) {
  if (!link.isActive) return null;

  // Visual configuration for each channel type or custom icon
  const getTheme = () => {
    // If standard social / communication types
    if (link.type === 'whatsapp') {
      return {
        icon: <MessageCircle className="w-5 h-5 text-white fill-white" />,
        bgClass: 'bg-[#25D366]',
        borderHover: 'hover:border-emerald-300',
      };
    }
    if (link.type === 'phone') {
      return {
        icon: <Phone className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#2563EB]',
        borderHover: 'hover:border-blue-300',
      };
    }
    if (link.type === 'instagram') {
      return {
        icon: <InstagramIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
        borderHover: 'hover:border-pink-300',
      };
    }
    if (link.type === 'facebook') {
      return {
        icon: <FacebookIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#1877F2]',
        borderHover: 'hover:border-sky-300',
      };
    }
    if (link.type === 'linkedin') {
      return {
        icon: <LinkedinIcon className="w-5 h-5 text-white" />,
        bgClass: 'bg-[#0A66C2]',
        borderHover: 'hover:border-blue-400',
      };
    }
    if (link.type === 'website') {
      return {
        icon: <Globe className="w-5 h-5 text-white" />,
        bgClass: 'bg-gradient-to-r from-sky-600 to-cyan-500',
        borderHover: 'hover:border-cyan-300',
      };
    }
    if (link.type === 'catalog') {
      return {
        icon: <FileText className="w-5 h-5 text-white" />,
        bgClass: 'bg-amber-600',
        borderHover: 'hover:border-amber-300',
      };
    }
    if (link.type === 'email') {
      return {
        icon: <Mail className="w-5 h-5 text-white" />,
        bgClass: 'bg-indigo-600',
        borderHover: 'hover:border-indigo-300',
      };
    }
    if (link.type === 'maps') {
      return {
        icon: <MapPin className="w-5 h-5 text-white" />,
        bgClass: 'bg-red-500',
        borderHover: 'hover:border-red-300',
      };
    }

    // Dynamic resolution based on iconName or custom presets
    const iconName = link.iconName || '';
    let iconElement = <ExternalLink className="w-5 h-5 text-white" />;
    let defaultBg = 'bg-slate-700';
    let defaultBorder = 'hover:border-slate-400';

    if (link.type === 'menu' || iconName === 'utensils') {
      iconElement = <Utensils className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-amber-500 to-orange-500';
      defaultBorder = 'hover:border-amber-400';
    } else if (link.type === 'booking' || iconName === 'calendar') {
      iconElement = <Calendar className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-violet-600 to-indigo-600';
      defaultBorder = 'hover:border-purple-300';
    } else if (iconName === 'sparkles') {
      iconElement = <Sparkles className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-pink-500 to-rose-500';
      defaultBorder = 'hover:border-pink-300';
    } else if (iconName === 'scissors') {
      iconElement = <Scissors className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-rose-500 to-pink-600';
      defaultBorder = 'hover:border-rose-300';
    } else if (iconName === 'coffee') {
      iconElement = <Coffee className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-amber-700 to-yellow-800';
      defaultBorder = 'hover:border-amber-400';
    } else if (iconName === 'shopping-bag') {
      iconElement = <ShoppingBag className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-emerald-600 to-teal-600';
      defaultBorder = 'hover:border-emerald-300';
    } else if (iconName === 'star') {
      iconElement = <Star className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-amber-400 to-yellow-500';
      defaultBorder = 'hover:border-yellow-300';
    } else if (iconName === 'clock') {
      iconElement = <Clock className="w-5 h-5 text-white" />;
      defaultBg = 'bg-gradient-to-r from-blue-600 to-indigo-600';
      defaultBorder = 'hover:border-blue-300';
    } else if (iconName === 'credit-card') {
      iconElement = <CreditCard className="w-5 h-5 text-white" />;
      defaultBg = 'bg-slate-800';
      defaultBorder = 'hover:border-slate-500';
    } else if (iconName === 'heart') {
      iconElement = <Heart className="w-5 h-5 text-white fill-white" />;
      defaultBg = 'bg-rose-500';
      defaultBorder = 'hover:border-rose-300';
    } else if (iconName === 'file-text') {
      iconElement = <FileText className="w-5 h-5 text-white" />;
      defaultBg = 'bg-amber-600';
      defaultBorder = 'hover:border-amber-300';
    } else if (iconName === 'book-open') {
      iconElement = <BookOpen className="w-5 h-5 text-white" />;
      defaultBg = 'bg-teal-600';
      defaultBorder = 'hover:border-teal-300';
    } else if (iconName === 'globe') {
      iconElement = <Globe className="w-5 h-5 text-white" />;
      defaultBg = 'bg-sky-600';
      defaultBorder = 'hover:border-sky-300';
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
      className={`group relative flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border ${
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
