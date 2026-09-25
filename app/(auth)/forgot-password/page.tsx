import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Récupération de compte | Care.bj - Portail National de Santé",
  description:
    "Réinitialisez le mot de passe de votre Espace Santé Bénin par e-mail ou SMS sécurisé.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mb-3 border border-amber-200/60 dark:border-amber-800/60 shadow-inner">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Mot de passe oublié ?
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Recevez une clé d&apos;accès temporaire pour restaurer votre compte
        </p>
      </div>

      {/* Formulaire */}
      <ForgotPasswordForm />

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
            Mémoire retrouvée ?
          </span>
        </div>
      </div>

      {/* Retour à la connexion */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link
            href="/login"
            className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-2 transition-colors ml-1"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}