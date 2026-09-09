<script setup>
import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityClient } from '../sanity.js'
import { computed, nextTick, onMounted, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  projetos: {
    type: Array,
    default: () => []
  }
})

const proj = computed(() => props.projetos[0] || null)

const builder = createImageUrlBuilder(sanityClient)
const categoryRefs = ref({})
const categoryContainerRefs = ref({})
const overflowingCategories = ref({})

const urlFor = (source) => {
  return source ? builder.image(source).auto('format').fit('max').url() : ''
}

const getAsciiBar = (percent) => {
  const safePercent = percent || 0
  const maxBars = 19
  const filled = Math.round((safePercent / 100) * maxBars)
  const empty = maxBars - filled
  return `[<span>${'█'.repeat(filled)}</span><span class="relative" >░<span class="absolute inset-0 [animation:_pulse_0.5s_cubic-bezier(0,_0,_0.2,_1)_infinite] text-main-d-strong">█</span></span><span>${'░'.repeat(empty)}</span>] ${safePercent}%`
}

const getCategories = (entry) => {
  const categories = entry?.categorias || []
  const projId = entry._id || entry.title_pt

  return overflowingCategories.value[projId]
    ? [...categories, ...categories]
    : categories
}

const initOverflow = async () => {
  Object.keys(overflowingCategories.value).forEach((projId) => {
    overflowingCategories.value[projId] = false
  })

  await nextTick()

  if (resizeObserver) {
    Object.values(categoryContainerRefs.value).forEach((container) => {
      if (container) resizeObserver.observe(container)
    })
  }

  Object.entries(categoryRefs.value).forEach(([projId, list]) => {
    if (!list) return

    const container = categoryContainerRefs.value[projId]
    if (!container) return

    overflowingCategories.value[projId] =
      list.scrollWidth > container.clientWidth + 1
  })
}

let resizeObserver

onMounted(() => {
  initOverflow()

  resizeObserver = new ResizeObserver(() => {
    initOverflow()
  })

  Object.values(categoryContainerRefs.value).forEach((container) => {
    resizeObserver.observe(container)
  })

  window.addEventListener('resize', initOverflow)
})

watch(
  () => props.projetos,
  () => {
    initOverflow()
  },
  { deep: true, flush: 'post' }
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', initOverflow)
})

/* 🎯 Medição via Elemento Fantasma sem interferência da imagem */
// const aspectMap = ref({});

// const vAspect = {
//   mounted(el, binding) {
//     const key = binding.value;

//     const observer = new ResizeObserver((entries) => {
//       requestAnimationFrame(() => {
//         for (const entry of entries) {
//           const { width, height } = entry.contentRect;

//           if (width === 0 || height === 0) return;

//           // Se a altura for maior ou igual à largura, consideramos Portrait
//           aspectMap.value[key] = {
//             isPortrait: height >= width,
//             ready: true,
//           };
//         }
//       });
//     });

//     observer.observe(el);
//     el._observer = observer;
//   },
//   unmounted(el) {
//     if (el._observer) el._observer.disconnect();
//   },
// };
</script>

<!-- class="relative flex aspect-video! h-max! min-h-max w-auto! flex-col justify-between gap-4 lg:max-w-max!" -->

<template>
  <!-- <article v-for="proj in projetos" class="relative w-full h-full group flex"> -->
  <article
    class="group relative flex h-max min-h-auto min-w-auto"
    v-mobile-observe="{
      threshold: 0.6,
      rootMargin: '-50% 0px -20% 0px'
    }"
  >
    <figure
      :key="proj._id || proj.title_pt"
      class="pcx-grunge-md gr absolute top-0 right-0 z-0 h-full w-auto overflow-hidden mask-auto transition-all transition-discrete group-hover:z-10 group-hover:delay-500 group-[.onView]:z-100"
    >
      <a href="" class="relative h-full w-auto overflow-hidden">
        <img
          :src="urlFor(proj.coverImage)"
          :alt="proj.coverImage?.alt || proj.title_pt"
          class="aspect-square h-full w-auto object-cover opacity-30 transition-opacity duration-2000 group-hover:opacity-100 group-[.onView]:opacity-100"
        />
      </a>
    </figure>

    <main
      class="relative flex h-max w-full flex-col justify-between gap-4 transition-opacity duration-700 group-hover:pointer-events-none group-hover:opacity-50 group-[.onView]:pointer-events-none group-[.onView]:opacity-50"
    >
      <header class="relative flex-col bg-zinc-950/80 p-4">
        <h2
          class="text-main-b inline-block bg-black text-sm leading-loose font-bold tracking-wider uppercase"
        >
          //&nbsp;PROJETOS_ATIVOS
        </h2>
      </header>
      <figure
        class="relative flex h-max w-full flex-col flex-wrap justify-around gap-4 bg-zinc-950/80 p-6 pr-0"
      >
        <header class="text-main-c text-xl font-bold uppercase">
          {{ proj.title_pt }}
        </header>
        <main>
          <h4 class="font-mono text-lg">
            STATUS:
            <span class="text-main-d font-bold"
              >&lt;{{ proj.status || 'STANDBY' }}&nbsp;&sol;&gt;</span
            >
          </h4>
          <h4 class="font-mono text-lg">
            LAST UPDATE:
            <span class="text-main-d font-bold"
              >&lt;{{ proj._updatedAt || 'STANDBY' }}&nbsp;&sol;&gt;</span
            >
          </h4>
        </main>
        <footer
          class="font-slab *:text-main-d *: inline-flex items-center text-xs text-green-500 *:inline-flex *:font-['Lucida_Console',ui-sans-serif] *:tracking-[2px] *:[text-box:trim-both_text]"
          v-html="getAsciiBar(proj.progresso)"
        ></footer>
      </figure>
      <!-- Categorias -->
      <footer
        :ref="(el) => (categoryContainerRefs[proj._id || proj.title_pt] = el)"
        class="relative flex h-max min-h-min items-center justify-end overflow-x-hidden overflow-y-clip bg-zinc-950/80 py-4"
        :class="{
          'justify-between!': overflowingCategories[proj._id || proj.title_pt]
        }"
      >
        <ul
          v-if="proj.categorias && proj.categorias.length"
          :ref="(el) => (categoryRefs[proj._id || proj.title_pt] = el)"
          :class="{
            'animate-marquee': overflowingCategories[proj._id || proj.title_pt]
          }"
          class="project-categories relative mx-2 h-full min-h-min list-none font-light tracking-wider whitespace-nowrap uppercase"
        >
          <li
            v-for="(cat, index) in getCategories(proj)"
            :key="`${proj._id || proj.title_pt}-${cat}-${index}`"
            class="bg-main-d/25 text-main-d border-main-d relative mx-2 my-1 inline-block rounded border px-3 py-2 text-xs"
          >
            #{{ cat }}
          </li>
        </ul>
      </footer>
    </main>
  </article>
</template>
