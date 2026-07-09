import { defineConfig } from "astro/config";
import tailwindcss from "@astrojs/tailwind";
import react from "@astrojs/react";

export default defineConfig({
  integrations: [tailwindcss(), react()],
});
