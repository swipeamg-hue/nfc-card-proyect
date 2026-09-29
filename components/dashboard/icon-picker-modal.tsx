'use client';

import React, { useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { BUSINESS_ICON_CATEGORIES, ALL_BUSINESS_ICONS } from '@/components/ui/business-icons';

interface IconPickerModalProps {
  isOpen: boolean;
  selectedIconId?: string;
  onSelect: (iconId: string) => void;
  onClose: () => void;
}

export function IconPickerModal({
  isOpen,
  selectedIconId,
  onSelect,
  onClose,
}: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  if (!isOpen) return null;

  const categories = ['Todos', ...BUSINESS_ICON_CATEGORIES.map((c) => c.name)];

  const filteredIcons = ALL_BUSINESS_ICONS.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === 'Todos' ||
      BUSINESS_ICON_CATEGORIES.find((c) => c.name === activeCategory)?.items.some(
        (i) => i.id === item.id
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Librería de Íconos SVG para tu Negocio
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                Selecciona el ícono que mejor represente este botón o servicio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Category filters */}
        <div className="p-4 border-b border-slate-100 dark:border-zinc-800 space-y-3 bg-slate-50/50 dark:bg-zinc-900/50">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar ícono (ej. menú, cita, café, auto, joyería, uñas...)"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Icon Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredIcons.map((item) => {
            const IconComp = item.icon;
            const isSelected = selectedIconId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose();
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                    : 'bg-white dark:bg-zinc-800/70 border-slate-200 dark:border-zinc-700/80 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-zinc-800'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-700/60 text-slate-700 dark:text-zinc-200 group-hover:bg-blue-50'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {item.category}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>{filteredIcons.length} íconos SVG vectoriales disponibles</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-700 font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
