// Mock de gsap para testes Jest
// Evita erros de ESM e garante que animações não bloqueiem testes

const noop = () => {};
const returnSelf = () => gsapMock;

const gsapMock = {
  to: (target, vars) => {
    // Simula animação concluída imediatamente com valor final
    if (vars && typeof vars.onUpdate === 'function') {
      if (target && vars.val !== undefined) {
        target.val = vars.val;
      }
      vars.onUpdate();
    }
    if (vars && typeof vars.onComplete === 'function') {
      vars.onComplete();
    }
  },
  from: noop,
  fromTo: noop,
  set: noop,
  killTweensOf: noop,
  registerPlugin: noop,
  timeline: () => ({
    to: returnSelf,
    from: returnSelf,
    fromTo: returnSelf,
    set: returnSelf,
    kill: noop,
    pause: noop,
    play: noop,
    reverse: noop,
  }),
  utils: {
    toArray: (selector) => [],
    clamp: (min, max, val) => Math.min(Math.max(val, min), max),
  },
  ticker: {
    add: noop,
    remove: noop,
  },
  getById: () => null,
  globalTimeline: { kill: noop },
};

export default gsapMock;
export const gsap = gsapMock;
