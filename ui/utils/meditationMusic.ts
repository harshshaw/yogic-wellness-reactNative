import { media, type MediaSource } from '../lib/media';
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
    audio: media('meditation-foundation-audios/leberch-deep-meditation-375362.mp3') },
  { id: 'gentle-calm', title: 'Gentle Calm', durationSec: 174,
    audio: media('meditation-foundation-audios/leberch-meditation-509071.mp3') },
  { id: 'inner-quiet', title: 'Inner Quiet', durationSec: 328,
    audio: media('meditation-foundation-audios/leberch-meditation-510292.mp3') },
  { id: 'ambient-drift', title: 'Ambient Drift', durationSec: 306,
    audio: media('meditation-foundation-audios/leberch-meditation-ambient-375361.mp3') },
  { id: 'flowing-mind', title: 'Flowing Mind', durationSec: 324,
    audio: media('meditation-foundation-audios/leberch-meditation-meditation-music-523576.mp3') },
  { id: 'deep-journey', title: 'Deep Journey', durationSec: 549,
    audio: media('meditation-foundation-audios/nastelbom-meditation-463389.mp3') },
  { id: 'quiet-phase', title: 'Quiet Phase', durationSec: 276,
    audio: media('meditation-foundation-audios/quietphase-meditation-meditation-482096.mp3') },
  { id: 'mountain-spirit', title: 'Mountain Spirit', durationSec: 326,
    audio: media('meditation-foundation-audios/the_mountain-spiritual-meditation-444137.mp3') },
  { id: 'sacred-space', title: 'Sacred Space', durationSec: 522,
    audio: media('meditation-foundation-audios/verclub_music-meditation-music-550885.mp3') },
];

// Focus & Awareness — guided So Hum, mantra, concentration and breath counting.
export const MEDITATION_FOCUS: MeditationTrack[] = [
  { id: 'so-hum-1', title: 'So Hum I', durationSec: 110,
    audio: media('meditation-focus-audios/so-hum1.mp3') },
  { id: 'so-hum-2', title: 'So Hum II', durationSec: 102,
    audio: media('meditation-focus-audios/so-hum2.mp3') },
  { id: 'so-hum-3', title: 'So Hum III', durationSec: 101,
    audio: media('meditation-focus-audios/so-hum3.mp3') },
  { id: 'mantra-1', title: 'Mantra: Om', durationSec: 99,
    audio: media('meditation-focus-audios/mantra1.mp3') },
  { id: 'mantra-2', title: 'Mantra: A Word of Your Own', durationSec: 150,
    audio: media('meditation-focus-audios/mantra2-focus.mp3') },
  { id: 'mantra-3', title: 'Mantra: Om Shanti', durationSec: 91,
    audio: media('meditation-focus-audios/mantra3Shanti-focus.mp3') },
  { id: 'concentration-1', title: 'Concentration I', durationSec: 99,
    audio: media('meditation-focus-audios/Concentration1Focus.mp3') },
  { id: 'concentration-2', title: 'Concentration II', durationSec: 107,
    audio: media('meditation-focus-audios/Concentration2Focus.mp3') },
  { id: 'breath-count-1', title: 'Breath Counting I', durationSec: 99,
    audio: media('meditation-focus-audios/BreatheCount1-focus.mp3') },
  { id: 'breath-count-2', title: 'Breath Counting II', durationSec: 96,
    audio: media('meditation-focus-audios/BreatheCount2-focus.mp3') },
];

// Mindfulness — observing thoughts, noting.
export const MEDITATION_MINDFULNESS: MeditationTrack[] = [
  { id: 'thoughts-as-clouds', title: 'Thoughts as Clouds', durationSec: 120,
    audio: media('Mindfullness/ThoughtsAsCloud-Mindfullness.mp3') },
  { id: 'not-your-thoughts', title: 'You Are Not Your Thoughts', durationSec: 115,
    audio: media('Mindfullness/YouarenotyourThought-Mindfullness.mp3') },
  { id: 'naming-whats-here', title: "Naming What's Here", durationSec: 110,
    audio: media('Mindfullness/NamingWhatshere-Mindfullness.mp3') },
];

// Emotional Reset — short guided therapy sessions for hard feelings.
export const THERAPY_EMOTIONAL_RESET: MeditationTrack[] = [
  { id: 'anxiety-before-sleep', title: 'Anxiety Before Sleep', durationSec: 110,
    audio: media('Therapy-Emotional-Reset/anxiety-before-sleep.mp3') },
  { id: 'stress-recovery', title: 'Stress Recovery', durationSec: 111,
    audio: media('Therapy-Emotional-Reset/stressRecovery.mp3') },
  { id: 'loneliness', title: 'Loneliness', durationSec: 111,
    audio: media('Therapy-Emotional-Reset/loneliness.mp3') },
  { id: 'heartbreak', title: 'Heartbreak', durationSec: 111,
    audio: media('Therapy-Emotional-Reset/HeartBreak.mp3') },
  { id: 'confidence-repair', title: 'Confidence Repair', durationSec: 113,
    audio: media('Therapy-Emotional-Reset/confidenceRepair.mp3') },
];

// Wisdom & Stories — longer reflective narrations to rest into.
export const WISDOM_STORIES: MeditationTrack[] = [
  { id: 'steve-jobs-success', title: 'Steve Jobs: Turning Setbacks Around', durationSec: 202,
    audio: media('audios/successStories/steveJobs-success.mp3') },
  { id: 'stoic-marcus-aurelius', title: 'Stoic Wisdom: Marcus Aurelius', durationSec: 184,
    audio: media('audios/stoicWisdom/stoicWisdom-Marcus%20Aurelius.mp3') },
  { id: 'life-wisdom-detachment', title: 'Life Wisdom: Detachment from Outcomes', durationSec: 177,
    audio: media('audios/lifeWisdom/life%20Widsom-%20detachment%20from%20outcomes.mp3') },
  { id: 'confidence-before-sleep', title: 'Confidence Before Sleep', durationSec: 151,
    audio: media('audios/confidenceBeforeSleep/confidence-before-sleep.mp3') },
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

const byId = (id: string) => MEDITATION_MUSIC.find(t => t.id === id) ?? MEDITATION_MUSIC[0];

/** Choose a meditation track for the morning reflection, based on how the day begins. */
export function pickForReflection(
  mood?: string,
  energy?: string,
  sleep?: string,
): { track: MeditationTrack; hint: string } {
  const lowEnergy = energy === 'low' || energy === 'slightly_low';
  const poorSleep = sleep === 'poor' || sleep === 'average';
  const heavyMood = ['stressed', 'anxious', 'overwhelmed', 'sad', 'irritable'].includes(mood ?? '');
  const highEnergy = energy === 'high' || energy === 'very_high';
  const calmMood = ['calm', 'neutral', 'happy'].includes(mood ?? '');

  if (heavyMood || lowEnergy || poorSleep) {
    return { track: byId('gentle-calm'), hint: 'A soft, grounding meditation to settle a heavy or tired morning.' };
  }
  if (highEnergy && calmMood) {
    return { track: byId('mountain-spirit'), hint: 'Channel your bright energy into steady, spacious focus.' };
  }
  return { track: byId('inner-quiet'), hint: 'A balanced meditation to centre your mind for the day ahead.' };
}
