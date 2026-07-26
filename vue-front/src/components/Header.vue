<script setup>
import GlitchTitle from "./GlitchTitle.vue";
import Icon from "./Icon.vue";

// Se o header precisar de alguma props futura, entra aqui
</script>

<template>
  <header
    class="relative w-full flex flex-col gap-[clamp(1.25rem,0.6667rem+2.9167vw,3rem)] justify-between items-start py-6 border-b border-zinc-800"
  >
    <GlitchTitle
      class="relative aloha [&_.glitch-overlay_h1]:text-zinc-800 [&_.glitch-overlay_h1]:bg-primary [&_.glitch-overlay_h1]:drop-shadow-none"
      tag-glitch="div"
      :min-delay="5000"
      :max-delay="10000"
    >
      <div
        class="absolute -right-10 -bottom-4 md:-right-20 md:-bottom-8 pop_01"
      >
        <Icon name="maker" class="pop_01 size-icon-4xl mx-4" />
      </div>
      <h1
        class="relative font-title text-[clamp(4rem,12vw,10rem)] inline-block text-[color-mix(in_srgb,var(--color-primary)_90%,var(--color-zinc-800))] leading-none my-2 lg:my-4 drop-shadow-[4px_4px_0px_var(--color-second),-4px_-4px_0px_var(--color-third)]"
      >
        <span
          class="animate-pulse [animation-duration:1000ms] [animation-delay:1500ms]"
          >|</span
        >Atelier667
      </h1>

      <p class="text-sm text-second font-mono md:before:content-['__']">
        &nbsp;&nbsp;System // Active
      </p>
    </GlitchTitle>
    <!-- Seu menu de navegação ou botão de menu entra aqui -->
    <nav class="flex gap-4 font-mono text-sm md:before:content-['__']">
      &nbsp;&nbsp;
      <a href="#" class="hover:text-white transition-colors font-title"
        >/Drops</a
      >
      <a href="#" class="hover:text-white transition-colors">/Lab</a>
    </nav>
  </header>
</template>
