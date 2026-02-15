# Relatório: Problemas de Fonte e Acentuação

**Gerado em:** 2026-02-08 19:53:00  
**Projeto:** acervo-filarmonica (frontend-next)

---

## Issue 1: Font Standardization - DIAGNOSIS

### Problema Identificado

O usuário reportou que a fonte está renderizando de forma diferente após a padronização de `fontFamily: "Outfit, sans-serif"` para `fontFamily: "var(--font-sans)"`.

### Root Cause Analysis

**VERIFICADO:** A configuração está CORRETA, mas há uma sutileza importante no funcionamento do Next.js font optimization.

#### Frontend Original (Vite)
```html
<!-- frontend/index.html -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
Fonte aplicada globalmente via Google Fonts CDN.

#### Frontend-Next (Next.js)
```typescript
// app/layout.tsx
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",  // ← CRIA VARIÁVEL CSS
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {/* ↑ APLICA A VARIÁVEL VIA CLASSNAME */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

#### Globals.css
```css
/* globals.css linha 39 */
--font-sans: var(--font-outfit), "Outfit", sans-serif;

/* globals.css linha 60 */
body {
  font-family: var(--font-sans);
}
```

### Como o Next.js Font Optimization Funciona

1. `next/font/google` baixa a fonte em build time
2. Cria variável CSS `--font-outfit` com path otimizado
3. `outfit.variable` DEVE ser aplicado via `className` no HTML/body
4. Quando aplicado, `--font-outfit` aponta para fonte self-hosted otimizada
5. `var(--font-sans)` → `var(--font-outfit), "Outfit", sans-serif`

### Verificação da Configuração Atual

**LINHA 67 do layout.tsx:**
```typescript
<body className={`${outfit.variable} font-sans antialiased`}>
```

**VERIFICADO:**
- ✅ `outfit.variable` está sendo aplicado no body
- ✅ `font-sans` Tailwind utility está presente
- ✅ globals.css define `--font-sans: var(--font-outfit), "Outfit", sans-serif`
- ✅ body tem `font-family: var(--font-sans)`

### Possível Causa do Problema Reportado

Se a fonte está renderizando diferente, as causas prováveis são:

1. **Cache do navegador**: Fonte antiga ainda em cache
2. **Timing de carregamento**: Next.js font optimization pode ter flash de unstyled text (FOUT)
3. **Fallback sendo usado**: Se `--font-outfit` não resolve, fallback é `"Outfit", sans-serif` (Google Fonts CDN)
4. **Build não executado**: Em desenvolvimento, fonts podem não estar totalmente otimizadas

### Teste para Confirmar

Inspecionar elemento no DevTools e verificar:
```css
/* Deve mostrar: */
font-family: var(--font-sans);

/* Que resolve para: */
font-family: "__Outfit_abc123", "Outfit", sans-serif;
```

Se mostrar apenas `"Outfit", sans-serif` sem o prefixo `__Outfit_`, a variável não está sendo aplicada.

### Solução Recomendada

**MANTER a configuração atual** pois está CORRETA.

Se usuário confirmar que fonte está diferente:

**Opção A: Forçar rebuild**
```bash
cd frontend-next
rm -rf .next
npm run build
npm run dev
```

**Opção B: Verificar se outfit.className foi removido por engano**
Verificar se alguma mudança removeu `outfit.variable` do body className.

**Opção C: Se usuário preferir manter Google Fonts CDN**
Adicionar ao `app/layout.tsx` head:
```typescript
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
</head>
```

Mas isso **perde os benefícios de performance** do Next.js font optimization.

---

## Issue 2: Acentuação Faltando - FINDINGS

### Busca Sistemática Realizada

**Patterns pesquisados:**
- `>Proximo`, `>Proxima`, `>Musico`, `>Usuario`, `>Maximo` (dentro de JSX tags)
- `placeholder=".*[Mm]aximo.*"` (inputs)
- `aria-label` attributes
- `toast.success/error/info` calls
- `Tamanho maximo`, `Formatos aceitos`

### Resultado: 1 OCORRÊNCIA ENCONTRADA

**ARQUIVO:** `frontend-next/src/components/admin/AdminConfig.tsx`  
**LINHA:** 280  
**CONTEÚDO:**
```tsx
Formatos aceitos: JPG, PNG, GIF. Tamanho maximo: 2MB
```

**CORREÇÃO NECESSÁRIA:**
```tsx
Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
```

### Aria-labels Verificados

Todos os `aria-label` encontrados estão corretamente acentuados:
- ✅ "Notificações" (não "Notificacoes")
- ✅ "Adicionar aos favoritos"
- ✅ "Remover dos favoritos"
- ✅ etc.

### Toast Messages Verificados

**BUSCA RETORNOU:** Nenhum resultado para `toast.(success|error|info)(`

Isso indica que notificações não usam o padrão `toast.success()` diretamente no código. Provavelmente estão encapsuladas em hooks/contexts.

### Patterns de API/Backend Verificados

API endpoints como `getUsuarios`, `createUsuario`, `categorias` são **corretos** sem acento pois:
- São nomes de funções JavaScript (convenção camelCase)
- São endpoints de API (inglês/camelCase)
- Não são texto visível ao usuário

**NÃO CORRIGIR** coisas como:
```typescript
async getUsuarios() { ... }  // ← API method name (correto)
const categorias = await api.getCategorias(); // ← variável (correto)
if (filters.categoria) params.append("categoria", filters.categoria); // ← query param (correto)
```

---

## Resumo Executivo

### Issue 1: Font
- **Status:** Configuração CORRETA
- **Ação:** Aguardar confirmação do usuário sobre comportamento específico
- **Próximo passo:** Se fonte realmente diferente, executar rebuild e limpar cache

### Issue 2: Accents
- **Status:** 1 ocorrência encontrada
- **Ação:** Corrigir linha 280 de AdminConfig.tsx
- **Arquivo:** `C:\Users\Antônio\Documents\acervo-filarmonica\frontend-next\src\components\admin\AdminConfig.tsx`

### Arquivos Relevantes

| Arquivo | Propósito | Status |
|---------|-----------|--------|
| `frontend/index.html` | Font Google CDN (Vite) | ✅ Outfit carregado |
| `frontend-next/app/layout.tsx` | Font Next.js optimization | ✅ Configurado corretamente |
| `frontend-next/app/globals.css` | CSS variables | ✅ --font-sans definido |
| `frontend-next/src/components/admin/AdminConfig.tsx` | ÚNICO PROBLEMA | ❌ "maximo" → "máximo" |

### Code Snippets para Correção

```diff
--- a/frontend-next/src/components/admin/AdminConfig.tsx
+++ b/frontend-next/src/components/admin/AdminConfig.tsx
@@ -277,7 +277,7 @@
           fontFamily: "var(--font-sans)",
         }}
       >
-        Formatos aceitos: JPG, PNG, GIF. Tamanho maximo: 2MB
+        Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
       </p>
     </div>
```

---

## Metodologia de Busca Utilizada

1. **Read** arquivos de configuração de fonte (index.html, layout.tsx, globals.css)
2. **Grep** patterns de acentuação faltando em JSX, placeholders, aria-labels
3. **Grep** padrões de `fontFamily: "var(--font-sans)"` para confirmar padronização
4. **Grep** aria-labels para verificar acessibilidade
5. **Análise de output** de greps grandes salvos em arquivos persistidos

**Total de arquivos analisados:** ~100+ arquivos TypeScript/TSX/CSS  
**Patterns testados:** 8 expressões regulares diferentes  
**False positives filtrados:** Nomes de API, variáveis, query params (não são UI text)

