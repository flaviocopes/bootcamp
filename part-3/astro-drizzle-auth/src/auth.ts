import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@src/data'
import * as schema from '@drizzle/schema'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
})

export async function processTurnstile(cf_turnstile_response: string) {
  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

  const requestBody = new URLSearchParams({
    secret: import.meta.env.TURNSTILE_SECRET_KEY,
    response: cf_turnstile_response,
  })

  console.log({
    secret: import.meta.env.TURNSTILE_SECRET_KEY,
    response: cf_turnstile_response,
  })

  console.log('requestBody', requestBody.toString())

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody.toString(),
  })

  const data = await response.json()

  return data.success
}
