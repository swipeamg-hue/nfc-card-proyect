'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Smartphone,
  ExternalLink,
  Plus,
  Search,
  ShieldCheck,
  CreditCard,
  SlidersHorizontal,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle2,
  Trash2,
  ArrowRight,
  Zap,
  Globe,
  Share2,
  Phone,
  Mail,
  Copy,
  Check,
  Lock,
  ShieldAlert,
  LogOut,
} from 'lucide-react';
import { Business, NfcCard } from '@/types/business';
import { AuthUser } from '@/types/auth';
import { getActiveSession, logout } from '@/lib/auth';
import {
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
} from '@/lib/mock-data';

import { getAllBusinesses, saveBusinessToSupabase, supabase, getAppBaseUrl } from '@/lib/supabase';

const STORAGE_BUSINESSES_LIST_KEY = 'tapcard_saas_all_businesses';
const STORAGE_CURRENT_ACTIVE_ID = 'tapcard_active_business_id';

const INITIAL_BUSINESSES: Business[] = [
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
];

export default function SuperAdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>(INITIAL_BUSINESSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('ALL');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // New business form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCardCode, setNewCardCode] = useState('');
  const [newPlan, setNewPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>('PRO');

  // Load businesses & session on mount (Local first + Supabase Live Cloud Sync)
  useEffect(() => {
    let isMounted = true;

    async function loadAdminData() {
      try {
        if (typeof window === 'undefined') return;

        const curSession = getActiveSession();
        setSession(curSession);
        setIsAuthChecking(false);

        // 1. Try local storage cache for immediate display
        const saved = localStorage.getItem(STORAGE_BUSINESSES_LIST_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBusinesses(parsed);
          }
        }

        // 2. Fetch live data from Supabase
        const cloudBusinesses = await getAllBusinesses();
        if (cloudBusinesses && cloudBusinesses.length > 0 && isMounted) {
          setBusinesses(cloudBusinesses);
          localStorage.setItem(STORAGE_BUSINESSES_LIST_KEY, JSON.stringify(cloudBusinesses));
        }
      } catch (e) {
        console.error('Error loading businesses list:', e);
        if (isMounted) setIsAuthChecking(false);
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  // Save changes to localStorage and Supabase
  const saveBusinesses = (updated: Business[]) => {
    setBusinesses(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_BUSINESSES_LIST_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Error saving businesses locally', e);
    }
  };

  // Switch active tenant and open Dashboard
  const handleOpenDashboard = (biz: Business) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_CURRENT_ACTIVE_ID, biz.id);
        localStorage.setItem('tapcard_business_data_nexo', JSON.stringify(biz));
      }
    } catch {}
    router.push('/dashboard');
  };

  // Assign a new NFC card to a specific business
  const handleAddCardToBusiness = async (businessId: string) => {
    const code = prompt('Ingresa el código alfanumérico del nuevo chip NFC físico (ej. VIP-8890):');
    if (!code || !code.trim()) return;

    const cleanCode = code.trim().toUpperCase();

    const newCard: NfcCard = {
      id: 'card-' + Date.now(),
      cardCode: cleanCode,
      businessId: businessId,
      status: 'ACTIVE',
      totalTaps: 0,
      createdAt: new Date().toISOString(),
    };

    const updated = businesses.map((b) => {
      if (b.id === businessId) {
        const existingCards = b.cards || [];
        if (existingCards.some((c) => c.cardCode === cleanCode)) {
          alert('Este código ya está vinculado a este negocio.');
          return b;
        }
        return {
          ...b,
          cards: [...existingCards, newCard],
        };
      }
      return b;
    });

    saveBusinesses(updated);

    // Persist card to Supabase
    try {
      await supabase.from('nfc_cards').insert({
        id: newCard.id,
        card_code: newCard.cardCode,
        business_id: businessId,
        status: 'ACTIVE',
        total_taps: 0,
      });
    } catch (e) {
      console.warn('Could not save card to Supabase:', e);
    }
  };

  // Delete business permanently
  const handleDeleteBusiness = async (businessId: string, businessName: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar permanentemente a "${businessName}"? Esta acción borrará sus enlaces y tarjetas asociadas de Supabase.`)) {
      return;
    }

    const updated = businesses.filter((b) => b.id !== businessId);
    saveBusinesses(updated);

    try {
      await supabase.from('businesses').delete().eq('id', businessId);
    } catch (e) {
      console.error('Error deleting business from Supabase:', e);
    }
  };

  // Create new tenant business
  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSlug.trim()) {
      alert('Por favor completa al menos el nombre y el enlace (slug).');
      return;
    }

    const cleanSlug = newSlug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '');

    if (businesses.some((b) => b.slug === cleanSlug)) {
      alert('Este slug ya existe. Elige otro identificador de enlace.');
      return;
    }

    const bizId = 'biz-' + Date.now();

    const initialCards: NfcCard[] = newCardCode.trim()
      ? [
          {
            id: 'card-' + Date.now(),
            cardCode: newCardCode.trim().toUpperCase(),
            businessId: bizId,
            status: 'ACTIVE',
            totalTaps: 0,
            createdAt: new Date().toISOString(),
          },
        ]
      : [];

    const newBiz: Business = {
      id: 'biz-' + Date.now(),
      slug: cleanSlug,
      name: newName.trim(),
      isVerified: true,
      category: newCategory.trim() || 'Servicios Profesionales',
      bio: `Bienvenido a la tarjeta digital oficial de ${newName.trim()}. Conéctate con nosotros en un solo toque.`,
      bannerUrl: '',
      logoUrl: '',
      themeColor: '#2563eb',
      phone: newPhone.trim(),
      whatsapp: newPhone.trim().replace(/[^0-9]/g, ''),
      email: `contacto@${cleanSlug}.com`,
      address: '',
      googleMapsUrl: '',
      websiteUrl: '',
      plan: newPlan,
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
      cards: initialCards,
      links: [
        {
          id: 'link-wa-' + Date.now(),
          businessId: 'biz-' + Date.now(),
          type: 'whatsapp',
          title: 'WhatsApp Oficial',
          subtitle: 'Escríbenos directamente',
          url: `https://wa.me/${newPhone.trim().replace(/[^0-9]/g, '')}`,
          iconName: 'whatsapp',
          order: 1,
          isActive: true,
          highlighted: true,
        },
      ],
      quickAccess: {
        enabled: true,
        showPhone: !!newPhone.trim(),
        showEmail: true,
        showMaps: false,
        showCatalog: false,
      },
    };

    const updated = [newBiz, ...businesses];
    saveBusinesses(updated);
    setIsNewModalOpen(false);

    // Persist new business & cards to Supabase
    try {
      await saveBusinessToSupabase(newBiz);
      if (initialCards.length > 0) {
        await supabase.from('nfc_cards').insert(
          initialCards.map((c) => ({
            id: c.id,
            card_code: c.cardCode,
            business_id: bizId,
            status: 'ACTIVE',
            total_taps: 0,
          }))
        );
      }
    } catch (e) {
      console.warn('Could not save new business to Supabase:', e);
    }

    // Reset inputs
    setNewName('');
    setNewCategory('');
    setNewSlug('');
    setNewPhone('');
    setNewCardCode('');
  };

  // Copy URL helper
  const handleCopyUrl = (slug: string) => {
    const fullUrl = `${getAppBaseUrl()}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  // Filtered businesses
  const filtered = businesses.filter((b) => {
    const matchQuery =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.cards || []).some((c) => c.cardCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchPlan = filterPlan === 'ALL' || b.plan === filterPlan;

    return matchQuery && matchPlan;
  });

  // Calculate SaaS global metrics
  const totalCards = businesses.reduce((acc, b) => acc + (b.cards?.length || 0), 0);
  const totalTaps = businesses.reduce(
    (acc, b) => acc + (b.cards || []).reduce((sum, c) => sum + (c.totalTaps || 0), 0),
    0
  );

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verificando credenciales de Super Administrador...</p>
        </div>
      </div>
    );
  }

  // 403 BARRIER: If not logged in or role is not SUPER_ADMIN
  if (!session || session.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-rose-900/50 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/50">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded-full border border-rose-800/50">
              Error 403 • Acceso Denegado
            </span>
            <h2 className="text-xl font-extrabold text-white mt-3">Área de Super Administrador</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              El directorio central de empresas y control de tenants del SaaS están reservados exclusivamente para el Super Administrador de la plataforma.
            </p>
            {session?.role === 'CLIENT' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
                <span className="text-[11px] font-semibold text-amber-300 block">
                  Cuenta actual: Cliente PyME
                </span>
                <span className="text-xs text-slate-300 block font-bold mt-0.5">
                  {session.name}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Tu cuenta sólo tiene autorización para administrar tu propia tienda.
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {session?.role === 'CLIENT' && (
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Ir al Panel de Mi Tienda</span>
              </Link>
            )}

            <Link
              href="/login"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Iniciar Sesión como Super Admin</span>
            </Link>

            <Link
              href="/"
              className="w-full py-2 text-xs text-slate-500 hover:text-slate-300 block transition-colors"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/20">
              <span className="text-xl">👑</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight">TapCard</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Super Admin SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Directorio Central de Empresas & Tarjetas NFC
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700/60"
            >
              Inicio
            </Link>

            <button
              onClick={() => setIsNewModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Negocio</span>
            </button>

            <button
              onClick={handleLogout}
              title="Cerrar sesión de Super Admin"
              className="flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-400 hover:bg-rose-900/50 text-xs font-semibold transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Global SaaS Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Empresas Registradas</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {businesses.length}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Tenants Activos en el SaaS
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Chips NFC Vinculados</span>
              <Smartphone className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalCards}
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              Tarjetas Físicas Emitidas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Toques NFC Globales</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              {totalTaps}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              Interacciones Registradas
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Disponibilidad del SaaS</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              99.9%
            </div>
            <span className="text-[11px] text-cyan-400 font-medium">
              Servidores Edge en Vivo
            </span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, giro, slug o chip..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">Plan:</span>
            {['ALL', 'STARTER', 'PRO', 'ENTERPRISE'].map((plan) => (
              <button
                key={plan}
                onClick={() => setFilterPlan(plan)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filterPlan === plan
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-700/60'
                }`}
              >
                {plan === 'ALL' ? 'Todos' : plan}
              </button>
            ))}
          </div>
        </div>

        {/* Informative Cards Grid (Directorio de Negocios) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Empresas y Negocios en la Plataforma ({filtered.length})
            </h2>
            <span className="text-xs text-slate-400">
              Haz clic en Administrar para editar su perfil y botones en vivo
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-800/40 border border-slate-700">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No se encontraron empresas</h3>
              <p className="text-xs text-slate-400 mt-1">
                Intenta con otro término de búsqueda o registra un nuevo cliente en el SaaS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((biz) => {
                const cardCount = biz.cards?.length || 0;
                const totalBizTaps = (biz.cards || []).reduce((acc, c) => acc + (c.totalTaps || 0), 0);

                return (
                  <div
                    key={biz.id}
                    className="flex flex-col justify-between rounded-3xl bg-slate-800/90 border border-slate-700/90 shadow-xl overflow-hidden hover:border-slate-600 transition-all duration-300 group"
                  >
                    <div>
                      {/* Banner Cover Top */}
                      <div className="relative h-28 w-full bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
                        {biz.bannerUrl ? (
                          <img
                            src={biz.bannerUrl}
                            alt=""
                            className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-indigo-900/60" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent pointer-events-none" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
                            {biz.plan || 'PRO'}
                          </span>
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Activo
                          </span>
                        </div>
                      </div>

                      {/* Avatar and Info Header */}
                      <div className="px-5 pb-4 -mt-10 relative">
                        <div className="flex items-end justify-between mb-3">
                          <div className="w-16 h-16 rounded-2xl border-4 border-slate-800 bg-slate-900 shadow-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {biz.logoUrl ? (
                              <img
                                src={biz.logoUrl}
                                alt={biz.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xl font-black text-blue-400 uppercase">
                                {biz.name.slice(0, 2)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleCopyUrl(biz.slug)}
                            title="Copiar enlace público"
                            className="p-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
                          >
                            {copiedSlug === biz.slug ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="text-[10px] font-mono">/{biz.slug}</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-base text-white tracking-tight truncate">
                              {biz.name}
                            </h3>
                            {biz.isVerified && (
                              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-medium truncate mt-0.5">
                            {biz.category}
                          </p>
                        </div>

                        {/* Informative Stats Pills */}
                        <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-900/60 border border-slate-700/60 text-center">
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                              Chips NFC
                            </span>
                            <span className="text-sm font-bold text-white">
                              {cardCount}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                              Lecturas
                            </span>
                            <span className="text-sm font-bold text-emerald-400">
                              {totalBizTaps}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[10px] text-slate-500 uppercase font-semibold">
                              Botones
                            </span>
                            <span className="text-sm font-bold text-blue-400">
                              {biz.links.length}
                            </span>
                          </div>
                        </div>

                        {/* Linked NFC Card Badges */}
                        <div className="mt-3.5 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                            <span>Chips Asignados:</span>
                            <button
                              type="button"
                              onClick={() => handleAddCardToBusiness(biz.id)}
                              className="text-blue-400 hover:text-blue-300 hover:underline text-[10px]"
                            >
                              + Asignar Chip
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {(biz.cards || []).length > 0 ? (
                              (biz.cards || []).map((card) => (
                                <Link
                                  key={card.id}
                                  href={`/t/${card.cardCode}`}
                                  target="_blank"
                                  title={`Probar redirección de chip ${card.cardCode} (${card.totalTaps} lecturas)`}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-700 hover:border-blue-500 hover:text-blue-300 transition-colors"
                                >
                                  <Smartphone className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>#{card.cardCode}</span>
                                </Link>
                              ))
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">
                                Sin chips físicos asociados aún
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="p-4 border-t border-slate-700/80 bg-slate-900/40 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDashboard(biz)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-95 transition-all"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Administrar Panel</span>
                      </button>

                      <Link
                        href={`/${biz.slug}`}
                        target="_blank"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors active:scale-95"
                        title="Ver micro-landing móvil"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteBusiness(biz.id, biz.name)}
                        className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/60 transition-colors active:scale-95"
                        title="Eliminar empresa de Supabase"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Modal: Registrar Nueva Empresa / Cliente */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Registrar Nueva Empresa</h3>
                  <p className="text-xs text-slate-400">
                    Crea un nuevo perfil digital con panel independiente en tu SaaS
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Comercial del Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    setNewName(e.target.value);
                    if (!newSlug) {
                      setNewSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]/g, '-')
                          .replace(/-+/g, '-')
                      );
                    }
                  }}
                  placeholder="Ej. Taquería El Pastor / Dr. García Odontología"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Giro / Categoría *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Ej. Restaurante / Salud / Uñas"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enlace Personalizado (Slug) *
                  </label>
                  <div className="flex items-center rounded-xl bg-slate-800 border border-slate-700 px-3">
                    <span className="text-xs text-slate-500">tapcard.link/</span>
                    <input
                      type="text"
                      required
                      value={newSlug}
                      onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full py-2.5 bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Código de Tarjeta NFC Física
                  </label>
                  <input
                    type="text"
                    value={newCardCode}
                    onChange={(e) => setNewCardCode(e.target.value.toUpperCase())}
                    placeholder="Ej. VIP-1001 (opcional)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-amber-400 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Plan SaaS Asignado
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['STARTER', 'PRO', 'ENTERPRISE'] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewPlan(p)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                        newPlan === p
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
                >
                  Registrar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
