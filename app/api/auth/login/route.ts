import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/auth/validation";
import { userRepository, sanitizeUser } from "@/lib/db";
import { signToken } from "@/lib/auth/jwt";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Validation du schéma
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: "Données de connexion invalides.",
          errors: fieldErrors,
        },
        { status: 400 }
      );
    }

    const { identifier, password, rememberMe } = validation.data;

    // 2. Recherche tolérante (Email, Téléphone béninois ou NPI ANIP)
    const user = await userRepository.findByIdentifier(identifier);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiant ou mot de passe incorrect.",
        },
        { status: 401 }
      );
    }

    // 3. Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Identifiant ou mot de passe incorrect.",
        },
        { status: 401 }
      );
    }

    // 4. Durée de validité du token
    const expiresIn = rememberMe ? "30d" : "7d";

    // 5. Signature du JWT
    const token = await signToken(
      {
        sub: user.id,
        role: user.role,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        npi: user.npi,
        phone: user.phone,
      },
      expiresIn
    );

    const safeUser = sanitizeUser(user);

    const response = NextResponse.json(
      {
        success: true,
        message: "Authentification réussie.",
        user: safeUser,
        token,
      },
      { status: 200 }
    );

    // 6. Injection du cookie sécurisé
    setSessionCookie(response, token);

    return response;
  } catch (error) {
    console.error("Erreur API Login :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Une erreur interne est survenue lors de l'authentification.",
      },
      { status: 500 }
    );
  }
}
