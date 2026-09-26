import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://carebj_admin:carebj_secure_pwd_2026@localhost:5434/carebj_health_db?schema=public";

const isPrismaProtocol = connectionString.startsWith("prisma+postgres://");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (isPrismaProtocol
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      })
    : (() => {
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({
          adapter,
          log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
        });
      })());

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
