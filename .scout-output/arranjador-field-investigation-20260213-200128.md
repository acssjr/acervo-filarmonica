# Investigação do Campo "Arranjador" - Partitura Edit Form
Gerado: 2026-02-13

## Resumo Executivo

O campo **arranjador** existe no banco de dados e é aceito pela API, mas **NÃO está exposto no formulário de edição** de partituras na UI administrativa.

---

## Resultados da Investigação

### 1. Schema do Banco de Dados ✅

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/database/schema.sql`

```sql
CREATE TABLE IF NOT EXISTS partituras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    compositor TEXT NOT NULL,
    arranjador TEXT,              -- ✅ EXISTE
    categoria_id TEXT NOT NULL,
    ano INTEGER,
    descricao TEXT,
    arquivo_nome TEXT NOT NULL,
    ...
);
```

**Status:** ✅ Campo `arranjador` existe (linha 37, tipo TEXT, nullable)

---

### 2. API Backend ✅

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/worker/src/domain/partituras/partituraService.js`

#### Update Partitura (linhas 231-253)

```javascript
export async function updatePartitura(id, request, env) {
  const data = await request.json();
  const { titulo, compositor, arranjador, categoria, categoria_id, ano, descricao, destaque } = data;
  
  await env.DB.prepare(`
    UPDATE partituras
    SET titulo = ?, compositor = ?, arranjador = ?, categoria_id = ?, ano = ?, descricao = ?, destaque = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `).bind(
    titulo,
    compositor,
    arranjador || null,  // ✅ ACEITA arranjador
    categoriaFinal,
    ano || null,
    descricao || null,
    destaque ? 1 : 0,
    id
  ).run();
}
```

**Status:** ✅ API aceita e persiste o campo `arranjador`

---

### 3. Frontend API Client ✅

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/frontend/src/services/api.js`

```javascript
async updatePartitura(id, data) {
  return this.request(`/api/partituras/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)  // ✅ Envia qualquer campo que estiver em 'data'
  });
}
```

**Status:** ✅ Cliente API envia qualquer campo no objeto `data`, incluindo `arranjador`

---

### 4. Formulário de Edição ❌

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/frontend/src/screens/admin/AdminPartituras.jsx`

#### Estado do Form (linha 96)

```javascript
const [editForm, setEditForm] = useState({ 
  titulo: '', 
  compositor: '', 
  categoria_id: '' 
});
// ❌ NÃO inclui 'arranjador'
```

#### Campos Renderizados (linhas 1731-1871)

1. **Título da Partitura** (linhas 1731-1770) ✅
2. **Compositor** (linhas 1772-1811) ✅
3. **Categoria** (linhas 1813-1871) ✅
4. **Arranjador** ❌ AUSENTE

#### Salvar Edição (linhas 131-133)

```javascript
titulo: editForm.titulo || editingPartitura.titulo,
compositor: editForm.compositor || null,
categoria_id: editForm.categoria_id || editingPartitura.categoria_id
// ❌ NÃO envia 'arranjador'
```

**Status:** ❌ Campo `arranjador` **NÃO está presente** no formulário de edição

---

### 5. Outros Formulários que INCLUEM Arranjador ✅

#### Upload de Pasta Individual

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/frontend/src/screens/admin/components/UploadPastaModal.jsx`

- **Estado:** linha 53 - `const [arranjador, setArranjador] = useState('');`
- **Input:** linha 858 - Campo de texto para arranjador
- **Envio:** linha 259 - `formData.append('arranjador', arranjador.trim());`

#### Importação em Lote

**Localização:** `C:/Users/Antônio/Documents/acervo-filarmonica/frontend/src/components/modals/ImportacaoLoteModal.jsx`

- **Estado:** Incluído no objeto de cada pasta
- **Input:** linha 1097 - Campo de texto para arranjador por pasta
- **Função:** linha 309-312 - `editarArranjador(pastaId, novoArranjador)`

---

## Onde Adicionar o Campo Arranjador

### Arquivo: `frontend/src/screens/admin/AdminPartituras.jsx`

### Mudanças Necessárias:

#### 1. Atualizar Estado Inicial (linha 96)

```javascript
// ANTES:
const [editForm, setEditForm] = useState({ titulo: '', compositor: '', categoria_id: '' });

// DEPOIS:
const [editForm, setEditForm] = useState({ 
  titulo: '', 
  compositor: '', 
  arranjador: '',  // ← ADICIONAR
  categoria_id: '' 
});
```

#### 2. Atualizar Inicialização do Form (linha 110)

```javascript
// ANTES:
setEditForm({
  titulo: p.titulo,
  compositor: p.compositor,
  categoria_id: p.categoria_id
});

// DEPOIS:
setEditForm({
  titulo: p.titulo,
  compositor: p.compositor,
  arranjador: p.arranjador || '',  // ← ADICIONAR
  categoria_id: p.categoria_id
});
```

#### 3. Adicionar Campo de Input (após linha 1811, antes do Campo Categoria)

```jsx
{/* Campo Arranjador */}
<div style={{ marginBottom: '20px' }}>
  <label style={{
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    marginBottom: '8px',
    fontFamily: 'Outfit, sans-serif'
  }}>
    Arranjador
  </label>
  <input
    type="text"
    value={editForm.arranjador}
    onChange={(e) => setEditForm(prev => ({ ...prev, arranjador: e.target.value }))}
    placeholder="Nome do arranjador (opcional)"
    style={{
      width: '100%',
      padding: '14px 16px',
      borderRadius: '12px',
      border: '1.5px solid var(--border)',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontSize: '15px',
      fontFamily: 'Outfit, sans-serif',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    }}
    onFocus={(e) => {
      e.target.style.borderColor = '#D4AF37';
      e.target.style.boxShadow = '0 0 0 3px rgba(212, 175, 55, 0.15)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'var(--border)';
      e.target.style.boxShadow = 'none';
    }}
  />
</div>
```

#### 4. Atualizar Envio de Dados (linhas 131-133)

```javascript
// ANTES:
titulo: editForm.titulo || editingPartitura.titulo,
compositor: editForm.compositor || null,
categoria_id: editForm.categoria_id || editingPartitura.categoria_id

// DEPOIS:
titulo: editForm.titulo || editingPartitura.titulo,
compositor: editForm.compositor || null,
arranjador: editForm.arranjador || null,  // ← ADICIONAR
categoria_id: editForm.categoria_id || editingPartitura.categoria_id
```

---

## Padrão de Código Existente

Para manter consistência com o código existente, o campo arranjador deve seguir o mesmo padrão dos campos "Título" e "Compositor":

- Mesmo estilo de label e input
- Mesmos efeitos de foco (borda dourada #D4AF37)
- Placeholder descritivo
- Campo opcional (não obrigatório para salvar)

---

## Checklist de Implementação

- [ ] Adicionar `arranjador: ''` ao estado inicial `editForm` (linha 96)
- [ ] Incluir `arranjador: p.arranjador || ''` na inicialização do form (linha 110)
- [ ] Adicionar campo de input JSX após "Compositor" e antes de "Categoria" (após linha 1811)
- [ ] Incluir `arranjador: editForm.arranjador || null` no payload de salvamento (linha 133)
- [ ] Testar criação/edição de partitura com e sem arranjador
- [ ] Verificar que partituras existentes com arranjador mantêm o valor

---

## Observações

- O campo `arranjador` já funciona corretamente nos fluxos de:
  - Upload de pasta individual
  - Importação em lote
  - Parser de metadados (extrai "Arr." do nome da pasta)
  
- Apenas o formulário de **edição manual** de partituras individuais não expõe o campo

- A infraestrutura completa (DB, API, tipos TypeScript) já suporta o campo
