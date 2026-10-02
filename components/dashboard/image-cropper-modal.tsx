'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  Check,
  Crop,
  Move,
  RotateCcw,
  Smartphone,
  CreditCard,
} from 'lucide-react';

export type CropType = 'circle' | 'banner' | 'vertical';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  cropType: CropType;
  title?: string;
  onConfirm: (croppedDataUrl: string, croppedFile: File, chosenCropType?: CropType) => void;
  onClose: () => void;
}

export function ImageCropperModal({
  isOpen,
  imageSrc,
  cropType,
  title,
  onConfirm,
  onClose,
}: ImageCropperModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  // Active crop mode (user can toggle between vertical 9:16 and banner 16:9 inside the modal)
  const [activeCropType, setActiveCropType] = useState<CropType>(cropType);
  const [prevCropTypeProp, setPrevCropTypeProp] = useState<CropType>(cropType);
  if (prevCropTypeProp !== cropType) {
    setPrevCropTypeProp(cropType);
    setActiveCropType(cropType);
  }

  // Transformations
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const posStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Track previous imageSrc to reset adjustments during render (recommended React pattern)
  const [prevSrc, setPrevSrc] = useState(imageSrc);
  if (prevSrc !== imageSrc) {
    setPrevSrc(imageSrc);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }

  // Measure natural image dimensions asynchronously
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = imageSrc;
  }, [isOpen, imageSrc]);

  // Pointer event handlers for panning / dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    posStartRef.current = { ...position };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPosition({
      x: posStartRef.current.x + dx,
      y: posStartRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // Rotate 90 degrees clockwise
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  // Reset all adjustments
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Smart fit: auto-scale and center
  const handleSmartFit = () => {
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  // Crop & generate output
  const handleCropSave = useCallback(async () => {
    if (!imageSrc || !containerRef.current) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageSrc;
      });

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const containerW = rect.width;
      const containerH = rect.height;

      // Define target mask box in container coordinates
      let maskW = 0;
      let maskH = 0;

      if (activeCropType === 'circle') {
        const size = Math.min(containerW, containerH) * 0.72;
        maskW = size;
        maskH = size;
      } else if (activeCropType === 'vertical') {
        maskH = containerH * 0.82;
        maskW = maskH * (9 / 16);
      } else {
        // Banner (16:9 or 3:1)
        maskW = containerW * 0.88;
        maskH = maskW * (180 / 440); // Matches ~16:9 banner proportion
        if (maskH > containerH * 0.75) {
          maskH = containerH * 0.75;
          maskW = maskH * (440 / 180);
        }
      }

      // If mask element exists in DOM, use its exact real rendered pixel dimensions
      if (maskRef.current) {
        const mRect = maskRef.current.getBoundingClientRect();
        if (mRect.width > 0 && mRect.height > 0) {
          maskW = mRect.width;
          maskH = mRect.height;
        }
      }

      // Output canvas dimension
      let outputWidth = 1200;
      let outputHeight = 675;

      if (activeCropType === 'circle') {
        outputWidth = 512;
        outputHeight = 512;
      } else if (activeCropType === 'vertical') {
        outputWidth = 1080;
        outputHeight = 1920;
      } else {
        outputWidth = 1200;
        outputHeight = Math.round((1200 * maskH) / maskW);
      }

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Fill with subtle background for transparent PNGs
      if (activeCropType === 'circle') {
        ctx.fillStyle = '#0f172a';
      } else {
        ctx.fillStyle = '#020617';
      }
      ctx.fillRect(0, 0, outputWidth, outputHeight);

      // Compute display image size inside container at zoom=1 before rotation
      const baseScale = Math.min(containerW / img.naturalWidth, containerH / img.naturalHeight) * 0.95;
      const currentScale = baseScale * zoom;

      // Center of canvas
      ctx.translate(outputWidth / 2, outputHeight / 2);

      // Scale from container coordinates to canvas output
      const scaleToCanvas = outputWidth / maskW;

      // Shift by user pan offset
      ctx.translate(position.x * scaleToCanvas, position.y * scaleToCanvas);

      // Rotate
      ctx.rotate((rotation * Math.PI) / 180);

      // Draw image
      const drawW = img.naturalWidth * currentScale * scaleToCanvas;
      const drawH = img.naturalHeight * currentScale * scaleToCanvas;
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

      // Convert to blob and dataUrl
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92);
      });

      if (!blob) throw new Error('Could not create image blob');

      const fileName = `${activeCropType}-${Date.now()}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      onConfirm(dataUrl, file, activeCropType);
      onClose();
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Ocurrió un error al procesar la imagen. Intenta con otra imagen.');
    } finally {
      setIsProcessing(false);
    }
  }, [activeCropType, imageSrc, onClose, onConfirm, position.x, position.y, rotation, zoom]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-zinc-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Crop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {title ||
                    (activeCropType === 'circle'
                      ? 'Ajustar Foto de Perfil'
                      : activeCropType === 'vertical'
                      ? 'Ajustar Foto de Fondo (Vertical 9:16)'
                      : 'Ajustar Portada (Banner 16:9)')}
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Arrastra y ajusta el zoom para encuadrar la foto a tu gusto
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Selector (only when cropping background, not circle avatar) */}
          {activeCropType !== 'circle' && (
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80">
              <button
                type="button"
                onClick={() => setActiveCropType('vertical')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeCropType === 'vertical'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Fondo Vertical (9:16)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCropType('banner')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                  activeCropType === 'banner'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Banner Horizontal (16:9)</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport / Crop Area */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="relative w-full h-72 sm:h-80 bg-zinc-950 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none touch-none"
        >
          {/* Guide hint overlay */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[10px] text-zinc-300 flex items-center gap-1.5">
            <Move className="w-3 h-3 text-blue-400" />
            <span>Arrastra para mover la imagen</span>
          </div>

          {/* Render image with transforms */}
          {imageSrc && (
            <div
              style={{
                transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
              className="pointer-events-none select-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Para recortar"
                className="max-w-[280px] sm:max-w-[340px] max-h-[240px] sm:max-h-[280px] object-contain select-none"
                draggable={false}
              />
            </div>
          )}

          {/* Visual Mask Guide */}
          <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center p-3">
            {activeCropType === 'circle' && (
              <div
                ref={maskRef}
                className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.68)] ring-1 ring-white/20"
              />
            )}
            {activeCropType === 'vertical' && (
              <div
                ref={maskRef}
                className="relative h-60 sm:h-64 aspect-[9/16] rounded-3xl border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.68)] ring-1 ring-white/20 flex flex-col items-center justify-between p-2.5"
              >
                <div className="w-8 h-1 bg-white/40 rounded-full" />
                <span className="text-[9px] font-bold text-white/70 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                  9:16 Fondo Móvil
                </span>
                <div className="w-7 h-7 rounded-full border border-dashed border-white/40 flex items-center justify-center text-[8px] text-white/50">
                  Avatar
                </div>
              </div>
            )}
            {activeCropType === 'banner' && (
              <div
                ref={maskRef}
                className="relative w-[85%] h-36 sm:h-44 rounded-2xl border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.68)] ring-1 ring-white/20 flex items-end justify-center pb-2.5"
              >
                <span className="text-[9px] font-bold text-white/70 bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                  16:9 Banner
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-zinc-900 border-t border-zinc-800">
          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.15))}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Alejar"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.6"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-blue-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((prev) => Math.min(3, prev + 0.15))}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Acercar"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-zinc-400 w-11 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/80">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleRotate}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                title="Girar imagen 90 grados"
              >
                <RotateCw className="w-3.5 h-3.5 text-blue-400" />
                <span>Girar 90°</span>
              </button>

              <button
                type="button"
                onClick={handleSmartFit}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                title="Auto-ajuste inteligente"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Autoajuste</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                title="Restablecer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {imageSize.width > 0 && (
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                {imageSize.width} × {imageSize.height}px
              </span>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2.5 px-5 py-3.5 bg-zinc-950/60 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleCropSave}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Procesando...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Aplicar Recorte</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
