/**
 * @fileoverview Manages rendering and interactions for the sidebar project list.
 *
 * Responsibilities:
 *  - Render a list of projects and highlight the active project.
 *  - Emit events when a project is selected (click).
 *  - Remain decoupled from the underlying data model; receives data via arguments.
 *
 * Exports:
 *  - SidebarView — Class representing the sidebar UI component.
 *
 * Dependencies:
 *  - UIUtils
 *
 * @module SidebarView
 */

import { UIUtils } from "../utils/UIUtils.js";

export class SidebarView {
    /**
     * @param {HTMLElement} container The DOM element containing the sidebar.
     */
    constructor(container) {
        this.container = container;
        this.projectListEl = container.querySelector(".sidebar-project-list");
        this.createProjectBtn = container.querySelector(".create-project-btn");
        /**
         * Callback set by the controller to respond to project selection.
         * @type {(projectId: string) => void}
         */
        this._onProjectSelected = null;

        /**
         * Callback set by the controller to respond to project creation.
         * @type {() => void}
         */
        this._onCreateProjectClicked = null;

        this._setupEventListeners();
    }

    /**
     * Render the sidebar project list.
     * @param {Array<{id: string, name: string}>} projects List of projects to render.
     * @param {string} activeProjectId The id of the currently active project.
     */
    update(projects, activeProjectId) {
        this.clear();

        if (projects.length === 0) {
            const emptyMsg = UIUtils.createElement("p", "sidebar-empty-msg", "No projects available. Create one!");
            this.projectListEl.appendChild(emptyMsg);
            return;
        }

        projects.forEach((project) => {
            const li = document.createElement("li");
            const projectBtn = UIUtils.createElement("button", "project-btn", project.name);
            projectBtn.dataset.projectId = project.id;
            projectBtn.classList.toggle("project--selected", project.id === activeProjectId);

            const svg = UIUtils.createSVGFromSpriteSheet("icon", "#icon-project");

            projectBtn.prepend(svg);

            li.appendChild(projectBtn);

            this.projectListEl.appendChild(li);
        });
    }

    /**
     * Set up event listeners for project selection.
     */
    _setupEventListeners() {
        this.projectListEl.addEventListener("click", (event) => {
            const button = event.target.closest("button");
            if (!button) return;
            if (this._onProjectSelected) {
                this._onProjectSelected(button.dataset.projectId);
            }
        });

        this.createProjectBtn.addEventListener("click", () => {
            this._onCreateProjectClicked();
        });
    }

    setOnProjectSelected(callback) {
        this._onProjectSelected = callback;
    }

    setOnCreateProjectClicked(callback) {
        this._onCreateProjectClicked = callback;
    }

    /**
     * Helper to clear the sidebar.
     */
    clear() {
        this.projectListEl.innerHTML = "";
    }
}
