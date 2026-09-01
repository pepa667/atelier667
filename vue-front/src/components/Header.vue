<script setup>
import Icon from "./Icon.vue";
</script>
<template>
  <article class="relative w-full h-auto flex flex-col gap-4">
    <header
      class="relative w-auto flex flex-row gap-4 justify-between items-center-safe py-6"
    >
      <span class="flex flex-col gap-4 w-auto">
        <h1
          class="font-serif sm:whitespace-nowrap text-fluid-hero text-zinc-300 my-2 lg:my-4 leading-[0.75] drop-shadow-[5px_5px_0_var(--color-main-a-strong),-5px_-5px_0_var(--color-main-b-strong)]"
        >
          Atelier 667<b class="font-sans">.</b>
        </h1>
        <p
          class="text-fluid-sm text-main-d-strong font-mono pl-6 border-l-[clamp(1.25rem,0.3846rem+3.8462vw,5rem)]"
        >
          Traçando códigos em matéria
        </p>
        <p class="font-title text-fluid-title text-zinc-200 pcx-grunge-min">
          — OFICINA MAKER <br />
          ONDE IDEIAS GANHAM FORMA. —
        </p>
      </span>
      <figure class="relative h-full w-full rounded-lg shadow-lg">
        <Icon
          icon="maker"
          class="pop_a h-full max-w-4/6 mx-auto aspect-square rotate-180"
        />
      </figure>
    </header>
    <!-- Seu menu de navegação ou botão de menu entra aqui -->
    <nav
      class="flex gap-4 py-8 my-8 text-fluid-sm text-main-d-strong font-mono pl-6 border-l-[clamp(1.25rem,0.3846rem+3.8462vw,5rem)]"
    >
      <a href="#" class="hover:text-main-d transition-colors font-title"
        >/Drops</a
      >
      <a href="#" class="hover:text-main-d transition-colors">/Lab</a>
    </nav>
  </article>
</template>
