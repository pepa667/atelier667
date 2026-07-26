<script setup>
import { ref, onMounted, computed, useAttrs } from "vue";

// O Vite já resolve essas importações de imagem como URLs prontas
import Maker from "../assets/images/icons/maker.png";
import Deco from "../assets/images/icons/deco.png";
import Code from "../assets/images/icons/code.png";
import Hardware from "../assets/images/icons/hardware.png";
import Machine from "../assets/images/icons/machine.png";
import Punk from "../assets/images/icons/punk.png";
import WoodWorking from "../assets/images/icons/woodworking.png";

const attrs = useAttrs();

const props = defineProps({
  // No Vue, propriedades com letra minúscula são a norma
  icon: {
    type: String,
    default: "Deco",
  },
  size: {
    type: Number,
    default: null,
  },
});

// Normaliza o nome (ex: 'maker' vira 'Maker') pra bater com o mapa
const normalizedIcon = computed(() => {
  const str = props.icon || "Deco";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
});

const iconMap = {
  Maker,
  Deco,
  Code,
  Hardware,
  Machine,
  Punk,
  Woodworking: WoodWorking,
};

const activeIcon = computed(() => iconMap[normalizedIcon.value] || Deco);

const spriteSizes = {
  Code: { x: 4, y: 1 },
  Deco: { x: 4, y: 6 },
  Hardware: { x: 3, y: 2 },
  Machine: { x: 3, y: 2 },
  Maker: { x: 5, y: 2 },
  Punk: { x: 3, y: 2 },
  Woodworking: { x: 4, y: 2 },
};

const currentSize = computed(
  () => spriteSizes[normalizedIcon.value] || spriteSizes.Deco,
);

// Estilo do container
const containerStyle = computed(() => {
  return props.size
    ? { width: `${props.size}px`, height: `${props.size}px` }
    : {};
});

// Variáveis reativas para o offset do sprite
const offsetX = ref(0);
const offsetY = ref(0);

// Estilo da imagem com os cálculos de porcentagem
const imageStyle = computed(() => ({
  width: `${currentSize.value.x * 100}%`,
  height: `${currentSize.value.y * 100}%`,
  top: `-${offsetY.value}%`,
  left: `-${offsetX.value}%`,
}));

// A mágica acontece aqui, rodando apenas para ESTA instância do ícone
onMounted(() => {
  const max_X = currentSize.value.x;
  const max_Y = currentSize.value.y;

  // Sorteia o frame (0 até max - 1)
  const frameX = Math.floor(Math.random() * max_X);
  const frameY = Math.floor(Math.random() * max_Y);

  // Aplica o deslocamento em %
  offsetX.value = frameX * 100;
  offsetY.value = frameY * 100;
});
</script>

<template>
  <div
    v-bind="attrs"
    :class="['relative overflow-hidden aspect-square', attrs.class]"
    :style="containerStyle"
  >
    <img
      :src="activeIcon"
      class="absolute max-w-none rendering-pixelated"
      :style="imageStyle"
      :alt="`Ícone de ${normalizedIcon}`"
    />
  </div>
</template>
