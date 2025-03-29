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
    userId: text('user_id').notNull(),
  },
  (table) => [
    unique('categories_name_key').on(table.name),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'categories_user_id_fkey',
    }).onDelete('cascade'),
  ]
)

export const tasks = pgTable(
  'tasks',
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    done: boolean().default(false),
    createdAt: timestamp('created_at', { mode: 'string' }).defaultNow(),
    categoryId: integer('category_id'),
    userId: text('user_id').notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [categories.id],
      name: 'tasks_category_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'tasks_user_id_fkey',
    }).onDelete('cascade'),
  ]
)

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})
