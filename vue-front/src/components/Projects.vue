<script setup>
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "../sanity.js";
import { nextTick, onMounted, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps({
  projetos: {
    type: Array,
    default: () => [],
  },
});

const builder = createImageUrlBuilder(sanityClient);
const categoryRefs = ref({});
const categoryContainerRefs = ref({});
const overflowingCategories = ref({});

const urlFor = (source) => {
  return source ? builder.image(source).auto("format").fit("max").url() : "";
};

const getAsciiBar = (percent) => {
  const safePercent = percent || 0;
  const maxBars = 20;
  const filled = Math.round((safePercent / 100) * maxBars);
  const empty = maxBars - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}] ${safePercent}%`;
};

const getCategories = (proj) => {
  const categories = proj?.categorias || [];
  const projId = proj._id || proj.title_pt;

  return overflowingCategories.value[projId]
    ? [...categories, ...categories]
    : categories;
};

const initOverflow = async () => {
  Object.keys(overflowingCategories.value).forEach((projId) => {
    overflowingCategories.value[projId] = false;
  });

  await nextTick();

  if (resizeObserver) {
    Object.values(categoryContainerRefs.value).forEach((container) => {
      if (container) resizeObserver.observe(container);
    });
  }

  Object.entries(categoryRefs.value).forEach(([projId, list]) => {
    if (!list) return;

    const container = categoryContainerRefs.value[projId];
    if (!container) return;

    overflowingCategories.value[projId] =
      list.scrollWidth > container.clientWidth + 1;
  });
};

let resizeObserver;

onMounted(() => {
  initOverflow();

  resizeObserver = new ResizeObserver(() => {
    initOverflow();
  });

  Object.values(categoryContainerRefs.value).forEach((container) => {
    resizeObserver.observe(container);
  });

  window.addEventListener("resize", initOverflow);
});

watch(
  () => props.projetos,
  () => {
    initOverflow();
  },
  { deep: true, flush: "post" },
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener("resize", initOverflow);
});

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

<template>
  <article
    v-for="proj in projetos"
    :key="proj._id || proj.title_pt"
    class="relative w-full h-full group flex"
  >
    <figure
      v-aspect="proj._id || proj.title_pt"
      class="absolute top-0 right-0 h-full aspect-square"
    >
      <a
        href=""
        class="opacity-50 group-hover:opacity-100 group-[.onView]:opacity-100 transition-opacity duration-700"
      >
        <img
          :src="urlFor(proj.coverImage)"
          :alt="proj.coverImage?.alt || proj.title_pt"
          class="absolute object-cover w-full h-full inset-0"
        />
      </a>
    </figure>

    <main
      class="relative w-auto h-full flex flex-col overflow-hidden justify-between group-hover:opacity-50 group-[.onView]:opacity-50 group-hover:pointer-events-none group-[.onView]:pointer-events-none transition-opacity duration-700"
    >
      <header class="relative p-4 bg-zinc-950/80 flex-col">
        <h2
          class="text-sm font-bold text-main-b leading-loose inline-block bg-black tracking-wider uppercase"
        >
          //&nbsp;PROJETOS_ATIVOS
        </h2>
      </header>
      <figure
        class="relative m-4 p-6 w-fit h-full flex flex-col flex-wrap gap-6 justify-around bg-zinc-950/80"
      >
        <h3 class="text-xl font-bold text-zinc-100 uppercase">
          {{ proj.title_pt }}
        </h3>
        <h4 class="text-lg font-mono">
          STATUS:
          <span class="text-main-d font-bold"
            >&lt;{{ proj.status || "STANDBY" }}&sol;&gt;</span
          >
        </h4>
        <div class="font-mono text-green-500">
          {{ getAsciiBar(proj.progresso) }}
        </div>
      </figure>
      <!-- Categorias -->
      <footer
        :ref="(el) => (categoryContainerRefs[proj._id || proj.title_pt] = el)"
        class="flex items-center justify-between overflow-hidden p-4 bg-zinc-950/80"
      >
        <ul
          v-if="proj.categorias && proj.categorias.length"
          :ref="(el) => (categoryRefs[proj._id || proj.title_pt] = el)"
          :class="{
            'animate-marquee': overflowingCategories[proj._id || proj.title_pt],
          }"
          class="project-categories list-none whitespace-nowrap uppercase tracking-wider font-light"
        >
          <li
            v-for="(cat, index) in getCategories(proj)"
            :key="`${proj._id || proj.title_pt}-${cat}-${index}`"
            class="text-xs bg-main-b/25 text-main-b mx-2 my-1 py-2 px-3 border rounded border-main-b inline-block"
          >
            #{{ cat }}
          </li>
        </ul>
      </footer>
    </main>
  </article>
</template>
