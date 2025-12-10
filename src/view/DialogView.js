/**
 * @fileoverview Provides a reusable dialog component for handling modal forms.
 *
 * Responsibilities:
 *  - Manage opening and closing of a <dialog> element.
 *  - Collect form data from inputs within the dialog.
 *  - Store and pass contextual data (e.g., projectId) to callbacks.
 *  - Allow external code to register submit and cancel handlers.
 *
 * Example usage:
 *  const newTodoDialog = new DialogView(document.querySelector("#new-todo-dialog"));
 *  newTodoDialog.onSubmit((data) => {
 *      console.log("Form submitted:", data);
 *  });
 *  newTodoDialog.onCancel(() => {
 *      console.log("Dialog canceled");
 *  });
 *  newTodoDialog.open({ projectId: "1234" });
 *
 * Public API:
 *  - open(context) — Opens the dialog and optionally stores contextual data.
 *  - close() — Closes the dialog and clears any stored context.
 *  - onSubmit(callback) — Registers a callback for when the submit button is clicked.
 *  - onCancel(callback) — Registers a callback for when the cancel button is clicked.
 *
 * Internal methods/properties (not meant to be used externally):
 *  - _setupEventListeners() — Sets up internal event listeners.
 *  - _collectFormData() — Collects values from input, textarea, and select elements.
 *  - _onSubmit — Internal storage for the submit callback.
 *  - _onCancel — Internal storage for the cancel callback.
 *  - _context — Internal storage for contextual data passed in via open().
 *
 * @module DialogView
 */

export class DialogView {
    constructor(dialogElement) {
        this.dialogElement = dialogElement;
        this.submitButton = dialogElement.querySelector(".submit-button");
        this.cancelButton = dialogElement.querySelector(".cancel-button");
        this._onSubmit = null;
        this._onCancel = null;
        this._context = {}; // <-- store extra data like projectId
        this._setupEventListeners();
    }

    open(context = {}) {
        this._context = context; // store context when opening
        this._populateFormFields(context); // populate inputs with context values
        this.dialogElement.showModal();
    }

    close() {
        this.dialogElement.close();
        this._context = {}; // clear context

        // Reset all inputs in the dialog
        const form = this.dialogElement.querySelector("form");
        if (form) form.reset();
    }

    setOnSubmit(callback) {
        this._onSubmit = callback;
    }

    setOnCancel(callback) {
        this._onCancel = callback;
    }

    _setupEventListeners() {
        this.submitButton.addEventListener("click", () => {
            const formData = this._collectFormData();
            // Merge form data with context
            this._onSubmit?.({ ...this._context, ...formData });
            this.close();
        });

        this.cancelButton.addEventListener("click", () => {
            this._onCancel?.();
            this.close();
        });
    }

    _collectFormData() {
        const formElements = this.dialogElement.querySelectorAll("input, textarea, select");
        const data = {};
        formElements.forEach((el) => {
            if (el.name) {
                data[el.name] = el.value;
            }
        });
        return data;
    }

    /**
     * Internal: populate form fields from the given context
     * Only sets values for inputs/textarea/select elements whose `name` matches a context key
     */
    _populateFormFields(context) {
        const formElements = this.dialogElement.querySelectorAll("input, textarea, select");
        formElements.forEach((el) => {
            if (el.name && context[el.name] !== undefined) {
                // Special handling for date inputs
                if (el.type === "date" && context[el.name] instanceof Date) {
                    const year = context[el.name].getFullYear();
                    const month = String(context[el.name].getMonth() + 1).padStart(2, "0");
                    const day = String(context[el.name].getDate()).padStart(2, "0");
                    el.value = `${year}-${month}-${day}`;
                } else {
                    el.value = context[el.name];
                }
            }
        });
    }
}
