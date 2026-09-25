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
    // Écouteur réel de connectivité réseau (PWA offline-first)
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
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors shadow-xs">
      {/* Bandeau Tricolore Subtil Bénin */}
      <div className="h-1.5 w-full grid grid-cols-3">
        <div className="bg-[#008751]" title="Vert Bénin"></div>
        <div className="bg-[#FCD116]" title="Jaune Bénin"></div>
        <div className="bg-[#E8112D]" title="Rouge Bénin"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Identité Bénin */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  <path d="M12 5v10" />
                  <path d="M7 10h10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Care<span className="text-teal-600 dark:text-teal-400">.bj</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                    Bénin
                  </span>
                </div>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                  {t.subtitle}
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Rapide Rôles (Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-300">
            <a href="#services" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t.services}
            </a>
            <a href="#inclusion" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t.inclusion}
            </a>
            <a href="#pharmacies" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t.pharmacies}
            </a>
            <a href="#specifications" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
              {t.specs}
            </a>
          </nav>

          {/* Outils d'Inclusion, Langues & Connectivité */}
          <div className="flex items-center gap-2">
            
            {/* Indicateur RÉSEAU INTERNET (Non pas login utilisateur) */}
            <div 
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isOnline 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 animate-pulse'
              }`}
              title={isOnline ? "Connexion Internet : Serveur national joignable" : "Mode Hors-ligne : vos données sont sauvegardées en local"}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{isOnline ? t.networkOnline : t.networkOffline}</span>
            </div>

            {/* Sélecteur de Langue Béninoise */}
            <div className="relative">
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value as SupportedLang)}
                className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl px-2.5 py-1.5 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-teal-500 cursor-pointer"
                aria-label="Sélectionner la langue"
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="fon">🇧🇯 Fon</option>
                <option value="yoruba">🇧🇯 Yorùbá</option>
                <option value="bariba">🇧🇯 Bariba</option>
                <option value="dendi">🇧🇯 Dendi</option>
              </select>
            </div>

            {/* Bouton Assistant Vocal */}
            <button
              onClick={onToggleVoiceModal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs transition-all shadow-xs active:scale-95"
              title="Écouter les explications en langue nationale"
              aria-label="Assistant vocal en langues locales"
            >
              <svg className="w-3.5 h-3.5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span className="hidden xl:inline">{t.voiceBtn}</span>
            </button>

            {/* Bouton Accessibilité WCAG (Contraste élevé) */}
            <button
              onClick={toggleContrast}
              className={`p-1.5 rounded-xl border transition-all text-xs font-bold ${
                isHighContrast 
                  ? 'bg-yellow-400 text-black border-yellow-500' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Basculer en contraste élevé (WCAG AAA pour malvoyants)"
              aria-label="Activer ou désactiver le contraste élevé"
            >
              👁️
            </button>

            {/* Agrandisseur de police */}
            <div className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700">
              <button 
                onClick={() => adjustFontSize(-10)} 
                className="px-1.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md"
                title="Diminuer la taille du texte"
              >
                A-
              </button>
              <span className="text-[10px] font-mono text-slate-500">{fontSizeScale}%</span>
              <button 
                onClick={() => adjustFontSize(10)} 
                className="px-1.5 py-0.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded-md"
                title="Augmenter la taille du texte"
              >
                A+
              </button>
            </div>

            {/* Bouton Connexion / Espace Personnel */}
            {!currentUser ? (
              <button
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold transition-all shadow-xs"
              >
                <span>👤</span>
                <span className="hidden sm:inline">{t.loginBtn}</span>
                <span className="sm:hidden">Connexion</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 pl-1">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">{currentUser.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg border border-rose-200 dark:border-rose-900"
                  title="Déconnexion"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Menu"
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
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <a 
            href="#services" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1"
          >
            {t.services}
          </a>
          <a 
            href="#inclusion" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1"
          >
            {t.inclusion}
          </a>
          <a 
            href="#pharmacies" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1"
          >
            {t.pharmacies}
          </a>
          <a 
            href="#specifications" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200 py-1"
          >
            {t.specs}
          </a>
        </div>
      )}
    </header>
  );
}
