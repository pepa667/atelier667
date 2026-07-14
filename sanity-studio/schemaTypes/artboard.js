export default {
  name: 'artboard',
  title: 'ArtBoard (Feed)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Post',
      type: 'string',
      description: 'Usado internamente e para gerar a URL amigável',
      validation: (Rule) => Rule.required(),
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
      name: 'caption',
      title: 'Legenda / Texto do Post',
      type: 'markdown',
    },
    {
      name: 'images',
      title: 'Imagens (Carrossel)',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.required().min(1),
    },
    {
      name: 'externalLink',
      title: 'Link Externo (Opcional)',
      type: 'url',
      description: 'Link para portfólio externo, repositório ou post original',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    },
    {
      name: 'timestamp',
      title: 'Data do Post',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
  ],
}
