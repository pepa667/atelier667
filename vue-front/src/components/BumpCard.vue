<script setup>
import Icon from "./Icon.vue";

defineProps({
  bumps: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div
    v-if="bumps && bumps[0]"
    class="relative h-fit max-w-[50svw] border-0 wiggle-glitch"
  >
    <Icon icon="punk" class="pop_c" />
  </div>
</template>
