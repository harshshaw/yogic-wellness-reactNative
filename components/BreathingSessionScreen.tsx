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
import { COLORS } from '../styles/colors';
import { warm } from '../styles/warm';
import { X, Pause, Play } from './Icons';

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

const BreathingSessionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const title = (route.params?.title as string) ?? 'Breathing Session';

  const [running, setRunning] = useState(true);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(phases[0].secs);
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);
  const [mood, setMood] = useState<string | null>(null);

  const scale = useRef(new Animated.Value(1)).current;
  const aura = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (!running || done) return;
    const phase = phases[phaseIdx];
    const toScale = phase.name === 'inhale' ? 1.45 : phase.name === 'exhale' ? 1 : undefined;
    const toAura = phase.name === 'inhale' ? 0.85 : phase.name === 'exhale' ? 0.25 : undefined;

    Animated.parallel(
      [
        toScale !== undefined && Animated.timing(scale, {
          toValue: toScale,
          duration: phase.secs * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        toAura !== undefined && Animated.timing(aura, {
          toValue: toAura,
          duration: phase.secs * 1000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ].filter(Boolean) as Animated.CompositeAnimation[]
    ).start();
  }, [phaseIdx, running, done, scale, aura]);

  useEffect(() => {
    if (!running || done) return;
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
  }, [secondsLeft, running, done, phaseIdx, round]);

  if (done) {
    return (
      <View style={warm.screen}>
        <View style={styles.completeWrap}>
          <View style={styles.completeBadge}>
            <Text style={styles.completeCheck}>✓</Text>
          </View>
          <Text style={[warm.overline, { marginTop: 18 }]}>Session complete</Text>
          <Text style={[warm.h1, { textAlign: 'center', marginTop: 6 }]}>{title}</Text>
          <Text style={[warm.body, { textAlign: 'center', marginTop: 8, maxWidth: 280 }]}>
            Four rounds. Well done. Let the breath settle.
          </Text>

          <View style={styles.reflectCard}>
            <Text style={[warm.h3, { textAlign: 'center' }]}>How do you feel now?</Text>
            <View style={styles.moodRow}>
              {moods.map(m => {
                const active = mood === m.label;
                return (
                  <TouchableOpacity
                    key={m.label}
                    style={[styles.moodPill, active && styles.moodPillActive]}
                    activeOpacity={0.85}
                    onPress={() => setMood(m.label)}
                  >
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodText, active && styles.moodTextActive]}>
                      {m.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.completeActions}>
            <TouchableOpacity
              style={[warm.pillSecondary, { flex: 1 }]}
              activeOpacity={0.85}
              onPress={() => navigation.goBack()}
            >
              <Text style={warm.pillSecondaryText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[warm.pillPrimary, { flex: 1 }]}
              activeOpacity={0.9}
              onPress={() => navigation.goBack()}
            >
              <Text style={warm.pillPrimaryText}>Save insight</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const phase = phases[phaseIdx];

  return (
    <View style={warm.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={warm.iconBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.titleSm}>{title.toUpperCase()}</Text>
          <Text style={styles.subSm}>4 · 7 · 8 · Round {round} of 4</Text>
        </View>
        <View style={warm.iconBtn} />
      </View>

      {/* CIRCLE */}
      <View style={styles.canvas}>
        <Animated.View
          style={[
            styles.auraOuter,
            { opacity: aura, transform: [{ scale }] },
          ]}
        />
        <Animated.View
          style={[
            styles.auraInner,
            { transform: [{ scale }] },
          ]}
        />
        <View style={styles.phaseCenter}>
          <Text style={styles.sanskrit}>{phase.sanskrit}</Text>
          <Text style={styles.phaseLabel}>{phase.label}</Text>
          <Text style={styles.countdown}>{secondsLeft}</Text>
        </View>
      </View>

      {/* PHASE DOTS */}
      <View style={styles.dots}>
        {phases.map((p, i) => (
          <View
            key={p.name}
            style={[styles.phaseDot, i === phaseIdx && styles.phaseDotActive]}
          />
        ))}
      </View>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[warm.pillSecondary, { flex: 1 }]}
          activeOpacity={0.85}
          onPress={() => setRunning(r => !r)}
        >
          {running ? (
            <Pause size={14} color={COLORS.primaryGold} />
          ) : (
            <Play size={14} color={COLORS.primaryGold} />
          )}
          <Text style={warm.pillSecondaryText}>{running ? 'Pause' : 'Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[warm.pillPrimary, { flex: 1 }]}
          activeOpacity={0.9}
          onPress={() => navigation.goBack()}
        >
          <Text style={warm.pillPrimaryText}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  titleSm: {
    color: COLORS.primaryGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  subSm: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },

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
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  auraInner: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: 'rgba(212,175,55,0.45)',
    backgroundColor: 'rgba(212,175,55,0.04)',
  },
  phaseCenter: {
    alignItems: 'center',
  },
  sanskrit: {
    color: COLORS.primaryGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  phaseLabel: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: -0.3,
  },
  countdown: {
    color: COLORS.primaryGold,
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
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(212,175,55,0.2)',
  },
  phaseDotActive: {
    width: 22,
    backgroundColor: COLORS.primaryGold,
  },

  controls: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 36,
    gap: 10,
  },

  // COMPLETE
  completeWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  completeBadge: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  completeCheck: {
    color: COLORS.deepBrown,
    fontSize: 36,
    fontWeight: '700',
  },
  reflectCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
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
    backgroundColor: COLORS.deepBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
  },
  moodPillActive: {
    backgroundColor: 'rgba(212,175,55,0.18)',
    borderColor: COLORS.primaryGold,
  },
  moodEmoji: { fontSize: 22 },
  moodText: { color: COLORS.textSecondary, fontSize: 11, marginTop: 4, fontWeight: '500' },
  moodTextActive: { color: COLORS.primaryGold, fontWeight: '700' },

  completeActions: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 10,
    width: '100%',
  },
});

export default BreathingSessionScreen;
