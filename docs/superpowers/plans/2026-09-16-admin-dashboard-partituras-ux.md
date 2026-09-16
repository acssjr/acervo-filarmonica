# Admin Dashboard and Partituras UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tornar o painel administrativo orientado às tarefas mais frequentes e deixar a gestão de partituras mais clara, acessível e estável durante atualizações.

**Architecture:** Manter a navegação e APIs atuais, reorganizar apenas a camada React/CSS e trocar recargas destrutivas da lista por atualizações em segundo plano. Os estados de filtro, expansão e posição de rolagem permanecem no componente da tela para evitar mudanças de backend.

**Tech Stack:** React 18, React Router, Jest/Testing Library, CSS responsivo, API atual do Acervo.

---

### Task 1: Reorientar o dashboard para tarefas

- [ ] Atualizar os testes de `frontend/src/screens/admin/AdminDashboard.test.jsx` para exigir Partituras, Repertório e Presença como ações principais e Analytics como acesso secundário.
- [ ] Executar o teste e confirmar a falha esperada.
- [ ] Refatorar `frontend/src/screens/admin/AdminDashboard.jsx` e seus componentes para criar o centro de ações e estatísticas compactas.
- [ ] Criar estilos responsivos e compatíveis com tema claro/escuro em `frontend/src/screens/admin/admin-dashboard.css`.
- [ ] Executar novamente os testes do dashboard.

### Task 2: Clarificar busca, filtros e resultados de Partituras

- [ ] Criar testes comportamentais para rótulos acessíveis, limpeza de filtros e pluralização.
- [ ] Confirmar que os testes falham antes da implementação.
- [ ] Reorganizar a barra de ferramentas em `frontend/src/screens/admin/AdminPartituras.jsx`, com título instrutivo, rótulos, contraste e filtros ativos claros.
- [ ] Adicionar estilos responsivos em `frontend/src/screens/admin/admin-partituras.css`.
- [ ] Garantir ordenação imutável e lista otimizada com `content-visibility`.

### Task 3: Tornar expansão e edição inequívocas

- [ ] Adicionar teste para o controle semântico “Gerenciar partes”, incluindo `aria-expanded`.
- [ ] Transformar o cabeçalho do card em controle de expansão acessível.
- [ ] Diferenciar explicitamente “Editar informações” das ações sobre as partes e adicionar nomes acessíveis aos botões.
- [ ] Validar teclado, foco e alvos de toque.

### Task 4: Preservar contexto após upload e alterações

- [ ] Adicionar teste para atualização em segundo plano sem desmontar a lista.
- [ ] Separar carregamento inicial de atualização silenciosa.
- [ ] Manter partitura expandida e âncora visual após recarregar dados.
- [ ] Fazer `UploadPastaModal` devolver o ID criado e atualizar a tela sem voltar ao topo.

### Task 5: Verificação final

- [ ] Executar testes focados, lint e build do frontend.
- [ ] Executar o detector do Impeccable sobre os arquivos alterados e corrigir achados relevantes.
- [ ] Inspecionar dashboard e Partituras no localhost em tema claro e escuro, desktop e largura móvel, sem realizar mutações na API de produção.
- [ ] Revisar o diff para preservar funcionalidades e arquivos não relacionados.

### Task 6: Refinar hierarquia após validação com o usuário

- [ ] Agrupar e reordenar o menu administrativo por frequência e intenção.
- [ ] Tornar os três acessos rápidos explicitamente acionáveis.
- [ ] Compactar o ranking para três posições.
- [ ] Aumentar sutilmente a separação dos cartões no tema claro e adaptar os ícones ao tema.
- [ ] Substituir o texto genérico de partes por `Ver e editar N partes`.
- [ ] Revalidar temas claro/escuro, testes, lint e build.
