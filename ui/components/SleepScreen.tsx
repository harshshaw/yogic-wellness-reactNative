import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
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
import { MEDITATION_MUSIC, MEDITATION_FOCUS, MEDITATION_MINDFULNESS, THERAPY_EMOTIONAL_RESET, WISDOM_STORIES, randomRestTrack, randomFrom, formatMin, type MeditationTrack } from '../utils/meditationMusic';
import FeedbackCelebration from './FeedbackCelebration';
import { media, type MediaSource } from '../lib/media';
import { shouldAskFeedback } from '../utils/restFeedback';
import { NATURE_VIDEOS } from '../utils/sessionMedia';

const { width: W } = Dimensions.get('window');

// Sprite sheet: 4 portrait panels side-by-side, one per NATURE_VIDEOS entry in order.
const NATURE_THUMB = require('../assets/images/longvideos-thumbnail.png');

// Card artwork keyed by soundscape title / meditation-music track id. Cards
// without an entry fall back to their solid colour.
const REST_CARD_IMAGES: Record<string, any> = {
  'Light Rain':       require('../assets/images/rest-cards/light-rain.png'),
  'Thunder Storm':    require('../assets/images/rest-cards/thunder-storm.png'),
  'Forest':           require('../assets/images/rest-cards/forest.png'),
  'Waterfall':        require('../assets/images/rest-cards/waterfall.png'),
  'Temple Ambience':  require('../assets/images/rest-cards/temple-ambience.png'),
  'deep-stillness':   require('../assets/images/rest-cards/deep-stillness.png'),
  'gentle-calm':      require('../assets/images/rest-cards/gentle-calm.png'),
  'inner-quiet':      require('../assets/images/rest-cards/inner-quiet.png'),
  'ambient-drift':    require('../assets/images/rest-cards/ambient-drift.png'),
  'flowing-mind':     require('../assets/images/rest-cards/flowing-mind.png'),
  // Meditation Music (remaining) + Mantra & Focus
  'deep-journey':     require('../assets/images/rest-cards/deep-journey.png'),
  'quiet-phase':      require('../assets/images/rest-cards/quiet-phase.png'),
  'mountain-spirit':  require('../assets/images/rest-cards/mountain-spirit.png'),
  'sacred-space':     require('../assets/images/rest-cards/sacred-space.png'),
  'so-hum-1':         require('../assets/images/rest-cards/so-hum-1.png'),
  'so-hum-2':         require('../assets/images/rest-cards/so-hum-2.png'),
  'so-hum-3':         require('../assets/images/rest-cards/so-hum-3.png'),
  'mantra-1':         require('../assets/images/rest-cards/mantra-1.png'),
  'mantra-2':         require('../assets/images/rest-cards/mantra-2.png'),
  'mantra-3':         require('../assets/images/rest-cards/mantra-3.png'),
  // Concentration + Breath Counting (Mantra & Focus) and Mindfulness
  'concentration-1':  require('../assets/images/rest-cards/concentration-1.png'),
  'concentration-2':  require('../assets/images/rest-cards/concentration-2.png'),
  'breath-count-1':   require('../assets/images/rest-cards/breath-count-1.png'),
  'breath-count-2':   require('../assets/images/rest-cards/breath-count-2.png'),
  'thoughts-as-clouds': require('../assets/images/rest-cards/thoughts-as-clouds.png'),
  'not-your-thoughts':  require('../assets/images/rest-cards/not-your-thoughts.png'),
  'naming-whats-here':  require('../assets/images/rest-cards/naming-whats-here.png'),
  // Therapy — Emotional Reset
  'anxiety-before-sleep': require('../assets/images/rest-cards/anxiety-before-sleep.png'),
  'stress-recovery':      require('../assets/images/rest-cards/stress-recovery.png'),
  'loneliness':           require('../assets/images/rest-cards/loneliness.png'),
  'heartbreak':           require('../assets/images/rest-cards/heartbreak.png'),
  'confidence-repair':    require('../assets/images/rest-cards/confidence-repair.png'),
  // Wisdom & Stories
  'steve-jobs-success':    require('../assets/images/rest-cards/steveJobsSuccessThumbnail.jpg'),
  'stoic-marcus-aurelius': require('../assets/images/rest-cards/marcus-aurelius.jpg'),
  'life-wisdom-detachment': require('../assets/images/rest-cards/wisdom.jpg'),
  'confidence-before-sleep': require('../assets/images/rest-cards/confiedencebeforesleep.jpg'),
};

// The artwork area at the top of a "popular" card — a photo when we have one
// for this track, otherwise the original solid colour. Children (duration badge
// + play button) render on top either way.
const CardArt = ({
  imageKey,
  color,
  children,
}: {
  imageKey?: string;
  color: string;
  children: React.ReactNode;
}) => {
  const img = imageKey ? REST_CARD_IMAGES[imageKey] : undefined;
  if (img) {
    return (
      <ImageBackground source={img} style={s.popBg} imageStyle={{ borderRadius: 14 }}>
        {children}
      </ImageBackground>
    );
  }
  return <View style={[s.popBg, { backgroundColor: color }]}>{children}</View>;
};

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
const therapySection     = restData.sections.find((s) => s.id === 3)!;

// Color palette per soundscape category id
const SOUNDSCAPE_COLORS: Record<number, { color: string; soft: string; bg: string }> = {
  1: { color: '#3B82F6', soft: 'rgba(59,130,246,0.18)',  bg: '#1e3a5f' },
  2: { color: '#10B981', soft: 'rgba(16,185,129,0.18)',  bg: '#1a3328' },
  3: { color: '#F59E0B', soft: 'rgba(245,158,11,0.18)',  bg: '#3d2a00' },
  4: { color: '#8B5CF6', soft: 'rgba(139,92,246,0.18)',  bg: '#1a1a3e' },
};
// Blue-family accents (subtle variation) to match the Calm Blue palette.
const THERAPY_COLORS = ['#5B8DEF', '#4667C7', '#2E8CC0', '#6D8FE0', '#3D74D6'];
const WISDOM_COLORS  = ['#4667C7', '#5B8DEF', '#2E8CC0', '#3D74D6', '#6D8FE0'];

// ─── PER-TRACK AUDIO SOURCES (keyed by soundscape item title) ──────────────
const soundscapeSources: Record<string, MediaSource> = {
  'Light Rain': media('music-playlist/rain-sound.mp4'),
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

  // Open the guided-audio player for a specific track (plain timer first; the
  // expand icon brings in the background video) — same behaviour as the cards.
  const openTrack = (track: MeditationTrack, techniqueName: string) =>
    navigation.navigate('MeditationSession', {
      techniqueId: 'meditation-music',
      techniqueName,
      title: track.title,
      durationSec: track.durationSec,
      audio: track.audio,
      startImmersive: false,
    });

  // Random picks, chosen once per screen mount: one "Recommended for you" track
  // and one per Wind Down category.
  const [recommended] = useState<MeditationTrack>(() => randomRestTrack());
  const [windDownPicks] = useState(() => ({
    music:   randomFrom(MEDITATION_MUSIC),
    therapy: randomFrom(THERAPY_EMOTIONAL_RESET),
    story:   randomFrom(WISDOM_STORIES),
  }));

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
      const item = playedSuggestionRef.current;
      if (!item || feedbackGiven) return;
      // Ask for feedback at most once per day, on a random play — not every time.
      shouldAskFeedback().then(ask => {
        if (!ask) return;
        setFeedbackItem(item);
        setFeedbackVisible(true);
      });
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
  const [selectedMood] = useState<string | null>(null);

  const BG          = isNight ? '#0B1024' : '#F8F9FF';
  const CARD        = isNight ? '#161B33' : '#FFFFFF';
  const BORDER      = isNight ? 'rgba(255,255,255,0.08)' : '#F1F5F9';
  const TEXT        = isNight ? '#E8E9F3' : '#0F172A';
  const MUTED       = isNight ? '#8B92B0' : '#6B7280';
  const PURPLE      = isNight ? '#6EA8FF' : '#5B8DEF';
  const PURPLE_SOFT = isNight ? 'rgba(110,168,255,0.18)' : '#E7F0FF';

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
              <Text style={[s.recPillText, { color: '#fff' }]}>Recommended for you</Text>
            </View>
            <Text style={s.heroTitle}>{recommended.title}</Text>
            <Text style={s.heroMeta}>{formatMin(recommended.durationSec)}  •  Guided Audio</Text>
            <Text style={s.heroDesc}>A moment of calm,{'\n'}picked just for you.</Text>
            <TouchableOpacity style={s.heroBtn} activeOpacity={0.88} onPress={() => openTrack(recommended, 'Recommended')}>
              <Play size={13} color="#fff" />
              <Text style={s.heroBtnText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* ── WISDOM & STORIES ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>Wisdom &amp; Stories</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Reflective narrations to rest into</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {WISDOM_STORIES.map((t, i) => {
            const openTrack = () =>
              navigation.navigate('MeditationSession', {
                techniqueId: 'meditation-music',
                techniqueName: 'Wisdom & Stories',
                title: t.title,
                durationSec: t.durationSec,
                audio: t.audio,
                startImmersive: false, // plain timer first; expand icon for the background video
              });
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.88}
                style={s.popCard}
                onPress={openTrack}
              >
                <CardArt imageKey={t.id} color={THERAPY_COLORS[i % THERAPY_COLORS.length]}>
                  <View style={s.popDurationBadge}>
                    <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                  </View>
                  <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                    <Play size={14} color="#fff" />
                  </TouchableOpacity>
                </CardArt>
                <View style={s.popInfo}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{t.title}</Text>
                    <Text style={[s.popSub, { color: MUTED }]}>Wisdom &amp; stories</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── NATURE (full-screen video + sound, no timer) ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>Nature</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Long visual escapes — full screen, with sound</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {NATURE_VIDEOS.map((v, i) => (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.88}
              style={s.popCard}
              onPress={() => navigation.navigate('NatureVideo', { index: i })}
            >
              <View style={s.popBg}>
                <View style={StyleSheet.absoluteFill}>
                  <Image
                    source={NATURE_THUMB}
                    style={{
                      width: POP_W * 4,
                      // Sprite is 1536×1024 → height = width * (1024/1536)
                      height: POP_W * 4 * (1024 / 1536),
                      position: 'absolute',
                      left: -i * POP_W,
                      // Center vertically in the 140px card
                      top: -(POP_W * 4 * (1024 / 1536) - 140) / 2,
                    }}
                    resizeMode="stretch"
                  />
                </View>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>Video</Text>
                </View>
                <View style={s.popPlay}>
                  <Play size={14} color="#fff" />
                </View>
              </View>
              <View style={s.popInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{v.title}</Text>
                  <Text style={[s.popSub, { color: MUTED }]}>{v.sub}</Text>
                </View>
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
                startImmersive: false, // open the plain timer first; user taps the expand icon for the background video
              });
            return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              style={s.popCard}
              onPress={openTrack}
            >
              <CardArt imageKey={t.id} color={WISDOM_COLORS[i % WISDOM_COLORS.length]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </CardArt>
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

        {/* ── MANTRA & FOCUS ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>Mantra &amp; Focus</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>So Hum &amp; mantra chants to anchor the mind</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {MEDITATION_FOCUS.map((t, i) => {
            const openTrack = () =>
              navigation.navigate('MeditationSession', {
                techniqueId: 'meditation-music',
                techniqueName: 'Mantra & Focus',
                title: t.title,
                durationSec: t.durationSec,
                audio: t.audio,
                startImmersive: false, // open the plain timer first; user taps the expand icon for the background video
              });
            return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              style={s.popCard}
              onPress={openTrack}
            >
              <CardArt imageKey={t.id} color={THERAPY_COLORS[i % THERAPY_COLORS.length]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </CardArt>
              <View style={s.popInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{t.title}</Text>
                  <Text style={[s.popSub, { color: MUTED }]}>Mantra &amp; focus</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
          })}
        </ScrollView>

        {/* ── MINDFULNESS ── */}
        <View style={s.sectionRow}>
          <View>
            <Text style={[s.sectionTitle, { color: TEXT }]}>Mindfulness</Text>
            <Text style={[s.sectionSub, { color: MUTED }]}>Observe your thoughts, gently and without judgment</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {MEDITATION_MINDFULNESS.map((t, i) => {
            const openTrack = () =>
              navigation.navigate('MeditationSession', {
                techniqueId: 'meditation-music',
                techniqueName: 'Mindfulness',
                title: t.title,
                durationSec: t.durationSec,
                audio: t.audio,
                startImmersive: false, // open the plain timer first; user taps the expand icon for the background video
              });
            return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.88}
              style={s.popCard}
              onPress={openTrack}
            >
              <CardArt imageKey={t.id} color={WISDOM_COLORS[(i + 2) % WISDOM_COLORS.length]}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </CardArt>
              <View style={s.popInfo}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{t.title}</Text>
                  <Text style={[s.popSub, { color: MUTED }]}>Mindfulness</Text>
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
          {THERAPY_EMOTIONAL_RESET.map((t, i) => {
            const openTrack = () =>
              navigation.navigate('MeditationSession', {
                techniqueId: 'meditation-music',
                techniqueName: 'Emotional Reset',
                title: t.title,
                durationSec: t.durationSec,
                audio: t.audio,
                startImmersive: false, // plain timer first; expand icon for the background video
              });
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.88}
                style={s.popCard}
                onPress={openTrack}
              >
                <CardArt imageKey={t.id} color={THERAPY_COLORS[i % THERAPY_COLORS.length]}>
                  <View style={s.popDurationBadge}>
                    <Text style={s.popDuration}>{formatMin(t.durationSec)}</Text>
                  </View>
                  <TouchableOpacity style={s.popPlay} onPress={openTrack}>
                    <Play size={14} color="#fff" />
                  </TouchableOpacity>
                </CardArt>
                <View style={s.popInfo}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.popTitle, { color: TEXT }]} numberOfLines={1}>{t.title}</Text>
                    <Text style={[s.popSub, { color: MUTED }]}>Emotional reset</Text>
                  </View>
                </View>
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
              <CardArt imageKey={p.title} color={p.color}>
                <View style={s.popDurationBadge}>
                  <Text style={s.popDuration}>{p.duration}</Text>
                </View>
                <TouchableOpacity style={s.popPlay} onPress={() => playSuggestion(p.title, p.sub)}>
                  <Play size={14} color="#fff" />
                </TouchableOpacity>
              </CardArt>
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

        {/* ── WIND DOWN PLAN ── */}
        <View style={[s.planCard, { backgroundColor: CARD, borderColor: BORDER }]}>
          <View style={s.planHeader}>
            <View style={[s.planIcon, { backgroundColor: PURPLE_SOFT }]}>
              <Moon size={20} color={PURPLE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[s.planTitle, { color: TEXT }]}>Wind Down Plan</Text>
              <Text style={[s.planMeta, { color: MUTED }]}>
                3 steps  •  {formatMin(
                  (windDownPicks.music?.durationSec ?? 0) +
                  (windDownPicks.therapy?.durationSec ?? 0) +
                  (windDownPicks.story?.durationSec ?? 0)
                )}
              </Text>
            </View>
          </View>
          <View style={s.planSteps}>
            {[
              { label: 'Relaxing\nMusic',  Icon: MusicIcon, color: PURPLE,    pick: windDownPicks.music,   technique: 'Relaxing Music' },
              { label: 'Calm\nTherapy',    Icon: Wind,      color: PURPLE,    pick: windDownPicks.therapy, technique: 'Emotional Reset' },
              { label: 'Positive\nStory',  Icon: BookIcon,  color: '#3D74D6', pick: windDownPicks.story,   technique: 'Wisdom & Stories' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <TouchableOpacity
                  style={s.planStep}
                  activeOpacity={0.8}
                  disabled={!step.pick}
                  onPress={() => step.pick && openTrack(step.pick, step.technique)}
                >
                  <View style={[s.planStepIcon, { backgroundColor: PURPLE_SOFT }]}>
                    <step.Icon size={18} color={step.color} />
                  </View>
                  <Text style={[s.planStepLabel, { color: TEXT }]}>{step.label}</Text>
                  <Text style={[s.planStepMins, { color: MUTED }]}>
                    {step.pick ? formatMin(step.pick.durationSec) : '—'}
                  </Text>
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={[s.planDash, { borderColor: BORDER }]} />}
              </React.Fragment>
            ))}
          </View>
          <TouchableOpacity
            style={[s.planBtn, { backgroundColor: PURPLE }]}
            activeOpacity={0.88}
            onPress={() => {
              const first = windDownPicks.music ?? windDownPicks.therapy ?? windDownPicks.story;
              if (first) openTrack(first, 'Wind Down Plan');
            }}
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
