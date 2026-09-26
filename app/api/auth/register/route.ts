import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/auth/validation";
import { userRepository, sanitizeUser } from "@/lib/db";
import { signToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validation Zod
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Données d'inscription non valides.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 2. Vérification unicité Email
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      return NextResponse.json(
        {
          success: false,
          message: "Un compte existe déjà avec cette adresse e-mail.",
        },
        { status: 409 }
      );
    }

    // 3. Vérification unicité Téléphone
    const existingPhone = await userRepository.findByPhone(data.phone);
    if (existingPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Un compte existe déjà avec ce numéro de téléphone béninois.",
        },
        { status: 409 }
      );
    }

    // 4. Vérification NPI si fourni
    if (data.npi) {
      const existingNpi = await userRepository.findByNpi(data.npi);
      if (existingNpi) {
        return NextResponse.json(
          {
            success: false,
            message: "Ce Numéro Personnel d'Identification (NPI ANIP) est déjà associé à un dossier.",
          },
          { status: 409 }
        );
      }
    }

    // 5. Hashage sécurisé du mot de passe (bcrypt)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    // 6. Attribution d'identifiants souverains béninois si citoyen
    const assignedNpi =
      data.npi ||
      `2290-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const assignedArch =
      data.role === "patient"
        ? `ARCH-BJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
        : undefined;

    // 7. Enregistrement en base de données
    const newUser = await userRepository.create({
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      passwordHash,
      npi: assignedNpi,
      professionalId: data.professionalId,
      archNumber: assignedArch,
      isVerified: data.role === "patient", // Les citoyens sont vérifiés immédiatement
    });

    // 8. Génération du JWT souverain
    const token = await signToken({
      sub: newUser.id,
      role: newUser.role,
      email: newUser.email,
      name: `${newUser.firstName} ${newUser.lastName}`,
      npi: newUser.npi,
      phone: newUser.phone,
    });

    const safeUser = sanitizeUser(newUser);

    const response = NextResponse.json(
      {
        success: true,
        message: "Compte santé créé avec succès.",
        user: safeUser,
        token,
      },
      { status: 201 }
    );

    // 9. Positionnement du cookie sécurisé HTTP-Only
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Erreur API Register :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue lors de l'inscription.",
      },
      { status: 500 }
    );
  }
}
