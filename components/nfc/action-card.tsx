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

  // Visual configuration for each channel type
  const getTheme = () => {
    switch (link.type) {
      case 'whatsapp':
        return {
          icon: <MessageCircle className="w-5 h-5 text-white fill-white" />,
          bgClass: 'bg-[#25D366]',
          borderHover: 'hover:border-emerald-300',
        };
      case 'phone':
        return {
          icon: <Phone className="w-5 h-5 text-white" />,
          bgClass: 'bg-[#2563EB]',
          borderHover: 'hover:border-blue-300',
        };
      case 'instagram':
        return {
          icon: <InstagramIcon className="w-5 h-5 text-white" />,
          bgClass: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]',
          borderHover: 'hover:border-pink-300',
        };
      case 'facebook':
        return {
          icon: <FacebookIcon className="w-5 h-5 text-white" />,
          bgClass: 'bg-[#1877F2]',
          borderHover: 'hover:border-sky-300',
        };
      case 'linkedin':
        return {
          icon: <LinkedinIcon className="w-5 h-5 text-white" />,
          bgClass: 'bg-[#0A66C2]',
          borderHover: 'hover:border-blue-400',
        };
      case 'website':
        return {
          icon: <Globe className="w-5 h-5 text-white" />,
          bgClass: 'bg-gradient-to-r from-sky-600 to-cyan-500',
          borderHover: 'hover:border-cyan-300',
        };
      case 'catalog':
        return {
          icon: <FileText className="w-5 h-5 text-white" />,
          bgClass: 'bg-amber-600',
          borderHover: 'hover:border-amber-300',
        };
      case 'email':
        return {
          icon: <Mail className="w-5 h-5 text-white" />,
          bgClass: 'bg-indigo-600',
          borderHover: 'hover:border-indigo-300',
        };
      case 'maps':
        return {
          icon: <MapPin className="w-5 h-5 text-white" />,
          bgClass: 'bg-red-500',
          borderHover: 'hover:border-red-300',
        };
      default:
        return {
          icon: <ExternalLink className="w-5 h-5 text-white" />,
          bgClass: 'bg-slate-700',
          borderHover: 'hover:border-slate-400',
        };
    }
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
      className={`group relative flex items-center justify-between p-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 shadow-sm transition-all duration-200 hover:shadow-md ${theme.borderHover} active:scale-95 cursor-pointer`}
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
          <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate tracking-tight">
            {link.title}
          </span>
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
