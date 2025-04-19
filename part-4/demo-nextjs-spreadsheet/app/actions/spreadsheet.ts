'use server'

import { db } from '@/lib/data'
import { spreadsheet } from '@/lib/schema'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function updateSpreadsheetData(data: string[][]) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    throw new Error('Unauthorized')
  }

  await db
    .insert(spreadsheet)
    .values({
      userId: session.user.id,
      data,
    })
    .onConflictDoUpdate({
      target: [spreadsheet.userId],
      set: { data, updatedAt: new Date() },
    })
}
