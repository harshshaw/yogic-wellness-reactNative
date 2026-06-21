import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useReflection, ReflectionData } from '../hooks/useReflection';

const PURPLE      = '#7C3AED';
const PURPLE_SOFT = '#EDE9FE';
const ORANGE      = '#F59E0B';
const ORANGE_SOFT = '#FFF7ED';
const BLUE        = '#6366F1';
const BLUE_SOFT   = '#EEF2FF';

// ── back arrow ────────────────────────────────────────────────────────────────
const BackArrow = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── shield icon ───────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 6v6c0 5.25 3.5 9.74 8 11 4.5-1.26 8-5.75 8-11V6l-8-4z" stroke="#9CA3AF" strokeWidth="1.8" fill="none" />
  </Svg>
);

// ── mood data ─────────────────────────────────────────────────────────────────
const MOODS = [
  { key: 'calm',        emoji: '😊', label: 'Calm' },
  { key: 'stressed',    emoji: '😟', label: 'Stressed' },
  { key: 'anxious',     emoji: '😰', label: 'Anxious' },
  { key: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed' },
  { key: 'happy',       emoji: '😁', label: 'Happy' },
  { key: 'irritable',   emoji: '😠', label: 'Irritable' },
  { key: 'sad',         emoji: '😢', label: 'Sad' },
  { key: 'neutral',     emoji: '😐', label: 'Neutral' },
];

// ── energy data ───────────────────────────────────────────────────────────────
const ENERGY: { value: ReflectionData['energy']; emoji: string; label: string }[] = [
  { value: 'low',          emoji: '🪫', label: 'Low' },
  { value: 'slightly_low', emoji: '🌤',  label: 'Slightly Low' },
  { value: 'moderate',     emoji: '☀️',  label: 'Moderate' },
  { value: 'high',         emoji: '🌟',  label: 'High' },
  { value: 'very_high',    emoji: '⚡',  label: 'Very High' },
];

// ── sleep data ────────────────────────────────────────────────────────────────
const SLEEP: { value: ReflectionData['sleep']; emoji: string; label: string }[] = [
  { value: 'poor',      emoji: '🌧',  label: 'Poor' },
  { value: 'average',   emoji: '🌙',  label: 'Average' },
  { value: 'good',      emoji: '🌙✨', label: 'Good' },
  { value: 'excellent', emoji: '💫',  label: 'Excellent' },
];

// ── section card ──────────────────────────────────────────────────────────────
const SectionCard = ({
  iconBg, iconEmoji, titleColor, title, subtitle, children,
}: {
  iconBg: string; iconEmoji: string; titleColor: string;
  title: string; subtitle: string; children: React.ReactNode;
}) => (
  <View style={[sc.card, { borderColor: iconBg }]}>
    <View style={sc.cardHeader}>
      <View style={[sc.cardIcon, { backgroundColor: iconBg }]}>
        <Text style={{ fontSize: 22 }}>{iconEmoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[sc.cardTitle, { color: titleColor }]}>{title}</Text>
        <Text style={sc.cardSub}>{subtitle}</Text>
      </View>
    </View>
    {children}
  </View>
);

const sc = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#FAFAF7',
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  cardIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '800' },
  cardSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
});

// ── success animation overlay ───────────────────────────────────────────────────
const SaveSuccessOverlay = () => {
  const backdrop = useSharedValue(0);
  const scale    = useSharedValue(0);
  const check    = useSharedValue(0);
  const textY    = useSharedValue(16);
  const textOp   = useSharedValue(0);

  useEffect(() => {
    backdrop.value = withTiming(1, { duration: 220 });
    scale.value    = withSpring(1, { damping: 9, stiffness: 130 });
    check.value    = withDelay(180, withTiming(1, { duration: 320, easing: Easing.out(Easing.cubic) }));
    textOp.value   = withDelay(260, withTiming(1, { duration: 300 }));
    textY.value    = withDelay(260, withSpring(0, { damping: 12 }));
  }, []);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const circleStyle   = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const checkStyle    = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.6 + check.value * 0.4 }],
  }));
  const textStyle     = useAnimatedStyle(() => ({
    opacity: textOp.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <Animated.View style={[ov.backdrop, backdropStyle]} pointerEvents="auto">
      <Animated.View style={[ov.circle, circleStyle]}>
        <Animated.View style={checkStyle}>
          <Svg width={56} height={56} viewBox="0 0 24 24" fill="none">
            <Path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </Animated.View>
      </Animated.View>
      <Animated.View style={[ov.textBlock, textStyle]}>
        <Text style={ov.title}>Reflection saved 🌿</Text>
        <Text style={ov.sub}>Personalizing today's recommendations…</Text>
      </Animated.View>
    </Animated.View>
  );
};

const ov = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,12,30,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  circle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.5, shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 }, elevation: 12,
  },
  textBlock: { alignItems: 'center', marginTop: 28 },
  title: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  sub: { fontSize: 14, color: 'rgba(255,255,255,0.78)', marginTop: 8 },
});

// ─────────────────────────────────────────────────────────────────────────────

export default function MorningReflectionScreen() {
  const navigation = useNavigation<any>();
  const { complete } = useReflection();

  const [mood, setMood]     = useState<string>('calm');
  const [energy, setEnergy] = useState<ReflectionData['energy']>('moderate');
  const [sleep, setSleep]   = useState<ReflectionData['sleep']>('good');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (saving) return;
    complete({ mood, energy, sleep, intention: mood });
    setSaving(true);
    // Let the animation play, then jump to today's recommendation screen.
    // Reset the root stack so the reflection modal is removed (not left on top)
    // and the "Recommend" tab is selected.
    setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Main',
            state: {
              index: 1,
              routes: [
                { name: 'Home' },
                { name: 'Recommend' },
                { name: 'Sleep' },
                { name: 'AICompanion' },
                { name: 'Plans' },
              ],
            },
          },
        ],
      });
    }, 1500);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {saving && <SaveSuccessOverlay />}
      <ScrollView
        style={s.root}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── TOP HEADER ── */}
        <View style={s.topBar}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <BackArrow />
          </TouchableOpacity>
        </View>

        {/* ── HERO ── */}
        <View style={s.hero}>
          <View style={s.lotusCircle}>
            <Text style={{ fontSize: 48 }}>🪷</Text>
            <Text style={s.sparklesTL}>✦</Text>
            <Text style={s.sparklesTR}>✦</Text>
            <Text style={s.sparklesBL}>✧</Text>
          </View>
          <Text style={s.heroTitle}>Today's Reflection</Text>
          <Text style={s.heroSub}>
            Take a moment to check in with yourself{'\n'}and personalize your day.
          </Text>
        </View>

        {/* ── MOOD SECTION ── */}
        <SectionCard
          iconBg={PURPLE_SOFT}
          iconEmoji="😊"
          titleColor={PURPLE}
          title="Mood"
          subtitle="How are you feeling emotionally?"
        >
          <View style={s.moodGrid}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.key}
                style={[
                  s.moodTile,
                  mood === m.key && { borderColor: PURPLE, backgroundColor: PURPLE_SOFT },
                ]}
                onPress={() => setMood(m.key)}
                activeOpacity={0.75}
              >
                <Text style={s.moodEmoji}>{m.emoji}</Text>
                <Text style={[s.moodLabel, mood === m.key && { color: PURPLE, fontWeight: '700' }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ── ENERGY SECTION ── */}
        <SectionCard
          iconBg={ORANGE_SOFT}
          iconEmoji="☀️"
          titleColor={ORANGE}
          title="Energy"
          subtitle="What's your energy like today?"
        >
          <View style={s.energyGrid}>
            {ENERGY.map((e) => (
              <TouchableOpacity
                key={e.value}
                style={[
                  s.energyTile,
                  energy === e.value && { borderColor: ORANGE, backgroundColor: '#FFF7ED' },
                ]}
                onPress={() => setEnergy(e.value)}
                activeOpacity={0.75}
              >
                <Text style={s.energyEmoji}>{e.emoji}</Text>
                <Text style={[s.energyLabel, energy === e.value && { color: ORANGE, fontWeight: '700' }]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ── SLEEP SECTION ── */}
        <SectionCard
          iconBg={BLUE_SOFT}
          iconEmoji="🌙"
          titleColor={BLUE}
          title="Sleep"
          subtitle="How was your sleep last night?"
        >
          <View style={s.sleepGrid}>
            {SLEEP.map((sl) => (
              <TouchableOpacity
                key={sl.value}
                style={[
                  s.sleepTile,
                  sleep === sl.value && { borderColor: BLUE, backgroundColor: BLUE_SOFT },
                ]}
                onPress={() => setSleep(sl.value)}
                activeOpacity={0.75}
              >
                <Text style={s.sleepEmoji}>{sl.emoji}</Text>
                <Text style={[s.sleepLabel, sleep === sl.value && { color: BLUE, fontWeight: '700' }]}>
                  {sl.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SectionCard>

        {/* ── SAVE ── */}
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={s.saveBtnText}>Save &amp; Continue  →</Text>
        </TouchableOpacity>

        {/* ── PRIVACY NOTE ── */}
        <View style={s.privacyRow}>
          <ShieldIcon />
          <Text style={s.privacyText}>Your reflections are private and secure</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAF8FF' },

  topBar: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 0 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  // hero
  hero: { alignItems: 'center', paddingVertical: 24, paddingHorizontal: 24 },
  lotusCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: PURPLE_SOFT, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, position: 'relative',
  },
  sparklesTL: { position: 'absolute', top: 6, left: 10, fontSize: 12, color: PURPLE },
  sparklesTR: { position: 'absolute', top: 4, right: 8, fontSize: 10, color: PURPLE },
  sparklesBL: { position: 'absolute', bottom: 8, left: 14, fontSize: 10, color: PURPLE },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },
  heroSub: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 21 },

  // mood grid (4 cols × 2 rows)
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodTile: {
    width: '22%', flexGrow: 1,
    alignItems: 'center', paddingVertical: 12,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  moodEmoji: { fontSize: 24 },
  moodLabel: { fontSize: 11, color: '#6B7280', marginTop: 5, fontWeight: '500', textAlign: 'center' },

  // energy grid (5 cols)
  energyGrid: { flexDirection: 'row', gap: 6 },
  energyTile: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  energyEmoji: { fontSize: 22 },
  energyLabel: { fontSize: 10, color: '#6B7280', marginTop: 6, fontWeight: '500', textAlign: 'center' },

  // sleep grid (4 cols)
  sleepGrid: { flexDirection: 'row', gap: 8 },
  sleepTile: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 14, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  sleepEmoji: { fontSize: 26 },
  sleepLabel: { fontSize: 11, color: '#6B7280', marginTop: 6, fontWeight: '500', textAlign: 'center' },

  // save button
  saveBtn: {
    marginHorizontal: 16, marginTop: 8,
    backgroundColor: PURPLE, borderRadius: 999,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.35, shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 }, elevation: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 17, fontWeight: '800', letterSpacing: 0.2 },

  // privacy
  privacyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 },
  privacyText: { fontSize: 12, color: '#9CA3AF' },
});
