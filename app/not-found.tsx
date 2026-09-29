'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Smartphone, ArrowLeft } from 'lucide-react';
import { ProfileViewer } from '@/components/nfc/profile-viewer';

export default function NotFound() {
  const [potentialSlug, setPotentialSlug] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check pathname: e.g. /nfc-card-proyect/tunegocio or /tunegocio
    const path = window.location.pathname;
    const parts = path.split('/').filter(Boolean);

    // If subpath is nfc-card-proyect, the slug is the part after it
    let candidate = '';
    if (parts.length >= 2 && parts[0] === 'nfc-card-proyect') {
      candidate = parts[1];
    } else if (parts.length >= 1 && parts[0] !== 'nfc-card-proyect') {
      candidate = parts[0];
    }

    // Ignore known reserved system routes
    const reserved = ['login', 'admin', 'dashboard', 'api', 't', '_next', 'images'];
    if (candidate && !reserved.includes(candidate.toLowerCase())) {
      setPotentialSlug(candidate);
    }
    setIsChecking(false);
  }, []);

  if (potentialSlug) {
    return <ProfileViewer slug={potentialSlug} />;
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 animate-pulse">
          <Smartphone className="w-5 h-5 animate-bounce" />
        </div>
        <p className="text-xs text-slate-400">Verificando enlace digital...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        <Smartphone className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">Página No Encontrada</h1>
      <p className="text-xs sm:text-sm text-slate-400 max-w-sm mb-6">
        La ruta a la que intentas acceder no existe o fue movida.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a TapCard</span>
      </Link>
    </div>
  );
}
