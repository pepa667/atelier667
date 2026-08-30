<script setup>
import Icon from "./Icon.vue";
import GlitchWrapper from "./GlitchWrapper.vue";

defineProps({
  decos: {
    type: Array,
    default: () => [],
  },
});
</script>

<template>
  <div v-if="decos && decos[0]" class="h-full w-full border-0 wiggle-glitch">
    <GlitchWrapper :trigger-probability="1">
      <Icon icon="punk" class="mb-4 pop_c w-full wiggle-glitch" />
    </GlitchWrapper>
  </div>
</template>
