export default {
  name: 'drop',
  title: 'Drops',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Drop',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Conteúdo do Drop (Texto Curto/Markdown)',
      type: 'markdown',
      validation: (Rule) => Rule.required().max(280),
    },
    {
      name: 'timestamp',
      title: 'Data e Hora',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    },
  ],
}
