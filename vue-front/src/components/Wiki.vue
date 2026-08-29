<script setup>
import { computed } from "vue";

const props = defineProps({
  documentos: {
    type: Array,
    default: () => [],
  },
});

const doc = computed(() => props.documentos[0] || null);
</script>

<template>
  <article
    v-if="doc"
    :key="doc._id"
    class="h-full w-full flex flex-col justify-between relative overflow-hidden group"
  >
    <header
      class="mb-3 relative flex flex-col items-baseline justify-between p-4 bg-zinc-950/20"
    >
      <h2
        class="text-sm font-bold text-main-b leading-loose bg-black tracking-wider uppercase"
      >
        // WIKI_DOCS
      </h2>
    </header>

    <div
      class="relative w-auto h-full font-serif flex gap-4 flex-col justify-start m-3 ml-6 bg-zinc-950/20"
    >
      <h3 class="text-md font-bold text-main-c uppercase">
        {{ doc.title }}
      </h3>
      <h4 class="text-sm font-bold text-main-c uppercase">
        {{ doc.subtitle }}
      </h4>
      <div
        class="w-full hidden h-auto aspect-9/4 bg-amber-500 transition-[aspect-ratio] duration-1000 hover:aspect-square"
      >
        x
      </div>
    </div>
    <footer
      class="relative mt-3 flex items-center justify-between p-4 bg-zinc-950/20"
    >
      <span
        v-if="doc.timestamp"
        class="text-[12px] leading-loose bg-black font-mono"
      >
        {{ doc.timestamp || "LOG_DATA" }}
      </span>
    </footer>
  </article>
</template>
