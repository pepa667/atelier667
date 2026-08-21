<script setup>
import { computed } from "vue";
import { createImageUrlBuilder } from "@sanity/image-url"; // 🎯 Troca para a named export
import { sanityClient } from "../sanity.js";

const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
});

const post = computed(() => props.posts[0] || null);

// 🚀 Inicializa usando createImageUrlBuilder
const builder = createImageUrlBuilder(sanityClient);

const urlFor = (source) => {
  return source ? builder.image(source).auto("format").fit("max").url() : "";
};
</script>

<template>
  <article
    v-if="post"
    class="h-full w-full flex flex-col justify-between p-4 relative overflow-hidden"
  >
    <!-- Header com Título do Card -->
    <header class="mb-3 flex items-center justify-between z-10">
      <h2 class="text-xs font-bold text-main-b tracking-wider uppercase">
        // ARTBOARD_FEED
      </h2>
      <span v-if="post.timestamp" class="text-[10px] opacity-60 font-mono">
        {{ new Date(post.timestamp).toLocaleDateString() }}
      </span>
    </header>

    <!-- Container da Imagem Central (Flex-1 força esticar a altura livre) -->
    <div
      class="relative flex-1 w-full aspect-video my-2 bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden group flex items-center justify-center"
    >
      <!-- Renderiza a primeira imagem do carrossel do Sanity -->
      <img
        v-if="post.images && post.images.length > 0"
        :src="urlFor(post.images[0])"
        :alt="post.title"
        class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <!-- Fallback quando não há imagem carregada -->
      <div v-else class="text-xs text-zinc-600 font-mono">[NO_IMAGE_DATA]</div>

      <!-- Overlay com título e caption ao passar o mouse -->
      <div
        class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end text-xs backdrop-blur-sm z-20"
      >
        <p class="font-bold text-zinc-100 mb-1">{{ post.title }}</p>
        <p v-if="post.caption" class="text-zinc-400 line-clamp-3 text-[11px]">
          {{ post.caption }}
        </p>
      </div>
    </div>

    <!-- Rodapé: Tags e Link Externo -->
    <footer class="mt-2 flex items-center justify-between text-[11px] z-10">
      <!-- Tags -->
      <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in post.tags"
          :key="tag"
          class="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 text-[9px] uppercase rounded border border-zinc-700/50"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Link Externo (se existir) -->
      <a
        v-if="post.externalLink"
        :href="post.externalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="text-main-a hover:underline text-[10px] font-bold flex items-center gap-1 ml-2"
      >
        LINK ↗
      </a>
    </footer>
  </article>
</template>
