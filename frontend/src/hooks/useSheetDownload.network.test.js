// ===== USE SHEET DOWNLOAD NETWORK TESTS =====
import { renderHook, act } from '@testing-library/react';
import { useSheetDownload } from './useSheetDownload';
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Storage } from '@services/storage';

// Mocks principais da rede e de bibliotecas externas
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
global.Blob = class { constructor(parts) { this.parts = parts; } };

jest.unstable_mockModule('@services/storage', () => ({
    Storage: {
        get: jest.fn(() => 'fake-jwt-token')
    }
}));

describe('useSheetDownload - Resiliencia de Rede e Storage', () => {
    const mockShowToast = jest.fn();
    const mockSelectedSheet = { id: 9, title: 'Dobrado Nº 9' };
    const mockParte = { id: 42, instrumento: 'Bombardino Bb' };

    beforeEach(() => {
        jest.clearAllMocks();
        if (!global.fetch) {
            global.fetch = jest.fn();
        }
        jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({}),
            blob: async () => new Blob(),
            headers: { get: () => null }
        }));
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('deve lidar corretamente se a API retornar um erro 404 (Arquivo Nao Encontrado no Storage)', async () => {
        // Simula a API do Worker retornando 404 por arquivo R2 sumido
        const mockErrorResponse = { error: 'Arquivo não encontrado no storage' };

        // Mock do fetch global
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            json: async () => mockErrorResponse
        });

        const { result } = renderHook(() => useSheetDownload({
            showToast: mockShowToast,
            selectedSheet: mockSelectedSheet,
            partes: [mockParte]
        }));

        // Simula clique em baixar "Bombardino Bb"
        await act(async () => {
            await result.current.downloadParteDireta(mockParte);
        });

        // Estado downloading deve voltar para falso
        expect(result.current.downloading).toBe(false);

        // Deve ter avisado o musico que o arquivou sumiu da storage
        expect(mockShowToast).toHaveBeenCalledWith('Arquivo não encontrado no storage', 'error');
    });

    it('deve fechar o loader de download e avisar caso o Fetch dispare uma Excecao de Rede (Falha total de API/Internet)', async () => {
        global.fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

        const { result } = renderHook(() => useSheetDownload({
            showToast: mockShowToast,
            selectedSheet: mockSelectedSheet,
            partes: [mockParte]
        }));

        await act(async () => {
            await result.current.downloadParteDireta(mockParte);
        });

        // Estado loading DEVE voltar a falso, o UI não pode ficar travado!
        expect(result.current.downloading).toBe(false);

        // Deve cair no bloco Catch global
        expect(mockShowToast).toHaveBeenCalledWith('Erro ao baixar arquivo', 'error');
    });

    it('deve executar sucesso ao baixar a parte corretamente 200 OK', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: { get: () => null },
            blob: async () => new Blob(['pdf fake data'])
        });

        const { result } = renderHook(() => useSheetDownload({
            showToast: mockShowToast,
            selectedSheet: mockSelectedSheet,
            partes: [mockParte]
        }));

        await act(async () => {
            await result.current.downloadParteDireta(mockParte);
        });

        expect(result.current.downloading).toBe(false);
        expect(mockShowToast).toHaveBeenCalledWith('Download iniciado!');
    });

    it('deve lidar com erro ao visualizar PDF (viewParte)', async () => {
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({ error: 'Erro interno no servidor' })
        });

        const { result } = renderHook(() => useSheetDownload({
            showToast: mockShowToast,
            selectedSheet: mockSelectedSheet,
            partes: [mockParte]
        }));

        await act(async () => {
            await result.current.viewParte(mockParte);
        });

        expect(result.current.downloading).toBe(false);
        expect(result.current.pdfViewer.isOpen).toBe(false);
        expect(mockShowToast).toHaveBeenCalledWith('Erro interno no servidor', 'error');
    });
});
