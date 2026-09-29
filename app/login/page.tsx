'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Smartphone,
  Lock,
  Mail,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Zap,
  Info,
  ExternalLink,
  X,
  Phone,
} from 'lucide-react';
import { login, loginAsync, registerClient, registerClientAsync, getActiveSession, setActiveSession } from '@/lib/auth';
import { supabase, SUPABASE_URL } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';

function GoogleOfficialIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google OAuth Guide Modal
  const [showGoogleGuideModal, setShowGoogleGuideModal] = useState(false);

  // First-time Google Onboarding state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{ email: string; name: string } | null>(null);
  const [onboardBusinessName, setOnboardBusinessName] = useState('');
  const [onboardCategory, setOnboardCategory] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState('');

  // Check active session and Google OAuth callback on mount
  useEffect(() => {
    const session = getActiveSession();
    if (session) {
      if (session.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'register' || tabParam === 'trial') {
        setActiveTab('register');
      }
    } catch {}

    // Check if user just returned from Supabase Google OAuth
    async function checkGoogleAuth() {
      try {
        const { data: { session: supaSession } } = await supabase.auth.getSession();
        if (supaSession?.user) {
          const email = supaSession.user.email?.toLowerCase().trim();
          const fullName =
            supaSession.user.user_metadata?.full_name ||
            supaSession.user.user_metadata?.name ||
            '';

          if (!email) return;

          // EXCLUSIVE SUPER ADMIN CHECK
          if (email === 'swipeamg@gmail.com') {
            const superAdminUser: AuthUser = {
              id: 'usr-admin-swipeamg',
              email: 'swipeamg@gmail.com',
              name: fullName || 'Super Administrador (SwipeAMG)',
              role: 'SUPER_ADMIN',
              createdAt: new Date().toISOString(),
            };
            setActiveSession(superAdminUser);
            router.push('/admin');
            return;
          }

          // Check if this user is already registered with a business in app_users
          const { data: dbUser } = await supabase
            .from('app_users')
            .select('*')
            .eq('email', email)
            .maybeSingle();

          if (dbUser && (dbUser.business_id || dbUser.role === 'SUPER_ADMIN')) {
            // Existing user: Log them directly into their business dashboard
            const safeUser: AuthUser = {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
              role: dbUser.role,
              businessId: dbUser.business_id,
              businessSlug: dbUser.business_slug,
              createdAt: dbUser.created_at,
            };
            setActiveSession(safeUser);
            router.push(safeUser.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard');
            return;
          }

          // First time user via Google! Prompt onboarding to gather business info
          setGoogleUserData({
            email,
            name: fullName || email.split('@')[0],
          });
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.warn('OAuth session check notice:', err);
      }
    }

    checkGoogleAuth();
  }, [router]);

  // Handle Google OAuth trigger
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/login`,
        },
      });

      if (error) {
        setIsGoogleLoading(false);
        // If Google provider hasn't been configured in Supabase yet, show helpful guide modal
        if (
          error.message.toLowerCase().includes('not enabled') ||
          error.message.toLowerCase().includes('unsupported provider') ||
          error.message.toLowerCase().includes('provider is not')
        ) {
          setShowGoogleGuideModal(true);
        } else {
          setErrorMsg(`Error de conexión con Google: ${error.message}`);
        }
      }
    } catch (err: any) {
      setIsGoogleLoading(false);
      setErrorMsg(err.message || 'Error al conectar con Google');
    }
  };

  // Complete Google Registration with Business Onboarding
  const handleCompleteGoogleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUserData || !onboardBusinessName.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerClientAsync({
        userName: googleUserData.name,
        email: googleUserData.email,
        pass: 'google-oauth-' + Date.now(),
        businessName: onboardBusinessName.trim(),
        category: onboardCategory.trim() || 'Servicios Generales',
      });

      if (res.success && res.user) {
        setIsOnboardingOpen(false);
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Error al guardar los datos del negocio');
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error al completar el registro');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAsync(loginEmail, loginPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        if (res.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(res.error || 'Credenciales inválidas');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error al iniciar sesión');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await registerClientAsync({
        userName: regName,
        email: regEmail,
        pass: regPassword,
        businessName: regBusinessName,
        category: regCategory,
      });
      setIsLoading(false);
      if (res.success && res.user) {
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Error al crear la cuenta');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error al crear la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">TapCard</span>
            <span className="text-xs text-blue-400 font-semibold block -mt-1">
              Plataforma SaaS NFC
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
        >
          Volver a Inicio
        </Link>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {activeTab === 'login' ? 'Iniciar Sesión' : 'Crea tu Negocio Digital'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'login'
                ? 'Accede a tu panel para personalizar tus tarjetas y enlaces'
                : 'Registra tu empresa y obtén tu perfil móvil interactivo en 1 minuto'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-2xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Prueba Gratis (Registro)
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 border border-slate-300 group disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleOfficialIcon className="w-4 h-4" />
              )}
              <span>
                {activeTab === 'login' ? 'Continuar con Google' : 'Registrarme con Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider relative">
                o con correo
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@negocio.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Iniciando sesión...' : 'Entrar al Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de tu Negocio o Marca *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    placeholder="Ej. Tacos El Pastor, Clínica Dental..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giro o Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  placeholder="Ej. Restaurante, Salón de Belleza, Consultoría..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tu Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Alejandro Pérez"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico (Tu usuario) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contacto@miempresa.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Segura *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creando tu cuenta y tienda...' : 'Comenzar Mi Prueba Gratis'}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sin tarjeta de crédito requerida • Acceso inmediato</span>
                </span>
              </div>
            </form>
          )}

          {/* Footer note inside card */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            {activeTab === 'login' ? (
              <p className="text-xs text-slate-400">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Regístrate e inicia tu prueba gratis
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: FIRST TIME GOOGLE USER ONBOARDING (Crea el negocio del cliente) */}
      {isOnboardingOpen && googleUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                ¡Bienvenido a TapCard NFC!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conectado como <strong className="text-white">{googleUserData.email}</strong>. Configura tu negocio en 1 solo paso para generar tu tarjeta digital.
              </p>
            </div>

            <form onSubmit={handleCompleteGoogleOnboarding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre de tu Empresa o Negocio *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={onboardBusinessName}
                    onChange={(e) => setOnboardBusinessName(e.target.value)}
                    placeholder="Ej. Mariscos Los Arcos, Salón Bella..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Giro o Categoría Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={onboardCategory}
                  onChange={(e) => setOnboardCategory(e.target.value)}
                  placeholder="Ej. Restaurante, Clínica Estética, Inmobiliaria..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  WhatsApp o Teléfono (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={onboardPhone}
                    onChange={(e) => setOnboardPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <span>{isLoading ? 'Creando perfil digital...' : 'Comenzar a Diseñar mi Tarjeta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GUÍA PASO A PASO PARA ACTIVAR GOOGLE EN SUPABASE */}
      {showGoogleGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowGoogleGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Activar Google en Supabase</h3>
                <p className="text-xs text-slate-400">Guía rápida de 3 pasos para habilitar el inicio de sesión real</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                <div>
                  <p className="font-semibold text-white">Entra a tu consola de Supabase:</p>
                  <p className="text-slate-400 mt-0.5">Ve a <strong>Authentication &gt; Providers</strong> y haz clic en <strong>Google</strong>.</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                <div>
                  <p className="font-semibold text-white">Copia tu URL de Callback de Supabase:</p>
                  <div className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[10px] text-cyan-300 break-all select-all">
                    {SUPABASE_URL}/auth/v1/callback
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Pega esta URL en tu consola de Google Cloud (OAuth 2.0 Client ID).</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                <div>
                  <p className="font-semibold text-white">Activa el interruptor en Supabase:</p>
                  <p className="text-slate-400 mt-0.5">Pega el <strong>Client ID</strong> y <strong>Client Secret</strong> que te da Google y presiona <strong>Save</strong>.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">Mientras tanto, el registro manual por formulario funciona al 100%.</span>
              <button
                type="button"
                onClick={() => setShowGoogleGuideModal(false)}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-500">
        TapCard SaaS Multi-Tenant • Tarjetas NFC & QR Corporativas
      </footer>
    </div>
  );
}
