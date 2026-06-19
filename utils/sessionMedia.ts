const VIDEO_ROCKY    = require('../assets/background-video/scenicViewrockyhills.mp4');
const VIDEO_OCEANIC  = require('../assets/background-video/scenicViewocenic.mp4');
const VIDEO_BALLOON  = require('../assets/background-video/scenicViewballons.mp4');
const VIDEO_PORTRAIT = require('../assets/background-video/portrait2.mp4');

const AUDIO_HIMALAYA = require('../assets/music-playlist/sounovamusic-himalaya-journey-449825.mp3');
const AUDIO_DEFAULT  = require('../assets/music-playlist/screen-recording.mp3');

export type SessionMedia = {
  video: ReturnType<typeof require>;
  audio: ReturnType<typeof require>;
  label: string;
};

// Pick video by matching keywords in the session id (derived from the title)
function videoForId(id: string): ReturnType<typeof require> {
  if (/forest|rocky|hill|tree|jungle|grove/.test(id))          return VIDEO_ROCKY;
  if (/ocean|wave|rain|river|water|sea|lake|stream/.test(id))  return VIDEO_OCEANIC;
  if (/balloon|sky|cloud|air|himalaya|mountain|peak/.test(id)) return VIDEO_BALLOON;
  return VIDEO_PORTRAIT;
}

export function getSessionMedia(id: string, type: 'breathing' | 'meditation' | 'music' | 'video'): SessionMedia {
  const video = videoForId(id);
  const audio = type === 'music' ? AUDIO_HIMALAYA : AUDIO_DEFAULT;

  const labels: Record<typeof type, string> = {
    breathing:  'Breathing Session',
    meditation: 'Meditation',
    music:      'Himalaya Journey',
    video:      'Guided Session',
  };

  return { video, audio, label: labels[type] };
}
