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
import { useTheme } from '../hooks/useTheme';
import {
  Sparkles,
  Moon,
  Play,
  ChevronRight,
  ChevronLeft,
  Wind,
  Stretch,
  Waveform,
  CloudRain,
  Bowl,
  Check,
  Star,
  Flame,
} from './Icons';

const SleepScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, images, mode } = useTheme();
  const isNight = mode === 'night';

  // — Tonight's routine steps
  const routine = [
    { n: 1, title: 'Unwind',  sub: '5 min · Soft stretch', Icon: Stretch },
    { n: 2, title: 'Breathe', sub: '8 min · 4-7-8 Breathing', Icon: Wind },
    { n: 3, title: 'Sleep',   sub: 'Story or soundscape', Icon: Moon },
  ];

  // — Library tracks
  const library = [
    { id: 'soundscape', title: 'Deep Sleep Soundscape', meta: 'Calming · 30 min', Icon: Waveform,   tint: colors.statMint,   tintSoft: colors.statMintSoft },
    { id: 'rain',       title: 'Rain & Thunder',         meta: 'Nature · 20 min',   Icon: CloudRain,  tint: '#3B82F6',         tintSoft: 'rgba(59,130,246,0.14)' },
    { id: 'bowls',      title: 'Singing Bowls',           meta: 'Healing · 25 min',  Icon: Bowl,       tint: colors.statYellow, tintSoft: colors.statYellowSoft },
  ];

  // — Sleep streak day badges (M, T, W, T, F, S, S)
  const days = [
    { d: 'Mon', state: 'done' },
    { d: 'Tue', state: 'done' },
    { d: 'Wed', state: 'done' },
    { d: 'Thu', state: 'done' },
    { d: 'Fri', state: 'done' },
    { d: 'Sat', state: 'today' },
    { d: 'Sun', state: 'pending' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.6} style={styles.backBtn}>
            <ChevronLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sparkleBtn, { borderColor: colors.borderStrong }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanion', { mode: 'Sleep Guide' })}
          >
            <Sparkles size={20} color={colors.statPurple} />
          </TouchableOpacity>
        </View>

        {/* TITLE BLOCK */}
        <View style={styles.titleBlock}>
          <Text style={[styles.overline, { color: colors.statPurple }]}>NIGHT RITUAL</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Sleep</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Slow down. Let go.
          </Text>
        </View>

        {/* TONIGHT HERO */}
        <ImageBackground
          source={images.sleepHero}
          style={styles.heroCard}
          imageStyle={{ borderRadius: 24 }}
        >
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: isNight ? 'rgba(8,12,28,0.5)' : 'rgba(255,255,255,0.06)' },
            ]}
          />
          <View style={[styles.tonightPill, { backgroundColor: colors.statPurpleSoft }]}>
            <Moon size={13} color={colors.statPurple} />
            <Text style={[styles.tonightText, { color: colors.statPurple }]}>Tonight</Text>
          </View>
          <Text style={[styles.heroTitle, { color: isNight ? '#FFFFFF' : '#0F172A' }]}>
            The day is done.{'\n'}Three breaths. Then drift.
          </Text>
          <TouchableOpacity
            style={[styles.heroCta, { backgroundColor: colors.statPurple }]}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('BreathingSession', { id: 'sleep', title: 'Calm Before Sleep' })
            }
          >
            <Play size={13} color="#FFFFFF" />
            <Text style={styles.heroCtaText}>Begin wind-down</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* TONIGHT'S ROUTINE */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Tonight's routine
            </Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
              Follow these steps for a better sleep
            </Text>
          </View>
          <Text style={[styles.linkText, { color: colors.statPurple }]}>10–15 min</Text>
        </View>

        <View style={[styles.routineCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {routine.map((s, i) => (
            <View key={s.n}>
              <TouchableOpacity activeOpacity={0.85} style={styles.routineRow}>
                <View style={[styles.stepBubble, { backgroundColor: colors.cardLight }]}>
                  <Text style={[styles.stepBubbleText, { color: colors.textPrimary }]}>{s.n}</Text>
                </View>
                <View style={[styles.routineIcon, { backgroundColor: colors.statPurpleSoft }]}>
                  <s.Icon size={20} color={colors.statPurple} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.routineTitle, { color: colors.textPrimary }]}>{s.title}</Text>
                  <Text style={[styles.routineMeta, { color: colors.textSecondary }]}>{s.sub}</Text>
                </View>
                <ChevronRight size={18} color={colors.textSecondary} />
              </TouchableOpacity>
              {i < routine.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* LIBRARY */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Library</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[styles.linkText, { color: colors.statPurple }]}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.libraryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {library.map((t, i) => (
            <View key={t.id}>
              <TouchableOpacity activeOpacity={0.85} style={styles.libraryRow}>
                <View style={[styles.libraryIcon, { backgroundColor: t.tintSoft }]}>
                  <t.Icon size={20} color={t.tint} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.libraryTitle, { color: colors.textPrimary }]}>{t.title}</Text>
                  <Text style={[styles.libraryMeta, { color: colors.textSecondary }]}>{t.meta}</Text>
                </View>
                <View style={[styles.libraryPlay, { backgroundColor: colors.statPurple }]}>
                  <Play size={14} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              {i < library.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* SLEEP STREAK */}
        <View style={[styles.streakCard, { backgroundColor: colors.statPurpleSoft }]}>
          <View style={styles.streakHeader}>
            <View style={[styles.streakIcon, { backgroundColor: colors.statPurpleSoft }]}>
              <Moon size={20} color={colors.statPurple} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.streakTitle, { color: colors.textPrimary }]}>
                Your sleep streak
              </Text>
              <Text style={[styles.streakSub, { color: colors.textSecondary }]}>
                Keep the rhythm going
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.streakNum, { color: colors.statPurple }]}>6</Text>
              <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>nights</Text>
            </View>
            <View style={[styles.flameBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Flame size={18} color={colors.statOrange} />
            </View>
          </View>

          <View style={styles.dayRow}>
            {days.map(d => {
              if (d.state === 'done') {
                return (
                  <View key={d.d} style={styles.dayItem}>
                    <View style={[styles.dayBadge, { backgroundColor: colors.statPurple }]}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                    <Text style={[styles.dayLabel, { color: colors.textPrimary }]}>{d.d}</Text>
                  </View>
                );
              }
              if (d.state === 'today') {
                return (
                  <View key={d.d} style={styles.dayItem}>
                    <View style={[styles.dayBadge, { backgroundColor: colors.statPurple, borderWidth: 2, borderColor: colors.statPurple }]}>
                      <Star size={14} color="#FFFFFF" filled />
                    </View>
                    <Text style={[styles.dayLabel, { color: colors.statPurple, fontWeight: '700' }]}>{d.d}</Text>
                  </View>
                );
              }
              return (
                <View key={d.d} style={styles.dayItem}>
                  <View style={[styles.dayBadgeEmpty, { borderColor: colors.borderStrong }]} />
                  <Text style={[styles.dayLabel, { color: colors.textSecondary }]}>{d.d}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // TITLE BLOCK
  titleBlock: { paddingHorizontal: 20, paddingBottom: 18 },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, marginTop: 8 },
  subtitle: { fontSize: 15, marginTop: 4 },

  // HERO CARD
  heroCard: {
    marginHorizontal: 20,
    height: 260,
    borderRadius: 24,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'space-between',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
  },
  tonightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  tonightText: { fontSize: 12, fontWeight: '700' },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginTop: 10,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 999,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroCtaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, marginTop: 2 },
  linkText: { fontSize: 14, fontWeight: '600' },

  // ROUTINE
  routineCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 12,
  },
  stepBubble: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  stepBubbleText: { fontSize: 14, fontWeight: '700' },
  routineIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  routineTitle: { fontSize: 15, fontWeight: '700' },
  routineMeta: { fontSize: 13, marginTop: 2 },
  divider: { height: 1, marginHorizontal: 14 },

  // LIBRARY
  libraryCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  libraryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
  },
  libraryIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  libraryTitle: { fontSize: 15, fontWeight: '700' },
  libraryMeta: { fontSize: 13, marginTop: 2 },
  libraryPlay: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },

  // STREAK
  streakCard: {
    marginHorizontal: 20,
    marginTop: 22,
    padding: 18,
    borderRadius: 24,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  streakIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  streakTitle: { fontSize: 15, fontWeight: '700' },
  streakSub: { fontSize: 12, marginTop: 2 },
  streakNum: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  streakUnit: { fontSize: 12, marginTop: -2 },
  flameBubble: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 10,
  },

  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  dayItem: { alignItems: 'center', flex: 1 },
  dayBadge: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  dayBadgeEmpty: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  dayLabel: { fontSize: 12, fontWeight: '500' },
});

export default SleepScreen;
