#!/bin/bash
# setup_template_repo.sh
# Run this after cloning your Webpack template repo

# -------------------------------
# 🎨 Color Definitions
# -------------------------------
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
BLUE="\033[1;34m"
RESET="\033[0m"

# -------------------------------
# 🎯 Helper Functions
# -------------------------------

info() { echo -e "${BLUE}💬 $1${RESET}"; }
success() { echo -e "${GREEN}✅ $1${RESET}"; }
skip() { echo -e "${YELLOW}⏩ $1${RESET}"; }
warn() { echo -e "${RED}⚠️ $1${RESET}"; }

create_heredoc_if_missing() {
  local file_path=$1
  local content=$2
  if [ -f "$file_path" ]; then
    skip "$file_path already exists, skipping..."
  else
    echo "🆕 Creating $file_path"
    cat << EOF > "$file_path"
$content
EOF
    success "Created $file_path"
  fi
}

ask_yes_no() {
  local prompt=$1
  local default=$2
  local response

  while true; do
    read -rp "$(echo -e "${BLUE}$prompt [$default]: ${RESET}")" response
    response=${response:-$default}
    case "$response" in
      [Yy]* ) return 0 ;;
      [Nn]* ) return 1 ;;
      * ) warn "Please answer y or n." ;;
    esac
  done
}

# -------------------------------
# 🚀 Start Setup
# -------------------------------
info "Initializing Webpack project setup..."

# 1. Initialize npm
if [ ! -f package.json ]; then
  info "Initializing npm..."
  npm init -y
  success "npm initialized"
else
  skip "package.json already exists"
fi

# 2. Install core dependencies
info "Installing Webpack and core plugins..."
npm install --save-dev \
  webpack webpack-cli webpack-dev-server \
  html-webpack-plugin style-loader css-loader html-loader \
  webpack-merge terser-webpack-plugin css-minimizer-webpack-plugin
success "Core dependencies installed"

# 3. Ask about optional features
USE_BABEL=false
USE_ESLINT=false

if ask_yes_no "Would you like to include Babel for JS transpilation?" "y/n"; then
  USE_BABEL=true
  info "Installing Babel..."
  npm install --save-dev @babel/core @babel/preset-env babel-loader
  success "Babel installed"
else
  skip "Babel setup skipped"
fi

if ask_yes_no "Would you like to include ESLint + Prettier setup?" "y/n"; then
  USE_ESLINT=true
  info "Installing ESLint + Prettier..."
  npm install --save-dev eslint prettier eslint-config-prettier
  success "ESLint + Prettier installed"
else
  skip "ESLint + Prettier setup skipped"
fi

# 4. Create project structure
info "Creating project directories..."
mkdir -p src/modules src/styles src/assets/img src/assets/fonts dist
success "src/ and dist/ directories ready"

# 5. Create boilerplate files
info "Generating boilerplate files..."

create_heredoc_if_missing "src/index.html" '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Webpack Template</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>'

create_heredoc_if_missing "src/index.js" 'import "./style.css";
console.log("🚀 Webpack Template Running!");'

create_heredoc_if_missing "src/style.css" 'body {
  font-family: sans-serif;
  margin: 0;
  padding: 2rem;
  background: #f7f7f7;
}'

# 6. Webpack configs
info "Setting up Webpack configuration..."

BABEL_RULE=""
if [ "$USE_BABEL" = true ]; then
  BABEL_RULE='{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },'
fi

create_heredoc_if_missing "webpack.common.js" "const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  module: {
    rules: [
      $BABEL_RULE
      {
        test: /\\.css\$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\\.html\$/i,
        loader: 'html-loader',
      },
      {
        test: /\\.(png|svg|jpg|jpeg|gif)\$/i,
        type: 'asset/resource',
      },
    ],
  },
};"

create_heredoc_if_missing "webpack.dev.js" "const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    static: './dist',
    port: 8080,
    open: true,
    watchFiles: ['./src/index.html'],
  },
});"

create_heredoc_if_missing "webpack.prod.js" "const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true, // enables JS minification by default (Terser)
    minimizer: [
      "...", // preserves Webpack's default JS minifier
      new CssMinimizerPlugin(), // optional CSS minification
      // If you ever want to customize JS minification:
      // new TerserPlugin({ /* custom options here */ }),
    ],
  },
});

# 7. Optional configs
if [ "$USE_BABEL" = true ]; then
  create_heredoc_if_missing ".babelrc" '{
  "presets": ["@babel/preset-env"]
}'
fi

if [ "$USE_ESLINT" = true ]; then
  create_heredoc_if_missing ".eslintrc.json" '{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": ["eslint:recommended", "prettier"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {}
}'

  create_heredoc_if_missing ".prettierrc" '{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}'
fi

# 8. NPM scripts
info "Adding npm scripts..."
npx npm-add-script -k "build" -v "webpack --config webpack.prod.js" >/dev/null 2>&1
npx npm-add-script -k "dev" -v "webpack serve --config webpack.dev.js" >/dev/null 2>&1
npx npm-add-script -k "deploy" -v "git subtree push --prefix dist origin gh-pages" >/dev/null 2>&1
success "NPM scripts added"

# 9. Initialize Git
if [ ! -d .git ]; then
  info "Initializing git repository..."
  git init
  success "Git initialized"
else
  skip "Git already initialized"
fi

# 10. Done
success "Setup complete!"
echo -e "${BLUE}Run '${GREEN}npm run dev${BLUE}' to start developing or '${GREEN}npm run build${BLUE}' for production build.${RESET}"
