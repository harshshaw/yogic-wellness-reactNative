const VIDEO_ROCKY    = require('../assets/background-video/scenicViewrockyhills.mp4');
// NOTE: scenicViewocenic.mp4 was removed (exceeded GitHub's 100MB limit / pending recovery).
// The ocean/water keyword falls back to portrait2 until the file is restored.
const VIDEO_OCEANIC  = require('../assets/background-video/portrait2.mp4');
const VIDEO_BALLOON  = require('../assets/background-video/scenicViewballons.mp4');
const VIDEO_PORTRAIT = require('../assets/background-video/portrait2.mp4');

const AUDIO_HIMALAYA = require('../assets/music-playlist/sounovamusic-himalaya-journey-449825.mp3');
const AUDIO_DEFAULT  = require('../assets/music-playlist/screen-recording.mp3');

// Pool of rain backdrop videos — one is picked at random whenever a rain
// track starts playing, and swiping switches to another random pick.
export const RAIN_VIDEOS: ReturnType<typeof require>[] = [
  require('../assets/background-video/rain-background-videos/rain-ground-ripple.mp4'),
  require('../assets/background-video/rain-background-videos/rain-island.mp4'),
  require('../assets/background-video/rain-background-videos/rain-leaf.mp4'),
  require('../assets/background-video/rain-background-videos/rain-street.mp4'),
  require('../assets/background-video/rain-background-videos/rain-on-window.mp4'),
];

// Pool of immersive backdrop videos for the meditation player's full-screen
// mode. Navigable with prev/next, same as the rain pool. Add more files here.
export const MEDITATION_VIDEOS: ReturnType<typeof require>[] = [
  require('../assets/background-video/meditation-videos/galaxyVideo.mp4'),
  require('../assets/background-video/meditation-videos/sky_mountians.mp4'),
  require('../assets/background-video/meditation-videos/redGalaxy.mp4'),
  require('../assets/background-video/meditation-videos/movingGalaxy.mp4'),
];

// Returns a random rain video, optionally avoiding the one currently showing
// so a swipe always visibly changes the backdrop.
export function randomRainVideo(exclude?: ReturnType<typeof require>): ReturnType<typeof require> {
  if (RAIN_VIDEOS.length === 1) return RAIN_VIDEOS[0];
  let pick = RAIN_VIDEOS[Math.floor(Math.random() * RAIN_VIDEOS.length)];
  while (exclude !== undefined && pick === exclude) {
    pick = RAIN_VIDEOS[Math.floor(Math.random() * RAIN_VIDEOS.length)];
  }
  return pick;
}

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
