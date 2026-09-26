"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginSchema, UserRole } from "@/lib/auth/validation";

export default function LoginForm() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("patient");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
    general?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const result = loginSchema.safeParse({
      identifier,
      password,
      role,
      rememberMe,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        identifier: fieldErrors.identifier?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    // Appel réel à l'API d'authentification
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
          role,
          rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({
          general: data.message || "Identifiant ou mot de passe incorrect.",
        });
        setIsLoading(false);
        return;
      }

      // Stockage de secours pour l'état côté client
      if (data.user) {
        localStorage.setItem("carebj_user", JSON.stringify(data.user));
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 800);
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setErrors({
        general: "Impossible de joindre le serveur d'authentification. Vérifiez votre connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const getIdentifierLabel = () => {
    switch (role) {
      case "doctor":
        return "N° Ordre Médecins (ONMB) ou E-mail";
      case "pharmacy":
        return "N° Agrément ABMed ou E-mail";
      default:
        return "E-mail, NPI (ANIP) ou Téléphone béninois";
    }
  };

  const getIdentifierPlaceholder = () => {
    switch (role) {
      case "doctor":
        return "Ex: ONMB-4812 ou dr.nom@sante.bj";
      case "pharmacy":
        return "Ex: ABMED-2024 ou pharmacie@bj.com";
      default:
        return "Ex: 1092-8472-9104 ou +229 97 12 34 56";
    }
  };

  return (
    <div className="space-y-6">
      {/* Sélecteur de rôle */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Espace de santé à ouvrir :
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setRole("patient");
              setErrors({});
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
              role === "patient"
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400"
            }`}
          >
            <span className="text-base">👤</span>
            <span>Patient / NPI</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("doctor");
              setErrors({});
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
              role === "doctor"
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400"
            }`}
          >
            <span className="text-base">🩺</span>
            <span>Médecin</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRole("pharmacy");
              setErrors({});
            }}
            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center flex flex-col items-center justify-center gap-1 ${
              role === "pharmacy"
                ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400"
            }`}
          >
            <span className="text-base">💊</span>
            <span>Pharmacie</span>
          </button>
        </div>
      </div>

      {/* Message de succès */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="font-bold">Connexion réussie !</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Redirection sécurisée vers votre Espace Santé...
            </p>
          </div>
        </div>
      )}

      {/* Message d'erreur générale */}
      {errors.general && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {errors.general}
        </div>
      )}

      {/* Formulaire de connexion */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Identifiant */}
        <div>
          <label
            htmlFor="identifier"
            className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {getIdentifierLabel()}
          </label>

          <div className="relative">
            <input
              id="identifier"
              name="identifier"
              type="text"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
              }}
              placeholder={getIdentifierPlaceholder()}
              autoComplete="username"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.identifier
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
          </div>

          {errors.identifier && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.identifier}
            </p>
          )}
        </div>

        {/* Mot de passe */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Mot de passe
            </label>

            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`w-full rounded-xl border px-3.5 py-2.5 pr-11 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.password
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? "Masquer" : "Afficher"}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.password}
            </p>
          )}
        </div>

        {/* Mémoriser l'appareil */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              Mémoriser cet appareil (30 jours)
            </span>
          </label>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
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
              <span>Vérification sécurisée...</span>
            </>
          ) : isSuccess ? (
            <span>Redirection en cours...</span>
          ) : (
            <span>Se connecter à mon Espace</span>
          )}
        </button>
      </form>
    </div>
  );
}