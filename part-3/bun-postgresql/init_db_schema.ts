import { sql } from 'bun'

try {
  await sql`
    CREATE TABLE categories (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
    );
  `
} catch (error) {
  console.log('Error: ' + error.message)
}

try {
  await sql`
    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        done BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT now(),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
    );
  `
} catch (error) {
  console.log('Error: ' + error.message)
}
