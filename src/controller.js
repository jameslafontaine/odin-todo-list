/**
 * @fileoverview Bootstraps and orchestrates the To-Do List application.
 *
 * Responsibilities:
 *  - Initialize core application components.
 *  - Create and configure all view instances (SidebarView, TodoListView, DialogView).
 *  - Connect the ProjectManager (data/model layer) with view event handlers.
 *  - Trigger the render of UI components.
 *
 * Exports:
 *  - initApp — Function that starts the To-Do List application.
 *
 * Dependencies:
 *  - projectManager from './model/ProjectManager.js' — Global app state for projects and todos.
 *  - SidebarView from './ui/SidebarView.js' — Renders and manages the project sidebar UI.
 *  - TodoListView from './ui/TodoListView.js' — Renders and manages the todo list UI.
 *  - DialogView from './ui/DialogView.js' — Handles modal dialog UI instances.
 *
 * @module controller
 */

import { projectManager } from "./model/ProjectManager.js";
import { SidebarView } from "./view/SidebarView.js";
import { TodoListView } from "./view/TodoListView.js";
import { DialogView } from "./view/DialogView.js";

const sidebarView = new SidebarView(document.querySelector(".sidebar"));
const todoListView = new TodoListView(document.querySelector(".main-container"));

const newProjectDialog = new DialogView(document.querySelector("#new-project-dialog"));
const editProjectDialog = new DialogView(document.querySelector("#edit-project-dialog"));
const newTodoDialog = new DialogView(document.querySelector("#new-todo-dialog"));
const editTodoDialog = new DialogView(document.querySelector("#edit-todo-dialog"));
const deleteProjectDialog = new DialogView(document.querySelector("#delete-project-dialog"));
const deleteTodoDialog = new DialogView(document.querySelector("#delete-todo-dialog"));

/**
 * Helper / wrapper to render the entire app state
 */
function renderAll() {
    const activeProjectId = projectManager.getActiveProject()?.getId();
    const isDefault = projectManager?.isDefaultProject(activeProjectId);

    sidebarView.update(projectManager?.getProjects(), activeProjectId);
    todoListView.update(projectManager?.getActiveProject(), { isDefault: isDefault });
}

/**
 *  Assign all necessary callbacks between views and the project manager
 */
function assignCallbacks() {
    // ==========================
    // Button event hookups
    // ==========================

    sidebarView.setOnProjectSelected((id) => {
        projectManager.setActiveProject(id);
        renderAll();
    });

    sidebarView.setOnCreateProjectClicked(() => {
        newProjectDialog.open();
    });

    todoListView.setOnEditProjectClicked((projectId) => {
        const project = projectManager.getProjectById(projectId);
        editProjectDialog.open({ id: projectId, name: project.getName() });
    });

    todoListView.setOnDeleteProjectClicked((projectId) => {
        const project = projectManager.getProjectById(projectId);
        deleteProjectDialog.open({ id: projectId, name: project.getName() });
    });

    todoListView.setOnStarProjectClicked((projectId) => {
        projectManager.setDefaultProject(projectId);
        renderAll();
        projectManager.saveToStorage();
    });

    todoListView.setOnCreateTodoClicked((projectId) => {
        newTodoDialog.open({ projectId });
    });

    todoListView.setOnTodoToggled((projectId, todoId) => {
        const project = projectManager.getProjectById(projectId);
        const todo = project.getTodoById(todoId);
        todo.toggleCompleted();
        renderAll();
        projectManager.saveToStorage();
    });

    todoListView.setOnTodoExpandToggled((projectId, todoId) => {
        const project = projectManager.getProjectById(projectId);
        const todo = project.getTodoById(todoId);

        // Only toggle if there's actually a description
        if (todo.description && todo.description.trim() !== "") {
            todo.toggleExpanded();
            todoListView.expandTodo(todoId);
        }

        projectManager.saveToStorage();
    });

    todoListView.setOnEditTodoClicked((projectId, todoId) => {
        const project = projectManager.getProjectById(projectId);
        const todo = project.getTodoById(todoId);
        editTodoDialog.open({
            projectId: project.id,
            todoId: todo.id,
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            priority: todo.priority,
        });
    });

    todoListView.setOnDeleteTodoClicked((projectId, todoId) => {
        const project = projectManager.getProjectById(projectId);
        const todo = project.getTodoById(todoId);
        deleteTodoDialog.open({
            projectId: project.id,
            todoId: todo.id,
            title: todo.title,
        });
    });
    // ==================================
    // Dialog submit/cancel event hookups
    // ==================================

    newProjectDialog.setOnSubmit((data) => {
        projectManager.createProject(data.name);
        renderAll();
        projectManager.saveToStorage();
    });

    editProjectDialog.setOnSubmit((data) => {
        const project = projectManager.getProjectById(data.id);
        project.setName(data.name);
        renderAll();
        projectManager.saveToStorage();
    });

    deleteProjectDialog.setOnSubmit((data) => {
        projectManager.deleteProjectById(data.id);
        renderAll();
        projectManager.saveToStorage();
    });

    newTodoDialog.setOnSubmit((data) => {
        const project = projectManager.getProjectById(data.projectId);
        project.createTodo(data.title, data.description, data.dueDate, data.priority);
        renderAll();
        projectManager.saveToStorage();
    });

    editTodoDialog.setOnSubmit((data) => {
        const project = projectManager.getProjectById(data.projectId);
        const todo = project.getTodoById(data.todoId);

        todo.updateData({
            title: data.title,
            description: data.description,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            priority: data.priority,
        });

        renderAll();
        projectManager.saveToStorage();
    });

    deleteTodoDialog.setOnSubmit((data) => {
        const project = projectManager.getProjectById(data.projectId);
        project.deleteTodoById(data.todoId);
        renderAll();
        projectManager.saveToStorage();
    });

    // Cancel handlers
    [newProjectDialog, editProjectDialog, deleteProjectDialog, newTodoDialog, editTodoDialog, deleteTodoDialog].forEach(
        (dialog) => {
            dialog.setOnCancel(() => {});
        }
    );
}

export async function initApp() {
    assignCallbacks();
    projectManager.loadFromStorage();
    // initial render
    renderAll();
}
