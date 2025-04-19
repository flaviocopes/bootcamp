'use server'

import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function loginAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    })

    console.log('Logged in successfully')
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status)
      return { message: error.message }
    }
  }

  redirect('/')
}
