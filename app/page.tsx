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
  CheckCircle,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col justify-between">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight">TapCard</span>
              <span className="text-xs text-blue-400 font-semibold block -mt-1">
                SaaS NFC & QR Corporativo
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all border border-slate-700/60"
            >
              Panel PyME
            </Link>
            <Link
              href="/nexosoluciones"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              Demo Móvil Nexo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-xs font-semibold text-blue-300 mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Micro-Landing Móvil Optimizada para Carga en &lt;400ms</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
          Tarjetas y Perfiles Digitales{' '}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            NFC para Negocios
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Convierte cada toque de tarjeta física o escaneo QR en clientes potenciales.
          Panel de administración en tiempo real con simulador móvil e integración instantánea con vCard.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/nexosoluciones"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 group"
          >
            <span>Ver Micro-Landing (Nexo Soluciones)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/t/NX-8821"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm shadow transition-all active:scale-95"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>Simular Toque NFC (NX-8821)</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm shadow transition-all active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Abrir Dashboard Split-Screen</span>
          </Link>
        </div>

        {/* Quick Test Links Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm max-w-3xl mx-auto text-left">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-blue-500" />
            Rutas de la Plataforma Disponibles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <Link
              href="/nexosoluciones"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-blue-400 block font-semibold">/nexosoluciones</span>
                <span className="text-slate-400 text-[11px]">Micro-landing pública pixel-perfect</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/t/NX-8821"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-emerald-400 block font-semibold">/t/NX-8821</span>
                <span className="text-slate-400 text-[11px]">Redirección inteligente de chip NFC</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              href="/dashboard"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-cyan-400 block font-semibold">/dashboard</span>
                <span className="text-slate-400 text-[11px]">Split-screen editor + iPhone simulator</span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </Link>

            <a
              href="/api/vcard/nexosoluciones"
              download="nexosoluciones.vcf"
              className="p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-amber-400 block font-semibold">/api/vcard/nexosoluciones</span>
                <span className="text-slate-400 text-[11px]">Descarga dinámica vCard 3.0 (.vcf)</span>
              </div>
              <Download className="w-4 h-4 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Mobile First & NFC</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Diseño idéntico al mockup con contenedor centrado, avatar superpuesto, insignias de verificación y botones táctiles `active:scale-95`.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
              <Download className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Generación vCard .vcf</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Descarga con un toque los contactos directamente en la agenda de iOS y Android con nombre, empresa, teléfonos, correos y mapas.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">Métricas & QR en Alta Calidad</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Métricas de toques NFC vs QR, clics por botón y generador de códigos QR listos para imprimir en tarjetas plásticas.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        TapCard SaaS © 2026 • Plataforma de Tarjetas de Presentación y Perfiles NFC Corporativos
      </footer>
    </div>
  );
}
