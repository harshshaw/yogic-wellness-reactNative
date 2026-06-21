import type { ReflectionData } from '../hooks/useReflection';

// Maps today's reflection inputs into 0–100 wellness scores so the Progress
// screen can reflect how the user actually checked in this morning.

// Mood positivity — higher means a calmer / more positive emotional state.
const MOOD_SCORE: Record<string, number> = {
  happy: 100,
  calm: 90,
  neutral: 60,
  irritable: 40,
  stressed: 35,
  anxious: 30,
  sad: 25,
  overwhelmed: 20,
};

const ENERGY_SCORE: Record<ReflectionData['energy'], number> = {
  low: 20,
  slightly_low: 40,
  moderate: 60,
  high: 80,
  very_high: 100,
};

const SLEEP_SCORE: Record<ReflectionData['sleep'], number> = {
  poor: 25,
  average: 50,
  good: 75,
  excellent: 100,
};

export type ReflectionProgress = {
  mood: number;
  energy: number;
  sleep: number;
  /** Average of the three, rounded — overall wellness for the day. */
  overall: number;
  /** Number of the three areas at/above the "healthy" threshold (>= 60). */
  goalsMet: number;
  goalsTotal: number;
  /** Short, encouraging message tuned to the overall score. */
  headline: string;
  message: string;
};

const MOOD_LABEL: Record<string, string> = {
  happy: 'Happy',
  calm: 'Calm',
  neutral: 'Neutral',
  irritable: 'Irritable',
  stressed: 'Stressed',
  anxious: 'Anxious',
  sad: 'Sad',
  overwhelmed: 'Overwhelmed',
};

export const moodLabel = (mood: string): string =>
  MOOD_LABEL[mood] ?? mood.charAt(0).toUpperCase() + mood.slice(1);

export const computeReflectionProgress = (
  data: ReflectionData
): ReflectionProgress => {
  const mood = MOOD_SCORE[data.mood] ?? 50;
  const energy = ENERGY_SCORE[data.energy] ?? 50;
  const sleep = SLEEP_SCORE[data.sleep] ?? 50;
  const overall = Math.round((mood + energy + sleep) / 3);

  const scores = [mood, energy, sleep];
  const goalsTotal = scores.length;
  const goalsMet = scores.filter(s => s >= 60).length;

  let headline: string;
  let message: string;
  if (overall >= 80) {
    headline = 'Thriving today!';
    message =
      'Your mind and body are in a great place. A perfect day to deepen your practice.';
  } else if (overall >= 60) {
    headline = 'Steady and balanced';
    message =
      "You're in a good rhythm. Keep nurturing yourself with mindful moments.";
  } else if (overall >= 40) {
    headline = 'Be gentle with yourself';
    message =
      'Some areas need a little care today. A calming breathing session could help.';
  } else {
    headline = 'A restful day is okay';
    message =
      'Today feels heavy — that\'s alright. Prioritize rest and slow, grounding breaths.';
  }

  return {
    mood,
    energy,
    sleep,
    overall,
    goalsMet,
    goalsTotal,
    headline,
    message,
  };
};
