'use client';

import React from 'react';
import Image from 'next/image';

interface HeroBannerProps {
  bannerUrl?: string;
  logoUrl?: string;
  businessName: string;
}

export function HeroBanner({ bannerUrl, logoUrl, businessName }: HeroBannerProps) {
  // Smart background: if bannerUrl is provided use it; otherwise fallback to logoUrl
  const effectiveBanner = bannerUrl || logoUrl;
  const isSmartFromLogo = !bannerUrl && !!logoUrl;
  const isSameAsLogo = effectiveBanner === logoUrl;

  return (
    <div className="relative w-full">
      {/* Banner Cover */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        {effectiveBanner ? (
          <>
            {/* If banner is derived from avatar or square photo, apply ambient backdrop blur */}
            {isSameAsLogo ? (
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={effectiveBanner}
                  alt=""
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 450px"
                  className="object-cover object-center scale-125 filter blur-md brightness-[0.70] contrast-125"
                />
              </div>
            ) : null}

            <Image
              src={effectiveBanner}
              alt={`${businessName} Portada`}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 450px"
              className={`object-cover object-center ${
                isSameAsLogo ? 'opacity-90 mix-blend-overlay scale-105' : 'opacity-100'
              }`}
            />

            {/* Smart cinematic vignette overlay for contrast and sleek finish */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-black/20 pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-800 to-sky-700 opacity-90" />
        )}
        {/* Subtle dark gradient overlay on bottom of banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Overlapping Avatar Logo */}
      <div className="flex justify-center -mt-12 relative z-10 px-4">
        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 shadow-lg bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={`${businessName} Logo`}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {businessName.slice(0, 2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
