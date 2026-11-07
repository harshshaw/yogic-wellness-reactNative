import { media, type MediaSource } from '../lib/media';
import { getMoodState } from './moodRecommendations';
// Ambient meditation-music tracks (instrumental, no narration). Used on the
// Rest screen and as randomised "morning mindfulness" suggestions.

export type MeditationTrack = {
  id: string;
  title: string;
  durationSec: number;
  audio: MediaSource;
};

export const MEDITATION_MUSIC: MeditationTrack[] = [
  { id: 'deep-stillness', title: 'Deep Stillness', durationSec: 290,
    audio: media('rest/meditation-music/deep-stillness.mp3') },
  { id: 'gentle-calm', title: 'Gentle Calm', durationSec: 174,
    audio: media('rest/meditation-music/gentle-calm.mp3') },
  { id: 'inner-quiet', title: 'Inner Quiet', durationSec: 328,
    audio: media('rest/meditation-music/inner-quiet.mp3') },
  { id: 'ambient-drift', title: 'Ambient Drift', durationSec: 306,
    audio: media('rest/meditation-music/ambient-drift.mp3') },
  { id: 'flowing-mind', title: 'Flowing Mind', durationSec: 324,
    audio: media('rest/meditation-music/flowing-mind.mp3') },
  { id: 'deep-journey', title: 'Deep Journey', durationSec: 549,
    audio: media('rest/meditation-music/deep-journey.mp3') },
  { id: 'quiet-phase', title: 'Quiet Phase', durationSec: 276,
    audio: media('rest/meditation-music/quiet-phase.mp3') },
  { id: 'mountain-spirit', title: 'Mountain Spirit', durationSec: 326,
    audio: media('rest/meditation-music/mountain-spirit.mp3') },
  { id: 'sacred-space', title: 'Sacred Space', durationSec: 522,
    audio: media('rest/meditation-music/sacred-space.mp3') },
];

// Focus & Awareness — guided So Hum, mantra, concentration and breath counting.
export const MEDITATION_FOCUS: MeditationTrack[] = [
  { id: 'so-hum-1', title: 'So Hum I', durationSec: 110,
    audio: media('rest/mantra-focus/so-hum-1.mp3') },
  { id: 'so-hum-2', title: 'So Hum II', durationSec: 102,
    audio: media('rest/mantra-focus/so-hum-2.mp3') },
  { id: 'so-hum-3', title: 'So Hum III', durationSec: 101,
    audio: media('rest/mantra-focus/so-hum-3.mp3') },
  { id: 'mantra-1', title: 'Mantra: Om', durationSec: 99,
    audio: media('rest/mantra-focus/mantra-om.mp3') },
  { id: 'mantra-2', title: 'Mantra: A Word of Your Own', durationSec: 150,
    audio: media('rest/mantra-focus/mantra-word-of-your-own.mp3') },
  { id: 'mantra-3', title: 'Mantra: Om Shanti', durationSec: 91,
    audio: media('rest/mantra-focus/mantra-om-shanti.mp3') },
  { id: 'concentration-1', title: 'Concentration I', durationSec: 99,
    audio: media('rest/mantra-focus/concentration-1.mp3') },
  { id: 'concentration-2', title: 'Concentration II', durationSec: 107,
    audio: media('rest/mantra-focus/concentration-2.mp3') },
  { id: 'breath-count-1', title: 'Breath Counting I', durationSec: 99,
    audio: media('rest/mantra-focus/breath-count-1.mp3') },
  { id: 'breath-count-2', title: 'Breath Counting II', durationSec: 96,
    audio: media('rest/mantra-focus/breath-count-2.mp3') },
];

// Mindfulness — observing thoughts, noting.
export const MEDITATION_MINDFULNESS: MeditationTrack[] = [
  { id: 'thoughts-as-clouds', title: 'Thoughts as Clouds', durationSec: 120,
    audio: media('rest/mindfulness/thoughts-as-clouds.mp3') },
  { id: 'not-your-thoughts', title: 'You Are Not Your Thoughts', durationSec: 115,
    audio: media('rest/mindfulness/not-your-thoughts.mp3') },
  { id: 'naming-whats-here', title: "Naming What's Here", durationSec: 110,
    audio: media('rest/mindfulness/naming-whats-here.mp3') },
];

// Emotional Reset — short guided therapy sessions for hard feelings.
export const THERAPY_EMOTIONAL_RESET: MeditationTrack[] = [
  { id: 'anxiety-before-sleep', title: 'Anxiety Before Sleep', durationSec: 110,
    audio: media('rest/emotional-reset/anxiety-before-sleep.mp3') },
  { id: 'stress-recovery', title: 'Stress Recovery', durationSec: 111,
    audio: media('rest/emotional-reset/stress-recovery.mp3') },
  { id: 'loneliness', title: 'Loneliness', durationSec: 111,
    audio: media('rest/emotional-reset/loneliness.mp3') },
  { id: 'heartbreak', title: 'Heartbreak', durationSec: 111,
    audio: media('rest/emotional-reset/heartbreak.mp3') },
  { id: 'confidence-repair', title: 'Confidence Repair', durationSec: 113,
    audio: media('rest/emotional-reset/confidence-repair.mp3') },
];

// Wisdom & Stories — longer reflective narrations to rest into.
export const WISDOM_STORIES: MeditationTrack[] = [
  { id: 'steve-jobs-success', title: 'Steve Jobs: Turning Setbacks Around', durationSec: 202,
    audio: media('rest/wisdom-stories/steve-jobs-success.mp3') },
  { id: 'stoic-marcus-aurelius', title: 'Stoic Wisdom: Marcus Aurelius', durationSec: 184,
    audio: media('rest/wisdom-stories/stoic-marcus-aurelius.mp3') },
  { id: 'life-wisdom-detachment', title: 'Life Wisdom: Detachment from Outcomes', durationSec: 177,
    audio: media('rest/wisdom-stories/life-wisdom-detachment.mp3') },
  { id: 'confidence-before-sleep', title: 'Confidence Before Sleep', durationSec: 151,
    audio: media('rest/wisdom-stories/confidence-before-sleep.mp3') },
  { id: 'gandhi-strength-of-peace', title: 'Mahatma Gandhi: The Strength of Peace', durationSec: 267,
    audio: media('rest/wisdom-stories/gandhi-strength-of-peace.mp3') },
  { id: 'mlk-movement-of-conscience', title: 'Martin Luther King Jr.: A Movement of Conscience', durationSec: 255,
    audio: media('rest/wisdom-stories/mlk-movement-of-conscience.mp3') },
  { id: 'diana-compassion-in-spotlight', title: 'Princess Diana: Compassion in the Spotlight', durationSec: 237,
    audio: media('rest/wisdom-stories/diana-compassion-in-spotlight.mp3') },
];

// A single flat pool of every guided/spoken audio track — used for the
// "Recommended for you" hero and the Wind Down plan's random picks.
export const ALL_REST_AUDIO: MeditationTrack[] = [
  ...MEDITATION_MUSIC,
  ...MEDITATION_FOCUS,
  ...MEDITATION_MINDFULNESS,
  ...THERAPY_EMOTIONAL_RESET,
  ...WISDOM_STORIES,
];

/** A random track from the whole library (optionally excluding one id). */
export function randomRestTrack(excludeId?: string): MeditationTrack {
  const pool = excludeId ? ALL_REST_AUDIO.filter(t => t.id !== excludeId) : ALL_REST_AUDIO;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** A random track from a given list (safe if the list is empty → undefined). */
export function randomFrom(list: MeditationTrack[]): MeditationTrack | undefined {
  return list.length ? list[Math.floor(Math.random() * list.length)] : undefined;
}

/** A random track, optionally avoiding one already showing. */
export function randomTrack(excludeId?: string): MeditationTrack {
  if (MEDITATION_MUSIC.length === 1) return MEDITATION_MUSIC[0];
  let pick = MEDITATION_MUSIC[Math.floor(Math.random() * MEDITATION_MUSIC.length)];
  while (excludeId && pick.id === excludeId) {
    pick = MEDITATION_MUSIC[Math.floor(Math.random() * MEDITATION_MUSIC.length)];
  }
  return pick;
}

export const formatMin = (sec: number) => `${Math.round(sec / 60)} min`;

// ── Mood-aware "Today's Recommendation" ─────────────────────────────────────
// Draws from the whole Rest audio library (music, mindfulness, focus, therapy,
// wisdom) — picking a mood-appropriate pool, then a RANDOM track within it.

// Tag tracks with the section label shown on the recommendation card.
type Tagged = { track: MeditationTrack; label: string };
const tag = (list: MeditationTrack[], label: string): Tagged[] =>
  list.map(track => ({ track, label }));

const byIds = (list: MeditationTrack[], ids: string[]) =>
  list.filter(t => ids.includes(t.id));

const POOL_MUSIC     = () => tag(MEDITATION_MUSIC, 'Meditation Music');
const POOL_MINDFUL   = () => tag(MEDITATION_MINDFULNESS, 'Mindfulness');
const POOL_FOCUS     = () => tag(MEDITATION_FOCUS, 'Mantra & Focus');
const POOL_WISDOM    = () => tag(WISDOM_STORIES, 'Wisdom & Story');
const THERAPY_CALMING = () => tag(byIds(THERAPY_EMOTIONAL_RESET, ['anxiety-before-sleep', 'stress-recovery']), 'Emotional Reset');
const THERAPY_HEALING = () => tag(byIds(THERAPY_EMOTIONAL_RESET, ['loneliness', 'heartbreak', 'confidence-repair']), 'Emotional Reset');

// Mood-state → candidate pool + a one-line hint.
function candidatesForMood(state: string): { pool: Tagged[]; hint: string } {
  switch (state) {
    case 'STRESSED':
    case 'OVERWHELMED':
      return {
        pool: [...THERAPY_CALMING(), ...POOL_MUSIC(), ...POOL_MINDFUL()],
        hint: 'Something soothing to unwind a stressed, full mind.',
      };
    case 'ANXIOUS':
      return {
        pool: [...THERAPY_CALMING(), ...POOL_MINDFUL(), ...POOL_MUSIC()],
        hint: 'A gentle practice to steady an anxious morning.',
      };
    case 'SAD':
      return {
        pool: [...THERAPY_HEALING(), ...POOL_WISDOM(), ...POOL_MUSIC()],
        hint: 'A tender, uplifting session to meet a heavy heart.',
      };
    case 'IRRITABLE':
      return {
        pool: [...POOL_MINDFUL(), ...POOL_MUSIC(), ...POOL_WISDOM()],
        hint: 'A cooling, grounding practice to soften the edges.',
      };
    case 'HAPPY':
    case 'CALM':
      return {
        pool: [...POOL_MUSIC(), ...POOL_WISDOM(), ...POOL_FOCUS()],
        hint: 'Ride your bright energy into steady, spacious focus.',
      };
    case 'NEUTRAL':
    default:
      return {
        pool: [...POOL_MUSIC(), ...POOL_MINDFUL(), ...POOL_FOCUS(), ...POOL_WISDOM()],
        hint: 'A balanced session to centre your mind for the day.',
      };
  }
}

/**
 * Pick a Rest-library track for the morning "Today's Recommendation", based on
 * how the day begins. Mood-appropriate pool, then a random track within it.
 */
export function pickForReflection(
  mood?: string,
  energy?: string,
  sleep?: string,
): { track: MeditationTrack; hint: string; label: string } {
  const state = getMoodState(
    mood ?? 'neutral',
    (energy as any) ?? 'moderate',
    (sleep as any) ?? 'good',
  );
  const { pool, hint } = candidatesForMood(state);
  const safePool = pool.length ? pool : POOL_MUSIC();
  const pick = safePool[Math.floor(Math.random() * safePool.length)];
  return { track: pick.track, hint, label: pick.label };
}
