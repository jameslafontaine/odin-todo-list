/**
 * @fileoverview Defines the Project class, a container for related Todo items.
 *
 * Responsibilities:
 *  - Maintain a list of Todo instances in `todos`.
 *  - Create new todos with `createTodo()` and add them to the list.
 *  - Remove individual todos by ID using `deleteTodoById()` or remove all todos with `deleteAllTodos()`.
 *  - Retrieve todos via `getTodos()` or `getTodoById()`.
 *  - Provide a helper `printTodos()` for debugging purposes (logs the todos table to console).
 *  - Automatically generate a unique id for each Project instance.
 *
 * Exports:
 *  - Project — Class representing a collection of Todo items.
 *
 * Dependencies:
 *  - Todo from './Todo.js' — Used to create and manage Todo instances.
 *
 * Example:
 *  const project = new Project("Shopping List");
 *  const todo = project.createTodo("Buy milk", "2L of milk");
 *  project.deleteTodoById(todo.id);
 *  project.printTodos();
 *
 * @module Project
 */

import { Todo } from "./Todo.js";
export class Project {
    constructor(name = "Untitled Project") {
        this.id = crypto.randomUUID();
        if (!name || name.trim() === "") {
            name = "Untitled Project";
        }
        this.name = name;
        this.todos = [];
    }
    createTodo(title, description, dueDate, priority) {
        const todo = new Todo(title, description, dueDate, priority);
        this.todos.push(todo);
        return todo;
    }
    deleteTodoById(id) {
        this.todos = this.todos.filter((todo) => todo.id !== id);
    }

    deleteAllTodos() {
        this.todos = [];
    }

    getTodos() {
        return this.todos;
    }

    getTodoById(id) {
        return this.todos.find((todo) => todo.id === id) ?? null;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setId(id) {
        this.id = id;
    }

    setName(name) {
        if (!name || name.trim() === "") {
            name = "Untitled Project";
        }
        this.name = name;
    }

    printTodos() {
        console.table(this.todos);
    }
}
