import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    // Alvo moderno para não transpilar syntax nova nem injetar polyfills legados
    target: "esnext", // Ou 'es2022'

    // Opcional: minificação agressiva com esbuild
    minify: "esbuild",
  },
});
