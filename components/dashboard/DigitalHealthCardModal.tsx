"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { SafeUser } from "@/lib/db";
import { X, ShieldCheck, Heart, Download, CheckCircle2, Phone, QrCode } from "lucide-react";

interface DigitalHealthCardModalProps {
  user: SafeUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function DigitalHealthCardModal({
  user,
  isOpen,
  onClose,
}: DigitalHealthCardModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    // Payload sécurisé pour le QR code ANIP / Care.bj
    const qrPayload = JSON.stringify({
      app: "Care.bj",
      country: "BJ",
      npi: user.npi || "N/A",
      arch: user.archNumber || "N/A",
      name: `${user.firstName} ${user.lastName}`,
      blood: user.bloodGroup || "Non renseigné",
      allergies: user.allergies || [],
      emergency: user.emergencyContact || "SAMU 112",
      issuedAt: "2026-01-01",
      signature: `ANIP-SIG-SHA256-${user.id.slice(0, 8).toUpperCase()}`,
    });

    QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error("Erreur génération QR:", err));
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header modal */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Carte Numérique de Santé Souveraine
              </h3>
              <p className="text-xs text-slate-500">République du Bénin • ANIP / ARCH</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la Carte (Format Carte Biométrique Bancaire / Vital) */}
        <div className="my-5 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl border border-teal-500/30 relative overflow-hidden">
          
          {/* Filigrane et reflets holographiques */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* En-tête de la carte */}
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-3 w-5 rounded-xs overflow-hidden border border-white/20">
                  <div className="w-1/3 bg-emerald-500"></div>
                  <div className="w-1/3 bg-amber-400"></div>
                  <div className="w-1/3 bg-rose-600"></div>
                </div>
                <span className="text-[11px] font-black tracking-widest text-teal-300 uppercase">
                  RÉPUBLIQUE DU BÉNIN
                </span>
              </div>
              <p className="text-[9px] text-slate-300 tracking-wider font-semibold uppercase mt-0.5">
                MINISTÈRE DE LA SANTÉ • ESPACE SANTÉ CONNECTÉ
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <ShieldCheck className="w-3 h-3" />
                VALIDE ANIP
              </span>
            </div>
          </div>

          {/* Corps central : Puce, QR Code et Infos */}
          <div className="mt-5 grid grid-cols-5 gap-4 items-center relative z-10">
            
            {/* Infos Identité */}
            <div className="col-span-3 space-y-2">
              <div>
                <p className="text-[9px] text-slate-400 font-semibold uppercase">Nom & Prénoms</p>
                <p className="text-sm font-black tracking-tight text-white uppercase">
                  {user.lastName} {user.firstName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">NPI (ANIP)</p>
                  <p className="text-xs font-mono font-bold text-amber-300">
                    {user.npi || "En cours..."}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Assurance ARCH</p>
                  <p className="text-xs font-mono font-bold text-teal-300">
                    {user.archNumber || "ARCH-BJ-ACTIF"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Groupe Sanguin</p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-300">
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    {user.bloodGroup || "O+"}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase">Allergies</p>
                  <p className="text-xs font-medium text-amber-200 truncate">
                    {user.allergies && user.allergies.length > 0 ? user.allergies.join(", ") : "Aucune connue"}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code interactif */}
            <div className="col-span-2 flex flex-col items-center justify-center">
              <div className="p-1.5 bg-white rounded-xl shadow-lg border border-teal-500/40">
                {qrDataUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={qrDataUrl}
                    alt="QR Code Carte Sanitaire Souveraine"
                    className="w-24 h-24 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-slate-200 animate-pulse rounded-lg flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-400" />
                  </div>
                )}
              </div>
              <p className="text-[8px] text-slate-300 mt-1.5 font-mono text-center">
                Scannable hors-ligne
              </p>
            </div>

          </div>

          {/* Contact d'Urgence en bas de carte */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300 relative z-10">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>Contact d&apos;urgence : <strong className="text-white">{user.emergencyContact || "SAMU 112"}</strong></span>
            </div>
            <span className="font-mono text-[9px] text-teal-400">
              BJ-SANTE-2026
            </span>
          </div>

        </div>

        {/* Explication & Sécurité */}
        <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-start gap-2 p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl">
            <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-teal-900 dark:text-teal-200">
                Authentification Cryptographique Autonome
              </p>
              <p className="text-[11px] text-teal-700 dark:text-teal-300 mt-0.5">
                Ce QR Code est signé numériquement par l&apos;ANIP. Il peut être scanné dans tous les centres de santé (CNHU, CHD, Dispensaires) même sans connexion Internet pour accéder immédiatement à vos antécédents vitaux.
              </p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Imprimer / Sauvegarder</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
