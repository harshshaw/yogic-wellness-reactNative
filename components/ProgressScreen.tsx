import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Svg, { Circle, Path, Polyline, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, type ThemeColors } from '../hooks/useTheme';
import { useReflection } from '../hooks/useReflection';
import { computeReflectionProgress, moodLabel } from '../utils/reflectionProgress';
import {
  Sparkles,
  Flame,
  Calendar,
  Pencil,
  ChevronRight,
  Heart,
  Sun,
  Moon,
} from './Icons';

// ─── Stat ring ──────────────────────────────────────────────────────────
const StatRing = ({
  value,
  color,
  size = 56,
  trackColor = 'rgba(127,127,127,0.18)',
}: {
  value: number;
  color: string;
  size?: number;
  trackColor?: string;
}) => {
  const r = (size - 6) / 2;
  const sw = 4;
  const c = 2 * Math.PI * r;
  const dash = Math.min(value / 100, 1) * c;
  const cx = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cx} r={r} stroke={trackColor} strokeWidth={sw} fill="none" />
      <Circle
        cx={cx}
        cy={cx}
        r={r}
        stroke={color}
        strokeWidth={sw}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - dash}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
    </Svg>
  );
};

// ─── Line chart ─────────────────────────────────────────────────────────
const WeeklyLineChart = ({ colors: themeColors }: { colors: ThemeColors }) => {
  // Each series: array of normalized 0..1 values for Mon-Sun
  const calories = [0.18, 0.22, 0.36, 0.45, 0.6, 0.45, 0.5];
  const steps    = [0.42, 0.5, 0.58, 0.62, 0.85, 0.78, 0.82];
  const minutes  = [0.06, 0.08, 0.14, 0.2, 0.2, 0.18, 0.2];

  const W = 280;
  const H = 160;
  const padL = 8;
  const padR = 12;
  const padT = 8;
  const padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const points = (series: number[]) =>
    series
      .map((v, i) => {
        const x = padL + (i / (series.length - 1)) * innerW;
        const y = padT + (1 - v) * innerH;
        return `${x},${y}`;
      })
      .join(' ');

  const renderSeries = (series: number[], color: string) => (
    <>
      <Polyline points={points(series)} fill="none" stroke={color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {series.map((v, i) => {
        const x = padL + (i / (series.length - 1)) * innerW;
        const y = padT + (1 - v) * innerH;
        return <Circle key={i} cx={x} cy={y} r={3} fill={color} />;
      })}
    </>
  );

  // Gridlines
  const gridY = [0.25, 0.5, 0.75, 1].map(p => padT + p * innerH);

  return (
    <View>
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
        {gridY.map((y, i) => (
          <Path key={i} d={`M ${padL} ${y} L ${W - padR} ${y}`} stroke={themeColors.border} strokeWidth={1} />
        ))}
        {renderSeries(steps, themeColors.statMint)}
        {renderSeries(calories, themeColors.statOrange)}
        {renderSeries(minutes, themeColors.statPurple)}
      </Svg>
    </View>
  );
};

// ─── Insights mini bar chart ────────────────────────────────────────────
const InsightBars = ({ color }: { color: string }) => {
  const heights = [0.18, 0.22, 0.28, 0.32, 0.38, 0.5, 0.6, 0.7, 0.85, 1];
  const W = 200;
  const H = 40;
  const gap = 4;
  const bw = (W - gap * (heights.length - 1)) / heights.length;
  return (
    <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
      <Defs>
        <LinearGradient id="bg" x1="0" y1="1" x2="0" y2="0">
          <Stop offset="0" stopColor={color} stopOpacity="0.25" />
          <Stop offset="1" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {heights.map((h, i) => (
        <Rect
          key={i}
          x={i * (bw + gap)}
          y={H - h * H}
          width={bw}
          height={h * H}
          rx={2}
          fill="url(#bg)"
        />
      ))}
    </Svg>
  );
};

// ─── SCREEN ─────────────────────────────────────────────────────────────
const TABS = ['Overview', 'Trends', 'Insights', 'Achievements'] as const;
type Tab = (typeof TABS)[number];

const ProgressScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const { completed, data } = useReflection();
  const progress = data ? computeReflectionProgress(data) : null;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>Progress</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Track your growth. Celebrate every step.
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.iconBtn, { borderColor: colors.borderStrong }]}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={colors.statPurple} />
          </TouchableOpacity>
        </View>

        {/* TAB PILLS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map(t => {
            const active = t === activeTab;
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.tab,
                  active && { backgroundColor: colors.statPurpleSoft },
                ]}
                activeOpacity={0.85}
                onPress={() => setActiveTab(t)}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? colors.statPurple : colors.textSecondary },
                  ]}
                >
                  {t}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* TODAY'S OVERVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Today's Overview
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.linkRow}
            onPress={() => navigation.navigate('MorningReflection')}
          >
            <Text style={[styles.linkText, { color: colors.statPurple }]}>
              {completed ? 'Edit Reflection' : 'Reflect'}
            </Text>
            <Pencil size={14} color={colors.statPurple} />
          </TouchableOpacity>
        </View>

        {progress && data ? (
          /* 3 STAT CARDS — derived from today's reflection */
          <View style={styles.statRow}>
            <StatCard
              colors={colors}
              label="Mood"
              value={moodLabel(data.mood)}
              unit="emotional state"
              tint={colors.statPurple}
              tintSoft={colors.statPurpleSoft}
              ringValue={progress.mood}
              Icon={Heart}
            />
            <StatCard
              colors={colors}
              label="Energy"
              value={`${progress.energy}%`}
              unit="vitality today"
              tint={colors.statOrange}
              tintSoft={colors.statOrangeSoft}
              ringValue={progress.energy}
              Icon={Sun}
            />
            <StatCard
              colors={colors}
              label="Sleep"
              value={`${progress.sleep}%`}
              unit="rest quality"
              tint={colors.statMint}
              tintSoft={colors.statMintSoft}
              ringValue={progress.sleep}
              Icon={Moon}
            />
          </View>
        ) : (
          /* No reflection yet — prompt to complete it */
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MorningReflection')}
            style={[
              styles.emptyCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={[styles.emptyIcon, { backgroundColor: colors.statPurpleSoft }]}>
              <Sparkles size={22} color={colors.statPurple} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                Start with today's reflection
              </Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Check in with your mood, energy and sleep to see your progress.
              </Text>
            </View>
            <ChevronRight size={20} color={colors.statPurple} />
          </TouchableOpacity>
        )}

        {/* WEEKLY ACTIVITY */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Weekly Activity</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.linkRow}>
              <Text style={[styles.linkText, { color: colors.statPurple }]}>View more</Text>
              <ChevronRight size={14} color={colors.statPurple} />
            </TouchableOpacity>
          </View>

          <View style={styles.legendRow}>
            <Legend color={colors.statOrange} label="Calories (kcal)" textColor={colors.textSecondary} />
            <Legend color={colors.statMint} label="Steps" textColor={colors.textSecondary} />
            <Legend color={colors.statPurple} label="Minutes" textColor={colors.textSecondary} />
          </View>

          {/* y-axis labels + chart */}
          <View style={{ flexDirection: 'row', marginTop: 6 }}>
            <View style={styles.yAxis}>
              <Text style={[styles.axisText, { color: colors.textSecondary }]}>10K</Text>
              <Text style={[styles.axisText, { color: colors.textSecondary }]}>7.5K</Text>
              <Text style={[styles.axisText, { color: colors.textSecondary }]}>5K</Text>
              <Text style={[styles.axisText, { color: colors.textSecondary }]}>2.5K</Text>
              <Text style={[styles.axisText, { color: colors.textSecondary }]}>0</Text>
            </View>
            <View style={{ flex: 1 }}>
              <WeeklyLineChart colors={colors} />
              <View style={styles.daysRow}>
                {days.map(d => (
                  <Text key={d} style={[styles.dayText, { color: colors.textSecondary }]}>{d}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* INSIGHTS */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}>
          <View style={styles.insightTop}>
            <View style={[styles.insightIcon, { backgroundColor: colors.statPurpleSoft }]}>
              <Sparkles size={18} color={colors.statPurple} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.insightTitle, { color: colors.textPrimary }]}>
                {progress ? progress.headline : 'Great consistency!'}
              </Text>
              <Text style={[styles.insightSub, { color: colors.textSecondary }]}>
                {progress
                  ? progress.message
                  : 'Complete your reflection to see personalized insights.'}
              </Text>
            </View>
            <View style={styles.insightRingCol}>
              <View style={styles.insightRing}>
                <StatRing
                  value={progress ? progress.overall : 0}
                  color={colors.statPurple}
                  size={56}
                />
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                  <Text style={[styles.ringNum, { color: colors.statPurple }]}>
                    {progress ? `${progress.overall}%` : '—'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.ringLabel, { color: colors.textSecondary }]}>
                Wellness
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 12 }}>
            <InsightBars color={colors.statPurple} />
          </View>

          <TouchableOpacity activeOpacity={0.7} style={[styles.viewAllRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.linkText, { color: colors.statPurple }]}>View all insights</Text>
            <ChevronRight size={16} color={colors.statPurple} />
          </TouchableOpacity>
        </View>

        {/* CURRENT STREAK */}
        <TouchableOpacity
          style={[styles.streakRow, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 16 }]}
          activeOpacity={0.85}
        >
          <View style={[styles.streakIcon, { backgroundColor: colors.statMintSoft }]}>
            <Flame size={22} color={colors.statMint} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.streakTitle, { color: colors.textPrimary }]}>Current Streak</Text>
            <Text style={[styles.streakSub, { color: colors.textSecondary }]}>
              You're on fire! 🔥
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.streakNum, { color: colors.statMint }]}>12</Text>
            <Text style={[styles.streakUnit, { color: colors.textSecondary }]}>days</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// ─── Sub components ─────────────────────────────────────────────────────
const Legend = ({ color, label, textColor }: { color: string; label: string; textColor: string }) => (
  <View style={styles.legend}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
  </View>
);

const StatCard = ({
  colors: c,
  label, value, unit, tint, tintSoft, ringValue, Icon,
}: {
  colors: ThemeColors;
  label: string;
  value: string;
  unit: string;
  tint: string;
  tintSoft: string;
  ringValue: number;
  Icon: any;
}) => (
  <View style={[styles.statCard, { backgroundColor: c.card, borderColor: c.border }]}>
    <View style={styles.statTop}>
      <View style={[styles.statIcon, { backgroundColor: tintSoft }]}>
        <Icon size={16} color={tint} />
      </View>
      <Text style={[styles.statLabel, { color: c.textPrimary }]}>{label}</Text>
    </View>
    <View style={styles.statBottom}>
      <View style={{ flex: 1, paddingRight: 4 }}>
        <Text
          style={[styles.statValue, { color: tint }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
        >
          {value}
        </Text>
        <Text
          style={[styles.statUnit, { color: c.textSecondary }]}
          numberOfLines={1}
        >
          {unit}
        </Text>
      </View>
      <View style={styles.statRing}>
        <StatRing value={ringValue} color={tint} size={42} />
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text style={[styles.statRingText, { color: tint }]}>{ringValue}%</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 18,
    gap: 10,
  },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8 },
  subtitle: { fontSize: 14, marginTop: 6 },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 4,
  },

  // TABS
  tabsRow: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  tabText: { fontSize: 14, fontWeight: '600' },

  // SECTIONS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  linkText: { fontSize: 14, fontWeight: '600' },

  // STAT CARDS
  statRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
  },
  statTop: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statIcon: {
    width: 26, height: 26, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  statLabel: { fontSize: 12, fontWeight: '700' },
  statBottom: { flexDirection: 'row', alignItems: 'center' },
  statValue: { fontSize: 19, fontWeight: '800', letterSpacing: -0.5 },
  statUnit: { fontSize: 10, marginTop: 2 },
  statRing: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  statRingText: { fontSize: 9, fontWeight: '700' },

  // EMPTY / REFLECT PROMPT
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  emptyIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptySub: { fontSize: 13, marginTop: 4, lineHeight: 18 },

  // CARD
  card: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12 },

  yAxis: {
    width: 32,
    justifyContent: 'space-between',
    paddingVertical: 4,
    height: 160,
  },
  axisText: { fontSize: 10 },

  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  dayText: { fontSize: 11 },

  // INSIGHTS
  insightTop: { flexDirection: 'row', alignItems: 'center' },
  insightIcon: {
    width: 44, height: 44, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  insightTitle: { fontSize: 16, fontWeight: '700' },
  insightSub: { fontSize: 13, marginTop: 4, lineHeight: 18 },
  insightRingCol: { alignItems: 'center', gap: 6 },
  insightRing: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center' },
  ringNum: { fontSize: 13, fontWeight: '800' },
  ringLabel: { fontSize: 11, textAlign: 'center' },

  viewAllRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 14,
    borderTopWidth: 1,
  },

  // STREAK ROW
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  streakIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  streakTitle: { fontSize: 15, fontWeight: '700' },
  streakSub: { fontSize: 13, marginTop: 2 },
  streakNum: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  streakUnit: { fontSize: 11, marginTop: -2 },
});

export default ProgressScreen;
