'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { mockNexoBusiness } from '@/lib/mock-data';
import { Business } from '@/types/business';
import { ProfileEditor } from '@/components/dashboard/profile-editor';
import { PhoneMockup } from '@/components/dashboard/phone-mockup';
import { AnalyticsView } from '@/components/dashboard/analytics-view';
import {
  ExternalLink,
  Smartphone,
  BarChart3,
  SlidersHorizontal,
  Check,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'tapcard_business_data_nexo';

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business>(mockNexoBusiness);
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'analytics'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Load saved modifications from localStorage on client mount
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setBusiness(parsed);
            setLastSavedTime('Sesión restaurada');
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved business', e);
    }
  }, []);

  // Automatic instantaneous save on any change
  const handleBusinessChange = (updated: Business) => {
    setBusiness(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(`Autoguardado a las ${timeStr}`);
      }
    } catch (e) {
      console.error('Error auto-saving business', e);
    }
  };

  const handleSave = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(business));
      }
      setSavedSuccess(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(`Guardado a las ${timeStr}`);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      alert('Error al guardar datos');
    }
  };

  const handleReset = () => {
    if (confirm('¿Deseas restaurar la información predeterminada y borrar los cambios guardados?')) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {}
      setBusiness(mockNexoBusiness);
      setLastSavedTime('Restaurado a demo inicial');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">TapCard</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  PyME SaaS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Panel de {business.name}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveMainTab('editor')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMainTab === 'editor'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Editor & Vista en Vivo</span>
              </button>
              <button
                onClick={() => setActiveMainTab('analytics')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeMainTab === 'analytics'
                    ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Métricas & QR</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              title="Restaurar valores de demo"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {lastSavedTime && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{lastSavedTime}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Cambios Guardados!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>

            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all"
            >
              <span>Ver Perfil Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeMainTab === 'editor' ? (
          /* Split Screen: Editor on Left, Live Phone Mockup on Right */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Management Form & Tabs */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Personalización en Tiempo Real
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                    Modifica los datos, enlaces o diseño. Cada cambio se guarda automáticamente y se refleja instantáneamente en el simulador móvil.
                  </p>
                </div>
              </div>

              <ProfileEditor business={business} onChange={handleBusinessChange} />
            </div>

            {/* Right Column: Live Phone Simulator */}
            <div className="lg:col-span-5 flex justify-center">
              <PhoneMockup business={business} />
            </div>
          </div>
        ) : (
          /* Analytics & QR Code Generator View */
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Analíticas de Rendimiento & Códigos Físicos
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Métricas de lectura de chips NFC, escaneos de códigos QR y descargas de tarjetas de contacto vCard.
              </p>
            </div>

            <AnalyticsView business={business} />
          </div>
        )}
      </main>
    </div>
  );
}
