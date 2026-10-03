'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Business } from '@/types/business';
import { PwaInstallModal } from './pwa-install-modal';
import { CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PwaInstallButtonProps {
  business: Business;
  onTrackAction?: (actionName: string) => void;
  contained?: boolean;
}

/**
 * Dedicated Custom SVG Download / PWA Installation Icon
 */
function AppDownloadSvgIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 7V14.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.5 11.5L12 15L15.5 11.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 18H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PwaInstallButton({
  business,
  onTrackAction,
  contained = false,
}: PwaInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      );
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Listen for display-mode changes or app installation
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    // 2. Register minimal Service Worker for Chromium PWA criteria
    if ('serviceWorker' in navigator && !contained) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((e) => console.log('[PWA SW] Info:', e));
    }

    // 3. Capture beforeinstallprompt event (Android / Chromium)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Ensure document.head has dynamic manifest and apple-touch-icon pointing to this business
    if (!contained) {
      try {
        let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
        if (!manifestLink) {
          manifestLink = document.createElement('link');
          manifestLink.rel = 'manifest';
          document.head.appendChild(manifestLink);
        }
        manifestLink.href = `/api/manifest/${business.slug}`;

        let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
        if (!appleIconLink) {
          appleIconLink = document.createElement('link');
          appleIconLink.rel = 'apple-touch-icon';
          document.head.appendChild(appleIconLink);
        }
        if (business.logoUrl) {
          appleIconLink.href = business.logoUrl;
        }

        let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement | null;
        if (!appleTitleMeta) {
          appleTitleMeta = document.createElement('meta');
          appleTitleMeta.name = 'apple-mobile-web-app-title';
          document.head.appendChild(appleTitleMeta);
        }
        appleTitleMeta.content = business.name;
      } catch (e) {
        console.warn('[PWA Dynamic Head] error:', e);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [business.slug, business.name, business.logoUrl, contained]);

  const handleInstallClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onTrackAction?.('pwa_install_click');

    // If native prompt is available (Chromium/Android), trigger it without blocking the UI
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt().catch(() => {});
        deferredPrompt.userChoice
          .then((choice) => {
            if (choice.outcome === 'accepted') {
              setIsInstalled(true);
              setDeferredPrompt(null);
              setIsModalOpen(false);
            }
          })
          .catch(() => {});
      } catch (err) {
        console.warn('Native prompt error:', err);
      }
    }

    // Always open the visual smart guide modal so user gets clear feedback and instructions
    setIsModalOpen(true);
  };

  const customFont = business.customization?.customFontName || business.customization?.fontFamily;
  const fontStyle = customFont ? { fontFamily: `"${customFont}", sans-serif` } : undefined;
  const logo = business.logoUrl || '/images/nexo-logo.jpg';
  const isCustomLogo = Boolean(logo && !logo.startsWith('/images/'));
  const primaryColor = business.customization?.primaryColor || business.customization?.buttonBgColor || '#2563eb';

  return (
    <>
      <div
        style={fontStyle}
        className={`${
          contained ? 'absolute bottom-3' : 'fixed bottom-4 sm:bottom-6'
        } left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-none`}
      >
        <div
          onClick={handleInstallClick}
          style={fontStyle}
          className="flex items-center justify-between gap-3 pointer-events-auto bg-slate-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-xl p-2.5 pl-3 rounded-2xl border border-slate-700/80 dark:border-zinc-800 shadow-2xl shadow-black/40 cursor-pointer hover:border-slate-500/80 active:scale-[0.99] transition-all"
        >
          {/* Left: Mini App Icon Squircle with Logo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-[12px] overflow-hidden bg-slate-800 border border-white/20 shadow-md flex-shrink-0 flex items-center justify-center">
              {isCustomLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={logo}
                  alt={business.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Glossy highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Middle: Title & Subtitle */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {isInstalled ? 'App Oficial Instalada' : 'Descargar como App'}
                </p>
              </div>
              <p className="text-[10px] text-slate-300 dark:text-zinc-400 truncate mt-0.5">
                {isInstalled
                  ? 'Abierto en pantalla principal'
                  : 'En tu celular con logo oficial'}
              </p>
            </div>
          </div>

          {/* Right Action: SVG Download Button */}
          {isInstalled ? (
            <div className="flex items-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Instalada</span>
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: primaryColor,
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 sm:px-4 rounded-xl text-white font-bold text-xs shadow-lg shadow-black/20 hover:brightness-110 active:scale-95 transition-all duration-200 flex-shrink-0 group"
            >
              <AppDownloadSvgIcon className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              <span>Instalar</span>
            </button>
          )}
        </div>
      </div>

      {/* Smart PWA Installation Modal */}
      <PwaInstallModal
        business={business}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        canNativePrompt={Boolean(deferredPrompt)}
        onNativeInstall={handleInstallClick}
      />
    </>
  );
}
