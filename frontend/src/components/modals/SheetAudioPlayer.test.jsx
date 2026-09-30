import { describe, test, expect, jest, beforeEach } from '@jest/globals';

const mockAccess = jest.fn();
jest.unstable_mockModule('@services/api', () => ({
  API: { getPartituraAudioAccess: mockAccess }
}));

const { render, screen, fireEvent, waitFor, act } = await import('@testing-library/react');
const { default: userEvent } = await import('@testing-library/user-event');
const { default: SheetAudioPlayer } = await import('./SheetAudioPlayer');

describe('SheetAudioPlayer', () => {
  beforeEach(() => {
    mockAccess.mockReset();
    mockAccess.mockResolvedValue({ url: 'https://test.local/audio?sig=test' });
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: jest.fn().mockResolvedValue(undefined) });
    Object.defineProperty(HTMLMediaElement.prototype, 'pause', { configurable: true, value: jest.fn() });
    Object.defineProperty(HTMLMediaElement.prototype, 'load', { configurable: true, value: jest.fn() });
  });

  test('não inicia ao montar e limita o trecho a 30 segundos', async () => {
    const user = userEvent.setup();
    const { container } = render(<SheetAudioPlayer sheet={{ id: '7', title: 'Música teste' }} />);
    const audio = container.querySelector('audio');

    expect(mockAccess).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    await waitFor(() => expect(mockAccess).toHaveBeenCalledWith('7'));
    expect(screen.getByText('Trecho de até 30 segundos')).toBeInTheDocument();

    Object.defineProperty(audio, 'currentTime', { configurable: true, value: 30, writable: true });
    fireEvent.timeUpdate(audio);
    expect(audio.pause).toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Ouvir completo' }));
    expect(screen.getByText('Reprodução completa')).toBeInTheDocument();
  });

  test('continua carregando e reproduz quando o player é recolhido', async () => {
    let resolveAccess;
    mockAccess.mockImplementation(() => new Promise(resolve => { resolveAccess = resolve; }));
    const user = userEvent.setup();
    render(<SheetAudioPlayer sheet={{ id: '7', title: 'Música teste' }} />);

    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    await user.click(screen.getByRole('button', { name: 'Recolher player' }));
    await act(async () => resolveAccess({ url: 'https://test.local/audio' }));

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    expect(HTMLMediaElement.prototype.pause).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Expandir player' })).toBeInTheDocument();
  });

  test('recolher e expandir preserva o áudio, a posição e a velocidade', async () => {
    const user = userEvent.setup();
    const { container } = render(<SheetAudioPlayer sheet={{ id: '7' }} />);
    const audio = container.querySelector('audio');
    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    await waitFor(() => expect(audio.play).toHaveBeenCalledTimes(1));
    fireEvent.play(audio);
    Object.defineProperty(audio, 'currentTime', { configurable: true, value: 12, writable: true });
    fireEvent.timeUpdate(audio);
    await user.selectOptions(screen.getByRole('combobox', { name: 'Velocidade do áudio' }), '1.25');
    await user.click(screen.getByRole('button', { name: 'Recolher player' }));
    expect(screen.getByText('Tocando · 0:12')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pausar áudio' })).toBeInTheDocument();
    expect(audio.pause).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Expandir player' }));
    expect(container.querySelector('audio')).toBe(audio);
    expect(audio.currentTime).toBe(12);
    expect(audio.playbackRate).toBe(1.25);
    expect(mockAccess).toHaveBeenCalledTimes(1);
    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  test('mantém pausa acessível na versão compacta e encerra ao desmontar', async () => {
    const user = userEvent.setup();
    const { container, unmount } = render(<SheetAudioPlayer sheet={{ id: '7' }} />);
    const audio = container.querySelector('audio');
    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    await waitFor(() => expect(audio.play).toHaveBeenCalled());
    Object.defineProperty(audio, 'paused', { configurable: true, value: false });
    fireEvent.play(audio);
    await user.click(screen.getByRole('button', { name: 'Recolher player' }));
    await user.click(screen.getByRole('button', { name: 'Pausar áudio' }));
    expect(audio.pause).toHaveBeenCalledTimes(1);
    unmount();
    expect(audio.pause).toHaveBeenCalledTimes(2);
    expect(audio).not.toHaveAttribute('src');
  });

  test('permite iniciar com novo clique quando o navegador bloqueia a reprodução automática', async () => {
    const blocked = new Error('User activation required');
    blocked.name = 'NotAllowedError';
    const play = jest.fn().mockRejectedValueOnce(blocked).mockResolvedValue(undefined);
    Object.defineProperty(HTMLMediaElement.prototype, 'play', { configurable: true, value: play });
    const user = userEvent.setup();
    render(<SheetAudioPlayer sheet={{ id: '7', title: 'Música teste' }} />);

    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    expect(await screen.findByText('Toque em reproduzir para iniciar o áudio.')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reproduzir áudio' }));
    expect(play).toHaveBeenCalledTimes(2);
    expect(mockAccess).toHaveBeenCalledTimes(1);
  });

  test('não tenta ouvir completo antes de receber a URL', async () => {
    mockAccess.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    render(<SheetAudioPlayer sheet={{ id: '7', title: 'Música teste' }} />);

    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    expect(screen.getByRole('button', { name: 'Ouvir completo' })).toBeDisabled();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });
});
