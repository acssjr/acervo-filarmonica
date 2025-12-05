# Changelog - Acervo Digital
## Sociedade Filarmônica 25 de Março
### Desenvolvido por Antônio Júnior

---

## [1.5.0] - 29/11/2025 (Atual)

### Adicionado
- Modal "Sobre" completo com informações do desenvolvedor
- Validação para impedir PIN igual ao anterior na alteração
- Espaçamento entre cards de partituras no mobile

### Alterado
- Reorganização das seções do Perfil: Conta → Contato → Sobre
- Contato renomeado para "Contato com o desenvolvedor"
- Ano de fundação corrigido para 1868 (era 1925)
- Velocidade do marquee reduzida (mais lento)

### Corrigido
- Animação do card não ativa mais ao clicar no coração de favoritos
- Botão de download agora abre o modal corretamente
- Checkbox "Lembrar meu acesso" clicável pelo texto

---

## [1.4.0] - 29/11/2025

### Adicionado
- Tela de Perfil completa com:
  - Foto de perfil (upload e armazenamento local)
  - Edição de nome do usuário
  - Modal de alteração de PIN em 3 etapas
  - Seções organizadas: Conta, Contato, Sobre
- Perfil movido para final da sidebar no desktop
- Contato via WhatsApp (75 98123-4176)

### Alterado
- Tema no mobile: clique direto cicla entre Claro → Escuro → Sistema
- Removida seção "Aparência" do Perfil (tema fica no header)

---

## [1.3.0] - 29/11/2025

### Adicionado
- Sistema de login com usuário + PIN de 4 dígitos
- Auto-login quando PIN é completado
- Checkbox "Lembrar meu acesso" (salva username)
- Tela de login com design glassmorphism vinho
- 4 usuários de demonstração cadastrados

### Alterado
- Login refatorado de email/senha para username/PIN
- Nome e instrumento do usuário aparecem dinamicamente na Home

### Corrigido
- Otimização da tela de login para mobile com teclado virtual
- Scroll automático quando input recebe foco
- Prevenção de zoom automático no iOS (fontSize 16px)

---

## [1.2.0] - 29/11/2025

### Adicionado
- Seletor de tema com 3 opções: Claro, Escuro, Sistema
- Contador de próximo ensaio (ex: "2d 9h 11m")
- Tela de login inicial com glassmorphism
- Integração do seletor de tema no header mobile e sidebar desktop

### Alterado
- Toggle de tema movido para header (era no perfil)

### Corrigido
- Bug de re-render nos featured cards ao favoritar
- Animações de clique em modais e botões

---

## [1.1.0] - 29/11/2025

### Adicionado
- Modal de detalhes da partitura com informações completas
- Seletor de instrumentos para download (27 instrumentos)
- Confirmação antes do download com instrumento selecionado
- Sistema de favoritos persistente (localStorage)
- Indicador de arraste nos FeaturedCards ("Arraste →")

### Alterado
- Velocidade do scroll automático dos cards ajustada
- Featured cards agora suportam clique E arrasto sem conflito

### Corrigido
- Conflito entre clique e drag nos featured cards
- Separação de responsabilidades usando refs e dataset

---

## [1.0.0] - 29/11/2025

### Adicionado - Layout Desktop
- Sidebar fixa com navegação e filtros
- Toggle para recolher sidebar (260px ↔ 72px)
- Seção de Gêneros recolhível com emojis
- Seção de Compositores recolhível com filtro
- Logo "S.F. 25 de Março" na sidebar
- Header desktop com busca em tempo real
- Grid responsivo de cards (3 colunas)

### Alterado
- Layout completamente responsivo (mobile/tablet/desktop)
- Sidebar com scroll isolado do conteúdo principal

### Corrigido
- Bugs de largura em cascata no grid
- Fonte Outfit aplicada em todos componentes

---

## [0.9.0] - 29/11/2025

### Adicionado
- Sistema de notificações com painel deslizante
- Badge de notificações não lidas
- Notificações de exemplo (novas partituras, ensaios)
- Marcar todas como lidas

### Alterado
- Toggle de tema movido para header
- Glassmorphism no navbar mobile

---

## [0.8.0] - 28/11/2025

### Adicionado
- Header da Home redesenhado
- Destaque para nome e instrumento do usuário
- Saudação personalizada ("Olá, [Nome]")
- Badge de instrumento (ex: "CLARINETE")

### Alterado
- Visual mais pessoal e acolhedor na home

---

## [0.7.0] - 28/11/2025

### Adicionado
- Seção "Em Destaque" com cards horizontais
- Auto-scroll suave nos cards em destaque
- Indicadores visuais de navegação
- Efeito edge lighting dourado nos cards

### Alterado
- Cards de categoria com altura reduzida
- Espaçamentos otimizados para mobile

---

## [0.6.0] - 28/11/2025

### Adicionado
- Sistema de Favoritos (coração nos cards)
- Tela de Favoritos dedicada
- Persistência de favoritos no localStorage
- Busca fuzzy com algoritmo Levenshtein
- Seção "Partituras Populares"
- Seção "Estatísticas do Acervo"

---

## [0.5.0] - 28/11/2025

### Adicionado
- Tema claro/escuro
- Persistência de preferência de tema
- Transições suaves entre temas
- Variáveis CSS para cores dinâmicas

---

## [0.4.0] - 28/11/2025

### Adicionado
- Painel Admin para adicionar partituras
- Modal de upload com campos:
  - Título, Compositor, Categoria, Ano
  - Seletor de arquivo PDF
- Validação de campos obrigatórios
- Toast de confirmação

---

## [0.3.0] - 28/11/2025

### Adicionado
- Tela de Busca com resultados em tempo real
- Busca por título e compositor
- Contador de resultados
- Estado vazio com ícone

---

## [0.2.0] - 28/11/2025

### Adicionado
- Tela de Acervo/Biblioteca
- Grid de categorias clicáveis
- Filtro por categoria
- Listagem de partituras por categoria
- Navegação com botão voltar

---

## [0.1.0] - 28/11/2025

### Adicionado - Versão Inicial
- Estrutura base do projeto em React
- 8 categorias musicais:
  - 🎺 Dobrado
  - 🥁 Marcha
  - 💃 Valsa
  - ✨ Fantasia
  - 🎭 Polaca
  - 🌹 Bolero
  - 🎸 Música Popular
  - ⛪ Hinos Religiosos
- 14 partituras de exemplo
- Bottom navigation mobile (4 abas)
- Cards de categoria com cores únicas
- Cards de partitura com compositor e ano
- Tela Home com estatísticas
- Sistema de Toast para notificações
- LocalStorage para persistência
- PWA ready (manifest.json)
- Design escuro com detalhes dourados
- Fonte tipográfica: DM Sans + Cormorant Garamond

---

## Tecnologias Utilizadas

- **Frontend**: React 18 (via CDN)
- **Estilização**: CSS-in-JS + CSS Variables
- **Fonte**: Outfit (Google Fonts)
- **Armazenamento**: LocalStorage
- **Ícones**: SVG customizados

---

## Créditos

**Desenvolvido por**: Antônio Júnior  
**Para**: Sociedade Filarmônica 25 de Março  
**Localização**: Feira de Santana - BA  
**Fundação**: 1868

---

*Última atualização: 29/11/2025*
