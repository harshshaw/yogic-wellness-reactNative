import { media, type MediaSource } from '../lib/media';
const VIDEO_ROCKY    = media('background-video/scenicViewrockyhills.mp4');
// NOTE: scenicViewocenic.mp4 was removed (exceeded GitHub's 100MB limit / pending recovery).
// The ocean/water keyword falls back to portrait2 until the file is restored.
const VIDEO_OCEANIC  = media('background-video/portrait2.mp4');
const VIDEO_BALLOON  = media('background-video/scenicViewballons.mp4');
const VIDEO_PORTRAIT = media('background-video/portrait2.mp4');

const AUDIO_HIMALAYA = media('music-playlist/sounovamusic-himalaya-journey-449825.mp3');
const AUDIO_DEFAULT  = media('music-playlist/screen-recording.mp3');

// Pool of rain backdrop videos — one is picked at random whenever a rain
// track starts playing, and swiping switches to another random pick.
export const RAIN_VIDEOS: MediaSource[] = [
  media('background-video/rain-background-videos/rain-ground-ripple.mp4'),
  media('background-video/rain-background-videos/rain-island.mp4'),
  media('background-video/rain-background-videos/rain-leaf.mp4'),
  media('background-video/rain-background-videos/rain-street.mp4'),
  media('background-video/rain-background-videos/rain-on-window.mp4'),
];

// Pool of immersive backdrop videos for the meditation player's full-screen
// mode. Navigable with prev/next, same as the rain pool. Add more files here.
export const MEDITATION_VIDEOS: MediaSource[] = [
  media('background-video/meditation-videos/galaxyVideo.mp4'),
  media('background-video/meditation-videos/sky_mountians.mp4'),
  media('background-video/meditation-videos/redGalaxy.mp4'),
  media('background-video/meditation-videos/movingGalaxy.mp4'),
];

// Long, self-contained nature videos (each already carries its own audio).
// Played full-screen with sound and no timer — see NatureVideoScreen.
export type NatureVideo = { id: string; title: string; sub: string; source: MediaSource };
export const NATURE_VIDEOS: NatureVideo[] = [
  { id: 'himalayan-wind',  title: 'Himalayan Wind',        sub: 'High mountain air',
    source: media('Nature-videos/Himalayan%20Wind_prob3.mp4') },
  { id: 'ocean-waves',     title: 'Ocean Waves',           sub: 'Rolling surf',
    source: media('Nature-videos/Ocean%20Waves_prob3.mp4') },
  { id: 'redwood-forest',  title: 'Redwood Forest at Dusk', sub: 'Tall trees, fading light',
    source: media('Nature-videos/Redwood%20Forest%20at%20Dusk_prob3.mp4') },
  { id: 'tibetan-bowls',   title: 'Tibetan Bowls',         sub: 'Resonant singing bowls',
    source: media('Nature-videos/Tibetan%20Bowls_prob3.mp4') },
];

// Returns a random rain video, optionally avoiding the one currently showing
// so a swipe always visibly changes the backdrop.
export function randomRainVideo(exclude?: MediaSource): MediaSource {
  if (RAIN_VIDEOS.length === 1) return RAIN_VIDEOS[0];
  let pick = RAIN_VIDEOS[Math.floor(Math.random() * RAIN_VIDEOS.length)];
  // Compare by uri — media() returns a fresh object each call, so identity
  // comparison would never match and the swipe could repeat the same video.
  while (exclude !== undefined && pick.uri === exclude.uri) {
    pick = RAIN_VIDEOS[Math.floor(Math.random() * RAIN_VIDEOS.length)];
  }
  return pick;
}

export type SessionMedia = {
  video: MediaSource;
  audio: MediaSource;
  label: string;
};

// Pick video by matching keywords in the session id (derived from the title)
function videoForId(id: string): MediaSource {
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
