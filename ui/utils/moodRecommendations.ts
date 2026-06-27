import moodRules from '../server/data/mood-rule.json';

type MoodState = keyof typeof moodRules.recommendations;
type EnergyLevel = 'low' | 'slightly_low' | 'moderate' | 'high' | 'very_high';
type SleepQuality = 'poor' | 'average' | 'good' | 'excellent';

// Maps the user's mood key (from reflection screen) to a MoodState key in the JSON.
// Energy + sleep can escalate a neutral/happy mood to STRESSED or OVERWHELMED.
export function getMoodState(
  mood: string,
  energy: EnergyLevel,
  sleep: SleepQuality,
): MoodState {
  const moodMap: Record<string, MoodState> = {
    calm:        'CALM',
    happy:       'HAPPY',
    stressed:    'STRESSED',
    anxious:     'ANXIOUS',
    overwhelmed: 'OVERWHELMED',
    irritable:   'IRRITABLE',
    sad:         'SAD',
    neutral:     'NEUTRAL',
  };

  const base: MoodState = moodMap[mood] ?? 'NEUTRAL';

  // If the user is otherwise calm/happy/neutral but has poor sleep + low energy, escalate.
  const positiveBase = base === 'CALM' || base === 'HAPPY' || base === 'NEUTRAL';
  const poorSleep = sleep === 'poor' || sleep === 'average';
  const lowEnergy = energy === 'low' || energy === 'slightly_low';

  if (positiveBase && poorSleep && lowEnergy) return 'OVERWHELMED';
  if (positiveBase && poorSleep) return 'STRESSED';
  if (positiveBase && lowEnergy) return 'STRESSED';

  return base;
}

export type RecommendationItem = {
  id: string;
  title: string;
  meta: string;
  type: 'breathing' | 'meditation' | 'music' | 'video';
};

export type RecommendationGroup = {
  label: 'Morning' | 'Afternoon' | 'Evening';
  items: RecommendationItem[];
};

// Builds the Morning / Afternoon / Evening groups from the mood-rule JSON.
export function getRecommendations(moodState: MoodState): RecommendationGroup[] {
  const rec = moodRules.recommendations[moodState];

  const toItem = (title: string, type: RecommendationItem['type'], durationMin: number): RecommendationItem => ({
    id: title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    title,
    meta: `${durationMin} min`,
    type,
  });

  return [
    {
      label: 'Morning',
      items: [
        toItem(rec.breathing[0], 'breathing', 6),
        toItem(rec.breathing[1], 'breathing', 6),
        toItem(rec.meditations[0], 'meditation', 6),
        toItem(rec.music[0], 'music', 10),
        toItem(rec.videos[0], 'video', 8),
      ],
    },
    {
      label: 'Afternoon',
      items: [
        toItem(rec.meditations[1], 'meditation', 5),
        toItem(rec.music[1], 'music', 10),
        toItem(rec.videos[1], 'video', 8),
      ],
    },
    {
      label: 'Evening',
      items: [
        toItem(rec.breathing[2], 'breathing', 7),
        toItem(rec.music[2], 'music', 20),
      ],
    },
  ];
}
