<script setup>
import Icon from "./Icon.vue";

// Se o header precisar de alguma props futura, entra aqui
</script>

<template>
  <header
    class="relative w-full flex justify-between items-center py-6 border-b border-zinc-800"
  >
    <div class="relative">
      <div
        class="absolute -right-10 -bottom-4 md:-right-20 md:-bottom-8 pop_01"
      >
        <Icon name="maker" class="pop_01 size-icon-4xl mx-4" />
      </div>
      <h1
        class="relative font-title text-[clamp(4rem,12vw,10rem)] leading-none texture text-primary my-2 lg:my-4 drop-shadow-[4px_4px_0px_var(--color-second),-4px_-4px_0px_var(--color-third)]"
      >
        <span
          class="min-w-4 max-w-20 w-[5svw] h-[clamp(0.5em,10vw,8rem)] bg-primary inline-block relative"
        ></span>
        Atelier667
      </h1>

      <p class="text-sm text-second font-mono">System // Active</p>
    </div>
    <!-- Seu menu de navegação ou botão de menu entra aqui -->
    <nav class="flex gap-4 font-mono text-sm">
      <a href="#" class="hover:text-white transition-colors font-title"
        >/Drops</a
      >
      <a href="#" class="hover:text-white transition-colors">/Lab</a>
    </nav>
  </header>
</template>
