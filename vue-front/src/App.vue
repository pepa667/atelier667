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
const DecorativeCard = defineAsyncComponent(
  () => import("./components/DecorativeCard.vue"),
);
// Componente inline simples para renderizar o card decorativo no mapeamento

const DECORATIVE_CARDS = [
  {
    _id: "dec-1",
    _type: "decorativo",
    title: "GLITCH_MODULE",
    flexStyle: "grow-1 basis-auto sm:basis-[180px]",
  },
  {
    _id: "dec-2",
    _type: "decorativo",
    title: "SYS_STATUS_OK",
    flexStyle: "grow-1 basis-auto sm:basis-[180px]",
  },
  {
    _id: "dec-3",
    _type: "decorativo",
    title: "SYSTEM_OVERRIDE",
    flexStyle: "grow-1 basis-auto sm:basis-[200px]",
  },
];

// Mapeamento dinâmico de componentes
const componentMap = {
  drop: Drops,
  projeto: Projects,
  documento: Wiki,
  artboard: ArtBoard,
  decorativo: DecorativeCard,
};

const projetos = ref([]);
const drops = ref([]);
const documentos = ref([]);
const posts = ref([]);

// COMPUTED: Unifica o feed, ordena e intercala cards decorativos
const feedUnificado = computed(() => {
  const listDrops = drops.value.map((item) => ({
    ...item,
    _type: "drop",
    flexStyle:
      "grow-1 basis-auto sm:basis-[220px] transition-[flex-basis] duration-500 hover:flex-grow-50",
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
    flexStyle: "flex-grow-[1.5] basis-auto sm:basis-[360px]",
    date: new Date(item._updatedAt || item.timestamp || 0),
  }));

  const listPosts = posts.value.map((item) => ({
    ...item,
    _type: "artboard",
    flexStyle:
      "flex-grow-[2] flex-shrink-0 basis-auto sm:basis-[390px] self-stretch",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  // Lista pura ordenada por data
  const sortedFeed = [
    ...listDrops,
    ...listProjects,
    ...listWiki,
    ...listPosts,
  ].sort((a, b) => b.date - a.date);

  if (!sortedFeed.length) return [];

  // Intercala um card decorativo a cada N itens reais
  const result = [];
  let decIndex = 0;

  sortedFeed.forEach((item, index) => {
    result.push(item);

    // Insere a cada 3 itens se ainda houver decorativos na fila
    if ((index + 1) % 4 === 0 && decIndex < DECORATIVE_CARDS.length) {
      result.push(DECORATIVE_CARDS[decIndex]);
      decIndex++;
    }
  });

  return result;
});

// Temas

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
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-4 sm:p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 FLEX JUSTIFICADO -->
      <ol
        class="cards-list @container relative flex [flex-wrap:balance] items-stretch gap-y-18 w-full [&>li>*]:pop_04 columns-1 sm:columns-2 lg:columns-7 gap-4 space-y-4"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'card-item flex flex-col relative rounded-md min-h-45 group transition-[transform,flex-grow]  duration-700',
            item.flexStyle,
            {
              'card-projeto': item._type === 'projeto',
              'card-drop': item._type === 'drop',
              'card-artboard': item._type === 'artboard',
              'card-documento': item._type === 'documento',
              'card-deco': item._type === 'decorativo',
            },
          ]"
        >
          <!-- Wrapper com flex-col repassa h-full / flex-1 pro componente renderizado -->
          <div class="relative inset-0 w-full h-auto flex flex-col flex-1">
            <div
              class="absolute overflow-hidden inset-0 w-full h-full drop-shadow-[5px_1px_0_var(--color-main-b)] opacity-5 transition-opacity duration-100 group-hover:opacity-40 group-hover:duration-5000"
            >
              <div
                class="relative w-full h-full pcx-grunge-full bg-[color-mix(in_srgb,var(--color-main-a)_75%,var(--color-black))] group-hover:animate-cardGlich"
              ></div>
            </div>

            <component
              :is="componentMap[item._type]"
              v-bind="
                item._type === 'drop'
                  ? { drops: [item] }
                  : item._type === 'projeto'
                    ? { projetos: [item] }
                    : item._type === 'documento'
                      ? { documentos: [item] }
                      : item._type === 'artboard'
                        ? { posts: [item] }
                        : item._type === 'decorativo'
                          ? { decos: [item] }
                          : {}
              "
              class="h-auto w-full flex-1"
            />
          </div>

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
