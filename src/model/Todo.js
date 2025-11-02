/**
 * @fileoverview Defines the Todo class, representing an individual task.
 *
 * Responsibilities:
 *  - Store and manage data for a single to-do item.
 *  - Provide getters and setters for encapsulation and controlled access.
 *  - Handle completion state and metadata (title, description, due date, priority).
 *
 * Exports:
 *  - Todo — Class representing a to-do item.
 *
 * Dependencies:
 *  - Priorities from './Priorities.js' — Enum-like object for priority levels.
 *
 * @module Todo
 */



import { Priorities } from "./Priorities.js";
export class Todo {
    static n = 1;

    constructor(title = "Untitled Todo", description = "", dueDate, priority = Priorities.IMPORTANT) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.priority = priority;
        this.completed = false;
    }
    toggleCompleted() {
        this.completed = !this.completed;
    }

    get info() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            dueDate: this.dueDate,
            priority: this.priority,
            completed: this.completed,
        };
    }

    set info({ title, description, dueDate, priority, completed }) {
        this.title = title ?? this.title;
        this.description = description ?? this.description;
        this.dueDate = dueDate ? new Date(dueDate) : this.dueDate;
        this.priority = priority ?? this.priority;
        this.completed = completed ?? this.completed;
    }
}
