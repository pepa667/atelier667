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

// Substitua o onMounted do seu App.vue por este aqui:

onMounted(async () => {
  try {
    const data = await sanityClient.fetch(`{
      "projetos": *[_type == "projeto"],
      "drops": *[_type == "drop"] | order(timestamp desc),
      "wiki": *[_type == "documento"] | order(timestamp desc),
      "artboard": *[_type == "artboard"] | order(timestamp desc)
    }`);

    projetos.value = data.projetos;
    drops.value = data.drops;
    documentos.value = data.wiki;
    posts.value = data.artboard;
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
});
</script>

<template>
  <!-- O flex aqui separa a barra lateral do resto do conteúdo -->
  <div
    class="md:min-w-3xl : md:max-w-7xl bg-amber-800 text-zinc-100 font-mono mx-auto flex flex-row justify-between"
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
