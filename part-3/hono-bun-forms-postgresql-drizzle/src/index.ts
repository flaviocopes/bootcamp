import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/node-postgres'
const db = drizzle(process.env.POSTGRES_URL!)
import { sql } from 'drizzle-orm'
import { tasks, categories } from '../drizzle/schema'
import { eq, desc } from 'drizzle-orm'

interface Task {
  id: number
  title: string
  done: boolean
  created_at: string
  category_name: string | null
}

interface Category {
  id: number
  name: string
}

const app = new Hono()

async function fetchTasks(): Promise<Task[]> {
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
      .orderBy(desc(tasks.createdAt))

    return result as Task[]
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

// Helper function to fetch categories
async function fetchCategories(): Promise<Category[]> {
  try {
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
      })
      .from(categories)
      .orderBy(categories.name)

    return result as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Home route with conditional form display
app.get('/', async (c) => {
  const [tasks, categories] = await Promise.all([
    fetchTasks(),
    fetchCategories(),
  ])

  return c.html(`
    <div>
      <div style="display: flex; gap: 40px;">
        <div class="categories-table">
          <h2>Categories</h2>

          <form action="/categories" method="POST" style="margin: 20px 0;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <input
                type="text"
                name="name"
                placeholder="Category name"
                required
                style="padding: 4px 8px;"
              >
              <button type="submit">Add Category</button>
            </div>
          </form>

          <table border="1" style="border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px;">ID</th>
                <th style="padding: 8px;">Name</th>
                <th style="padding: 8px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                categories.length === 0
                  ? '<tr><td colspan="3" style="padding: 8px; text-align: center;">No categories found</td></tr>'
                  : categories
                      .map(
                        (category) => `
                  <tr>
                    <td style="padding: 8px;">${category.id}</td>
                    <td style="padding: 8px;">${category.name}</td>
                    <td style="padding: 8px;">
                      <form action="/categories/${category.id}/delete" method="POST" style="margin: 0;">
                        <button type="submit" onclick="return confirm('Are you sure? This will also remove the category from all tasks.')">Delete</button>
                      </form>
                    </td>
                  </tr>
                `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>

        <div class="tasks-table">
          <h2>Tasks</h2>

          <form action="/tasks" method="POST" style="margin: 20px 0;">
            <div style="display: flex; gap: 8px; align-items: center;">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                required
                style="padding: 4px 8px;"
              >
              <select name="category_id" required style="padding: 4px 8px;">
                <option value="">Select a category</option>
                ${categories
                  .map(
                    (category) => `
                  <option value="${category.id}">${category.name}</option>
                `
                  )
                  .join('')}
              </select>
              <button type="submit">Add Task</button>
            </div>
          </form>

          <table border="1" style="border-collapse: collapse;">
            <thead>
              <tr>
                <th style="padding: 8px;">ID</th>
                <th style="padding: 8px;">Title</th>
                <th style="padding: 8px;">Status</th>
                <th style="padding: 8px;">Category</th>
                <th style="padding: 8px;">Created At</th>
                <th style="padding: 8px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${
                tasks.length === 0
                  ? '<tr><td colspan="6" style="padding: 8px; text-align: center;">No tasks found</td></tr>'
                  : tasks
                      .map(
                        (task) => `
                  <tr>
                    <td style="padding: 8px;">${task.id}</td>
                    <td style="padding: 8px;">${task.title}</td>
                    <td style="padding: 8px;">
                      <form action="/tasks/${
                        task.id
                      }/toggle" method="POST" style="margin: 0;">
                        <input
                          type="checkbox"
                          ${task.done ? 'checked' : ''}
                          onchange="this.form.submit()"
                        >
                      </form>
                    </td>
                    <td style="padding: 8px;">${task.category_name || '-'}</td>
                    <td style="padding: 8px;">${new Date(
                      task.created_at
                    ).toLocaleString()}</td>
                    <td style="padding: 8px;">
                      <form action="/tasks/${
                        task.id
                      }/delete" method="POST" style="margin: 0;">
                        <button type="submit" onclick="return confirm('Are you sure you want to delete this task?')">Delete</button>
                      </form>
                    </td>
                  </tr>
                `
                      )
                      .join('')
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `)
})

app.post('/categories', async (c) => {
  try {
    const formData = await c.req.formData()
    const name = formData.get('name')

    if (!name || typeof name !== 'string') {
      return c.text('Category name is required', 400)
    }

    await db.insert(categories).values({
      name: name,
    })
    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error creating category: ' + error.message, 500)
  }
})
// Handle task creation
app.post('/tasks', async (c) => {
  try {
    const formData = await c.req.formData()
    const title = formData.get('title')
    const categoryId = formData.get('category_id')

    if (!title || typeof title !== 'string') {
      return c.text('Task title is required', 400)
    }

    if (!categoryId || typeof categoryId !== 'string' || categoryId === '') {
      return c.text('Category selection is required', 400)
    }

    await db.insert(tasks).values({
      title: title,
      categoryId: parseInt(categoryId, 10),
    })

    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error creating task: ' + error.message, 500)
  }
})

// Handle task status toggle
app.post('/tasks/:id/toggle', async (c) => {
  try {
    const taskId = c.req.param('id')

    await db
      .update(tasks)
      .set({ done: sql`NOT done` })
      .where(eq(tasks.id, parseInt(taskId, 10)))

    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error toggling task status: ' + error.message, 500)
  }
})
// Handle task deletion
app.post('/tasks/:id/delete', async (c) => {
  try {
    const taskId = c.req.param('id')

    await db.delete(tasks).where(eq(tasks.id, parseInt(taskId, 10)))

    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error deleting task: ' + error.message, 500)
  }
})

// Handle category deletion
app.post('/categories/:id/delete', async (c) => {
  try {
    const categoryId = c.req.param('id')

    // The category_id in tasks will be automatically set to NULL thanks to ON DELETE SET NULL
    await db
      .delete(categories)
      .where(eq(categories.id, parseInt(categoryId, 10)))

    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error deleting category: ' + error.message, 500)
  }
})

export default app
