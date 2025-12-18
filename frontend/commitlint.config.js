export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Nova funcionalidade
        'fix',      // Correção de bug
        'docs',     // Documentação
        'style',    // Formatação (não afeta código)
        'refactor', // Refatoração
        'perf',     // Melhoria de performance
        'test',     // Testes
        'chore',    // Manutenção
        'ci',       // CI/CD
        'build',    // Build system
        'revert',   // Reverter commit
      ],
    ],
    'subject-case': [0], // Permite qualquer case no subject
    'body-max-line-length': [0], // Sem limite de linha no body
  },
};
