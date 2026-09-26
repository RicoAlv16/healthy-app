'use client';

import React from 'react';
import { translations, SupportedLang } from '@/lib/translations';

interface FooterProps {
  currentLang: SupportedLang;
}

export default function Footer({ currentLang }: FooterProps) {
  const t = translations[currentLang]?.footer || translations.fr.footer;

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Ligne Tricolore République du Bénin */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-[#008751]"></div>
        <div className="bg-[#FCD116]"></div>
        <div className="bg-[#E8112D]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Identité Institutionnelle */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center font-black text-xl text-white shadow-md shadow-teal-700/20">
                <span className="font-black text-xl tracking-tight">C+</span>
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Care<span className="text-teal-400">.bj</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.desc}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800">
                {t.badgeSovereign}
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                {t.badgeLocalData}
              </span>
            </div>
          </div>

          {/* Numéros d'Urgence Nationaux */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              {t.titleEmergency}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="tel:112" className="hover:text-white font-bold text-rose-400 transition-colors">
                  {t.samu}
                </a>
              </li>
              <li>
                <a href="tel:136" className="hover:text-white transition-colors">
                  {t.greenLine}
                </a>
              </li>
              <li>
                <a href="tel:118" className="hover:text-white transition-colors">
                  {t.firefighters}
                </a>
              </li>
              <li>
                <a href="tel:117" className="hover:text-white transition-colors">
                  {t.police}
                </a>
              </li>
            </ul>
          </div>

          {/* Partenaires & Écosystème */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              {t.titleInstitutions}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>{t.inst1}</li>
              <li>{t.inst2}</li>
              <li>{t.inst3}</li>
              <li>{t.inst4}</li>
              <li>{t.inst5}</li>
              <li>{t.inst6}</li>
            </ul>
          </div>

          {/* Accessibilité & Conformité */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              {t.titleA11y}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>{t.a11y1}</li>
              <li>{t.a11y2}</li>
              <li>{t.a11y3}</li>
              <li>{t.a11y4}</li>
              <li>{t.a11y5}</li>
            </ul>
          </div>

        </div>

        {/* Ligne inférieure de copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.copyright}</p>
          <p className="flex items-center gap-1">
            <span>{t.passionBadge}</span>
            <span>🇧🇯</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
