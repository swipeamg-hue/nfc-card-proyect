'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
} from '@/lib/mock-data';
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
  Building2,
  Users,
} from 'lucide-react';

const STORAGE_KEY = 'tapcard_business_data_nexo';
const STORAGE_BUSINESSES_LIST_KEY = 'tapcard_saas_all_businesses';
const STORAGE_CURRENT_ACTIVE_ID = 'tapcard_active_business_id';

const DEFAULT_BUSINESSES: Business[] = [
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
];

export default function DashboardPage() {
  const [allBusinesses, setAllBusinesses] = useState<Business[]>(DEFAULT_BUSINESSES);
  const [business, setBusiness] = useState<Business>(mockNexoBusiness);
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'analytics'>('editor');
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'editor' | 'preview'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Load saved businesses list and active business on client mount
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        let loadedBusinesses = DEFAULT_BUSINESSES;
        const savedList = localStorage.getItem(STORAGE_BUSINESSES_LIST_KEY);
        if (savedList) {
          const parsed = JSON.parse(savedList);
          if (Array.isArray(parsed) && parsed.length > 0) {
            loadedBusinesses = parsed;
            setAllBusinesses(parsed);
          }
        } else {
          localStorage.setItem(STORAGE_BUSINESSES_LIST_KEY, JSON.stringify(DEFAULT_BUSINESSES));
        }

        // Check if a specific business was chosen from Super Admin
        const activeId = localStorage.getItem(STORAGE_CURRENT_ACTIVE_ID);
        if (activeId) {
          const match = loadedBusinesses.find((b) => b.id === activeId);
          if (match) {
            setBusiness(match);
            setLastSavedTime('Empresa cargada');
            return;
          }
        }

        // Fallback to active business data
        const savedActive = localStorage.getItem(STORAGE_KEY);
        if (savedActive) {
          const parsedActive = JSON.parse(savedActive);
          if (parsedActive && parsedActive.id) {
            setBusiness(parsedActive);
            setLastSavedTime('Sesión restaurada');
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved business', e);
    }
  }, []);

  // Switch active business in the dashboard
  const switchActiveBusiness = (businessId: string) => {
    const target = allBusinesses.find((b) => b.id === businessId);
    if (!target) return;

    setBusiness(target);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_ACTIVE_ID, target.id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
        setLastSavedTime(`Cambiado a ${target.name}`);
      }
    } catch {}
  };

  // Automatic instantaneous save on any change
  const handleBusinessChange = (updated: Business) => {
    setBusiness(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Also update in allBusinesses list
        const updatedList = allBusinesses.map((b) => (b.id === updated.id ? updated : b));
        setAllBusinesses(updatedList);
        localStorage.setItem(STORAGE_BUSINESSES_LIST_KEY, JSON.stringify(updatedList));

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
        const updatedList = allBusinesses.map((b) => (b.id === business.id ? business : b));
        setAllBusinesses(updatedList);
        localStorage.setItem(STORAGE_BUSINESSES_LIST_KEY, JSON.stringify(updatedList));
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
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-0 sm:h-16 flex flex-wrap items-center justify-between gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 flex-shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm sm:text-base tracking-tight">TapCard</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  PyME SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[130px] sm:max-w-none">
                Panel de {business.name}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {/* Multi-Tenant Business Selector */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/90 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700/80 shadow-xs">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                <span>👑</span>
                <span className="hidden xl:inline">Empresa:</span>
              </span>
              <select
                value={business.id}
                onChange={(e) => switchActiveBusiness(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 dark:text-zinc-200 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[180px] truncate"
              >
                {allBusinesses.map((b) => (
                  <option
                    key={b.id}
                    value={b.id}
                    className="bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200"
                  >
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Portal Super Admin Button */}
            <Link
              href="/admin"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/30 transition-colors"
              title="Ver todas las empresas registradas en el SaaS"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Admin</span>
            </Link>

            {/* View Switcher (Desktop) */}
            <div className="hidden md:flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-xl">
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
              <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-200/80 dark:border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{lastSavedTime}</span>
              </div>
            )}

            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden xs:inline">Guardar Cambios</span>
                  <span className="xs:hidden">Guardar</span>
                </>
              )}
            </button>

            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-slate-700 dark:text-zinc-300"
            >
              <span className="hidden sm:inline">Ver Perfil Público</span>
              <span className="sm:hidden">Ver Perfil</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* View Switcher (Mobile Row) */}
          <div className="flex md:hidden w-full bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl mt-1">
            <button
              onClick={() => setActiveMainTab('editor')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainTab === 'editor'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Editor & Vista</span>
            </button>
            <button
              onClick={() => setActiveMainTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeMainTab === 'analytics'
                  ? 'bg-white dark:bg-zinc-900 text-blue-600 shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Métricas & QR</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {activeMainTab === 'editor' ? (
          <div>
            {/* Mobile/Tablet Segmented Toggle: Editor vs Simulador */}
            <div className="flex lg:hidden bg-slate-200/90 dark:bg-zinc-800 p-1 rounded-2xl mb-6 max-w-sm mx-auto shadow-xs">
              <button
                type="button"
                onClick={() => setMobileWorkspaceTab('editor')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  mobileWorkspaceTab === 'editor'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Editor de Datos</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileWorkspaceTab('preview')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  mobileWorkspaceTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Simulador Móvil</span>
              </button>
            </div>

            {/* Split Screen on Desktop (lg), Tabbed on Mobile/Tablet */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Management Form & Tabs */}
              <div
                className={`lg:col-span-7 space-y-4 ${
                  mobileWorkspaceTab === 'editor' ? 'block' : 'hidden lg:block'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
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
              <div
                className={`lg:col-span-5 flex justify-center ${
                  mobileWorkspaceTab === 'preview' ? 'block' : 'hidden lg:flex'
                }`}
              >
                <PhoneMockup business={business} />
              </div>
            </div>
          </div>
        ) : (
          /* Analytics & QR Code Generator View */
          <div className="space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
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
