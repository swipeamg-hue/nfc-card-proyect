'use client';

import React, { useState, useEffect, useRef } from 'react';
import { POPULAR_FONTS, dynamicallyLoadFont } from '@/lib/fonts';
import { Check, ChevronDown, Upload, Search, Type } from 'lucide-react';

interface FontPickerProps {
  currentFont?: string;
  customFontUrl?: string;
  customFontName?: string;
  onFontChange: (fontName: string, customUrl?: string) => void;
}

export function FontPicker({
  currentFont = 'Inter',
  customFontUrl,
  customFontName,
  onFontChange,
}: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Preload current font and custom font
  useEffect(() => {
    if (customFontUrl && customFontName) {
      dynamicallyLoadFont(customFontName, customFontUrl, customFontName);
    } else if (currentFont) {
      dynamicallyLoadFont(currentFont);
    }
  }, [currentFont, customFontUrl, customFontName]);

  // Load preview fonts when dropdown is open
  useEffect(() => {
    if (isOpen) {
      POPULAR_FONTS.slice(0, 15).forEach((font) => {
        dynamicallyLoadFont(font.name);
      });
    }
  }, [isOpen]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fontName = file.name.replace(/\.[^/.]+$/, '').trim();

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        dynamicallyLoadFont(fontName, dataUrl, fontName);
        onFontChange(fontName, dataUrl);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredFonts = POPULAR_FONTS.filter((font) => {
    const matchesSearch =
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm hover:border-blue-500 transition-all text-left"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-sm">
            <Type className="w-4 h-4" />
          </div>
          <div className="flex flex-col truncate">
            <span
              className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate"
              style={{ fontFamily: customFontName || currentFont }}
            >
              {customFontName || currentFont}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">
              {customFontName ? 'Fuente propia cargada' : 'Haz clic para cambiar tipografía'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 text-slate-400">
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden p-3 animate-in fade-in zoom-in-95 duration-150">
          {/* Search & Custom Upload Row */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tipografía (ej. Great Vibes, Inter, Bodoni)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Custom font upload button */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept=".ttf,.otf,.woff,.woff2"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'Cargando fuente...' : 'Cargar tu propia fuente (.ttf, .otf, .woff)'}</span>
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800 text-[11px] scrollbar-none">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'sans-serif', label: 'Sans-Serif (Modernas)' },
              { id: 'serif', label: 'Serif (Elegantes)' },
              { id: 'handwriting', label: 'Caligrafía (Bodas)' },
              { id: 'display', label: 'Display (Impacto)' },
              { id: 'monospace', label: 'Monospace' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Font List */}
          <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
            {customFontName && (
              <button
                type="button"
                onClick={() => {
                  onFontChange(customFontName, customFontUrl);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                  currentFont === customFontName
                    ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      ★ Fuente Propia: {customFontName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-semibold">
                      Personalizada
                    </span>
                  </div>
                  <p
                    className="text-sm mt-0.5 text-slate-700 dark:text-zinc-300"
                    style={{ fontFamily: customFontName }}
                  >
                    Tu tarjeta con tipografía exclusiva de marca
                  </p>
                </div>
                {currentFont === customFontName && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
              </button>
            )}

            {filteredFonts.map((font) => {
              const isSelected = currentFont === font.name;
              return (
                <button
                  key={font.id}
                  type="button"
                  onMouseEnter={() => dynamicallyLoadFont(font.name)}
                  onClick={() => {
                    dynamicallyLoadFont(font.name);
                    onFontChange(font.name);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <div className="flex flex-col truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                        {font.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                        {font.categoryLabel}
                      </span>
                    </div>
                    <span
                      className="text-sm text-slate-700 dark:text-zinc-300 truncate mt-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      style={{ fontFamily: font.name }}
                    >
                      {font.previewText}
                    </span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                </button>
              );
            })}

            {filteredFonts.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No se encontraron tipografías que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
