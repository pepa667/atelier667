<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  nextTick,
  defineAsyncComponent,
} from "vue";

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
const BumpCard = defineAsyncComponent(
  () => import("./components/BumpCard.vue"),
);
// Componente inline simples para renderizar o card decorativo no mapeamento

const bump_card = [
  {
    _id: "bump-card",
    _type: "bump",
    title: "GLITCH_MODULE",
    flexStyle:
      "grow-1 basis-auto sm:basis-[88px] bg-rose border-8 border-main-c-strong",
  },
];

// Mapeamento dinâmico de componentes
const componentMap = {
  drop: Drops,
  projeto: Projects,
  documento: Wiki,
  artboard: ArtBoard,
  bump: BumpCard,
};

const projetos = ref([]);
const drops = ref([]);
const documentos = ref([]);
const arts = ref([]);

// COMPUTED: Unifica o feed, ordena e intercala cards decorativos
const feedUnificado = computed(() => {
  const listDrops = drops.value.map((item) => ({
    ...item,
    _type: "drop",
    flexStyle: "grow-1 sm:basis-[220px] hover:flex-grow-50 ",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listWiki = documentos.value.map((item) => ({
    ...item,
    _type: "documento",
    flexStyle: "grow-1 flex-shrink-0 basis-auto sm:basis-[260px]",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  const listProjects = projetos.value.map((item) => ({
    ...item,
    _type: "projeto",
    flexStyle: "flex-grow-[1.7] basis-auto sm:basis-[390px]",
    date: new Date(item._updatedAt || item.timestamp || 0),
  }));

  const listArts = arts.value.map((item) => ({
    ...item,
    _type: "artboard",
    flexStyle: "flex-grow-[1.5] basis-auto sm:basis-[320px] ",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  // Lista pura ordenada por data
  const sortedFeed = [
    ...listDrops,
    ...listProjects,
    ...listWiki,
    ...listArts,
  ].sort((a, b) => b.date - a.date);

  if (!sortedFeed.length) return [];

  // Intercala um card decorativo a cada N itens reais
  const result = [];
  let decIndex = 0;

  sortedFeed.forEach((item, index) => {
    result.push(item);
    const iconInterval = Math.floor(Math.random() * 3) + 2;

    // Insere a cada 3 itens se ainda houver decorativos na fila
    if ((index + 1) % iconInterval === 0) {
      result.push(bump_card[0]);
    }
  });

  return result;
});

// Temas
// Função que gerencia o estado do "touch-hover"

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
  // Execuções com dependência direta do DOM
  document.getElementById("app")?.classList.add("before:pcx-grunge-lite");

  try {
    const { sanityClient } = await import("./sanity.js");
    const data = await sanityClient.fetch(`{
      "projetos": *[_type == "projeto"],
      "drops": *[_type == "drop"] | order(timestamp desc),
      "wiki": *[_type == "documento"] | order(timestamp desc),
      "artboard": *[_type == "artboard"]{
        ...,
        "images": images[]{
          ...,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
          }
          } | order(timestamp desc)
          }`);
    projetos.value = data.projetos || [];
    drops.value = data.drops || [];
    documentos.value = data.wiki || [];
    arts.value = data.artboard || [];
  } catch (error) {
    console.error("Erro ao buscar dados do Sanity:", error);
  }
});
</script>

<template>
  <div
    class="md:min-w-3xl relative max-w-[1920px] text-zinc-100 font-mono mx-auto flex flex-row justify-between"
  >
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-4 sm:p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 FLEX JUSTIFICADO -->
      <ol
        class="cards-list @container relative flex [flex-wrap:balance] items-stretch w-full gap-8 space-y-4 self-stretch"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'card-item  flex flex-col shrink-0  relative grow group lg:max-w-4/12 transition-[transform,flex-grow] duration-1000 ease-in-out',
            item.flexStyle,
            {
              'card-projeto': item._type === 'projeto',
              'card-drop': item._type === 'drop',
              'card-artboard': item._type === 'artboard',
              'card-documento': item._type === 'documento',
              'card-bump max-h-1/2 self-center items-center':
                item._type === 'bump',
            },
          ]"
        >
          <!-- Wrapper com flex-col repassa h-full / flex-1 pro componente renderizado -->

          <!-- <div class="relative inset-0 w-full h-auto flex flex-col flex-1"> -->
          <component
            v-mobile-observe="{
              activeClass: 'onView',
              hoverClass: 'fake-hover',
              threshold: 0.4,
              rootMargin: '-30% 0px',
            }"
            :is="componentMap[item._type]"
            v-bind="
              item._type === 'drop'
                ? { drops: [item] }
                : item._type === 'projeto'
                  ? { projetos: [item] }
                  : item._type === 'documento'
                    ? { documentos: [item] }
                    : item._type === 'artboard'
                      ? { arts: [item] }
                      : item._type === 'bump'
                        ? { bumps: [item] }
                        : {}
            "
            class="h-auto w-full flex-1"
          />
          <!-- </div> -->

          <!-- Glitch isolado apenas nos layers de fundo -->

          <span
            class="deco-tr pointer-events-none absolute w-2/3 h-4/7 border-r-4 border-t-4 -top-0.5 -right-0.5 pcx-tr [--mask-pos:10px_-10px] mask-size-[100%_100%] mask-no-repeat rounded-md border-main-a"
            >&nbsp;</span
          >
          <span
            class="deco-tr pointer-events-none absolute w-1/9 h-1/9 border-r-4 border-t-4 -top-0.5 -right-0.5 border-main-c-strong mask-[linear-gradient(to_bottom_left,#000a,#0000)] mix-blend-color"
            >&nbsp;</span
          >
          <span
            class="deco-bl pointer-events-none absolute w-2/5 h-7/12 border-l-4 border-b-4 -bottom-0.5 -left-0.5 pcx-bl [--mask-pos:-10px_10px] mask-size-[100%_100%] mask-no-repeat rounded-md border-main-a"
            >&nbsp;</span
          >
          <span
            class="deco-bl pointer-events-none absolute w-1/9 h-1/9 border-l-4 border-b-4 -bottom-0.5 -left-0.5 border-main-c-strong mask-[linear-gradient(to_top_right,#000,#0000)] mix-blend-color"
            >&nbsp;</span
          >
        </li>
      </ol>
    </main>
  </div>

  <footer class="absolute w-full h-56 bottom-0">
    <GlitchWrapper :trigger-probability="1">
      <div class="absolute inset-0 pcx-bt bg-pink-700 pop_d">:::</div>
    </GlitchWrapper>
  </footer>
</template>
