'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Smartphone, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';

interface NfcRedirectClientProps {
  cardCode: string;
  targetSlug: string | null;
}

export function NfcRedirectClient({ cardCode, targetSlug }: NfcRedirectClientProps) {
  const router = useRouter();

  useEffect(() => {
    if (targetSlug && typeof window !== 'undefined') {
      const search = new URLSearchParams(window.location.search);
      const sourceParam = search.get('type') === 'qr' ? 'qr' : 'nfc';
      router.replace(`/${targetSlug}?src=${sourceParam}&code=${encodeURIComponent(cardCode)}`);
    }
  }, [targetSlug, cardCode, router]);

  if (targetSlug) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-slate-300 font-medium">Abriendo perfil digital...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Tarjeta NFC No Asignada</h1>
        <p className="text-sm text-slate-300 mt-2">
          El chip físico con identificador <span className="font-mono font-bold text-amber-400">#{cardCode}</span> aún no ha sido vinculado a ningún negocio o se encuentra inactivo.
        </p>

        <div className="mt-6 p-4 rounded-xl bg-slate-900/60 border border-slate-700/60 text-left text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            ¿Eres el propietario de esta tarjeta?
          </div>
          Inicia sesión en tu panel de administración para asociar este chip a tu perfil de negocio al instante.
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm transition-all shadow-lg active:scale-95"
          >
            Ir al Dashboard para Vincular
          </Link>
          <Link
            href="/nexosoluciones"
            className="w-full py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ver perfil de demostración
          </Link>
        </div>
      </div>
    </div>
  );
}
