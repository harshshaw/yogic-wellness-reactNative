import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useAppMusic } from '../hooks/useAppMusic';
import { useAuth } from '../hooks/useAuth';
import { useReflection } from '../hooks/useReflection';
import { useTheme } from '../hooks/useTheme';
import { COLORS, styles } from '../styles/HomeScreen.styles';
import restData from '../utils/rest-screen-plan.json';

// Nature-related soundscapes pulled from the Rest screen's data so the two
// stay in sync. We surface the "Nature" and "Rain Collection" categories.
const NATURE_EMOJI: Record<string, string> = {
  Forest: '🌲',
  Waterfall: '💦',
  'Himalayan Winds': '🏔️',
  'Ocean Waves': '🌊',
  'River Flow': '🏞️',
  'Light Rain': '🌦️',
  'Thunder Storm': '⛈️',
  'Rain on Window': '🌧️',
  'Rain in Forest': '🌳',
};

const NATURE_SOUNDS = (() => {
  const soundscapes = restData.sections.find((s) => s.id === 1);
  const cats = soundscapes?.categories ?? [];
  const wanted = cats.filter((c) => c.name === 'Nature' || c.name === 'Rain Collection');
  return wanted.flatMap((c) =>
    c.items.map((title) => ({
      title,
      sub: c.name,
      emoji: NATURE_EMOJI[title] ?? '🌿',
    }))
  );
})();

const SoundOnIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a4 4 0 0 1 0 7M19 5a9 9 0 0 1 0 14"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SoundOffIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SunIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.8} fill="none" />
    <Path
      d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const ChevronRight = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ProfileIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const JournalIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M4 4a2 2 0 0 1 2-2h11a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V4z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M8 7h6M8 11h6M8 15h3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const ReelsIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <Path d="M10 9.5v5l4.5-2.5L10 9.5z" fill={color} />
  </Svg>
);

const HeartPulseIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path
      d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CalmIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="m12 3-1.6 4.8a2 2 0 0 1-1 1L4.6 10.4l4.8 1.6a2 2 0 0 1 1 1L12 17.8l1.6-4.8a2 2 0 0 1 1-1L19.4 10.4l-4.8-1.6a2 2 0 0 1-1-1z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <Path d="M5 3v3M19 18v3M3 4h3M17 19h3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const SleepMoonIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PlayTriangle = ({ color, size = 14 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

const OmIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M7 14a4 4 0 1 1 6-3.5M13 8a3 3 0 0 1 6 0c0 2-2 3-4 3M5 18c2 0 3-1 3-3M16 16a3 3 0 1 0 3 3M14 4.5a2 2 0 1 1 1 1.8"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

type StatRingProps = {
  value: string;
  label: string;
  sub: string;
  color: string;
  progress: number;
  Icon: React.FC<{ color: string }>;
  ink?: string;
  muted?: string;
};

const StatRing = ({ value, label, sub, color, progress, Icon, ink, muted }: StatRingProps) => {
  const radius = 38;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringSvgWrap}>
        <Svg width={90} height={90}>
          <Circle
            cx="45"
            cy="45"
            r={radius}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="45"
            cy="45"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - dash}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </Svg>
        <View style={styles.ringInner}>
          <Icon color={color} />
          <Text style={[styles.ringValue, ink && { color: ink }]}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.ringLabel, ink && { color: ink }]}>{label}</Text>
      <Text style={[styles.ringSub, muted && { color: muted }]}>{sub}</Text>
    </View>
  );
};

const DAILY_INSIGHTS = [
  { quote: 'The body benefits from movement, the mind benefits from stillness.', author: 'Sakyong Mipham' },
  { quote: 'Yoga is not about touching your toes. It is what you learn on the way down.', author: 'Jigar Gor' },
  { quote: 'The quieter you become, the more you are able to hear.', author: 'Rumi' },
  { quote: 'True meditation is about being fully present — with everything that is, including discomfort.', author: 'Adyashanti' },
  { quote: 'Inhale the future, exhale the past.', author: 'Yogic Proverb' },
  { quote: 'Where attention goes, energy flows.', author: 'James Redfield' },
  { quote: 'Your task is not to seek for love, but to find all the barriers within yourself.', author: 'Rumi' },
];

const DAILY_AFFIRMATIONS = [
  'I am exactly where I need to be right now.',
  'With every breath, I release tension and invite peace.',
  'I have the strength to face whatever today brings.',
  'I am worthy of rest, joy, and wholeness.',
  'I choose to meet myself with compassion today.',
  'My mind is clear, my heart is open, my spirit is at ease.',
  'I grow stronger, calmer, and wiser with every practice.',
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { muted, toggleMuted } = useAppMusic();
  const { mode, colors, images } = useTheme();
  const { completed, data } = useReflection();
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'Friend';
  const isNight = mode === 'night';

  const dayIndex = new Date().getDay();
  const insight     = DAILY_INSIGHTS[dayIndex % DAILY_INSIGHTS.length];
  const affirmation = DAILY_AFFIRMATIONS[dayIndex % DAILY_AFFIRMATIONS.length];
  const headerIconColor = isNight ? colors.textPrimary : COLORS.deepBrown;

  // derive a recommendation from reflection data
  const recommendation = (() => {
    if (!data) return null;
    const lowEnergy = data.energy === 'low' || data.energy === 'slightly_low';
    const highEnergy = data.energy === 'high' || data.energy === 'very_high';
    const poorSleep = data.sleep === 'poor' || data.sleep === 'average';
    const calmMood = ['calm', 'neutral', 'happy'].includes(data.mood);
    if (lowEnergy || poorSleep || ['stressed', 'anxious', 'overwhelmed', 'sad'].includes(data.mood))
      return { name: 'Nadi Shodhana', meta: '6 min · Alternate Nostril · Gentle', hint: 'Calms the nervous system and restores balance after a rough night or low energy morning.' };
    if (highEnergy && calmMood)
      return { name: 'Kapalbhati', meta: '5 min · Breath of Fire · Energising', hint: 'Channel your high energy with focused breath to sharpen concentration.' };
    return { name: 'Box Breathing', meta: '5 min · 4-4-4-4 · Balancing', hint: 'Steadies mood and centers your mind for the day ahead.' };
  })();

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER WITH GURU IMAGE */}
        <ImageBackground
          source={images.homeHero}
          style={styles.header}
          imageStyle={styles.headerImage}
        >
          {isNight && (
            <View
              style={[
                styles.headerOverlay,
                { backgroundColor: 'rgba(11,16,36,0.15)' },
              ]}
            />
          )}

          <View style={styles.topBar}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
<TouchableOpacity
                activeOpacity={0.7}
                onPress={toggleMuted}
                style={localStyles.headerBtn}
              >
                {muted ? (
                  <SoundOffIcon color={headerIconColor} />
                ) : (
                  <SoundOnIcon color={headerIconColor} />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Journal')}
                style={localStyles.headerBtn}
              >
                <JournalIcon color={headerIconColor} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Reels')}
                style={localStyles.headerBtn}
              >
                <ReelsIcon color={headerIconColor} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('Profile')}
                style={localStyles.headerBtn}
              >
                <ProfileIcon color={headerIconColor} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={[styles.greeting, { color: headerIconColor }]}>
              Namaste, {firstName} 🙏
            </Text>
            <Text style={[styles.greetingSub, { color: headerIconColor }]}>
              Embrace the ancient wisdom,{'\n'}Transform your life.
            </Text>
          </View>
        </ImageBackground>

        {/* MORNING REFLECTION / TODAY'S RECOMMENDATION */}
        {!completed ? (
          <TouchableOpacity
            activeOpacity={0.85}
            style={localStyles.reflectionCard}
            onPress={() => navigation.navigate('MorningReflection')}
          >
            <View style={localStyles.reflectionIconWrap}>
              <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                <Path d="M12 2v4M4.93 7.93l2.83 2.83M2 14h4M18.07 7.93l-2.83 2.83M22 14h-4M5 19h14M8 19a4 4 0 0 1 8 0" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.reflectionTitle}>Today's Reflection</Text>
              <Text style={localStyles.reflectionSub}>
                How are you arriving today?{'\n'}Let's personalize your day.
              </Text>
            </View>
            <View style={{ alignItems: 'center', gap: 4 }}>
              <View style={localStyles.reflectionPlay}>
                <PlayTriangle color="#fff" size={16} />
              </View>
              <Text style={localStyles.reflectionPlayLabel}>Start Today's{'\n'}Reflection</Text>
            </View>
          </TouchableOpacity>
        ) : recommendation ? (
          <View style={localStyles.recCard}>
            <View style={localStyles.recTop}>
              <View style={localStyles.recIconWrap}>
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path d="M12 3v3M9 6C6 6 3 9 3 12c0 4 2 7 5 7h1v-4H7l2-3 3 3V9M15 6c3 0 6 3 6 6 0 4-2 7-5 7h-1v-4h2l-2-3-3 3V9" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </Svg>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={localStyles.recLabel}>Today's Recommendation</Text>
                <Text style={localStyles.recName}>{recommendation.name}</Text>
                <Text style={localStyles.recMeta}>{recommendation.meta}</Text>
              </View>
              <TouchableOpacity
                style={localStyles.recPlay}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('BreathingSession', { id: 'nadi', title: recommendation.name })}
              >
                <PlayTriangle color="#fff" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={localStyles.recHint}>{recommendation.hint}</Text>
          </View>
        ) : null}

       
        {/* YOUR PROGRESS CARD */}
        <View
          style={[
            styles.progressCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.progressHeader, { justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <OmIcon color={colors.accent} />
              <Text style={[styles.progressTitle, { color: colors.textPrimary }]}>
                Your Progress
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={localStyles.sectionLink}>
              <Text style={[localStyles.sectionLinkText, { color: colors.statOrange }]}>
                View all
              </Text>
              <ChevronRight color={colors.statOrange} />
            </TouchableOpacity>
          </View>

          <View style={styles.ringsRow}>
            <StatRing
              value="28"
              label="Anxiety"
              sub="/ 100"
              color={colors.statPurple}
              progress={72}
              Icon={CalmIcon}
              ink={colors.textPrimary}
              muted={colors.textSecondary}
            />
            <StatRing
              value="62"
              label="HRV"
              sub="/ 80 ms"
              color={colors.statMint}
              progress={78}
              Icon={HeartPulseIcon}
              ink={colors.textPrimary}
              muted={colors.textSecondary}
            />
            <StatRing
              value="7.4h"
              label="Sleep"
              sub="/ 8h"
              color={colors.statOrange}
              progress={92}
              Icon={SleepMoonIcon}
              ink={colors.textPrimary}
              muted={colors.textSecondary}
            />
          </View>
        </View>

        {/* TODAY'S GOAL */}
        <ImageBackground
          source={images.goalHero}
          style={styles.goalCard}
          imageStyle={styles.goalImage}
        >
          <View style={isNight ? styles.goalOverlay : localStyles.goalOverlayLight} />
          <View style={{ width: '60%' }}>
            <Text style={[styles.goalTitle, { color: isNight ? '#FFFFFF' : '#0F172A' }]}>
              Today's Goal
            </Text>
            <Text style={[styles.goalSub, { color: isNight ? 'rgba(255,255,255,0.85)' : '#475569' }]}>
              Keep going, you're doing great!
            </Text>
          </View>
          <View style={styles.goalRow}>
            <Text style={[styles.goalPercent, { color: colors.statYellow }]}>75%</Text>
            <View style={[styles.progressBar, { backgroundColor: isNight ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.08)' }]}>
              <View style={[styles.progressFill, { backgroundColor: colors.statYellow }]} />
            </View>
          </View>
        </ImageBackground>

        
 {/* NATURE THERAPY */}
 <View style={localStyles.sectionRow}>
          <View>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary, paddingHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
              Nature Therapy
            </Text>
            <Text style={[localStyles.natureSub, { color: colors.textSecondary }]}>
              Calming nature soundscapes
            </Text>
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={localStyles.natureRow}
        >
          {NATURE_SOUNDS.map((item) => (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.85}
              style={[localStyles.natureTile, { backgroundColor: isNight ? colors.cardLight : '#FFFFFF', borderColor: colors.border }]}
              onPress={() => navigation.navigate('Sleep', { autoPlay: { title: item.title, sub: item.sub } })}
            >
              <View style={[localStyles.natureIcon, { backgroundColor: 'rgba(16,185,129,0.12)' }]}>
                <Text style={{ fontSize: 26 }}>{item.emoji}</Text>
              </View>
              <Text style={[localStyles.natureTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[localStyles.natureMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                {item.sub}
              </Text>
              <View style={localStyles.naturePlay}>
                <Text style={{ fontSize: 11, color: '#10B981', fontWeight: '700' }}>▶ Play</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        

        {/* TODAY'S FOCUS */}
        <View style={localStyles.sectionRow}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, paddingHorizontal: 0, marginTop: 0, marginBottom: 0 }]}>
            Today's Focus
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={localStyles.sectionLink}>
            <Text style={[localStyles.sectionLinkText, { color: colors.statOrange }]}>
              Edit
            </Text>
            <ChevronRight color={colors.statOrange} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={localStyles.focusCardLight}
          onPress={() => navigation.navigate('Meditation')}
        >
          <View style={[localStyles.focusIconCircle, { backgroundColor: colors.statMintSoft }]}>
            <SunIcon color={colors.statMint} />
          </View>
          <View style={localStyles.focusBody}>
            <Text style={[localStyles.focusBodyTitle, { color: colors.textPrimary }]}>
              Morning Mindfulness
            </Text>
            <Text style={[localStyles.focusBodyMeta, { color: colors.textSecondary }]}>
              10 min • Meditation
            </Text>
          </View>
          <View style={[localStyles.focusPlayCircle, { backgroundColor: colors.statMintSoft }]}>
            <PlayTriangle color={colors.statMint} />
          </View>
        </TouchableOpacity>

        {/* DAILY AFFIRMATION */}
        <View style={[localStyles.affirmCard, { backgroundColor: isNight ? '#1A1040' : '#F5F3FF', borderColor: isNight ? 'rgba(139,92,246,0.25)' : '#DDD6FE' }]}>
          <Text style={localStyles.affirmTop}>✨ Daily Affirmation</Text>
          <Text style={[localStyles.affirmText, { color: colors.textPrimary }]}>"{affirmation}"</Text>
        </View>

      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // — section headers with right-aligned link —
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sectionLinkText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // — light-mode Today's Goal overlay —
  goalOverlayLight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(254,243,199,0.7)',
  },

  // — Today's Focus card (Calm-style row) —
  focusCardLight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingLeft: 14,
    paddingRight: 18,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  focusIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  focusBody: { flex: 1, marginLeft: 14 },
  focusBodyTitle: { fontSize: 16, fontWeight: '700' },
  focusBodyMeta: { fontSize: 13, marginTop: 3 },
  focusPlayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reflectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  reflectionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(124,58,237,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7C3AED',
  },
  reflectionSub: {
    fontSize: 13,
    color: '#374151',
    marginTop: 3,
    lineHeight: 18,
  },
  reflectionPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reflectionPlayLabel: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
  },

  recCard: {
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    padding: 16,
  },
  recTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  recIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(124,58,237,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  recLabel: { fontSize: 11, fontWeight: '700', color: '#7C3AED', letterSpacing: 1, textTransform: 'uppercase' },
  recName: { fontSize: 17, fontWeight: '800', color: '#0F172A', marginTop: 2 },
  recMeta: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  recPlay: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#7C3AED', alignItems: 'center', justifyContent: 'center',
  },
  recHint: { fontSize: 13, color: '#4C1D95', marginTop: 12, lineHeight: 18 },

  // quick access
  quickRow: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 18, marginBottom: 6,
  },
  quickTile: {
    flex: 1, alignItems: 'center', paddingVertical: 16,
    borderRadius: 18, borderWidth: 1, gap: 8,
  },
  quickIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: { fontSize: 12, fontWeight: '700' },

  // nature therapy
  natureSub: { fontSize: 13, marginTop: 2 },
  natureRow: { paddingHorizontal: 18, gap: 12, paddingVertical: 4 },
  natureTile: {
    width: 132, padding: 14, borderRadius: 18, borderWidth: 1, gap: 6,
  },
  natureIcon: {
    width: 52, height: 52, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  natureTitle: { fontSize: 14, fontWeight: '700' },
  natureMeta: { fontSize: 12 },
  naturePlay: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

  // insight of the day
  insightCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    marginHorizontal: 18, marginBottom: 6,
    borderRadius: 18, borderWidth: 1, padding: 16,
  },
  insightEmoji: { fontSize: 28, marginTop: 2 },
  insightQuote: { fontSize: 14, fontWeight: '600', lineHeight: 21, fontStyle: 'italic' },
  insightAuthor: { fontSize: 12, marginTop: 6, fontWeight: '500' },

  // daily affirmation
  affirmCard: {
    marginHorizontal: 18, marginTop: 22, marginBottom: 8,
    borderRadius: 20, borderWidth: 1, padding: 20, alignItems: 'center',
  },
  affirmTop: { fontSize: 12, fontWeight: '700', color: '#8B5CF6', letterSpacing: 0.5, marginBottom: 10 },
  affirmText: { fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 24, fontStyle: 'italic' },
});

export default HomeScreen;
