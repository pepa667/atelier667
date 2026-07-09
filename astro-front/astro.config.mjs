// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// No Astro 6, o Tailwind v4 roda direto pelo PostCSS nativo do Vite, sem precisar de integration!
export default defineConfig({
  integrations: [react()],
});
