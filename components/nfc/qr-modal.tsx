'use client';

import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, Share2 } from 'lucide-react';
import { Business } from '@/types/business';
import { getAppBaseUrl } from '@/lib/supabase';

interface QrModalProps {
  business: Business;
  isOpen: boolean;
  onClose: () => void;
}

export function QrModal({ business, isOpen, onClose }: QrModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const profileUrl = typeof window !== 'undefined'
    ? `${getAppBaseUrl()}/${business.slug}`
    : `https://tapcard.link/${business.slug}`;

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(
      profileUrl,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [isOpen, profileUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-${business.slug}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl p-6 text-center border border-slate-100 dark:border-zinc-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 mb-3">
          <Share2 className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Código QR de {business.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
          Escanea con cualquier cámara o grábalo en una tarjeta NFC física
        </p>

        {/* QR Display */}
        <div className="my-5 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-inner flex items-center justify-center">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={`QR ${business.name}`}
              className="w-52 h-52 object-contain"
            />
          ) : (
            <div className="w-52 h-52 flex items-center justify-center text-xs text-slate-400">
              Generando código QR...
            </div>
          )}
        </div>

        {/* URL Box & Copy */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 mb-4">
          <span className="text-xs text-slate-600 dark:text-zinc-300 truncate flex-1 text-left px-2 font-mono">
            {profileUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copiado
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copiar
              </>
            )}
          </button>
        </div>

        {/* Download QR Action */}
        <button
          onClick={handleDownloadQr}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm shadow hover:bg-slate-800 dark:hover:bg-zinc-100 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          Descargar QR en Alta Resolución (PNG)
        </button>
      </div>
    </div>
  );
}
