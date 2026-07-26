<script setup>
import GlitchTitle from "./GlitchTitle.vue";

defineProps({
  projetos: {
    type: Array,
    default: () => [],
  },
});

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
  <section>
    <GlitchTitle>// PROJETOS_ATIVOS</GlitchTitle>
    <div class="flex flex-col gap-4">
      <article
        v-for="proj in projetos"
        :key="proj.title_pt"
        class="border border-zinc-800 p-6 bg-zinc-900/30 relative overflow-hidden"
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
              class="text-xs bg-second/10 text-second mx-2 my-1 py-2 px-3 border rounded border-second inline-block"
            >
              #{{ cat }}
            </li>
            <li
              v-for="cat in proj.categorias"
              :key="cat"
              class="text-xs bg-second/10 text-second mx-2 my-1 py-2 px-3 border rounded border-second inline-block"
            >
              #{{ cat }}
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
