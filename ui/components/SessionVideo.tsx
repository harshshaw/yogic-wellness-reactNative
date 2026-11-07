import { useEventListener } from 'expo';
import { useVideoPlayer, VideoView, type VideoPlayer, type VideoContentFit } from 'expo-video';
import { useEffect } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { MediaSource } from '../lib/media';

type Props = {
  source: MediaSource;
  style: StyleProp<ViewStyle>;
  contentFit?: VideoContentFit;
  playing?: boolean;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  onEnd?: () => void;
  onReady?: () => void;
};

// Expo players are mutable native handles, rather than React state objects.
function configurePlayer(player: VideoPlayer, loop: boolean, muted: boolean, volume: number) {
  player.loop = loop;
  player.muted = muted;
  player.volume = volume;
  player.audioMixingMode = muted ? 'mixWithOthers' : 'duckOthers';
}

/** Shared video surface for custom controls and animated, overlapping backdrops. */
export default function SessionVideo({
  source, style, contentFit = 'cover', playing = true, loop = false,
  muted = false, volume = 1, onEnd, onReady,
}: Props) {
  // useVideoPlayer releases the native player when the source changes or we unmount.
  const player = useVideoPlayer(source, instance => {
    configurePlayer(instance, loop, muted, volume);
  });

  useEventListener(player, 'playToEnd', () => onEnd?.());
  useEventListener(player, 'statusChange', ({ status, error }) => {
    if (status === 'readyToPlay') onReady?.();
    if (status === 'error') console.warn('Video playback failed', source.uri, error);
  });

  useEffect(() => {
    configurePlayer(player, loop, muted, volume);
    if (playing) player.play();
    else player.pause();
  }, [player, playing, loop, muted, volume]);

  return (
    <VideoView
      player={player}
      style={style}
      contentFit={contentFit}
      nativeControls={false}
      surfaceType="textureView"
      onFirstFrameRender={onReady}
    />
  );
}
