# Odin Todo List

A fully dynamic, modular todo list application built as part of **The Odin Project** curriculum.  
This is my first project combining **intermediate-level HTML, CSS, and JavaScript** in a cohesive, structured app, and my first time building something approaching an **MVC-style architecture**.

The project places strong emphasis on **state management**, **modular code organization**, **Webpack tooling**, and **clean separation of concerns** across Models, Views, and Controllers.

---

## 🧩 Project Description

This Todo List app allows users to:

-   Create, edit, delete, and prioritize todos
-   Group todos within projects
-   Mark todos as complete
-   Expand todo descriptions with smooth animations
-   Persist all data in **localStorage**
-   Navigate and interact through a clean UI with **modal dialog forms**
-   Star projects (set a “default project”)
-   Dynamically render UI using JavaScript

The codebase is organized into **Model**, **View**, and **Controller** layers to keep logic maintainable and testable.

---

## 🚀 Features

### 🛠 Modern Tooling & Build Setup

-   **Webpack bundling** for JavaScript, CSS, and assets
-   **Webpack Merge** used to cleanly separate development and production configs
-   Full **ES6 module syntax** (`import` / `export`)
-   Automatic handling of fonts, images, and CSS
-   Modularized CSS using a structured folder hierarchy

---

## 🧠 Application Architecture (MVC-Inspired)

### **Model Layer**

-   `Project`, `Todo`, `ProjectManager`, `Priorities`
-   Centralized storage system (`Storage.js`) syncing all state to **localStorage**
-   Allows for data validation, rule enforcement, and structure management

### **View Layer**

-   Dedicated UI modules: `SidebarView`, `TodoListView`, `DialogView`
-   Handles rendering only — **no business logic**
-   Expandable descriptions with CSS transitions
-   Dynamic UI indicators
-   DOM events delegated and forwarded to the controller

### **Controller Layer**

-   `app.js` orchestrates Models + Views
-   Handles user interaction, data persistence, and triggering view re-renders
-   Acts as the **glue** of the entire application

---

## 💾 Persistent Local Storage

All projects and todos are automatically saved and restored using `localStorage`. State persists across page reloads, enabling real long-term use.

---

## 🎨 UI / UX Features

-   Expandable todo descriptions with smooth animation
-   Modal dialog forms for creating/editing projects and todos
-   Responsive layout with structured, scalable CSS
-   Priority labeling (Urgent / High / Medium / Low)
-   Clean separation between component styles and layout styles
-   Sidebar navigation for switching projects

---

## 📁 Folder Structure

A simplified version of the project structure:

```
src/
├── assets/
│ ├── fonts/
│ └── img/
│
├── model/
│ ├── Priorities.js
│ ├── Project.js
│ ├── ProjectManager.js
│ └── Todo.js
│
├── storage/
│ └── Storage.js
│
├── styles/
│ ├── base.css
│ ├── components.css
│ ├── layout.css
│ ├── tokens.css
│ └── utilities.css
│
├── ui/
│ ├── DialogView.js
│ ├── SidebarView.js
│ └── TodoListView.js
│
├── utils/
│ ├── DateUtils.js
│ ├── TableUtils.js
│ └── UIUtils.js
│
│
├── app.js
├── index.html
├── index.js
└── styles.js
```

---

## 🎯 Learning Objectives

This project was built to develop practical experience with:

-   Webpack, Webpack Merge, and dependency management
-   Writing scalable CSS architectures (tokens, utilities, components)
-   Using ES modules and structuring a larger JS codebase
-   Following an MVC-style structure in a front-end project
-   Synchronizing application state with localStorage
-   Dynamic DOM manipulation without solely relying on static HTML templates
-   Managing complex event delegation
-   Building reusable view components and utilities

This is my **first time building an app that fully integrates JS, CSS, and HTML at an intermediate level**, and it significantly improved my ability to structure larger projects.

---

## 🌐 Live Demo

[Odin Todo List Live Demo](https://jameslafontaine.github.io/odin-todo-list/)

---

## 🔮 Future Improvements

-   Due date reminders & notifications (UI badges, local alerts)
-   Full-text searching and filtering
-   Drag-and-drop todo reordering
-   Further implement natural language date parsing (e.g., “tomorrow at 2pm”)
-   Light/dark theme switcher
-   Undo/redo history with reversible operations
-   Improved accessibility (keyboard support, ARIA roles)
-   Fully responsive design

---

## 📜 License

This project is for educational purposes and follows **The Odin Project** curriculum guidelines.  
Feel free to fork, modify, and explore.
