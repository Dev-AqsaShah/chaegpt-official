import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma";
import { resolve } from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createAdapter() {
  // Production/remote: Turso (libsql) — set TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
  if (process.env.TURSO_DATABASE_URL) {
    return new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  // Local dev: plain SQLite file
  const dbPath = resolve(process.cwd(), "dev.db");
  return new PrismaBetterSqlite3({ url: `file:${dbPath}` });
}

function createPrisma() {
  return new PrismaClient({
    adapter: createAdapter(),
    log: process.env.NODE_ENV === "development" ? ["error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
