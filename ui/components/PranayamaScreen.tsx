import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useNotifications } from '../hooks/useNotifications';
import { useReflection } from '../hooks/useReflection';
import { useStreakStorage } from '../hooks/useStreakStorage';
import { useTheme } from '../hooks/useTheme';
import { getMoodState, getRecommendations } from '../utils/moodRecommendations';
import { computeReflectionProgress, moodLabel } from '../utils/reflectionProgress';
import { getSessionMedia } from '../utils/sessionMedia';
import { Heart } from './Icons';
import StreakCelebration from './StreakCelebration';

const { width: SCREEN_W } = Dimensions.get('window');

// ── tiny inline icons ──────────────────────────────────────────────────────────
const BrainIcon = ({ size = 22, color = '#FB923C' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C9.5 2 8 3.5 8 5c-2.5 0-4 1.5-4 4 0 1.5.8 2.8 2 3.5C6 14 7.5 15.5 9 16v3h6v-3c1.5-.5 3-2 3-3.5 1.2-.7 2-2 2-3.5 0-2.5-1.5-4-4-4 0-1.5-1.5-3-4-3z" fill={color} />
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
  const { colors, mode } = useTheme();
  const { data: reflectionData } = useReflection();

  const GREEN = '#1B5E20';
  const GREEN_SOFT = '#E8F5E9';
  const GREEN_MED = '#2E7D32';
  const isNight = mode === 'night';

  const BG       = isNight ? '#0B1024' : '#FAFAF7';
  const CARD     = isNight ? '#161B33' : '#FFFFFF';
  const CARD_ALT = isNight ? '#1A2040' : '#F9FAFB';
  const BORDER   = isNight ? 'rgba(255,255,255,0.08)' : '#E5E7EB';
  const BORDER_L = isNight ? 'rgba(255,255,255,0.06)' : '#F1F5F9';
  const TEXT     = isNight ? '#E8E9F3' : '#0F172A';
  const MUTED    = isNight ? '#8B92B0' : '#6B7280';
  const TILE_DONE = isNight ? 'rgba(16,185,129,0.15)' : '#F0FDF4';
  const TILE_DONE_BORDER = isNight ? 'rgba(134,239,172,0.25)' : '#86EFAC';

  // ── recommendation completion tracking ──
  const moodState = reflectionData
    ? getMoodState(reflectionData.mood, reflectionData.energy, reflectionData.sleep)
    : 'NEUTRAL';
  const recGroups = useMemo(() => getRecommendations(moodState), [moodState]);

  // ── Today's State, derived from this morning's reflection ──
  const reflection = reflectionData ? computeReflectionProgress(reflectionData) : null;
  const to10 = (n: number) => Math.max(1, Math.round(n / 10));
  // Stress is the inverse of mood positivity (calmer mood → lower stress).
  const stressScore = reflection ? 100 - reflection.mood : 0;
  // For "good = high" metrics (energy/sleep): green when high, orange when low.
  const upLevel = (score: number) => {
    if (score >= 70) return { label: 'High', color: GREEN_MED };
    if (score >= 40) return { label: 'Moderate', color: '#FB923C' };
    return { label: 'Low', color: '#FB923C' };
  };
  // For stress (high = bad): green when low, red when high.
  const stressLevel = (score: number) => {
    if (score >= 66) return { label: 'High', color: '#EF4444' };
    if (score >= 40) return { label: 'Moderate', color: '#FB923C' };
    return { label: 'Low', color: GREEN_MED };
  };

  const totalItems = useMemo(
    () => recGroups.reduce((n, g) => n + g.items.length, 0),
    [recGroups],
  );

  const { data: streakData, markDayComplete, seedTestData } = useStreakStorage();

  // time-based progress: 0–1 per item id
  const [timeProgress, setTimeProgress] = useState<Record<string, number>>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(1);
  const celebrationFired = useRef(false);

  // tracks the session currently playing
  const activeSession = useRef<{ id: string; startedAt: number; durationSecs: number } | null>(null);

  // parse "6 min" → 360 seconds
  const parseDuration = (meta: string): number => {
    const m = meta.match(/(\d+(?:\.\d+)?)\s*min/i);
    return m ? Math.round(parseFloat(m[1]) * 60) : 300;
  };

  const doneCount = useMemo(
    () => Object.values(timeProgress).filter((p) => p >= 1).length,
    [timeProgress],
  );
  const allDone = totalItems > 0 && doneCount === totalItems;
  useNotifications(allDone);
  const [showWhyModal, setShowWhyModal] = useState(false);

  // when screen regains focus, settle elapsed time for the active session
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const sess = activeSession.current;
      if (!sess) return;
      const elapsed = (Date.now() - sess.startedAt) / 1000;
      const ratio = Math.min(elapsed / sess.durationSecs, 1);
      activeSession.current = null;

      setTimeProgress((prev) => {
        const next = { ...prev, [sess.id]: Math.max(prev[sess.id] ?? 0, ratio) };
        const newDone = Object.values(next).filter((p) => p >= 1).length;
        if (totalItems > 0 && newDone === totalItems && !celebrationFired.current) {
          celebrationFired.current = true;
          markDayComplete(totalItems, totalItems, totalItems * 6)
            .then((updated) => { setCelebrationStreak(updated.currentStreak); setShowCelebration(true); })
            .catch(() => { setCelebrationStreak(1); setShowCelebration(true); });
        }
        return next;
      });
    });
    return unsubscribe;
  }, [navigation, totalItems]);

  const startSession = (id: string, meta: string, type: string, title: string) => {
    activeSession.current = { id, startedAt: Date.now(), durationSecs: parseDuration(meta) };
    const media = getSessionMedia(id, type as any);
    // music/video/meditation types → NowPlaying with dynamic video+audio
    // breathing types → BreathingSession (animated guide)
    if (type === 'music' || type === 'video' || type === 'meditation') {
      navigation.navigate('NowPlaying' as any, {
        id,
        title,
        videoSource: media.video,
        audioSource: media.audio,
        mediaLabel: media.label,
      });
    } else {
      navigation.navigate('BreathingSession' as any, { id, title });
    }
  };

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={s.header}>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[s.headerTitle, { color: GREEN }]}>Your Daily Flow</Text>
              <Text style={{ fontSize: 22 }}>🌿</Text>
            </View>
            <Text style={[s.headerSub, { color: MUTED }]}>Breathe mindfully. Live fully.</Text>
          </View>
        </View>

        {/* ── HERO CHARACTER IMAGE ── */}
        <View style={s.heroWrap}>
          <Image
            source={isNight
              ? require('../assets/images/pranyama-actor-night.png')
              : require('../assets/images/pranayama-character-day.png')}
            style={s.heroImg}
            resizeMode="cover"
          />
        </View>

        {/* ── HOW YOU'RE FEELING (from morning reflection) ── */}
        <View style={s.section}>
          <View style={[s.sectionRow, { paddingHorizontal: 20 }]}>
            <Text style={[s.sectionTitle, { color: TEXT }]}>How You're Feeling</Text>
          </View>

          {reflection ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
              {/* Stress (inverse of mood) */}
              <View style={[s.statCard, { marginLeft: 20, backgroundColor: CARD, borderColor: BORDER_L }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <BrainIcon size={18} color={stressLevel(stressScore).color} />
                  <Text style={[s.statLabel, { color: MUTED }]}>Stress</Text>
                </View>
                <Text style={[s.statStatus, { color: stressLevel(stressScore).color }]}>
                  {stressLevel(stressScore).label}
                </Text>
                <Text style={[s.statValue, { color: TEXT }]}>{to10(stressScore)}/10</Text>
                <Sparkline color={stressLevel(stressScore).color} />
              </View>

              {/* Mood */}
              <View style={[s.statCard, { backgroundColor: CARD, borderColor: BORDER_L }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Heart size={18} color={colors.statPurple} />
                  <Text style={[s.statLabel, { color: MUTED }]}>Mood</Text>
                </View>
                <Text style={[s.statStatus, { color: colors.statPurple }]} numberOfLines={1}>
                  {moodLabel(reflectionData!.mood)}
                </Text>
                <Text style={[s.statValue, { color: TEXT }]}>{to10(reflection.mood)}/10</Text>
                <Sparkline color={colors.statPurple} />
              </View>

              {/* Energy */}
              <View style={[s.statCard, { marginRight: 20, backgroundColor: CARD, borderColor: BORDER_L }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <BoltIcon size={18} color={upLevel(reflection.energy).color} />
                  <Text style={[s.statLabel, { color: MUTED }]}>Energy</Text>
                </View>
                <Text style={[s.statStatus, { color: upLevel(reflection.energy).color }]}>
                  {upLevel(reflection.energy).label}
                </Text>
                <Text style={[s.statValue, { color: TEXT }]}>{to10(reflection.energy)}/10</Text>
                <Sparkline color={upLevel(reflection.energy).color} />
              </View>
            </ScrollView>
          ) : (
            <View
              style={[s.statCard, {
                marginHorizontal: 20, marginTop: 12, width: undefined,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                backgroundColor: CARD, borderColor: BORDER_L,
              }]}
            >
              <Text style={{ fontSize: 28 }}>🌅</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.statStatus, { color: TEXT }]}>No reflection yet</Text>
                <Text style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
                  Complete today's reflection from the Home screen to see your stress, mood and energy.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── TODAY'S RECOMMENDATION ── */}
        <View style={[s.section, { paddingHorizontal: 20 }]}>
          <View style={s.sectionRow}>
            <View>
              <Text style={[s.sectionTitle, { color: TEXT }]}>Today's Recommendation</Text>
              <Text style={[s.linkText, { color: GREEN_MED, marginTop: 3 }]}>
                {doneCount}/{totalItems} done
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowWhyModal(true)}
              style={[s.whyBtn, { backgroundColor: isNight ? 'rgba(46,125,50,0.15)' : '#E8F5E9', borderColor: isNight ? 'rgba(46,125,50,0.3)' : '#A7F3D0' }]}
              activeOpacity={0.75}
            >
              <Text style={[s.whyBtnText, { color: GREEN_MED }]}>Why this? 💡</Text>
            </TouchableOpacity>
          </View>

 

          <View style={[s.recCard, { backgroundColor: CARD, borderColor: BORDER }]}>
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
                const groupDone = g.items.every((it) => (timeProgress[it.id] ?? 0) >= 1);
                return (
                  <View key={g.label} style={{ marginTop: gi === 0 ? 0 : 18 }}>
                    <View style={s.recGroupHeader}>
                      <GIcon size={16} color={groupIconColor(g.label)} />
                      <Text style={[s.recGroupLabel, { color: TEXT }]}>{g.label}</Text>
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
                        const progress = timeProgress[it.id] ?? 0;
                        const isDone = progress >= 1;
                        // SVG progress ring constants
                        const R = 13; const CIRC = 2 * Math.PI * R;
                        return (
                          <TouchableOpacity
                            key={it.id}
                            activeOpacity={0.85}
                            onPress={() => startSession(it.id, it.meta, it.type, it.title)}
                            style={[s.recTile, { backgroundColor: isDone ? TILE_DONE : CARD, borderColor: isDone ? TILE_DONE_BORDER : BORDER_L }]}
                          >
                            {/* time-based progress ring badge */}
                            <View style={s.recRingWrap}>
                              <Svg width={30} height={30}>
                                <Circle cx={15} cy={15} r={R} stroke={BORDER} strokeWidth={2.5} fill="none" />
                                <Circle
                                  cx={15} cy={15} r={R}
                                  stroke={isDone ? GREEN_MED : tint}
                                  strokeWidth={2.5} fill="none"
                                  strokeDasharray={CIRC}
                                  strokeDashoffset={CIRC * (1 - progress)}
                                  strokeLinecap="round"
                                  transform="rotate(-90 15 15)"
                                />
                                {isDone && (
                                  <Path
                                    d="M10 15l3.5 3.5L20 11"
                                    stroke={GREEN_MED} strokeWidth={2}
                                    strokeLinecap="round" strokeLinejoin="round"
                                    fill="none"
                                  />
                                )}
                              </Svg>
                            </View>

                            <View style={[s.recTileIcon, { backgroundColor: tintSoft }, isDone && { opacity: 0.5 }]}>
                              <Icon size={22} color={tint} />
                            </View>
                            <Text
                              style={[s.recTileTitle, { color: isDone ? MUTED : TEXT }, isDone && s.recTileTitleDone]}
                              numberOfLines={2}
                            >
                              {it.title}
                            </Text>
                            <View style={s.recTileFoot}>
                              <Text style={[s.recTileMeta, { color: MUTED }]}>{it.meta}</Text>
                              <TouchableOpacity
                                onPress={() => startSession(it.id, it.meta, it.type, it.title)}
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
            <Text style={[s.sectionTitle, { color: TEXT }]}>Your Journey</Text>
            <TouchableOpacity
              onPress={seedTestData}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}
            >
              <Text style={[s.linkText, { color: GREEN_MED }]}>Seed test data</Text>
            </TouchableOpacity>
          </View>

          {/* streak summary row */}
          <View style={[s.journeyCard, { backgroundColor: CARD, borderColor: BORDER }]}>
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
                  <Text style={[s.ringLabel, { color: MUTED }]}>Day{'\n'}Streak</Text>
                </View>
              </View>
            </View>

            {/* stats */}
            <View style={{ flex: 1, paddingHorizontal: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[s.journeyMsg, { color: TEXT }]}>
                  {streakData.currentStreak >= 7
                    ? 'On fire! 🔥'
                    : streakData.currentStreak > 0
                    ? "You're doing amazing!"
                    : 'Start your streak today!'}
                </Text>
                <Text style={{ fontSize: 14 }}>🌿</Text>
              </View>
              <Text style={[s.journeyHint, { color: MUTED }]}>
                Best streak: {streakData.longestStreak} day{streakData.longestStreak !== 1 ? 's' : ''}
              </Text>
              <Text style={[s.weekMin, { color: TEXT }]}>
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
                            backgroundColor: rec.completed ? GREEN_MED : BORDER,
                            borderRadius: 4,
                          }}
                        />
                        <Text style={{ fontSize: 10, color: MUTED }}>{dayLabel}</Text>
                      </View>
                    );
                  })}
                  {/* fill empty slots if fewer than 7 records */}
                  {Array.from({ length: Math.max(0, 7 - last7.length) }).map((_, i) => (
                    <View key={`empty-${i}`} style={{ alignItems: 'center', gap: 3 }}>
                      <View style={{ width: 18, height: 4, backgroundColor: BORDER, borderRadius: 4 }} />
                      <Text style={{ fontSize: 10, color: MUTED }}>-</Text>
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
              <Text style={[s.sectionTitle, { color: TEXT }]}>Ask Your Guru</Text>
              <Text style={[s.guruSub, { color: MUTED }]}>Your personal AI coach</Text>
            </View>
          </View>

          <View style={s.guruRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
              {GURU_PROMPTS.map((p, i) => (
                <TouchableOpacity
                  key={i}
                  style={[s.promptChip, { borderColor: BORDER, backgroundColor: CARD }]}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('AICompanionChat', { mode: 'Gita Companion', prompt: p.replace('\n', ' ') })}
                >
                  <Text style={[s.promptText, { color: TEXT }]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[s.micBtn, { backgroundColor: GREEN }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('AICompanionChat', { mode: 'Gita Companion' })}
            >
              <MicIcon size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── WHY THIS RECOMMENDATION MODAL ── */}
      <Modal visible={showWhyModal} transparent animationType="slide" onRequestClose={() => setShowWhyModal(false)}>
        <View style={s.whyBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowWhyModal(false)} />
          <View style={[s.whySheet, { backgroundColor: CARD }]}>
            <View style={[s.whyHandle, { backgroundColor: BORDER }]} />
            <Text style={[s.whySheetTitle, { color: TEXT }]}>Why this recommendation? 💡</Text>
            <Text style={[s.whySheetSub, { color: MUTED }]}>
              Based on your morning check-in, here's what we picked for you today.
            </Text>
            {recGroups.map((g) => (
              <View key={g.label} style={[s.whyGroup, { borderColor: BORDER }]}>
                <Text style={[s.whyGroupLabel, { color: GREEN_MED }]}>{g.label}</Text>
                {g.items.map((it) => (
                  <View key={it.id} style={s.whyItem}>
                    <View style={[s.whyDot, { backgroundColor: GREEN_MED }]} />
                    <View style={{ flex: 1 }}>
                      <Text style={[s.whyItemTitle, { color: TEXT }]}>{it.title}</Text>
                      <Text style={[s.whyItemMeta, { color: MUTED }]}>{it.meta}  ·  {it.type}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))}
            <TouchableOpacity
              style={[s.whyCloseBtn, { backgroundColor: GREEN_MED }]}
              activeOpacity={0.88}
              onPress={() => setShowWhyModal(false)}
            >
              <Text style={s.whyCloseBtnText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <StreakCelebration
        visible={showCelebration}
        streakCount={celebrationStreak}
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
  recRingWrap: {
    position: 'absolute',
    top: 6, right: 6,
    zIndex: 2,
  },
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

  // why this recommendation
  whyBtn: {
    paddingVertical: 7, paddingHorizontal:  2,
    borderRadius: 10, borderWidth: 1,
  },
  whyBtnText: { fontSize: 13, fontWeight: '700' },

  whyBackdrop: {
    flex: 2, justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  whySheet: {
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 44,
    maxHeight: '80%',
  },
  whyHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  whySheetTitle: { fontSize: 19, fontWeight: '800', marginBottom: 6 },
  whySheetSub: { fontSize: 13, lineHeight: 19, marginBottom: 18 },
  whyGroup: { borderTopWidth: 1, paddingTop: 14, marginBottom: 14 },
  whyGroupLabel: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 },
  whyItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  whyDot: { width: 7, height: 7, borderRadius: 4, marginTop: 5 },
  whyItemTitle: { fontSize: 14, fontWeight: '700' },
  whyItemMeta: { fontSize: 12, marginTop: 2 },
  whyCloseBtn: {
    borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 6,
  },
  whyCloseBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});
