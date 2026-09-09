<script setup>
import Icon from './Icon.vue'
</script>

<template>
  <aside class="relative w-fit bg-zinc-900 px-1 font-bold">
    <span
      class="text-fluid-sidebar py-fluid-base relative inline-block max-h-0.5 -translate-y-4 rotate-180 self-baseline font-serif tracking-wider whitespace-nowrap [writing-mode:vertical-lr]"
      >Pepa667</span
    >
    <div class="fixed top-0 max-h-svh overflow-visible">
      <div
        class="border-main-b-strong/25 absolute inset-0 top-0 max-h-svh border-x-2 bg-zinc-950/80"
      ></div>
      <!-- class="absolute inset-0 max-h-svh bg-black opacity-30 top-0 drop-shadow-[7px_7px_15px_var(--color-main-a),-7px_-7px_15px_var(--color-main-b)]" -->
      <!-- O seu CSS brutalista original portado 1:1 -->
      <!-- <div
        class="absolute bg-[url(./assets/images/pattern.png)] bg-size-[4px] bg-zinc-950/40 hover:opacity-0 -inset-1 z-50 transition-opacity duration-700"
      ></div> -->
      <div class="scroll-side-bar rotate-180">
        <ol
          class="text-fluid-sidebar animate-sideBar py-fluid-base text-main-a [&>li]:before:text-main-d-strong list-none self-baseline font-serif tracking-wider whitespace-nowrap italic [writing-mode:vertical-lr] *:inline-block [&>li]:before:px-4 [&>li]:before:font-sans [&>li]:before:font-light [&>li]:before:content-['//']"
        >
          <li>Software</li>
          <li>Hardware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base mx-2 inline-block rotate-180"
            />
          </li>
          <li>Impressão</li>
          <li>CNC</li>
          <li>Retro Mod</li>
          <li>Firmware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base mx-2 inline-block rotate-180"
            />
          </li>
          <li>Arcade</li>
          <li>Marcenaria</li>
          <li>DevOps</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base mx-2 inline-block rotate-180"
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
              class="pop_a size-icon-base mx-2 inline-block rotate-180"
            />
          </li>
          <li>Impressão</li>
          <li>CNC</li>
          <li>Retro Mod</li>
          <li>Firmware</li>
          <li>
            <Icon
              icon="maker"
              class="pop_a size-icon-base mx-2 inline-block rotate-180"
            />
          </li>
          <li>Arcade</li>
          <li>Marcenaria</li>
          <li>DevOps</li>
          <li>
            <Icon
              icon="maker"
              class="size-icon-base mx-2 inline-block rotate-180"
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
