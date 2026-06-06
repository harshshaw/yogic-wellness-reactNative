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
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import { useTheme } from '../hooks/useTheme';
import {
  Sparkles,
  Wind,
  Flame,
  Moon,
  HeartPulse,
  Play,
  ChevronRight,
} from './Icons';

type SessionCard = {
  id: string;
  title: string;
  duration: string;
  level: string;
  Icon: any;
  tint: string;
};

const sessions: SessionCard[] = [
  { id: 'anxiety', title: 'Anxiety Reset', duration: '6 min', level: 'Gentle', Icon: HeartPulse, tint: '#10B981' },
  { id: 'energy', title: 'Energy Boost', duration: '4 min', level: 'Active', Icon: Flame, tint: '#FB923C' },
  { id: 'focus', title: 'Focus Mode', duration: '7 min', level: 'Steady', Icon: Wind, tint: '#3B82F6' },
  { id: 'sleep', title: 'Calm Before Sleep', duration: '10 min', level: 'Soft', Icon: Moon, tint: '#8B5CF6' },
  { id: 'healing', title: 'Deep Healing', duration: '12 min', level: 'Restorative', Icon: HeartPulse, tint: '#F472B6' },
];

const BreatheScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, images } = useTheme();

  const openSession = (id: string, title: string) =>
    navigation.navigate('BreathingSession', { id, title });

  return (
    <View style={[warm.screen, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={warm.scroll} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={warm.topRow}>
          <View>
            <Text style={warm.overline}>Soundscapes · Practice</Text>
            <Text style={[warm.h1, { marginTop: 4, color: colors.textPrimary }]}>Breathe</Text>
            <Text style={[warm.body, { color: colors.textSecondary }]}>Reset your body and mind.</Text>
          </View>
          <TouchableOpacity
            style={[warm.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanion', { mode: 'Pranayama Guru' })}
          >
            <Sparkles size={18} color={colors.accent} />
          </TouchableOpacity>
        </View>

        {/* AI GURU HERO CARD — image-backed */}
        <ImageBackground
          source={images.breatheHero}
          style={styles.heroCard}
          imageStyle={{ borderRadius: 24 }}
        >
          <View style={styles.heroImageOverlay} />
          <View style={styles.heroIconRow}>
            <View style={styles.heroIcon}>
              <Sparkles size={20} color={COLORS.deepBrown} />
            </View>
            <Text style={styles.heroTag}>AI COMPANION</Text>
          </View>
          <Text style={styles.heroTitle}>Pranayama Guru</Text>
          <Text style={styles.heroSub}>
            A calm coach for your breath. Personalized in the moment, never preachy.
          </Text>
          <TouchableOpacity
            style={[warm.pillPrimary, { marginTop: 18, alignSelf: 'flex-start' }]}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('BreathingSession', { id: 'guided', title: 'Guided Session' })}
          >
            <Play size={13} color={COLORS.deepBrown} />
            <Text style={warm.pillPrimaryText}>Start Session</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* RECOMMENDED */}
        <View style={warm.sectionRow}>
          <Text style={[warm.h2, { color: colors.textPrimary }]}>Recommended for you</Text>
        </View>
        <TouchableOpacity
          style={[styles.recCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.9}
          onPress={() => openSession('anxiety', 'Anxiety Reset')}
        >
          <View style={[styles.recIcon, { backgroundColor: colors.statMintSoft }]}>
            <HeartPulse size={20} color={colors.statMint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.recTitle, { color: colors.textPrimary }]}>Anxiety Reset</Text>
            <Text style={[styles.recMeta, { color: colors.textSecondary }]}>6 min · 4-7-8 protocol · Gentle</Text>
            <Text style={[styles.recHint, { color: colors.accent }]}>Suggested based on your evening rhythm.</Text>
          </View>
          <View style={[styles.recPlay, { backgroundColor: colors.accent }]}>
            <Play size={14} color={COLORS.deepBrown} />
          </View>
        </TouchableOpacity>

        {/* CATEGORIES */}
        <View style={warm.sectionRow}>
          <Text style={[warm.h2, { color: colors.textPrimary }]}>Sessions</Text>
        </View>
        {sessions.map(s => (
          <TouchableOpacity
            key={s.id}
            style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
            activeOpacity={0.85}
            onPress={() => openSession(s.id, s.title)}
          >
            <View style={[styles.rowIcon, { backgroundColor: hexAlpha(s.tint, 0.16) }]}>
              <s.Icon size={20} color={s.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{s.title}</Text>
              <Text style={[styles.rowMeta, { color: colors.textSecondary }]}>{s.duration} · {s.level}</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const hexAlpha = (hex: string, alpha: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.32)',
    padding: 22,
    overflow: 'hidden',
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  heroImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    backgroundColor: 'rgba(20,12,8,0.55)',
  },
  heroGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212,175,55,0.12)',
    right: -50,
    top: -50,
  },
  heroIconRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  heroIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTag: {
    color: COLORS.primaryGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.4,
  },
  heroTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginTop: 14,
    letterSpacing: -0.4,
  },
  heroSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.16)',
    padding: 14,
    gap: 14,
  },
  recIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '700' },
  recMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  recHint: { color: COLORS.primaryGold, fontSize: 11, marginTop: 6, fontStyle: 'italic' },
  recPlay: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.control,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: { color: COLORS.textPrimary, fontSize: 15, fontWeight: '600' },
  rowMeta: { color: COLORS.textSecondary, fontSize: 12, marginTop: 3 },
});

export default BreatheScreen;
