export default {
  name: 'projeto',
  title: 'Projetos',
  type: 'document',
  fields: [
    // ─── IDENTIFICAÇÃO & MÍDIA ──────────────────────────────────────────
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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title_pt',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'githubLink',
      title: 'Link do Repositório GitHub',
      type: 'url',
    },
    {
      name: 'status',
      title: 'Etapa de Produção',
      type: 'string',
      options: {
        list: [
          {title: 'Ideação', value: 'ideacao'},
          {title: 'Em Progresso', value: 'desenvolvimento'},
          {title: 'Pausado', value: 'pausado'},
          {title: 'Concluído', value: 'concluido'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'progresso',
      title: 'Barra de Progresso (%)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(100),
    },
    {
      name: 'mainImage',
      title: 'Imagem de Destaque (Capa)',
      type: 'image',
      options: {hotspot: true},
    },

    // ─── CATEGORIAS PREDEFINIDAS ────────────────────────────────────────
    {
      name: 'categorias',
      title: 'Categorias do Projeto',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'WebDev (Websites/NodeJS/ReactJS)', value: 'webdev'},
          {title: 'Software (Web/Docker/APIs)', value: 'software'},
          {title: 'Hardware (Eletrônica/Circuitos)', value: 'hardware'},
          {title: 'Impressão 3D (PLA/PETG/Fatiamento)', value: '3d-printing'},
          {title: 'CNC Laser (Router/MDF/Acrílico)', value: 'cnc-laser'},
          {title: 'Retro Modding (Consoles/Botões/Telas)', value: 'retro-mod'},
          {title: 'Firmware (Microcontroladores/C++)', value: 'firmware'},
          {title: 'Arcade (Controles/Fiação/Sanwa)', value: 'arcade'},
          {title: 'Marcenaria (Gabinete/Bancada)', value: 'woodworking'},
          {title: 'DevOps (Deploy/CI-CD/Netlify)', value: 'devops'},
          {title: 'Ilustração (Vetor/Identidade Visual)', value: 'ilustracao'},
          {title: 'Modelagem (CAD/Fusion360/Blender)', value: 'modelagem'},
        ],
      },
    },

    // ─── VISÃO GERAL (MARKDOWN) ─────────────────────────────────────────
    {
      name: 'escopo',
      title: 'Escopo do Projeto (Readme)',
      type: 'markdown', // Campo habilitado pelo plugin
    },

    // ─── LINHA DO TEMPO / LOGS VISUAIS ──────────────────────────────────
    {
      name: 'linhaDoTempo',
      title: 'Linha do Tempo (Logs Técnicos)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'logItem',
          title: 'Registro de Log',
          fields: [
            {
              name: 'timestamp',
              title: 'Data do Registro',
              type: 'datetime',
              initialValue: () => new Date().toISOString(),
            },
            {
              name: 'tituloLog',
              title: 'Sumário Curto do Update',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'textoLog',
              title: 'Relatório da Iteração (Markdown)',
              type: 'markdown', // Markdown ativo nos logs individuais
            },
            {
              name: 'galeria',
              title: 'Galeria de Imagens deste Log',
              type: 'array',
              of: [
                {
                  type: 'image',
                  options: {hotspot: true},
                  fields: [
                    {
                      name: 'alt',
                      title: 'Texto Alternativo (Acessibilidade)',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
