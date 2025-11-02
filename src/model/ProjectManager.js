/**
 * @fileoverview Manages all user projects and global to-do list state.
 *
 * Responsibilities:
 *  - Store and manage multiple Project instances.
 *  - Handle project creation, deletion, and active project switching.
 *  - Act as the global source of truth for app-level project data.
 *
 * Exports:
 *  - projectManager — Singleton instance of ProjectManager.
 *
 * Dependencies:
 *  - Project from './Project.js' — Represents an individual project.
 *
 * @module ProjectManager
 */


import { Project } from "./Project.js";
class ProjectManager {
    constructor() {
        this.projects = [];
        this.activeProject = null;
    }
    createProject(name) {
        const project = new Project(name);
        this.projects.push(project);
        if (!this.activeProject) this.activeProject = project;
        return project;
    }
    deleteProjectById(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        if (this.activeProject?.id === id) {
            this.activeProject = this.projects[0] ?? null;
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
        this.activeProject = this.projects.find(p => p.id === id) || null;
    }

    getProjects() {
        return this.projects;
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id) || null;
    }

    printProjects() {
        console.table(this.projects);
    }
}

export const projectManager = new ProjectManager();