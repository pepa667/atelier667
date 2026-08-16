<script setup>
defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <section class="py-8">
    <h2 class="text-2xl font-bold text-zinc-500 mb-4">// ARTBOARD_FEED</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <div
        v-for="post in posts"
        :key="post._id"
        class="aspect-square bg-zinc-800 relative group overflow-hidden"
      >
        <!-- Aqui entraria a imagem do Sanity -->
        <div
          class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/50 transition-opacity text-xs p-2 text-center"
        >
          {{ post.title }}
        </div>
      </div>
    </div>
  </section>
</template>
