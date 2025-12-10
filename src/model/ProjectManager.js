/**
 * @fileoverview Manages all user projects and global Todo list state.
 *
 * Responsibilities:
 *  - Store and manage multiple Project instances in an internal array.
 *  - Create new projects and delete existing projects.
 *  - Track and switch the currently active project.
 *  - Provide methods to retrieve projects by ID or get all projects.
 *  - Serve as the global source of truth for all app-level project and todo data.
 *
 * Exports:
 *  - projectManager — Singleton instance of ProjectManager.
 *
 * Dependencies:
 *  - Project from './Project.js' — Represents individual projects.
 *  - Storage from '../storage/Storage.js - Provides methods for saving and loading application state to / from
 *                                          localStorage
 *
 * Example:
 *  import { projectManager } from './ProjectManager.js';
 *  const project = projectManager.createProject("Work");
 *  projectManager.deleteProjectById(project.id);
 *  const activeProject = projectManager.getActiveProject();
 *
 * @module ProjectManager
 */

import { Project } from "./Project.js";
import { Storage } from "../storage/Storage.js";

class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeProject = null; // currently selected project to display todos for
        this.defaultProject = null; // default project that is selected on app launch
    }
    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        if (!this.activeProject) this.activeProject = project;
        if (!this.defaultProject) this.defaultProject = project;
        return project;
    }
    deleteProjectById(id) {
        this.projects = this.projects.filter((p) => p.id !== id);
        if (this.activeProject?.id === id) {
            this.activeProject = this.projects[0] ?? null;
        }
        if (this.defaultProject?.id === id) {
            this.defaultProject = this.projects[0] ?? null;
        }
    }

    deleteAllProjects() {
        this.projects = [];
        this.activeProject = null;
    }

    getActiveProject() {
        return this.activeProject;
    }

    setActiveProject(id) {
        const project = this.getProjectById(id);
        this.activeProject = project || null;
    }

    getDefaultProject() {
        return this.defaultProject;
    }

    setDefaultProject(id) {
        this.defaultProject = this.defaultProject?.getId() === id ? null : this.getProjectById(id);
    }

    isDefaultProject(id) {
        if (!id) return;
        return this.defaultProject?.getId() === id;
    }

    getProjects() {
        return this.projects;
    }

    getProjectById(id) {
        return this.projects.find((p) => p.id === id) || null;
    }

    loadFromStorage() {
        const data = Storage.load();
        if (!data) return;

        this.projects = data.projects.map((p) => {
            const project = new Project(p.name);
            project.setId(p.id); // restore project ID

            // Rebuild todos
            p.todos.forEach((t) => {
                const todo = project.createTodo(t.title, t.description, t.dueDate, t.priority);

                // Now override system-generated fields
                todo.id = t.id;
                todo.completed = t.completed;
                todo.expanded = t.expanded;
            });

            return project;
        });

        this.defaultProject = this.getProjectById(data.defaultProjectId) || this.projects[0] || null;
        this.activeProject = this.defaultProject;
    }

    saveToStorage() {
        Storage.save({
            defaultProjectId: this.defaultProject?.getId() ?? null,
            projects: this.projects.map((p) => ({
                id: p.id,
                name: p.name,
                todos: p.todos.map((t) => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    dueDate: t.dueDate,
                    priority: t.priority,
                    completed: t.completed,
                    expanded: t.expanded,
                })),
            })),
        });
    }

    printProjects() {
        console.table(this.projects);
    }
}

export const projectManager = new ProjectManager();
