"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SafeUser } from "@/lib/db";
import { 
  ShieldCheck, 
  LogOut, 
  PhoneCall, 
  CreditCard
} from "lucide-react";

interface DashboardHeaderProps {
  user: SafeUser;
  onOpenCard?: () => void;
}

export default function DashboardHeader({ user, onOpenCard }: DashboardHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("carebj_user");
      router.push("/login");
      router.refresh();
    } catch (e) {
      console.error("Erreur lors de la déconnexion :", e);
    } finally {
      setLoggingOut(false);
    }
  };

  const toggleContrast = () => {
    const nextState = !isHighContrast;
    setIsHighContrast(nextState);
    if (nextState) {
      document.documentElement.classList.add("high-contrast-mode");
    } else {
      document.documentElement.classList.remove("high-contrast-mode");
    }
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case "doctor":
        return {
          label: "Médecin Praticien",
          sub: user.professionalId ? `N° ${user.professionalId}` : "CNHU-HKM",
          color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        };
      case "pharmacy":
        return {
          label: "Officine Agréée",
          sub: user.professionalId ? `Agrément ${user.professionalId}` : "ABMed Bénin",
          color: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
        };
      case "admin":
        return {
          label: "Administrateur",
          sub: "Ministère de la Santé",
          color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        };
      default:
        return {
          label: "Citoyen Assuré",
          sub: user.npi ? `NPI: ${user.npi}` : (user.archNumber ? `ARCH: ${user.archNumber}` : "ANIP"),
          color: "bg-teal-500/10 text-teal-800 dark:text-teal-300 border-teal-500/20",
        };
    }
  };

  const roleInfo = getRoleBadge();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Souveraineté */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-xl tracking-tight">C+</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                    Care<span className="text-teal-600">.bj</span>
                  </span>
                  <div className="flex h-2.5 w-4 rounded-xs overflow-hidden shadow-xs border border-black/10">
                    <div className="w-1/3 bg-emerald-600"></div>
                    <div className="w-1/3 bg-amber-400"></div>
                    <div className="w-1/3 bg-rose-600"></div>
                  </div>
                </div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest hidden sm:block">
                  Santé Connectée • Bénin
                </p>
              </div>
            </Link>

            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Souveraineté ANIP / ASIN
            </span>
          </div>

          {/* Outils & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Urgence 112 */}
            <a
              href="tel:112"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold border border-rose-200 dark:border-rose-900 transition-colors"
              title="SAMU Bénin / Urgences vitales"
            >
              <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>SAMU 112</span>
            </a>

            {/* Carte Numérique raccourci (si patient) */}
            {user.role === "patient" && onOpenCard && (
              <button
                onClick={onOpenCard}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-200 hover:bg-teal-100 text-xs font-bold border border-teal-200 dark:border-teal-800 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden sm:inline">Ma Carte</span>
              </button>
            )}

            {/* Accessibilité Contraste */}
            <button
              onClick={toggleContrast}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700"
              title="Contraste élevé WCAG AAA"
              aria-label="Contraste"
            >
              👁️
            </button>

            {/* Séparateur */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* Profil Utilisateur */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {user.firstName[0]}
                  {user.lastName[0]}
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                    {roleInfo.label}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500">Connecté en tant que</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                      <span>{roleInfo.sub}</span>
                    </div>
                  </div>

                  <div className="p-1">
                    <Link
                      href="/"
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <span>🏠</span>
                      <span>Retour au Portail Public</span>
                    </Link>

                    {user.role === "patient" && onOpenCard && (
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenCard();
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                      >
                        <span>🪪</span>
                        <span>Carte Sanitaire ANIP / QR</span>
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      disabled={loggingOut}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors text-left mt-1 border-t border-slate-100 dark:border-slate-800"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{loggingOut ? "Déconnexion..." : "Se déconnecter"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
