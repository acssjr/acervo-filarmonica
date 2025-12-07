<div align="center">

# Acervo Digital da Filarmonica 25 de Marco

### Sistema de gerenciamento e distribuicao de partituras digitais

*Sociedade Filarmonica 25 de Marco - Feira de Santana, BA - Desde 1868*

<br/>

[![Versao](https://img.shields.io/badge/versao-2.5.0-722F37?style=for-the-badge&labelColor=D4AF37)](https://github.com/acssjr/acervo-filarmonica)
[![Status](https://img.shields.io/badge/status-em%20producao-success?style=for-the-badge)](https://acervo-filarmonica.pages.dev)
[![CI](https://img.shields.io/github/actions/workflow/status/acssjr/acervo-filarmonica/ci.yml?style=for-the-badge&label=CI&logo=github)](https://github.com/acssjr/acervo-filarmonica/actions)

<br/>

[**Acessar Sistema**](https://acervo-filarmonica.pages.dev)

<br/>

</div>

---

## Sobre o Projeto

O Acervo Digital da Filarmonica 25 de Marco e um sistema web desenvolvido para digitalizar e facilitar o acesso ao extenso acervo de partituras da banda mais antiga da Bahia, fundada em 1868.

O sistema permite que musicos acessem suas partituras de qualquer lugar, baixem arquivos no formato correto para seu instrumento e acompanhem novidades do repertorio.

---

## Funcionalidades

<table>
<tr>
<td width="33%" valign="top">

### Para Musicos
- Interface responsiva (mobile/desktop)
- Download de partituras por instrumento
- Busca inteligente com transliteracao (grafias antigas)
- Sistema de favoritos
- Perfil com foto e alteracao de PIN
- Temas claro/escuro/automatico
- Notificacoes de novidades
- Carrossel de compositores em destaque

</td>
<td width="33%" valign="top">

### Para Maestro
- Acesso a Grade completa de cada obra
- Download de todas as partes de uma partitura
- Visualizacao do acervo total
- Destaque automatico de partituras recentes

</td>
<td width="33%" valign="top">

### Para Administradores
- Upload de pasta completa (multiplas partes de uma vez)
- Deteccao automatica de instrumentos pelo nome do arquivo
- Gerenciamento individual de partes (substituir/deletar)
- Visualizacao de PDF inline
- Gestao de musicos com badges visuais
- Estatisticas de downloads
- Reset de PIN de usuarios
- Toggle admin/usuario para testes
- Protecao do super admin

</td>
</tr>
</table>

---

## Detalhes das Funcionalidades

### Upload de Pasta

O sistema permite fazer upload de uma pasta inteira contendo todas as partes de uma partitura. Os instrumentos sao detectados automaticamente pelo nome dos arquivos:

| Nome do Arquivo | Instrumento Detectado |
|-----------------|----------------------|
| `Grade.pdf` | Grade |
| `Clarinetes.pdf` | Clarinetes |
| `Saxes Alto.pdf` | Saxes Alto |
| `Trompetes.pdf` | Trompetes |
| `Trombones.pdf` | Trombones |
| `Bombardinos.pdf` | Bombardinos |
| `Tubas.pdf` | Tubas |
| `Percussao.pdf` | Percussao |

### Busca com Transliteracao

O sistema entende grafias antigas e modernas:

- `nymphas` encontra `ninfas`
- `philarmonica` encontra `filarmonica`
- `symphonia` encontra `sinfonia`

### Sistema de Notificacoes

Usuarios recebem notificacoes sobre:
- Novas partituras adicionadas
- Partituras em destaque
- Atualizacoes do sistema

### Temas Visuais

- **Claro**: Fundo claro, ideal para ambientes iluminados
- **Escuro**: Fundo escuro, ideal para leitura noturna
- **Automatico**: Segue a preferencia do sistema operacional

---

## Stack Tecnologica

<div align="center">

| Camada | Tecnologia | Descricao |
|:------:|:----------:|:---------:|
| ![React](https://img.shields.io/badge/-React_18-61DAFB?style=flat-square&logo=react&logoColor=black) | **Frontend** | Interface SPA com Vite |
| ![Cloudflare](https://img.shields.io/badge/-Workers-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Backend** | API Serverless Edge |
| ![D1](https://img.shields.io/badge/-D1_SQLite-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Database** | Banco distribuido |
| ![R2](https://img.shields.io/badge/-R2_Storage-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Storage** | Arquivos PDF |
| ![Pages](https://img.shields.io/badge/-Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white) | **Hosting** | CDN Global |

</div>

---

## Seguranca

| Recurso | Implementacao |
|---------|---------------|
| **Autenticacao** | JWT com expiracao de 24h |
| **Senhas** | PBKDF2 (100k iteracoes) |
| **Rate Limiting** | Protecao contra brute-force |
| **CORS** | Whitelist de dominios |
| **Sessao** | Logout automatico ao expirar |
| **Super Admin** | Protecao total - invisivel e imutavel |

---

## Qualidade de Codigo

O projeto possui infraestrutura completa de testes automatizados:

- **215+ testes unitarios** com Jest e Testing Library
- **16 testes E2E** com Playwright (8 mocked + 8 com backend real)
- **CI/CD automatizado** via GitHub Actions
- **ESLint** para padronizacao de codigo
- **Husky + lint-staged** para validacao pre-commit

Pipeline automatico em cada push:
```
Push/PR -> Lint -> Jest (215+) -> E2E Mocked (8) -> Build -> Deploy
```

---

## Changelog

<details open>
<summary><b>v2.5.0</b> - Dezembro 2025</summary>

**Melhorias de UX no Painel Admin**
- Visualizacao de PDF inline com zoom (Ctrl+Scroll)
- Contador de partes por partitura
- Hover individual nos botoes de acao (substituir/deletar)
- Efeito visual de scale nos botoes
- Fechamento do PDF ao clicar no backdrop
- Melhor feedback visual para parte sendo visualizada

**Qualidade**
- Correcao de bugs no carregamento de PDF
- Prevencao de interceptacao por gerenciadores de download (IDM)

</details>

<details>
<summary><b>v2.4.0</b> - Dezembro 2025</summary>

- **Super Admin:** Protecao total do @admin (invisivel, imutavel)
- **Badges:** Identificacao visual de admins na lista
- **Equalizer:** Animacao de loading no login
- **Constants:** Centralizacao de cores, mensagens e configs

</details>

<details>
<summary><b>v2.3.3</b> - Dezembro 2025</summary>

- **Admin Toggle:** Alternar entre modo usuario/admin sem logout
- **Maestro:** Deteccao correta para download de grade
- **Download:** Botao desabilitado quando grade indisponivel
- **Testes:** 214 testes automatizados passando

</details>

<details>
<summary><b>v2.3.2</b> - Dezembro 2025</summary>

- **Carrossel:** Compositores em destaque na home (mobile)
- **Glassmorphism:** Design hero cards com backdrop-filter
- **Scroll:** Correcao de scroll ao navegar para compositores

</details>

<details>
<summary><b>v2.3.1</b> - Dezembro 2025</summary>

- **Busca:** Transliteracao de grafias antigas (nymphas -> ninfas)
- **Compositores:** Secao na home com top 6 populares
- **Logout:** Botao na sidebar do admin

</details>

<details>
<summary><b>v2.3.0</b> - Dezembro 2025</summary>

- **Testes:** 215 testes unitarios (Jest) + 16 testes E2E (Playwright)
- **CI/CD:** Pipeline automatico com GitHub Actions
- **Cobertura:** LoginScreen 100%, AdminDashboard 82%

</details>

<details>
<summary><b>v2.2.0</b> - Dezembro 2025</summary>

- **Arquitetura:** Contexts separados (Auth, UI, Data, Notifications)
- **Performance:** Re-renders isolados por dominio
- 30+ componentes migrados para nova arquitetura

</details>

<details>
<summary><b>Versoes anteriores</b></summary>

**v2.1.0** - JWT 24h, PBKDF2, Rate limiting, Redirect admin

**v2.0.0** - Upload pasta, deteccao instrumentos, gerenciamento partes

**v1.5.0** - Modal "Sobre", validacao PIN, melhorias mobile

**v1.4.0** - Perfil com foto, alteracao PIN, seletor de tema

**v1.0.0** - Versao inicial

</details>

---

<div align="center">

### Desenvolvido por

**Antonio Junior**

*Para a Sociedade Filarmonica 25 de Marco*

<br/>

[![GitHub](https://img.shields.io/badge/-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/acssjr)

---

<sub>Projeto privado - Todos os direitos reservados</sub>

<br/>

**Sociedade Filarmonica 25 de Marco - Desde 1868**

</div>
