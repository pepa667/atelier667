<script setup>
import Icon from "./Icon.vue";
</script>

<template>
  <aside class="relative w-fit font-bold">
    <span
      class="relative inline-block whitespace-nowrap max-h-0.5 -translate-y-4 text-fluid-sidebar py-fluid-base font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline"
      >Pepa667</span
    >
    <div class="fixed max-h-svh overflow-hidden top-0">
      <!-- O seu CSS brutalista original portado 1:1 -->
      <div
        class="absolute bg-[url(./assets/images/pattern.png)] bg-size-[2px] bg-zinc-950/40 hover:opacity-0 -inset-1 z-50 transition-opacity duration-700"
      ></div>
      <ol
        class="scroll-side-bar text-fluid-sidebar *:inline-block whitespace-nowrap list-none py-fluid-base [&>li]:before:content-['_//_'] [&>li]:before:text-zinc-200 italic font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline [&>li:nth-child(1n)]:text-main-a [&>li:nth-child(2n)]:text-main-b [&>li:nth-child(3n)]:text-main-c [&>li:nth-child(4n)]:text-main-d"
      >
        <li>
          <Icon name="maker" class="pop_01 size-icon-base inline-block mx-2" />
        </li>
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
        <li>Modelagem</li>
        <li>
          <Icon name="maker" class="pop_01 size-icon-base mb-4 inline-block" />
        </li>
        <li></li>
      </ol>
    </div>
  </aside>
</template>
