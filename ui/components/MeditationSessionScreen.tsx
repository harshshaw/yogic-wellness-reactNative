import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Modal, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio, AVPlaybackStatus, Video, ResizeMode } from 'expo-av';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { recordSession } from '../lib/wellnessApi';
import { markCompleted } from '../lib/foundationsProgress';
import { MEDITATION_VIDEOS } from '../utils/sessionMedia';
import { X, Pause, Play, Check, Info, ChevronLeft, ChevronRight } from './Icons';
import type { MediaSource } from '../lib/media';

const ExpandIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
const MinimizeIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const moods = [
  { emoji: '🌿', label: 'Calmer' },
  { emoji: '🧘', label: 'Centered' },
  { emoji: '💫', label: 'Same' },
  { emoji: '😴', label: 'Sleepy' },
];

const MeditationSessionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { token } = useAuth();

  const techniqueId = (route.params?.techniqueId as string) ?? 'mindfulness';
  const techniqueName = (route.params?.techniqueName as string) ?? 'Meditation';
  const title = (route.params?.title as string) ?? 'Session';
  const durationMin = (route.params?.durationMin as number) ?? 10;
  const instruction = (route.params?.instruction as string) ?? '';
  const why = (route.params?.why as string) ?? '';
  const citation = (route.params?.citation as string) ?? '';

  // Guided-audio params (Foundations course). When present, real narration
  // plays and drives the countdown; otherwise it's a silent guided timer.
  const audioSource = route.params?.audio as MediaSource | undefined;
  const moduleId = route.params?.moduleId as string | undefined;
  const durationSecParam = route.params?.durationSec as number | undefined;
  const hasAudio = !!audioSource;

  const totalSeconds = durationSecParam ?? durationMin * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const recordedRef = useRef(false);

  // Immersive full-screen background video (navigable pool). All clips are kept
  // preloaded and we crossfade opacity between them, so switching is instant.
  // Music tracks open straight into the video backdrop; a random clip each time.
  const [immersive, setImmersive] = useState(!!route.params?.startImmersive);
  const [videoIndex, setVideoIndex] = useState(() =>
    Math.floor(Math.random() * Math.max(1, MEDITATION_VIDEOS.length))
  );
  const hasVideo = MEDITATION_VIDEOS.length > 0;
  const prevVideo = () => setVideoIndex(i => (i - 1 + MEDITATION_VIDEOS.length) % MEDITATION_VIDEOS.length);
  const nextVideo = () => setVideoIndex(i => (i + 1) % MEDITATION_VIDEOS.length);

  const videoOpacities = useRef(
    MEDITATION_VIDEOS.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))
  ).current;
  useEffect(() => {
    Animated.parallel(
      videoOpacities.map((op, i) =>
        Animated.timing(op, {
          toValue: i === videoIndex ? 1 : 0,
          duration: 450,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        })
      )
    ).start();
  }, [videoIndex, immersive, videoOpacities]);

  // Slow breathing-like pulse for a calm, non-distracting focal point.
  const pulse = useRef(new Animated.Value(0.92)).current;
  useEffect(() => {
    if (!running || done) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.92, duration: 4000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [running, done, pulse]);

  // ── Silent timer (no-audio sessions only) ──
  useEffect(() => {
    if (hasAudio || !running || done) return;
    if (secondsLeft <= 0) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [hasAudio, secondsLeft, running, done]);

  // ── Guided-audio playback ──
  const soundRef = useRef<Audio.Sound | null>(null);
  useEffect(() => {
    if (!hasAudio) return;
    let cancelled = false;

    const onStatus = (status: AVPlaybackStatus) => {
      if (!status.isLoaded) return;
      const durMs = status.durationMillis ?? totalSeconds * 1000;
      const remaining = Math.max(0, Math.ceil((durMs - status.positionMillis) / 1000));
      setSecondsLeft(remaining);
      if (status.didJustFinish) {
        setDone(true);
        // Mark the course module complete as soon as narration finishes, so it
        // unlocks the next module even if the user dismisses without tapping Done.
        if (moduleId) markCompleted(moduleId);
      }
    };

    (async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          playThroughEarpieceAndroid: false,
          shouldDuckAndroid: false,
        });
        const { sound } = await Audio.Sound.createAsync(
          audioSource!,
          { shouldPlay: true },
          onStatus
        );
        if (cancelled) {
          await sound.unloadAsync();
          return;
        }
        soundRef.current = sound;
      } catch {
        // if audio fails to load, fall back to letting the user End manually
      }
    })();

    return () => {
      cancelled = true;
      soundRef.current?.unloadAsync().catch(() => {});
      soundRef.current = null;
    };
  }, [hasAudio]);

  // Pause / resume the narration when the user toggles running.
  useEffect(() => {
    if (!hasAudio || !soundRef.current || done) return;
    if (running) soundRef.current.playAsync().catch(() => {});
    else soundRef.current.pauseAsync().catch(() => {});
  }, [running, hasAudio, done]);

  // Stop narration once the session is done.
  useEffect(() => {
    if (done && soundRef.current) soundRef.current.stopAsync().catch(() => {});
  }, [done]);

  const finish = () => {
    if (!recordedRef.current) {
      recordedRef.current = true;
      recordSession(token, {
        type: 'meditation',
        title,
        technique: techniqueId,
        durationSec: totalSeconds - secondsLeft,
        mood: mood ?? undefined,
      });
      if (moduleId) markCompleted(moduleId);
    }
    navigation.goBack();
  };

  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');
  const progress = 1 - secondsLeft / totalSeconds;

  // Full-screen video backdrop with the timer + controls overlaid. The narration
  // audio keeps playing underneath (video is muted); nav switches the backdrop.
  const renderImmersive = () => (
    <Modal visible={immersive} animationType="fade" onRequestClose={() => setImmersive(false)}>
      <StatusBar hidden />
      <View style={styles.immersive}>
        {/* All clips stay mounted + playing; we crossfade opacity so switching
            is instant with no reload flash. */}
        {MEDITATION_VIDEOS.map((src, i) => (
          <Animated.View
            key={i}
            style={[StyleSheet.absoluteFillObject, { opacity: videoOpacities[i] }]}
            pointerEvents="none"
          >
            <Video
              source={src}
              style={StyleSheet.absoluteFillObject}
              resizeMode={ResizeMode.COVER}
              isLooping
              isMuted
              shouldPlay
            />
          </Animated.View>
        ))}
        <View style={styles.immScrim} pointerEvents="none" />

        {/* top bar */}
        <View style={styles.immTop}>
          <Text style={styles.immTitle}>{title}</Text>
          <TouchableOpacity style={styles.immRound} activeOpacity={0.8} onPress={() => setImmersive(false)}>
            <MinimizeIcon color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* nav arrows */}
        <View style={styles.immNav} pointerEvents="box-none">
          <TouchableOpacity style={styles.immNavBtn} activeOpacity={0.75} onPress={prevVideo} hitSlop={12}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.immNavBtn} activeOpacity={0.75} onPress={nextVideo} hitSlop={12}>
            <ChevronRight size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* center — timer hidden in full-screen; keep just any guidance text */}
        {!!instruction && (
          <View style={styles.immCenter} pointerEvents="none">
            <Text style={styles.immInstruction}>{instruction}</Text>
          </View>
        )}

        {/* bottom controls */}
        <View style={styles.immControls}>
          <TouchableOpacity style={styles.immPill} activeOpacity={0.85} onPress={() => setRunning(r => !r)}>
            {running ? <Pause size={14} color="#FFFFFF" /> : <Play size={14} color="#FFFFFF" />}
            <Text style={styles.immPillText}>{running ? 'Pause' : 'Resume'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.immPill, styles.immPillSolid]} activeOpacity={0.9} onPress={() => { setImmersive(false); setDone(true); }}>
            <Text style={styles.immPillText}>End</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (done) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <View style={styles.completeWrap}>
          <View style={[styles.completeBadge, { backgroundColor: colors.statMint, shadowColor: colors.statMint }]}>
            <Check size={32} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={[styles.overline, { color: colors.statMint, marginTop: 18 }]}>SESSION COMPLETE</Text>
          <Text style={[styles.h1, { color: colors.textPrimary, marginTop: 6 }]}>{title}</Text>
          <Text style={[styles.body, { color: colors.textSecondary, marginTop: 8 }]}>
            {durationMin} minutes of {techniqueName.toLowerCase()}. Well done.
          </Text>

          {!!why && (
            <View style={[styles.whyCard, { backgroundColor: colors.statMintSoft, borderColor: colors.statMint }]}>
              <View style={styles.whyRow}>
                <Info size={13} color={colors.statMint} />
                <Text style={[styles.whyLabel, { color: colors.statMint }]}>WHY THIS WORKS</Text>
              </View>
              <Text style={[styles.whyText, { color: colors.textPrimary }]}>{why}</Text>
              {!!citation && <Text style={[styles.citation, { color: colors.textSecondary }]}>{citation}</Text>}
            </View>
          )}

          <View style={[styles.reflectCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.h3, { color: colors.textPrimary, textAlign: 'center' }]}>How do you feel now?</Text>
            <View style={styles.moodRow}>
              {moods.map(m => {
                const active = mood === m.label;
                return (
                  <TouchableOpacity
                    key={m.label}
                    style={[
                      styles.moodPill,
                      { backgroundColor: colors.cardLight, borderColor: colors.border },
                      active && { backgroundColor: colors.statMintSoft, borderColor: colors.statMint },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setMood(m.label)}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodText, { color: colors.textSecondary }, active && { color: colors.statMint, fontWeight: '700' }]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.pillPrimary, { backgroundColor: colors.statMint, shadowColor: colors.statMint, marginTop: 22, width: '100%' }]}
            activeOpacity={0.9}
            onPress={finish}
          >
            <Text style={[styles.pillText, { color: '#FFFFFF' }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.titleSm, { color: colors.statMint }]}>{techniqueName.toUpperCase()}</Text>
          <Text style={[styles.subSm, { color: colors.textSecondary }]}>{title}</Text>
        </View>
        {hasVideo ? (
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => setImmersive(true)}
          >
            <ExpandIcon color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconBtnSpacer} />
        )}
      </View>

      {renderImmersive()}

      <View style={styles.canvas}>
        <Animated.View
          style={[
            styles.auraOuter,
            { transform: [{ scale: pulse }], backgroundColor: `${colors.statMint}22` },
          ]}
        />
        <Animated.View
          style={[
            styles.auraInner,
            { transform: [{ scale: pulse }], borderColor: `${colors.statMint}66`, backgroundColor: `${colors.statMint}0D` },
          ]}
        />
        <View style={styles.phaseCenter}>
          <Text style={[styles.countdown, { color: colors.statMint }]}>{mm}:{ss}</Text>
          {!!instruction && (
            <Text style={[styles.instruction, { color: colors.textSecondary }]}>{instruction}</Text>
          )}
        </View>
      </View>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.statMint }]} />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.pillSecondary, { borderColor: colors.borderStrong, flex: 1 }]}
          activeOpacity={0.85}
          onPress={() => setRunning(r => !r)}
        >
          {running ? <Pause size={14} color={colors.statMint} /> : <Play size={14} color={colors.statMint} />}
          <Text style={[styles.pillText, { color: colors.textPrimary }]}>{running ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pillPrimary, { backgroundColor: colors.statMint, shadowColor: colors.statMint, flex: 1 }]}
          activeOpacity={0.9}
          onPress={() => setDone(true)}
        >
          <Text style={[styles.pillText, { color: '#FFFFFF' }]}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: 20, paddingBottom: 14,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconBtnSpacer: { width: 40, height: 40 },
  titleSm: { fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  subSm: { fontSize: 13, marginTop: 2, fontWeight: '600' },

  canvas: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  auraOuter: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
  auraInner: { position: 'absolute', width: 210, height: 210, borderRadius: 105, borderWidth: 1.5 },
  phaseCenter: { alignItems: 'center', paddingHorizontal: 40 },
  countdown: { fontSize: 44, fontWeight: '300' },
  instruction: { fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 18 },

  progressTrack: { height: 3, marginHorizontal: 20, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },

  // Immersive full-screen video mode
  immersive: { flex: 1, backgroundColor: '#000' },
  immScrim: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  immTop: {
    position: 'absolute', top: 56, left: 20, right: 20, zIndex: 3,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  immTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', flex: 1 },
  immRound: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  immNav: {
    ...StyleSheet.absoluteFillObject, zIndex: 2,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12,
  },
  immNavBtn: {
    width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  immCenter: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  immCountdown: { color: '#FFFFFF', fontSize: 56, fontWeight: '200', textShadowColor: 'rgba(0,0,0,0.4)', textShadowRadius: 12 },
  immInstruction: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 18, textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 8 },
  immControls: {
    position: 'absolute', bottom: 44, left: 20, right: 20, zIndex: 3,
    flexDirection: 'row', gap: 10,
  },
  immPill: {
    flex: 1, height: 52, borderRadius: 999, flexDirection: 'row', gap: 8,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  immPillSolid: { backgroundColor: 'rgba(255,255,255,0.28)' },
  immPillText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  controls: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 24, paddingBottom: 36, gap: 10 },

  pillSecondary: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 999, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8,
  },
  pillPrimary: {
    paddingVertical: 14, paddingHorizontal: 24, borderRadius: 999,
    alignItems: 'center', justifyContent: 'center',
    shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3,
  },
  pillText: { fontSize: 15, fontWeight: '700' },

  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 2.4 },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4, textAlign: 'center' },
  h3: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 280 },

  completeWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },
  completeBadge: {
    width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 14, elevation: 6,
  },

  whyCard: { borderRadius: 18, borderWidth: 1, padding: 16, marginTop: 20, width: '100%' },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  whyLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2 },
  whyText: { fontSize: 13, lineHeight: 19, marginTop: 6 },
  citation: { fontSize: 10, marginTop: 8, fontStyle: 'italic', lineHeight: 14 },

  reflectCard: { borderRadius: 22, borderWidth: 1, padding: 20, marginTop: 20, width: '100%' },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, marginTop: 14 },
  moodPill: { flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 6, borderRadius: 14, borderWidth: 1 },
  moodEmoji: { fontSize: 22 },
  moodText: { fontSize: 11, marginTop: 4, fontWeight: '500' },
});

export default MeditationSessionScreen;
