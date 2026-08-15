<script setup>
import GlitchTitle from "./GlitchTitle.vue";

import { ref, watch, nextTick } from "vue";

defineProps({
  drops: {
    type: Array,
    default: () => [],
  },
});

const dropAberto = ref(null); // Guarda o dado do drop
const isFechando = ref(false); // Controla a classe da animação de saída
const closeBtn = ref(null);

// Quando abrir, foca o botão de fechar para acessibilidade
watch(dropAberto, async (val) => {
  if (val) {
    await nextTick();
    if (closeBtn.value && typeof closeBtn.value.focus === "function") {
      closeBtn.value.focus();
    }
  }
});

const abrirDrop = (drop) => {
  dropAberto.value = drop;
  isFechando.value = true;
  setTimeout(() => {
    isFechando.value = false;
  }, 50);
};

const fecharDrop = () => {
  isFechando.value = true; // Ativa a animação de saída

  setTimeout(() => {
    dropAberto.value = null;
    isFechando.value = false;
  }, 750);
};
</script>

<template>
  <!-- Modal FullView do Drop Aberto -->
  <section class="relative">
    <div
      v-if="dropAberto"
      role="dialog"
      aria-modal="true"
      :aria-label="`Detalhes do drop ${dropAberto?.title || ''}`"
      class="absolute col-span-full top-0 left-0 w-full h-auto transition-all duration-1000 opacity-0 scale-50 bg-zinc-950 z-50 p-8 border border-zinc-800"
      :class="
        !isFechando
          ? 'top-20 scale-100 opacity-100'
          : 'top-0 opacity-0 scale-50'
      "
    >
      <!-- 'opacity-100 scale-100': !isFechando, -->
      <button
        ref="closeBtn"
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
          <p>
            {{ dropAberto.content }}
          </p>
        </div>
      </article>
    </div>
    <GlitchTitle>// DROPS_LOG</GlitchTitle>
    <!-- Grid de Drops -->
    <div class="flex flex-col gap-4">
      <article
        v-for="drop in drops"
        :key="drop._id"
        @click="abrirDrop(drop)"
        class="cursor-pointer border border-zinc-800 p-4 hover:bg-zinc-800 transition-colors"
      >
        <span class="text-xs text-zinc-500 block mb-2">{{
          drop.timestamp || "LOG_DATA"
        }}</span>
        <h3 class="text-lg font-bold text-zinc-200">{{ drop.title }}</h3>
      </article>
    </div>
  </section>
</template>
