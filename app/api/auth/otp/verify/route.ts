import { NextRequest, NextResponse } from "next/server";
import { otpRepository, userRepository, sanitizeUser } from "@/lib/db";
import { signToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, phone, code, purpose = "login" } = body;

    const targetIdentifier = phone?.trim() || identifier?.trim();

    if (!targetIdentifier || !code) {
      return NextResponse.json(
        {
          success: false,
          message: "L'identifiant et le code secret sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const cleanIdentifier = targetIdentifier.trim();

    // 1. Vérification du code dans PostgreSQL (table otp_records)
    const check = await otpRepository.verify(cleanIdentifier, code, purpose);
    if (!check.valid) {
      return NextResponse.json(
        {
          success: false,
          message: check.message || "Code secret invalide.",
        },
        { status: 400 }
      );
    }

    // 2. Si le but était reset-password
    if (purpose === "reset-password") {
      return NextResponse.json({
        success: true,
        message: "Code validé. Vous pouvez réinitialiser votre mot de passe.",
        verified: true,
      });
    }

    // 3. Connexion : recherche stricte de l'utilisateur existant
    const user = await userRepository.findByIdentifier(cleanIdentifier);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Aucun compte correspondant trouvé dans la base de données.",
        },
        { status: 404 }
      );
    }

    // 4. Génération de token de session JWT
    const token = await signToken({
      sub: user.id,
      role: user.role,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      npi: user.npi,
      phone: user.phone,
    });

    const safeUser = sanitizeUser(user);

    const response = NextResponse.json({
      success: true,
      message: "Authentification par code SMS réussie.",
      user: safeUser,
      token,
    });

    // 5. Injection du cookie de session HTTP-Only
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Erreur API OTP Verify :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue lors de la validation du code.",
      },
      { status: 500 }
    );
  }
}
