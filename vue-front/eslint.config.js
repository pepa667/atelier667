import js from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import skipFormatting from "eslint-config-prettier";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{js,mjs,jsx,vue}"],
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/node_modules/**"],
  },

  // Regras básicas de JS
  js.configs.recommended,

  // Regras essenciais para Vue 3
  ...pluginVue.configs["flat/essential"],

  // Desativa regras do ESLint que o Prettier já cuida
  skipFormatting,

  {
    rules: {
      // Ajuste suas regras customizadas aqui se precisar
      "vue/multi-word-component-names": "off", // Permite nomes simples como Icon.vue
    },
  },
];
