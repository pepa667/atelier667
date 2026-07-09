import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// 1. Importa o plugin de tradução
import {ptBRLocale} from '@sanity/locale-pt-br'

export default defineConfig({
  name: 'default',
  title: 'Atelier667 Core',

  projectId: '7ev62ugl',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    ptBRLocale(), // <--- 2. Joga o plugin aqui na lista
  ],

  schema: {
    types: schemaTypes,
  },
})
