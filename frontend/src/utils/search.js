// ===== SEARCH UTILITIES =====
// Fuzzy search com Levenshtein Distance

export const levenshteinDistance = (str1, str2) => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const costs = [];

  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return costs[s2.length];
};

export const findSimilar = (query, items, threshold = 3) => {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return null;

  let bestMatch = null;
  let bestDistance = Infinity;

  items.forEach(item => {
    // Check title
    const titleDist = levenshteinDistance(q, item.title);
    const titleWords = item.title.toLowerCase().split(' ');
    const wordDistances = titleWords.map(word => levenshteinDistance(q, word));
    const minWordDist = Math.min(...wordDistances);

    const minDist = Math.min(titleDist, minWordDist);

    if (minDist < bestDistance && minDist <= threshold && minDist > 0) {
      bestDistance = minDist;
      bestMatch = item.title;
    }

    // Check composer
    const composerDist = levenshteinDistance(q, item.composer);
    if (composerDist < bestDistance && composerDist <= threshold && composerDist > 0) {
      bestDistance = composerDist;
      bestMatch = item.composer;
    }
  });

  return bestMatch;
};

// Alias para compatibilidade
export const levenshtein = levenshteinDistance;

export default { levenshteinDistance, levenshtein, findSimilar };
