import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
// 1. Importa o plugin de tradução
import {ptBRLocale} from '@sanity/locale-pt-br'
import {markdownSchema} from 'sanity-plugin-markdown' // 1. Importa o plugin

export default defineConfig({
  name: 'default',
  title: 'Atelier667 Core',

  projectId: '7ev62ugl',
  dataset: 'production',

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
