"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SafeUser } from "@/lib/db";
import { 
  LayoutDashboard, 
  CreditCard, 
  Activity, 
  FileText, 
  Calendar, 
  Stethoscope, 
  ScanLine, 
  ShieldCheck, 
  PhoneCall, 
  FileCheck,
  Syringe
} from "lucide-react";

interface SidebarLink {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

interface DashboardSidebarProps {
  user: SafeUser;
  onOpenCard?: () => void;
  onOpenBookAppointment?: () => void;
}

export default function DashboardSidebar({ user, onOpenCard, onOpenBookAppointment }: DashboardSidebarProps) {
  const pathname = usePathname();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPatientLinks = (): SidebarLink[] => [
    { label: "Vue Générale", href: "/dashboard", icon: LayoutDashboard },
    { label: "Prendre un Rendez-vous", onClick: onOpenBookAppointment, icon: Calendar, highlight: true },
    { label: "Mes Rendez-vous & Visios", onClick: () => scrollToSection("appointments"), icon: Calendar },
    { label: "Carte Sanitaire ANIP", onClick: onOpenCard, icon: CreditCard },
    { label: "Signes Vitaux", onClick: () => scrollToSection("vitals"), icon: Activity },
    { label: "Mes E-Ordonnances", onClick: () => scrollToSection("prescriptions"), icon: FileText },
    { label: "Carnet Vaccinal PEV", onClick: () => scrollToSection("vaccines"), icon: Syringe },
  ];

  const getDoctorLinks = (): SidebarLink[] => [
    { label: "Tableau de Bord", href: "/dashboard", icon: LayoutDashboard },
    { label: "Dossiers Patients NPI", onClick: () => scrollToSection("search"), icon: Stethoscope },
    { label: "Consultations & Visios", onClick: () => scrollToSection("appointments"), icon: Calendar, highlight: true },
    { label: "Prescriptions Émises", onClick: () => scrollToSection("prescriptions"), icon: FileText },
  ];

  const getPharmacyLinks = (): SidebarLink[] => [
    { label: "Guichet Officine", href: "/dashboard", icon: LayoutDashboard },
    { label: "Valider une Ordonnance", onClick: () => scrollToSection("scanner"), icon: ScanLine, highlight: true },
    { label: "Délivrances Traitées", onClick: () => scrollToSection("history"), icon: FileCheck },
  ];

  const links: SidebarLink[] =
    user.role === "doctor"
      ? getDoctorLinks()
      : user.role === "pharmacy"
      ? getPharmacyLinks()
      : getPatientLinks();

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <div className="sticky top-20 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-6">
        
        {/* En-tête rôle */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Espace connecté</p>
          <p className="text-sm font-black text-slate-900 dark:text-white capitalize">
            {user.role === "doctor" ? "Praticien Hospitalier" : user.role === "pharmacy" ? "Officine Agréée" : "Espace Patient ARCH"}
          </p>
          <p className="text-[11px] font-mono text-teal-600 dark:text-teal-400 mt-0.5 truncate">
            {user.npi ? `NPI: ${user.npi}` : (user.professionalId ? `ID: ${user.professionalId}` : user.email)}
          </p>
        </div>

        {/* Liens de navigation */}
        <nav className="space-y-1">
          {links.map((link, idx) => {
            const Icon = link.icon;
            if (link.onClick) {
              return (
                <button
                  key={idx}
                  onClick={link.onClick}
                  className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    link.highlight
                      ? "bg-teal-600 text-white hover:bg-teal-500 shadow-md shadow-teal-600/20 active:scale-95"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.highlight ? "text-white" : "text-teal-600"}`} />
                  <span>{link.label}</span>
                </button>
              );
            }

            const isActive = pathname === link.href;
            return (
              <Link
                key={idx}
                href={link.href || "/dashboard"}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-teal-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Souveraineté & Urgence */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-[11px] text-teal-900 dark:text-teal-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Souveraineté des Données</span>
            </div>
            <p className="text-[10px] text-teal-700 dark:text-teal-300 leading-tight">
              Hébergement sécurisé au Data Center National du Bénin. Protection ANIP.
            </p>
          </div>

          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
            <span>SAMU Bénin : 112</span>
          </a>
        </div>

      </div>
    </aside>
  );
}
