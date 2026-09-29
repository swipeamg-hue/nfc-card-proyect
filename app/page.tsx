'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Zap,
  QrCode,
  ShieldCheck,
  BarChart3,
  SlidersHorizontal,
  ArrowRight,
  ExternalLink,
  Download,
  CheckCircle2,
  LogIn,
  LogOut,
  UserPlus,
  Layers,
  Sparkles,
  Users,
  CreditCard,
  PhoneCall,
  Share2,
  Check,
  Clock,
  Lock,
} from 'lucide-react';
import { AuthUser } from '@/types/auth';
import { getActiveSession, logout } from '@/lib/auth';

export default function HomePage() {
  const [session, setSession] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        setSession(getActiveSession());
      }
    } catch {}
  }, []);

  const handleLogout = () => {
    logout();
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
            <a href="#beneficios" className="hover:text-white transition-colors">
              Beneficios
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
                    className="text-xs font-bold px-2.5 sm:px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all border border-amber-500/30 flex items-center gap-1"
                  >
                    <span>👑</span>
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
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/50">
                Planes Transparentes
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
                Comienza Gratis y Escala a tu Ritmo
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Sin contratos forzosos. Prueba gratis todas las funciones de la plataforma.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plan 1: Prueba Gratis */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800/50">
                    Prueba
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">Prueba Gratuita</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-black text-white">$0</span>
                    <span className="text-xs text-slate-400"> / 14 días</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Micro-landing personalizada en vivo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Panel con simulador móvil en tiempo real</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Descarga vCard 3.0 para contactos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Código QR para compartir digitalmente</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all active:scale-95 block"
                >
                  Probar Gratis Ahora
                </Link>
              </div>

              {/* Plan 2: PyME Pro (Destacado) */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-blue-500 shadow-xl shadow-blue-500/10 flex flex-col justify-between relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                  Más Popular
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                    PyME Pro
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">Negocio & Profesional</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-black text-white">$499</span>
                    <span className="text-xs text-slate-400"> / año</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>1 Tarjeta física NFC con chip NTAG grabado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Impresión premium con tu logotipo y QR</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Micro-landing y panel ilimitado 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Analíticas de toques NFC y clics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Catálogo PDF y botones ilimitados</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center shadow-lg shadow-blue-600/30 transition-all active:scale-95 block"
                >
                  Comenzar con Prueba Gratis
                </Link>
              </div>

              {/* Plan 3: Corporativo / Flotillas */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded-full border border-purple-800/50">
                    Empresas
                  </span>
                  <h3 className="text-xl font-bold text-white mt-3">Flotillas & Equipos</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-black text-white">A Medida</span>
                    <span className="text-xs text-slate-400"> / según volumen</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Tarjetas NFC para todo tu equipo de ventas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Directorio central y control de perfiles</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Tarjetas en metal o acabado mate exclusivo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Soporte prioritario y capacitación</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/login?tab=register"
                  className="mt-6 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center border border-slate-700 transition-all active:scale-95 block"
                >
                  Solicitar Cotización Gratis
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

          <div className="flex items-center gap-6 text-slate-400">
            <a href="#servicios" className="hover:text-white transition-colors">
              Servicios
            </a>
            <a href="#como-funciona" className="hover:text-white transition-colors">
              Cómo Funciona
            </a>
            <a href="#planes" className="hover:text-white transition-colors">
              Precios
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Acceso a Clientes
            </Link>
          </div>

          <div>
            TapCard © {new Date().getFullYear()} • Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
