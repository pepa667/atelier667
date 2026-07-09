// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Força o Vite a ignorar o cache quebrado de resolução de caminhos na Netlify
    resolve: {
      preserveSymlinks: true,
    },
  },
  integrations: [react()],
});
