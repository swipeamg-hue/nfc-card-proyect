'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
} from '@/lib/mock-data';
import { Business } from '@/types/business';
import { AuthUser } from '@/types/auth';
import { getActiveSession, logout } from '@/lib/auth';
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
  LogOut,
  ShieldAlert,
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
  const router = useRouter();
  const [session, setSession] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [allBusinesses, setAllBusinesses] = useState<Business[]>(DEFAULT_BUSINESSES);
  const [business, setBusiness] = useState<Business>(mockNexoBusiness);
  const [activeMainTab, setActiveMainTab] = useState<'editor' | 'analytics'>('editor');
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'editor' | 'preview'>('editor');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Authenticate user & load businesses list on client mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const currentSession = getActiveSession();
        if (!currentSession) {
          router.replace('/login');
          return;
        }

        setSession(currentSession);
        setIsAuthChecking(false);

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

        // ROLE ISOLATION: If CLIENT, restrict strictly to user's assigned business
        if (currentSession.role === 'CLIENT') {
          const clientBiz = loadedBusinesses.find((b) => b.id === currentSession.businessId);
          if (clientBiz) {
            setBusiness(clientBiz);
            setLastSavedTime('Panel de tu tienda cargado');
            return;
          }
        }

        // If SUPER_ADMIN, check if a specific business was chosen
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
      setIsAuthChecking(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Switch active business in the dashboard (SUPER_ADMIN ONLY)
  const switchActiveBusiness = (businessId: string) => {
    if (session?.role !== 'SUPER_ADMIN') return;
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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verificando sesión segura...</p>
        </div>
      </div>
    );
  }

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
                  {session?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Mi Tienda'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate max-w-[130px] sm:max-w-none">
                {session?.role === 'SUPER_ADMIN'
                  ? `Gestionando: ${business.name}`
                  : `Panel de ${business.name}`}
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
            {/* SUPER ADMIN ONLY: Multi-Tenant Business Selector & Portal Admin Button */}
            {session?.role === 'SUPER_ADMIN' && (
              <>
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

                <Link
                  href="/admin"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold border border-amber-500/30 transition-colors"
                  title="Ver todas las empresas registradas en el SaaS"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Portal Admin</span>
                </Link>
              </>
            )}

            {/* CLIENT ONLY: Badge showing their store ownership */}
            {session?.role === 'CLIENT' && (
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-700 dark:text-zinc-300 truncate max-w-[130px]">
                  {session.name}
                </span>
              </div>
            )}

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

            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-xs font-semibold transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
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
