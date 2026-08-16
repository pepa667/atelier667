<script setup>
import GlitchTitle from "./GlitchTitle.vue";
import Icon from "./Icon.vue";

// Se o header precisar de alguma props futura, entra aqui
</script>

<template>
  <header
    class="relative w-full flex flex-col gap-[clamp(1.25rem,0.6667rem+2.9167vw,3rem)] justify-between items-start py-6 border-b-2 border-zinc-700 *:before:border-b-2"
  >
    <h1
      class="font-serif italic text-fluid-hero inline-block text-[color-mix(in_srgb,var(--color-main-a)_50%,white_100%)] leading-[0.7] my-2 lg:my-4"
    >
      <span
        class="absolute w-[150%] h-5/12 bg-main-c-dark/50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:pcx-grunge-full -z-1 [--mask-pos:20%_30%]"
      ></span>
      Atelier<span class="text-main-b">667</span>.
    </h1>

    <p
      class="text-fluid-sm text-main-b font-mono ml-[clamp(1.25rem,0.3846rem+3.8462vw,5rem)]"
    >
      System // Active
    </p>
    <!-- Seu menu de navegação ou botão de menu entra aqui -->
    <nav
      class="flex gap-4 font-mono text-fluid-sm ml-[clamp(2.5rem,0.7692rem+7.6923vw,10rem)]"
    >
      <a href="#" class="hover:text-white transition-colors font-title"
        >/Drops</a
      >
      <a href="#" class="hover:text-white transition-colors">/Lab</a>
    </nav>
  </header>
</template>
