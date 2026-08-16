<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  // 'element': escuta os eventos no próprio GlitchWrapper
  // 'parent': escuta no elemento pai direto (ex: o <li>)
  // 'section': busca a <section> mais próxima
  triggerTarget: {
    type: String,
    default: "parent",
    validator: (val) => ["element", "parent", "section"].includes(val),
  },
  // Chance de ativação (1 = 100%, 0.25 = 25% de chance de ativar)
  triggerProbability: {
    type: Number,
    default: 0.2,
  },
  minDuration: { type: Number, default: 1000 },
  maxDuration: { type: Number, default: 2500 },
});

const isGlitching = ref(false);
const wrapperRef = ref(null);

const currentSeed = ref(1);
const currentFreq = ref(2);
const currentScale = ref(15);
const freqPow = [1, 10, 100, 1000];
const randomDelay = ref(150);

const filterId = `glitch-filter-${Math.random().toString(36).substring(2, 9)}`;

let targetElement = null;
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
    currentSeed.value = Math.floor(Math.random() * 1000);
    currentScale.value = Math.floor(Math.random() * (20 - 5 + 1)) + 5;
    currentFreq.value =
      Math.random() *
      0.0001 *
      freqPow[Math.floor(Math.random() * freqPow.length)];
    randomDelay.value = Math.floor(Math.random() * 20) + 5;
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
const resolveTargetElement = () => {
  if (!wrapperRef.value) return null;

  if (props.triggerTarget === "element") {
    return wrapperRef.value;
  }

  if (props.triggerTarget === "parent") {
    return wrapperRef.value.parentElement || wrapperRef.value;
  }

  if (props.triggerTarget === "section") {
    return wrapperRef.value.closest("section") || wrapperRef.value;
  }

  return wrapperRef.value;
};

onMounted(() => {
  targetElement = resolveTargetElement();
  if (!targetElement) return;

  // Mouseover / Mouseenter no Desktop
  targetElement.addEventListener("mouseenter", triggerGlitch);

  // IntersectionObserver para Mobile (Viewport)
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const isMobile = window.innerWidth < 768;

        if (entry.isIntersecting && isMobile) {
          triggerGlitch();
        }
      });
    },
    {
      root: null,
      rootMargin: "-30% 0px -30% 0px",
      threshold: 0,
    },
  );

  observer.observe(targetElement);
});

onUnmounted(() => {
  stopGlitch();
  if (observer) observer.disconnect();
  if (targetElement) {
    targetElement.removeEventListener("mouseenter", triggerGlitch);
  }
});
</script>

<template>
  <div
    ref="wrapperRef"
    class="glitch-wrapper absolute inset-0 inline-block w-full h-full"
    :style="{
      filter: isGlitching ? `url(#${filterId})` : 'none',
    }"
  >
    <slot :is-glitching="isGlitching" />

    <svg style="position: absolute; width: 0; height: 0" aria-hidden="true">
      <defs>
        <filter :id="filterId" x="-100%" y="-20%" width="300%" height="140%">
          <feTurbulence
            type="fractalNoise"
            :baseFrequency="`0.0 ${currentFreq}`"
            :seed="currentSeed"
            numOctaves="1"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="10 0 0 0 -4.5
                    0 10 0 0 -4.5
                    0 0 10 0 -4.5
                    0 0 0 1 0"
            in="noise"
            result="sharp-blocks"
          />
          <feMorphology
            operator="dilate"
            :radius="`${currentScale * 10 || 500} 20`"
            in="sharp-blocks"
            result="stretched-blocks"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="stretched-blocks"
            :scale="currentScale"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>
