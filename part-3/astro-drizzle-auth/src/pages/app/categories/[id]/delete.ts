import type { APIRoute } from 'astro'

import { deleteCategory } from '@/src/data'

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id } = params

  await deleteCategory(id as string)

  return redirect('/app/categories')
}
