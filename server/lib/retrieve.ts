export type Verse = {
  ref: string;
  topic: string;
  // Sanskrit source fields — present for Gita verses, omitted for other
  // knowledge bases (e.g. Relationship Guru).
  sanskrit?: string;
  transliteration?: string;
  english: string;
  context: string;
  themes: string[];
};

export type EmbeddedVerse = Verse & { embedding: number[] };

const cosine = (a: number[], b: number[]): number => {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const topK = (
  queryEmbedding: number[],
  corpus: EmbeddedVerse[],
  k: number
): { verse: Verse; score: number }[] =>
  corpus
    .map(v => ({
      verse: stripEmbedding(v),
      score: cosine(queryEmbedding, v.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

const stripEmbedding = ({ embedding, ...v }: EmbeddedVerse): Verse => v;
