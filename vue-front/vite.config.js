import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Gera o gráfico visual após o build pra você ver exatamente o que tá pesado
    visualizer({
      filename: "stats.html",
      open: true, // Abre sozinho no navegador ao buildar
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: "/",
  build: {
    // Garante código moderno sem polyfills legados
    target: "esnext",

    // Deixe como 'true' para o Vite gerenciar a minificação nativa sem explodir
    minify: true,

    // Quebra o bundle monólito em pedaços (Code Splitting)
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Isola o core do Vue em um arquivo separado (vendor)
          if (id.includes("node_modules/vue")) {
            return "vue-vendor";
          }
          // Se tiver iconify/lucide, isola os ícones
          if (
            id.includes("node_modules/@iconify") ||
            id.includes("node_modules/lucide")
          ) {
            return "icons-vendor";
          }
        },
      },
    },
  },
});
