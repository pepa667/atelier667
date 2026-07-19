<script setup>
import Icon from "./Icon.vue";
</script>

<template>
  <aside class="relative min-w-16 lg:min-w-24">
    <div class="fixed max-h-svh overflow-hidden">
      <!-- O seu CSS brutalista original portado 1:1 -->
      <ol
        class="scroll-side-bar text-2xl texture mask-size-[50%] *:inline-block whitespace-nowrap list-none py-4 [&>li]:before:content-['_//_'] [&>li]:before:text-white *:italic sm:text-4xl lg:text-4xl 2xl:text-6xl font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline border-l border-primary-800 [&>li:nth-child(1n)]:text-primary [&>li:nth-child(2n)]:text-second [&>li:nth-child(3n)]:text-third [&>li:nth-child(4n)]:text-fourth"
      >
        <!-- Chamando o Icon.vue do jeito Vue -->
        <Icon name="maker" class="pop_01 w-6 sm:w-10 lg:w-15 mt-8 mx-auto" />

        <li>Software</li>
        <li>Hardware</li>
        <li>Impressão</li>
        <li>CNC</li>
        <li>Retro Mod</li>
        <li>Firmware</li>
        <li>Arcade</li>
        <li>Marcenaria</li>
        <li>DevOps</li>
        <li>Ilustração</li>
        <li class="after:content-['_//_'] after:text-white">Modelagem</li>

        <Icon name="maker" class="pop_01 sm:w-10 lg:w-15 mb-8 mx-auto" />
      </ol>
    </div>
  </aside>
</template>

<style scoped>
/* Se o keyframe de scroll infinito não estiver no seu global.css ainda, ele vive aqui: */
.scroll-side-bar {
  animation: scrollSide 20s linear infinite;
}

@keyframes scrollSide {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(
      -50%
    ); /* Ajuste a % dependendo de onde o loop corta */
  }
}
</style>
