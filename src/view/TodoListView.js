/**
 * @fileoverview Manages rendering and interactions for the Todo List section.
 *
 * Responsibilities:
 *  - Render the project title at the top of the page.
 *  - Render todos in the Todo List container.
 *  - Toggle the "completed" state via checkmark button (UI only; controller handles model).
 *  - Expand/collapse individual todos when requested.
 *
 * Exports:
 *  - TodoListView — Class representing the todo list UI component.
 *
 * Dependencies:
 *  - UIUtils
 *  - DateUtils
 *
 * @module TodoListView
 */

import { UIUtils } from "../utils/UIUtils.js";
import { formatDueDate } from "../utils/DateUtils.js";

export class TodoListView {
    /**
     * @param {HTMLElement} container DOM element containing the main section of the app.
     */
    constructor(container) {
        this.container = container;
        this.projectHeadingEl = container.querySelector(".main-project-heading-container");
        this.todoListEl = container.querySelector(".todo-list");
        this.createNewTodoBtn = container.querySelector(".create-todo-btn");

        /**
         * Callback when the project edit button is clicked.
         * @type {(projectId: string) => void}
         */
        this._onEditProjectClicked = null;

        /**
         * Callback when project delete button is clicked.
         * @type {(projectId: string) => void}
         */
        this._onDeleteProjectClicked = null;

        /**
         * Callback when the project star button is clicked (set as default project when app launches)
         * @type {(projectId: string) => void}
         */
        this._onStarProjectClicked = null;

        /**
         * Callback when a todo's completion button is clicked.
         * @type {(projectId: string, todoId: string) => void}
         */
        this._onTodoToggled;

        /**
         * Callback when a todo expand/collapse button is clicked.
         * @type {(projectId: string, todoId: string) => void}
         */
        this._onTodoExpandToggled;

        /**
         * Callback when the todo edit button is clicked.
         * @type {(projectId: string, todoId: string) => void}
         */
        this._onEditTodoClicked;

        /**
         * Callback when the todo delete button is clicked.
         * @type {(projectId: string, todoId: string) => void}
         */
        this._onDeleteTodoClicked;

        /**
         * Callback when the create todo button button is clicked.
         * @type {(projectId: string) => void}
         */
        this._onCreateTodoClicked = null;

        this._setupEventListeners();
    }

    /**
     * Render the project title at the top of the main section alongside its buttons.
     * @param {title: string} title Project name.
     * @param {isDefault: boolean} isDefault Boolean indicating whether this current project is the user's default
     *                                       project or not
     */
    _renderProjectHeading(title, isDefault) {
        const projectTitle = UIUtils.createElement("h2", "main-project-heading", title);
        const starBtn = this._createStarBtn(isDefault);
        const editBtn = this._createEditBtn();
        const deleteBtn = this._createDeleteBtn();

        this.projectHeadingEl.append(projectTitle, starBtn, editBtn, deleteBtn);
        this.projectHeadingEl.dataset.projectId = this._currentProjectId;
    }

    /**
     * Render the entire contents of the main container of the app (the todo list)
     * @param {{id: string, name: string,
     *          todos: Array<id: string, title: string, description: string, dueDate: Date,
     *                       priority: string, completed: boolean>}} project Project instance.
     * @param {meta: {isDefault: boolean}} meta Metadata to assist the view in rendering
     */
    update(project, meta = { isDefault }) {
        if (!project) {
            this.todoListEl.innerHTML =
                "<p class='todo-list-empty-msg'>Select or create a project to view its todos.</p>";
            this.projectHeadingEl.innerHTML = "";
            this.createNewTodoBtn.style.display = "none";
            return;
        }

        // Store the project id of the project currently being rendered so event listeners can pass it
        // to app.js when necessary
        this._currentProjectId = project.getId();

        if (this._currentProjectId === null) {
            this.todoListEl.innerHTML =
                "<p class='todo-list-empty-msg'>Select or create a project to view its todos.</p>";
            this.projectHeadingEl.innerHTML = "";
            this.createNewTodoBtn.style.display = "none";
            return;
        }

        this.createNewTodoBtn.style.display = "block";
        this.projectHeadingEl.innerHTML = "";
        // Render the project title + project buttons first
        this._renderProjectHeading(project.getName(), meta.isDefault);

        // Now render the todo items + their buttons
        this.todoListEl.innerHTML = "";

        const todos = project.getTodos();

        if (todos.length === 0) {
            const emptyMsg = UIUtils.createElement("p", "todo-list-empty-msg", "No todos in this project. Create one!");
            this.todoListEl.appendChild(emptyMsg);
            return;
        }

        todos.forEach((todo) => {
            const todoEl = UIUtils.createElement("li", "todo-item");

            const todoBtnContainer = document.createElement("div");
            todoBtnContainer.classList.add("todo-btn-container");
            todoEl.dataset.projectId = this._currentProjectId;
            todoEl.dataset.todoId = todo.id;

            // Checkmark toggle button
            const checkBtn = this._createCheckmarkBtn(todo.completed);

            // Todo title / expand button
            const expandBtn = this._createExpandBtn(
                todo.title,
                todo.expanded,
                todo.description && todo.description.trim() !== ""
            );

            // Edit button
            const editBtn = this._createEditBtn();

            // Delete button
            const deleteBtn = this._createDeleteBtn();

            todoBtnContainer.append(checkBtn, expandBtn, editBtn, deleteBtn);

            todoEl.appendChild(todoBtnContainer);

            // Todo information (priority, due date, description)
            const todoInfoEl = UIUtils.createElement("div", "todo-info");
            const todoPriorityEl = UIUtils.createElement(
                "div",
                ["todo-priority", `priority-${todo.priority.toLowerCase()}`],
                todo.priority
            );

            let todoDueDateEl;
            if (todo.dueDate) {
                todoDueDateEl = UIUtils.createElement("div", "todo-due-date", formatDueDate(todo.dueDate));
            } else {
                todoDueDateEl = UIUtils.createElement("div");
            }

            // Description
            const todoDescEl = UIUtils.createElement("div", "todo-description", todo.description);
            if (todo.expanded) todoDescEl.classList.add("expanded");

            todoInfoEl.append(todoPriorityEl, todoDueDateEl, todoDescEl);

            todoEl.appendChild(todoInfoEl);
            this.todoListEl.appendChild(todoEl);
        });
    }

    /**
     * Set up event listeners for the todo list container.
     * Most clicks are delegated except for clicks on the create todo button which already exists as a static element
     * in index.html.
     */
    _setupEventListeners() {
        // Setup event listeners for the project heading buttons
        this.projectHeadingEl.addEventListener("click", (event) => {
            const projectHeadingContainer = event.target.closest(".main-project-heading-container");
            if (!projectHeadingContainer) return; // nothing to do if no project is displayed

            const editBtn = event.target.closest(".edit-btn");
            const deleteBtn = event.target.closest(".delete-btn");
            const starBtn = event.target.closest(".star-btn");

            const projectId = projectHeadingContainer.dataset.projectId;
            if (!projectId) return; // extra safety

            if (editBtn) this._onEditProjectClicked?.(projectId);
            if (deleteBtn) this._onDeleteProjectClicked?.(projectId);
            if (starBtn) this._onStarProjectClicked?.(projectId);
        });

        // Setup event listeners for the todo item buttons
        this.todoListEl.addEventListener("click", (event) => {
            const todoEl = event.target.closest(".todo-item");
            if (!todoEl) return; // nothing clicked inside a todo, so ignore

            const checkmarkBtn = event.target.closest(".checkmark-btn");
            const expandBtn = event.target.closest(".todo-btn");
            const editBtn = event.target.closest(".edit-btn");
            const deleteBtn = event.target.closest(".delete-btn");

            const projectId = todoEl.dataset.projectId;
            const todoId = todoEl.dataset.todoId;

            if (checkmarkBtn) this._onTodoToggled?.(projectId, todoId);
            if (expandBtn) this._onTodoExpandToggled?.(projectId, todoId);
            if (editBtn) this._onEditTodoClicked?.(projectId, todoId);
            if (deleteBtn) this._onDeleteTodoClicked?.(projectId, todoId);
        });

        this.createNewTodoBtn.addEventListener("click", () => {
            this._onCreateTodoClicked?.(this._currentProjectId);
        });
    }
    expandTodo(todoId) {
        const todoDescEl = document.querySelector(`.todo-item[data-todo-id="${todoId}"] .todo-description`);
        if (!todoDescEl || todoDescEl.textContent.trim() === "") return; // no description → skip

        // toggle expansion
        todoDescEl.classList.toggle("expanded");

        // update button icon
        const expandBtn = document.querySelector(`.todo-item[data-todo-id="${todoId}"] .todo-btn`);
        if (!expandBtn) return;

        const isExpanded = todoDescEl.classList.contains("expanded");

        // Find the <use> element inside the SVG and update its href
        const useElement = expandBtn.querySelector("use");
        if (useElement) {
            useElement.setAttribute("href", isExpanded ? "#icon-minimize" : "#icon-expand");
        }
    }

    setOnEditProjectClicked(callback) {
        this._onEditProjectClicked = callback;
    }

    setOnDeleteProjectClicked(callback) {
        this._onDeleteProjectClicked = callback;
    }

    setOnStarProjectClicked(callback) {
        this._onStarProjectClicked = callback;
    }

    setOnTodoToggled(callback) {
        this._onTodoToggled = callback;
    }

    setOnTodoExpandToggled(callback) {
        this._onTodoExpandToggled = callback;
    }

    setOnEditTodoClicked(callback) {
        this._onEditTodoClicked = callback;
    }

    setOnDeleteTodoClicked(callback) {
        this._onDeleteTodoClicked = callback;
    }

    setOnCreateTodoClicked(callback) {
        this._onCreateTodoClicked = callback;
    }

    /**
     * Helper functions for creating generic icon buttons using the SVG sprite sheet in index.html
     */
    _createStarBtn(isDefault) {
        const starBtn = UIUtils.createElement("button", "star-btn");
        const starSvg = isDefault
            ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-star-filled")
            : UIUtils.createSVGFromSpriteSheet("icon", "#icon-star");

        starBtn.appendChild(starSvg);
        return starBtn;
    }

    _createEditBtn() {
        const editBtn = UIUtils.createElement("button", "edit-btn");
        const editSvg = UIUtils.createSVGFromSpriteSheet("icon", "#icon-edit");

        editBtn.appendChild(editSvg);
        return editBtn;
    }

    _createDeleteBtn() {
        const deleteBtn = UIUtils.createElement("button", "delete-btn");
        const deleteSvg = UIUtils.createSVGFromSpriteSheet("icon", "#icon-delete");

        deleteBtn.appendChild(deleteSvg);
        return deleteBtn;
    }

    _createCheckmarkBtn(isCompleted) {
        const checkmarkBtn = UIUtils.createElement("button", "checkmark-btn");

        const checkmarkSvg = isCompleted
            ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-todo-checked")
            : UIUtils.createSVGFromSpriteSheet("icon", "#icon-todo");

        checkmarkBtn.appendChild(checkmarkSvg);
        return checkmarkBtn;
    }

    _createExpandBtn(todoTitle, isExpanded, hasDescription = true) {
        const expandBtn = UIUtils.createElement("button", "todo-btn", todoTitle);

        if (hasDescription) {
            const expandSvg = isExpanded
                ? UIUtils.createSVGFromSpriteSheet("icon", "#icon-minimize")
                : UIUtils.createSVGFromSpriteSheet("icon", "#icon-expand");
            expandBtn.appendChild(expandSvg);
        }

        return expandBtn;
    }
}
