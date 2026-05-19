import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle, Rect } from 'react-native-svg';
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import {
  Sparkles,
  Flame,
  Wind,
  Moon,
  HeartPulse,
  ChevronRight,
} from './Icons';

const Ring = ({
  value,
  max,
  color,
  size = 78,
}: {
  value: number;
  max: number;
  color: string;
  size?: number;
}) => {
  const r = (size - 8) / 2;
  const sw = 5;
  const c = 2 * Math.PI * r;
  const dash = Math.min(value / max, 1) * c;
  const cx = size / 2;
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cx} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={sw} fill="none" />
      <Circle
        cx={cx} cy={cx} r={r}
        stroke={color} strokeWidth={sw} fill="none"
        strokeDasharray={c} strokeDashoffset={c - dash}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cx})`}
      />
    </Svg>
  );
};

const RingStat = ({
  Icon, value, total, label, color,
}: {
  Icon: any; value: string; total: string; label: string; color: string;
}) => (
  <View style={styles.ringWrap}>
    <View style={{ width: 78, height: 78, alignItems: 'center', justifyContent: 'center' }}>
      <Ring value={parseFloat(value)} max={parseFloat(total)} color={color} />
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Icon size={16} color={color} />
        <Text style={styles.ringValue}>{value}</Text>
      </View>
    </View>
    <Text style={styles.ringLabel}>{label}</Text>
    <Text style={styles.ringTotal}>/ {total}</Text>
  </View>
);

const weekBars = [
  { day: 'M', val: 0.4 },
  { day: 'T', val: 0.7 },
  { day: 'W', val: 0.5 },
  { day: 'T', val: 0.9 },
  { day: 'F', val: 0.6 },
  { day: 'S', val: 0.85 },
  { day: 'S', val: 0.45 },
];

const ProgressScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={warm.screen}>
      <ScrollView contentContainerStyle={warm.scroll} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={warm.topRow}>
          <View>
            <Text style={warm.overline}>Your journey</Text>
            <Text style={[warm.h1, { marginTop: 4 }]}>Progress</Text>
            <Text style={warm.body}>See your journey unfold.</Text>
          </View>
          <TouchableOpacity
            style={warm.iconBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanion', { mode: 'Confidence Coach' })}
          >
            <Sparkles size={18} color={COLORS.primaryGold} />
          </TouchableOpacity>
        </View>

        {/* STREAK HERO */}
        <View style={warm.goldCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={styles.streakBadge}>
              <Flame size={22} color={COLORS.deepBrown} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={warm.overline}>Current streak</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                <Text style={styles.streakNum}>12</Text>
                <Text style={styles.streakUnit}> days</Text>
              </View>
              <Text style={[warm.bodySm, { marginTop: 2 }]}>
                Your longest yet — keep the rhythm.
              </Text>
            </View>
          </View>
        </View>

        {/* RINGS */}
        <View style={[warm.card, { marginTop: 14 }]}>
          <Text style={warm.overline}>This week</Text>
          <View style={styles.ringsRow}>
            <RingStat Icon={Wind} value="68" total="100" label="Breath min" color={COLORS.primaryGold} />
            <RingStat Icon={Moon} value="6" total="7" label="Sleep eve" color={COLORS.mutedTeal} />
            <RingStat Icon={HeartPulse} value="82" total="100" label="Calm score" color={COLORS.lavender} />
          </View>
        </View>

        {/* MOOD TREND */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Mood trend</Text>
          <Text style={warm.seeAll}>This week</Text>
        </View>
        <View style={[warm.card, styles.chartCard]}>
          <Svg width="100%" height="120" viewBox="0 0 280 120">
            <Rect x="0" y="80" width="280" height="0.5" fill="rgba(212,175,55,0.1)" />
            <Rect x="0" y="40" width="280" height="0.5" fill="rgba(212,175,55,0.1)" />
            {weekBars.map((b, i) => {
              const x = 10 + i * 38;
              const h = b.val * 90;
              return (
                <Rect
                  key={i}
                  x={x}
                  y={110 - h}
                  width={22}
                  height={h}
                  rx={6}
                  fill={i === 3 ? COLORS.primaryGold : 'rgba(212,175,55,0.45)'}
                />
              );
            })}
          </Svg>
          <View style={styles.dayLabels}>
            {weekBars.map((b, i) => (
              <Text key={i} style={styles.dayLabel}>{b.day}</Text>
            ))}
          </View>
        </View>

        {/* WEEKLY INSIGHT */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Weekly insights</Text>
        </View>
        <View style={warm.card}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
            <View style={styles.insightBadge}>
              <Sparkles size={16} color={COLORS.primaryGold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={warm.h3}>Evenings are your sanctuary</Text>
              <Text style={[warm.bodySm, { marginTop: 6, lineHeight: 19 }]}>
                Six of seven sessions this week happened after sunset.
                Try a short morning breath to bookend your day.
              </Text>
            </View>
          </View>
        </View>

        {/* WINS */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Wins this week</Text>
        </View>
        <Win icon="🌅" title="3 morning sessions" sub="A new pattern is forming." />
        <Win icon="🌙" title="Slept by 11pm 4 nights" sub="Body clock is settling." />
        <Win icon="🪷" title="Tried Deep Healing" sub="You went deeper than usual." />

        {/* CONTINUE */}
        <TouchableOpacity
          style={[styles.continueCard, { marginTop: 16 }]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Breathe')}
        >
          <View style={{ flex: 1 }}>
            <Text style={warm.overline}>Continue</Text>
            <Text style={styles.continueTitle}>Anxiety Reset · Day 4</Text>
            <Text style={[warm.bodySm, { marginTop: 4 }]}>Pick up where you left off.</Text>
          </View>
          <ChevronRight size={20} color={COLORS.primaryGold} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Win = ({ icon, title, sub }: { icon: string; title: string; sub: string }) => (
  <View style={styles.winRow}>
    <Text style={styles.winIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={styles.winTitle}>{title}</Text>
      <Text style={styles.winSub}>{sub}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  streakBadge: {
    width: 52, height: 52, borderRadius: 16,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center', justifyContent: 'center',
  },
  streakNum: { color: COLORS.textPrimary, fontSize: 36, fontWeight: '700', letterSpacing: -1 },
  streakUnit: { color: COLORS.textSecondary, fontSize: 14 },

  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  ringWrap: { alignItems: 'center', flex: 1 },
  ringValue: { color: COLORS.textPrimary, fontWeight: '700', fontSize: 13, marginTop: 1 },
  ringLabel: { color: COLORS.textPrimary, fontSize: 12, fontWeight: '600', marginTop: 8 },
  ringTotal: { color: COLORS.textSecondary, fontSize: 11, marginTop: 1 },

  chartCard: { paddingTop: 18, paddingBottom: 8 },
  dayLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  dayLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '500' },

  insightBadge: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  winRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.control,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.08)',
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  winIcon: { fontSize: 24 },
  winTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '600' },
  winSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },

  continueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    padding: 18,
    gap: 12,
  },
  continueTitle: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700', marginTop: 2 },
});

export default ProgressScreen;
