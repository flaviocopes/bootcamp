import { drizzle } from 'drizzle-orm/node-postgres'
import { tasks, categories } from '@drizzle/schema'
import { eq, desc } from 'drizzle-orm'

export const db = drizzle(import.meta.env.POSTGRES_URL!)

interface Task {
  id: number
  title: string
  done: boolean
  created_at: string
  category_name: string | null
}

export async function fetchTasks(userId: string): Promise<Task[]> {
  try {
    const result = await db
      .select({
        id: tasks.id,
        title: tasks.title,
        done: tasks.done,
        created_at: tasks.createdAt,
        category_name: categories.name,
      })
      .from(tasks)
      .leftJoin(categories, eq(tasks.categoryId, categories.id))
      .where(eq(tasks.userId, userId))
      .orderBy(desc(tasks.createdAt))

    return result as Task[]
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

interface Category {
  id: number
  name: string
}

export async function fetchCategories(userId: string): Promise<Category[]> {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .where(eq(categories.userId, userId))
      .orderBy(categories.name)

    return result as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function addCategory(name: string, userId: string) {
  try {
    await db.insert(categories).values({
      name: name,
      userId: userId,
    })
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}

export async function addTask(
  title: string,
  categoryId: string,
  userId: string
) {
  try {
    await db.insert(tasks).values({
      title: title,
      categoryId: parseInt(categoryId, 10),
      userId: userId,
    })
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}
export async function deleteTask(id: string) {
  try {
    await db.delete(tasks).where(eq(tasks.id, parseInt(id, 10)))
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}

import { sql } from 'drizzle-orm'

export async function toggleTask(id: string) {
  try {
    await db
      .update(tasks)
      .set({ done: sql`NOT done` })
      .where(eq(tasks.id, parseInt(id, 10)))
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.delete(categories).where(eq(categories.id, parseInt(id, 10)))
  } catch (error: any) {
    console.log('Error:', error.message)
  }
}
