import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "7ev62ugl", // Joga o ID do Atelier667
  dataset: "production",
  useCdn: true, // 'false' se quiser bypassar o cache e ver na hora
  apiVersion: "2024-07-19",
});
