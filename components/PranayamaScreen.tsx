import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useReflection } from '../hooks/useReflection';
import { getMoodState, getRecommendations } from '../utils/moodRecommendations';
import StreakCelebration from './StreakCelebration';
import { useStreakStorage } from '../hooks/useStreakStorage';

const { width: SCREEN_W } = Dimensions.get('window');

// ── tiny inline icons ──────────────────────────────────────────────────────────
const BrainIcon = ({ size = 22, color = '#FB923C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C9.5 2 8 3.5 8 5c-2.5 0-4 1.5-4 4 0 1.5.8 2.8 2 3.5C6 14 7.5 15.5 9 16v3h6v-3c1.5-.5 3-2 3-3.5 1.2-.7 2-2 2-3.5 0-2.5-1.5-4-4-4 0-1.5-1.5-3-4-3z" fill={color} />
  </Svg>
);

const MoonIcon = ({ size = 22, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 18a8 8 0 0 1-7.94-7.07A1 1 0 0 1 5.4 9.86 6 6 0 0 0 14.14 4.6a1 1 0 0 1 1.07-1.34A8 8 0 0 1 12 18z" fill={color} />
  </Svg>
);

const BoltIcon = ({ size = 22, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} />
  </Svg>
);

const LungsIcon = ({ size = 22, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3v3M9 6C6 6 3 9 3 12c0 4 2 7 5 7h1v-4H7l2-3 3 3V9M15 6c3 0 6 3 6 6 0 4-2 7-5 7h-1v-4h2l-2-3-3 3V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const PlayIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

const SparklesIcon = ({ size = 18, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill={color} />
  </Svg>
);

const MicIcon = ({ size = 24, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill={color} />
    <Path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const ChevronRight = ({ size = 16, color = '#6B7280' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const CheckIcon = ({ size = 14, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SquareIcon = ({ size = 22, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4h16v16H4z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
  </Svg>
);

const PersonMeditateIcon = ({ size = 22, color = '#8B5CF6' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="5" r="2.2" fill={color} />
    <Path d="M6 18c2-3 4-4 6-4s4 1 6 4M4 18h16" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MusicNoteIcon = ({ size = 22, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18V6l10-2v12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="7" cy="18" r="2.2" fill={color} />
    <Circle cx="17" cy="16" r="2.2" fill={color} />
  </Svg>
);

const VideoPlayIcon = ({ size = 22, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" />
    <Path d="M10 9l5 3-5 3z" fill={color} />
  </Svg>
);

const SoundWaveIcon = ({ size = 22, color = '#10B981' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 12v0M8 8v8M12 5v14M16 8v8M20 12v0" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SunIcon = ({ size = 16, color = '#F59E0B' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="4" fill={color} />
    <Path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SunriseIcon = ({ size = 16, color = '#EF4444' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 18h14M3 18h0M21 18h0M7 14a5 5 0 0 1 10 0M12 4v3M5.6 7.6L7 9M18.4 7.6L17 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// ── mini sparkline ─────────────────────────────────────────────────────────────
const Sparkline = ({ color }: { color: string }) => (
  <Svg width={60} height={20} viewBox="0 0 60 20">
    <Path d="M0 14 Q10 8 20 12 Q30 16 40 6 Q50 2 60 10" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </Svg>
);

const BarChart = ({ color }: { color: string }) => {
  const heights = [6, 10, 8, 14, 12, 10, 8];
  return (
    <Svg width={60} height={18} viewBox="0 0 60 18">
      {heights.map((h, i) => (
        <Path key={i} d={`M${i * 9 + 1} ${18 - h} L${i * 9 + 1} 18`} stroke={color} strokeWidth="6" strokeLinecap="round" />
      ))}
    </Svg>
  );
};

// ── circular progress ring ─────────────────────────────────────────────────────
const CircleRing = ({ percent = 0.83, size = 64, color = '#1B5E20' }) => {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * percent;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={6} fill="none" />
      <Circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={6} fill="none"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        rotation="-90" origin={`${size / 2},${size / 2}`}
      />
    </Svg>
  );
};

// ── stat dots ──────────────────────────────────────────────────────────────────
const StreakDots = () => (
  <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
    {[1, 2, 3, 4, 5, 6].map((_, i) => (
      <View
        key={i}
        style={{
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: i < 5 ? '#2E7D32' : '#D1D5DB',
        }}
      />
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────

const GURU_PROMPTS = [
  'What helps\nanxiety?',
  'I have a\npresentation today',
  'Which pranayama\nis best at night?',
  'I feel mentally\nexhausted',
];

export default function PranayamaScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: reflectionData } = useReflection();

  const GREEN = '#1B5E20';
  const GREEN_SOFT = '#E8F5E9';
  const GREEN_MED = '#2E7D32';

  // ── recommendation completion tracking ──
  const moodState = reflectionData
    ? getMoodState(reflectionData.mood, reflectionData.energy, reflectionData.sleep)
    : 'NEUTRAL';
  const recGroups = useMemo(() => getRecommendations(moodState), [moodState]);

  const totalItems = useMemo(
    () => recGroups.reduce((n, g) => n + g.items.length, 0),
    [recGroups],
  );

  const { data: streakData, markDayComplete, seedTestData } = useStreakStorage();

  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const celebrationFired = React.useRef(false);

  const toggleComplete = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) {
      next.delete(id);
      celebrationFired.current = false;
    } else {
      next.add(id);
    }
    setCompleted(next);

    // fire celebration immediately — persist in background
    if (totalItems > 0 && next.size === totalItems && !celebrationFired.current) {
      celebrationFired.current = true;
      setShowCelebration(true);
      markDayComplete(totalItems, totalItems, totalItems * 6).catch(() => {});
    }
  };

  return (
    <View style={[s.root, { backgroundColor: '#FAFAF7' }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={s.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[s.headerTitle, { color: GREEN }]}>Pranayama</Text>
              <Text style={{ fontSize: 22 }}>🌿</Text>
            </View>
            <Text style={s.headerSub}>Breathe mindfully. Live fully.</Text>
          </View>
          <TouchableOpacity
            style={[s.guruBtn, { borderColor: '#E5E7EB', backgroundColor: '#fff' }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AICompanion', { mode: 'Pranayama Guru' })}
          >
            <SparklesIcon size={16} color={GREEN_MED} />
            <Text style={[s.guruBtnText, { color: GREEN_MED }]}>AI Pranayama Guru</Text>
          </TouchableOpacity>
        </View>

        {/* ── HERO CHARACTER IMAGE ── */}
        <View style={s.heroWrap}>
          <Image
            source={require('../assets/images/pranayama-character-day.png')}
            style={s.heroImg}
            resizeMode="cover"
          />
        </View>

        {/* ── TODAY'S STATE ── */}
        <View style={s.section}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Today's State</Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Text style={[s.linkText, { color: GREEN_MED }]}>View details</Text>
              <ChevronRight size={14} color={GREEN_MED} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
            {/* Stress */}
            <View style={[s.statCard, { marginLeft: 20 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <BrainIcon size={18} color="#FB923C" />
                <Text style={s.statLabel}>Stress</Text>
              </View>
              <Text style={[s.statStatus, { color: '#FB923C' }]}>Moderate</Text>
              <Text style={s.statValue}>6/10</Text>
              <Sparkline color="#FB923C" />
            </View>

            {/* Sleep */}
            <View style={s.statCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <MoonIcon size={18} color="#8B5CF6" />
                <Text style={s.statLabel}>Sleep</Text>
              </View>
              <Text style={[s.statStatus, { color: '#8B5CF6' }]}>Good</Text>
              <Text style={s.statValue}>7h 15m</Text>
              <BarChart color="#8B5CF6" />
            </View>

            {/* Energy */}
            <View style={s.statCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <BoltIcon size={18} color="#F59E0B" />
                <Text style={s.statLabel}>Energy</Text>
              </View>
              <Text style={[s.statStatus, { color: '#FB923C' }]}>Low</Text>
              <Text style={s.statValue}>4/10</Text>
              <Sparkline color="#F59E0B" />
            </View>

            {/* Breathing Streak */}
            <View style={[s.statCard, { marginRight: 20 }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <LungsIcon size={18} color={GREEN_MED} />
                <Text style={s.statLabel}>Breathing Streak</Text>
              </View>
              <Text style={[s.statValue, { fontSize: 22, color: '#0F172A', marginTop: 4 }]}>5 Days</Text>
              <Text style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Keep going! 🔥</Text>
              <StreakDots />
            </View>
          </ScrollView>
        </View>

        {/* ── TODAY'S RECOMMENDATION ── */}
        <View style={[s.section, { paddingHorizontal: 20 }]}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Today's Recommendation</Text>
            <Text style={[s.linkText, { color: GREEN_MED }]}>
              {completed.size}/{totalItems} done
            </Text>
          </View>

          {/* overall progress bar */}
          <View style={s.recProgressTrack}>
            <View
              style={[
                s.recProgressFill,
                { width: totalItems ? `${(completed.size / totalItems) * 100}%` : '0%' },
              ]}
            />
          </View>

          <View style={[s.recCard, { borderColor: '#E5E7EB' }]}>
            {(() => {
              const typeIcon = (type: string): React.ComponentType<{ size?: number; color?: string }> => {
                if (type === 'breathing') return LungsIcon;
                if (type === 'meditation') return PersonMeditateIcon;
                if (type === 'music') return MusicNoteIcon;
                return VideoPlayIcon;
              };
              const typeTint = (type: string) => {
                if (type === 'breathing') return { tint: GREEN_MED, tintSoft: GREEN_SOFT };
                if (type === 'meditation') return { tint: '#8B5CF6', tintSoft: '#EDE9FE' };
                if (type === 'music') return { tint: '#F59E0B', tintSoft: '#FEF3C7' };
                return { tint: '#EF4444', tintSoft: '#FEE2E2' };
              };
              const groupIcon = (label: string) =>
                label === 'Evening' ? SunriseIcon : SunIcon;
              const groupIconColor = (label: string) =>
                label === 'Evening' ? '#EF4444' : '#F59E0B';

              return recGroups.map((g, gi) => {
                const GIcon = groupIcon(g.label);
                const groupDone = g.items.every((it) => completed.has(it.id));
                return (
                  <View key={g.label} style={{ marginTop: gi === 0 ? 0 : 18 }}>
                    <View style={s.recGroupHeader}>
                      <GIcon size={16} color={groupIconColor(g.label)} />
                      <Text style={s.recGroupLabel}>{g.label}</Text>
                      {groupDone && (
                        <View style={s.recGroupDoneBadge}>
                          <CheckIcon size={11} color={GREEN_MED} />
                        </View>
                      )}
                    </View>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: 10, paddingRight: 4 }}
                    >
                      {g.items.map((it) => {
                        const Icon = typeIcon(it.type);
                        const { tint, tintSoft } = typeTint(it.type);
                        const isDone = completed.has(it.id);
                        return (
                          <TouchableOpacity
                            key={it.id}
                            activeOpacity={0.85}
                            onPress={() => toggleComplete(it.id)}
                            style={[s.recTile, isDone && s.recTileDone]}
                          >
                            {/* completion check badge */}
                            <View style={[s.recCheck, isDone ? s.recCheckOn : s.recCheckOff]}>
                              {isDone && <CheckIcon size={12} color="#fff" />}
                            </View>

                            <View style={[s.recTileIcon, { backgroundColor: tintSoft }, isDone && { opacity: 0.5 }]}>
                              <Icon size={22} color={tint} />
                            </View>
                            <Text
                              style={[s.recTileTitle, isDone && s.recTileTitleDone]}
                              numberOfLines={2}
                            >
                              {it.title}
                            </Text>
                            <View style={s.recTileFoot}>
                              <Text style={s.recTileMeta}>{it.meta}</Text>
                              <TouchableOpacity
                                onPress={() => navigation.navigate('BreathingSession', { id: it.id, title: it.title })}
                                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                style={[s.recTilePlay, { backgroundColor: tint }]}
                              >
                                <PlayIcon size={11} color="#fff" />
                              </TouchableOpacity>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                );
              });
            })()}
          </View>
        </View>

        {/* ── YOUR JOURNEY ── */}
        <View style={[s.section, { paddingHorizontal: 20 }]}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Your Journey</Text>
            <TouchableOpacity
              onPress={seedTestData}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            >
              <Text style={[s.linkText, { color: GREEN_MED }]}>Seed test data</Text>
            </TouchableOpacity>
          </View>

          {/* streak summary row */}
          <View style={[s.journeyCard, { borderColor: '#E5E7EB' }]}>
            {/* streak ring */}
            <View style={{ alignItems: 'center' }}>
              <View style={{ position: 'relative' }}>
                <CircleRing
                  percent={streakData.longestStreak > 0 ? streakData.currentStreak / streakData.longestStreak : 0}
                  size={72}
                  color={GREEN}
                />
                <View style={s.ringCenter}>
                  <Text style={[s.ringNum, { color: GREEN }]}>{streakData.currentStreak}</Text>
                  <Text style={s.ringLabel}>Day{'\n'}Streak</Text>
                </View>
              </View>
            </View>

            {/* stats */}
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={s.journeyMsg}>
                  {streakData.currentStreak >= 7
                    ? 'On fire! 🔥'
                    : streakData.currentStreak > 0
                    ? "You're doing amazing!"
                    : 'Start your streak today!'}
                </Text>
                <Text style={{ fontSize: 14 }}>🌿</Text>
              </View>
              <Text style={s.journeyHint}>
                Best streak: {streakData.longestStreak} day{streakData.longestStreak !== 1 ? 's' : ''}
              </Text>
              <Text style={[s.weekMin, { color: '#0F172A' }]}>
                Total days{'\n'}
                <Text style={{ fontSize: 22, fontWeight: '800', color: GREEN }}>
                  {streakData.totalDaysCompleted}
                </Text>
              </Text>
            </View>

            {/* live bar chart — last 7 records */}
            {(() => {
              const last7 = streakData.history.slice(-7);
              const max = Math.max(...last7.map((d) => d.minutesLogged), 1);
              const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
              return (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4 }}>
                  {last7.map((rec, i) => {
                    const dayLabel = DAY_LABELS[new Date(rec.date + 'T00:00:00').getDay()];
                    const barH = Math.max(4, (rec.minutesLogged / max) * 52);
                    return (
                      <View key={i} style={{ alignItems: 'center', gap: 3 }}>
                        <View
                          style={{
                            width: 18,
                            height: barH,
                            backgroundColor: rec.completed ? GREEN_MED : '#E5E7EB',
                            borderRadius: 4,
                          }}
                        />
                        <Text style={{ fontSize: 10, color: '#9CA3AF' }}>{dayLabel}</Text>
                      </View>
                    );
                  })}
                  {/* fill empty slots if fewer than 7 records */}
                  {Array.from({ length: Math.max(0, 7 - last7.length) }).map((_, i) => (
                    <View key={`empty-${i}`} style={{ alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 18, height: 4, backgroundColor: '#E5E7EB', borderRadius: 4 }} />
                      <Text style={{ fontSize: 10, color: '#E5E7EB' }}>-</Text>
                    </View>
                  ))}
                </View>
              );
            })()}
          </View>
        </View>

        {/* ── ASK YOUR GURU ── */}
        <View style={[s.section, { paddingHorizontal: 20 }]}>
          <View style={s.sectionRow}>
            <View>
              <Text style={s.sectionTitle}>Ask Your Guru</Text>
              <Text style={[s.guruSub, { color: '#9CA3AF' }]}>Your personal AI coach</Text>
            </View>
          </View>

          <View style={s.guruRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
              {GURU_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.promptChip, { borderColor: '#E5E7EB', backgroundColor: '#fff' }]}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('AICompanion', { mode: 'Pranayama Guru', prompt: p.replace('\n', ' ') })}
                >
                  <Text style={s.promptText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[s.micBtn, { backgroundColor: GREEN }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AICompanion', { mode: 'Pranayama Guru' })}
            >
              <MicIcon size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <StreakCelebration
        visible={showCelebration}
        streakCount={streakData.currentStreak}
        onClose={() => setShowCelebration(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  guruBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  guruBtnText: { fontSize: 13, fontWeight: '600' },

  heroWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    height: 220,
  },
  heroImg: { width: '100%', height: '100%' },

  section: { marginTop: 24 },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', letterSpacing: -0.3 },
  linkText: { fontSize: 13, fontWeight: '600' },

  // stat cards
  statCard: {
    width: 130,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  statLabel: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  statStatus: { fontSize: 12, fontWeight: '600', marginTop: 6 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  // recommendation card
  recCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  recTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  recIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recName: { fontSize: 17, fontWeight: '800', color: '#0F172A' },
  recMeta: { fontSize: 13, color: '#6B7280', marginTop: 3 },
  recBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  recBadgeText: { fontSize: 12, fontWeight: '600' },

  recProgressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
    overflow: 'hidden',
  },
  recProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },

  recGroupHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  recGroupLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  recGroupDoneBadge: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#E8F5E9',
    alignItems: 'center', justifyContent: 'center',
  },
  recTile: {
    width: 112,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  recTileDone: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  recCheck: {
    position: 'absolute',
    top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 2,
  },
  recCheckOn: { backgroundColor: '#10B981' },
  recCheckOff: { borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: 'transparent' },
  recTileIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  recTileTitle: { fontSize: 12, fontWeight: '700', color: '#0F172A', lineHeight: 16 },
  recTileTitleDone: { color: '#6B7280', textDecorationLine: 'line-through' },
  recTileFoot: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 6,
  },
  recTileMeta: { fontSize: 11, color: '#6B7280' },
  recTilePlay: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },

  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  whyTitle: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 16 },
  whyRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  whyChip: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  whyText: { fontSize: 12, color: '#374151', lineHeight: 17 },

  infoBtn: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },

  // journey
  journeyCard: {
    marginTop: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringNum: { fontSize: 18, fontWeight: '800' },
  ringLabel: { fontSize: 9, color: '#6B7280', textAlign: 'center', marginTop: 1 },
  journeyMsg: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  journeyHint: { fontSize: 12, color: '#6B7280', marginTop: 3, lineHeight: 17 },
  weekMin: { fontSize: 13, marginTop: 8, color: '#6B7280' },
  progressBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginTop: 6,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },

  // ask guru
  guruSub: { fontSize: 12, marginTop: 1 },
  guruRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 10 },
  promptChip: {
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    maxWidth: 130,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  promptText: { fontSize: 13, color: '#374151', lineHeight: 18 },
  micBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
});
