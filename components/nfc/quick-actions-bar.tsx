'use client';

import React from 'react';
import { MailSvg, MapPinSvg, FileTextSvg } from '@/components/ui/svg-icons';
import { Business } from '@/types/business';

interface QuickActionsBarProps {
  business: Business;
  onTrackAction?: (actionName: string) => void;
}

export function QuickActionsBar({ business, onTrackAction }: QuickActionsBarProps) {
  const actions = [
    {
      id: 'email',
      label: 'Correo',
      icon: <MailSvg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      url: `mailto:${business.email}`,
      available: !!business.email,
    },
    {
      id: 'maps',
      label: 'Ubicación',
      icon: <MapPinSvg className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      url: business.googleMapsUrl || `https://maps.google.com/?q=${encodeURIComponent(business.address || '')}`,
      available: !!(business.googleMapsUrl || business.address),
    },
    {
      id: 'catalog',
      label: 'Catálogo / PDF',
      icon: <FileTextSvg className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      url: business.catalogUrl || '#',
      available: !!business.catalogUrl,
    },
  ];

  return (
    <div className="w-full mt-4 pt-4 border-t border-slate-200/80 dark:border-zinc-800">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-2.5 text-center">
        Accesos Rápidos Directos
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {actions.map((act) => {
          if (!act.available) return null;
          return (
            <a
              key={act.id}
              href={act.url}
              target={act.url.startsWith('mailto:') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              onClick={() => onTrackAction?.(act.id)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow transition-all duration-200 active:scale-95 text-center group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
                {act.icon}
              </div>
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                {act.label}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
