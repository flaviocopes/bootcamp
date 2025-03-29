import type { APIRoute } from 'astro'

import { toggleTask } from '@/src/data'

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params

  await toggleTask(id as string)

  return redirect('/app')
}
