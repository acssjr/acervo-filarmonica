import { describe, expect, it, jest } from '@jest/globals';
import { createRepertoireTracker } from './analyticsTracking';

describe('createRepertoireTracker', () => {
  it('registra uma abertura por seleção consecutiva e evita duplicação', () => {
    const trackEvent = jest.fn();
    const track = createRepertoireTracker(trackEvent);

    expect(track()).toBe(false);
    expect(track(7)).toBe(true);
    expect(track(7)).toBe(false);
    expect(track(8)).toBe(true);

    expect(trackEvent).toHaveBeenCalledTimes(2);
    expect(trackEvent).toHaveBeenNthCalledWith(1, {
      tipo: 'repertorio_aberto',
      origem: 'repertorio',
      repertorio_id: 7
    });
  });
});
