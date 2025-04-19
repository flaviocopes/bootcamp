import { drizzle } from 'drizzle-orm/node-postgres'
import { eq } from 'drizzle-orm'

import { spreadsheet } from '@/lib/schema'

export const db = drizzle(process.env.POSTGRES_URL!)

const defaultSpreadsheet = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
]

export async function getSpreadsheetData(userId: string) {
  const data = await db
    .select()
    .from(spreadsheet)
    .where(eq(spreadsheet.userId, userId))

  if (!data.length) {
    return defaultSpreadsheet
  }

  return data[0].data
}
