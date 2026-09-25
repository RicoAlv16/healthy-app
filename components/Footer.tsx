'use client';

import React from 'react';

export default function Footer() {
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
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center font-black text-xl text-white">
                C
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Care<span className="text-teal-400">.bj</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Plateforme numérique souveraine, collaborative et universellement accessible de suivi des patients et de coordination des soins en République du Bénin.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-teal-950 text-teal-300 border border-teal-800">
                Souveraineté Numérique Bénin
              </span>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
                Données hébergées localement
              </span>
            </div>
          </div>

          {/* Numéros d'Urgence Nationaux */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              Urgences Bénin
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a href="tel:112" className="hover:text-white font-bold text-rose-400 transition-colors">
                  🚨 SAMU National : 112
                </a>
              </li>
              <li>
                <a href="tel:136" className="hover:text-white transition-colors">
                  📞 Ligne Verte Santé : 136
                </a>
              </li>
              <li>
                <a href="tel:118" className="hover:text-white transition-colors">
                  🚒 Sapeurs-Pompiers : 118
                </a>
              </li>
              <li>
                <a href="tel:117" className="hover:text-white transition-colors">
                  👮 Police Républicaine : 117
                </a>
              </li>
            </ul>
          </div>

          {/* Partenaires & Écosystème */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              Institutions & Agences
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Ministère de la Santé du Bénin</li>
              <li>ASIN (Systèmes d&apos;Information)</li>
              <li>ANSSP (Soins de Santé Primaires)</li>
              <li>ANIP (Identité Citoyenne - NPI)</li>
              <li>Projet ARCH / Assurance Santé</li>
              <li>ABMed (Agence du Médicament)</li>
            </ul>
          </div>

          {/* Accessibilité & Conformité */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-4">
              Accessibilité & APDP
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Conforme WCAG 2.1 niveau AAA</li>
              <li>Synthèse vocale 4 langues béninoises</li>
              <li>Mode Hors-Ligne (Offline-First)</li>
              <li>Conforme Code du Numérique (APDP)</li>
              <li>Secret Médical & Chiffrement AES-256</li>
            </ul>
          </div>

        </div>

        {/* Ligne inférieure de copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Care.bj • Développé dans le cadre du Challenge e-Santé Bénin.</p>
          <p className="flex items-center gap-1">
            <span>Fait avec passion pour le système de santé du Bénin</span>
            <span>🇧🇯</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
