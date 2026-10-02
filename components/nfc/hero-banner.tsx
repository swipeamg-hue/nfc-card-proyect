'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface HeroBannerProps {
  bannerUrl?: string;
  logoUrl?: string;
  businessName: string;
  isFullBackground?: boolean;
}

const FALLBACK_BANNER = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop';
const FALLBACK_LOGO = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop';

export function HeroBanner({
  bannerUrl,
  logoUrl,
  businessName,
  isFullBackground = false,
}: HeroBannerProps) {
  // Check for old broken local relative paths
  const cleanBanner = bannerUrl && !bannerUrl.startsWith('/images/') ? bannerUrl : '';
  const cleanLogo = logoUrl && !logoUrl.startsWith('/images/') ? logoUrl : '';

  const [bannerError, setBannerError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const [prevUrls, setPrevUrls] = useState({ bannerUrl, logoUrl });
  if (prevUrls.bannerUrl !== bannerUrl || prevUrls.logoUrl !== logoUrl) {
    setPrevUrls({ bannerUrl, logoUrl });
    setBannerError(false);
    setLogoError(false);
  }

  const bannerSrc = !bannerError ? (cleanBanner || cleanLogo || FALLBACK_BANNER) : FALLBACK_BANNER;
  const logoSrc = !logoError ? (cleanLogo || FALLBACK_LOGO) : FALLBACK_LOGO;

  const isSameAsLogo = bannerSrc === logoSrc;

  // Si la tarjeta está configurada con Fondo Completo, el banner superior no corta abruptamente
  if (isFullBackground) {
    return (
      <div className="relative w-full pt-8 pb-3">
        {/* Floating Avatar Logo sobre fondo completo */}
        <div className="flex justify-center relative z-10 px-4">
          <div className="w-24 h-24 rounded-full border-4 border-white/80 dark:border-zinc-800/80 shadow-2xl bg-slate-900/60 backdrop-blur-md flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 ring-2 ring-white/30">
            <Image
              src={logoSrc}
              alt={`${businessName} Logo`}
              width={96}
              height={96}
              unoptimized
              className="w-full h-full object-cover"
              onError={() => setLogoError(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Banner Cover Clásico */}
      <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <>
          {/* Ambient blurred backdrop if banner is derived from avatar */}
          {isSameAsLogo && (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={bannerSrc}
                alt=""
                fill
                priority
                unoptimized
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover object-center scale-125 filter blur-md brightness-[0.70] contrast-125"
                onError={() => setBannerError(true)}
              />
            </div>
          )}

          <Image
            src={bannerSrc}
            alt={`${businessName} Fondo`}
            fill
            priority
            unoptimized
            sizes="(max-width: 768px) 100vw, 450px"
            className={`object-cover object-center ${
              isSameAsLogo ? 'opacity-90 mix-blend-overlay scale-105' : 'opacity-100'
            }`}
            onError={() => setBannerError(true)}
          />

          {/* Smart cinematic vignette overlay for contrast and sleek finish */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/30 to-black/20 pointer-events-none" />
        </>

        {/* Subtle dark gradient overlay on bottom of banner */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Overlapping Avatar Logo */}
      <div className="flex justify-center -mt-12 relative z-10 px-4">
        <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl bg-slate-900 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 ring-2 ring-blue-500/20">
          <Image
            src={logoSrc}
            alt={`${businessName} Logo`}
            width={96}
            height={96}
            unoptimized
            className="w-full h-full object-cover"
            onError={() => setLogoError(true)}
          />
        </div>
      </div>
    </div>
  );
}
