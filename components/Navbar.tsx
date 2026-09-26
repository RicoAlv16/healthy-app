'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { translations, SupportedLang } from '@/lib/translations';

interface UserSession {
  name: string;
  role: string;
  id: string;
}

interface NavbarProps {
  currentLang: SupportedLang;
  onLanguageChange: (lang: SupportedLang) => void;
  onToggleVoiceModal: () => void;
  onOpenAuthModal: () => void;
  currentUser: UserSession | null;
  onLogout: () => void;
}

export default function Navbar({
  currentLang,
  onLanguageChange,
  onToggleVoiceModal,
  onOpenAuthModal,
  currentUser,
  onLogout
}: NavbarProps) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSizeScale, setFontSizeScale] = useState(100);
  const [isOnline, setIsOnline] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang]?.nav || translations.fr.nav;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleContrast = () => {
    const nextState = !isHighContrast;
    setIsHighContrast(nextState);
    if (nextState) {
      document.documentElement.classList.add('high-contrast-mode');
    } else {
      document.documentElement.classList.remove('high-contrast-mode');
    }
  };

  const adjustFontSize = (delta: number) => {
    setFontSizeScale((prev) => {
      const next = Math.min(Math.max(prev + delta, 90), 130);
      document.documentElement.style.fontSize = `${next}%`;
      return next;
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-all shadow-xs">
      {/* Ligne Tricolore République du Bénin */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#008751]" title="Vert Bénin"></div>
        <div className="bg-[#FCD116]" title="Jaune Bénin"></div>
        <div className="bg-[#E8112D]" title="Rouge Bénin"></div>
      </div>

      {/* Barre Pleine Largeur (Full-Width) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Identité Bénin */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5v10" />
                  <path d="M7 10h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                    Care<span className="text-teal-600 dark:text-teal-400">.bj</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-[9px] uppercase tracking-wider border border-teal-200 dark:border-teal-800">
                    Bénin
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden md:inline">
                  {t.subtitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Centrale sur une seule ligne (Pas de retour à la ligne) */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs xl:text-sm font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
            <a 
              href="#services" 
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all"
            >
              {t.services}
            </a>
            <a 
              href="#inclusion" 
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all"
            >
              {t.inclusion}
            </a>
            <a 
              href="#pharmacies" 
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all"
            >
              {t.pharmacies}
            </a>
            <a 
              href="#specifications" 
              className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-0.5 after:bg-teal-600 after:transition-all"
            >
              {t.specs}
            </a>
          </nav>

          {/* Barre d'outils droite : Design épuré, compact et ultra-stylé */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* 1. Badge Réseau Minimaliste & Stylé (Pill) */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                isOnline 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
              }`}
              title={isOnline ? t.networkTooltipOnline : t.networkTooltipOffline}
            >
              <span className="relative flex h-2 w-2">
                {isOnline && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              </span>
              <span className="text-[11px] whitespace-nowrap hidden sm:inline">
                {isOnline ? t.networkOnline : t.networkOffline}
              </span>
            </div>

            {/* 2. Bouton Assistant Vocal Stylé */}
            <button
              onClick={onToggleVoiceModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 font-bold text-xs transition-all active:scale-95 whitespace-nowrap shadow-xs"
              title="Écouter en langues nationales (Fon, Yoruba, Bariba, Dendi)"
              aria-label="Assistant vocal"
            >
              <span className="text-sm">🎙️</span>
              <span className="hidden md:inline">{t.voiceBtn}</span>
            </button>

            {/* 3. Sélecteur de Langue Élégant */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLang)}
                className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full px-3 py-1.5 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 cursor-pointer transition-all"
                aria-label="Changer de langue"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="fon">🇧🇯 Fon</option>
                <option value="yoruba">🇧🇯 Yor</option>
                <option value="bariba">🇧🇯 Bar</option>
                <option value="dendi">🇧🇯 Den</option>
              </select>
            </div>

            {/* 4. Accessibilité : Contraste & Zoom (Compact) */}
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 dark:border-teal-900 pl-2">
              <button
                onClick={toggleContrast}
                className={`p-1.5 rounded-lg border text-xs transition-all ${
                  isHighContrast 
                    ? 'bg-yellow-400 text-black border-yellow-500 font-black' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                }`}
                title="Contraste élevé WCAG AAA"
                aria-label="Mode contraste élevé"
              >
                👁️
              </button>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-200 dark:border-slate-700">
                <button 
                  onClick={() => adjustFontSize(-10)} 
                  className="px-1.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded"
                  title="Réduire police"
                >
                  A-
                </button>
                <span className="text-[9px] font-mono text-slate-400 px-1">{fontSizeScale}%</span>
                <button 
                  onClick={() => adjustFontSize(10)} 
                  className="px-1.5 py-0.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded"
                  title="Agrandir police"
                >
                  A+
                </button>
              </div>
            </div>

            {/* 5. Bouton Principal "Mon Espace" (Haut de gamme, épuré) */}
            {!currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-500 font-bold text-xs shadow-md shadow-slate-900/10 dark:shadow-teal-900/20 transition-all hover:scale-102 active:scale-95 whitespace-nowrap"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>{t.loginBtn}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 py-1 px-3 rounded-full border border-slate-200 dark:border-slate-700">
                <Link href="/dashboard" className="text-right hover:opacity-80 transition-opacity">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{currentUser.role} • Dashboard →</p>
                </Link>
                <button
                  onClick={onLogout}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 hover:bg-rose-200 text-[10px] font-bold"
                  title="Déconnexion"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Ouvrir le menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

          </div>

        </div>
      </div>

      {/* Menu mobile déroulant */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-4 space-y-3 animate-fade-in">
          <a 
            href="#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5"
          >
            {t.services}
          </a>
          <a 
            href="#inclusion" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5"
          >
            {t.inclusion}
          </a>
          <a 
            href="#pharmacies" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5"
          >
            {t.pharmacies}
          </a>
          <a 
            href="#specifications" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1.5"
          >
            {t.specs}
          </a>
        </div>
      )}
    </header>
  );
}
