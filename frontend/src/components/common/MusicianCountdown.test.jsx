import { act, render, screen, waitFor, within } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import MusicianCountdown from './MusicianCountdown.jsx';

describe('MusicianCountdown', () => {
  const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get() {
        const measureId = this.dataset?.countdownMeasureId;
        if (measureId === 'rehearsal') return 92;
        if (measureId === 'presentation') return 128;
        return 0;
      }
    });
  });

  afterAll(() => {
    if (originalOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originalOffsetHeight);
    } else {
      delete HTMLElement.prototype.offsetHeight;
    }
  });

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-03T12:00:00-03:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('reserva a altura do maior estado para evitar salto quando alterna entre ensaio e apresentação', async () => {
    render(
      <MusicianCountdown
        diasEnsaio={{ dias: [1], hora: 19 }}
        repertorioAtivo={{
          nome: '100 Anos do Paco Municipal',
          data_apresentacao: '2026-04-07'
        }}
        modoRecesso={false}
        isDark={true}
        variant="mobile"
      />
    );

    const stage = screen.getByTestId('musician-countdown-stage');

    await waitFor(() => {
      expect(stage.style.minHeight).toBe('128px');
    });

    expect(within(stage).getByText('Próximo ensaio')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(6000);
    });

    await waitFor(() => {
      expect(within(stage).getByText('Próxima apresentação')).toBeInTheDocument();
    });

    expect(stage.style.minHeight).toBe('128px');
  });
});
