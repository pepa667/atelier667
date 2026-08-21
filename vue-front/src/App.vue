<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";

// Componentes estáticos
document.getElementById("app")?.classList.add("before:pcx-grunge-lite");

import Header from "./components/Header.vue";
import SideScroller from "./components/SideScroller.vue";
import GlitchWrapper from "./components/GlitchWrapper.vue";

import applyRandomMaskPositions from "./utils/maskRandomizer.js";

// Lazy loading
const Drops = defineAsyncComponent(() => import("./components/Drops.vue"));
const Projects = defineAsyncComponent(
  () => import("./components/Projects.vue"),
);
const Wiki = defineAsyncComponent(() => import("./components/Wiki.vue"));
const ArtBoard = defineAsyncComponent(
  () => import("./components/ArtBoard.vue"),
);
const GlitchTitle = defineAsyncComponent(
  () => import("./components/GlitchTitle.vue"),
);

// Mapeamento dinâmico de componentes para eliminar v-if/v-else-if
const componentMap = {
  drop: Drops,
  projeto: Projects,
  documento: Wiki,
  artboard: ArtBoard,
};

const projetos = ref([]);
const drops = ref([]);
const documentos = ref([]);
const posts = ref([]);

// COMPUTED: Usa flex-grow e min-widths proporcionais para cobrir 100% da tela
const feedUnificado = computed(() => {
  const listDrops = drops.value.map((item) => ({
    ...item,
    _type: "drop",
    flexStyle: "min-w-[220px] flex-grow flex-shrink-0 basis-[220px]",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listWiki = documentos.value.map((item) => ({
    ...item,
    _type: "documento",
    flexStyle: "min-w-[260px] flex-grow flex-shrink-0 basis-[260px]",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listProjects = projetos.value.map((item) => ({
    ...item,
    _type: "projeto",
    flexStyle: "min-w-[360px] flex-grow-[1.5] flex-shrink-0 basis-[360px]",
    date: new Date(item._updatedAt || item.timestamp || 0),
  }));

  const listPosts = posts.value.map((item) => ({
    ...item,
    _type: "artboard",
    // Base mais larga e min-h dobrado pra ocupar 2 linhas
    flexStyle:
      "min-w-[420px] flex-grow-[2] flex-shrink-0 basis-[420px] self-stretch",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  return [...listDrops, ...listProjects, ...listWiki, ...listPosts].sort(
    (a, b) => b.date - a.date,
  );
});

// Temas
const setupRandomTheme = () => {
  const originalHues = [74, 330, 186, 43];
  const filterMap = {
    74: "brightness(0) saturate(100%) invert(86%) sepia(97%) saturate(447%) hue-rotate(22deg) brightness(105%) contrast(121%)",
    330: "brightness(0) saturate(100%) invert(16%) sepia(81%) saturate(5968%) hue-rotate(322deg) brightness(99%) contrast(110%)",
    186: "brightness(0) saturate(100%) invert(73%) sepia(50%) saturate(3689%) hue-rotate(143deg) brightness(102%) contrast(112%)",
    43: "brightness(0) saturate(100%) invert(72%) sepia(87%) saturate(527%) hue-rotate(340deg) brightness(105%) contrast(97%)",
  };

  const shuffledHues = [...originalHues].sort(() => Math.random() - 0.5);
  const root = document.documentElement;

  shuffledHues.forEach((hue, index) => {
    root.style.setProperty(`--hue-rotate-${index + 1}`, `${hue}deg`);
    const filterValue = filterMap[hue];
    if (filterValue) {
      root.style.setProperty(`--img-hue-${index + 1}`, filterValue);
    }
  });
};

// Reage a atualizações no feed re-injetando as variáveis CSS das máscaras
watch(
  () => feedUnificado.value,
  async () => {
    await nextTick();
    applyRandomMaskPositions();
  },
  { deep: true, immediate: true },
);

onMounted(async () => {
  setupRandomTheme();

  try {
    const { sanityClient } = await import("./sanity.js");
    const data = await sanityClient.fetch(`{
      "projetos": *[_type == "projeto"],
      "drops": *[_type == "drop"] | order(timestamp desc),
      "wiki": *[_type == "documento"] | order(timestamp desc),
      "artboard": *[_type == "artboard"] | order(timestamp desc)
    }`);

    projetos.value = data.projetos || [];
    drops.value = data.drops || [];
    documentos.value = data.wiki || [];
    posts.value = data.artboard || [];
  } catch (error) {
    console.error("Erro ao buscar dados do Sanity:", error);
  }
});
</script>

<template>
  <div
    class="md:min-w-3xl relative max-w-[1920px] text-zinc-100 font-mono mx-auto flex flex-row justify-between"
  >
    <div
      class="absolute w-full left-0 top-0 h-full backdrop-blur-xl -z-100"
    ></div>
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 FLEX JUSTIFICADO -->
      <ol
        class="cards-list relative flex flex-wrap items-stretch gap-6 w-full [&>li>*]:pop_04"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'flex flex-col relative rounded-md min-h-45',
            item.flexStyle,
            {
              'card-projeto': item._type === 'projeto',
              'card-drop': item._type === 'drop',
              'card-artboard': item._type === 'artboard',
              'card-documento': item._type === 'documento',
            },
          ]"
        >
          <div
            class="card-bg absolute inset-0 w-full h-full pcx-grunge-lite mask-[800px_auto] -z-10"
          ></div>

          <!-- Glitch isolado apenas nos layers de fundo -->
          <GlitchWrapper>
            <div class="card-glitch-1 pcx-grunge-full rounded-md"></div>
            <div class="card-glitch-2 pcx-grunge-md rounded-md"></div>
          </GlitchWrapper>

          <span
            class="deco-tr absolute w-25 h-25 border-r-4 border-t-4 -top-0.5 -right-0.5 pcx-tr mask-[auto_200px] [--mask-pos:bottom_left] rounded-md"
            >&nbsp;</span
          >
          <span
            class="deco-bl absolute w-25 h-25 border-l-4 border-b-4 -bottom-0.5 -left-0.5 pcx-bl mask-[auto_200px] [--mask-pos:top_right] rounded-md"
            >&nbsp;</span
          >

          <!-- Wrapper com flex-col repassa h-full / flex-1 pro componente renderizado -->
          <div class="relative inset-0 w-full h-full flex flex-col flex-1">
            <component
              :is="componentMap[item._type]"
              :drops="item._type === 'drop' ? [item] : undefined"
              :projetos="item._type === 'projeto' ? [item] : undefined"
              :documentos="item._type === 'documento' ? [item] : undefined"
              :posts="item._type === 'artboard' ? [item] : undefined"
              class="h-full w-full flex-1"
            />
          </div>
        </li>
      </ol>
    </main>
  </div>

  <footer
    class="relative w-svw h-56 [&_.glitch-overlay]:bg-black [&_.glitch-overlay]:shadow-[inset_0.2em_1rem_var(--color-main-a)]"
  >
    <GlitchWrapper :trigger-probability="1">
      <div
        class="absolute opacity-50 text-2xl font-bold text-main-b w-svw h-56 bg-[url(assets/images/textures/dither-bt.gif)] pop_02 pcx-grunge-full mask-cover"
      >
        :::
      </div>
    </GlitchWrapper>
  </footer>
</template>
