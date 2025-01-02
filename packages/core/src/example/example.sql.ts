import { pgTable, text, varchar, serial } from "drizzle-orm/pg-core";

export const exampleTable = pgTable("example", {
  id: serial("id").primaryKey(),
  title: varchar("name", { length: 255 }).notNull(),
  content: text("content").notNull(),
});
