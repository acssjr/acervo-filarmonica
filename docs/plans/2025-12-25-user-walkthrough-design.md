# Design: Walkthrough para Usuários (Primeira Vez)

**Data:** 2025-12-25
**Status:** Aprovado

---

## Objetivo

Criar um walkthrough guiado para músicos na primeira vez que acessam a plataforma após login. Tutorial estilo spotlight sequencial, consistente com o padrão já existente no TutorialOverlay de admin.

---

## Arquitetura

### Reutilização do TutorialOverlay

O componente existente já implementa:
- Spotlight com overlay escuro e "buraco" transparente
- Tooltip animado com navegação (anterior/próximo)
- Scroll automático para elemento fora da viewport
- Detecção de posição (tooltip acima/abaixo do elemento)
- Salvamento em localStorage quando completa/pula

### Modificações

1. **Generalizar TutorialOverlay** - Extrair `steps` como prop
2. **Novo hook `useUserWalkthrough`** - Controle de exibição
3. **Suporte a ações interativas** - Callback `onStepAction` para abrir/fechar modal

### Estrutura de Arquivos

```
frontend/src/components/onboarding/
├── TutorialOverlay.jsx      (existente - generalizar)
├── UserWalkthrough.jsx      (novo - wrapper com steps)
├── useUserWalkthrough.js    (novo - hook de controle)
└── walkthroughSteps.js      (novo - definição dos 9 passos)
```

---

## Fluxo de 9 Passos

| Passo | Elemento | Seletor | Comportamento |
|-------|----------|---------|---------------|
| 1 | Barra de busca | `[data-walkthrough="search"]` | Highlight |
| 2 | Partituras destaque | `[data-walkthrough="featured"]` | Highlight |
| 3 | Categorias | `[data-walkthrough="categories"]` | Highlight |
| 4 | Botão favoritar | `[data-walkthrough="favorite-btn"]` | Highlight |
| 5 | Card de partitura | `[data-walkthrough="sheet-card"]` | **Abre modal ao avançar** |
| 6 | Download rápido | `[data-walkthrough="quick-download"]` | Highlight |
| 7 | Outras opções | `[data-walkthrough="sheet-options"]` | Highlight |
| 8 | BottomNav Favoritos | `[data-nav="favoritos"]` | **Fecha modal antes** |
| 9 | BottomNav Repertório | `[data-nav="repertorio"]` | Highlight, finaliza |

### Transição Modal (passos 5→8)

```
Passo 5: Destaca card → "Próximo" → Abre modal
Passo 6: Modal aberto → Destaca download rápido
Passo 7: Destaca opções (imprimir, enviar, outro instrumento)
Passo 8: "Próximo" → Fecha modal → Destaca Favoritos
```

---

## Conteúdo dos Tooltips

| Passo | Título | Descrição |
|-------|--------|-----------|
| 1 | Busque partituras | Digite o nome da obra, compositor ou gênero para encontrar rapidamente. |
| 2 | Destaques | Aqui aparecem as partituras recém-adicionadas e as mais acessadas. |
| 3 | Gêneros musicais | Explore por categoria: dobrados, marchas, valsas e muito mais. |
| 4 | Favorite suas partituras | Toque no coração para salvar e acessar depois rapidamente. |
| 5 | Abra uma partitura | Toque em qualquer card para ver os detalhes e opções de download. |
| 6 | Download rápido | Baixe direto a parte do seu instrumento com um toque. |
| 7 | Mais opções | Escolha outro instrumento, imprima ou envie para um colega. |
| 8 | Seus favoritos | Acesse aqui todas as partituras que você salvou. |
| 9 | Repertório | Veja as coleções organizadas para ensaios e apresentações. |

### Botões

- Durante: "Próximo" (destaque animado) + "Anterior" (discreto)
- Último passo: "Começar a explorar!"
- Sempre visível: "Pular" (texto discreto)

---

## Responsividade

| Aspecto | Mobile | Desktop |
|---------|--------|---------|
| Walkthrough ativo | Sim | Sim |
| Navegação passos 8-9 | BottomNav | Sidebar |
| Tamanho tooltip | 90% width | Max 360px |

### Seletores por Dispositivo

```javascript
// Passo 8 - Favoritos
mobile:  '[data-nav="favoritos"]'
desktop: '[data-sidebar="favoritos"]'

// Passo 9 - Repertório
mobile:  '[data-nav="repertorio"]'
desktop: '[data-sidebar="repertorio"]'
```

---

## Gatilho e Armazenamento

### Condições para Exibir

```javascript
const shouldShow =
  isAuthenticated &&
  isHomePage &&
  !hasCompletedWalkthrough &&
  !isLoading &&
  hasPartituras;
```

### LocalStorage

| Chave | Valor | Quando |
|-------|-------|--------|
| `walkthrough_user_completed` | `"true"` | Finalizar ou pular |

---

## Integração na HomeScreen

```jsx
import { UserWalkthrough } from '../components/onboarding/UserWalkthrough';

function HomeScreen() {
  const [showWalkthrough, setShowWalkthrough] = useUserWalkthrough();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);

  return (
    <>
      {/* conteúdo existente */}

      <UserWalkthrough
        isOpen={showWalkthrough}
        onClose={() => setShowWalkthrough(false)}
        onOpenModal={(sheet) => {
          setSelectedSheet(sheet);
          setModalOpen(true);
        }}
        onCloseModal={() => setModalOpen(false)}
        modalOpen={modalOpen}
      />
    </>
  );
}
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `components/onboarding/UserWalkthrough.jsx` | Criar |
| `components/onboarding/useUserWalkthrough.js` | Criar |
| `components/onboarding/walkthroughSteps.js` | Criar |
| `components/onboarding/TutorialOverlay.jsx` | Generalizar |
| `screens/HomeScreen.jsx` | Integrar |
| `components/layout/BottomNav.jsx` | data-attributes |
| `components/layout/sidebar/DesktopSidebar.jsx` | data-attributes |
| `components/music/FileCard.jsx` | data-attribute |
| `screens/home/components/*` | data-attributes |

---

## Testes Locais

1. Primeiro acesso - walkthrough aparece
2. Acesso subsequente - não aparece
3. Pular tutorial - salva e não mostra
4. Navegação completa - 9 passos sem erros
5. Interação modal - abre/fecha corretamente
6. Mobile (375px) - BottomNav funciona
7. Desktop - Sidebar funciona
8. Limpar localStorage - walkthrough reaparece

```bash
# Terminal 1
npm run api

# Terminal 2
cd frontend && npm run dev
```
