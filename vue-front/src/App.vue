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
    flexStyle:
      "min-w-[220px] flex-grow flex-shrink-0 basis-[220px] transition-[flex-grow] duration-500 hover:flex-grow-50",
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
      "min-w-[390px] flex-grow-[1.25] flex-shrink-0 basis-[390px] self-stretch",
    date: new Date(item.timestamp || item._updatedAt || 0),
  }));

  return [...listDrops, ...listProjects, ...listWiki, ...listPosts].sort(
    (a, b) => b.date - a.date,
  );
});

// Temas
const setupRandomTheme = () => {
  const palettes = [
    {
      hue: 327,
      strongHue: 340,
      filter:
        "brightness(0) saturate(100%) invert(16%) sepia(81%) saturate(5968%) hue-rotate(322deg) brightness(99%) contrast(110%)",
    },
    {
      hue: 186,
      strongHue: 200,
      filter:
        "brightness(0) saturate(100%) invert(73%) sepia(50%) saturate(3689%) hue-rotate(143deg) brightness(102%) contrast(112%)",
    },
    {
      hue: 81,
      strongHue: 120,
      filter:
        "brightness(0) saturate(100%) invert(86%) sepia(97%) saturate(447%) hue-rotate(22deg) brightness(105%) contrast(121%)",
    },
    {
      hue: 46,
      strongHue: 28,
      filter:
        "brightness(0) saturate(100%) invert(72%) sepia(87%) saturate(527%) hue-rotate(340deg) brightness(105%) contrast(97%)",
    },
  ];

  // Fisher-Yates: embaralhamento uniforme
  for (let i = palettes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [palettes[i], palettes[j]] = [palettes[j], palettes[i]];
  }

  const root = document.documentElement;

  palettes.forEach(({ hue, strongHue, filter }, index) => {
    const position = index + 1;

    root.style.setProperty(`--hue-rotate-${position}`, hue);
    root.style.setProperty(`--hue-rotate-${position}-strong`, strongHue);
    root.style.setProperty(`--img-hue-${position}`, filter);
  });
};

// setupRandomTheme();

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
  // setupRandomTheme();

  try {
    const { sanityClient } = await import("./sanity.js");
    // 🎯 Como DEVE FICAR:
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
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 FLEX JUSTIFICADO -->
      <ol
        class="cards-list relative flex flex-wrap items-stretch gap-6 gap-y-18 w-full [&>li>*]:pop_04"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'card-item flex flex-col relative rounded-md min-h-45 group',
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
            class="card-bg absolute inset-0 w-full h-full pcx-grunge-lite mask-[800px_auto]"
          ></div>

          <!-- Wrapper com flex-col repassa h-full / flex-1 pro componente renderizado -->
          <div class="relative inset-0 w-full h-full flex flex-col flex-1">
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
                        : {}
              "
              class="h-full w-full flex-1"
            />
          </div>

          <!-- Glitch isolado apenas nos layers de fundo -->

          <span
            class="deco-tr pointer-events-none absolute w-2/3 h-4/7 border-r-4 border-t-4 -top-0.5 -right-0.5 pcx-tr [--mask-pos:10px_-10px] mask-size-[100%_100%] mask-no-repeat rounded-md"
            >&nbsp;</span
          >
          <span
            class="deco-bl pointer-events-none absolute w-2/5 h-7/12 border-l-4 border-b-4 -bottom-0.5 -left-0.5 pcx-bl [--mask-pos:-10px_10px] mask-size-[100%_100%] mask-no-repeat rounded-md"
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
