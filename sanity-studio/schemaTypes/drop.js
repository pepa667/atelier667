export default {
    name: 'drop',
    title: 'Microblog / Drops',
    type: 'document',
    fields: [
        {
            name: 'content',
            title: 'Conteúdo do Drop',
            type: 'text',
            validation: Rule => Rule.required().max(280)
        },
        {
            name: 'timestamp',
            title: 'Data/Hora',
            type: 'datetime',
            initialValue: () => new Date().toISOString()
        }
    ]
}