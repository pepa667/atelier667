<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

// Monta o caminho da imagem baseado no nome passado (ex: 'hardware')
// Nota: Depois você precisa copiar a pasta 'assets' do Astro pro Vue!
const iconSrc = computed(
  () =>
    new URL(`../assets/images/icons/${props.name}.png`, import.meta.url).href,
);
</script>

<template>
  <img
    :src="iconSrc"
    :alt="`Ícone de ${name}`"
    class="w-8 h-8 rendering-pixelated"
  />
</template>
