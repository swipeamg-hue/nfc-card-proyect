'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Business } from '@/types/business';
import {
  X,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  Smartphone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface PwaInstallModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  canNativePrompt?: boolean;
}

export function PwaInstallModal({
  business,
  isOpen,
  onClose,
  onNativeInstall,
  canNativePrompt = false,
}: PwaInstallModalProps) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android'>(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
      return isIOS ? 'ios' : 'android';
    }
    return 'ios';
  });

  if (!isOpen) return null;

  const customFont = business.customization?.customFontName || business.customization?.fontFamily;
  const fontStyle = customFont ? { fontFamily: `"${customFont}", sans-serif` } : undefined;
  const logo = business.logoUrl || '/images/nexo-logo.jpg';
  const isCustomLogo = logo && !logo.startsWith('/images/');

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={fontStyle}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-zinc-800 animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                Instalar App en tu Celular
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                PWA Oficial de {business.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Home Screen Preview Badge */}
        <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950/60 dark:to-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 text-center flex flex-col items-center">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Así se verá en la pantalla de tu móvil
          </span>

          {/* App Icon Squircle */}
          <div className="relative group">
            <div className="w-20 h-20 rounded-[22px] overflow-hidden shadow-xl ring-1 ring-black/10 dark:ring-white/10 bg-slate-900 flex items-center justify-center relative">
              {isCustomLogo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logo}
                  alt={business.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={logo}
                  alt={business.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Glossy reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/20 pointer-events-none" />
            </div>
            {/* Notification badge simulation */}
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
              ✓
            </div>
          </div>

          <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-100 max-w-[180px] truncate">
            {business.name}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
            Acceso directo rápido • Sin descargas de tienda
          </p>
        </div>

        {/* Native Android Instant Button (if supported) */}
        {canNativePrompt && onNativeInstall && (
          <button
            onClick={() => {
              onNativeInstall();
              onClose();
            }}
            className="w-full mb-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Instalar de Inmediato en este Celular</span>
          </button>
        )}

        {/* OS Toggle Tabs */}
        <div className="flex bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad (iOS)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android (Chrome / Samsung)</span>
          </button>
        </div>

        {/* Step-by-Step Instructions */}
        {activeTab === 'ios' ? (
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Toca el botón <span className="text-blue-600 dark:text-blue-400">Compartir</span> en Safari
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Es el icono <Share className="w-3 h-3 inline text-blue-500" /> en la barra inferior de tu pantalla.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Elige <span className="text-blue-600 dark:text-blue-400">&quot;Agregar a inicio&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Desliza las opciones y pulsa <PlusSquare className="w-3 h-3 inline text-slate-600 dark:text-zinc-300" /> &quot;Agregar a pantalla de inicio&quot;.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Pulsa <span className="text-emerald-600 dark:text-emerald-400">&quot;Agregar&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  ¡Listo! Se guardará con el icono y logo oficial en tu menú de apps.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Abre el menú de opciones <span className="text-emerald-600 dark:text-emerald-400">(tres puntos)</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Toca <MoreVertical className="w-3 h-3 inline text-slate-600 dark:text-zinc-300" /> en la esquina superior derecha del navegador.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Selecciona <span className="text-emerald-600 dark:text-emerald-400">&quot;Instalar aplicación&quot;</span> o <span className="text-emerald-600 dark:text-emerald-400">&quot;Agregar a la pantalla principal&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Aparece con el icono de flecha o celular <Download className="w-3 h-3 inline text-emerald-500" />.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Confirma <span className="text-emerald-600 dark:text-emerald-400">&quot;Instalar&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  La app quedará instalada de forma nativa e independiente con su logotipo oficial.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Footnote */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Acceso 100% offline & rápido</span>
          </div>
          <button
            onClick={onClose}
            className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
