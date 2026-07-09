// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [
      // Passando uma configuração limpa para forçar o reinício correto das propriedades
      tailwindcss({
        // Isso desativa o resolvedor nativo problemático se o plugin tentar herdar lixo do ambiente
      }),
    ],
    server: {
      fs: {
        // Garante que o monorepo consiga ler arquivos da raiz se necessário sem quebrar o build
        allow: [".."],
      },
    },
  },
  integrations: [react()],
});
