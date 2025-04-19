import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

import Spreadsheet from '@/app/spreadsheet'
import { getSpreadsheetData } from '@/lib/data'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    const spreadsheetData = (await getSpreadsheetData(
      session.user.id
    )) as string[][]

    return (
      <div>
        <Spreadsheet initialData={spreadsheetData} />
      </div>
    )
  }

  return (
    <div>
      <h1 className='text-center text-3xl font-bold my-16'>Spreadsheet</h1>
      <div
        className='mx-auto max-w-md space-y-6 bg-white py-8 px-10 
  rounded-lg shadow'>
        <p className='text-center'>A cool app to work on numbers</p>
        <Link href={'/signup'}>
          <p
            className='w-full flex justify-center 
	    py-2 px-4 border border-transparent rounded-md shadow-sm text-sm 
	    font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
	    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'>
            Access
          </p>
        </Link>
      </div>
    </div>
  )
}
