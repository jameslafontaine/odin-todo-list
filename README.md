# 🧩 Odin Project Webpack Template

A ready-to-use boilerplate for your future **The Odin Project** projects, built with **Webpack + npm**, and optional support for **Babel**, **ESLint + Prettier**, and **CSS optimisation**.

---

## 🚀 Getting Started

Follow these steps after cloning the template repository to get up and running:

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/odin-template.git my-project
cd my-project

# 2. Install dependencies
npm install

# 3. Optional: Run the setup script
./setup_template_repo.sh

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build

# 6. Optional: Deploy to GitHub Pages
npm run deploy
```

### ✅ Notes

-   **Step 3** (setup script) may prompt you to enable optional features like Babel or ESLint/Prettier.
-   **Step 4** launches the Webpack Dev Server with hot reloading for development.
-   **Step 5** creates a minified production build in the `dist/` folder.
-   **Step 6** deploys `dist/` to a `gh-pages` branch via `git subtree` (if configured).

For a minimal workflow, the **only required commands** are:

```bash
npm install
npm run dev       # or `npm run build` if just building for production
```

---

### ⚠️ Note on `package.json` module type

If you’re **not using Babel**, make sure your `package.json` **does not include** this line:

```json
"type": "commonjs"
```

Having it set forces Node to interpret `.js` files as CommonJS, which **breaks ES6 `import` / `export` syntax** used in this template.  
Simply remove that line (or set `"type": "module"` if you prefer ESM explicitly).

---

### 📝 Babel vs No-Babel Workflow Tip

-   **Using Babel (recommended for beginners or projects with modern JS features):**

    -   Keep `"type"` unset or `"type": "module"` in `package.json`.
    -   Babel will transpile your ES6+ syntax (`import`/`export`) into a form Webpack and Node can handle.
    -   Use Babel loader in `webpack.common.js`.

-   **Not using Babel (simple template setup):**
    -   Remove `"type": "commonjs"` from `package.json`.
    -   Webpack will handle ES modules directly for `import`/`export` syntax.
    -   You won’t need any Babel-related packages or config.

This ensures users know exactly when they need Babel and when it’s safe to skip it.

---

## 🧱 Included by Default

-   **Webpack 5 modular configuration**

    -   `webpack.common.js`
    -   `webpack.dev.js`
    -   `webpack.prod.js`

-   **Basic project structure**

    -   `src/index.html`
    -   `src/index.js`
    -   `src/style.css`
    -   `dist/` (build output)

-   **NPM scripts**

    -   `npm run dev` → start dev server
    -   `npm run build` → production build
    -   `npm run deploy` → deploy `dist/` to GitHub Pages (`git subtree`)

-   **Optional setup prompts**
    -   Babel for ES6+ transpilation
    -   ESLint + Prettier for code style consistency

---

## 🧠 Webpack Behaviour: JS vs CSS Minification

Webpack automatically minifies JavaScript when using **`mode: 'production'`**, powered internally by **Terser**.  
You do **not need to install `terser-webpack-plugin`** unless you want to customize minification options.

CSS is **not minified by default**. If you want smaller CSS output, you can use a plugin like `css-minimizer-webpack-plugin`.

### ✅ Recommended Setup

-   **Default (simple projects):**

    -   Just use `mode: 'production'`.
    -   Webpack handles JS minification automatically.
    -   CSS is optional.

-   **Advanced / customizable minification:**
    -   Add `TerserPlugin` to the `optimization.minimizer` array if you want fine-grained control (e.g., keeping comments, custom ECMAScript target, parallelization).

### 🔧 Example `webpack.prod.js` snippet

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const TerserPlugin = require("terser-webpack-plugin"); // optional for custom JS minification

module.exports = {
    mode: "production",
    optimization: {
        minimize: true, // enables built-in JS minification
        minimizer: [
            "...", // keep Webpack's default JS minifier
            new CssMinimizerPlugin(), // optional CSS minification
            // new TerserPlugin({ /* custom options here */ }), // optional
        ],
    },
};
```

## ⚙️ Customisation Tips

-   **SASS/SCSS:**
    Install with

    ```bash
    npm install sass sass-loader --save-dev
    ```

    Then update your `webpack.common.js`:

    ```js
    {
      test: /\.s[ac]ss$/i,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    }
    ```

-   **Linting & Formatting:**
    If you selected ESLint + Prettier during setup, your config files (`.eslintrc.json`, `.prettierrc`) will already be in place.  
    You can lint anytime with:

    ```bash
    npm run lint
    ```

-   **Deploy to GitHub Pages:**
    Run:

    ```bash
    npm run deploy
    ```

    This pushes your `dist/` folder to a `gh-pages` branch automatically (via `git subtree`).

---

## 🎨 CSS Workflow with Webpack

You have a few options for managing multiple CSS files in your project. Webpack only processes files you explicitly import, so you need to tell it what to bundle.

---

### 1️⃣ Option 1: Single `main.css` using `@import`

Create a `main.css` that imports all subfiles:

```css
/* src/styles/main.css */
@import "./reset.css";
@import "./layout.css";
@import "./header.css";
@import "./footer.css";
```

Then import it in your JS:

```js
// src/index.js
import "./styles/main.css";
```

✅ Pros:

-   Simple and easy to understand
-   Only one import in JS
-   Easy to add or remove CSS files

⚠️ Note:

-   Paths in `@import` are relative to the CSS file, not your JS file.
-   Webpack bundles all CSS during build — no runtime HTTP imports.

---

### 2️⃣ Option 2 (Recommended): Use a JS module (`styles.js`) to import CSS

Create a module to explicitly import all your CSS files:

```js
// src/modules/styles.js
import "../styles/tokens.css";
import "../styles/base.css";
import "../styles/layout.css";
import "../styles/components.css";
import "../styles/utilities.css";
```

Then in your main JS entry:

```js
// src/index.js
import "./modules/styles.js";
console.log("🚀 Webpack Template Running!");
```

✅ Pros:

-   Clear dependency graph — every CSS file is explicitly imported
-   Avoids CSS `@import` quirks
-   Works seamlessly with Webpack loaders (`style-loader` / `css-loader`)
-   Easy to scale and organize CSS with other modules

---

💡 **Tip:** Use the `styles.js` module method for clarity and maintainability. Use the `main.css @import` method only for small projects or if you prefer CSS-based imports.

---

## 🧩 Folder Structure

```plaintext
📁 my-project/
 ┣ 📁 src/
 ┃ ┣ 📁 assets/
 ┃ ┃ ┣ 📁 fonts/
 ┃ ┃ ┗ 📁 img/
 ┃ ┣ 📁 modules/
 ┃ ┃ ┣ boilerplate.js
 ┃ ┃ ┣ styles.js
 ┃ ┃ ┗ tables.js
 ┃ ┣ 📁 styles/
 ┃ ┃ ┣ tokens.css
 ┃ ┃ ┣ base.css
 ┃ ┃ ┣ layout.css
 ┃ ┃ ┣ components.css
 ┃ ┃ ┗ utilities.css
 ┃ ┣ index.html
 ┃ ┗ index.js
 ┣ 📁 dist/
 ┣ 📁 node_modules/
 ┣ .gitignore
 ┣ LICENSE
 ┣ package-lock.json
 ┣ package.json
 ┣ README.md
 ┣ setup_template_repo.sh
 ┣ webpack.common.js
 ┣ webpack.dev.js
 ┗ webpack.prod.js

```

---

## 🔧 (Optional) Improvements later

-   Add ESLint + Prettier integration.

-   Use .env + dotenv-webpack for environment variables.

-   Add testing support (e.g., Jest).

---

## 🧰 Why Use This Template?

-   Saves time setting up Webpack projects for each Odin Project assignment.
-   Keeps configuration clean, modular, and reusable.
-   Promotes modern web dev best practices (linting, transpiling, bundling).
-   Fully extensible — add React, TypeScript, or other tools later if desired.

---

## 📝 License

This project is open-source under the **MIT License**.  
Feel free to copy, modify, or use it for your Odin Project work or any other web dev projects.

---

Happy coding! 💻✨
