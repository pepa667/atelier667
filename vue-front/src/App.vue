<script setup>
import { ref, onMounted, defineAsyncComponent } from "vue";

// Componentes críticos e pequenos permanecem síncronos
import Header from "./components/Header.vue";
import SideScroller from "./components/SideScroller.vue";

// 🚀 LAZY LOADING: Componentes divididos em chunks separados
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

// Mapeamento e sorteio das cores/filtros dinâmicos
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

  // Otimização de timers usando requestIdleCallback para não brigar com o FCP do Lighthouse
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => triggerGlitches());
  } else {
    setTimeout(triggerGlitches, 1000);
  }
};

const triggerGlitches = () => {
  const glitch = document.querySelectorAll(".glitch");
  glitch.forEach((el) => {
    const getRandomMs = (min = 1000, max = 5000) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    el.classList.remove("glitchPlay");
    const randomDelay = getRandomMs();
    setTimeout(() => {
      el.classList.add("glitchPlay");
    }, randomDelay);
  });
};

onMounted(async () => {
  // 1. Executa a lógica de cores assim que o componente entra na tela
  setupRandomTheme();

  // 2. Busca os dados no Sanity com import dinâmico (não infla o index.js inicial)
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
    class="md:min-w-3xl relative md:max-w-7xl bg-zinc-950/40 text-zinc-100 font-mono mx-auto flex flex-row justify-between"
  >
    <div class="absolute w-full left-0 top-0 h-full backdrop-blur-xl"></div>
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,8rem)] flex-1 p-8 overflow-x-hidden"
    >
      <Header class="mb-12" />
      <ArtBoard :posts="posts" class="absolute right-4 top-2" />

      <div
        class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 [&>section>*]:pop_04"
      >
        <Drops :drops="drops" />
        <Projects :projetos="projetos" />
        <Wiki :documentos="documentos" />
      </div>
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
