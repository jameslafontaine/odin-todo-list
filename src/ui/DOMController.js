/**
 * @fileoverview Centralized DOM controller that initializes and coordinates UI rendering.
 *
 * Responsibilities:
 *  - Initialize UI components (project list, todo list, modals, etc.).
 *  - Provide high-level methods to update or re-render major UI sections.
 *  - Act as a bridge between the core logic (ProjectManager) and UI submodules.
 *
 * Exports:
 *  - DOMController — Singleton object handling all major UI rendering logic.
 *
 * Dependencies:
 *  - ProjectListView from './ProjectListView.js'
 *  - TodoListView from './TodoListView.js'
 *  - projectManager from '../modules/ProjectManager.js'
 *
 * @module DOMController
 */

import { ProjectListView } from "./ProjectListView.js";
import { TodoListView } from "./TodoListView.js";
import { projectManager } from "../modules/ProjectManager.js";