# InstaScraper

Automação simples para manter feeds do Instagram atualizados em sites estáticos, sem depender da API oficial do Instagram.

O InstaScraper centraliza todo o processo de coleta e atualização, permitindo que diferentes projetos reutilizem o mesmo workflow através do GitHub Actions.

### ⚙️ O que ele faz

- Busca automaticamente os posts mais recentes
- Baixa as imagens para o projeto
- Gera um arquivo JSON com os links das publicações
- Faz commit e push das alterações automaticamente
- Pode ser reutilizado por múltiplos sites

### 🛠️ Tecnologias

**Node.js 24 · GitHub Actions · scrape.do**

> Desenvolvido como uma solução leve para integrar feeds do Instagram em projetos estáticos, mantendo todo o processo automatizado.