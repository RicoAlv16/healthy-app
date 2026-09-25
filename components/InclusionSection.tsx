'use client';

import React from 'react';
import { translations, SupportedLang } from '@/lib/translations';

interface InclusionSectionProps {
  currentLang: SupportedLang;
  onOpenVoiceModal: () => void;
}

export default function InclusionSection({ currentLang, onOpenVoiceModal }: InclusionSectionProps) {
  const t = translations[currentLang]?.inclusion || translations.fr.inclusion;

  return (
    <section id="inclusion" className="py-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200 dark:border-emerald-800">
            {t.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.title}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t.subtitle}
          </p>
        </div>

        {/* Grille des 4 piliers d'inclusion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pilier 1 : Non-alphabétisés & Langues nationales */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-teal-500 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🗣️
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.p1Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.p1Desc}
            </p>
            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline pt-2"
            >
              <span>{t.p1Action}</span>
            </button>
          </div>

          {/* Pilier 2 : Handicap Visuel (WCAG AAA) */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👁️
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.p2Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.p2Desc}
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[11px] font-bold">
              {t.p2Badge}
            </span>
          </div>

          {/* Pilier 3 : Handicap Auditif (LSB & Transcriptions) */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🤟
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.p3Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.p3Desc}
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-[11px] font-bold">
              {t.p3Badge}
            </span>
          </div>

          {/* Pilier 4 : Connectivité Limitée (2G/3G & Zones Blanches) */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📡
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.p4Title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.p4Desc}
            </p>
            <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
              {t.p4Badge}
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
