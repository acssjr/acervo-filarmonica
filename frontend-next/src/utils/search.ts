export const levenshteinDistance = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const costs: number[] = [];

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

interface SearchItem {
  title: string;
  composer: string;
}

export const findSimilar = (query: string, items: SearchItem[], threshold = 3): string | null => {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return null;

  let bestMatch: string | null = null;
  let bestDistance = Infinity;

  items.forEach((item) => {
    const titleDist = levenshteinDistance(q, item.title);
    const titleWords = item.title.toLowerCase().split(" ");
    const wordDistances = titleWords.map((word) => levenshteinDistance(q, word));
    const minWordDist = Math.min(...wordDistances);
    const minDist = Math.min(titleDist, minWordDist);

    if (minDist < bestDistance && minDist <= threshold && minDist > 0) {
      bestDistance = minDist;
      bestMatch = item.title;
    }

    const composerDist = levenshteinDistance(q, item.composer);
    if (composerDist < bestDistance && composerDist <= threshold && composerDist > 0) {
      bestDistance = composerDist;
      bestMatch = item.composer;
    }
  });

  return bestMatch;
};

export const levenshtein = levenshteinDistance;
