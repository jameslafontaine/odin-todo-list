/**
 * @fileoverview Defines the Project class, a container for related to-do items.
 *
 * Responsibilities:
 *  - Maintain a list of Todo instances.
 *  - Provide methods to add, remove, and retrieve todos.
 *  - Offer helper functions for debugging (e.g., printList()).
 *
 * Exports:
 *  - Project — Class representing a collection of todos.
 *
 * Dependencies:
 *  - Todo from './Todo.js' — Used to create and manage todo items.
 *
 * @module Project
 */


import { Todo } from "./Todo.js";
export class Project {
    constructor(name = "Untitled Project") {
        this.id = crypto.randomUUID();
        this.name = name;
        this.todos = [];
    }
    createTodo(title, description, dueDate, priority) {
        const todo = new Todo(title, description, dueDate, priority);
        this.todos.push(todo);
        return todo;
    }
    deleteTodoById(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
    }

    deleteAllTodos() {
        this.todos = [];
    }

    getTodos() {
        return this.todos;
    }

    getTodoById(id) {
        return this.todos.find(todo => todo.id === id) ?? null;
    }

    getId() {
        return this.id;
    }

    printTodos() {
        console.table(this.todos);
    }
}
