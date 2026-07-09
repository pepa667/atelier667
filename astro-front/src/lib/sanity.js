import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID, // <--- Agora lê do .env
  dataset: "production",
  useCdn: false, // false garante que a gente sempre puxe o dado mais fresco da bancada
  apiVersion: "2026-06-21", // Data de hoje (padrão de versionamento da API deles)
});
