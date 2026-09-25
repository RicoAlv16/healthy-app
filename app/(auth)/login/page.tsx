import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion sécurisée | Care.bj - Portail National de Santé",
  description:
    "Accédez à votre Dossier Médical Partagé, vos ordonnances et vos téléconsultations souveraines au Bénin.",
};

export default function LoginPage() {
  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Header du formulaire */}
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
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Espace Santé Sécurisé
        </h1>

        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Identifiez-vous pour accéder à vos services de santé nationaux
        </p>
      </div>

      {/* Formulaire interactif */}
      <LoginForm />

      {/* Séparateur */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold tracking-wider">
            Nouveau sur Care.bj ?
          </span>
        </div>
      </div>

      {/* Redirection Inscription */}
      <div className="text-center">
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Vous n&apos;avez pas encore activé votre compte ?{" "}
          <Link
            href="/register"
            className="font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 underline underline-offset-2 transition-colors ml-1"
          >
            Créer un compte citoyen
          </Link>
        </p>
      </div>
    </div>
  );
}