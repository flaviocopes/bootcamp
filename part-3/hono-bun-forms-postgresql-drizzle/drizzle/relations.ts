import { relations } from "drizzle-orm/relations";
import { categories, tasks } from "./schema";

export const tasksRelations = relations(tasks, ({one}) => ({
	category: one(categories, {
		fields: [tasks.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	tasks: many(tasks),
}));