<script setup>
import Icon from "./Icon.vue";
</script>

<template>
  <aside class="bg-zinc-900 px-1 relative w-fit font-bold">
    <span
      class="relative inline-block whitespace-nowrap max-h-0.5 -translate-y-4 text-fluid-sidebar py-fluid-base font-serif tracking-wider [writing-mode:vertical-lr] rotate-180 self-baseline"
      >Pepa667</span
    >
    <div class="fixed max-h-svh overflow-visible top-0">
      <div
        class="absolute inset-0 max-h-svh bg-black opacity-30 top-0 drop-shadow-[7px_7px_15px_var(--color-main-a),-7px_-7px_15px_var(--color-main-b)]"
      ></div>
      <!-- O seu CSS brutalista original portado 1:1 -->
      <!-- <div
        class="absolute bg-[url(./assets/images/pattern.png)] bg-size-[4px] bg-zinc-950/40 hover:opacity-0 -inset-1 z-50 transition-opacity duration-700"
      ></div> -->
      <div class="scroll-side-bar rotate-180">
        <ol
          class="text-fluid-sidebar animate-sideBar *:inline-block whitespace-nowrap list-none py-fluid-base [&>li]:before:content-['__//_'] italic font-serif tracking-wider [writing-mode:vertical-lr] self-baseline text-main-a [&>li]:before:text-main-b"
        >
          <li>Software</li>
          <li>Hardware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Impressão</li>
          <li>CNC</li>
          <li>Retro Mod</li>
          <li>Firmware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Arcade</li>
          <li>Marcenaria</li>
          <li>DevOps</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Ilustração</li>
          <li>Modelagem</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base mb-4 inline-block rotate-180"
            />
          </li>
          <li>Software</li>
          <li>Hardware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Impressão</li>
          <li>CNC</li>
          <li>Retro Mod</li>
          <li>Firmware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Arcade</li>
          <li>Marcenaria</li>
          <li>DevOps</li>
          <li>
            <Icon
              icon="maker"
              class="size-icon-base inline-block mx-2 rotate-180"
            />
          </li>
          <li>Ilustração</li>
          <li>Modelagem</li>
          <li>
            <Icon
              icon="maker"
              class="size-icon-base mb-4 inline-block rotate-180"
            />
          </li>
        </ol>
      </div>
    </div>
  </aside>
</template>
