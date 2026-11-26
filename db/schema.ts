import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  created_at: timestamp({ withTimezone: true }).defaultNow().notNull(),
});
