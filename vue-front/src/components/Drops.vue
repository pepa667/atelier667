<script setup>
import { ref } from "vue";

defineProps({
  drops: {
    type: Array,
    default: () => [],
  },
});

// O estado que controla qual drop está aberto
const dropAberto = ref(null);

const abrirDrop = (drop) => {
  dropAberto.value = drop;
};

const fecharDrop = () => {
  dropAberto.value = null;
};
</script>

<template>
  <section class="relative">
    <h2 class="text-2xl font-bold text-zinc-500 mb-4">// DROPS_LOG</h2>

    <!-- Grid de Drops -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="drop in drops"
        :key="drop._id"
        @click="abrirDrop(drop)"
        class="cursor-pointer border border-zinc-800 p-4 hover:bg-zinc-800 transition-colors"
      >
        <span class="text-xs text-zinc-500 block mb-2">{{
          drop.publishedAt || "LOG_DATA"
        }}</span>
        <h3 class="text-lg font-bold text-zinc-200">{{ drop.title }}</h3>
      </div>
    </div>

    <!-- Modal FullView do Drop Aberto -->
    <div
      v-if="dropAberto"
      class="absolute top-0 left-0 w-full h-full min-h-screen bg-zinc-950 z-50 p-8 border border-zinc-800"
    >
      <button
        @click="fecharDrop"
        class="text-zinc-500 hover:text-white font-mono text-sm mb-8 uppercase border border-zinc-800 px-4 py-2"
      >
        [X] Fechar Log
      </button>

      <article class="max-w-2xl">
        <h2 class="text-4xl font-bold text-white mb-6">
          {{ dropAberto.title }}
        </h2>
        <div class="prose prose-invert text-zinc-400">
          <p>O bagulho do Portable Text vem aqui depois...</p>
        </div>
      </article>
    </div>
  </section>
</template>
