import type { APIRoute } from 'astro'

import { deleteTask } from '@/src/data'

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params

  await deleteTask(id as string)

  return redirect('/app')
}
