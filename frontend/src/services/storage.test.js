// ===== STORAGE SERVICE TESTS =====
// Testes unitarios para o servico de localStorage

import { Storage, DATA_VERSION, checkAndClearOldData } from './storage';

describe('Storage Service', () => {
  // O localStorage e limpo automaticamente entre testes via jest.setup.js

  describe('get()', () => {
    it('retorna valor armazenado com prefixo fil_', () => {
      localStorage.setItem('fil_testKey', JSON.stringify({ foo: 'bar' }));

      const result = Storage.get('testKey');

      expect(result).toEqual({ foo: 'bar' });
    });

    it('retorna defaultValue quando chave nao existe', () => {
      const result = Storage.get('nonExistent', 'default');

      expect(result).toBe('default');
    });

    it('retorna null como default quando nao especificado', () => {
      const result = Storage.get('nonExistent');

      expect(result).toBeNull();
    });

    it('retorna defaultValue em erro de parse JSON', () => {
      localStorage.setItem('fil_invalid', 'not-valid-json{');

      const result = Storage.get('invalid', 'fallback');

      expect(result).toBe('fallback');
    });

    it('retorna tipos primitivos corretamente', () => {
      localStorage.setItem('fil_number', JSON.stringify(42));
      localStorage.setItem('fil_string', JSON.stringify('hello'));
      localStorage.setItem('fil_boolean', JSON.stringify(true));

      expect(Storage.get('number')).toBe(42);
      expect(Storage.get('string')).toBe('hello');
      expect(Storage.get('boolean')).toBe(true);
    });
  });

  describe('set()', () => {
    it('armazena valor com prefixo fil_ e JSON.stringify', () => {
      Storage.set('myKey', { data: 'value' });

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'fil_myKey',
        JSON.stringify({ data: 'value' })
      );
    });

    it('armazena arrays corretamente', () => {
      const arr = [1, 2, 3];
      Storage.set('array', arr);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'fil_array',
        JSON.stringify(arr)
      );
    });

    it('falha silenciosamente em erro de quota', () => {
      // Simula erro de quota
      localStorage.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError');
      });

      // Nao deve lancar excecao
      expect(() => Storage.set('key', 'value')).not.toThrow();
    });

    it('armazena valores null e undefined', () => {
      Storage.set('nullValue', null);
      Storage.set('undefinedValue', undefined);

      expect(localStorage.setItem).toHaveBeenCalledWith('fil_nullValue', 'null');
    });
  });

  describe('remove()', () => {
    it('remove item com prefixo fil_', () => {
      Storage.remove('itemToRemove');

      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_itemToRemove');
    });

    it('nao lanca erro ao remover chave inexistente', () => {
      expect(() => Storage.remove('nonExistent')).not.toThrow();
    });
  });

  describe('clear()', () => {
    it('remove item especifico com prefixo', () => {
      Storage.clear('specificKey');

      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_specificKey');
    });
  });

  describe('checkAndClearOldData()', () => {
    it('limpa dados quando versao armazenada e menor que atual', () => {
      localStorage.setItem('fil_version', JSON.stringify(DATA_VERSION - 1));
      localStorage.setItem('fil_sheets', JSON.stringify([{ id: 1 }]));
      localStorage.setItem('fil_user', JSON.stringify({ name: 'Test' }));

      checkAndClearOldData();

      // Verifica que chamou removeItem para sheets e user
      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_sheets');
      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_user');
    });

    it('atualiza versao apos limpar dados antigos', () => {
      localStorage.setItem('fil_version', JSON.stringify(DATA_VERSION - 1));

      checkAndClearOldData();

      // Verifica que setItem foi chamado com a nova versao
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'fil_version',
        JSON.stringify(DATA_VERSION)
      );
    });

    it('mantem dados quando versao e atual', () => {
      localStorage.setItem('fil_version', JSON.stringify(DATA_VERSION));

      // Limpa os mocks anteriores
      localStorage.removeItem.mockClear();

      checkAndClearOldData();

      // Nao deve ter chamado removeItem para sheets ou user
      expect(localStorage.removeItem).not.toHaveBeenCalledWith('fil_sheets');
      expect(localStorage.removeItem).not.toHaveBeenCalledWith('fil_user');
    });

    it('limpa dados quando nao ha versao armazenada (versao 0)', () => {
      // Nao define fil_version, entao get retorna 0 como default

      checkAndClearOldData();

      // Deve limpar porque 0 < DATA_VERSION
      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_sheets');
      expect(localStorage.removeItem).toHaveBeenCalledWith('fil_user');
    });
  });

  describe('DATA_VERSION', () => {
    it('esta definido e e um numero positivo', () => {
      expect(typeof DATA_VERSION).toBe('number');
      expect(DATA_VERSION).toBeGreaterThan(0);
    });
  });
});
