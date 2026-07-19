<script setup>
defineProps({
  documentos: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section class="py-8">
    <h2 class="text-2xl font-bold text-zinc-500 mb-4">// WIKI_DOCS</h2>
    <div class="grid gap-4">
      <article
        v-for="doc in documentos"
        :key="doc._id"
        class="border-l-2 border-zinc-700 pl-4 py-2 hover:border-white transition-colors"
      >
        <h3 class="text-lg font-bold">{{ doc.title }}</h3>
        <p class="text-zinc-400 text-sm">{{ doc.subtitle }}</p>
        <span class="text-[10px] uppercase text-zinc-600 mt-2 block"
          >#{{ doc.category }}</span
        >
      </article>
    </div>
  </section>
</template>
