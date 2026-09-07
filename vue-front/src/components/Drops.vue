<script setup>
import { computed } from 'vue'

const props = defineProps({
  drops: {
    type: Array,
    default: () => []
  }
})

const drop = computed(() => props.drops[0] || null)
</script>

<template>
  <article
    v-if="drop"
    class="group relative flex h-auto w-full flex-col justify-between"
  >
    <header class="relative bg-zinc-950/80 p-4">
      <h2
        class="text-main-b bg-black text-sm leading-loose font-bold tracking-wider uppercase"
      >
        // DROPS_LOG
      </h2>
    </header>

    <div class="m-3 ml-6 flex h-full w-auto flex-col justify-start gap-4">
      <h3 class="text-lg font-bold text-zinc-200 uppercase">
        {{ drop.title }}
      </h3>
      <p class="w-full text-sm leading-relaxed text-zinc-300">
        {{ drop.content }}
      </p>
    </div>
    <footer class="flex bg-zinc-950/80 p-4">
      <span
        v-if="drop.timestamp"
        class="text-main-c-strong w-[stretch] text-right font-mono text-[12px] leading-loose"
      >
        {{ drop.timestamp || 'LOG_DATA' }}
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
