import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import { Moon, Sparkles, Play, ChevronRight, Wind } from './Icons';

const sections = [
  {
    title: 'Sleep Breathing',
    desc: 'Slow exhale, soft body.',
    duration: '8 min',
    Icon: Wind,
  },
  {
    title: 'Sleep Stories',
    desc: 'Soft-voiced tales for letting go.',
    duration: '22 min',
    Icon: Moon,
  },
  {
    title: 'Relaxing Soundscapes',
    desc: 'Rain on a temple roof.',
    duration: '60 min',
    Icon: Sparkles,
  },
  {
    title: 'Bedtime Reflection',
    desc: 'One question. One breath.',
    duration: '3 min',
    Icon: Moon,
  },
];

const SleepScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={warm.screen}>
      <ScrollView contentContainerStyle={warm.scroll} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={warm.topRow}>
          <View>
            <Text style={warm.overline}>Night ritual</Text>
            <Text style={[warm.h1, { marginTop: 4 }]}>Sleep</Text>
            <Text style={warm.body}>Slow down. Let go.</Text>
          </View>
          <TouchableOpacity
            style={warm.iconBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanion', { mode: 'Sleep Guide' })}
          >
            <Sparkles size={18} color={COLORS.primaryGold} />
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <ImageBackground
          source={require('../assets/images/meditatingGuru.png')}
          style={styles.hero}
          imageStyle={styles.heroImg}
        >
          <View style={styles.heroOverlay} />
          <Moon size={28} color={COLORS.warmBeige} />
          <Text style={styles.heroTitle}>Tonight</Text>
          <Text style={styles.heroSub}>
            The day is done. Three breaths. Then drift.
          </Text>
          <TouchableOpacity
            style={[warm.pillPrimary, { marginTop: 16, alignSelf: 'flex-start' }]}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('BreathingSession', { id: 'sleep', title: 'Calm Before Sleep' })
            }
          >
            <Play size={12} color={COLORS.deepBrown} />
            <Text style={warm.pillPrimaryText}>Begin wind-down</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* TONIGHT'S ROUTINE */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Tonight’s routine</Text>
        </View>
        <View style={styles.routineCard}>
          <Step n={1} title="Unwind" sub="5 min · soft stretch" />
          <View style={styles.routineDivider} />
          <Step n={2} title="Breathe" sub="8 min · 4-7-8" />
          <View style={styles.routineDivider} />
          <Step n={3} title="Sleep" sub="Story or soundscape" />
        </View>

        {/* SECTIONS */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Library</Text>
        </View>
        {sections.map((s, i) => (
          <TouchableOpacity key={i} style={styles.row} activeOpacity={0.85}>
            <View style={styles.rowIcon}>
              <s.Icon size={20} color={COLORS.mutedTeal} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{s.title}</Text>
              <Text style={styles.rowDesc}>{s.desc}</Text>
              <Text style={styles.rowMeta}>{s.duration}</Text>
            </View>
            <View style={styles.rowPlay}>
              <Play size={13} color={COLORS.deepBrown} />
            </View>
          </TouchableOpacity>
        ))}

        {/* TIMER + AMBIENT */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Comfort controls</Text>
        </View>
        <View style={styles.controlCard}>
          <View style={styles.controlRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.controlTitle}>Sleep timer</Text>
              <Text style={styles.controlSub}>Fade audio after 45 min</Text>
            </View>
            <Text style={styles.controlValue}>45m</Text>
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </View>
          <View style={styles.controlDivider} />
          <View style={styles.controlRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.controlTitle}>Background ambient</Text>
              <Text style={styles.controlSub}>Soft rain · 30% volume</Text>
            </View>
            <Text style={styles.controlValue}>30%</Text>
            <ChevronRight size={18} color={COLORS.textSecondary} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const Step = ({ n, title, sub }: { n: number; title: string; sub: string }) => (
  <View style={styles.stepRow}>
    <View style={styles.stepBadge}>
      <Text style={styles.stepN}>{n}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSub}>{sub}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'flex-end',
  },
  heroImg: { borderRadius: 24 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,12,8,0.65)',
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginTop: 10,
    letterSpacing: -0.4,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 19,
  },

  routineCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.14)',
    padding: 18,
  },
  routineDivider: {
    height: 1,
    backgroundColor: 'rgba(212,175,55,0.08)',
    marginVertical: 14,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(212,175,55,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepN: { color: COLORS.primaryGold, fontWeight: '700', fontSize: 13 },
  stepTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  stepSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.control,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(78,124,116,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  rowDesc: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  rowMeta: { color: COLORS.primaryGold, fontSize: 11, marginTop: 4, fontWeight: '500' },
  rowPlay: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  controlCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
    padding: 16,
  },
  controlRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  controlTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  controlSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  controlValue: { color: COLORS.primaryGold, fontWeight: '600', fontSize: 13 },
  controlDivider: { height: 1, backgroundColor: 'rgba(212,175,55,0.08)', marginVertical: 12 },
});

export default SleepScreen;
