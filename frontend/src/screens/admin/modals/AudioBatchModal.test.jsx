import { describe, test, expect, jest, beforeEach } from '@jest/globals';
const upload = jest.fn();
jest.unstable_mockModule('@services/api', () => ({ API: { uploadPartituraAudio: upload } }));
const { render, screen, fireEvent, waitFor } = await import('@testing-library/react');
const { default: AudioBatchModal } = await import('./AudioBatchModal');
const sheets = [{ id: '1', titulo: 'Canção', has_audio: false }, { id: '2', titulo: 'Marcha', has_audio: true, audio_name: 'antigo.mp3' }];
const file = name => new File(['audio'], name, { type: 'audio/mpeg' });
function setup(partituras = sheets) {
  const update = jest.fn();
  render(<AudioBatchModal partituras={partituras} onClose={jest.fn()} onUpdate={update} />);
  return { update, add: files => fireEvent.change(document.querySelector('input[type=file]'), { target: { files } }) };
}
describe('upload de áudios em lote', () => {
  beforeEach(() => { upload.mockReset(); upload.mockResolvedValue({ has_audio: true }); });
  test('envia só após confirmação e permite tentar novamente uma falha', async () => {
    upload.mockRejectedValueOnce(new Error('Rede indisponível'));
    const { add, update } = setup();
    add([file('Canção.mp3')]);
    expect(upload).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Enviar 1 áudio(s)' }));
    await screen.findByText('Rede indisponível');
    fireEvent.click(screen.getByRole('button', { name: 'Enviar 1 áudio(s)' }));
    await screen.findByText('Áudio enviado');
    expect(upload).toHaveBeenCalledTimes(2);
    expect(update).toHaveBeenCalledWith('1', { has_audio: true });
  });
  test('bloqueia substituição sem autorização e conflitos na mesma partitura', async () => {
    const { add } = setup();
    add([file('Marcha.mp3')]);
    expect(screen.getByRole('button', { name: 'Enviar 0 áudio(s)' })).toBeDisabled();
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByRole('button', { name: 'Enviar 1 áudio(s)' })).toBeEnabled();
    add([file('Marcha.wav')]);
    expect(screen.getAllByText('Mais de um arquivo associado à mesma partitura')).toHaveLength(2);
    expect(upload).not.toHaveBeenCalled();
  });
  test('continua o lote quando a atualização do pai troca os callbacks', async () => {
    let finish;
    upload.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
    const { rerender } = render(<AudioBatchModal partituras={sheets} onClose={() => {}} onUpdate={() => {}} />);
    fireEvent.change(document.querySelector('input[type=file]'), { target: { files: [file('Canção.mp3'), file('Outra.mp3')] } });
    fireEvent.change(screen.getByLabelText('Partitura para Outra.mp3'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Enviar 2 áudio(s)' }));
    rerender(<AudioBatchModal partituras={sheets} onClose={() => {}} onUpdate={() => {}} />);
    finish({ has_audio: true });
    await waitFor(() => expect(upload).toHaveBeenCalledTimes(2));
    await waitFor(() => expect(screen.getAllByText('Áudio enviado')).toHaveLength(2));
  });
  test('seleção de pasta e arraste de pasta incluem arquivos e ignoram MIDI', async () => {
    setup();
    fireEvent.change(document.querySelector('input[webkitdirectory]'), { target: { files: [file('Canção.mp3'), file('arquivo.mid')] } });
    const entry = { isDirectory: true, createReader: () => {
      let read = false;
      return { readEntries: resolve => { resolve(read ? [] : [{ isFile: true, file: done => done(file('Marcha.wav')) }]); read = true; } };
    } };
    fireEvent.drop(document.querySelector('[data-audio-batch]'), { dataTransfer: { items: [{ kind: 'file', webkitGetAsEntry: () => entry }], files: [] } });
    await screen.findByText('Marcha.wav');
    expect(screen.getByText('Canção.mp3')).toBeInTheDocument();
    expect(screen.queryByText('arquivo.mid')).not.toBeInTheDocument();
    expect(upload).not.toHaveBeenCalled();
  });
});
