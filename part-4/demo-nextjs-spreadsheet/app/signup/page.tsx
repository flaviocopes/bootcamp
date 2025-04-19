import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import SignupForm from '@/app/signup/form'

export default async function SignupPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect('/')
  }

  return <SignupForm />
}
