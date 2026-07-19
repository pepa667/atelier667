<script setup>
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
  <section class="flex flex-col gap-6">
    <h2 class="text-2xl font-bold text-zinc-500 mb-4">// PROJETOS_ATIVOS</h2>

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
          STATUS: <span class="text-white">{{ proj.status || "STANDBY" }}</span>
        </p>
      </header>

      <!-- Barra Renderizada -->
      <div class="font-mono text-green-500 mb-6">
        {{ getAsciiBar(proj.progresso) }}
      </div>

      <!-- Categorias -->
      <ul
        v-if="proj.categorias && proj.categorias.length"
        class="flex flex-wrap gap-3"
      >
        <li
          v-for="cat in proj.categorias"
          :key="cat"
          class="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 uppercase"
        >
          #{{ cat }}
        </li>
      </ul>
    </article>
  </section>
</template>
