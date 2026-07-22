import React, { useState, useRef, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAppMusic } from '../hooks/useAppMusic';
import {
  Sparkles, Moon, Play, Pause, ChevronRight, Wind, Leaf,
  Heart, Target,
} from './Icons';
import restData from '../utils/rest-screen-plan.json';
import { MEDITATION_MUSIC, formatMin } from '../utils/meditationMusic';
import FeedbackCelebration from './FeedbackCelebration';

const { width: W } = Dimensions.get('window');

// ── inline icons ───────────────────────────────────────────────────────────────
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
const StarIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </Svg>
);
const ZenIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <Circle cx="12" cy="15" r="1.5" fill={color} />
  </Svg>
);
const TherapyIcon = ({ size = 20, color = '#fff' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </Svg>
);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

// ── Pull data from JSON ────────────────────────────────────────────────────────
const soundscapesSection = restData.sections.find((s) => s.id === 1)!;
const nightWisdomSection = restData.sections.find((s) => s.id === 2)!;
const therapySection     = restData.sections.find((s) => s.id === 3)!;

// Color palette per soundscape category id
const SOUNDSCAPE_COLORS: Record<number, { color: string; soft: string; bg: string }> = {
  1: { color: '#3B82F6', soft: 'rgba(59,130,246,0.18)',  bg: '#1e3a5f' },
  2: { color: '#10B981', soft: 'rgba(16,185,129,0.18)',  bg: '#1a3328' },
  3: { color: '#F59E0B', soft: 'rgba(245,158,11,0.18)',  bg: '#3d2a00' },
  4: { color: '#8B5CF6', soft: 'rgba(139,92,246,0.18)',  bg: '#1a1a3e' },
};
const THERAPY_COLORS = ['#F472B6', '#F59E0B', '#6366F1', '#EF4444', '#10B981'];
const WISDOM_COLORS  = ['#F59E0B', '#6366F1', '#10B981', '#8B5CF6', '#F472B6'];

// ── Mood → hero + suggested content ───────────────────────────────────────────
type MoodSuggestion = {
  pill: string;
  heroTitle: string;
  heroMeta: string;
  heroDesc: string;
  suggestedItems: { title: string; sub: string; color: string; duration: string }[];
};

const MOOD_SUGGESTIONS: Record<string, MoodSuggestion> = {
  overthinking: {
    pill: 'For Overthinking',
    heroTitle: 'Calm the Racing Mind',
    heroMeta: '15 min  •  Guided Audio',
    heroDesc: 'Release racing thoughts and find stillness.',
    suggestedItems: [
      { title: 'Overthinking Tonight',    sub: 'Anxiety Before Sleep',  color: '#4C1D95', duration: '10 min' },
      { title: 'Letting Go of Control',   sub: 'Anxiety Before Sleep',  color: '#1e3a5f', duration: '8 min'  },
      { title: 'Rain on Window',          sub: 'Rain Collection',       color: '#1e3a5f', duration: '30 min' },
      { title: 'Marcus Aurelius',         sub: 'Stoic Wisdom',          color: '#2a1a3e', duration: '12 min' },
    ],
  },
  tired: {
    pill: 'For Tiredness',
    heroTitle: 'Deep Rest Mode',
    heroMeta: '30 min  •  Sound Bath',
    heroDesc: 'Let go and sink into deep, restful sleep.',
    suggestedItems: [
      { title: 'White Noise',             sub: 'Color Noise',           color: '#1a1a3e', duration: '60 min' },
      { title: 'Brown Noise',             sub: 'Color Noise',           color: '#2a1506', duration: '60 min' },
      { title: 'Stress Recovery',         sub: 'Therapy',               color: '#1a3328', duration: '12 min' },
      { title: 'Small Wins Today',        sub: 'Gratitude Journey',     color: '#1a2a3e', duration: '5 min'  },
    ],
  },
  calm: {
    pill: 'Stay Calm',
    heroTitle: 'Deepen Your Peace',
    heroMeta: '20 min  •  Indian Spiritual',
    heroDesc: 'Immerse in sacred sounds that nourish the soul.',
    suggestedItems: [
      { title: 'Temple Ambience',         sub: 'Indian Spiritual',      color: '#3d2a00', duration: '20 min' },
      { title: 'Himalayan Dawn',          sub: 'Indian Spiritual',      color: '#2a1a0a', duration: '25 min' },
      { title: 'Inner Peace',             sub: 'Life Wisdom',           color: '#1a3328', duration: '10 min' },
      { title: 'Gratitude Reflection',    sub: 'Gratitude Journey',     color: '#2a1a3e', duration: '5 min'  },
    ],
  },
  emotional: {
    pill: 'Emotional Support',
    heroTitle: 'You Are Not Alone',
    heroMeta: '15 min  •  Healing Audio',
    heroDesc: 'Gentle support to process and release emotions.',
    suggestedItems: [
      { title: 'Heart Break',             sub: 'Therapy',               color: '#4C1D1D', duration: '15 min' },
      { title: 'Confidence Repair',       sub: 'Therapy',               color: '#1a1a3e', duration: '12 min' },
      { title: 'You Are Making Progress', sub: 'Confidence Before Sleep',color: '#1a2a1a', duration: '5 min'  },
      { title: 'Tibetan Bowls',           sub: 'Indian Spiritual',      color: '#3d2a00', duration: '20 min' },
    ],
  },
  'low-energy': {
    pill: 'For Low Energy',
    heroTitle: 'Recharge Your Spirit',
    heroMeta: '12 min  •  Recovery',
    heroDesc: 'Gentle energy restoration for body and mind.',
    suggestedItems: [
      { title: 'Stress Recovery',         sub: 'Therapy',               color: '#1a3328', duration: '12 min' },
      { title: 'Ocean Waves',             sub: 'Nature',                color: '#1e3a5f', duration: '30 min' },
      { title: 'J.K. Rowling\'s Rejections', sub: 'Success Stories',   color: '#2a1a3e', duration: '8 min'  },
      { title: 'Tomorrow is a New Day',   sub: 'Confidence Before Sleep',color: '#1a2a1a', duration: '5 min' },
    ],
  },
  focus: {
    pill: 'Sharpen Focus',
    heroTitle: 'Enter the Zone',
    heroMeta: '25 min  •  Focus Sounds',
    heroDesc: 'Binaural beats and ambient tones for deep focus.',
    suggestedItems: [
      { title: 'Pink Noise',              sub: 'Color Noise',           color: '#2a1a3e', duration: '60 min' },
      { title: 'Soft Tanpura',            sub: 'Indian Spiritual',      color: '#3d2a00', duration: '20 min' },
      { title: 'Seneca',                  sub: 'Stoic Wisdom',          color: '#1a1a3e', duration: '10 min' },
      { title: 'Detachment from Outcomes',sub: 'Life Wisdom',           color: '#1a3328', duration: '8 min'  },
    ],
  },
};

const DEFAULT_HERO = {
  pill: 'Recommended for you',
  heroTitle: 'Calm the Mind',
  heroMeta: '12 min  •  Guided Audio',
  heroDesc: 'Helps you release stress and\nrelax deeply.',
};

// ─── PER-TRACK AUDIO SOURCES (keyed by soundscape item title) ──────────────
const soundscapeSources: Record<string, ReturnType<typeof require>> = {
  'Light Rain': require('../assets/music-playlist/rain-sound.mp4'),
};

// ─────────────────────────────────────────────────────────────────────────────
export default function SleepScreen() {
  const navigation = useNavigation<any>();
  const { images, mode } = useTheme();
  const { playTrack, isTrackPlaying, toggleTrack } = useAppMusic();

  const playedSuggestionRef = useRef<{ title: string; sub: string } | null>(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackItem, setFeedbackItem]       = useState<{ title: string; sub: string } | null>(null);
  const [feedbackGiven, setFeedbackGiven]     = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationReaction, setCelebrationReaction] = useState({ emoji: '😌', label: 'Very calming' });

  const playAndOpen = () => {
    playTrack();
    navigation.navigate('NowPlaying');
  };

  const playSuggestion = (title: string, sub: string) => {
    playedSuggestionRef.current = { title, sub };
    setFeedbackGiven(false);
    playTrack(soundscapeSources[title]);
    navigation.navigate('NowPlaying', {
      id: title === 'Light Rain' ? 'rain' : undefined,
      title,
      mediaLabel: sub,
    });
  };

  // When opened from Home's "Nature Therapy" with an autoPlay param, start the
  // chosen soundscape and open the player, then clear the param so it doesn't
  // re-fire on subsequent focuses.
  const route = useRoute<any>();
  useEffect(() => {
    const autoPlay = route.params?.autoPlay;
    if (autoPlay?.title) {
      playSuggestion(autoPlay.title, autoPlay.sub ?? 'Nature');
      navigation.setParams({ autoPlay: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.autoPlay]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (playedSuggestionRef.current && !feedbackGiven) {
        setFeedbackItem(playedSuggestionRef.current);
        setFeedbackVisible(true);
      }
    });
    return unsubscribe;
  }, [navigation, feedbackGiven]);

  const FEEDBACK_REACTIONS: { emoji: string; label: string }[] = [
    { emoji: '😌', label: 'Very calming' },
    { emoji: '👍', label: 'Helpful' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😕', label: 'Not for me' },
  ];

  const MOOD_FEEDBACK_QUESTION: Record<string, string> = {
    overthinking: 'Did it help quiet your mind?',
    tired:        'Did you feel more rested?',
    calm:         'Did it deepen your calm?',
    emotional:    'Did it bring you comfort?',
    'low-energy': 'Did it help recharge you?',
    focus:        'Did it sharpen your focus?',
  };

  const isNight = mode === 'night';
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { key: 'overthinking', label: 'Overthinking', Icon: BrainIcon, color: '#8B5CF6' },
    { key: 'tired',        label: 'Tired',         Icon: Moon,      color: '#6366F1' },
    { key: 'calm',         label: 'Need Calm',     Icon: Leaf,      color: '#10B981' },
    { key: 'emotional',    label: 'Emotional',     Icon: Heart,     color: '#F472B6' },
    { key: 'low-energy',   label: 'Low Energy',    Icon: BoltIcon,  color: '#F59E0B' },
    { key: 'focus',        label: 'Need Focus',    Icon: Target,    color: '#3B82F6' },
  ];

  const hero = selectedMood ? MOOD_SUGGESTIONS[selectedMood] : DEFAULT_HERO;
  const suggestedItems = selectedMood ? MOOD_SUGGESTIONS[selectedMood].suggestedItems : null;

  const BG          = isNight ? '#0B1024' : '#F8F9FF';
  const CARD        = isNight ? '#161B33' : '#FFFFFF';
  const BORDER      = isNight ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const TEXT        = isNight ? '#E8E9F3' : '#0F172A';
  const MUTED       = isNight ? '#8B92B0' : '#6B7280';
  const PURPLE      = '#8B5CF6';
  const PURPLE_SOFT = isNight ? 'rgba(139,92,246,0.18)' : '#EDE9FE';

  return (
    <View style={[s.root, { backgroundColor: BG }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={s.header}>
          <View>
            <Text style={[s.greeting, { color: TEXT }]}>{getGreeting()} 🌿</Text>
            <Text style={[s.greetingSub, { color: MUTED }]}>Take a break. You deserve to rest.</Text>
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

        {/* ── HERO CARD ── */}
        <ImageBackground
          source={images.sleepHero}
          style={s.heroCard}
          imageStyle={{ borderRadius: 20 }}
        >
          <View style={[s.heroOverlay, { backgroundColor: isNight ? 'rgba(8,12,40,0.55)' : 'rgba(0,0,0,0.35)' }]} />
          <View style={s.heroContent}>
            <View style={s.recPill}>
              <Sparkles size={13} color={PURPLE} />
              <Text style={[s.recPillText, { color: '#fff' }]}>{hero.pill}</Text>
            </View>
            <Text style={s.heroTitle}>{hero.heroTitle}</Text>
            <Text style={s.heroMeta}>{hero.heroMeta}</Text>
            <Text style={s.heroDesc}>{hero.heroDesc}</Text>
            <TouchableOpacity style={s.heroBtn} activeOpacity={0.88} onPress={playAndOpen}>
              <Play size={13} color="#fff" />
              <Text style={s.heroBtnText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ── MOOD SUGGESTIONS (shown when mood is selected) ── */}
        {suggestedItems && (
          <View style={{ marginBottom: 28 }}>
            <View style={s.sectionRow}>
              <View style={{ flex: 1 }}>
                <Text style={[s.sectionTitle, { color: TEXT }]}>Suggested for You</Text>
                <Text style={[s.sectionSub, { color: MUTED }]}>Based on how you're feeling</Text>
              </View>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
              </TouchableOpacity>
            </View>
            {suggestedItems.map((item, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.85}
                style={[s.suggestRow, { backgroundColor: CARD, borderColor: BORDER }]}
                onPress={() => playSuggestion(item.title, item.sub)}
              >
                <View style={[s.suggestArt, { backgroundColor: item.color }]}>
                  <MusicIcon size={16} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[s.suggestTitle, { color: TEXT }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={[s.suggestSub, { color: MUTED }]}>{item.sub}  ·  {item.duration}</Text>
                </View>
                <TouchableOpacity style={[s.suggestPlay, { backgroundColor: PURPLE }]} onPress={() => playSuggestion(item.title, item.sub)}>
                  <Play size={13} color="#fff" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── SOUNDSCAPES ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>{soundscapesSection.name}</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Sleep sounds & ambient music</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {soundscapesSection.categories!.map((cat) => {
            const palette = SOUNDSCAPE_COLORS[cat.id] ?? SOUNDSCAPE_COLORS[1];
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.85}
                style={[s.catCard, { backgroundColor: isNight ? '#1A2040' : CARD, borderColor: BORDER }]}
              >
                <View style={[s.catIcon, { backgroundColor: palette.soft }]}>
                  <MusicIcon size={22} color={palette.color} />
                </View>
                <Text style={[s.catTitle, { color: TEXT }]}>{cat.name}</Text>
                <Text style={[s.catSub, { color: MUTED }]}>{cat.items.slice(0, 2).join('\n')}</Text>
                <TouchableOpacity style={s.catFooter} activeOpacity={0.7}>
                  <Text style={[s.catCount, { color: palette.color }]}>{cat.items.length} tracks</Text>
                  <ChevronRight size={13} color={palette.color} />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── POPULAR SOUNDSCAPE TRACKS ── */}
        <View style={s.sectionRow}>
          <Text style={[s.sectionTitle, { color: TEXT }]}>Popular Right Now</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {[
            ...soundscapesSection.categories![0].items.slice(0, 2).map((item, i) => ({
              title: item, sub: soundscapesSection.categories![0].name,
              duration: `${20 + i * 10} min`, color: SOUNDSCAPE_COLORS[1].bg,
            })),
            ...soundscapesSection.categories![1].items.slice(0, 2).map((item, i) => ({
              title: item, sub: soundscapesSection.categories![1].name,
              duration: `${25 + i * 5} min`, color: SOUNDSCAPE_COLORS[2].bg,
            })),
            ...soundscapesSection.categories![2].items.slice(0, 1).map((item) => ({
              title: item, sub: soundscapesSection.categories![2].name,
              duration: '20 min', color: SOUNDSCAPE_COLORS[3].bg,
            })),
          ].map((p, i) => (
            <TouchableOpacity key={i} activeOpacity={0.88} style={s.popCard}>
              <View style={[s.popBg, { backgroundColor: p.color }]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{p.duration}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={() => playSuggestion(p.title, p.sub)}>
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

        {/* ── MEDITATION MUSIC ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>Meditation Music</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Ambient tracks to settle into stillness</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {MEDITATION_MUSIC.map((t, i) => {
            const openTrack = () =>
              navigation.navigate('MeditationSession', {
                techniqueId: 'meditation-music',
                techniqueName: 'Meditation Music',
                title: t.title,
                durationSec: t.durationSec,
                audio: t.audio,
                startImmersive: true, // play over a meditation background video
              });
            return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              style={s.popCard}
              onPress={openTrack}
            >
              <View style={[s.popBg, { backgroundColor: WISDOM_COLORS[i % WISDOM_COLORS.length] }]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <View style={s.popInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{t.title}</Text>
                  <Text style={[s.popSub, { color: MUTED }]}>Meditation music</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
          })}
        </ScrollView>

        {/* ── THERAPY — EMOTIONAL RESET ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>{therapySection.name}</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Guided sessions for what you feel</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {therapySection.categories!.map((cat, i) => {
            const accent = THERAPY_COLORS[i % THERAPY_COLORS.length];
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.88}
                style={[s.therapyCard, { backgroundColor: isNight ? '#1A2040' : CARD, borderColor: BORDER }]}
                onPress={playAndOpen}
              >
                <View style={[s.therapyIcon, { backgroundColor: `${accent}22` }]}>
                  <TherapyIcon size={20} color={accent} />
                </View>
                <Text style={[s.therapyTitle, { color: TEXT }]}>{cat.name}</Text>
                {cat.items.length > 0 && (
                  <Text style={[s.therapySub, { color: MUTED }]} numberOfLines={2}>
                    {cat.items[0]}
                  </Text>
                )}
                <View style={[s.therapyPlayBtn, { backgroundColor: accent }]}>
                  <Play size={12} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── NIGHT WISDOM ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>{nightWisdomSection.name}</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>{nightWisdomSection.altName}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={[s.linkText, { color: PURPLE }]}>View all</Text>
          </TouchableOpacity>
        </View>
        {nightWisdomSection.categories!.map((cat, i) => {
          const accent = WISDOM_COLORS[i % WISDOM_COLORS.length];
          return (
            <TouchableOpacity
              key={cat.id}
              activeOpacity={0.85}
              style={[s.wisdomRow, { backgroundColor: CARD, borderColor: BORDER }]}
              onPress={playAndOpen}
            >
              <View style={[s.wisdomIcon, { backgroundColor: `${accent}22` }]}>
                {i === 0 ? <StarIcon size={18} color={accent} /> :
                 i === 1 ? <ZenIcon size={18} color={accent} /> :
                 i === 2 ? <LightbulbIcon size={18} color={accent} /> :
                 i === 3 ? <TherapyIcon size={18} color={accent} /> :
                           <Heart size={18} color={accent} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[s.wisdomTitle, { color: TEXT }]}>{cat.name}</Text>
                {cat.items.length > 0 && (
                  <Text style={[s.wisdomSub, { color: MUTED }]} numberOfLines={1}>
                    {cat.items.slice(0, 2).join('  ·  ')}
                    {cat.items.length > 2 ? ` +${cat.items.length - 2} more` : ''}
                  </Text>
                )}
                {('format' in cat) && (
                  <Text style={[s.wisdomFormat, { color: accent }]}>{(cat as any).format}</Text>
                )}
              </View>
              <ChevronRight size={16} color={MUTED} />
            </TouchableOpacity>
          );
        })}

        {/* ── WIND DOWN PLAN ── */}
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
            {[
              { label: 'Relaxing\nMusic', mins: '10 min', Icon: MusicIcon,  color: PURPLE },
              { label: 'Calm\nTherapy',  mins: '12 min', Icon: Wind,       color: PURPLE },
              { label: 'Positive\nStory',mins: '10 min', Icon: BookIcon,   color: '#10B981' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <View style={s.planStep}>
                  <View style={[s.planStepIcon, { backgroundColor: PURPLE_SOFT }]}>
                    <step.Icon size={18} color={step.color} />
                  </View>
                  <Text style={[s.planStepLabel, { color: TEXT }]}>{step.label}</Text>
                  <Text style={[s.planStepMins, { color: MUTED }]}>{step.mins}</Text>
                </View>
                {i < arr.length - 1 && <View style={[s.planDash, { borderColor: BORDER }]} />}
              </React.Fragment>
            ))}
          </View>
          <TouchableOpacity style={[s.planBtn, { backgroundColor: PURPLE }]} activeOpacity={0.88} onPress={playAndOpen}>
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

      {/* ── FEEDBACK SHEET ── */}
      {feedbackVisible && (
        <View style={s.modalBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={() => {
            setFeedbackGiven(true);
            setFeedbackVisible(false);
            playedSuggestionRef.current = null;
          }} />
          <View style={[s.modalSheet, { backgroundColor: CARD }]}>
            <View style={[s.modalHandle, { backgroundColor: BORDER }]} />

            <View style={[s.modalIconWrap, { backgroundColor: PURPLE_SOFT }]}>
              <Sparkles size={28} color={PURPLE} />
            </View>

            <Text style={[s.modalTitle, { color: TEXT }]}>
              {selectedMood && MOOD_FEEDBACK_QUESTION[selectedMood]
                ? MOOD_FEEDBACK_QUESTION[selectedMood]
                : 'How did that feel?'}
            </Text>
            {feedbackItem && (
              <Text style={[s.modalSub, { color: MUTED }]}>
                {feedbackItem.title}  ·  {feedbackItem.sub}
              </Text>
            )}

            <View style={s.reactionsRow}>
              {FEEDBACK_REACTIONS.map((r) => (
                <TouchableOpacity
                  key={r.label}
                  activeOpacity={0.8}
                  style={[s.reactionBtn, { backgroundColor: isNight ? '#1A2040' : '#F8F9FF', borderColor: BORDER }]}
                  onPress={() => {
                    setCelebrationReaction(r);
                    setFeedbackVisible(false);
                    setFeedbackGiven(true);
                    playedSuggestionRef.current = null;
                    setCelebrationVisible(true);
                  }}
                >
                  <Text style={s.reactionEmoji}>{r.emoji}</Text>
                  <Text style={[s.reactionLabel, { color: MUTED }]}>{r.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setFeedbackGiven(true);
                setFeedbackVisible(false);
                playedSuggestionRef.current = null;
              }}
            >
              <Text style={[s.modalSkip, { color: MUTED }]}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FeedbackCelebration
        visible={celebrationVisible}
        emoji={celebrationReaction.emoji}
        label={celebrationReaction.label}
        onClose={() => setCelebrationVisible(false)}
      />

      {/* ── MINI PLAYER ── */}
      {isTrackPlaying && (
        <View style={[s.miniPlayer, { backgroundColor: CARD, borderColor: BORDER }]}>
          <TouchableOpacity style={s.miniTap} activeOpacity={0.85} onPress={() => navigation.navigate('NowPlaying')}>
            <View style={[s.miniArt, { backgroundColor: PURPLE }]}>
              <Moon color="#fff" size={18} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[s.miniTitle, { color: TEXT }]} numberOfLines={1}>Sleep Sounds</Text>
              <Text style={[s.miniSub, { color: MUTED }]} numberOfLines={1}>Now playing</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[s.miniPlayBtn, { backgroundColor: TEXT }]} activeOpacity={0.85} onPress={toggleTrack}>
            {isTrackPlaying ? <Pause color={BG} size={18} /> : <Play color={BG} size={18} />}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const CARD_W = W * 0.42;
const POP_W  = W * 0.42;

const s = StyleSheet.create({
  root: { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  greetingSub: { fontSize: 13, marginTop: 3 },

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

  heroCard: { marginHorizontal: 20, height: 280, borderRadius: 20, overflow: 'hidden', marginBottom: 28 },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { flex: 1, padding: 22, justifyContent: 'flex-end' },
  recPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(139,92,246,0.35)',
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

  sectionRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, marginTop: 2 },
  linkText: { fontSize: 14, fontWeight: '600' },

  // mood suggestions list
  suggestRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, borderWidth: 1, padding: 12,
  },
  suggestArt: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  suggestTitle: { fontSize: 14, fontWeight: '700' },
  suggestSub: { fontSize: 12, marginTop: 2 },
  suggestPlay: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },

  // soundscape categories
  catCard: { width: CARD_W, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 22 },
  catIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  catTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  catSub: { fontSize: 12, marginTop: 4, lineHeight: 17 },
  catFooter: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 12 },
  catCount: { fontSize: 12, fontWeight: '700' },

  // popular tracks
  popCard: { width: POP_W, marginBottom: 22 },
  popBg: {
    width: '100%', height: 140, borderRadius: 14,
    overflow: 'hidden', justifyContent: 'space-between', padding: 10,
  },
  popDurationBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(0,0,0,0.45)',
    paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
  },
  popDuration: { fontSize: 11, color: '#fff', fontWeight: '700' },
  popPlay: {
    alignSelf: 'flex-end', width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center',
  },
  popInfo: { flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 2 },
  popTitle: { fontSize: 13, fontWeight: '700' },
  popSub: { fontSize: 11, marginTop: 2 },

  // therapy cards
  therapyCard: {
    width: CARD_W, borderRadius: 16, borderWidth: 1,
    padding: 14, marginBottom: 22,
  },
  therapyIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  therapyTitle: { fontSize: 14, fontWeight: '800', letterSpacing: -0.2 },
  therapySub: { fontSize: 11, marginTop: 4, lineHeight: 16 },
  therapyPlayBtn: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginTop: 12 },

  // night wisdom rows
  wisdomRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 10,
    borderRadius: 16, borderWidth: 1, padding: 14,
  },
  wisdomIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  wisdomTitle: { fontSize: 14, fontWeight: '800' },
  wisdomSub: { fontSize: 12, marginTop: 3 },
  wisdomFormat: { fontSize: 11, fontWeight: '700', marginTop: 4 },

  // plan
  planCard: { marginHorizontal: 20, marginTop: 8, marginBottom: 16, borderRadius: 20, borderWidth: 1, padding: 18 },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 },
  planIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  planTitle: { fontSize: 16, fontWeight: '800' },
  planMeta: { fontSize: 13, marginTop: 2 },
  planSteps: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  planStep: { flex: 1, alignItems: 'center', gap: 6 },
  planStepIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  planStepLabel: { fontSize: 11, fontWeight: '700', textAlign: 'center' },
  planStepMins: { fontSize: 10, textAlign: 'center' },
  planDash: { width: 24, borderTopWidth: 1.5, borderStyle: 'dashed', marginBottom: 24 },
  planBtn: {
    borderRadius: 999, paddingVertical: 14, alignItems: 'center',
    shadowColor: '#8B5CF6', shadowOpacity: 0.35, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  planBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },

  // insight
  insightRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    marginHorizontal: 20, marginBottom: 12, borderRadius: 16, borderWidth: 1, padding: 14,
  },
  insightIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  insightLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginBottom: 2 },
  insightText: { fontSize: 13, fontWeight: '600', lineHeight: 18 },

  // mini player
  miniPlayer: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, paddingBottom: 24,
    gap: 10, borderTopWidth: 1,
  },
  miniTap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  miniArt: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  miniTitle: { fontSize: 13, fontWeight: '600' },
  miniSub: { fontSize: 11, marginTop: 2 },
  miniPlayBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

  // feedback sheet
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  modalSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 44, alignItems: 'center',
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2, marginBottom: 24,
  },
  modalIconWrap: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center', marginBottom: 6 },
  modalSub: { fontSize: 13, textAlign: 'center', marginBottom: 28 },
  reactionsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  reactionBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 14,
    borderRadius: 16, borderWidth: 1, gap: 6,
  },
  reactionEmoji: { fontSize: 28 },
  reactionLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  modalSkip: { fontSize: 14, fontWeight: '600' },
});
