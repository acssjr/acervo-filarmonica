# Bombardino C/Bb - Design

## Contexto

O download em lote do repertório considera `Bombardino C` e `Bombardino Bb` como a mesma família depois que remove a tonalidade. Quando a parte solicitada não existe, o fallback pode escolher a outra tonalidade. Fluxos de upload também divergem: alguns salvam `Bombardino` como C e outros preservam o nome genérico.

A auditoria do banco e de 127 PDFs disponíveis encontrou 88 partituras com Bombardino: 38 possuem C e Bb completos, 17 possuem somente conteúdo em C e 33 somente conteúdo em Bb. Treze rótulos precisam de correção e dois registros Bb apontam para objetos ausentes no R2.

## Regra de negócio aprovada

- `Bombardino C` aceita `Bombardino C` e o legado `Bombardino`.
- `Bombardino Bb` aceita somente variantes explícitas de Bb/Sib.
- Uma tonalidade nunca substitui a outra.
- Quando a parte correta não existe ou o objeto não existe no R2, a partitura é marcada como ausente.
- O usuário deve poder escolher explicitamente C ou Bb.

## Solução

1. Centralizar a canonicalização de Bombardino no backend e no parser de upload.
2. Aplicar compatibilidade de tonalidade antes de qualquer fallback por família, voz, combinação ou sinônimo.
3. Disponibilizar uma verificação de download que devolve partes encontradas e ausentes, validando também a existência do objeto no R2.
4. Mostrar o resultado no modal antes de gerar PDF/ZIP e permitir o download apenas das partes válidas.
5. Normalizar a lista do repertório para exibir `Bombardino C` e `Bombardino Bb`, nunca o nome genérico.
6. Corrigir os 13 rótulos auditados por migração condicionada, preservando os dois registros sem objeto para futuro reenvio.
7. Corrigir os fluxos de upload e o matcher de download individual para não reintroduzir a ambiguidade.

## Segurança e compatibilidade

- A migração altera apenas IDs e valores previamente auditados, com condição sobre o rótulo atual.
- Nenhum registro sem PDF será apagado.
- A regra especial é restrita à família Bombardino; os fallbacks existentes de outros instrumentos permanecem.
- O download continua permitindo PDF e ZIP e mantém a seleção parcial de partituras.

