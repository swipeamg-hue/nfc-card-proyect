'use client';

import React, { useState } from 'react';
import { UserPlus, Share2, Check, Download } from 'lucide-react';
import { Business } from '@/types/business';
import { downloadVCard } from '@/lib/vcard';

interface FloatingVCardButtonProps {
  business: Business;
  onOpenQrModal?: () => void;
  onTrackAction?: (actionName: string) => void;
}

export function FloatingVCardButton({
  business,
  onOpenQrModal,
  onTrackAction,
}: FloatingVCardButtonProps) {
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const handleSaveContact = () => {
    onTrackAction?.('vcard_download');
    downloadVCard(business);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handleShare = async () => {
    onTrackAction?.('share_click');
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: business.name,
          text: `${business.name} - ${business.category}`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to QR modal if user cancels or share fails
      }
    }
    onOpenQrModal?.();
  };

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xl">
        {/* Primary Action: Guardar Contacto */}
        <button
          onClick={handleSaveContact}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all duration-200"
        >
          {downloaded ? (
            <>
              <Check className="w-4 h-4 text-emerald-300 stroke-[3]" />
              <span>¡Contacto Guardado!</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Guardar en el celular</span>
            </>
          )}
        </button>

        {/* Secondary Action: Compartir / QR */}
        <button
          onClick={handleShare}
          title="Compartir o Ver QR"
          className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 active:scale-95 transition-all duration-200"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
