<script setup>
import Icon from "./Icon.vue";

defineProps({
  decos: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div v-if="decos && decos[0]" class="h-full w-full border-0 wiggle-glitch">
    <Icon icon="punk" class="mb-4 pop_c w-full wiggle-glitch" />
  </div>
</template>
