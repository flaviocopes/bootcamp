import { sql } from 'bun'

try {
  const tasks = await sql`
    SELECT
        tasks.*,
        categories.name AS category_name
    FROM
        tasks
    JOIN
        categories ON tasks.category_id = categories.id;
  `

  console.log(tasks)
} catch (error: any) {
  console.log('Error: ' + error.message)
}
