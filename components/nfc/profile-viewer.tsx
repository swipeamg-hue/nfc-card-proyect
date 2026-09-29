'use client';

import React, { useState, useEffect } from 'react';
import { Business } from '@/types/business';
import { PublicProfile } from '@/components/nfc/public-profile';
import { getBusinessBySlug } from '@/lib/supabase';
import { mockBusinessesDatabase } from '@/lib/mock-data';
import Link from 'next/link';
import { Smartphone, ArrowLeft, RefreshCw } from 'lucide-react';

interface ProfileViewerProps {
  slug: string;
  initialBusiness?: Business | null;
}

export function ProfileViewer({ slug, initialBusiness }: ProfileViewerProps) {
  const [business, setBusiness] = useState<Business | null>(initialBusiness || null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialBusiness);
  const [notFoundState, setNotFoundState] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function resolveBusiness() {
      if (initialBusiness) {
        setBusiness(initialBusiness);
        setIsLoading(false);
        return;
      }

      const cleanSlug = slug.toLowerCase().trim();

      // 1. Check mock data first
      if (mockBusinessesDatabase[cleanSlug]) {
        if (isMounted) {
          setBusiness(mockBusinessesDatabase[cleanSlug]);
          setIsLoading(false);
        }
        return;
      }

      // 2. Check Supabase cloud database
      try {
        const cloudBusiness = await getBusinessBySlug(cleanSlug);
        if (cloudBusiness && isMounted) {
          setBusiness(cloudBusiness);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Error fetching cloud business profile:', err);
      }

      // 3. Fallback to localStorage (in case created locally in this browser)
      try {
        if (typeof window !== 'undefined') {
          const listStr = localStorage.getItem('tapcard_businesses_list');
          if (listStr) {
            const list: Business[] = JSON.parse(listStr);
            const found = list.find((b) => b.slug.toLowerCase() === cleanSlug);
            if (found && isMounted) {
              setBusiness(found);
              setIsLoading(false);
              return;
            }
          }

          const activeStr = localStorage.getItem('tapcard_active_business');
          if (activeStr) {
            const active: Business = JSON.parse(activeStr);
            if (active.slug.toLowerCase() === cleanSlug && isMounted) {
              setBusiness(active);
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Error reading fallback local business profile:', e);
      }

      if (isMounted) {
        setIsLoading(false);
        setNotFoundState(true);
      }
    }

    resolveBusiness();

    return () => {
      isMounted = false;
    };
  }, [slug, initialBusiness]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
          <Smartphone className="w-6 h-6 animate-bounce" />
        </div>
        <p className="text-sm font-semibold text-slate-200">Cargando perfil digital NFC...</p>
        <p className="text-xs text-slate-500 mt-1">Conectando con la nube de TapCard</p>
      </div>
    );
  }

  if (notFoundState || !business) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
          <Smartphone className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">Perfil No Encontrado</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
          No encontramos ninguna tarjeta de presentación digital registrada con el identificador{' '}
          <strong className="text-blue-400 font-mono">@{slug}</strong>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Ir al Inicio de TapCard</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    );
  }

  return <PublicProfile business={business} />;
}
