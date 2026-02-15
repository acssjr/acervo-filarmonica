# Desktop Layout Visual Bugs - Comparison Report
Generated: 2026-02-08 13:10:30

## RESUMO EXECUTIVO

A migracao dos componentes de layout desktop esta 80% completa - os componentes React foram migrados corretamente, mas o CSS CRITICO foi esquecido.

### Bugs Identificados e Causas

1. **Sidebar scrollbar bugado** 
   - Causa: CSS de customizacao da scrollbar (.desktop-sidebar-content::-webkit-scrollbar) nao foi migrado
   
2. **Elementos fora de lugar**
   - Causa: CSS global das classes .desktop-layout, .desktop-sidebar, .desktop-main nao existe no frontend-next
   
3. **Layout quebrado/sem profundidade visual**
   - Causa: Estilos perdidos (backdrop-filter, box-shadow, border-right, padding) durante migracao

---

## DIFERENCA 1: CSS GLOBAL DE LAYOUT AUSENTE

### ORIGINAL: frontend/src/styles/layout.css (linhas 29-83)

O arquivo layout.css contem TODA a estrutura CSS do desktop layout em media query @media (min-width: 1024px):

- .desktop-layout (display: flex, min-height: 100vh, etc)
- .desktop-sidebar (position: fixed, background gradient, backdrop-filter, border, padding, box-shadow)
- .desktop-sidebar-content (scrollbar customizado completo)
- .desktop-main (padding, min-height, overscroll-behavior)

### MIGRADO: frontend-next/app/globals.css

NENHUMA das classes acima existe no globals.css migrado.

**IMPACTO:** Componentes dependem de CSS que nao existe.

---

## DIFERENCA 2: SCROLLBAR DA SIDEBAR

### Bug Reportado: "Sidebar tem scrollbar bugado"

### ORIGINAL (layout.css):
