'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Zap,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Download,
  CheckCircle2,
  LogIn,
  LogOut,
  Sparkles,
  Users,
  CreditCard,
  Check,
  Lock,
  Cookie,
  FileText,
  X,
  Crown,
  Star,
} from 'lucide-react';
import { AuthUser } from '@/types/auth';
import { getActiveSession, setActiveSession, logout } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function HomePage() {
  const [session, setSession] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      return getActiveSession();
    }
    return null;
  });
  const [legalModal, setLegalModal] = useState<'privacy' | 'cookies' | 'terms' | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const localSession = getActiveSession();
        if (localSession) {
          return;
        }

        // Check Supabase cloud session if localStorage doesn't have an active session yet
        supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
          if (currentSession?.user?.email) {
            const email = currentSession.user.email.toLowerCase().trim();
            if (email === 'swipeamg@gmail.com') {
              const superAdminUser: AuthUser = {
                id: 'usr-admin-swipeamg',
                email: 'swipeamg@gmail.com',
                name: 'Super Administrador (SwipeAMG)',
                role: 'SUPER_ADMIN',
                createdAt: new Date().toISOString(),
              };
              setActiveSession(superAdminUser);
              setSession(superAdminUser);
              return;
            }

            const { data: dbUser } = await supabase
              .from('app_users')
              .select('*')
              .eq('email', email)
              .maybeSingle();

            if (dbUser) {
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
              setSession(safeUser);
            }
          }
        });
      }
    } catch {}
  }, []);

  const handleLogout = async () => {
    await logout();
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Modern SaaS Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo & Slogan */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg tracking-tight">TapCard</span>
              <span className="text-[10px] sm:text-xs text-blue-400 font-semibold block -mt-1">
                SaaS NFC & QR Corporativo
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#servicios" className="hover:text-white transition-colors">
              Servicios
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo Funciona
            </a>
            <a href="#planes" className="hover:text-white transition-colors">
              Planes
            </a>
            <Link
              href="/nexosoluciones"
              target="_blank"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>Ver Demo en Vivo</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                {session.role === 'SUPER_ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all border border-amber-500/30 flex items-center gap-1.5"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Portal Admin</span>
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  className="text-xs font-semibold px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>{session.role === 'SUPER_ADMIN' ? 'Panel SaaS' : 'Mi Panel'}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-2 rounded-xl border border-rose-900/40 text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 transition-all border border-slate-800 flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden xs:inline">Iniciar Sesión</span>
                  <span className="xs:hidden">Entrar</span>
                </Link>

                <Link
                  href="/login?tab=register"
                  className="text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Prueba Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {/* HERO SECTION */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-300 mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
            <span>Tarjetas Inteligentes NFC & QR Corporativas de Próxima Generación</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Transforma Cada Saludo en Clientes con{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Tarjetas Digitales NFC
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Acerca tu tarjeta física al celular de tu prospecto y comparte al instante tu WhatsApp,
            catálogos, menú, redes sociales y guarda tus datos directamente en su agenda sin instalar ninguna app.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/login?tab=register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 text-center group"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Comenzar Prueba Gratis</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/nexosoluciones"
              target="_blank"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm shadow-md transition-all active:scale-95 text-center"
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              <span>Ver Ejemplo Móvil en Vivo</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          {/* Subtext Trust Note */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Prueba gratis por 14 días
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Sin tarjeta de crédito requerida
            </span>
            <span className="flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Activación instantánea
            </span>
          </div>

          {/* Key Compatibility Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">100% Compatible</span>
                <span className="text-[10px] text-slate-400">iOS & Android nativo</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Carga en &lt;400ms</span>
                <span className="text-[10px] text-slate-400">Velocidad ultrarrápida</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Guardado vCard</span>
                <span className="text-[10px] text-slate-400">Directo a contactos</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-xs font-bold text-white">Sin Apps Extra</span>
                <span className="text-[10px] text-slate-400">Todo en navegador web</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: NUESTROS SERVICIOS Y SOLUCIONES */}
        <section id="servicios" className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/50">
                Nuestros Servicios
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                Soluciones Integrales para tu Identidad Digital
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Todo lo que necesitas para sustituir las tarjetas de papel obsoletas por una experiencia interactiva que enamora a tus clientes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Servicio 1: Tarjetas Físicas NFC */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Tarjetas Físicas Inteligentes NFC
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fabricadas en PVC mate de alto gramaje o metal de lujo con microchip NTAG integrado.
                    Resistentes al agua, sin necesidad de batería y diseñadas para durar años.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Impresión con tu logo y código QR de respaldo</span>
                </div>
              </div>

              {/* Servicio 2: Micro-Landing Móvil */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Micro-Landing Móvil Interactiva
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Tu perfil corporativo carga en menos de 400ms. Muestra foto de portada, logo, biografía profesional,
                    botones táctiles con respuesta táctil, redes sociales y ubicación en Google Maps.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Cero fricción: No requiere instalar apps</span>
                </div>
              </div>

              {/* Servicio 3: Descarga vCard en 1 Toque */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Guardado en Agenda en 1 Toque (.vcf)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Con un solo clic en «Guardar Contacto», tu información completa se transfiere directamente
                    a los contactos del smartphone de tu cliente sin errores tipográficos.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Compatible nativo con iOS y Android</span>
                </div>
              </div>

              {/* Servicio 4: Panel Autoadministrable */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Panel Autoadministrable en Tiempo Real
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Actualiza tu teléfono, agrega promociones, cambia tu catálogo o enlaces a redes cuando quieras.
                    Tus tarjetas físicas se actualizarán automáticamente sin necesidad de reimprimirlas.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Con simulador móvil interactivo en vivo</span>
                </div>
              </div>

              {/* Servicio 5: Métricas & Analíticas */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Métricas & Códigos QR Dinámicos
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Conoce el impacto real de tus interacciones: cuántos tocaron el chip NFC vs cuántos escanearon tu QR,
                    cuántos abrieron tu WhatsApp y descarga códigos QR en alta resolución para folletos y mantas.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Generador de códigos QR listos para imprenta</span>
                </div>
              </div>

              {/* Servicio 6: Flotillas y Equipos */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Flotillas & Equipos de Ventas
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Solución corporativa para inmobiliarias, consultorios, firmas legales y equipos comerciales.
                    Mantén la identidad de marca unificada con tarjetas personalizadas para cada colaborador.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-1.5 text-xs font-semibold text-indigo-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Control de usuarios y administración SaaS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: CÓMO FUNCIONA */}
        <section id="como-funciona" className="py-16 sm:py-24 border-t border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-800/50">
                Paso a Paso
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                ¿Cómo Funciona TapCard?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Empieza a digitalizar tus ventas en 3 simples pasos sin complicaciones técnicas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Paso 1 */}
              <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
                  1
                </div>
                <h3 className="text-base font-bold text-white mb-2">Crea tu Cuenta Gratis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Regístrate en menos de 1 minuto ingresando el nombre y giro de tu negocio. Se generará automáticamente tu tienda digital.
                </p>
              </div>

              {/* Paso 2 */}
              <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-600/30">
                  2
                </div>
                <h3 className="text-base font-bold text-white mb-2">Personaliza en Tiempo Real</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ingresa a tu panel privado, añade tus números de WhatsApp, catálogos, redes sociales y verifica los cambios en el simulador móvil en vivo.
                </p>
              </div>

              {/* Paso 3 */}
              <div className="relative p-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-600/30">
                  3
                </div>
                <h3 className="text-base font-bold text-white mb-2">Comparte y Multiplica Clientes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Acerca tu tarjeta física NFC al teléfono del cliente o muéstrale tu código QR. Tus datos se guardarán de inmediato en su agenda.
                </p>
              </div>
            </div>

            {/* Registration Limitation Callout */}
            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-900/50 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Privacidad & Acceso Restringido</h4>
                  <p className="text-xs text-slate-400">
                    El panel de edición y las métricas requieren una cuenta registrada para garantizar que solo tú puedas modificar tu negocio.
                  </p>
                </div>
              </div>
              <Link
                href="/login?tab=register"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md whitespace-nowrap active:scale-95 transition-all"
              >
                Registrarme Gratis
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: PLANES Y PRECIOS */}
        <section id="planes" className="py-16 sm:py-24 border-t border-slate-800/80 bg-slate-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
                Planes & Equipamiento Físico
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                Tarjetas NFC, Displays Acrílicos y Plataforma Digital
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Equipa a tu negocio con tarjetas inteligentes y acrílicos para tu mostrador o caja. Todos los planes incluyen 14 días de prueba gratis sin tarjeta.
              </p>
            </div>

            {/* Free Trial Banner Notice */}
            <div className="mb-10 p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/60 max-w-3xl mx-auto flex items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-white">
                    ¡Todos los planes incluyen 14 Días de Prueba Gratuita!
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Comienza hoy sin ingresar tarjeta de crédito. Explora tu panel y micro-landing inmediatamente.
                  </span>
                </div>
              </div>
              <Link
                href="/login?tab=register"
                className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md whitespace-nowrap active:scale-95 transition-all"
              >
                Probar Gratis
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Plan 1: Starter */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/50">
                      Starter
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">1 a 3 Tarjetas</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-3">Plan Starter</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Para profesionistas independientes, doctores, consultores y emprendedores.
                  </p>

                  <div className="mt-4 mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$49</span>
                      <span className="text-xs font-bold text-slate-400">MXN / mes</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                      Incluye de 1 a 3 tarjetas físicas NFC
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>De 1 a 3 Tarjetas Inteligentes NFC</strong> con microchip NTAG</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Micro-landing móvil personalizada 24/7</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Descarga directa vCard 3.0 en agenda de clientes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Botón directo de WhatsApp con mensaje automático</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Panel autoadministrable con simulador en tiempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Código QR dinámico para compartir digitalmente</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all active:scale-95 block shadow-sm"
                >
                  Comenzar Prueba Gratis (Starter)
                </Link>
              </div>

              {/* Plan 2: PRO (Destacado) */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/70 via-slate-900 to-slate-900 border-2 border-blue-500 shadow-2xl shadow-blue-500/15 flex flex-col justify-between relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-black uppercase tracking-wider shadow flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>Más Popular • Recomendado</span>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                      PRO
                    </span>
                    <span className="text-[11px] text-cyan-400 font-bold">4 a 8 Tarjetas + 1 Acrílico</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-3">Plan PRO</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ideal para restaurantes, consultorios, tiendas y despachos que reciben clientes.
                  </p>

                  <div className="mt-4 mb-5 p-3 rounded-2xl bg-blue-950/50 border border-blue-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$69</span>
                      <span className="text-xs font-bold text-slate-400">MXN / mes</span>
                    </div>
                    <span className="text-[10px] text-cyan-300 font-semibold block mt-0.5">
                      4 a 8 tarjetas NFC + 1 Acrílico para Mostrador
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>De 4 a 8 Tarjetas Inteligentes NFC</strong> para tu equipo</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 rounded-xl bg-blue-600/15 border border-blue-500/30">
                      <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white font-semibold">
                        <strong>1 Display Acrílico Inteligente NFC</strong> para mostrador, caja o recepción
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Micro-landing corporativa sin límite de visitas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Botón de Catálogo de productos / menú PDF y Google Maps</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Métricas en vivo: Toques NFC vs escaneos QR</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Soporte técnico preferencial</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-600/30 transition-all active:scale-95 block"
                >
                  Comenzar Prueba Gratis (PRO)
                </Link>
              </div>

              {/* Plan 3: Enterprise */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/50">
                      Enterprise
                    </span>
                    <span className="text-[11px] text-purple-300 font-bold">8 a 12 Tarjetas + 1 Acrílico</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-3">Plan Enterprise</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Para flotillas comerciales, agencias, inmobiliarias y empresas consolidadas.
                  </p>

                  <div className="mt-4 mb-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">$99</span>
                      <span className="text-xs font-bold text-slate-400">MXN / mes</span>
                    </div>
                    <span className="text-[10px] text-purple-300 font-semibold block mt-0.5">
                      8 a 12 tarjetas NFC + 1 Acrílico para Mostrador
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span><strong>De 8 a 12 Tarjetas Inteligentes NFC</strong> para tu flotilla</span>
                    </li>
                    <li className="flex items-start gap-2 p-2 rounded-xl bg-purple-950/40 border border-purple-800/40">
                      <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                      <span className="text-white font-semibold">
                        <strong>1 Display Acrílico Inteligente NFC</strong> para showroom o recepción
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Directorio corporativo y control de usuarios</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Personalización completa de manual de marca y colores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Métricas de rendimiento por cada miembro del equipo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Soporte VIP prioritario 24/7 y asesoría de onboarding</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all active:scale-95 block shadow-sm"
                >
                  Comenzar Prueba Gratis (Enterprise)
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA BANNER */}
        <section className="py-16 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-cyan-900/40 border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                ¿Listo para Digitalizar tus Tarjetas de Presentación?
              </h2>
              <p className="text-sm text-slate-300 max-w-xl mx-auto mt-3">
                Únete a miles de profesionales y negocios que ya causan una primera impresión inolvidable.
                Comienza tu prueba sin tarjeta de crédito.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login?tab=register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Crear Mi Cuenta Gratis Ahora</span>
                </Link>
                <Link
                  href="/nexosoluciones"
                  target="_blank"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-sm transition-all"
                >
                  Ver Demostración
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Clean Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              T
            </div>
            <span className="font-bold text-slate-300">TapCard SaaS</span>
            <span>• Tecnología NFC & QR para Empresas</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-slate-400">
            <button
              type="button"
              onClick={() => setLegalModal('privacy')}
              className="hover:text-blue-400 transition-colors text-xs cursor-pointer flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span>Política de Privacidad</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => setLegalModal('cookies')}
              className="hover:text-blue-400 transition-colors text-xs cursor-pointer flex items-center gap-1"
            >
              <Cookie className="w-3.5 h-3.5 text-amber-500" />
              <span>Política de Cookies</span>
            </button>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => setLegalModal('terms')}
              className="hover:text-blue-400 transition-colors text-xs cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-500" />
              <span>Términos y Condiciones</span>
            </button>
          </div>

          <div>
            TapCard © {new Date().getFullYear()} • Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* MODAL DE POLÍTICAS LEGALES */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                  {legalModal === 'privacy' && <ShieldCheck className="w-5 h-5 text-blue-400" />}
                  {legalModal === 'cookies' && <Cookie className="w-5 h-5 text-amber-400" />}
                  {legalModal === 'terms' && <FileText className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {legalModal === 'privacy' && 'Política de Privacidad'}
                    {legalModal === 'cookies' && 'Política de Cookies'}
                    {legalModal === 'terms' && 'Términos y Condiciones del Servicio'}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    TapCard SaaS • Actualizado para 2026
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scrollable */}
            <div className="my-4 overflow-y-auto pr-2 space-y-4 text-xs text-slate-300 leading-relaxed max-h-[55vh]">
              {legalModal === 'privacy' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                    <strong className="block text-white mb-1">1. Compromiso de Protección de Datos</strong>
                    En TapCard SaaS respetamos tu privacidad. Tus datos personales y de tu negocio son utilizados exclusivamente para la generación de tu micro-landing digital, tarjetas NFC y descarga de tu contacto vCard.
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">2. No Venta de Información</h4>
                    <p>Bajo ninguna circunstancia vendemos, alquilamos ni compartimos tus números telefónicos, correos electrónicos ni la información de los clientes que escanean tus tarjetas con terceros para fines de publicidad masiva o spam.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">3. Derechos de Control y Supresión (ARCO)</h4>
                    <p>Tienes en todo momento el control absoluto para modificar, actualizar o dar de baja la información de tu tarjeta digital directamente desde tu panel de administración.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">4. Seguridad y Cifrado SSL</h4>
                    <p>Todas las comunicaciones y accesos a tu panel se transmiten bajo cifrado seguro SSL/TLS de 256 bits en servidores de alta disponibilidad.</p>
                  </div>
                </>
              )}

              {legalModal === 'cookies' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                    <strong className="block text-white mb-1">1. ¿Qué son y cómo usamos las Cookies?</strong>
                    Las cookies son pequeños archivos de texto que se almacenan de forma segura en tu navegador para permitir el funcionamiento correcto del software.
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">2. Cookies Estrictamente Necesarias</h4>
                    <p>Utilizamos cookies y almacenamiento local exclusivamente para mantener iniciada tu sesión de forma segura, recordar tu tienda asignada y guardar tus preferencias de diseño.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">3. Sin Rastreo Invasivo de Terceros</h4>
                    <p>Nuestra plataforma no emplea cookies de rastreo publicitario invasivo ni monitorea tu actividad en otros sitios web.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">4. Administración y Desactivación</h4>
                    <p>Puedes deshabilitar o limpiar las cookies en cualquier momento a través del menú de configuración de tu navegador (Chrome, Safari, Edge, Firefox).</p>
                  </div>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                    <strong className="block text-white mb-1">1. Aceptación del Servicio</strong>
                    Al registrarte en TapCard SaaS aceptas los presentes términos para la creación, personalización y uso de tarjetas inteligentes NFC y códigos QR corporativos.
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">2. Prueba Gratuita de 14 Días</h4>
                    <p>El registro otorga acceso completo a una prueba sin costo durante 14 días sin necesidad de ingresar tarjetas bancarias ni compromisos de permanencia forzosa.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">3. Tarjetas Físicas y Displays Acrílicos</h4>
                    <p>El equipamiento físico (tarjetas con chip NTAG y displays de mostrador) se suministran listos para usar y vinculados a tu enlace oficial. El usuario es responsable de la veracidad de los datos que publica.</p>
                  </div>

                  <div>
                    <h4 className="font-bold text-white mb-1">4. Disponibilidad y Garantía</h4>
                    <p>Ofrecemos una garantía de disponibilidad del 99.9% en nuestra red de servidores para asegurar que tus clientes siempre puedan acceder a tu perfil al hacer tap con tu tarjeta.</p>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModal(null)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                Entendido y Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
