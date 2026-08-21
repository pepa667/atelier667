<script setup>
import { computed } from "vue";
import { createImageUrlBuilder } from "@sanity/image-url"; // 🎯 Troca para a named export
import { sanityClient } from "../sanity.js";
import GlitchTitle from "./GlitchTitle.vue";

const props = defineProps({
  projetos: {
    type: Array,
    default: () => [],
  },
});

const projeto = computed(() => props.projetos[0] || null);

// 🚀 Inicializa usando createImageUrlBuilder
const builder = createImageUrlBuilder(sanityClient);

const urlFor = (source) => {
  return source ? builder.image(source).auto("format").fit("max").url() : "";
};

// Lógica pura de JS pra gerar a barra [████░░]
const getAsciiBar = (percent) => {
  const safePercent = percent || 0;
  const maxBars = 10;
  const filled = Math.round((safePercent / 100) * maxBars);
  const empty = maxBars - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${safePercent}%`;
};
</script>

<template>
  <section class="relative w-full h-full">
    <GlitchTitle>// PROJETOS_ATIVOS</GlitchTitle>
    <div class="flex flex-col gap-4">
      <article
        v-for="proj in projetos"
        :key="proj.title_pt"
        class="p-6 relative overflow-hidden h-full flex flex-col justify-between"
      >
        <header class="mb-4">
          <h3 class="text-xl font-bold text-zinc-100 uppercase">
            {{ proj.title_pt }}
          </h3>
          <p class="text-zinc-500 text-sm font-mono mt-1">
            STATUS:
            <span class="text-white"
              >&lt;{{ proj.status || "STANDBY" }}&sol;&gt;</span
            >
          </p>
        </header>
        <!-- Barra Renderizada -->
        <div class="font-mono text-green-500 mb-6">
          {{ getAsciiBar(proj.progresso) }}
        </div>
        <!-- Categorias -->
        <div
          class="ml-2 w-11/12 overflow-hidden self-baseline py-4 mask-marquee"
        >
          <ul
            v-if="proj.categorias && proj.categorias.length"
            class="flex flex-row whitespace-nowrap list-none animate-marquee w-max uppercase tracking-wider font-light"
          >
            <li
              v-for="cat in proj.categorias"
              :key="cat"
              class="text-xs bg-main-b/10 text-main-b mx-2 my-1 py-2 px-3 border rounded border-main-b inline-block"
            >
              #{{ cat }}
            </li>
            <li
              v-for="(cat, idx) in proj.categorias"
              :key="`dup-${idx}`"
              class="text-xs bg-main-b/10 text-main-b mx-2 my-1 py-2 px-3 border rounded border-main-b inline-block"
            >
              #{{ cat }}
            </li>
          </ul>
        </div>
        <div
          class="relative flex-1 w-full aspect-video my-2 bg-zinc-900/60 border border-zinc-800/80 rounded overflow-hidden group flex items-center justify-center"
        >
          <!-- Renderiza a primeira imagem do carrossel do Sanity -->
          <img
            v-if="proj.images && proj.images.length > 0"
            :src="urlFor(proj.images[0])"
            :alt="proj.title"
            class="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </article>
    </div>
  </section>
</template>
