import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import {
  Sparkles, Moon, Play, ChevronRight, Wind, Leaf,
  Heart, Target,
} from './Icons';

const { width: W } = Dimensions.get('window');

// ── inline icons not in Icons.tsx ─────────────────────────────────────────────
const BrainIcon = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C9.5 2 8 3.5 8 5c-2.5 0-4 1.5-4 4 0 1.5.8 2.8 2 3.5C6 14 7.5 15.5 9 16v3h6v-3c1.5-.5 3-2 3-3.5 1.2-.7 2-2 2-3.5 0-2.5-1.5-4-4-4 0-1.5-1.5-3-4-3z" fill={color} opacity={0.9} />
  </Svg>
);

const BoltIcon = ({ size = 22, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} />
  </Svg>
);

const LightbulbIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6H9c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 17v1a3 3 0 0 0 6 0v-1" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const BookIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </Svg>
);

const MusicIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M9 18V6l12-2v12" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.8" />
    <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth="1.8" />
  </Svg>
);

const RecoveryIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </Svg>
);

const InspirationIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </Svg>
);

// ── greeting helper ────────────────────────────────────────────────────────────
const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ─────────────────────────────────────────────────────────────────────────────
export default function SleepScreen() {
  const navigation = useNavigation<any>();
  const { images, mode } = useTheme();
  const isNight = mode === 'night';

  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { key: 'overthinking', label: 'Overthinking', Icon: BrainIcon,   color: '#8B5CF6' },
    { key: 'tired',        label: 'Tired',         Icon: Moon,        color: '#6366F1' },
    { key: 'calm',         label: 'Need Calm',     Icon: Leaf,        color: '#10B981' },
    { key: 'emotional',    label: 'Emotional',     Icon: Heart,       color: '#F472B6' },
    { key: 'low-energy',   label: 'Low Energy',    Icon: BoltIcon,    color: '#F59E0B' },
    { key: 'focus',        label: 'Need Focus',    Icon: Target,      color: '#3B82F6' },
  ];

  const categories = [
    { key: 'sleep',       label: 'Sleep',       sub: 'Fall asleep faster\nand enjoy deep rest.',   Icon: Moon,           count: '24+', color: '#6366F1', soft: 'rgba(99,102,241,0.18)' },
    { key: 'calm',        label: 'Calm',        sub: 'Soothe your mind\nand find inner peace.',   Icon: Leaf,           count: '18+', color: '#10B981', soft: 'rgba(16,185,129,0.18)' },
    { key: 'recovery',    label: 'Recovery',    sub: 'Recharge your body\nand mind.',             Icon: RecoveryIcon,   count: '16+', color: '#F472B6', soft: 'rgba(244,114,182,0.18)' },
    { key: 'inspiration', label: 'Inspiration', sub: 'Uplifting stories and\npositive mindset.',  Icon: InspirationIcon,count: '20+', color: '#F59E0B', soft: 'rgba(245,158,11,0.18)' },
    { key: 'focus',       label: 'Focus',       sub: 'Improve concentration\nand mental clarity.',Icon: Target,         count: '15+', color: '#3B82F6', soft: 'rgba(59,130,246,0.18)' },
  ];

  const popular = [
    { key: 'rain',    title: 'Rain on Window',    sub: 'Relaxing Rain',       duration: '30 min', color: '#1e3a5f' },
    { key: 'story',   title: 'Deep Sleep Story',  sub: 'The Hidden Valley',   duration: '25 min', color: '#1a3328' },
    { key: 'flute',   title: 'Healing Flute',     sub: 'Indian Classical',    duration: '20 min', color: '#3d2a00' },
    { key: 'letting', title: 'Letting Go',        sub: 'Bedtime Therapy',     duration: '12 min', color: '#1a1a3e' },
    { key: 'gratitude',title: 'Gratitude',        sub: 'Reflection',          duration: '15 min', color: '#2a1a3e' },
  ];

  const planSteps = [
    { label: 'Relaxing\nMusic', mins: '10 min', Icon: MusicIcon,   color: '#8B5CF6' },
    { label: 'Calm\nTherapy',  mins: '12 min', Icon: Wind,        color: '#8B5CF6' },
    { label: 'Positive\nStory',mins: '10 min', Icon: BookIcon,    color: '#10B981' },
  ];

  const BG = isNight ? '#0B1024' : '#F8F9FF';
  const CARD = isNight ? '#161B33' : '#FFFFFF';
  const BORDER = isNight ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const TEXT = isNight ? '#E8E9F3' : '#0F172A';
  const MUTED = isNight ? '#8B92B0' : '#6B7280';
  const PURPLE = '#8B5CF6';
  const PURPLE_SOFT = isNight ? 'rgba(139,92,246,0.18)' : '#EDE9FE';

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: TEXT }]}>{getGreeting()}, Arjun 🌿</Text>
            <Text style={[s.greetingSub, { color: MUTED }]}>Take a break. You deserve to rest.</Text>
          </View>
          <View style={[s.streakPill, { backgroundColor: CARD, borderColor: BORDER }]}>
            <Heart size={14} color={PURPLE} filled />
            <View>
              <Text style={[s.streakLabel, { color: MUTED }]}>Streak</Text>
              <Text style={[s.streakVal, { color: PURPLE }]}>12 days</Text>
            </View>
          </View>
        </View>

        {/* ── MOOD CHECK ── */}
        <Text style={[s.sectionTitle, { color: TEXT, paddingHorizontal: 20, marginBottom: 14 }]}>
          How are you feeling right now?
        </Text>
        <View style={s.moodGrid}>
          {moods.map((m) => {
            const active = selectedMood === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                activeOpacity={0.8}
                onPress={() => setSelectedMood(active ? null : m.key)}
                style={[
                  s.moodChip,
                  { backgroundColor: active ? m.color : CARD, borderColor: active ? m.color : BORDER },
                ]}
              >
                <m.Icon size={20} color={active ? '#fff' : m.color} />
                <Text style={[s.moodLabel, { color: active ? '#fff' : TEXT }]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── RECOMMENDED HERO ── */}
        <ImageBackground
          source={images.sleepHero}
          style={s.heroCard}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={[s.heroOverlay, { backgroundColor: isNight ? 'rgba(8,12,40,0.55)' : 'rgba(0,0,0,0.35)' }]} />
          <View style={s.heroContent}>
            <View style={s.recPill}>
              <Sparkles size={13} color={PURPLE} />
              <Text style={[s.recPillText, { color: '#fff' }]}>Recommended for you</Text>
            </View>
            <Text style={s.heroTitle}>Calm the Mind</Text>
            <Text style={s.heroMeta}>12 min  •  Guided Audio</Text>
            <Text style={s.heroDesc}>Helps you release stress and{'\n'}relax deeply.</Text>
            <TouchableOpacity
              style={s.heroBtn}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('BreathingSession', { id: 'calm-mind', title: 'Calm the Mind' })}
            >
              <Play size={13} color="#fff" />
              <Text style={s.heroBtnText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ── EXPLORE REST ── */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionTitle, { color: TEXT }]}>Explore Rest</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {categories.map((c) => (
            <TouchableOpacity
              key={c.key}
              activeOpacity={0.85}
              style={[s.catCard, { backgroundColor: isNight ? '#1A2040' : CARD, borderColor: BORDER }]}
            >
              <View style={[s.catIcon, { backgroundColor: c.soft }]}>
                <c.Icon size={22} color={c.color} />
              </View>
              <Text style={[s.catTitle, { color: TEXT }]}>{c.label}</Text>
              <Text style={[s.catSub, { color: MUTED }]}>{c.sub}</Text>
              <TouchableOpacity style={[s.catFooter]} activeOpacity={0.7}>
                <Text style={[s.catCount, { color: c.color }]}>{c.count} sessions</Text>
                <ChevronRight size={13} color={c.color} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── POPULAR RIGHT NOW ── */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionTitle, { color: TEXT }]}>Popular Right Now</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {popular.map((p) => (
            <TouchableOpacity key={p.key} activeOpacity={0.88} style={s.popCard}>
              <View style={[s.popBg, { backgroundColor: p.color }]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{p.duration}</Text>
                </View>
                <TouchableOpacity
                  style={s.popPlay}
                  onPress={() => navigation.navigate('BreathingSession', { id: p.key, title: p.title })}
                >
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={s.popInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{p.title}</Text>
                  <Text style={[s.popSub, { color: MUTED }]}>{p.sub}</Text>
                </View>
                <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Heart size={16} color={MUTED} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── REST PLAN FOR TODAY ── */}
        <View style={[s.planCard, { backgroundColor: CARD, borderColor: BORDER }]}>
          <View style={s.planHeader}>
            <View style={[s.planIcon, { backgroundColor: PURPLE_SOFT }]}>
              <Moon size={20} color={PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.planTitle, { color: TEXT }]}>Wind Down Plan</Text>
              <Text style={[s.planMeta, { color: MUTED }]}>3 steps  •  32 min</Text>
            </View>
          </View>
          <View style={s.planSteps}>
            {planSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <View style={s.planStep}>
                  <View style={[s.planStepIcon, { backgroundColor: PURPLE_SOFT }]}>
                    <step.Icon size={18} color={step.color} />
                  </View>
                  <Text style={[s.planStepLabel, { color: TEXT }]}>{step.label}</Text>
                  <Text style={[s.planStepMins, { color: MUTED }]}>{step.mins}</Text>
                </View>
                {i < planSteps.length - 1 && (
                  <View style={[s.planDash, { borderColor: BORDER }]} />
                )}
              </React.Fragment>
            ))}
          </View>
          <TouchableOpacity
            style={[s.planBtn, { backgroundColor: PURPLE }]}
            activeOpacity={0.88}
            onPress={() => navigation.navigate('BreathingSession', { id: 'wind-down', title: 'Wind Down Plan' })}
          >
            <Text style={s.planBtnText}>Start Plan</Text>
          </TouchableOpacity>
        </View>

        {/* ── INSIGHT OF THE DAY ── */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[s.insightRow, { backgroundColor: CARD, borderColor: BORDER }]}
        >
          <View style={[s.insightIcon, { backgroundColor: 'rgba(245,158,11,0.15)' }]}>
            <LightbulbIcon size={20} color="#F59E0B" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[s.insightLabel, { color: MUTED }]}>Insight of the Day</Text>
            <Text style={[s.insightText, { color: TEXT }]}>A relaxed mind creates a peaceful sleep.</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text style={[s.linkText, { color: PURPLE }]}>Learn more</Text>
            <ChevronRight size={14} color={PURPLE} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const CARD_W = W * 0.42;
const POP_W = W * 0.42;

const s = StyleSheet.create({
  root: { flex: 1 },

  // header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  greetingSub: { fontSize: 13, marginTop: 3 },
  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1,
  },
  streakLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  streakVal: { fontSize: 13, fontWeight: '800' },

  // mood
  moodGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    paddingHorizontal: 20, marginBottom: 22,
  },
  moodChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1,
    minWidth: '30%', flex: 1,
  },
  moodLabel: { fontSize: 13, fontWeight: '600' },

  // hero
  heroCard: { marginHorizontal: 20, height: 280, borderRadius: 20, overflow: 'hidden', marginBottom: 28 },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { flex: 1, padding: 22, justifyContent: 'flex-end' },
  recPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', backgroundColor: 'rgba(139,92,246,0.35)',
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, marginBottom: 10,
  },
  recPillText: { fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
  heroMeta: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 8, lineHeight: 20 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start',
    marginTop: 16, backgroundColor: '#8B5CF6',
    paddingVertical: 12, paddingHorizontal: 22, borderRadius: 999,
    shadowColor: '#8B5CF6', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  heroBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // section row
  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  linkText: { fontSize: 14, fontWeight: '600' },

  // categories
  catCard: {
    width: CARD_W, borderRadius: 16, borderWidth: 1,
    padding: 14, marginBottom: 22,
  },
  catIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  catTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  catSub: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  catFooter: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 12 },
  catCount: { fontSize: 12, fontWeight: '700' },

  // popular
  popCard: { width: POP_W, marginBottom: 22 },
  popBg: {
    width: '100%', height: 140, borderRadius: 14,
    overflow: 'hidden', justifyContent: 'space-between',
    padding: 10,
  },
  popDurationBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
  },
  popDuration: { fontSize: 11, color: '#fff', fontWeight: '700' },
  popPlay: {
    alignSelf: 'flex-end',
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  popInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 2 },
  popTitle: { fontSize: 13, fontWeight: '700' },
  popSub: { fontSize: 11, marginTop: 2 },

  // plan
  planCard: {
    marginHorizontal: 20, marginBottom: 16,
    borderRadius: 20, borderWidth: 1, padding: 18,
  },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  planIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontSize: 16, fontWeight: '800' },
  planMeta: { fontSize: 13, marginTop: 2 },
  planSteps: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  planStep: { flex: 1, alignItems: 'center', gap: 6 },
  planStepIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  planStepLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  planStepMins: { fontSize: 10, textAlign: 'center' },
  planDash: {
    width: 24, borderTopWidth: 1.5, borderStyle: 'dashed',
    marginBottom: 24,
  },
  planBtn: {
    borderRadius: 999, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#8B5CF6', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  planBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // insight
  insightRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 12,
    borderRadius: 16, borderWidth: 1, padding: 14,
  },
  insightIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  insightLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  insightText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },
});
