import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// 1. Importa o plugin de tradução
import {ptBRLocale} from '@sanity/locale-pt-br'
import {markdownSchema} from 'sanity-plugin-markdown' // <--- IMPORTA AQUI

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID
const dataset = import.meta.env.SANITY_STUDIO_DATASET

export default defineConfig({
  name: 'default',
  title: 'Atelier667 Core',

  projectId: projectId || '7ev62ugl', // Evita quebrar se vier undefined localmente
  dataset: dataset || 'production',

  plugins: [
    structureTool(),
    visionTool(),
    ptBRLocale(), // <--- 2. Joga o plugin aqui na lista
    markdownSchema(), // 2. Ativa o plugin de markdown
  ],

  schema: {
    types: schemaTypes,
  },
})
