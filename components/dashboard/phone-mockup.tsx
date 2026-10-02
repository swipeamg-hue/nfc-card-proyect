'use client';

import React from 'react';
import { Business } from '@/types/business';
import { PublicProfile } from '@/components/nfc/public-profile';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneMockupProps {
  business: Business;
}

export function PhoneMockup({ business }: PhoneMockupProps) {
  return (
    <div className="sticky top-6 flex flex-col items-center w-full px-2">
      {/* Phone Case Frame */}
      <div className="relative w-full max-w-[340px] sm:max-w-[360px] h-[640px] sm:h-[720px] bg-slate-900 rounded-[44px] sm:rounded-[50px] p-2.5 sm:p-3 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-800 flex flex-col [transform:translateZ(0)]">
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-26 sm:w-28 h-4.5 sm:h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-900/60" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-full bg-slate-50 dark:bg-zinc-950 rounded-[36px] sm:rounded-[40px] overflow-hidden flex flex-col shadow-inner">
          {/* iOS-style Status Bar */}
          <div className="h-9 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-800 dark:text-zinc-200 z-30 pt-1 pointer-events-none select-none bg-gradient-to-b from-black/20 to-transparent">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Scrollable Viewport */}
          <div className="flex-1 overflow-y-auto no-scrollbar pb-16 -mt-9 relative">
            <PublicProfile
              business={business}
              source="NFC"
              cardCode="SIMULATOR"
              isMockup={true}
            />
          </div>

          {/* iOS Bottom Bar Indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-zinc-600 rounded-full z-30 pointer-events-none" />
        </div>
      </div>

    </div>
  );
}
