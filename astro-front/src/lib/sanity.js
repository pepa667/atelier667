import { createClient } from '@sanity/client';

export const sanityClient = createClient({
    projectId: '7ev62ugl', // <--- IMPORTANTE: Copie o ID do seu projeto no painel do Sanity
    dataset: 'production',
    useCdn: false, // false garante que a gente sempre puxe o dado mais fresco da bancada
    apiVersion: '2026-06-21', // Data de hoje (padrão de versionamento da API deles)
});