import { sql } from 'bun'

try {
  await sql`
    INSERT INTO categories (name)
    VALUES
      ('Work'),
      ('Personal'),
      ('Shopping'),
      ('Fitness'),
      ('Miscellaneous');
  `
} catch (error) {
  console.log('Error: ' + error.message)
}

try {
  await sql`
    INSERT INTO tasks (title, done, category_id)
    VALUES
      ('Finish project report', false, 1),
      ('Buy groceries', false, 3),
      ('Call mom', false, 2),
      ('Attend yoga class', true, 4),
      ('Organize desk', false, 1),
      ('Pick up dry cleaning', false, 3),
      ('Book dentist appointment', false, 2),
      ('Go for a run', true, 4),
      ('Plan weekend trip', false, 5),
      ('Clean out garage', false, 5);
  `
} catch (error) {
  console.log('Error: ' + error.message)
}
