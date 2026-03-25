// Mock de @gsap/react para testes Jest
// useGSAP signature: useGSAP(callback, { scope, dependencies, revertOnUpdate, ... })
import { useEffect } from 'react';

export const useGSAP = (callback, config) => {
  // Config pode ser um objeto { scope, dependencies } ou um array (uso simplificado)
  const deps = Array.isArray(config) ? config : (config?.dependencies ?? []);
  useEffect(() => {
    if (typeof callback === 'function') {
      try {
        callback({ gsap: {}, context: {} });
      } catch {
        // Silencia erros de animação em testes
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};
