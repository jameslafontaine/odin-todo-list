/**
 * @fileoverview Imports and aggregates all CSS subfiles for the To-Do List app.
 *
 * Responsibilities:
 *  - Serve as a single entry point for all CSS stylesheets.
 *  - Ensure Webpack includes and bundles global styles.
 *
 * Contents:
 *  - tokens.css     → Design tokens (colors, fonts, spacing, etc.)
 *  - base.css       → Resets and global element styles
 *  - layout.css     → Structural and grid layout styles
 *  - components.css → UI component-specific styles
 *  - utilities.css  → Helper and utility classes
 *
 * @module styles
 */

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/utilities.css";