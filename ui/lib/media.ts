// Remote media (audio + video) served from Cloud Storage rather than bundled
// into the app. Keeping ~447MB of mp3/mp4 out of the binary is the difference
// between an app-store download people abandon and one they don't.
//
// Trade-off: these need a network connection on first play. Anything that must
// work offline has to be bundled or cached on device — see CACHING below.

const MEDIA_BASE = 'https://storage.googleapis.com/karmana-media-prod/assets';

/** What expo-av / expo-video accept in a `source` prop for remote files. */
export type MediaSource = { uri: string };

/**
 * Build a remote source for a file under `ui/assets`, using the same relative
 * path it had on disk — `media('music-playlist/rain-sound.mp4')`.
 *
 * Objects are uploaded with the identical folder layout, so migrating a
 * `require('../assets/x/y.mp3')` call is a mechanical swap to `media('x/y.mp3')`.
 */
export const media = (path: string): MediaSource => ({
  uri: `${MEDIA_BASE}/${path.replace(/^\/+/, '')}`,
});

// CACHING: expo-av streams these and does not persist them between launches, so
// a user on a plane or a mat with no signal gets silence. If offline playback
// matters, download-on-first-play into FileSystem.documentDirectory and prefer
// the local copy — the bucket layout above is designed to mirror local paths so
// a cache key can just be the asset path.
