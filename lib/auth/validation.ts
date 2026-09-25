import { z } from "zod";

export const RoleEnum = z.enum(["patient", "doctor", "pharmacy"]);
export type UserRole = z.infer<typeof RoleEnum>;

/**
 * Schéma de connexion unifié
 * Prend en charge l'e-mail, le numéro de téléphone (+229) ou le NPI ANIP
 */
export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Veuillez entrer votre e-mail, téléphone (+229) ou NPI"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  role: RoleEnum.default("patient"),
  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Schéma d'inscription complet
 * Ancré au contexte béninois (NPI ANIP, Téléphone +229, Rôles de santé)
 */
export const registerSchema = z
  .object({
    role: RoleEnum.default("patient"),
    firstName: z
      .string()
      .trim()
      .min(2, "Le prénom doit comporter au moins 2 caractères"),
    lastName: z
      .string()
      .trim()
      .min(2, "Le nom doit comporter au moins 2 caractères"),
    npi: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || /^[0-9A-Za-z-]{8,16}$/.test(val),
        "Le format du NPI ANIP est invalide (ex: 1092-8472-9104)"
      ),
    professionalId: z
      .string()
      .trim()
      .optional(),
    email: z
      .string()
      .trim()
      .email("Veuillez renseigner une adresse e-mail valide"),
    phone: z
      .string()
      .trim()
      .min(8, "Veuillez renseigner un numéro de téléphone valide")
      .regex(
        /^(?:\+229|00229)?[0-9\s]{8,14}$/,
        "Format béninois requis (ex: +229 97 12 34 56 ou 97123456)"
      ),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit inclure au moins une majuscule, une minuscule et un chiffre"
      ),
    confirmPassword: z
      .string()
      .min(1, "Veuillez confirmer votre mot de passe"),
    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "Vous devez accepter les conditions d'utilisation et la politique APDP Bénin",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schéma de réinitialisation de mot de passe oublié
 */
export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(3, "Veuillez entrer votre e-mail ou numéro de téléphone béninois (+229)"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;