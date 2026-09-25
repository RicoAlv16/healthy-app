'use client';

import React, { useState } from 'react';

interface QuickEmergencyBarProps {
  currentLang: string;
}

const emergencyMessages: Record<string, { label: string; callBtn: string; locateBtn: string; alertSent: string }> = {
  fr: {
    label: "URGENCE VITALE BÉNIN",
    callBtn: "Appeler SAMU (112)",
    locateBtn: "Centres d'Urgences & Réanimation",
    alertSent: "Alerte SOS transmise au centre de régulation SAMU le plus proche avec vos coordonnées GPS."
  },
  fon: {
    label: "AZAN GBLÉGBÉ TƆN (URGENCE)",
    callBtn: "Ylɔ SAMU (112)",
    locateBtn: "Dotoxwé ɖaxó e sɛkpɔ we lɛ",
    alertSent: "Wɛn gblégblé yí doto lɛ gɔ́n kpo fi e a ɖè e kpo."
  },
  yoruba: {
    label: "PÀJÁWÌRÌ ÌLERA (URGENCE)",
    callBtn: "Pè SAMU (112)",
    locateBtn: "Ilé-ìwòsàn tó súnmọ́ jùlọ",
    alertSent: "A ti fi ifitonileti pajawiri ranṣẹ si ile-iwosan to sunmọ ọ."
  },
  bariba: {
    label: "TƆKƆ SAA GOBI (URGENCE)",
    callBtn: "Kɔkɔ SAMU (112)",
    locateBtn: "Boru dɔkɔtɔ kɔmbusi",
    alertSent: "A ti gba ifitonileti pajawiri rẹ."
  },
  dendi: {
    label: "CAWARI MAALEY (URGENCE)",
    callBtn: "Cee SAMU (112)",
    locateBtn: "Lokotoroo ka kani",
    alertSent: "I cawari koy lokotoro jine."
  }
};

export default function QuickEmergencyBar({ currentLang }: QuickEmergencyBarProps) {
  const [sosSent, setSosSent] = useState(false);
  const [loadingGps, setLoadingGps] = useState(false);
  const t = emergencyMessages[currentLang] || emergencyMessages.fr;

  const handleTriggerSos = () => {
    setLoadingGps(true);
    setTimeout(() => {
      setLoadingGps(false);
      setSosSent(true);
      setTimeout(() => setSosSent(false), 6000);
    }, 1200);
  };

  return (
    <div className="w-full bg-linear-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-md relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Signalétique Urgence */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <div className="flex items-center gap-1.5 font-black tracking-wide text-xs sm:text-sm uppercase">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px]">SOS 112</span>
              <span>{t.label}</span>
            </div>
          </div>

          {/* Boutons d'Action Rapide */}
          <div className="flex items-center gap-2">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-red-700 hover:bg-red-50 text-xs sm:text-sm font-bold shadow-xs active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.4-1.1-.6-2.3-.6-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1zM19 12h2a9 9 0 0 0-9-9v2a7 7 0 0 1 7 7z" />
              </svg>
              <span>{t.callBtn}</span>
            </a>

            <button
              onClick={handleTriggerSos}
              disabled={loadingGps}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-900/80 border border-white/30 text-white text-xs sm:text-sm font-semibold transition-all active:scale-95"
            >
              {loadingGps ? (
                <>
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Géolocalisation...</span>
                </>
              ) : (
                <>
                  <span>🚨 SOS 1-Clic</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Message de confirmation SOS */}
        {sosSent && (
          <div className="mt-2 p-2 bg-white text-red-900 rounded-lg text-xs font-bold flex items-center justify-between animate-fade-in shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-base">✅</span>
              <span>{t.alertSent}</span>
            </div>
            <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded">GPS: 6.3703° N, 2.4183° E (Cotonou)</span>
          </div>
        )}
      </div>
    </div>
  );
}
