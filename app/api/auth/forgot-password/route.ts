import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/auth/validation";
import { userRepository, otpRepository } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Format d'identifiant invalide.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { identifier } = validation.data;
    const user = await userRepository.findByIdentifier(identifier);

    if (user) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await otpRepository.create(user.email, "reset-password", code, 10);
      if (user.phone) {
        await otpRepository.create(user.phone, "reset-password", code, 10);
      }
      console.log(`[RÉINITIALISATION MOT DE PASSE] Code ${code} généré pour ${identifier}`);
    }

    return NextResponse.json({
      success: true,
      message:
        "Si un compte correspond à cette saisie, les instructions et le code de sécurité ont été envoyés.",
    });
  } catch (error) {
    console.error("Erreur API Forgot Password :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue lors de la demande de réinitialisation.",
      },
      { status: 500 }
    );
  }
}
