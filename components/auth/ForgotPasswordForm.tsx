"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordSchema } from "@/lib/auth/validation";

export default function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Démo rapide
  const handleQuickDemo = (val: string) => {
    setIdentifier(val);
    setError(undefined);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);

    const result = forgotPasswordSchema.safeParse({ identifier });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setError(fieldErrors.identifier?.[0]);
      setIsLoading(false);
      return;
    }

    // Simulation d'envoi d'instructions par e-mail ou SMS
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch {
      setError("Une erreur est survenue lors de l'envoi de la demande.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl border border-emerald-200 dark:border-emerald-800 shadow-inner">
          ✓
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Instructions transmises !
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Si un compte est associé à <strong className="text-slate-900 dark:text-white font-mono">{identifier}</strong>, un lien sécurisé ou un code temporaire de réinitialisation vous a été envoyé sans frais.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
          Vérifiez votre boîte de réception (y compris les courriers indésirables / spams) ou vos SMS au Bénin.
        </div>

        <div className="pt-2 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setIdentifier("");
            }}
            className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all"
          >
            Renvoyer avec une autre coordonnée
          </button>

          <Link
            href="/login"
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 text-center"
          >
            Retourner à l&apos;écran de connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Raccourcis test rapide */}
      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400">
        <span className="font-medium">Test rapide :</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemo("bio.kora@citoyen.bj")}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 border border-slate-200 dark:border-slate-600 font-semibold"
          >
            E-mail
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("+229 97 12 34 56")}
            className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 text-teal-700 dark:text-teal-300 hover:bg-teal-50 border border-slate-200 dark:border-slate-600 font-semibold"
          >
            SMS (+229)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="identifier"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            Adresse e-mail ou Numéro de téléphone béninois
          </label>

          <input
            id="identifier"
            name="identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (error) setError(undefined);
            }}
            placeholder="Ex: citoyen@email.bj ou +229 97 12 34 56"
            autoComplete="username"
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
            }`}
          />

          {error && (
            <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
          Un code de déverrouillage sécurisé à usage unique vous sera envoyé pour réinitialiser vos identifiants d&apos;accès.
        </p>

        {/* Bouton d'envoi */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] px-4 py-3 text-sm font-bold text-white transition-all shadow-md shadow-teal-600/25 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Vérification de sécurité...</span>
            </>
          ) : (
            <span>Envoyer le lien de réinitialisation</span>
          )}
        </button>
      </form>
    </div>
  );
}
