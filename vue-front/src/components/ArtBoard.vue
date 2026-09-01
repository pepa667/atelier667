<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "../sanity.js";
import GlitchWrapper from "./GlitchWrapper.vue";

const props = defineProps({
  arts: {
    type: Array,
    default: () => [],
  },
});

const art = computed(() => props.arts[0] || null);

const builder = createImageUrlBuilder(sanityClient);

const urlFor = (source) => {
  return source ? builder.image(source).auto("format").fit("max").url() : "";
};

// 🎯 Referência do DOM para medir o artigo de forma reativa e segura
const articleRef = ref(null);
const articleAspect = ref(1);

let observer = null;

onMounted(() => {
  if (!articleRef.value) return;

  // ResizeObserver monitora o tamanho do article sem travar a thread de renderização
  observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        articleAspect.value = height / width;
      }
    }
  });

  observer.observe(articleRef.value);
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});

// 🎯 Calcula se é Portrait sem consultar o DOM diretamente na Computed
const isPortrait = computed(() => {
  const img = art.value?.images?.[0];
  if (!img?.width || !img?.height) return false;

  const imgAspectRatio = img.height / img.width;

  // Compara o aspect ratio fixo da imagem com o aspect do container capturado pelo observer
  return imgAspectRatio > articleAspect.value;
});
</script>

<template>
  <article
    v-if="art"
    ref="articleRef"
    class="h-full w-full aspect-video flex flex-col justify-between relative overflow-visible group"
  >
    <!-- Header com Título do Card -->
    <GlitchWrapper is="figure" :trigger-probability="0.15">
      <a
        href="#"
        class="absolute w-full h-full overflow-visible flex items-center justify-center transition-transform duration-500 group-hover:scale-115 group-[.onView]:scale-115"
      >
        <img
          v-if="art.images && art.images.length > 0"
          :src="urlFor(art.images[0])"
          :alt="art.title"
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
          :class="[
            isPortrait
              ? 'w-auto h-auto min-h-full max-h-[calc(100%+5rem)]'
              : 'h-auto w-auto min-w-full max-w-[calc(100%+5rem)]',
          ]"
        />
      </a>
    </GlitchWrapper>

    <header
      class="mb-3 relative flex items-center justify-between p-4 bg-zinc-950/80 group-hover:opacity-50 group-[.onView]:opacity-50 transition-opacity duration-700"
    >
      <h2
        class="text-sm font-bold text-main-b leading-loose bg-black tracking-wider uppercase"
      >
        // ARTBOARD_FEED
      </h2>
    </header>

    <!-- Container da Imagem Central -->
    <!-- Renderiza a primeira imagem com estouro condicional -->

    <!-- Rodapé: Tags e Link Externo -->
    <footer
      class="mt-3 relative flex items-center justify-between p-4 bg-zinc-950/80 group-hover:opacity-50 group-[.onView]:opacity-50 transition-opacity duration-700"
    >
      <h2
        class="text-sm font-bold text-main-b leading-loose bg-black tracking-wider uppercase"
      >
        {{ art.title || "TITLE" }}
      </h2>
      <span
        v-if="art.timestamp"
        class="text-[12px] leading-loose bg-black font-mono"
      >
        {{ art.timestamp || "LOG_DATA" }}
      </span>
      <!-- Tags -->
      <!-- <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in art.tags"
          :key="tag"
          class="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 text-[9px] uppercase rounded border border-zinc-700/50"
        >
          #{{ tag }}
        </span>
      </div> -->
      <!-- Link Externo -->
      <a
        v-if="art.externalLink"
        :href="art.externalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="text-main-a hover:underline text-[10px] font-bold flex items-center gap-1 ml-2"
      >
        LINK ↗
      </a>
    </footer>
  </article>
</template>
