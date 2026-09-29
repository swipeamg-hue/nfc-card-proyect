'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Smartphone,
  QrCode,
  Download,
  TrendingUp,
  MousePointerClick,
  CheckCircle2,
  ExternalLink,
  Printer,
  Copy,
  Check,
} from 'lucide-react';
import { Business } from '@/types/business';
import { getAppBaseUrl } from '@/lib/supabase';

interface AnalyticsViewProps {
  business: Business;
}

export function AnalyticsView({ business }: AnalyticsViewProps) {
  const [qrPng, setQrPng] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const profileUrl = typeof window !== 'undefined'
    ? `${getAppBaseUrl()}/${business.slug}`
    : `https://tapcard.mx/${business.slug}`;

  useEffect(() => {
    QRCode.toDataURL(
      profileUrl,
      {
        width: 600,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) setQrPng(url);
      }
    );
  }, [profileUrl]);

  const metrics = {
    totalViews: 470,
    nfcTaps: 342,
    qrScans: 98,
    direct: 30,
    vcardDownloads: 156,
    conversionRate: '33.2%',
  };

  const linkBreakdown = [
    { name: 'WhatsApp', clicks: 189, color: 'bg-emerald-500', share: 45 },
    { name: 'Llamar ahora', clicks: 82, color: 'bg-blue-600', share: 20 },
    { name: 'Descarga vCard', clicks: 156, color: 'bg-indigo-600', share: 37 },
    { name: 'Instagram', clicks: 64, color: 'bg-pink-500', share: 15 },
    { name: 'Sitio Web', clicks: 53, color: 'bg-cyan-500', share: 12 },
    { name: 'LinkedIn', clicks: 39, color: 'bg-blue-800', share: 9 },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrPng) return;
    const link = document.createElement('a');
    link.href = qrPng;
    link.download = `QR-AltaResolucion-${business.slug}.png`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Toques Totales</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.totalViews}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">
            +18.4% este mes
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Lecturas NFC</span>
            <Smartphone className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.nfcTaps}
          </div>
          <span className="text-[11px] text-slate-500">
            {Math.round((metrics.nfcTaps / metrics.totalViews) * 100)}% del total
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Escaneos QR</span>
            <QrCode className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.qrScans}
          </div>
          <span className="text-[11px] text-slate-500">
            {Math.round((metrics.qrScans / metrics.totalViews) * 100)}% del total
          </span>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">vCard Guardadas</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {metrics.vcardDownloads}
          </div>
          <span className="text-[11px] text-indigo-600 font-semibold">
            {metrics.conversionRate} conversión
          </span>
        </div>
      </div>

      {/* Clicks Breakdown by Action */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <MousePointerClick className="w-4 h-4 text-blue-600" />
          Rendimiento por Botón de Enlace
        </h4>

        <div className="space-y-3">
          {linkBreakdown.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-zinc-300">
                  {item.name}
                </span>
                <span className="text-slate-500 font-mono">
                  {item.clicks} clics ({item.share}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(item.share * 2, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Ready for Printing */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm flex-shrink-0">
            {qrPng ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrPng}
                alt="QR Print Ready"
                className="w-36 h-36 object-contain"
              />
            ) : (
              <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                Generando QR...
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Código QR para Impresión Física
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Imprime este código en vinil, tarjetas de presentación, stands o exhibidores de mostrador.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadQr}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-all active:scale-95"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar PNG (Alta Resolución)
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar URL'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
