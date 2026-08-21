<script setup>
import { computed, ref } from "vue";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "../sanity.js";
import GlitchTitle from "./GlitchTitle.vue";

const props = defineProps({
  projetos: {
    type: Array,
    default: () => [],
  },
});

const builder = createImageUrlBuilder(sanityClient);

const urlFor = (source) => {
  return source ? builder.image(source).auto("format").fit("max").url() : "";
};

const getAsciiBar = (percent) => {
  const safePercent = percent || 0;
  const maxBars = 10;
  const filled = Math.round((safePercent / 100) * maxBars);
  const empty = maxBars - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${safePercent}%`;
};

/* 🎯 Medição via Elemento Fantasma sem interferência da imagem */
const aspectMap = ref({});

const vAspect = {
  mounted(el, binding) {
    const key = binding.value;

    const observer = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;

          if (width === 0 || height === 0) return;

          // Se a altura for maior ou igual à largura, consideramos Portrait
          aspectMap.value[key] = {
            isPortrait: height >= width,
            ready: true,
          };
        }
      });
    });

    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    if (el._observer) el._observer.disconnect();
  },
};
</script>

<template>
  <!-- Wrapper único para herdar a classe 'class' do App.vue e matar o aviso Extraneous non-props -->
  <section
    v-for="proj in projetos"
    :key="proj._id || proj.title_pt"
    class="relative w-full h-full z-2 group border border-zinc-800/50 flex flex-col justify-between"
  >
    <!-- 👻 ELEMENTO FANTASMA: 
           Ocupa 100% do espaço do card em absolute (fora do fluxo).
           Não é afetado se a imagem for relative, absolute ou flex. -->
    <div
      v-aspect="proj._id || proj.title_pt"
      class="absolute inset-0 w-full h-full pointer-events-none -z-50 visibility-hidden"
    ></div>

    <GlitchTitle class="size-fit">// PROJETOS_ATIVOS</GlitchTitle>

    <!-- Bloco Conteúdo Textual -->
    <article
      class="p-4 relative overflow-hidden h-full flex flex-col justify-between"
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
      <div class="ml-2 w-11/12 overflow-hidden self-baseline py-4 mask-marquee">
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
        v-if="proj.coverImage"
        class="overflow-visible transition-all duration-300 -z-10"
        :class="[
          aspectMap[proj._id || proj.title_pt]?.ready
            ? 'opacity-100'
            : 'opacity-0',
          aspectMap[proj._id || proj.title_pt]?.isPortrait
            ? 'relative w-full mt-4 aspect-3/1 '
            : 'absolute top-0 right-0 h-full w-1/2',
        ]"
      >
        <img
          :src="urlFor(proj.coverImage)"
          :alt="proj.coverImage?.alt || proj.title_pt"
          :class="[
            aspectMap[proj._id || proj.title_pt]?.isPortrait
              ? 'w-full h-auto top-0 group-hover:-translate-y-1/3'
              : ' h-full max-w-prose left-0 group-hover:-left-full  object-left',
          ]"
          class="absolute object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-50 group-hover:blur-xs"
        />
      </div>
    </article>

    <!-- 🖼️ Imagem posicionada de acordo com o cálculo do Fantasma -->
  </section>
</template>
