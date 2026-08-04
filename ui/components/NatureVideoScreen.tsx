import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Audio, Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { NATURE_VIDEOS } from '../utils/sessionMedia';
import { X, ChevronLeft, ChevronRight, Pause, Play } from './Icons';
import BreathingLoader from './BreathingLoader';

/**
 * Full-screen player for the long, self-contained nature videos. Each clip
 * already carries its own audio, so there's no separate soundtrack and no
 * session timer — it just plays the video with sound until the user leaves.
 */
export default function NatureVideoScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  const [index, setIndex] = useState<number>(route.params?.index ?? 0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<Video>(null);

  const current = NATURE_VIDEOS[index];

  // Let the video's own audio play even when the phone is on silent.
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setPaused(false);
  }, [index]);

  const prev = () => setIndex(i => (i - 1 + NATURE_VIDEOS.length) % NATURE_VIDEOS.length);
  const next = () => setIndex(i => (i + 1) % NATURE_VIDEOS.length);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v) return;
    if (paused) {
      await v.playAsync();
      setPaused(false);
    } else {
      await v.pauseAsync();
      setPaused(true);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <Video
        ref={videoRef}
        key={current.id}
        source={current.source}
        style={StyleSheet.absoluteFill}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted={false}
        volume={1.0}
        onLoadStart={() => setLoading(true)}
        onReadyForDisplay={() => setLoading(false)}
        onPlaybackStatusUpdate={(s: AVPlaybackStatus) => {
          if (s.isLoaded && s.isPlaying) setLoading(false);
        }}
      />

      {loading && <BreathingLoader />}

      {/* top bar — always show close; hide the (white) title over the light loader */}
      <View style={[styles.top, { paddingTop: insets.top + 10 }]}>
        {loading ? <View /> : <Text style={styles.title}>{current.title}</Text>}
        <TouchableOpacity
          style={styles.round}
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={loading ? '#17253D' : '#fff'} />
        </TouchableOpacity>
      </View>

      {/* video controls appear once the clip is playing */}
      {!loading && (
        <>
          {/* left / right nav */}
          <View style={styles.nav} pointerEvents="box-none">
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.75} onPress={prev} hitSlop={12}>
              <ChevronLeft size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navBtn} activeOpacity={0.75} onPress={next} hitSlop={12}>
              <ChevronRight size={26} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* play / pause */}
          <View style={[styles.bottom, { paddingBottom: insets.bottom + 20 }]}>
            <TouchableOpacity style={styles.pill} activeOpacity={0.85} onPress={togglePlay}>
              {paused ? <Play size={16} color="#fff" /> : <Pause size={16} color="#fff" />}
              <Text style={styles.pillText}>{paused ? 'Play' : 'Pause'}</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  top: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { color: '#fff', fontSize: 17, fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 6 },
  round: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  pillText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
