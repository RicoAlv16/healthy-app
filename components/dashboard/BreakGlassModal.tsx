"use client";

import React, { useState } from "react";
import { X, AlertTriangle, ShieldAlert, Phone } from "lucide-react";
import { EmergencyAccessLogRecord } from "@/lib/db";

export interface SmsAlertInfo {
  success: boolean;
  to: string;
  message: string;
  timestamp: string;
}

interface BreakGlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  patientPhone: string;
  onSuccess: (log: EmergencyAccessLogRecord, smsAlert: SmsAlertInfo) => void;
}

export default function BreakGlassModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  patientPhone,
  onSuccess,
}: BreakGlassModalProps) {
  const [facility, setFacility] = useState("Service des Urgences Polyvalentes - CNHU-HKM Cotonou");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 30) {
      setError("La justification clinique doit comporter au moins 30 caractères détaillant l'urgence vitale.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/doctor/break-glass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          facility,
          reason: reason.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Erreur lors du déverrouillage d'urgence");
        setLoading(false);
        return;
      }

      onSuccess(data.log, data.smsAlert);
      onClose();
    } catch (err) {
      console.error("Erreur bris de glace:", err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-2 border-rose-500/40">
        
        {/* Header Urgence Vitale */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-100 dark:border-rose-950/60">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-600">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h3 className="text-base font-black text-rose-700 dark:text-rose-400">
                Protocole d&apos;Urgence « Bris de Glace »
              </h3>
              <p className="text-xs text-slate-500">Déverrouillage Médical d&apos;Urgence Vitale</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avertissement Déontologique & Légal APDP */}
        <div className="my-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 space-y-2">
          <div className="flex items-center gap-1.5 font-black text-rose-900 dark:text-rose-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>CONFORMITÉ STRICTE APDP & MINISTÈRE DE LA SANTÉ BÉNIN</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            La procédure de « Bris de Glace » contourne le consentement explicite du patient pour nécessité médicale absolue (inconscience, arrêt cardio-respiratoire, polytraumatisme).
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
            <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Un SMS d&apos;alerte sera immédiatement expédié au patient ({patientPhone}).</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-red-100 text-red-800 text-xs font-bold border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Patient concerné :
            </label>
            <p className="text-sm font-black text-slate-900 dark:text-white">
              {patientName}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Service médical / Établissement d&apos;urgence :
            </label>
            <input
              type="text"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Justification clinique obligatoire (min 30 car.) :
              </label>
              <span className={`text-[10px] font-mono ${reason.trim().length >= 30 ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                {reason.trim().length} / 30 car.
              </span>
            </div>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Patient admis inconscient suite à un AVP sur la RNIE 1. Suspicion d'hémorragie interne et détresse circulatoire. Consultation des allergies et du groupe sanguin requise."
              required
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || reason.trim().length < 30}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Déverrouillage..." : "Confirmer le Bris de Glace & Alerter"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
