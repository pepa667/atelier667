<script setup>
import GlitchTitle from "./GlitchTitle.vue";
import { marked } from "marked";

defineProps({
  drops: {
    type: Array,
    default: () => [],
  },
});

// Converte a string em Markdown
const renderMarkdown = (text) => {
  if (!text) return "";
  return marked.parse(text);
};
</script>

<template>
  <section class="relative">
    <GlitchTitle>// DROPS_LOG</GlitchTitle>

    <!-- Grid / Lista de Drops -->
    <div class="flex flex-col gap-4">
      <article
        v-for="drop in drops"
        :key="drop._id || drop.title"
        class="border border-zinc-800 p-4 bg-zinc-950/50 hover:border-zinc-700 transition-colors"
      >
        <header class="mb-3">
          <span class="text-xs font-mono text-zinc-500 block mb-1">
            {{ drop.timestamp || "LOG_DATA" }}
          </span>
          <h3 class="text-lg font-bold text-zinc-200 uppercase">
            {{ drop.title }}
          </h3>
        </header>

        <!-- Conteúdo Renderizado como Markdown -->
        <div
          v-if="drop.content"
          class="prose prose-invert prose-zinc max-w-none text-zinc-400 text-sm leading-relaxed"
          v-html="renderMarkdown(drop.content)"
        ></div>
      </article>
    </div>
  </section>
</template>
