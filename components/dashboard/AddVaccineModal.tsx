"use client";

import React, { useState } from "react";
import { X, AlertCircle, Syringe } from "lucide-react";

interface AddVaccineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId?: string;
}

const PEV_VACCINES = [
  { name: "BCG", disease: "Tuberculose pulmonaire et méningée", defaultDose: "Dose unique (Naissance)" },
  { name: "Pentavalent (DTC-HepB-Hib)", disease: "Diphtérie, Tétanos, Coqueluche, Hépatite B, Hib", defaultDose: "Dose 1 / 3" },
  { name: "Polio Oral (VPO)", disease: "Poliomyélite", defaultDose: "Dose de routine" },
  { name: "Polio Injectable (VPI)", disease: "Poliomyélite", defaultDose: "Dose injectable" },
  { name: "Pneumocoque (PCV13)", disease: "Pneumonies et méningites à pneumocoque", defaultDose: "Dose 1 / 3" },
  { name: "Rotavirus", disease: "Diarrhées sévères à rotavirus", defaultDose: "Dose 1 / 2" },
  { name: "Fièvre Jaune (VAA)", disease: "Fièvre Jaune (Arbovirose)", defaultDose: "Dose unique (À vie)" },
  { name: "Rougeole-Rubéole (RR)", disease: "Rougeole et Rubéole congénitale", defaultDose: "Dose 1" },
  { name: "Méningite A (MenA)", disease: "Méningite cérébrospinale à méningocoque A", defaultDose: "Dose unique" },
  { name: "VAT (Antitétanique)", disease: "Tétanos néonatal et adulte", defaultDose: "Rappel décennal (10 ans)" },
];

export default function AddVaccineModal({
  isOpen,
  onClose,
  onSuccess,
  patientId,
}: AddVaccineModalProps) {
  const [selectedVaccineIdx, setSelectedVaccineIdx] = useState(0);
  const [dose, setDose] = useState(PEV_VACCINES[0].defaultDose);
  const [batchNumber, setBatchNumber] = useState("");
  const [facility, setFacility] = useState("CNHU-HKM Cotonou - Centre de Vaccination");
  const [administeredAt, setAdministeredAt] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectVaccine = (idx: number) => {
    setSelectedVaccineIdx(idx);
    setDose(PEV_VACCINES[idx].defaultDose);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const vaccine = PEV_VACCINES[selectedVaccineIdx];

    try {
      const res = await fetch("/api/vaccinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId,
          vaccineName: vaccine.name,
          diseaseTarget: vaccine.disease,
          dose: dose.trim(),
          status: "administered",
          batchNumber: batchNumber.trim() || undefined,
          facility: facility.trim() || undefined,
          administeredAt: new Date(administeredAt).toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Erreur lors de l'enregistrement");
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur enregistrement vaccin:", err);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">
              <Syringe className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enregistrer un vaccin (PEV Bénin)
              </h3>
              <p className="text-xs text-slate-500">Carnet Vaccinal Électronique National</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="my-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Sélection du vaccin du calendrier PEV Bénin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Vaccin du calendrier officiel :
            </label>
            <select
              value={selectedVaccineIdx}
              onChange={(e) => handleSelectVaccine(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold focus:ring-2 focus:ring-teal-500 outline-none"
            >
              {PEV_VACCINES.map((v, i) => (
                <option key={i} value={i}>
                  {v.name} — {v.disease}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1">
              Protection : {PEV_VACCINES[selectedVaccineIdx].disease}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Dose / Rappel :
              </label>
              <input
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                required
                placeholder="Ex: Dose unique, Dose 1/3"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Date d&apos;administration :
              </label>
              <input
                type="date"
                value={administeredAt}
                onChange={(e) => setAdministeredAt(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Numéro de Lot du vaccin :
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Ex: LOT-PEV-2026-88"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Structure Sanitaire :
              </label>
              <input
                type="text"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                required
                placeholder="Ex: CNHU-HKM ou CSA Godomey"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? "Enregistrement..." : "Enregistrer dans le carnet PEV"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
