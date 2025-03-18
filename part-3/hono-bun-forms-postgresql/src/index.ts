import { Hono } from 'hono'
import { sql } from 'bun'

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

// Helper function to check if tables exist
async function checkTablesExist() {
  try {
    const result = await sql`
      SELECT (
        EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'categories'
        ) AND EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = 'tasks'
        )
      ) AS tables_exist;
    `
    return result[0].tables_exist
  } catch (error) {
    console.error('Error checking tables:', error)
    return false
  }
}

// Helper function to fetch tasks
async function fetchTasks(): Promise<Task[]> {
  try {
    const tasks = await sql`
      SELECT 
        t.id,
        t.title,
        t.done,
        t.created_at,
        c.name as category_name
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      ORDER BY t.created_at DESC;
    `
    return tasks as Task[]
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

// Helper function to fetch categories
async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await sql`
      SELECT id, name
      FROM categories
      ORDER BY name ASC;
    `
    return categories as Category[]
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

// Home route with conditional form display
app.get('/', async (c) => {
  const tablesExist = await checkTablesExist()

  if (!tablesExist) {
    return c.html(`
      <div>
        <form action="/create-tables" method="POST">
          <button type="submit">Create tables</button>
        </form>
      </div>
    `)
  }

  const [tasks, categories] = await Promise.all([
    fetchTasks(),
    fetchCategories(),
  ])

  return c.html(`
    <div>
      <form action="/delete-tables" method="POST">
        <button type="submit">Delete tables</button>
      </form>

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

// Handle the form submission via POST
app.post('/create-tables', async (c) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE
      );
    `
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          done BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT now(),
          category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
      );
    `
    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error creating tables: ' + error.message, 500)
  }
})

// Handle table deletion
app.post('/delete-tables', async (c) => {
  try {
    await sql`DROP TABLE IF EXISTS tasks;`
    await sql`DROP TABLE IF EXISTS categories;`
    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error deleting tables: ' + error.message, 500)
  }
})

app.post('/categories', async (c) => {
  try {
    const formData = await c.req.formData()
    const name = formData.get('name')

    if (!name || typeof name !== 'string') {
      return c.text('Category name is required', 400)
    }

    await sql`
      INSERT INTO categories (name)
      VALUES (${name});
    `
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

    await sql`
      INSERT INTO tasks (title, category_id)
      VALUES (${title}, ${parseInt(categoryId, 10)});
    `

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

    await sql`
      UPDATE tasks 
      SET done = NOT done 
      WHERE id = ${parseInt(taskId, 10)};
    `

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

    await sql`
      DELETE FROM tasks 
      WHERE id = ${parseInt(taskId, 10)};
    `

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
    await sql`
      DELETE FROM categories 
      WHERE id = ${parseInt(categoryId, 10)};
    `

    return c.redirect('/')
  } catch (error: any) {
    console.log('Error:', error.message)
    return c.text('Error deleting category: ' + error.message, 500)
  }
})

export default app
