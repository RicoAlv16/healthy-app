"use client";

import React, { useState } from "react";
import { SafeUser, PrescriptionRecord } from "@/lib/db";
import { 
  Building2, 
  ScanLine, 
  CheckCircle2, 
  AlertCircle, 
  Pill, 
  ShieldCheck, 
  FileCheck 
} from "lucide-react";

interface PharmacyDashboardProps {
  user: SafeUser;
  prescriptions: PrescriptionRecord[];
  onRefresh: () => void;
}

export default function PharmacyDashboard({
  user,
  prescriptions,
  onRefresh,
}: PharmacyDashboardProps) {
  const [codeQuery, setCodeQuery] = useState("ORD-2026-8841");
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PrescriptionRecord | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [dispensing, setDispensing] = useState(false);
  const [dispenseSuccess, setDispenseSuccess] = useState<string | null>(null);

  const handleVerifyCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!codeQuery.trim()) return;

    setVerifying(true);
    setVerificationError(null);
    setDispenseSuccess(null);

    try {
      // Rechercher l'ordonnance via API
      const res = await fetch("/api/prescriptions");
      const data = await res.json();

      if (res.ok && data.prescriptions) {
        const found = data.prescriptions.find(
          (p: PrescriptionRecord) => p.code.toUpperCase() === codeQuery.trim().toUpperCase()
        );

        if (found) {
          setVerificationResult(found);
        } else {
          // Essai direct via dispense check
          setVerificationResult(null);
          setVerificationError("Ordonnance non trouvée ou non attribuée à cette officine.");
        }
      }
    } catch (err) {
      console.error("Erreur vérification ordonnance:", err);
      setVerificationError("Impossible de joindre le registre national des prescriptions.");
    } finally {
      setVerifying(false);
    }
  };

  const handleDispense = async () => {
    if (!verificationResult) return;

    setDispensing(true);
    setVerificationError(null);
    setDispenseSuccess(null);

    try {
      const res = await fetch("/api/prescriptions/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationResult.code }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setVerificationError(data.message || "Erreur lors de la dispensation");
        setDispensing(false);
        return;
      }

      setDispenseSuccess(data.message);
      setVerificationResult(data.prescription);
      onRefresh();
    } catch (err) {
      console.error("Erreur délivrance:", err);
      setVerificationError("Erreur réseau");
    } finally {
      setDispensing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Officine Agréée */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Agrément ABMed : {user.professionalId || "ABMED-OFFICINE-2024-082"}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Officine Connectée Care.bj
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Building2 className="w-8 h-8 text-teal-400" />
              <span>{user.firstName} {user.lastName} (Pharmacie Camp Guézo)</span>
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Guichet national de validation et délivrance des e-ordonnances. Vérification instantanée par code ou QR code cryptographique.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Guichet ARCH Conventionné</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Scanner & Validation d'une E-Ordonnance */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ScanLine className="w-5 h-5 text-teal-600" />
            <span>Validation & Délivrance d&apos;une Ordonnance Électronique</span>
          </h2>
          <p className="text-xs text-slate-500">
            Saisissez le numéro unique de l&apos;ordonnance ou le hash scanné depuis le QR code du patient
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={codeQuery}
              onChange={(e) => setCodeQuery(e.target.value)}
              placeholder="Ex: ORD-2026-8841"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm uppercase focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={verifying}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-teal-700 text-white dark:bg-teal-600 dark:hover:bg-teal-500 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            {verifying ? "Vérification..." : "Vérifier l'ordonnance"}
          </button>
        </form>

        {verificationError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs border border-red-200 dark:border-red-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{verificationError}</span>
          </div>
        )}

        {dispenseSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{dispenseSuccess}</span>
          </div>
        )}

        {/* Détails de l'ordonnance vérifiée */}
        {verificationResult && (
          <div className="mt-6 p-5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 animate-fade-in space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-teal-200/60 dark:border-teal-800/60 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-black text-teal-800 dark:text-teal-300">
                    {verificationResult.code}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    verificationResult.status === "active"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                  }`}>
                    {verificationResult.status === "active" ? "Valide • Prête à la délivrance" : "Déjà délivrée"}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  Patient : <strong>{verificationResult.patient?.firstName} {verificationResult.patient?.lastName}</strong> (NPI: {verificationResult.patient?.npi} • ARCH: {verificationResult.patient?.archNumber})
                </p>
                <p className="text-xs text-slate-500">
                  Prescripteur : Dr. {verificationResult.doctor?.firstName} {verificationResult.doctor?.lastName} ({verificationResult.doctor?.professionalId || "CNHU-HKM"})
                </p>
              </div>

              {verificationResult.status === "active" ? (
                <button
                  onClick={handleDispense}
                  disabled={dispensing}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{dispensing ? "Validation..." : "Valider la délivrance des médicaments"}</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold">
                  Délivrance clôturée {verificationResult.dispensedAt ? `le ${new Date(verificationResult.dispensedAt).toLocaleDateString("fr-BJ")}` : "récemment"}
                </span>
              )}
            </div>

            {/* Liste des médicaments à délivrer */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                Médicaments & Posologies prescrits :
              </p>
              <div className="space-y-2">
                {verificationResult.medications.map((m, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Pill className="w-3.5 h-3.5 text-teal-600" />
                        <span>{m.name}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Posologie : {m.dosage} • Durée : {m.duration}
                      </p>
                      {m.instructions && (
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5 italic">
                          Consigne : {m.instructions}
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-teal-600 px-2 py-1 bg-teal-50 dark:bg-teal-950/40 rounded-lg">
                      {m.quantity || "1 boîte"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 3. Historique des ordonnances délivrées en officine */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-teal-600" />
            <span>Historique des Ordonnances Traitées</span>
          </h3>
          <span className="text-xs text-slate-500">
            {prescriptions.length} ordonnance(s) au total
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {prescriptions.length === 0 ? (
            <p className="py-6 text-center text-slate-400 text-xs">Aucune ordonnance délivrée récemment.</p>
          ) : (
            prescriptions.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-teal-600 dark:text-teal-400">{p.code}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === "dispensed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {p.status === "dispensed" ? "Délivrée" : "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    Patient : {p.patient?.firstName} {p.patient?.lastName} • NPI: {p.patient?.npi}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {p.medications.length} médicament(s) • Émise par Dr. {p.doctor?.lastName}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => {
                      setCodeQuery(p.code);
                      handleVerifyCode();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition-colors"
                  >
                    Examiner
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
