import Link from "next/link";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Ruban Tricolore National Béninois (Vert, Jaune, Rouge) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#008751] via-[#FCD116] to-[#E8112D]" />

      {/* Header épuré pour l'espace d'authentification */}
      <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            title="Retour à l'accueil Care.bj"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 text-white flex items-center justify-center font-black text-base shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <span className="font-black text-base tracking-tight">C+</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Care<span className="text-teal-600 dark:text-teal-400">.bj</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/60">
                  E-Santé
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Portail National de Santé • République du Bénin
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all hover:text-slate-900 dark:hover:text-white"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Retour à l&apos;accueil</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Zone centrale de l'authentification */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Cercles de fond d'ambiance */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="w-full max-w-md sm:max-w-lg">
          {children}
        </div>
      </main>

      {/* Footer institutionnel avec conformité APDP Bénin */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 py-4 px-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm text-center">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sécurité certifiée APDP Bénin (Loi n° 2017-20) • Chiffrement AES-256</span>
          </div>
          <div>
            <span>Assistance d&apos;Urgence : </span>
            <strong className="text-teal-700 dark:text-teal-400">136</strong> (Numéro Vert Gratuit)
          </div>
        </div>
      </footer>
    </div>
  );
}