export default {
    name: 'projeto',
    title: 'Projetos Maker',
    type: 'document',
    fields: [
        {
            name: 'title_pt',
            title: 'Título (Português)',
            type: 'string',
            validation: Rule => Rule.required()
        },
        {
            name: 'title_en',
            title: 'Título (Inglês)',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title_pt',
                maxLength: 96
            },
            validation: Rule => Rule.required()
        },
        {
            name: 'status',
            title: 'Status',
            type: 'string',
            options: {
                list: [
                    { title: 'Concluído', value: 'concluido' },
                    { title: 'Em Desenvolvimento', value: 'desenvolvimento' },
                    { title: 'Pausado', value: 'pausado' }
                ]
            }
        },
        {
            name: 'progresso',
            title: 'Progresso (%)',
            type: 'number',
            validation: Rule => Rule.min(0).max(100)
        },
        {
            name: 'categoria',
            title: 'Categoria',
            type: 'string',
            options: {
                list: [
                    { title: 'Marcenaria', value: 'marcenaria' },
                    { title: 'Impressão 3D', value: '3d' },
                    { title: 'Eletrônica', value: 'eletronica' },
                    { title: 'Programação', value: 'programacao' }
                ]
            }
        },
        {
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            name: 'mainImage',
            title: 'Imagem Principal',
            type: 'image',
            options: {
                hotspot: true
            }
        },
        {
            name: 'log_pt',
            title: 'Log Técnico (Português)',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image' }
            ]
        }
    ]
}