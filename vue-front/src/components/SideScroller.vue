<script setup>
import "../styles/sideBar.css";
import Icon from "./Icon.vue";
</script>

<template>
  <aside class="relative w-fit">
    <span
      class="relative inline-block whitespace-nowrap max-h-0.5 -translate-y-4 text-fluid-sidebar py-fluid-sidebar font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline"
      >Pepa667</span
    >
    <div class="fixed max-h-svh overflow-hidden top-0">
      <!-- O seu CSS brutalista original portado 1:1 -->
      <ol
        class="scroll-side-bar text-fluid-sidebar *:inline-block whitespace-nowrap list-none py-fluid-sidebar [&>li]:before:content-['_//_'] [&>li]:before:text-white *:italic font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline border-l border-primary-800 [&>li:nth-child(1n)]:text-primary [&>li:nth-child(2n)]:text-second [&>li:nth-child(3n)]:text-third [&>li:nth-child(4n)]:text-fourth"
      >
        <!-- Chamando o Icon.vue do jeito Vue -->
        <Icon name="maker" class="pop_01 size-fluid-icon mx-4" />

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

        <Icon name="maker" class="pop_01 size-fluid-icon mx-4" />
      </ol>
    </div>
  </aside>
</template>
