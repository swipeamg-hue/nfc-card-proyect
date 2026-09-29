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
} from 'lucide-react';
import { login, registerClient, getActiveSession } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState('');

  // Check session and URL query parameter on mount
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
  }, [router]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(loginEmail, loginPassword);
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
    }, 300);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = registerClient({
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
    }, 400);
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

          {/* LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{isLoading ? 'Comprobando acceso...' : 'Entrar a mi Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM (NEW TENANT) */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre Comercial de tu Negocio *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    placeholder="Ej. Barbería Clásica / La Parrilla"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giro / Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  placeholder="Ej. Restaurante, Belleza, Consultoría, etc."
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

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-500">
        TapCard SaaS Multi-Tenant • Tarjetas NFC & QR Corporativas
      </footer>
    </div>
  );
}
