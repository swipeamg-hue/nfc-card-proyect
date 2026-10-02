'use client';

import React from 'react';
import { Check, ShieldCheck } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  isVerified?: boolean;
  category?: string;
  bio?: string;
  fontFamily?: string;
}

export function ProfileHeader({
  name,
  isVerified = true,
  category,
  bio,
  fontFamily,
}: ProfileHeaderProps) {
  const fontStyle = fontFamily ? { fontFamily: `"${fontFamily}", sans-serif` } : undefined;

  return (
    <div className="flex flex-col items-center text-center mt-3 px-4" style={fontStyle}>
      {/* Name with Verified Badge */}
      <div className="inline-flex items-center gap-1.5 justify-center flex-wrap">
        <h1
          style={fontStyle}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white"
        >
          {name}
        </h1>
        {isVerified && (
          <span
            title="Negocio Verificado Oficial"
            className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white shadow-sm flex-shrink-0 animate-in fade-in zoom-in duration-300"
          >
            <Check className="w-3 h-3 stroke-[3]" />
          </span>
        )}
      </div>

      {/* Subtitle / Category */}
      {category && (
        <p
          style={fontStyle}
          className="text-sm font-medium text-slate-500 dark:text-zinc-400 mt-0.5"
        >
          {category}
        </p>
      )}

      {/* Bio / Value Proposition */}
      {bio && (
        <p
          style={fontStyle}
          className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed text-center px-4 mt-2.5 max-w-sm"
        >
          {bio}
        </p>
      )}

      {/* NFC Authenticated Pill */}
      <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/60 text-[10px] font-semibold text-slate-600 dark:text-zinc-300">
        <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
        <span>Tarjeta NFC Oficial & Verificada</span>
      </div>
    </div>
  );
}
