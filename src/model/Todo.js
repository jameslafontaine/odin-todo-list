/**
 * @fileoverview Defines the Todo class, representing a single task entity.
 *
 * Responsibilities:
 *  - Encapsulate all data for one to-do item, including id, title, description,
 *    due date, priority, and completion state.
 *  - Provide controlled access and mutation via the `info` getter/setter.
 *  - Toggle completion state through the `toggleCompleted()` method.
 *  - Automatically generate a unique id for each instance.
 *  - Convert dueDate input into a Date object, or null if none is provided.
 *
 * Exports:
 *  - Todo — Class representing a to-do item.
 *
 * Dependencies:
 *  - Priorities from './Priorities.js' — Enum-like object for priority levels.
 *
 * Example:
 *  const todo = new Todo("Buy milk", "2L of milk", "2025-11-21", Priorities.URGENT);
 *  todo.toggleCompleted();
 *  todo.info = { title: "Buy bread" };
 *
 * @module Todo
 */

import { Priorities } from "./Priorities.js";
export class Todo {
    static n = 1;

    constructor(title = "Untitled Todo", description = "", dueDate, priority = Priorities.IMPORTANT) {
        this._id = crypto.randomUUID();
        if (!title || title.trim() === "") {
            title = "Untitled Todo";
        }
        this._title = title;
        this._description = description;
        this._dueDate = dueDate ? new Date(dueDate) : null;
        this._priority = priority;
        this._completed = false;
        this._expanded = false;
    }

    toggleCompleted() {
        this._completed = !this._completed;
    }

    toggleExpanded() {
        this._expanded = !this._expanded;
    }

    get id() {
        return this._id;
    }

    set id(val) {
        this._id = val;
    }

    get title() {
        return this._title;
    }
    set title(val) {
        if (!val || val.trim() === "") {
            val = "Untitled Todo";
        }
        this._title = val;
    }

    get description() {
        return this._description;
    }
    set description(val) {
        this._description = val;
    }

    get dueDate() {
        return this._dueDate;
    }
    set dueDate(val) {
        this._dueDate = val ? new Date(val) : null;
    }

    get priority() {
        return this._priority;
    }
    set priority(val) {
        this._priority = val;
    }

    get completed() {
        return this._completed;
    }
    set completed(val) {
        this._completed = val;
    }

    get expanded() {
        return this._expanded;
    }
    set expanded(val) {
        this._expanded = val;
    }

    get info() {
        return {
            id: this._id,
            title: this._title,
            description: this._description,
            dueDate: this._dueDate,
            priority: this._priority,
            completed: this._completed,
            expanded: this._expanded,
        };
    }

    set info({ id, title, description, dueDate, priority, completed, expanded }) {
        this._id = id ?? this._id;
        this._title = title ?? this._title;
        this._description = description ?? this._description;
        this._dueDate = dueDate ? new Date(dueDate) : this._dueDate;
        this._priority = priority ?? this._priority;
        this._completed = completed ?? this._completed;
        this._expanded = expanded ?? this._expanded;
    }

    updateData({ title, description, dueDate, priority }) {
        if (title !== undefined) this.title = title;
        if (description !== undefined) this.description = description;
        if (dueDate !== undefined) this.dueDate = dueDate;
        if (priority !== undefined) this.priority = priority;
    }
}
