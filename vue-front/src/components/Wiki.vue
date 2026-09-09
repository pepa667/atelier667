<script setup>
import { computed } from 'vue'

const props = defineProps({
  documentos: {
    type: Array,
    default: () => []
  }
})

const doc = computed(() => props.documentos[0] || null)
</script>

<template>
  <article
    v-if="doc"
    :key="doc._id"
    class="group relative flex h-full w-full flex-col justify-between overflow-hidden"
  >
    <header
      class="relative mb-3 flex flex-col items-baseline justify-between bg-zinc-950/20 p-4"
    >
      <h2
        class="text-main-b bg-black text-sm leading-loose font-bold tracking-wider uppercase"
      >
        // WIKI_DOCS
      </h2>
    </header>

    <div
      class="relative m-3 ml-6 flex h-full w-auto flex-col justify-start gap-4 bg-zinc-950/20 font-serif"
    >
      <h3 class="text-md text-main-c font-bold uppercase">
        {{ doc.title }}
      </h3>
      <h4 class="text-main-c text-sm font-bold uppercase">
        {{ doc.subtitle }}
      </h4>
      <div
        class="hidden aspect-9/4 h-auto w-full bg-amber-500 transition-[aspect-ratio] duration-1000 hover:aspect-square"
      >
        x
      </div>
    </div>
    <footer class="flex bg-zinc-950/80 p-4">
      <span
        v-if="doc.timestamp"
        class="text-main-c-strong w-[stretch] text-right font-mono text-[12px] leading-loose"
      >
        {{ doc.timestamp || 'LOG_DATA' }}
      </span>
    </footer>
  </article>
</template>
