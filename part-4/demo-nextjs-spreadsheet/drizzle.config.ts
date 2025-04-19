import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './lib/drizzle',
  schema: './lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
})
