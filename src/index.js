/**
 * @fileoverview Webpack entry point for the To-Do List application.
 *
 * Responsibilities:
 *  - Load global styles via `styles.js`.
 *  - Initialize the application by calling `initApp()` once the DOM is ready.
 *  - Serve as the root entry file for Webpack’s bundling process.
 *
 * Dependencies:
 *  - styles.js → Imports all CSS subfiles for bundling.
 *  - app.js → Provides the application initialization logic.
 *
 * @module index
 */

import { Todo } from "./model/Todo.js";
import { Project } from "./model/Project.js";
import { projectManager } from "./model/ProjectManager.js";

window.DEBUG = {
    Todo,
    Project,
    projectManager,
};

import { initApp } from "./controller.js";
import "./styles.js";

console.log("🚀 Webpack Template Running!");

document.addEventListener("DOMContentLoaded", initApp);
