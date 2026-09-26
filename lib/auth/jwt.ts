import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "care-bj-sante-sovereign-secret-key-benin-2026-very-secure-random-token";
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);

export interface TokenPayload {
  sub: string; // User ID
  role: "patient" | "doctor" | "pharmacy" | "admin";
  email: string;
  name: string;
  npi?: string | null;
  phone?: string | null;
}

/**
 * Signe un JWT sécurisé pour l'utilisateur
 */
export async function signToken(
  payload: TokenPayload,
  expiresIn = "7d"
): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

/**
 * Vérifie l'intégrité et la validité temporelle d'un JWT
 */
export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}
