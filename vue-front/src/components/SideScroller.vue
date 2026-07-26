<script setup>
import Icon from "./Icon.vue";
</script>

<template>
  <aside class="relative w-fit font-bold">
    <span
      class="relative inline-block whitespace-nowrap max-h-0.5 -translate-y-4 text-fluid-base py-fluid-base font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline"
      >Pepa667</span
    >
    <div class="fixed max-h-svh overflow-hidden top-0">
      <!-- O seu CSS brutalista original portado 1:1 -->
      <div
        class="absolute bg-[url(./assets/images/pattern.png)] bg-size-[2px] bg-zinc-950/40 hover:opacity-0 -inset-1 z-50 transition-opacity duration-700"
      ></div>
      <ol
        class="scroll-side-bar text-fluid-base *:inline-block whitespace-nowrap list-none py-fluid-base [&>li]:before:content-['_//_'] [&>li]:before:text-zinc-200 italic font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline [&>li:nth-child(1n)]:text-primary [&>li:nth-child(2n)]:text-second [&>li:nth-child(3n)]:text-third [&>li:nth-child(4n)]:text-fourth"
      >
        <!-- Chamando o Icon.vue do jeito Vue -->
        <li>
          <Icon name="maker" class="pop_01 size-icon mx-4" />
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
        <li class="after:content-['_//_'] after:text-zinc-200">Modelagem</li>

        <li>
          <Icon name="maker" class="pop_01 size-icon mx-4" />
        </li>
      </ol>
    </div>
  </aside>
</template>
