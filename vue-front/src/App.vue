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

const projetos = ref([]);
const drops = ref([]);
const documentos = ref([]);
const posts = ref([]);

const feedUnificado = computed(() => {
  const listDrops = drops.value.map((item) => ({
    ...item,
    _type: "drop",
    gridSpan: "col-span-1 row-span-1",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listWiki = documentos.value.map((item) => ({
    ...item,
    _type: "documento",
    gridSpan: "col-span-1 row-span-1",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listProjects = projetos.value.map((item) => ({
    ...item,
    _type: "projeto",
    gridSpan: "col-span-1 sm:col-span-2 row-span-1",
    date: new Date(item._updatedAt || item.timestamp || 0),
  }));

  const listPosts = posts.value.map((item) => ({
    ...item,
    _type: "artboard",
    gridSpan: "col-span-1 sm:col-span-2 row-span-2",
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
  applyRandomMaskPositions();

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
      class="absolute w-full left-0 top-0 h-full backdrop-blur-xl bg-main-c-dark/7 pcx-grunge-full"
    ></div>
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 GRID DENSE -->
      <ol
        class="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 auto-rows-[minmax(180px,auto)] grid-flow-dense gap-12 w-full [&>li>*]:pop_04"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'flex flex-col h-full w-full relative',
            item.gridSpan,
            {
              'card-projeto': item._type === 'projeto',
              'card-drop': item._type === 'drop',
              'card-artboard': item._type === 'artboard',
              'card-documento': item._type === 'documento',
            },
          ]"
        >
          <div
            class="card-bg absolute inset-0 w-full h-full pcx-grunge-full"
          ></div>
          <!-- Glitch isolado apenas nos layers de fundo -->
          <GlitchWrapper>
            <div class="card-glitch-1 pcx-grunge-full"></div>
            <div class="card-glitch-2 pcx-grunge-md"></div>
          </GlitchWrapper>

          <span
            class="deco-tr absolute w-25 h-25 border-r-4 border-t-4 -top-0.5 -right-0.5 pcx-tr mask-[auto_200%] [--mask-pos:bottom_left]"
            >&nbsp;</span
          >
          <span
            class="deco-bl absolute w-25 h-25 border-l-4 border-b-4 -bottom-0.5 -left-0.5 pcx-bl mask-[auto_200%] [--mask-pos:top_right]"
            >&nbsp;</span
          >
          <div class="relative inset-0 w-full h-full">
            <Drops
              v-if="item._type === 'drop'"
              :drops="[item]"
              class="h-full flex-1"
            />
            <Projects
              v-else-if="item._type === 'projeto'"
              :projetos="[item]"
              class="h-full flex-1"
            />
            <Wiki
              v-else-if="item._type === 'documento'"
              :documentos="[item]"
              class="h-full flex-1"
            />
            <ArtBoard
              v-else-if="item._type === 'artboard'"
              :posts="[item]"
              class="h-full flex-1"
            />
          </div>
        </li>
      </ol>
    </main>
  </div>

  <GlitchTitle
    tag-glitch="footer"
    class="relative *:w-svw *:h-56 [&_.glitch-overlay]:bg-black [&_.glitch-overlay]:shadow-[inset_0.2em_1rem_var(--color-main-a)]"
  >
    <div
      class="absolute opacity-50 text-2xl font-bold text-main-b w-svw h-56 bg-[url(assets/images/textures/dither-bt.gif)] pop_02 pcx-grunge-full mask-cover"
    >
      :::
    </div>
  </GlitchTitle>
</template>
