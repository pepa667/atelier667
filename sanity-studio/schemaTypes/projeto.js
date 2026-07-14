export default {
  name: 'projeto',
  title: 'Projetos',
  type: 'document',
  fields: [
    {
      name: 'title_pt',
      title: 'Título (PT-BR)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title_en',
      title: 'Título (EN)',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title_pt',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'status',
      title: 'Status do Projeto',
      type: 'string',
      options: {
        list: [
          {title: 'Rascunho', value: 'rascunho'},
          {title: 'Em Desenvolvimento', value: 'desenvolvimento'},
          {title: 'Pausado', value: 'pausado'},
          {title: 'Concluído', value: 'concluido'},
        ],
      },
      initialValue: 'rascunho',
    },
    {
      name: 'progresso',
      title: 'Progresso (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'githubLink',
      title: 'Link do GitHub',
      type: 'url',
    },
    // 1. CATEGORIAS PREDEFINIDAS (Geram os links vivos de navegação)

    {
      name: 'categorias',
      title: 'Categorias Principais do Projeto',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Selecione as disciplinas principais deste projeto.',
      options: {
        list: [
          {title: 'Comercial (Produtos/Vendas/Open Hardware)', value: 'comercial'},
          {title: 'WebDev (Websites/NodeJS/ReactJS)', value: 'webdev'},
          {title: 'Software (Web/Docker/APIs)', value: 'software'},
          {title: 'Firmware (Microcontroladores/C++)', value: 'firmware'},
          {title: 'Hardware (Eletrônica/Circuitos)', value: 'hardware'},
          {title: 'DevOps (Deploy/CI-CD/Netlify)', value: 'devops'},
          {title: 'Modelagem (CAD/Fusion360/Blender)', value: 'modelagem'},
          {title: 'Impressão 3D (PLA/PETG/Fatiamento)', value: '3d-printing'},
          {title: 'CNC Laser (Router/MDF/Acrílico)', value: 'cnc-laser'},
          {title: 'Marcenaria (Gabinete/Bancada)', value: 'woodworking'},
          {title: 'Retro Modding (Consoles/Botões/Telas)', value: 'retro-mod'},
          {title: 'Ilustração (Vetor/Identidade Visual)', value: 'ilustracao'},
        ],
      },
    },

    // 2. TAGS PERSONALIZADAS (Apenas para indexação do Google / SEO)
    {
      name: 'tagsSeo',
      title: 'Tags personalizadas para SEO',
      type: 'array',
      of: [{type: 'string'}],
      description:
        'Tags livres para ajudar no robô do Google (ex: esp32, nintendo, react, rpi). Não aparecem no layout.',
      options: {
        layout: 'tags', // Transforma a interface do Sanity naquele input de badges estilo tag
      },
    },
    {
      name: 'escopo',
      title: 'Escopo do Projeto (Markdown)',
      type: 'markdown',
      description: 'Este texto será o README.MD principal do projeto.',
    },

    {
      name: 'linhaDoTempo',
      title: 'Linha do Tempo (Logs Técnicos)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'logItem',
          title: 'Log de Atualização',
          fields: [
            {
              name: 'tituloLog',
              title: 'Título do Log',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'timestamp',
              title: 'Data/Hora do Log',
              type: 'datetime',
              validation: (Rule) => Rule.required(),
            },
            // ADICIONADO: Categorias específicas para este LOG
            {
              name: 'categoriasLog',
              title: 'Categorias Deste Log',
              type: 'array',
              of: [{type: 'string'}],
              description:
                'Se aplicou alguma disciplina específica neste dia (ex: fez a case de madeira, marque Marcenaria aqui).',
              options: {
                list: [
                  {title: 'Comercial (Produtos/Vendas/Open Hardware)', value: 'comercial'},
                  {title: 'WebDev (Websites/NodeJS/ReactJS)', value: 'webdev'},
                  {title: 'Software (Web/Docker/APIs)', value: 'software'},
                  {title: 'Firmware (Microcontroladores/C++)', value: 'firmware'},
                  {title: 'Hardware (Eletrônica/Circuitos)', value: 'hardware'},
                  {title: 'DevOps (Deploy/CI-CD/Netlify)', value: 'devops'},
                  {title: 'Modelagem (CAD/Fusion360/Blender)', value: 'modelagem'},
                  {title: 'Impressão 3D (PLA/PETG/Fatiamento)', value: '3d-printing'},
                  {title: 'CNC Laser (Router/MDF/Acrílico)', value: 'cnc-laser'},
                  {title: 'Marcenaria (Gabinete/Bancada)', value: 'woodworking'},
                  {title: 'Retro Modding (Consoles/Botões/Telas)', value: 'retro-mod'},
                  {title: 'Ilustração (Vetor/Identidade Visual)', value: 'ilustracao'},
                ],
              },
            },
            {
              name: 'textoLog',
              title: 'Texto do Log (Markdown)',
              type: 'markdown',
            },
            {
              name: 'galeria',
              title: 'Imagens do Log',
              type: 'array',
              of: [{type: 'image', options: {hotspot: true}}],
            },
          ],
        },
      ],
    },
  ],
}
