import { getDatabase } from "@netlify/database";
import { drizzle } from "drizzle-orm/netlify-db";

function createDb() {
  return drizzle({ client: getDatabase() });
}

let db: ReturnType<typeof createDb> | undefined;

export function getDb() {
  return db ??= createDb();
}
