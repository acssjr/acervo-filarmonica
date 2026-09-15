export function createRepertoireTracker(trackEvent) {
  let lastRepertoireId = null;

  return (repertoireId) => {
    if (!repertoireId || lastRepertoireId === repertoireId) {
      return false;
    }

    lastRepertoireId = repertoireId;
    trackEvent({
      tipo: 'repertorio_aberto',
      origem: 'repertorio',
      repertorio_id: repertoireId
    });
    return true;
  };
}
