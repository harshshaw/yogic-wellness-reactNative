import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import { recordSession } from '../lib/wellnessApi';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { useTheme } from '../hooks/useTheme';
import { X, Pause, Play, Check } from './Icons';
import { media } from '../lib/media';

// Placeholder until a real breathing tutorial clip is recorded.
const TUTORIAL_VIDEO = media('background-video/portrait2.mp4');

// Screens shown in order before the breathing rings start.
type Stage = 'disclaimer' | 'tutorial' | 'session';

type Phase = 'inhale' | 'hold' | 'exhale';
const phases: { name: Phase; label: string; secs: number; sanskrit: string }[] = [
  { name: 'inhale', label: 'Inhale', secs: 4, sanskrit: 'Puraka' },
  { name: 'hold', label: 'Hold', secs: 7, sanskrit: 'Kumbhaka' },
  { name: 'exhale', label: 'Exhale', secs: 8, sanskrit: 'Rechaka' },
];

const moods = [
  { emoji: '🌿', label: 'Lighter' },
  { emoji: '🌅', label: 'Clearer' },
  { emoji: '💫', label: 'Same' },
  { emoji: '🌙', label: 'Sleepy' },
];

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const BreathingSessionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors, mode } = useTheme();
  const isNight = mode === 'night';

  const { token } = useAuth();
  const title = (route.params?.title as string) ?? 'Breathing Session';
  const id = (route.params?.id as string) ?? '';

  // 4 rounds of 4-7-8 ≈ 76s of practice; used for progress/minutes tracking.
  const SESSION_SECONDS = 4 * (4 + 7 + 8);
  // Record the completed session once, capturing the mood if chosen.
  const recordedRef = useRef(false);
  const finish = () => {
    if (!recordedRef.current) {
      recordedRef.current = true;
      recordSession(token, {
        type: isSleepSession ? 'sleep' : 'breathing',
        title,
        durationSec: SESSION_SECONDS,
        mood: mood ?? undefined,
      });
    }
    navigation.goBack();
  };

  // Sleep-flavored sessions get a purple accent. Everything else gets mint.
  const isSleepSession = id === 'sleep' || /sleep|wind-?down|night/i.test(title);
  const accent = isSleepSession ? colors.statPurple : colors.statMint;
  const accentSoft = isSleepSession ? colors.statPurpleSoft : colors.statMintSoft;

  const [stage, setStage] = useState<Stage>('disclaimer');
  const [running, setRunning] = useState(true);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].secs);
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<string | null>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const aura = useRef(new Animated.Value(0.35)).current;

  // ─── DISCLAIMER fade in → hold → fade out ───────────────────────────
  const disclaimerOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (stage !== 'disclaimer') return;
    const anim = Animated.sequence([
      Animated.timing(disclaimerOpacity, {
        toValue: 1,
        duration: 900,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.delay(4000),
      Animated.timing(disclaimerOpacity, {
        toValue: 0,
        duration: 900,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);
    anim.start(({ finished }) => finished && setStage('tutorial'));
    return () => anim.stop();
  }, [stage, disclaimerOpacity]);

  // ─── TUTORIAL video fade in on start, fade out at end ───────────────
  const tutorialOpacity = useRef(new Animated.Value(0)).current;
  const tutorialEnding = useRef(false);
  useEffect(() => {
    if (stage !== 'tutorial') return;
    tutorialEnding.current = false;
    Animated.timing(tutorialOpacity, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [stage, tutorialOpacity]);

  const endTutorial = () => {
    if (tutorialEnding.current) return;
    tutorialEnding.current = true;
    Animated.timing(tutorialOpacity, {
      toValue: 0,
      duration: 900,
      easing: Easing.in(Easing.quad),
      useNativeDriver: true,
    }).start(() => setStage('session'));
  };

  const onTutorialStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) endTutorial();
  };

  useEffect(() => {
    if (stage !== 'session' || !running || done) return;
    const phase = phases[phaseIdx];
    const toScale = phase.name === 'inhale' ? 1.45 : phase.name === 'exhale' ? 1 : undefined;
    const toAura = phase.name === 'inhale' ? 0.85 : phase.name === 'exhale' ? 0.25 : undefined;

    Animated.parallel(
      [
        toScale !== undefined &&
          Animated.timing(scale, {
            toValue: toScale,
            duration: phase.secs * 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        toAura !== undefined &&
          Animated.timing(aura, {
            toValue: toAura,
            duration: phase.secs * 1000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
      ].filter(Boolean) as Animated.CompositeAnimation[]
    ).start();
  }, [stage, phaseIdx, running, done, scale, aura]);

  useEffect(() => {
    if (stage !== 'session' || !running || done) return;
    if (secondsLeft <= 0) {
      const next = (phaseIdx + 1) % phases.length;
      if (next === 0) {
        const nextRound = round + 1;
        if (nextRound > 4) {
          setDone(true);
          return;
        }
        setRound(nextRound);
      }
      setPhaseIdx(next);
      setSecondsLeft(phases[next].secs);
      return;
    }
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [stage, secondsLeft, running, done, phaseIdx, round]);

  // ─── DISCLAIMER SCREEN ──────────────────────────────────────────────
  if (stage === 'disclaimer') {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <TouchableOpacity
          style={[
            styles.iconBtn,
            styles.stageClose,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <Animated.View style={[styles.disclaimerWrap, { opacity: disclaimerOpacity }]}>
          <Text style={[styles.overline, { color: accent }]}>BEFORE WE BEGIN</Text>
          <Text style={[styles.h1, { color: colors.textPrimary, marginTop: 10 }]}>
            A gentle note
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary, marginTop: 14 }]}>
            Breathing practices are for relaxation and general wellness — they are
            not medical advice. If you feel dizzy, light-headed, or uncomfortable
            at any point, stop and breathe normally. If you are pregnant or have a
            heart or respiratory condition, please consult your doctor first.
          </Text>
        </Animated.View>
      </View>
    );
  }

  // ─── TUTORIAL VIDEO ─────────────────────────────────────────────────
  if (stage === 'tutorial') {
    return (
      <View style={[styles.screen, { backgroundColor: '#000' }]}>
        <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: tutorialOpacity }]}>
          <Video
            source={TUTORIAL_VIDEO}
            style={StyleSheet.absoluteFillObject}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            onPlaybackStatusUpdate={onTutorialStatus}
          />
          <View style={styles.tutorialOverlay}>
            <Text style={[styles.overline, { color: '#FFFFFF' }]}>HOW IT WORKS</Text>
            <Text style={styles.tutorialTitle}>{title}</Text>
            <Text style={styles.tutorialSub}>
              Follow the circle — expand as you inhale, rest as you hold, soften
              as you exhale.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.skipBtn}
            activeOpacity={0.85}
            onPress={endTutorial}
          >
            <Text style={styles.skipText}>Skip tutorial</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  // ─── COMPLETE SCREEN ────────────────────────────────────────────────
  if (done) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.bg }]}>
        <View style={styles.completeWrap}>
          <View
            style={[
              styles.completeBadge,
              { backgroundColor: accent, shadowColor: accent },
            ]}
          >
            <Check size={32} color="#FFFFFF" strokeWidth={3} />
          </View>
          <Text style={[styles.overline, { color: accent, marginTop: 18 }]}>
            SESSION COMPLETE
          </Text>
          <Text style={[styles.h1, { color: colors.textPrimary, marginTop: 6 }]}>
            {title}
          </Text>
          <Text style={[styles.body, { color: colors.textSecondary, marginTop: 8 }]}>
            Four rounds. Well done. Let the breath settle.
          </Text>

          <View
            style={[
              styles.reflectCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.h3, { color: colors.textPrimary, textAlign: 'center' }]}>
              How do you feel now?
            </Text>
            <View style={styles.moodRow}>
              {moods.map(m => {
                const active = mood === m.label;
                return (
                  <TouchableOpacity
                    key={m.label}
                    style={[
                      styles.moodPill,
                      { backgroundColor: colors.cardLight, borderColor: colors.border },
                      active && { backgroundColor: accentSoft, borderColor: accent },
                    ]}
                    activeOpacity={0.85}
                    onPress={() => setMood(m.label)}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text
                      style={[
                        styles.moodText,
                        { color: colors.textSecondary },
                        active && { color: accent, fontWeight: '700' },
                      ]}
                    >
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.completeActions}>
            <TouchableOpacity
              style={[
                styles.pillSecondary,
                { borderColor: colors.borderStrong, backgroundColor: 'transparent' },
              ]}
              activeOpacity={0.85}
              onPress={finish}
            >
              <Text style={[styles.pillText, { color: colors.textPrimary }]}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.pillPrimary,
                { backgroundColor: accent, shadowColor: accent },
              ]}
              activeOpacity={0.9}
              onPress={finish}
            >
              <Text style={[styles.pillText, { color: '#FFFFFF' }]}>Save insight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const phase = phases[phaseIdx];

  // ─── ACTIVE SESSION ─────────────────────────────────────────────────
  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.iconBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.titleSm, { color: accent }]}>{title.toUpperCase()}</Text>
          <Text style={[styles.subSm, { color: colors.textSecondary }]}>
            4 · 7 · 8 · Round {round} of 4
          </Text>
        </View>
        <View style={styles.iconBtnSpacer} />
      </View>

      {/* BREATHING CIRCLE */}
      <View style={styles.canvas}>
        <Animated.View
          style={[
            styles.auraOuter,
            {
              opacity: aura,
              transform: [{ scale }],
              backgroundColor: hexA(accent, isNight ? 0.18 : 0.12),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.auraInner,
            {
              transform: [{ scale }],
              borderColor: hexA(accent, isNight ? 0.6 : 0.4),
              backgroundColor: hexA(accent, isNight ? 0.08 : 0.05),
            },
          ]}
        />
        <View style={styles.phaseCenter}>
          <Text style={[styles.sanskrit, { color: accent }]}>{phase.sanskrit}</Text>
          <Text style={[styles.phaseLabel, { color: colors.textPrimary }]}>{phase.label}</Text>
          <Text style={[styles.countdown, { color: accent }]}>{secondsLeft}</Text>
        </View>
      </View>

      {/* PHASE DOTS */}
      <View style={styles.dots}>
        {phases.map((p, i) => (
          <View
            key={p.name}
            style={[
              styles.phaseDot,
              { backgroundColor: hexA(accent, 0.25) },
              i === phaseIdx && { width: 22, backgroundColor: accent },
            ]}
          />
        ))}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.pillSecondary,
            { borderColor: colors.borderStrong, flex: 1 },
          ]}
          activeOpacity={0.85}
          onPress={() => setRunning(r => !r)}
        >
          {running ? <Pause size={14} color={accent} /> : <Play size={14} color={accent} />}
          <Text style={[styles.pillText, { color: colors.textPrimary }]}>
            {running ? 'Pause' : 'Resume'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.pillPrimary,
            { backgroundColor: accent, shadowColor: accent, flex: 1 },
          ]}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnSpacer: { width: 40, height: 40 },
  titleSm: { fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  subSm: { fontSize: 11, marginTop: 2 },

  canvas: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auraOuter: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  auraInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
  },
  phaseCenter: { alignItems: 'center' },
  sanskrit: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  phaseLabel: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '300',
    marginTop: 4,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 24,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 10,
  },

  // Buttons
  pillSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pillPrimary: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  pillText: { fontSize: 15, fontWeight: '700' },

  // DISCLAIMER
  stageClose: {
    position: 'absolute',
    top: 56,
    left: 20,
    zIndex: 2,
  },
  disclaimerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  // TUTORIAL
  tutorialOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 120,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  tutorialTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  tutorialSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 300,
  },
  skipBtn: {
    position: 'absolute',
    bottom: 44,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  skipText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  // COMPLETE
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 2.4 },
  h1: { fontSize: 28, fontWeight: '700', letterSpacing: -0.4, textAlign: 'center' },
  h3: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 14, textAlign: 'center', lineHeight: 21, maxWidth: 280 },

  completeWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  completeBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  reflectCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 20,
    marginTop: 28,
    width: '100%',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 14,
  },
  moodPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  moodEmoji: { fontSize: 22 },
  moodText: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  completeActions: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 10,
    width: '100%',
  },
});

export default BreathingSessionScreen;
