import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer un compte | Care.bj - Portail National de Santé",
  description:
    "Activez votre compte national de santé au Bénin : Dossier Médical Partagé, ordonnances électroniques et téléconsultations sécurisées.",
};

export default function RegisterPage() {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mb-3 border border-teal-200/60 dark:border-teal-800/60 shadow-inner">
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Créer un compte santé
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Rejoignez l&apos;écosystème d&apos;e-Santé inclusif de la République du Bénin
        </p>
      </div>

      {/* Formulaire d'inscription */}
      <RegisterForm />

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
            Déjà inscrit ?
          </span>
        </div>
      </div>

      {/* Lien vers connexion */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Vous possédez déjà un compte actif ?{" "}
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