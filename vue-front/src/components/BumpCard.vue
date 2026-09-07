<script setup>
import Icon from './Icon.vue'

defineProps({
  bumps: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <article class="group relative max-w-[50svw] border-0">
    <figure class="*>:pop_c wiggle-glitch">
      <Icon icon="punk" class="pop_c h-full w-full" />
    </figure>
  </article>
</template>
