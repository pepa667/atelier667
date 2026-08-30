<script setup>
import { computed } from "vue";

const props = defineProps({
  drops: {
    type: Array,
    default: () => [],
  },
});

const drop = computed(() => props.drops[0] || null);
</script>

<template>
  <article
    v-if="drop"
    class="h-full w-full flex flex-col justify-between relative overflow-hidden group transition-all duration-1000 ease-in-out"
  >
    <header class="relative p-4 bg-zinc-950/80">
      <h2
        class="text-sm font-bold text-main-b leading-loose bg-black tracking-wider uppercase"
      >
        // DROPS_LOG
      </h2>
    </header>

    <div
      class="w-auto h-full flex gap-4 flex-col justify-start m-3 ml-6 overflow-hidden"
    >
      <h3 class="text-lg font-bold text-zinc-200 uppercase">
        {{ drop.title }}
      </h3>
      <p
        class="w-full whitespace-pre-line text-sm max-h-8 overflow-hidden leading-relaxed text-zinc-300 min-h-inherit group-hover:max-h-128 group-[&.onView]:max-h-128 min-h-full transition-[max-height] duration-1000 delay-100 ease-in"
      >
        {{ drop.content }}
      </p>
    </div>
    <footer class="flex items-center justify-between p-4 bg-zinc-950/80">
      <span
        v-if="drop.timestamp"
        class="text-[12px] leading-loose bg-black font-mono"
      >
        {{ drop.timestamp || "LOG_DATA" }}
      </span>
      <!-- Tags -->
      <!-- <div class="flex flex-wrap gap-1">
        <span
          v-for="tag in drop.tags"
          :key="tag"
          class="px-1.5 py-0.5 bg-zinc-800/80 text-zinc-400 text-[9px] uppercase rounded border border-zinc-700/50"
        >
          #{{ tag }}
        </span>
      </div> -->
      <!-- Link Externo -->
      <!-- <a
        v-if="drop.externalLink"
        :href="drop.externalLink"
        target="_blank"
        rel="noopener noreferrer"
        class="text-main-a hover:underline text-[10px] font-bold flex items-center gap-1 ml-2"
      >
        LINK ↗
      </a> -->
    </footer>
  </article>
</template>
