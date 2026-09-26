"use client";

import React, { useState } from "react";
import { X, Activity, Heart, Scale, Droplet, AlertCircle } from "lucide-react";

interface AddVitalSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type VitalType = "blood_pressure" | "glucose" | "heart_rate" | "weight" | "temperature";

export default function AddVitalSignModal({
  isOpen,
  onClose,
  onSuccess,
}: AddVitalSignModalProps) {
  const [type, setType] = useState<VitalType>("blood_pressure");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const getUnit = (t: VitalType) => {
    switch (t) {
      case "blood_pressure":
        return "mmHg";
      case "glucose":
        return "g/L";
      case "heart_rate":
        return "bpm";
      case "weight":
        return "kg";
      case "temperature":
        return "°C";
    }
  };

  const getPlaceholder = (t: VitalType) => {
    switch (t) {
      case "blood_pressure":
        return "Ex: 12/8";
      case "glucose":
        return "Ex: 0.95";
      case "heart_rate":
        return "Ex: 72";
      case "weight":
        return "Ex: 71.5";
      case "temperature":
        return "Ex: 36.8";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError("Veuillez saisir une valeur.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          value: value.trim(),
          unit: getUnit(type),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || "Erreur lors de l'enregistrement");
        setLoading(false);
        return;
      }

      setValue("");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Erreur enregistrement vital:", err);
      setError("Impossible de joindre le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600">
              <Activity className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Enregistrer une constante vitale
              </h3>
              <p className="text-xs text-slate-500">Suivi connecté e-Santé Bénin</p>
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
          
          {/* Sélection du type de mesure */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
              Type de constante :
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { setType("blood_pressure"); setValue(""); }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === "blood_pressure"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Activity className="w-4 h-4 text-rose-400" />
                <span>Tension artérielle</span>
              </button>

              <button
                type="button"
                onClick={() => { setType("glucose"); setValue(""); }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === "glucose"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Droplet className="w-4 h-4 text-amber-400" />
                <span>Glycémie</span>
              </button>

              <button
                type="button"
                onClick={() => { setType("heart_rate"); setValue(""); }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === "heart_rate"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Heart className="w-4 h-4 text-rose-500" />
                <span>Fréquence cardiaque</span>
              </button>

              <button
                type="button"
                onClick={() => { setType("weight"); setValue(""); }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                  type === "weight"
                    ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                }`}
              >
                <Scale className="w-4 h-4 text-blue-400" />
                <span>Poids corporel</span>
              </button>
            </div>
          </div>

          {/* Saisie de la valeur */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Valeur mesurée ({getUnit(type)}) :
            </label>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={getPlaceholder(type)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-lg font-bold focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">
                {getUnit(type)}
              </span>
            </div>
          </div>

          {/* Boutons */}
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
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Enregistrement..." : "Enregistrer dans mon dossier"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
