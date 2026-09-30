import { describe, test, expect, jest } from '@jest/globals';
import { render, fireEvent, waitFor } from '@testing-library/react';
import OverlayScrollbars from './OverlayScrollbars';
describe('rolagem sobreposta', () => {
  test('acompanha o contêiner sem adicionar elementos ao seu layout', async () => {
    const prior = global.ResizeObserver;
    global.ResizeObserver = class { observe() {} disconnect() {} };
    const scroller = document.createElement('div');
    document.body.appendChild(scroller);
    scroller.style.overflowY = 'auto';
    Object.defineProperties(scroller, { clientHeight: { value: 100 }, scrollHeight: { value: 600 }, clientWidth: { value: 200 }, scrollWidth: { value: 200 } });
    scroller.getBoundingClientRect = () => ({ top: 10, bottom: 110, left: 0, right: 200 });
    const { unmount } = render(<OverlayScrollbars />);
    fireEvent.scroll(scroller);
    await waitFor(() => expect(document.querySelector('.acervo-scrollbar.y')).toBeInTheDocument());
    expect(scroller.children).toHaveLength(0);
    expect(document.querySelector('.acervo-scrollbar.y').style.left).toBe('188px');
    scroller.scrollTop = 200;
    fireEvent.scroll(scroller);
    await waitFor(() => expect(document.querySelector('.acervo-scrollbar-thumb').style.transform).not.toBe('translateY(0px)'));
    unmount(); scroller.remove(); global.ResizeObserver = prior;
  });
});
