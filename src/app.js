/**
 * @fileoverview Orchestrates the core logic and UI components of the To-Do List app.
 *
 * Responsibilities:
 *  - Initialize the application by connecting core logic (ProjectManager)
 *    with UI rendering and event handling (DOMController).
 *  - Serve as the central entry point for starting app functionality.
 *
 * Exports:
 *  - initApp — Function that bootstraps the To-Do List application.
 *
 * Dependencies:
 *  - projectManager from './modules/ProjectManager.js'
 *  - DOMController from './ui/DOMController.js'
 *
 * @module app
 */


import { projectManager } from "./model/ProjectManager.js";
//import { DOMController } from "./ui/DOMController.js";

export async function initApp() {
    const app = projectManager;
    const project = app.createProject("My Tasks");
    project.createTodo("Finish report", "Work task", "2025-11-01");
    project.printTodos();
}

