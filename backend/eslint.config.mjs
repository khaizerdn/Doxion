import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Configuration for backend (Node.js) files
  {
    files: ["backend/**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.node }, // Use Node.js globals (e.g., process)
    plugins: {
      js: pluginJs,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
    },
  },
  // Configuration for frontend (browser/React) files
  {
    files: ["doxionv2/**/*.{js,mjs,cjs,jsx}"],
    languageOptions: { globals: globals.browser },
    plugins: {
      react: pluginReact,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
    },
  },
];