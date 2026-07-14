export default {
  name: 'documento',
  title: 'Documentos & Estudos (Wiki)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Documento',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtítulo / Resumo Rápido',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Categoria Principal',
      type: 'string',
      options: {
        list: [
          {title: 'Hardware', value: 'hardware'},
          {title: 'Software', value: 'software'},
          {title: 'Firmware', value: 'firmware'},
          {title: 'CNC & Laser', value: 'cnc-laser'},
          {title: 'Design & Vetor', value: 'design-vetor'},
          {title: 'Insights', value: 'insights'},
          {title: 'Estudos', value: 'estudos'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'tags',
      title: 'Tags para Google SEO',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'content',
      title: 'Conteúdo em Markdown',
      type: 'markdown',
      description: 'O texto longo do artigo/documentação tecnica.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'timestamp',
      title: 'Data de Publicação',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
  ],
}
