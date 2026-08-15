<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  tagGlitch: {
    type: String,
    default: "h2",
  },
  minDelay: {
    type: Number,
    default: 3000,
  },
  maxDelay: {
    type: Number,
    default: 9000,
  },
});

const isPlaying = ref(false);
const sliceStyles = ref({});
let timeoutId = null;

const getRandomOffset = (min = -25, max = 25) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleSlicesAndTransforms = () => {
  const slices = [
    "inset(80% -6px 0 0)",
    "inset(50% -6px 30% 0)",
    "inset(10% -6px 85% 0)",
    "inset(40% -6px 43% 0)",
    "inset(80% -6px 5% 0)",
  ];

  for (let i = slices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [slices[i], slices[j]] = [slices[j], slices[i]];
  }

  return {
    "--slice-0": "inset(50% 50% 50% 50%)",
    "--slice-1": slices[0],
    "--slice-2": slices[1],
    "--slice-3": slices[2],
    "--slice-4": slices[3],
    "--slice-5": slices[4],

    "--tx-1": `${getRandomOffset(-20, 20)}px`,
    "--ty-1": `${getRandomOffset(-15, 15)}px`,
    "--tx-2": `${getRandomOffset(-15, 15)}px`,
    "--ty-2": `${getRandomOffset(-10, 10)}px`,
    "--tx-3": `${getRandomOffset(-25, 25)}px`,
    "--ty-3": `${getRandomOffset(-12, 12)}px`,
    "--tx-4": `${getRandomOffset(-10, 10)}px`,
    "--ty-4": `${getRandomOffset(-20, 20)}px`,
    "--tx-5": `${getRandomOffset(-18, 18)}px`,
    "--ty-5": `${getRandomOffset(-8, 8)}px`,
  };
};

const triggerGlitch = () => {
  isPlaying.value = false;

  // Convertemos com Number() por garantia
  const min = Number(props.minDelay) || 5000;
  const max = Number(props.maxDelay) || 8000;

  const delay = Math.floor(Math.random() * (max - min + 1)) + min;

  timeoutId = setTimeout(() => {
    isPlaying.value = true;
  }, delay);
};

const handleAnimationEnd = () => {
  triggerGlitch();
};

onMounted(() => {
  sliceStyles.value = shuffleSlicesAndTransforms();
  triggerGlitch();
});

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<template>
  <component :is="tagGlitch" class="select-text relative">
    <!-- Camada do Glitch duplicando o slot com efeito visual -->
    <span
      aria-hidden="true"
      class="glitch-overlay absolute top-0 left-0 text-zinc-800 pointer-events-none select-none z-10"
      :class="{ 'is-glitching': isPlaying }"
      :style="sliceStyles"
      @animationend="handleAnimationEnd"
    >
      <slot />
    </span>
    <!-- Slot principal para renderizar o cursor + texto do usuário -->
    <slot />
  </component>
</template>

<style scoped>
.glitch-overlay {
  color: var(--color-zinc-100);
  will-change: transform, clip-path;
  opacity: 0;
  z-index: 10;
  clip-path: var(--slice-0, inset(50% 50% 50% 50%));
}

.glitch-overlay.is-glitching {
  opacity: 1;
  animation: glitch 1s steps(2, end) forwards;
  background-color: var(--color-zinc-900);
}

@keyframes glitch {
  0% {
    clip-path: var(--slice-1);
    transform: translate(var(--tx-1), var(--ty-1));
  }
  5% {
    clip-path: var(--slice-3);
    transform: translate(var(--tx-2), var(--ty-2));
  }
  30% {
    clip-path: var(--slice-1);
    transform: translate(var(--tx-3), var(--ty-3));
  }
  45% {
    clip-path: var(--slice-3);
    transform: translate(var(--tx-4), var(--ty-4));
  }
  48% {
    clip-path: var(--slice-2);
    transform: translate(var(--tx-5), var(--ty-5));
  }
  53% {
    clip-path: var(--slice-3);
    transform: translate(var(--tx-1), var(--ty-4));
  }
  70% {
    clip-path: var(--slice-4);
    transform: translate(var(--tx-3), var(--ty-2));
  }
  78% {
    clip-path: var(--slice-2);
    transform: translate(var(--tx-2), var(--ty-5));
  }
  80% {
    clip-path: var(--slice-5);
    transform: translate(var(--tx-4), var(--ty-1));
  }
  85% {
    clip-path: var(--slice-1);
    transform: translate(var(--tx-5), var(--ty-3));
  }
  100% {
    clip-path: var(--slice-1);
    transform: translate(0, 0);
  }
}
</style>
