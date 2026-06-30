import { Audio } from 'expo-av';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';

type AudioContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  isTrackPlaying: boolean;
  playTrack: (source?: ReturnType<typeof require>) => void;
  pauseTrack: () => void;
  toggleTrack: () => void;
};

const AudioContext = createContext<AudioContextValue>({
  muted: false,
  toggleMuted: () => {},
  isTrackPlaying: false,
  playTrack: () => {},
  pauseTrack: () => {},
  toggleTrack: () => {},
});

const BACKGROUND_SOURCE = require('../assets/karmana-app-music.mp3');
const TRACK_SOURCE = require('../assets/music-playlist/screen-recording.mp3');

export const AppMusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [muted, setMuted] = useState(true);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);

  const bgRef = useRef<Audio.Sound | null>(null);
  const trackRef = useRef<Audio.Sound | null>(null);

  const mutedRef = useRef(true);
  const trackPlayingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          staysActiveInBackground: false,
        });

        const [{ sound: bg }, { sound: track }] = await Promise.all([
          Audio.Sound.createAsync(BACKGROUND_SOURCE, {
            shouldPlay: !mutedRef.current,
            isLooping: true,
            volume: 0.1,
          }),
          Audio.Sound.createAsync(TRACK_SOURCE, {
            shouldPlay: false,
            isLooping: true,
            volume: 0.7,
          }),
        ]);

        if (cancelled) {
          await bg.unloadAsync().catch(() => {});
          await track.unloadAsync().catch(() => {});
          return;
        }

        bgRef.current = bg;
        trackRef.current = track;
      } catch (err) {
        console.warn('Audio load failed', err);
      }
    };

    load();

    const onAppStateChange = async (state: AppStateStatus) => {
      try {
        if (state === 'active') {
          if (trackPlayingRef.current && trackRef.current) {
            await trackRef.current.playAsync();
          } else if (!mutedRef.current && bgRef.current) {
            await bgRef.current.playAsync();
          }
        } else {
          if (bgRef.current) await bgRef.current.pauseAsync();
          if (trackRef.current) await trackRef.current.pauseAsync();
        }
      } catch {
        // ignore
      }
    };

    const sub = AppState.addEventListener('change', onAppStateChange);

    return () => {
      cancelled = true;
      sub.remove();
      const bg = bgRef.current;
      const track = trackRef.current;
      bgRef.current = null;
      trackRef.current = null;
      if (bg) bg.unloadAsync().catch(() => {});
      if (track) track.unloadAsync().catch(() => {});
    };
  }, []);

  // Background mute/unmute — only acts on bg, never overrides an active track
  useEffect(() => {
    mutedRef.current = muted;
    const bg = bgRef.current;
    if (!bg) return;
    (async () => {
      try {
        if (muted || trackPlayingRef.current) await bg.pauseAsync();
        else await bg.playAsync();
      } catch {
        // ignore
      }
    })();
  }, [muted]);

  const playTrack = async (source?: ReturnType<typeof require>) => {
    const bg = bgRef.current;
    if (bg) await bg.pauseAsync().catch(() => {});

    // If a new source is provided, swap out the current track sound
    if (source !== undefined) {
      const old = trackRef.current;
      trackRef.current = null;
      if (old) await old.unloadAsync().catch(() => {});
      try {
        const { sound } = await Audio.Sound.createAsync(source, {
          shouldPlay: false,
          isLooping: true,
          volume: 0.7,
        });
        trackRef.current = sound;
      } catch (err) {
        console.warn('Track swap failed', err);
        return;
      }
    }

    const track = trackRef.current;
    if (!track) return;
    try {
      await track.playAsync();
      trackPlayingRef.current = true;
      setIsTrackPlaying(true);
    } catch {
      // ignore
    }
  };

  const pauseTrack = async () => {
    const bg = bgRef.current;
    const track = trackRef.current;
    if (!track) return;
    try {
      await track.pauseAsync();
      trackPlayingRef.current = false;
      setIsTrackPlaying(false);
      if (bg && !mutedRef.current) await bg.playAsync();
    } catch {
      // ignore
    }
  };

  const toggleTrack = () => {
    if (trackPlayingRef.current) pauseTrack();
    else playTrack();
  };

  return (
    <AudioContext.Provider
      value={{
        muted,
        toggleMuted: () => setMuted(m => !m),
        isTrackPlaying,
        playTrack,
        pauseTrack,
        toggleTrack,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAppMusic = () => useContext(AudioContext);
