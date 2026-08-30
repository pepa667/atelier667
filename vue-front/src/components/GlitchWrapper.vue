<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // 'element': escuta os eventos no próprio GlitchWrapper
  // 'parent': escuta no elemento pai direto (ex: o <li>)
  // 'section': busca a <section> mais próxima
  // Chance de ativação (1 = 100%, 0.25 = 25% de chance de ativar)
  triggerProbability: {
    type: Number,
    default: 0.2,
  },
  minDuration: { type: Number, default: 1000 },
  maxDuration: { type: Number, default: 2500 },
  // Define qual tag será renderizada
  tag: {
    type: String,
    default: "figure", // Pode ser 'article', 'aside', 'main', 'figure', 'span', etc.
  },
});

const isGlitching = ref(false);
const wrapperRef = ref(null);
let mutationObserver = null;

const currentSeed = ref(1);
const currentFreq = ref(1);
const currentScale = ref(1);
const randomDelay = ref(1);

const filterId = `glitch-filter-${Math.random().toString(36).substring(2, 9)}`;

let durationTimeoutId = null;
let jitterIntervalId = null;
let observer = null;

const stopJitter = () => {
  if (jitterIntervalId) {
    clearInterval(jitterIntervalId);
    jitterIntervalId = null;
  }
};

const startJitter = () => {
  stopJitter();
  jitterIntervalId = setInterval(() => {
    currentSeed.value = Math.floor(Math.random() * 1000000);
    currentScale.value = 35;
    currentFreq.value = Math.random() * 0.0001 * 7500;
    randomDelay.value = Math.floor(Math.random() * 75) + 1;
  }, randomDelay.value);
};

const stopGlitch = () => {
  stopJitter();
  isGlitching.value = false;

  if (durationTimeoutId) {
    clearTimeout(durationTimeoutId);
    durationTimeoutId = null;
  }
};

const triggerGlitch = () => {
  if (isGlitching.value) return;

  const roll = Math.random();
  if (roll > props.triggerProbability) {
    return;
  }

  isGlitching.value = true;
  startJitter();

  const duration =
    Math.floor(Math.random() * (props.maxDuration - props.minDuration + 1)) +
    props.minDuration;

  durationTimeoutId = setTimeout(() => {
    stopGlitch();
  }, duration);
};

// Resolução do elemento alvo com base na prop

onMounted(() => {
  const el = wrapperRef.value;
  if (!el) return;

  // 1. Mouseenter padrão no desktop
  el.addEventListener("mouseenter", triggerGlitch);

  // 2. Procura pelo ancestral que recebe a classe .onView
  const targetParent = el.closest(".onView") || el.parentElement;

  if (targetParent) {
    // Valida imediatamente caso já tenha a classe na montagem
    if (targetParent.classList.contains("onView")) {
      triggerGlitch();
    }

    // Observa alterações nas classes do elemento pai (Mobile Observer)
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const hasOnView = targetParent.classList.contains("onView");
          if (hasOnView) {
            triggerGlitch();
          }
        }
      });
    });

    mutationObserver.observe(targetParent, {
      attributes: true,
      attributeFilter: ["class"],
    });
  } // observer.observe(wrapperRef.value);
});

onUnmounted(() => {
  if (wrapperRef.value) {
    wrapperRef.value.removeEventListener("mouseenter", triggerGlitch);
  }
  if (mutationObserver) {
    mutationObserver.disconnect();
  }
});
</script>

<template>
  <component
    :is="tag"
    ref="wrapperRef"
    class="glitch-wrapper absolute inset-0 inline-block w-full h-full"
    :style="{
      filter: isGlitching ? `url(#${filterId})` : 'none',
    }"
  >
    <slot :is-glitching="isGlitching" />

    <svg style="position: absolute; width: 0; height: 0" aria-hidden="true">
      <defs>
        <filter :id="filterId" x="-50%" y="0%" width="200%" height="100%">
          <!-- Ruído focado em linhas horizontais -->
          <feTurbulence
            type="fractalNoise"
            :baseFrequency="`0.001 ${currentFreq || 0.05}`"
            :seed="currentSeed"
            numOctaves="1"
            result="noise"
          />

          <!-- Binariza o canal R para cortes secos e remove variação dos outros canais -->
          <feColorMatrix
            type="matrix"
            values="50 0 0 0 -25
                  0  0 0 0   0
                  0  0 0 0   0
                  0  0 0 1   0"
            in="noise"
            result="sharp-blocks"
          />

          <!-- Estica o ruído na horizontal sem achatar verticalmente -->
          <feMorphology
            operator="dilate"
            :radius="`${currentScale * 5 || 100} 0`"
            in="sharp-blocks"
            result="stretched-blocks"
          />

          <!-- Displacement travado estritamente no eixo X -->
          <feDisplacementMap
            in="SourceGraphic"
            in2="stretched-blocks"
            :scale="currentScale"
            xChannelSelector="R"
            yChannelSelector="A"
          />
        </filter>
      </defs>
    </svg>
  </component>
</template>
