'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Business } from '@/types/business';
import { PwaInstallModal } from './pwa-install-modal';
import { getBasePath } from '@/lib/base-path';
import { getOptimizedAppIconUrl, getAppIconMimeType } from '@/lib/pwa-icons';
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

  const customFont = business.customization?.customFontName || business.customization?.fontFamily;
  const fontStyle = customFont ? { fontFamily: `"${customFont}", sans-serif` } : undefined;
  const logo = getOptimizedAppIconUrl(business.logoUrl);
  const isCustomLogo = Boolean(logo && !logo.includes('/images/nexo-logo'));
  const primaryColor = business.customization?.primaryColor || business.customization?.buttonBgColor || '#2563eb';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for display-mode standalone changes
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

    // CRITICAL: Inside dashboard simulator mockup, DO NOT register service worker or intercept install prompts
    // This prevents the admin dashboard from being mistakenly installed instead of the viewer's card!
    if (contained) {
      return () => {
        mediaQuery.removeEventListener('change', handleMediaChange);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    const basePath = getBasePath();
    const currentCardPath = window.location.pathname; // e.g. /nfc-card-proyect/sergio-ibanez/
    const resolvedLogo = getOptimizedAppIconUrl(business.logoUrl);
    const logoMimeType = getAppIconMimeType(resolvedLogo);
    const manifestUrl = `${basePath}/api/manifest/${business.slug}/manifest.json`;

    // 1. Ensure the page title is strictly the Client's business or personal name
    document.title = business.name;

    // 2. Register Service Worker with correct basePath and scope
    if ('serviceWorker' in navigator) {
      const swUrl = `${basePath}/sw.js`;
      navigator.serviceWorker
        .register(swUrl, { scope: `${basePath}/` })
        .catch((e) => console.log('[PWA SW] Info:', e));
    }

    // 3. Prepare client-side manifest specifically locked to this business card slug
    try {
      const manifestData = {
        id: currentCardPath,
        name: business.name,
        short_name: business.name.length > 20 ? business.name.slice(0, 20) : business.name,
        description: business.bio || `Tarjeta digital oficial de ${business.name}`,
        start_url: `${currentCardPath}?src=pwa_viewer`,
        scope: currentCardPath,
        display: 'standalone',
        display_override: ['standalone', 'window-controls-overlay', 'minimal-ui'],
        background_color: business.customization?.backgroundColor || '#090d16',
        theme_color: primaryColor,
        orientation: 'portrait-primary',
        icons: [
          {
            src: resolvedLogo,
            sizes: '192x192',
            type: logoMimeType,
            purpose: 'any',
          },
          {
            src: resolvedLogo,
            sizes: '512x512',
            type: logoMimeType,
            purpose: 'any maskable',
          },
        ],
      };

      // Store in Cache Storage so Service Worker delivers it directly upon browser fetch
      if ('caches' in window) {
        caches.open('tapcard-manifest-cache').then((cache) => {
          const resp = new Response(JSON.stringify(manifestData), {
            headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
          });
          cache.put(manifestUrl, resp).catch(() => {});
        }).catch(() => {});
      }

      // Update link[rel=manifest]
      let manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null;
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      manifestLink.href = manifestUrl;

      // Update apple-touch-icon for iOS Safari
      let appleIconLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement | null;
      if (!appleIconLink) {
        appleIconLink = document.createElement('link');
        appleIconLink.rel = 'apple-touch-icon';
        document.head.appendChild(appleIconLink);
      }
      appleIconLink.href = resolvedLogo;

      // Update favicon
      const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
      if (faviconLink) {
        faviconLink.href = resolvedLogo;
      }

      // Update meta application names
      let appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]') as HTMLMetaElement | null;
      if (!appleTitleMeta) {
        appleTitleMeta = document.createElement('meta');
        appleTitleMeta.name = 'apple-mobile-web-app-title';
        document.head.appendChild(appleTitleMeta);
      }
      appleTitleMeta.content = business.name;

      let appNameMeta = document.querySelector('meta[name="application-name"]') as HTMLMetaElement | null;
      if (!appNameMeta) {
        appNameMeta = document.createElement('meta');
        appNameMeta.name = 'application-name';
        document.head.appendChild(appNameMeta);
      }
      appNameMeta.content = business.name;
    } catch (e) {
      console.warn('[PWA Dynamic Head] error:', e);
    }

    // 4. Capture beforeinstallprompt for real viewers on the public card
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mediaQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [
    business.slug,
    business.name,
    business.logoUrl,
    business.bio,
    business.customization?.backgroundColor,
    primaryColor,
    contained,
  ]);

  const handleInstallClick = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    onTrackAction?.('pwa_install_click');

    // If inside simulator mockup, simply open the preview modal
    if (contained) {
      setIsModalOpen(true);
      return;
    }

    // On actual public card: trigger native prompt if available
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

    setIsModalOpen(true);
  };

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
        isMockup={contained}
      />
    </>
  );
}
