import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginAstro from "eslint-plugin-astro";
import eslintConfigPrettier from "eslint-config-prettier"; // 1. Import config

export default [
  // Base JavaScript and TypeScript rules
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Astro recommended configuration
  ...eslintPluginAstro.configs.recommended,

  // Custom rule overrides
  {
    files: ["**/*.astro"],
    rules: {
      // Example: override or add specific Astro rules here
      // "astro/no-set-html-directive": "error"
    },
  },
  eslintConfigPrettier, // 2. Must be last to override formatting rules
];
