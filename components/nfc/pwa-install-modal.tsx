'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Business } from '@/types/business';
import { getBasePath } from '@/lib/base-path';
import {
  X,
  Share,
  PlusSquare,
  MoreVertical,
  Download,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Eye,
} from 'lucide-react';

interface PwaInstallModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
  onNativeInstall?: () => void;
  canNativePrompt?: boolean;
  isMockup?: boolean;
}

export function PwaInstallModal({
  business,
  isOpen,
  onClose,
  onNativeInstall,
  canNativePrompt = false,
  isMockup = false,
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
  const basePath = getBasePath();
  const publicCardUrl = `${basePath}/${business.slug}/`;

  const handleOpenPublicCard = () => {
    if (typeof window !== 'undefined') {
      window.open(publicCardUrl, '_blank');
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={fontStyle}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
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

        {/* Dashboard Preview Banner (if triggered from phone simulator) */}
        {isMockup && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
            <Eye className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold leading-tight">Vista previa para tus clientes</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5 leading-snug">
                Esta es la experiencia que verán tus visitantes al escanear tu tarjeta física NFC. Se instalará con tu logotipo y nombre exclusivo.
              </p>
            </div>
          </div>
        )}

        {/* Home Screen Preview Badge */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-950/60 dark:to-zinc-900/80 border border-slate-200/80 dark:border-zinc-800 text-center flex flex-col items-center">
          <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Así se verá en la pantalla del celular
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

          <p className="mt-2.5 text-xs font-bold text-slate-800 dark:text-zinc-100 max-w-[200px] truncate">
            {business.name}
          </p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400">
            Tarjeta digital de visor • Sin pasar por tiendas
          </p>
        </div>

        {/* Action Button */}
        {isMockup ? (
          <button
            onClick={handleOpenPublicCard}
            className="w-full mb-4 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Tarjeta Pública para Probar en Vivo</span>
          </button>
        ) : (
          canNativePrompt && onNativeInstall && (
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
          )
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
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Toca el botón <span className="text-blue-600 dark:text-blue-400">Compartir</span> en Safari
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Es el icono <Share className="w-3 h-3 inline text-blue-500" /> en la barra de abajo.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Elige <span className="text-blue-600 dark:text-blue-400">&quot;Agregar a inicio&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Desliza y toca <PlusSquare className="w-3 h-3 inline text-slate-600 dark:text-zinc-300" /> &quot;Agregar a pantalla de inicio&quot;.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Pulsa <span className="text-emerald-600 dark:text-emerald-400">&quot;Agregar&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  ¡Listo! La app se guardará con el nombre oficial e icono de {business.name}.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                1
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Toca el menú <span className="text-emerald-600 dark:text-emerald-400">(tres puntos)</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  En la esquina superior derecha <MoreVertical className="w-3 h-3 inline text-slate-600 dark:text-zinc-300" /> de Chrome.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                2
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Selecciona <span className="text-emerald-600 dark:text-emerald-400">&quot;Instalar aplicación&quot;</span> o <span className="text-emerald-600 dark:text-emerald-400">&quot;Agregar a la pantalla principal&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                  Aparece con el icono de celular o descarga <Download className="w-3 h-3 inline text-emerald-500" />.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                3
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 dark:text-zinc-100 leading-snug">
                  Confirma <span className="text-emerald-600 dark:text-emerald-400">&quot;Instalar&quot;</span>
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  La app quedará instalada de forma independiente, abriendo directamente la tarjeta sin barras de navegador.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Benefits Footnote */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Acceso 100% directo a la tarjeta</span>
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
