import {
  pgTable,
  unique,
  serial,
  text,
  foreignKey,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'

export const categories = pgTable(
  'categories',
  {
    id: serial().primaryKey().notNull(),
    name: text().notNull(),
  },
  (table) => [unique('categories_name_key').on(table.name)]
)

export const tasks = pgTable(
  'tasks',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    done: boolean().default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    categoryId: integer('category_id'),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: 'tasks_category_id_fkey',
    }).onDelete('set null'),
  ]
)
