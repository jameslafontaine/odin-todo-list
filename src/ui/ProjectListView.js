/**
 * @fileoverview Handles rendering and updating of the project sidebar or project selection view.
 *
 * Responsibilities:
 *  - Render the list of all projects managed by ProjectManager.
 *  - Attach event listeners for project selection and deletion.
 *  - Highlight the active project and notify DOMController when it changes.
 *
 * Exports:
 *  - ProjectListView — Object containing functions for rendering and refreshing the project list.
 *
 * Dependencies:
 *  - projectManager from '../modules/ProjectManager.js'
 *
 * @module ProjectListView
 */
import { projectManager } from "../modules/ProjectManager.js";
import { UIUtils } from "../utils/UIUtils.js";