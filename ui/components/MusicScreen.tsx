import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import { useAppMusic } from '../hooks/useAppMusic';

// ─── ICONS ──────────────────────────────────────────────────────────────
const Search = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={1.8} />
    <Path d="m20 20-3.5-3.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </Svg>
);

const Back = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Play = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M8 5v14l11-7z" fill={color} /></Svg>
);

const Pause = ({ color, size = 16 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} /></Svg>
);

const Heart = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

// ─── DATA ───────────────────────────────────────────────────────────────
type Gradient = readonly [string, string, ...string[]];

const categories = ['All', 'Sleep', 'Focus', 'Meditation', 'Nature', 'Mantras'];

type Track = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  gradient: Gradient;
};

const featured: Track = {
  id: 'daily',
  title: 'Daily Calm',
  subtitle: 'A moment of presence',
  duration: '10 min',
  gradient: ['#4F46E5', '#A78BFA', '#F472B6'] as const,
};

const forYou: Track[] = [
  { id: 'mountains', title: 'Himalayan Stillness', subtitle: 'Sleep · 42 min', duration: '42', gradient: ['#1E3A8A', '#3B82F6'] as const },
  { id: 'temple',    title: 'Pranayama Flows',    subtitle: 'Anxiety · 35 min', duration: '35', gradient: ['#7C3AED', '#C084FC'] as const },
  { id: 'rain',      title: 'Monsoon Rain',       subtitle: 'Focus · 60 min',  duration: '60', gradient: ['#0E7490', '#5EEAD4'] as const },
  { id: 'forest',    title: 'Forest Awakening',   subtitle: 'Nature · 25 min', duration: '25', gradient: ['#047857', '#6EE7B7'] as const },
];

const soundscapes: Track[] = [
  { id: 'sitar', title: 'Sitar & Bowls', subtitle: 'Classical',   duration: '18', gradient: ['#B45309', '#FCD34D'] as const },
  { id: 'om',    title: 'Om Resonance',  subtitle: 'Mantra',      duration: '∞',  gradient: ['#9D174D', '#F472B6'] as const },
  { id: 'ocean', title: 'Slow Ocean',    subtitle: 'Ambient',     duration: '60', gradient: ['#0F766E', '#7DD3FC'] as const },
  { id: 'fire',  title: 'Hearth Fire',   subtitle: 'Sleep',       duration: '45', gradient: ['#9A3412', '#FB923C'] as const },
];

const continueListening: Track[] = [
  { id: 'dawn',   title: 'Himalayan Dawn — Sitar & Bowls', subtitle: 'Sleep',         duration: '18:24', gradient: ['#1E3A8A', '#3B82F6'] as const },
  { id: 'shanti', title: 'Om Shanti — Chanting Flow',      subtitle: 'Anxiety Relief', duration: '12:10', gradient: ['#9D174D', '#F472B6'] as const },
  { id: 'nidra',  title: 'Nidra Yoga Waves',                subtitle: 'Deep Sleep',    duration: '30:00', gradient: ['#0F766E', '#7DD3FC'] as const },
];

// ─── COVER ART (gradient with monogram) ────────────────────────────────
const CoverArt = ({
  size,
  gradient,
  symbol,
}: {
  size: number;
  gradient: Gradient;
  symbol?: string;
}) => (
  <View style={{ width: size, height: size, borderRadius: size * 0.18, overflow: 'hidden' }}>
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    {symbol && (
      <View style={styles.coverGlyph}>
        <Text style={[styles.coverGlyphText, { fontSize: size * 0.4 }]}>{symbol}</Text>
      </View>
    )}
  </View>
);

// ─── PER-TRACK AUDIO SOURCES ────────────────────────────────────────────
const trackSources: Record<string, ReturnType<typeof require>> = {
  rain: require('../assets/music-playlist/rain-sound.mp4'),
};

const symbolForTitle = (s: string) => {
  if (/sleep|night|nidra|dream|moon/i.test(s)) return '☾';
  if (/om|mantra|chant|shanti/i.test(s)) return 'ॐ';
  if (/rain|ocean|water|monsoon/i.test(s)) return '⟿';
  if (/fire|hearth|flame/i.test(s)) return '♨';
  if (/forest|nature|leaf|tree/i.test(s)) return '✿';
  if (/sitar|bowl|raga|classical/i.test(s)) return '♪';
  if (/sun|dawn|morning|daily/i.test(s)) return '☀';
  return '◉';
};

// ─── SCREEN ─────────────────────────────────────────────────────────────
const MusicScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { isTrackPlaying, toggleTrack, playTrack } = useAppMusic();
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Back color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Sounds</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Search color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* CATEGORY CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {categories.map(cat => {
            const active = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  active
                    ? { backgroundColor: colors.textPrimary }
                    : { backgroundColor: colors.cardLight, borderColor: colors.border, borderWidth: 1 },
                ]}
                activeOpacity={0.85}
                onPress={() => setActiveCategory(cat)}
              >
                <Text style={[styles.chipText, { color: active ? colors.bg : colors.textSecondary }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FEATURED HERO */}
        <TouchableOpacity
          activeOpacity={0.92}
          style={styles.heroWrap}
          onPress={() => { playTrack(); navigation.navigate('NowPlaying'); }}
        >
          <LinearGradient
            colors={featured.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroCard}
          >
            <View style={styles.heroSymbolWrap}>
              <Text style={styles.heroSymbol}>{symbolForTitle(featured.title)}</Text>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroOverline}>DAILY · TODAY</Text>
              <Text style={styles.heroTitle}>{featured.title}</Text>
              <Text style={styles.heroSubtitle}>{featured.subtitle}</Text>
              <View style={styles.heroPlayPill}>
                <Play color={featured.gradient[0]} size={12} />
                <Text style={[styles.heroPlayText, { color: featured.gradient[0] }]}>
                  Play · {featured.duration}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* FOR YOU — horizontal carousel */}
        <SectionHeader title="Featured for you" colors={colors} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselRow}
        >
          {forYou.map(t => (
            <TouchableOpacity
              key={t.id}
              style={styles.carouselCard}
              activeOpacity={0.88}
              onPress={() => {
                playTrack(trackSources[t.id]);
                navigation.navigate('NowPlaying', { id: t.id, title: t.title, mediaLabel: t.subtitle });
              }}
            >
              <CoverArt size={150} gradient={t.gradient} symbol={symbolForTitle(t.title)} />
              <Text style={[styles.carouselTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={[styles.carouselSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {t.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SOUNDSCAPES — 2-column grid */}
        <SectionHeader title="Soundscapes" colors={colors} />
        <View style={styles.gridRow}>
          {soundscapes.map(t => (
            <TouchableOpacity
              key={t.id}
              style={styles.gridCard}
              activeOpacity={0.88}
              onPress={() => {
                playTrack(trackSources[t.id]);
                navigation.navigate('NowPlaying', { id: t.id, title: t.title, mediaLabel: t.subtitle });
              }}
            >
              <CoverArt size={148} gradient={t.gradient} symbol={symbolForTitle(t.title)} />
              <Text style={[styles.gridTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={[styles.gridSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {t.subtitle} · {t.duration} min
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CONTINUE LISTENING — track rows */}
        <SectionHeader title="Continue listening" colors={colors} />
        {continueListening.map(t => (
          <TouchableOpacity
            key={t.id}
            style={[styles.trackRow, { borderColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() => { playTrack(); navigation.navigate('NowPlaying'); }}
          >
            <CoverArt size={56} gradient={t.gradient} symbol={symbolForTitle(t.title)} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.trackTitle, { color: colors.textPrimary }]} numberOfLines={1}>
                {t.title}
              </Text>
              <Text style={[styles.trackSub, { color: colors.textSecondary }]} numberOfLines={1}>
                {t.subtitle} · {t.duration}
              </Text>
            </View>
            <TouchableOpacity style={styles.trackPlayBtn} activeOpacity={0.7}>
              <Play color={colors.textPrimary} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MINI PLAYER (always pinned at bottom) */}
      <View style={[styles.miniPlayer, { backgroundColor: colors.cardLight, borderColor: colors.border }]}>
        <TouchableOpacity
          style={styles.miniTap}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('NowPlaying')}
        >
          <CoverArt size={42} gradient={continueListening[0].gradient} symbol={symbolForTitle(continueListening[0].title)} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.miniTitle, { color: colors.textPrimary }]} numberOfLines={1}>
              {continueListening[0].title}
            </Text>
            <Text style={[styles.miniSub, { color: colors.textSecondary }]} numberOfLines={1}>
              {isTrackPlaying ? 'Now playing' : 'Paused'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={{ padding: 6 }}>
          <Heart color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.miniPlayBtn, { backgroundColor: colors.textPrimary }]}
          activeOpacity={0.85}
          onPress={toggleTrack}
        >
          {isTrackPlaying ? <Pause color={colors.bg} size={18} /> : <Play color={colors.bg} size={18} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SectionHeader = ({ title, colors }: { title: string; colors: any }) => (
  <View style={styles.sectionHeader}>
    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
    <Text style={[styles.seeAll, { color: colors.textSecondary }]}>See all</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },

  chipsRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999 },
  chipText: { fontSize: 13, fontWeight: '600' },

  heroWrap: {
    marginHorizontal: 20,
    marginTop: 14,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  heroCard: {
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 170,
    gap: 18,
  },
  heroSymbolWrap: {
    width: 96, height: 96, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroSymbol: { fontSize: 44, color: '#FFFFFF' },
  heroContent: { flex: 1 },
  heroOverline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
    letterSpacing: -0.3,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 4,
  },
  heroPlayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 14,
  },
  heroPlayText: { fontSize: 12, fontWeight: '700' },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  seeAll: { fontSize: 13, fontWeight: '500' },

  carouselRow: { paddingHorizontal: 20, gap: 12 },
  carouselCard: { width: 150 },
  carouselTitle: { fontSize: 14, fontWeight: '600', marginTop: 10 },
  carouselSub: { fontSize: 12, marginTop: 2 },

  gridRow: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  gridCard: { width: '47%' },
  gridTitle: { fontSize: 14, fontWeight: '600', marginTop: 10 },
  gridSub: { fontSize: 12, marginTop: 2 },

  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginHorizontal: 0,
  },
  trackTitle: { fontSize: 14, fontWeight: '600' },
  trackSub: { fontSize: 12, marginTop: 3 },
  trackPlayBtn: { padding: 8 },

  coverGlyph: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverGlyphText: {
    color: '#FFFFFF',
    fontWeight: '300',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  miniPlayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    paddingBottom: 24,
    gap: 10,
    borderTopWidth: 1,
  },
  miniTap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  miniTitle: { fontSize: 13, fontWeight: '600' },
  miniSub: { fontSize: 11, marginTop: 2 },
  miniPlayBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default MusicScreen;
