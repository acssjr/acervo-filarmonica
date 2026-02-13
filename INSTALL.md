# 🚀 GUIA RÁPIDO DE INSTALAÇÃO

## Windows - Passo a Passo

### 1. Baixar o projeto

Você tem duas opções:

**Opção A - Baixar ZIP:**
1. Acesse: https://github.com/acssjr/acervo-filarmonica
2. Clique no botão verde "Code"
3. Clique em "Download ZIP"
4. Extraia para uma pasta (ex: `C:\Projetos\acervo-filarmonica`)

**Opção B - Usar Git:**
```cmd
cd C:\Projetos
git clone https://github.com/acssjr/acervo-filarmonica.git
cd acervo-filarmonica
```

---

### 2. Instalar dependências

Abra o **Prompt de Comando** ou **PowerShell** na pasta do projeto:

```cmd
npm install
```

---

### 3. Fazer login no Cloudflare

```cmd
npx wrangler login
```

Vai abrir o navegador. Faça login na sua conta Cloudflare.

---

### 4. Configurar os recursos

```cmd
npm run setup
```

Isso vai criar automaticamente:
- Banco de dados D1
- Bucket R2 para PDFs
- Tabelas necessárias

---

### 5. Fazer o deploy

```cmd
npm run deploy
```

Pronto! 🎉

---

## URLs Após o Deploy

Após o deploy, você terá:

| Serviço | URL |
|---------|-----|
| API | `https://acervo-filarmonica-api.SEU_USUARIO.workers.dev` |
| Frontend | `https://acervo.filarmonica25demarco.com` |

---

## Testar Localmente (Opcional)

Se quiser testar antes de publicar:

```cmd
npm run dev
```

Acesse: http://localhost:8787

---

## Problemas Comuns

### "wrangler não é reconhecido"
```cmd
npm install -g wrangler
```

### "Não autorizado"
Faça login novamente:
```cmd
npx wrangler login
```

### "Bucket already exists"
Não é erro, o bucket já foi criado. Continue normalmente.

---

## Precisa de Ajuda?

Abra uma issue no GitHub: https://github.com/acssjr/acervo-filarmonica/issues
