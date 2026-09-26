import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "./jwt";
import { userRepository, sanitizeUser, SafeUser } from "@/lib/db";

export const AUTH_COOKIE_NAME = "carebj_token";

/**
 * Configure le cookie de session HTTP-Only sécurisé
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });
}

/**
 * Supprime le cookie de session lors de la déconnexion
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Extrait et valide la session utilisateur courante depuis la requête ou les cookies
 */
export async function getCurrentUser(
  request?: NextRequest
): Promise<{ user: SafeUser; payload: TokenPayload } | null> {
  let token: string | undefined;

  if (request) {
    // 1. Essai via les cookies de la requête
    token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    // 2. Fallback via le header Authorization Bearer
    if (!token) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    // Dans un Server Component ou Server Action
    const cookieStore = await cookies();
    token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  }

  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await userRepository.findById(payload.sub);
  if (!user) return null;

  return {
    user: sanitizeUser(user),
    payload,
  };
}
