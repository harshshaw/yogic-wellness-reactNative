// Gentle one-liners shown while content loads. The breath prompt is always
// shown first; the rest rotate in a random order.
export const LOADING_QUOTES: string[] = [
  'Take a deep breath in… and slowly let it go.',
  'Inhale calm. Exhale everything else.',
  'This moment is enough.',
  'Let your shoulders drop. You’re safe here.',
  'Breathe in peace, breathe out tension.',
  'There is nowhere to be but here.',
  'Soften your gaze. Soften your mind.',
  'Every breath is a fresh beginning.',
  'Rest is not idleness — it’s how you return to yourself.',
  'You don’t have to hold it all together right now.',
  'Slow down. The world can wait a moment.',
  'Peace begins with a single breath.',
  'Feel the ground beneath you. You are held.',
  'Let go of the day. Just for now.',
  'Stillness is a place you can always come home to.',
  'Notice the quiet pause between each breath.',
  'Be gentle with yourself today.',
  'Calm is not far away — it’s already within you.',
  'Wherever you are, that’s where you’re meant to be.',
  'Arriving… settle in and breathe.',
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Display order: the breath prompt first, then the rest shuffled. */
export function orderedQuotes(): string[] {
  return [LOADING_QUOTES[0], ...shuffle(LOADING_QUOTES.slice(1))];
}
