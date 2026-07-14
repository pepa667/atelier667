import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanityClient = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID, // <--- Agora lê do .env
  dataset: 'production',
  apiVersion: '2026-07-09', // Data de hoje para travar a API estável
  useCdn: true, // true para carregar rápido via cache da edge da Sanity
});

// Configura o gerador de links de imagem a partir do client acima
const builder = createImageUrlBuilder(sanityClient);

// Função exportada para gerar a URL do asset
export function urlFor(source) {
  return builder.image(source);
}
