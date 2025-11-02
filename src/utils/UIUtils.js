/**
 * @fileoverview Generic DOM / UI utility functions
 *
 * Responsibilities:
 * - Show/hide/toggle elements
 * - Generic event binding helpers
 * - Element creation helpers
 * - Can be extended with more DOM utility methods
 *
 * Example:
 *   UIUtils.show('#sidebar');
 *
 * @module UIUtils
 */
export const UIUtils = {
    show(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = '';
    },
    hide(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = 'none';
    },
    toggle(selector) {
        const el = document.querySelector(selector);
        if (el) el.style.display = (el.style.display === 'none') ? '' : 'none';
    },
    bindEvent(selector, eventType, callback) {
        const el = document.querySelector(selector);
        if (el) el.addEventListener(eventType, callback);
    },
    createElement(tag, classNames = [], textContent = "") {
        const el = document.createElement(tag);
        classNames.forEach(cls => el.classList.add(cls));
        el.textContent = textContent;
        return el;
    },
    createClickableButton(classNames = [], textContent = "", onClick) {
        const btn = createElement("button", classNames, textContent)
        btn.addEventListener("click", onClick);
        return btn;
    },
    clearChildren(parent) {
        while (parent.firstChild) parent.removeChild(parent.firstChild);
    }
};
