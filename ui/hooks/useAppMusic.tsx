import { setAudioModeAsync, useAudioPlayer, type AudioPlayer } from 'expo-audio';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { media, type MediaSource } from '../lib/media';

type AudioContextValue = {
  muted: boolean;
  toggleMuted: () => void;
  isTrackPlaying: boolean;
  playTrack: (source?: MediaSource) => void;
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

const BACKGROUND_SOURCE = media('karmana-app-music.mp3');
const TRACK_SOURCE = media('music-playlist/screen-recording.mp3');

function configureLoop(player: AudioPlayer, volume: number) {
  player.loop = true;
  player.volume = volume;
}

export const AppMusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [muted, setMuted] = useState(true);
  const [isTrackPlaying, setIsTrackPlaying] = useState(false);

  const bg = useAudioPlayer(BACKGROUND_SOURCE);
  const track = useAudioPlayer(TRACK_SOURCE);
  const mutedRef = useRef(true);
  const trackPlayingRef = useRef(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'duckOthers',
      shouldPlayInBackground: false,
    }).then(() => {
      if (!cancelled) setAudioReady(true);
    }).catch(error => console.warn('Audio setup failed', error));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    configureLoop(bg, 0.1);
    configureLoop(track, 0.7);
  }, [bg, track]);

  useEffect(() => {
    const onAppStateChange = (state: AppStateStatus) => {
      if (state === 'active') {
        if (trackPlayingRef.current) track.play();
        else if (!mutedRef.current) bg.play();
      } else {
        bg.pause();
        track.pause();
      }
    };
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, [bg, track]);

  // Background mute never overrides an active track.
  useEffect(() => {
    mutedRef.current = muted;
    if (muted || isTrackPlaying || !audioReady || AppState.currentState === 'background') bg.pause();
    else bg.play();
  }, [bg, muted, isTrackPlaying, audioReady]);

  const playTrack = (source?: MediaSource) => {
    try {
      bg.pause();
      if (source !== undefined) {
        track.replace(source);
        // The web implementation creates a fresh media element on replace.
        configureLoop(track, 0.7);
      }
      track.play();
      trackPlayingRef.current = true;
      setIsTrackPlaying(true);
    } catch (error) {
      console.warn('Track playback failed', error);
    }
  };

  const pauseTrack = () => {
    track.pause();
    trackPlayingRef.current = false;
    setIsTrackPlaying(false);
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
