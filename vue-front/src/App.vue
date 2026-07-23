<script setup>
import { ref, onMounted } from "vue";
import { sanityClient } from "./sanity.js";
import Header from "./components/Header.vue";
import Drops from "./components/Drops.vue";
import Projects from "./components/Projects.vue";
import Wiki from "./components/Wiki.vue";
import ArtBoard from "./components/ArtBoard.vue";
import SideScroller from "./components/SideScroller.vue";

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
};

onMounted(async () => {
  // 1. Executa a lógica de cores assim que o componente entra na tela
  setupRandomTheme();

  // 2. Busca os dados no Sanity
  try {
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
  <!-- O flex aqui separa a barra lateral do resto do conteúdo -->
  <div
    class="md:min-w-3xl : md:max-w-7xl bg-zinc-950/75 text-zinc-100 font-mono mx-auto flex flex-row justify-between"
  >
    <!-- Sua barra decorativa colada na esquerda -->
    <SideScroller />

    <!-- O resto do site respira aqui do lado direito -->
    <main class="flex-1 p-8 overflow-x-hidden">
      <Header class="mb-12" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Drops :drops="drops" />
        <Projects :projetos="projetos" />
      </div>
      Táporra!!!
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <Wiki :documentos="documentos" />
        <ArtBoard :posts="posts" />
      </div>
    </main>
  </div>
</template>
