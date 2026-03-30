import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as Schema from "../schema";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
export * as Schema from "../schema";
// Database connection config
const connectionString = process.env.DATABASE_URL ?? "postgres://localhost:5432/envie";
const SOURCE_MIGRATIONS_FOLDER = path.join(path.dirname(fileURLToPath(import.meta.url)), "../drizzle");
const RUNTIME_MIGRATIONS_FOLDER = path.join(process.cwd(), "drizzle");
const WORKSPACE_MIGRATIONS_FOLDER = path.join(process.cwd(), "packages", "db", "drizzle");

// Client for migrations and queries
export const migrationClient = postgres(connectionString, { max: 1 });

// Client for queries only
export const queryClient = postgres(connectionString);

// Drizzle ORM instance with proper schema typing
export const db = drizzle(queryClient, { schema: Schema });

function getMigrationsFolder() {
  if (process.env.DRIZZLE_MIGRATIONS_DIR) {
    return process.env.DRIZZLE_MIGRATIONS_DIR;
  }

  const folder = [
    RUNTIME_MIGRATIONS_FOLDER,
    WORKSPACE_MIGRATIONS_FOLDER,
    SOURCE_MIGRATIONS_FOLDER,
  ].find((candidate) => existsSync(candidate));

  if (!folder) {
    throw new Error(
      `Migration folder not found. Checked: ${[
        RUNTIME_MIGRATIONS_FOLDER,
        WORKSPACE_MIGRATIONS_FOLDER,
        SOURCE_MIGRATIONS_FOLDER,
      ].join(", ")}`,
    );
  }

  return folder;
}

// Migration function
export async function runMigrations() {
  console.log("Running migrations...");

  const migrationDb = drizzle(migrationClient);
  const migrationsFolder = getMigrationsFolder();

  await migrate(migrationDb, {
    migrationsFolder,
  });

  console.log("Migrations completed successfully");
}
