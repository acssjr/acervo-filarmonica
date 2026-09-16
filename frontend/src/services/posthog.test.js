import { buildPostHogPersonProperties, createPostHogConfig } from './posthog';

describe('PostHog session replay privacy', () => {
  it('exibe textos e campos comuns, mantendo senhas e elementos privados protegidos', () => {
    const config = createPostHogConfig();

    expect(config.mask_all_text).toBe(false);
    expect(config.session_recording).toEqual(expect.objectContaining({
      maskAllInputs: false,
      maskInputOptions: { password: true },
      blockSelector: '.ph-no-capture, [data-private]',
      recordHeaders: false,
      recordBody: false,
    }));
    expect(config.session_recording).not.toHaveProperty('maskTextSelector');
  });

  it('remove parâmetros apenas de propriedades que contêm URLs completas', () => {
    const sanitizeEvent = createPostHogConfig().before_send;
    const result = sanitizeEvent({
      event: '$pageview',
      properties: {
        $current_url: 'https://acervo.example/acervo?busca=dobrado#resultado',
        $host: 'acervo.example',
        $pathname: '/acervo',
        $referrer: 'https://google.com/search?q=acervo',
        $referring_domain: 'google.com',
      },
    });

    expect(result.properties).toEqual({
      $current_url: 'https://acervo.example/acervo',
      $host: 'acervo.example',
      $pathname: '/acervo',
      $referrer: 'https://google.com/search',
      $referring_domain: 'google.com',
    });
  });

  it('remove parâmetros das URLs iniciais persistidas durante a identificação', () => {
    const sanitizeEvent = createPostHogConfig().before_send;
    const result = sanitizeEvent({
      event: '$identify',
      properties: { $current_url: 'https://acervo.example/?busca=marcha' },
      $set_once: {
        $initial_current_url: 'https://acervo.example/?busca=marcha#resultado',
        $initial_referrer: 'https://google.com/search?q=partituras',
        $initial_pathname: '/',
      },
    });

    expect(result.$set_once).toEqual({
      $initial_current_url: 'https://acervo.example/',
      $initial_referrer: 'https://google.com/search',
      $initial_pathname: '/',
    });
  });
});

describe('PostHog person identification', () => {
  it('usa o nome de exibição e não inclui credenciais ou identificadores de login', () => {
    const properties = buildPostHogPersonProperties({
      id: 2,
      nome_exibicao: '  Antonio Júnior  ',
      name: 'Antonio Carlos Santos',
      nome: 'Antonio Carlos Santos',
      username: 'antoniojunior',
      email: 'antonio@example.com',
      pin: '1234',
      isAdmin: true,
      instrument: 'Trompete',
    });

    expect(properties).toEqual({
      name: 'Antonio Júnior',
      role: 'admin',
      instrumento: 'Trompete',
    });
    expect(properties).not.toHaveProperty('username');
    expect(properties).not.toHaveProperty('email');
    expect(properties).not.toHaveProperty('pin');
  });

  it('omite o nome quando nenhuma fonte possui texto válido', () => {
    expect(buildPostHogPersonProperties({
      id: 3,
      nome_exibicao: '   ',
      name: null,
      nome: '',
      isAdmin: false,
      instrument: null,
    })).toEqual({
      role: 'musico',
      instrumento: null,
    });
  });
});
