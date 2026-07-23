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

// Mantra & focus tracks (So Hum / mantra chanting) for the Rest screen.
export const MEDITATION_FOCUS: MeditationTrack[] = [
  { id: 'so-hum-1', title: 'So Hum I', durationSec: 110,
    audio: media('meditation-focus-audios/so-hum1.mp3') },
  { id: 'so-hum-2', title: 'So Hum II', durationSec: 102,
    audio: media('meditation-focus-audios/so-hum2.mp3') },
  { id: 'so-hum-3', title: 'So Hum III', durationSec: 101,
    audio: media('meditation-focus-audios/so-hum3.mp3') },
  { id: 'mantra-1', title: 'Mantra', durationSec: 99,
    audio: media('meditation-focus-audios/mantra1.mp3') },
];

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
