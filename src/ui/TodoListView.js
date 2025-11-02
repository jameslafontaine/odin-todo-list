/**
 * @fileoverview Handles rendering and interaction logic for the to-do list of the active project.
 *
 * Responsibilities:
 *  - Render all todos within the current active project.
 *  - Display task details, completion states, and priority indicators.
 *  - Expose functions to add, edit, toggle, or delete todo items in the UI.
 *
 * Exports:
 *  - TodoListView — Object containing functions for rendering and refreshing todos.
 *
 * Dependencies:
 *  - projectManager from '../modules/ProjectManager.js'
 *  - Priorities from '../modules/Priorities.js'
 *
 * @module TodoListView
 */
import { projectManager } from "../modules/ProjectManager.js";
import { Priorities } from "../modules/Priorities.js";
import { UIUtils } from "../utils/UIUtils.js";