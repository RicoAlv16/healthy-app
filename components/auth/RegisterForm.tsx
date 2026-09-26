"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerSchema, UserRole } from "@/lib/auth/validation";

type FormErrors = {
  role?: string;
  firstName?: string;
  lastName?: string;
  npi?: string;
  professionalId?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: string;
  general?: string;
};

export default function RegisterForm() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("patient");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    npi: "",
    professionalId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Détection de la force du mot de passe
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/\d/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score; // 0 to 5
  };

  const pwdScore = getPasswordStrength(formData.password);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrors({});
    setIsLoading(true);

    const result = registerSchema.safeParse({
      role,
      firstName: formData.firstName,
      lastName: formData.lastName,
      npi: formData.npi ? formData.npi : undefined,
      professionalId: formData.professionalId ? formData.professionalId : undefined,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      acceptTerms: formData.acceptTerms,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        firstName: fieldErrors.firstName?.[0],
        lastName: fieldErrors.lastName?.[0],
        npi: fieldErrors.npi?.[0],
        professionalId: fieldErrors.professionalId?.[0],
        email: fieldErrors.email?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
        confirmPassword: fieldErrors.confirmPassword?.[0],
        acceptTerms: fieldErrors.acceptTerms?.[0],
      });

      setIsLoading(false);
      return;
    }

    // Appel réel à l'API d'inscription
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role,
          firstName: formData.firstName,
          lastName: formData.lastName,
          npi: formData.npi ? formData.npi : undefined,
          professionalId: formData.professionalId ? formData.professionalId : undefined,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.acceptTerms,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrors({
          general: data.message || "Erreur lors de la création de votre dossier de santé.",
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        localStorage.setItem("carebj_user", JSON.stringify(data.user));
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err) {
      console.error("Erreur d'inscription :", err);
      setErrors({
        general: "Impossible de joindre le serveur d'authentification. Réessayez dans un instant.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Sélecteur de rôle d'inscription */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Je crée un compte en qualité de :
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
            <span>Citoyen / Patient</span>
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
            <span>Praticien de Santé</span>
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
            <span>Officine Pharmacie</span>
          </button>
        </div>
      </div>

      {/* Bannière de succès */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="font-bold">Compte créé avec succès !</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      )}

      {errors.general && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {errors.general}
        </div>
      )}

      {/* Formulaire d'inscription */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prénom / Nom */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="given-name"
              placeholder="Ex: Bio Kora"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.firstName
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Nom de famille
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="family-name"
              placeholder="Ex: BIO"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.lastName
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* NPI ANIP ou Identifiant professionnel selon le rôle */}
        {role === "patient" ? (
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="npi"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Numéro Personnel d&apos;Identification (NPI / ANIP)
              </label>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">
                Recommandé ARCH
              </span>
            </div>
            <input
              id="npi"
              name="npi"
              type="text"
              value={formData.npi}
              onChange={handleChange}
              placeholder="Ex: 1092-8472-9104"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.npi
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.npi && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.npi}</p>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor="professionalId"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              {role === "doctor"
                ? "Numéro d'Ordre National des Médecins (ONMB)"
                : "Numéro d'Agrément Officine (ABMed)"}
            </label>
            <input
              id="professionalId"
              name="professionalId"
              type="text"
              value={formData.professionalId}
              onChange={handleChange}
              placeholder={role === "doctor" ? "Ex: ONMB-4812" : "Ex: ABMED-2024-OFFICINE"}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.professionalId
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.professionalId && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.professionalId}
              </p>
            )}
          </div>
        )}

        {/* E-mail et Téléphone béninois */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Adresse e-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="citoyen@email.bj"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.email
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="phone"
                className="block text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                Téléphone béninois
              </label>
              <span className="text-[10px] text-slate-400">MTN • Moov • Celtiis</span>
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              autoComplete="tel"
              placeholder="+229 97 12 34 56"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-mono outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                errors.phone
                  ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                  : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
              }`}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        {/* Mot de passe et confirmation */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
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
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? "Masquer" : "Voir"}
              </button>
            </div>

            {/* Jauge de sécurité mot de passe */}
            {formData.password && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex gap-0.5">
                  <div
                    className={`h-full transition-all ${
                      pwdScore <= 2
                        ? "w-1/3 bg-rose-500"
                        : pwdScore <= 4
                        ? "w-2/3 bg-amber-500"
                        : "w-full bg-emerald-500"
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {pwdScore <= 2 ? "Faible" : pwdScore <= 4 ? "Moyen" : "Sécurisé"}
                </span>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300"
            >
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-xl border px-3.5 py-2.5 pr-11 text-sm outline-none transition-all dark:bg-slate-800/90 dark:text-white ${
                  errors.confirmPassword
                    ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-950"
                    : "border-slate-300 dark:border-slate-700 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-950"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
                aria-label={showConfirmPassword ? "Masquer" : "Afficher"}
              >
                {showConfirmPassword ? "Masquer" : "Voir"}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Acceptation des conditions APDP */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
              J&apos;accepte les conditions générales d&apos;utilisation et consens au traitement souverain de mes données de santé conformément à la législation APDP Bénin.
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="mt-1 text-xs text-red-500 font-medium">
              {errors.acceptTerms}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
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
              <span>Création de votre dossier...</span>
            </>
          ) : isSuccess ? (
            <span>Compte validé !</span>
          ) : (
            <span>Créer mon compte santé</span>
          )}
        </button>
      </form>
    </div>
  );
}