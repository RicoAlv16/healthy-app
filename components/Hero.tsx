'use client';

import React from 'react';
import Image from 'next/image';
import { translations, SupportedLang } from '@/lib/translations';

interface HeroProps {
  currentLang: SupportedLang;
  onOpenVoiceModal: () => void;
  onOpenAuthModal: () => void;
}

export default function Hero({ currentLang, onOpenVoiceModal, onOpenAuthModal }: HeroProps) {
  const content = translations[currentLang]?.hero || translations.fr.hero;

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Halo lumineux d'ambiance vert émeraude */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-500/15 via-emerald-400/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Colonne Gauche : Titre, Slogan & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Badge de certification du challenge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs sm:text-sm font-semibold shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
              <span>{content.badge}</span>
            </div>

            {/* Titre Principal percutant */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              {content.title}
            </h1>

            {/* Sous-titre axé sur l'inclusion et le hors-ligne */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              {content.subtitle}
            </p>

            {/* Boutons d'Action Clés */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenAuthModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/25 transition-all hover:scale-102 active:scale-98"
              >
                <span>{content.ctaPatient}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              <button
                onClick={onOpenVoiceModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-400 text-slate-800 dark:text-slate-100 font-bold text-base transition-all hover:bg-slate-50 dark:hover:bg-slate-800/80 active:scale-98"
              >
                <span>{content.ctaVoice}</span>
              </button>
            </div>

            {/* Chiffres clés de l'impact sanitaire */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{content.metricCommunes}</p>
                <p className="text-xs font-medium text-slate-500">{content.metricCommunesLabel}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400">{content.metricOffline}</p>
                <p className="text-xs font-medium text-slate-500">{content.metricOfflineLabel}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-amber-500">{content.metricLangs}</p>
                <p className="text-xs font-medium text-slate-500">{content.metricLangsLabel}</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-rose-600">{content.metricFraud}</p>
                <p className="text-xs font-medium text-slate-500">{content.metricFraudLabel}</p>
              </div>
            </div>

          </div>

          {/* Colonne Droite : Visuel interactif et carte de santé */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              
              {/* Carte principale de démonstration */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-6">
                
                {/* Image santé ou illustration du challenge */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Image
                    src="/sante.jpg"
                    alt="Professionnels de santé et patients au Bénin"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="bg-teal-600/90 backdrop-blur-xs px-2.5 py-1 rounded-md">{content.cardBadge}</span>
                    <span>112 SAMU</span>
                  </div>
                </div>

                {/* Statut rapide du patient connecté */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center">
                        BK
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">{content.cardTitle}</p>
                        <p className="text-xs text-slate-500 font-mono">NPI: 1092-8472-9104</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                      À jour 🟢
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">{content.cardLastConsult}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{content.cardLastConsultVal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{content.cardVaccine}</span>
                      <span className="font-semibold text-teal-600">{content.cardVaccineVal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">{content.cardArch}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{content.cardArchVal}</span>
                    </div>
                  </div>
                </div>

                {/* Notification d'alerte prévention */}
                <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs">
                  <span className="text-lg">📢</span>
                  <div>
                    <p className="font-bold text-amber-900 dark:text-amber-200">{content.alertTitle}</p>
                    <p className="text-amber-700 dark:text-amber-300 text-[11px] mt-0.5">
                      {content.alertDesc}
                    </p>
                  </div>
                </div>

              </div>

              {/* Badge flottant décoratif "Mode Hors-Ligne Actif" */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{content.badgeOffline}</p>
                  <p className="text-[10px] text-slate-500">{content.badgeOfflineDesc}</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
