/**
 * @fileoverview Defines an enum-like object for task priority levels.
 *
 * Responsibilities:
 *  - Provide consistent, readable constants for task priorities.
 *  - Prevent invalid string literals from being used across the codebase.
 *
 * Exports:
 *  - Priorities — Immutable object literal simulating an enum.
 *
 * Example:
 *  - Priorities.URGENT → "URGENT"
 *  - Priorities.IMPORTANT → "IMPORTANT"
 *  - Priorities.LOW → "LOW"
 *
 * @module Priorities
 */


export const Priorities = Object.freeze({
    URGENT: "Urgent",
    IMPORTANT: "Important",
    LOW: "Low",
});