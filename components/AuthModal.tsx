'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; role: string; id: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: AuthModalProps) {
  const [role, setRole] = useState<'patient' | 'doctor' | 'pharmacy'>('patient');
  const [identifier, setIdentifier] = useState('');
  const [phone, setPhone] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          phone,
          role,
          purpose: "login",
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(data.message || "Erreur d'envoi du code.");
        setLoading(false);
        return;
      }

      setOtpStep(true);
      setOtpCode('');
    } catch (err) {
      console.error("Erreur OTP send:", err);
      setApiError("Impossible de joindre le serveur.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          phone,
          code: otpCode,
          purpose: "login",
          role,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setApiError(data.message || "Code invalide.");
        setLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem("carebj_user", JSON.stringify(data.user));
        let roleDisplay = "Citoyen Assuré ARCH";
        if (data.user.role === "doctor") {
          roleDisplay = `Médecin ${data.user.professionalId || "CNHU"}`;
        } else if (data.user.role === "pharmacy") {
          roleDisplay = `Officine ${data.user.professionalId || "Agréée"}`;
        }

        onLoginSuccess({
          name: `${data.user.firstName} ${data.user.lastName}`,
          role: roleDisplay,
          id: data.user.npi || data.user.id,
        });
      }

      onClose();
    } catch (err) {
      console.error("Erreur OTP verify:", err);
      setApiError("Erreur de validation réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        
        {/* En-tête */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xl">
              🔐
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Portail National de Connexion
              </h3>
              <p className="text-xs text-slate-500">Identification Souveraine ANIP Bénin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Choix du rôle */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            type="button"
            onClick={() => { setRole('patient'); setOtpStep(false); setApiError(null); }}
            className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
              role === 'patient'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            👤 Patient / NPI
          </button>
          <button
            type="button"
            onClick={() => { setRole('doctor'); setOtpStep(false); setApiError(null); }}
            className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
              role === 'doctor'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            🩺 Médecin
          </button>
          <button
            type="button"
            onClick={() => { setRole('pharmacy'); setOtpStep(false); setApiError(null); }}
            className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
              role === 'pharmacy'
                ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            💊 Pharmacie
          </button>
        </div>

        {apiError && (
          <div className="my-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs">
            {apiError}
          </div>
        )}

        {/* Formulaire étape 1 : Envoi OTP */}
        {!otpStep ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                {role === 'patient' ? "Numéro Personnel d'Identification (NPI / ANIP) :" : "Numéro d'Ordre ou Agrément :"}
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-teal-500"
                placeholder="Ex: 1092-8472-9104"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Numéro de Téléphone (MTN, Moov, Celtiis) :
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-teal-500"
                placeholder="+229 97 XX XX XX"
              />
            </div>

            <p className="text-[11px] text-slate-500 leading-tight">
              Un code de sécurité éphémère (OTP) vous sera envoyé par SMS sans frais.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              {loading ? "Génération du code..." : "Recevoir mon code SMS"}
            </button>
          </form>
        ) : (
          /* Formulaire étape 2 : Saisie OTP */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
              <span>📩</span>
              <span>Code de sécurité envoyé par SMS au <strong>{phone}</strong>.</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Saisissez le code secret à 6 chiffres :
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                placeholder="••••••"
                className="w-full text-center tracking-[0.5em] text-2xl font-black py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition-all active:scale-98"
            >
              {loading ? "Vérification..." : "Valider et Accéder à mon Espace"}
            </button>
          </form>
        )}

        {/* Lien direct vers le portail complet */}
        <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <Link
            href="/login"
            onClick={onClose}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Se connecter avec mot de passe (Portail complet) →
          </Link>
        </div>

      </div>
    </div>
  );
}
