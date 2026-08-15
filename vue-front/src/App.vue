<script setup>
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  watch,
  defineAsyncComponent,
} from "vue";

// Componentes estáticos
import Header from "./components/Header.vue";
import SideScroller from "./components/SideScroller.vue";

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

// 🎯 LÓGICA DE GLITCH & JITTER CORRIGIDA
const activeGlitchId = ref(null);
const currentSeed = ref(1);
const currentFreq = ref(2);
const currentScale = ref(15);
const freqPow = [1, 10, 100, 1000];
const randomDelay = ref(200);

let delayTimeoutId = null;
let durationTimeoutId = null;
let jitterIntervalId = null;
let isGlitchScheduled = false;

const stopJitter = () => {
  if (jitterIntervalId) {
    clearInterval(jitterIntervalId);
    jitterIntervalId = null;
  }
};

const startJitter = () => {
  stopJitter();
  jitterIntervalId = setInterval(() => {
    currentSeed.value = Math.floor(Math.random() * 1000);
    currentScale.value = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    currentFreq.value =
      Math.random() *
      0.001 *
      freqPow[Math.floor(Math.random() * freqPow.length)];
    randomDelay.value = Math.floor(Math.random() * 500);
    console.log(randomDelay.value);
  }, randomDelay.value);
};

const stopGlitch = () => {
  stopJitter();
  activeGlitchId.value = null;
  isGlitchScheduled = false;

  // Limpa o duration timeout se existir
  if (durationTimeoutId) {
    clearTimeout(durationTimeoutId);
    durationTimeoutId = null;
  }

  // Chama o próximo glitch
  triggerGlitch();
};

const triggerGlitch = () => {
  if (isGlitchScheduled || !feedUnificado.value.length) return;

  isGlitchScheduled = true;

  if (delayTimeoutId) clearTimeout(delayTimeoutId);

  // Intervalo aleatório ENTRE glitches (ex: 800ms a 2500ms)
  const delay = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;

  delayTimeoutId = setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * feedUnificado.value.length);
    const selectedItem = feedUnificado.value[randomIndex];

    activeGlitchId.value =
      selectedItem._id || selectedItem.title_pt || selectedItem.title;

    startJitter();

    // Duração do EFEITO ATIVO (ex: 300ms a 600ms de surto)
    const glitchDuration = Math.floor(Math.random() * (2000 - 800 + 1)) + 800;

    durationTimeoutId = setTimeout(() => {
      stopGlitch();
    }, glitchDuration);
  }, delay);
};

// Dispara o glitch assim que os dados chegarem
watch(
  () => feedUnificado.value.length,
  (newLength) => {
    if (newLength > 0 && !activeGlitchId.value && !isGlitchScheduled) {
      triggerGlitch();
    }
  },
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

onUnmounted(() => {
  if (delayTimeoutId) clearTimeout(delayTimeoutId);
  if (durationTimeoutId) clearTimeout(durationTimeoutId);
  stopJitter();
});
</script>

<template>
  <!-- max-w-full ou max-w-[1920px] pra dar espaço para as 6 colunas abrirem sem sufocar -->
  <div
    class="md:min-w-3xl relative max-w-[1920px] bg-zinc-900 text-zinc-100 font-mono mx-auto flex flex-row justify-between"
  >
    <div class="absolute w-full left-0 top-0 h-full backdrop-blur-xl"></div>
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />

      <!-- 🚀 GRID DENSE: Preenche TODOS os buracos automaticamente -->
      <ol
        class="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 auto-rows-[minmax(180px,auto)] grid-flow-dense gap-4 w-full [&>li>*]:pop_04"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'flex flex-col h-full w-full relative glitch-container after:texture before:texture',
            item.gridSpan,
            {
              'container-glitching':
                activeGlitchId === (item._id || item.title_pt || item.title),
            },
          ]"
          @animationend="handleAnimationEnd"
        >
          <span
            class="deco absolute w-3/12 h-3/12 border-r-12 border-t-12 border-third/75 -top-1 -right-1.5 texture"
            >&nbsp;</span
          >
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
        </li>
        <svg style="position: absolute; width: 0; height: 0" aria-hidden="true">
          <defs>
            <filter id="glitch-border">
              <!-- 1. Generate sharp, blocky horizontal rectangles -->
              <feTurbulence
                type="fractalNoise"
                :baseFrequency="`0.0 ${currentFreq}`"
                :seed="currentSeed"
                numOctaves="1"
                result="noise"
              />

              <!-- 2. Keep noise in RED, clear GREEN to neutral mid-gray (0.5), sharpen ALPHA -->
              <feColorMatrix
                type="matrix"
                values="10 0 0 0 -4.5
                0 10 0 0 -4.5
                0 0 10 0 -4.5
                0 0 0 1 0"
                in="noise"
                result="sharp-blocks"
              />

              <!-- 3. Displace horizontally (Red shifts X, Green is 0.5 so it does not shift Y) -->
              <feDisplacementMap
                in="SourceGraphic"
                in2="sharp-blocks"
                :scale="currentScale"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      </ol>
    </main>
  </div>

  <GlitchTitle
    tag-glitch="footer"
    class="relative *:w-svw *:h-56 [&_.glitch-overlay]:bg-black [&_.glitch-overlay]:shadow-[inset_0.2em_1rem_var(--color-primary)]"
  >
    <div
      class="absolute opacity-50 text-2xl font-bold text-second w-svw h-56 bg-[url(assets/images/fadeOut.gif)] pop_02"
    >
      :::
    </div>
  </GlitchTitle>
</template>
