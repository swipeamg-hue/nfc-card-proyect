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

import { supabase, getBusinessBySlug, trackTapEvent } from '@/lib/supabase';

interface PublicProfileProps {
  business: Business;
  source?: 'NFC' | 'QR' | 'DIRECT';
  cardCode?: string;
  isMockup?: boolean;
}

export function PublicProfile({
  business: initialBusiness,
  source = 'DIRECT',
  cardCode,
  isMockup = false,
}: PublicProfileProps) {
  const [business, setBusiness] = useState<Business>(initialBusiness);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Fetch live data from Supabase and subscribe to real-time changes
  useEffect(() => {
    let isMounted = true;

    async function loadFreshBusiness() {
      try {
        const fresh = await getBusinessBySlug(initialBusiness.slug);
        if (fresh && isMounted) {
          setBusiness(fresh);
        }
      } catch (e) {
        console.warn('Could not fetch latest Supabase profile:', e);
      }
    }

    loadFreshBusiness();

    // Setup Supabase Realtime channel
    const channel = supabase
      .channel(`realtime-biz-${initialBusiness.slug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'businesses',
          filter: `id=eq.${initialBusiness.id}`,
        },
        () => {
          loadFreshBusiness();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'business_links',
          filter: `business_id=eq.${initialBusiness.id}`,
        },
        () => {
          loadFreshBusiness();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [initialBusiness.slug, initialBusiness.id]);

  // 2. Track page tap/view in Supabase & check URL params
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const search = new URLSearchParams(window.location.search);
        const srcParam = (search.get('src') || source).toUpperCase() as 'NFC' | 'QR' | 'DIRECT';
        const codeParam = search.get('code') || cardCode;

        if (srcParam === 'NFC') {
          showToast(`¡Leído vía Chip NFC${codeParam ? ` (${codeParam})` : ''}!`);
        } else if (srcParam === 'QR') {
          showToast('¡Escaneado vía Código QR!');
        }

        // Record tap in Supabase analytics
        if (!isMockup) {
          trackTapEvent({
            businessId: business.id,
            cardCode: codeParam,
            source: srcParam === 'NFC' || srcParam === 'QR' ? srcParam : 'DIRECT',
            clickedItem: 'page_view',
          });
        }
      }
    } catch {}
  }, [source, cardCode, isMockup, business.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleTrackClick = (linkId: string, linkType: string) => {
    if (isMockup) return;
    trackTapEvent({
      businessId: business.id,
      cardCode,
      source: (source || 'DIRECT').toUpperCase() as any,
      clickedItem: linkType,
    });
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
        <div className="px-4 pt-6 pb-32 text-center">
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
          contained={isMockup}
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
