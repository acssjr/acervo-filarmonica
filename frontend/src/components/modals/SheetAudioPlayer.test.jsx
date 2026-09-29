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

  test('não reproduz após fechar o player durante o pedido de acesso', async () => {
    let resolveAccess;
    mockAccess.mockImplementation(() => new Promise(resolve => { resolveAccess = resolve; }));
    const user = userEvent.setup();
    render(<SheetAudioPlayer sheet={{ id: '7', title: 'Música teste' }} />);

    await user.click(screen.getByRole('button', { name: 'Ouvir partitura' }));
    await user.click(screen.getByRole('button', { name: 'Fechar player' }));
    await act(async () => resolveAccess({ url: 'https://test.local/audio' }));

    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
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
