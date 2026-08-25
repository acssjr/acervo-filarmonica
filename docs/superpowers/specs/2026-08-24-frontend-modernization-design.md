# Direções para modernização visual do frontend

## Estado atual

O frontend já deixou de ser um HTML monolítico: hoje há uma aplicação React organizada por telas, componentes, contextos, serviços e estilos compartilhados. O sistema atende dois produtos no mesmo código:

1. experiência do músico, com login, home, biblioteca, busca, favoritos, gêneros, compositores, repertórios, ensaios e perfil;
2. experiência administrativa, com dashboard, partituras, repertórios, músicos, presença, avisos, assets, analytics e configurações.

A identidade atual usa vinho `#722F37`, dourado `#D4AF37`, Plus Jakarta Sans, gradientes e glassmorphism. Há temas claro, escuro e sistema, layout desktop com sidebar e layout móvel com navegação inferior.

## O que deve ser preservado

- Todas as telas e capacidades existentes.
- Marca da Sociedade Filarmônica 25 de Março, vinho e dourado.
- Facilidade de uso por músicos em celular, inclusive em ambientes de ensaio.
- Tema claro/escuro, responsividade e atalhos administrativos.
- Busca, favoritos, seleção de instrumento, download e compartilhamento.
- Conteúdo histórico, estados vazios, carregamento, erros e onboarding.
- Contrato estabilizado com a API; modernização visual não deve exigir reescrita do backend.

## Problemas a resolver

- Uso inconsistente de glassmorphism, sombras, gradientes e raios entre áreas antigas e novas.
- Cores hexadecimais repetidas fora dos tokens globais.
- Hierarquia visual por vezes dependente de decoração em vez de tipografia e espaçamento.
- Componentes semelhantes com implementações distintas entre área musical e administrativa.
- Densidade administrativa e navegação móvel precisam de regras próprias, não apenas versões reduzidas do desktop.
- Estados de foco, contraste, movimento reduzido e áreas de toque devem ser auditados de ponta a ponta.

## Alternativa A: Acervo editorial contemporâneo — recomendada

Trata a aplicação como um acervo musical vivo. Usa superfícies mais sólidas, tipografia expressiva nos títulos, vinho como cor estrutural e dourado apenas para destaque. Capas, partituras e compositores ganham protagonismo; vidro fica restrito à navegação flutuante e a sobreposições.

Vantagens:

- combina patrimônio histórico com interface atual sem parecer um sistema corporativo genérico;
- reduz ruído e melhora a leitura de listas extensas;
- preserva a marca sem depender de gradientes em todos os cards;
- funciona bem para músico e administração com densidades diferentes.

Risco: exige criar uma escala tipográfica e selecionar uma fonte de títulos compatível com a marca ou permanecer apenas com Plus Jakarta Sans.

## Alternativa B: Instrumento e palco

Direção mais dramática, escura e imersiva, inspirada em metal, madeira e luz de palco. Destaca capas e animações, mantendo dourado luminoso sobre vinho profundo.

Vantagens: forte personalidade e impacto visual na home.

Riscos: contraste e legibilidade exigem cuidado; pode cansar em biblioteca e administração; tende a envelhecer mais rápido se efeitos forem excessivos.

## Alternativa C: Sistema institucional limpo

Prioriza neutralidade, grids, tabelas e superfícies claras, usando vinho e dourado como acentos. Aproxima a área administrativa de uma ferramenta de gestão moderna.

Vantagens: alta clareza e implementação incremental simples.

Riscos: reduz a personalidade da filarmônica e pode fazer a experiência do músico parecer um painel corporativo comum.

## Sistema recomendado

Se a alternativa A for aprovada, a implementação deve começar pelos fundamentos:

- tokens semânticos de cor, tipografia, espaço, raio, borda, elevação e movimento;
- componentes básicos únicos: botão, campo, card, modal, sheet, toast, skeleton, estado vazio e cabeçalho;
- largura de leitura e grid responsivo consistentes;
- dourado reservado para seleção, conquista, destaque e ação principal;
- vinho usado em navegação, títulos e momentos institucionais;
- uma única lógica de foco visível e contraste WCAG AA;
- animações curtas e funcionais, desligadas por `prefers-reduced-motion`.

## Ordem segura de implementação

1. Capturar referências visuais das telas atuais em desktop e mobile.
2. Consolidar tokens sem alterar layout nem comportamento.
3. Refazer componentes básicos em uma rota de laboratório visual.
4. Modernizar login e estrutura de navegação.
5. Modernizar o fluxo principal: home, biblioteca, detalhe e download.
6. Aplicar o sistema a busca, favoritos, repertórios, ensaios e perfil.
7. Criar variante densa para a área administrativa.
8. Executar regressão visual, acessibilidade, testes e validação em aparelhos reais.

Cada etapa deve preservar rotas e comportamento, permitindo comparação e reversão isolada.

## Critérios de aceite

- Nenhuma funcionalidade ou conteúdo removido.
- Navegação completa por teclado e foco sempre visível.
- Contraste mínimo AA e áreas de toque adequadas.
- Sem overflow horizontal em 320, 375, 768, 1024 e 1440 px.
- Tema claro e escuro coerentes.
- `prefers-reduced-motion` respeitado.
- Testes existentes, build e smoke tests dos fluxos críticos aprovados.
- Aprovação visual explícita antes de aplicar a direção ao produto inteiro.

## Decisão pendente

A estabilização técnica permite iniciar o redesign sem alterar contratos. A recomendação é a alternativa A, mas a linguagem visual não deve ser implementada em massa até que uma das três direções seja aprovada em referências ou protótipos comparáveis.
