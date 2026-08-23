<template>
  <header
    class="relative w-full flex flex-col gap-[clamp(1.25rem,0.6667rem+2.9167vw,3rem)] justify-between items-start py-6 border-b-2 border-zinc-700 *:before:border-b-2"
  >
    <!-- <h1
      class="font-title text-fluid-hero text-main-a my-2 lg:my-4 leading-none"
    >
      <span
        class="absolute left-0 top-0 drop-shadow-[0_12px_0_var(--color-main-b-strong),0_-12px_0_var(--color-main-b-strong),0_24px_0_var(--color-main-b-strong),0_-24px_0_var(--color-main-b-strong)] pcx-grunge-full"
        >Atelier 667.</span
      >
      <span class="absolute top-0 left-0 text-main-a-strong">Atelier 667.</span>
      <span class="pcx-grunge-md">Atelier 667.</span>
    </h1> -->
    <h1
      class="font-title text-fluid-hero text-zinc-300 my-2 lg:my-4 leading-[0.75]"
    >
      <span
        class="absolute left-0 top-0 drop-shadow-[7px_7px_3px_var(--color-main-a-strong),-7px_-7px_3px_var(--color-main-b-strong)]"
        >Atelier 667<b class="font-sans">.</b></span
      >
      <span class="pcx-grunge-md">Atelier 667<b class="font-sans">.</b></span>
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
