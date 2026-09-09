<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  nextTick,
  defineAsyncComponent
} from 'vue'

import Header from './components/Header.vue'
import SideScroller from './components/SideScroller.vue'
import GlitchWrapper from './components/GlitchWrapper.vue'

import applyRandomMaskPositions from './utils/maskRandomizer.js'

// Lazy loading
const Drops = defineAsyncComponent(() => import('./components/Drops.vue'))
const Projects = defineAsyncComponent(() => import('./components/Projects.vue'))
const Wiki = defineAsyncComponent(() => import('./components/Wiki.vue'))
const ArtBoard = defineAsyncComponent(() => import('./components/ArtBoard.vue'))
const BumpCard = defineAsyncComponent(() => import('./components/BumpCard.vue'))
// Componente inline simples para renderizar o card decorativo no mapeamento

// const bump_card = [
//   {
//     _id: "bump-card",
//     _type: "bump",
//     title: "GLITCH_MODULE",
//     flexStyle:
//       "grow-1 basis-auto sm:basis-[88px] bg-rose border-8 border-main-c-strong",
//   },
// ];

// Mapeamento dinâmico de componentes
const componentMap = {
  drop: Drops,
  projeto: Projects,
  documento: Wiki,
  artboard: ArtBoard,
  bump: BumpCard
}

const projetos = ref([])
const drops = ref([])
const documentos = ref([])
const arts = ref([])
const bumps = ref([
  {
    _id: 'bump-card',
    _type: 'bump',
    title: 'GLITCH_MODULE'
  }
])

// COMPUTED: Unifica o feed, ordena e intercala cards decorativos
const feedUnificado = computed(() => {
  const listDrops = drops.value.map((item) => ({
    ...item,
    _type: 'drop',
    flexStyle: 'grow-1 sm:basis-[220px] hover:flex-grow-50 ',
    date: new Date(item.timestamp || item._updatedAt || 0)
  }))

  const listWiki = documentos.value.map((item) => ({
    ...item,
    _type: 'documento',
    flexStyle: 'grow-1 flex-shrink-0 basis-auto sm:basis-[260px]',
    date: new Date(item.timestamp || item._updatedAt || 0)
  }))

  const listProjects = projetos.value.map((item) => ({
    ...item,
    _type: 'projeto',
    flexStyle: 'flex-grow-[1.7] basis-auto h=max',
    date: new Date(item._updatedAt || item.timestamp || 0)
  }))

  const listArts = arts.value.map((item) => ({
    ...item,
    _type: 'artboard',
    flexStyle: 'flex-grow-[1.5] basis-auto sm:basis-[320px] ',
    date: new Date(item.timestamp || item._updatedAt || 0)
  }))

  const listBumps = bumps.value.map((item) => ({
    ...item,
    _type: 'bump',
    flexStyle: 'grow-[1.5] basis-auto sm:basis-[40px]  ',
    date: new Date(item.timestamp || item._updatedAt || 0)
  }))

  // Lista pura ordenada por data
  const sortedFeed = [
    ...listDrops,
    ...listProjects,
    ...listWiki,
    ...listArts
  ].sort((a, b) => b.date - a.date)

  if (!sortedFeed.length) return []

  // Intercala um card decorativo a cada N itens reais
  const result = []
  let decIndex = 0

  sortedFeed.forEach((item, index) => {
    result.push(item)
    const iconInterval = Math.floor(Math.random() * 3) + 2

    // Insere a cada 3 itens se ainda houver decorativos na fila
    if ((index + 1) % iconInterval === 0) {
      console.log(listBumps, 'listBumps')

      result.push(listBumps[0] || '')
      decIndex++
    }
  })

  return result
})

// Temas
// Função que gerencia o estado do "touch-hover"

// Reage a atualizações no feed re-injetando as variáveis CSS das máscaras
watch(
  () => feedUnificado.value,
  async () => {
    await nextTick()
    applyRandomMaskPositions()
  },
  { deep: true, immediate: true }
)

onMounted(async () => {
  // Execuções com dependência direta do DOM
  document.getElementById('app')?.classList.add('before:pcx-grunge-lite')

  try {
    const { sanityClient } = await import('./sanity.js')
    const data = await sanityClient.fetch(`{
      "projetos": *[_type == "projeto"],
      "drops": *[_type == "drop"] | order(timestamp desc),
      "wiki": *[_type == "documento"] | order(timestamp desc),
      "artboard": *[_type == "artboard"]{
        ...,
        "images": images[]{
          ...,
          "width": asset->metadata.dimensions.width,
          "height": asset->metadata.dimensions.height
          }
          } | order(timestamp desc)
          }`)
    projetos.value = data.projetos || []
    drops.value = data.drops || []
    documentos.value = data.wiki || []
    arts.value = data.artboard || []
  } catch (error) {
    console.error('Erro ao buscar dados do Sanity:', error)
  }
})
</script>

<template>
  <div
    class="relative mx-auto flex max-w-[1920px] flex-row justify-between font-mono text-zinc-100 md:min-w-3xl"
  >
    <SideScroller />

    <main
      class="relative ml-[clamp(-0.5rem,-4rem+13.3333vw,2rem)] flex-1 overflow-x-hidden p-4 sm:p-8"
    >
      <Header class="mb-12" />

      <!-- 🚀 FLEX JUSTIFICADO -->
      <ol
        class="cards-list @container relative flex w-full [flex-wrap:balance] items-stretch gap-8 space-y-4 self-stretch"
      >
        <li
          v-for="item in feedUnificado"
          :key="item._id || item.title_pt || item.title"
          :class="[
            'card-item group relative flex shrink-0 grow flex-col transition-[transform,flex-grow] duration-1000 ease-in-out [--borda:3px] lg:max-w-4/12',
            item.flexStyle,
            {
              'card-projeto': item._type === 'projeto',
              'card-drop': item._type === 'drop',
              'card-artboard': item._type === 'artboard',
              'card-documento': item._type === 'documento',
              'card-bump max-h-1/2 items-center self-center':
                item._type === 'bump'
            }
          ]"
        >
          <span
            class="deco-full border-main-b-strong pcx-mix-grunge-full/grunge-full absolute -inset-(--borda) mask-[100%_100%,auto]! [--pcx-mask-1:linear-gradient(to_bottom_right,#0004,#000f_35%,#000f_60%,#0004)]"
          >
            <span></span>
          </span>
          <!-- class="pcx-grunge-full border-main-b-strong absolute -inset-0.5 border-2" -->
          <!-- Wrapper com flex-col repassa h-full / flex-1 pro componente renderizado -->

          <!-- <div class="relative inset-0 w-full h-auto flex flex-col flex-1"> -->
          <component
            v-mobile-observe="{
              activeClass: 'onView',
              hoverClass: 'fake-hover',
              threshold: 0.8,
              rootMargin: '-35% 0px'
            }"
            :is="componentMap[item._type]"
            v-bind="
              item._type === 'drop'
                ? { drops: [item] }
                : item._type === 'projeto'
                  ? { projetos: [item] }
                  : item._type === 'documento'
                    ? { documentos: [item] }
                    : item._type === 'artboard'
                      ? { arts: [item] }
                      : item._type === 'bump'
                        ? { bumps: [item] }
                        : {}
            "
            class="h-auto w-full flex-1 border border-transparent"
          />
          <!-- </div> -->

          <!-- Glitch isolado apenas nos layers de fundo -->

          <span
            class="deco-tr pcx-mix-tr/grunge-full border-main-a absolute -top-(--borda) -right-(--borda) h-4/7 w-2/3 mask-[top_right]"
            >&nbsp;</span
          >
          <span
            class="deco-tr border-main-c-strong absolute -top-(--borda) -right-(--borda) h-1/9 w-1/9 mask-[linear-gradient(to_bottom_left,#000,#0000)]"
            >&nbsp;</span
          >
          <span
            class="deco-bl pcx-mix-bl/bl border-main-a ] absolute -bottom-(--borda) -left-(--borda) h-7/12 w-2/5"
            >&nbsp;</span
          >
          <span
            class="deco-bl border-main-c-strong absolute -bottom-(--borda) -left-(--borda) h-1/9 w-1/9 mask-[linear-gradient(to_top_right,#000,#0000)]"
            >&nbsp;</span
          >
        </li>
      </ol>
    </main>
  </div>

  <footer
    class="absolute bottom-0 h-56 w-full"
    v-mobile-observe="{
      activeClass: 'onView',
      hoverClass: 'fake-hover',
      threshold: 0.8,
      rootMargin: '0px'
    }"
  >
    <GlitchWrapper :trigger-probability="0.4" :trigger-duration="0.5">
      <div class="pcx-bt bg-main-d-strong absolute inset-0">:::</div>
    </GlitchWrapper>
  </footer>
</template>
