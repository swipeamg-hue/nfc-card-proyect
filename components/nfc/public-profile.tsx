'use client';

import React, { useState, useEffect } from 'react';
import { Business } from '@/types/business';
import { HeroBanner } from './hero-banner';
import { ProfileHeader } from './profile-header';
import { ActionCard } from './action-card';
import { QuickActionsBar } from './quick-actions-bar';
import { FloatingVCardButton } from './floating-vcard-button';
import { QrModal } from './qr-modal';
import { Smartphone, Zap, Sparkles } from 'lucide-react';

interface PublicProfileProps {
  business: Business;
  source?: 'NFC' | 'QR' | 'DIRECT';
  cardCode?: string;
}

export function PublicProfile({
  business,
  source = 'DIRECT',
  cardCode,
}: PublicProfileProps) {
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show small welcome badge when coming from NFC chip
  useEffect(() => {
    if (source === 'NFC') {
      showToast(`¡Leído vía Chip NFC${cardCode ? ` (${cardCode})` : ''}!`);
    } else if (source === 'QR') {
      showToast('¡Escaneado vía Código QR!');
    }
  }, [source, cardCode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleTrackClick = (linkId: string, linkType: string) => {
    // Record async analytics event without blocking UI
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          source,
          clickedItem: linkType,
          deviceType: 'MOBILE',
        }),
      }).catch(() => {
        // Silent failure for analytics
      });
    } catch {
      // Ignore
    }
  };

  // Sort active links by order
  const activeLinks = [...(business.links || [])]
    .filter((l) => l.isActive)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-slate-200 dark:bg-zinc-900 flex justify-center py-0 sm:py-6 selection:bg-blue-500 selection:text-white">
      {/* Mobile Container max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-zinc-950 shadow-xl overflow-hidden */}
      <main className="w-full max-w-md min-h-screen sm:min-h-[920px] bg-slate-50 dark:bg-zinc-950 shadow-2xl overflow-hidden relative flex flex-col justify-between sm:rounded-[36px] sm:border-[6px] sm:border-slate-800">
        
        {/* Source Badge Floating Toast */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-medium shadow-xl backdrop-blur-md border border-slate-700/50">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '3s' }} />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        <div>
          {/* Hero Banner with Avatar */}
          <HeroBanner
            bannerUrl={business.bannerUrl}
            logoUrl={business.logoUrl}
            businessName={business.name}
          />

          {/* Profile Header Details */}
          <ProfileHeader
            name={business.name}
            isVerified={business.isVerified}
            category={business.category}
            bio={business.bio}
          />

          {/* Action Cards List */}
          <div className="px-4 mt-6 space-y-3">
            {activeLinks.map((link) => (
              <ActionCard
                key={link.id}
                link={link}
                onTrackClick={handleTrackClick}
              />
            ))}
          </div>

          {/* Quick Actions Grid (Email, Maps, Catalog) */}
          <div className="px-4">
            <QuickActionsBar
              business={business}
              onTrackAction={(act) => handleTrackClick(act, act)}
            />
          </div>
        </div>

        {/* Footer & NFC Branding */}
        <div className="px-4 pt-6 pb-24 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-zinc-500">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Perfil interactivo compatible con NFC & QR</span>
          </div>
          <div className="mt-1 text-[10px] text-slate-400 dark:text-zinc-600">
            Desarrollado con <span className="font-semibold text-slate-600 dark:text-zinc-400">TapCard SaaS</span>
          </div>
        </div>

        {/* Floating VCard & Share Bar */}
        <FloatingVCardButton
          business={business}
          onOpenQrModal={() => setIsQrOpen(true)}
          onTrackAction={(act) => handleTrackClick(act, act)}
        />

        {/* Dynamic QR Code Modal */}
        <QrModal
          business={business}
          isOpen={isQrOpen}
          onClose={() => setIsQrOpen(false)}
        />
      </main>
    </div>
  );
}
