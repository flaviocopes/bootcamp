'use client'

import Link from 'next/link'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

import { signupAction } from '@/app/actions/signup'

const initialState = {
  message: '',
}

const SubmitButton = () => {
  const { pending } = useFormStatus()

  return (
    <input
      aria-disabled={pending}
      type='submit'
      value={pending ? 'Signing up...' : 'Sign up'}
      className='w-full flex justify-center
	    py-2 px-4 border border-transparent rounded-md shadow-sm text-sm
	    font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none
	    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
    />
  )
}

export default function SignupForm() {
  const [state, formAction] = useActionState(signupAction, initialState)

  return (
    <div>
      <h1 className='text-center text-3xl font-bold my-16'>Sign Up</h1>
      <form
        className='mx-auto max-w-md space-y-6 bg-white py-8 px-10
  rounded-lg shadow'
        action={formAction}>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700'>
            Email address
          </label>
          <div className='mt-1'>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'>
            Password
          </label>
          <div className='mt-1'>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='block w-full px-3 py-2 border border-gray-300 rounded-md
				shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
				focus:border-blue-500 text-sm'
            />
          </div>
        </div>

        <div>
          <label
            htmlFor='password_confirm'
            className='block text-sm font-medium text-gray-700'>
            Confirm Password
          </label>
          <div className='mt-1'>
            <input
              id='password_confirm'
              name='password_confirm'
              type='password'
              required
              className='block w-full px-3 py-2 border border-gray-300 rounded-md
				shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500
				focus:border-blue-500 text-sm'
            />
          </div>
        </div>

        <SubmitButton />

        <div className='text-center text-red-500'>
          {state && state.message && <span>{state.message}</span>}
        </div>
      </form>
      <Link href={'/login'}>
        <p className='text-center mt-4 text-sm text-gray-600 underline'>
          Already have an account? Log in
        </p>
      </Link>
    </div>
  )
}
