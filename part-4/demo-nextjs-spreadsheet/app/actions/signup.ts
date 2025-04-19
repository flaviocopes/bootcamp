'use server'

import { APIError } from 'better-auth/api'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signupAction(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const password_confirm = formData.get('password_confirm') as string

  if (password !== password_confirm) {
    console.log('Passwords do not match')
    return { message: 'Passwords do not match' }
  }

  if (password.length < 8) {
    console.log('Password must be at least 8 characters long')
    return { message: 'Password must be at least 8 characters long' }
  }

  if (password.length > 30) {
    console.log('Password must be at most 30 characters long')
    return { message: 'Password must be at most 30 characters long' }
  }

  if (!email.includes('@')) {
    console.log('Email is not valid')
    return { message: 'Email is not valid' }
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: '',
        email,
        password,
      },
    })

    console.log('User created successfully')
  } catch (error) {
    if (error instanceof APIError) {
      console.log(error.message, error.status)
      return { message: error.message }
    }
  }

  redirect('/')
}
