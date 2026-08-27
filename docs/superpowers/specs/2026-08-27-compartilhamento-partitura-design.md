# Compartilhamento de partituras por link

## Objetivo

Permitir que o botão **Enviar** de uma partitura ofereça duas ações distintas:

1. enviar uma cópia do PDF da parte escolhida, preservando o comportamento atual;
2. compartilhar um link canônico da peça, com mensagem pronta e preview social personalizado.

O destinatário precisa autenticar-se para visualizar a peça ou baixar arquivos.

## Experiência do usuário

Ao tocar em **Enviar**, abre-se um seletor compacto com:

- **Enviar cópia**: prepara e envia o PDF do instrumento do usuário ou a grade do maestro;
- **Compartilhar link**: compartilha a URL canônica da peça usando o menu nativo do dispositivo.

O compartilhamento por link tenta copiar a URL sem aguardar e abre imediatamente `navigator.share`, preservando a ativação do gesto do usuário. Quando o compartilhamento nativo não estiver disponível, copia a mensagem completa e o link para a área de transferência. Falhas de permissão apresentam uma mensagem clara, sem iniciar download indevido.

Mensagem padrão:

```text
🎺 Partitura disponível no Acervo Digital!

“Senhora Sant’Anna”, de Tertuliano Santos
Gênero: Marchas

Acesse e encontre a sua parte:
```

Título, compositor e gênero serão substituídos automaticamente pelos dados da peça selecionada.

## URL, autenticação e retorno após login

A URL compartilhada mantém o formato existente:

```text
https://acervo.filarmonica25demarco.com/acervo/:categoria/:partituraId
```

Um parâmetro `v`, derivado da data de atualização da partitura, diferencia versões do preview sem alterar a rota da aplicação. Se o usuário não estiver autenticado, a rota protegida envia-o ao login preservando o destino original. Após autenticação, o sistema retorna à mesma URL e abre a partitura automaticamente.

## Preview social

Uma Cloudflare Pages Function intercepta somente URLs individuais de partitura. Ela consulta o endpoint público de metadados da peça, obtém o `index.html` estático da aplicação e injeta:

- título da página;
- descrição;
- URL canônica;
- Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`, dimensões e texto alternativo);
- Twitter Card.

A imagem social é gerada automaticamente para qualquer partitura no formato PNG 1200×630. O cartão usa a identidade vinho e dourado, o brasão, Plus Jakarta Sans, o gênero e o título da peça. O compositor não aparece dentro da imagem. Ele permanece no texto compartilhado e na descrição do preview.

A imagem usa a API `ImageResponse` do plugin oficial `@cloudflare/pages-plugin-vercel-og`. A fonte necessária fica versionada no projeto para a geração não depender de uma requisição externa. Respostas válidas recebem cache público curto e `stale-while-revalidate`; respostas ausentes não são convertidas em previews falsos.

## Segurança e privacidade

O preview usa somente metadados que já são retornados pelas rotas públicas de partituras: título, compositor, categoria e datas. Nenhum PDF, parte, usuário, token ou dado administrativo é exposto.

As rotas de download e de listagem de partes continuam protegidas. O compartilhamento não cria tokens públicos nem URLs temporárias de arquivos.

## Implantação

O diretório de Pages Functions será incluído no mesmo deploy do frontend via Wrangler. O workflow será ajustado para executar a publicação a partir do diretório correto e validar a compilação das Functions antes do deploy.

Não há alteração de esquema e nenhuma migration D1 é necessária.

## Tratamento de falhas

- Se os metadados não existirem, a aplicação estática continua responsável pela rota e não inventa uma peça.
- Se a imagem dinâmica falhar, a página mantém título e descrição e usa uma imagem institucional de fallback.
- Se `navigator.share` não existir, a mensagem e o link são copiados.
- Cancelar o menu de compartilhamento não mostra erro.
- Falhas ao enviar uma cópia continuam usando o tratamento atual do download.

## Verificação

- testes unitários do texto, URL, compartilhamento nativo e fallback de clipboard;
- testes da Pages Function para metadados, imagem, peça ausente e passagem para o SPA;
- teste do retorno à URL original após login;
- lint, testes do Worker, testes do frontend, typecheck e build;
- compilação local das Pages Functions;
- inspeção dos metadados e da imagem 1200×630 para “Senhora Sant’Anna”.
