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
import { useTheme } from '../hooks/useTheme';
import {
  Sparkles,
  Wind,
  Sun,
  Leaf,
  HeartPulse,
  Play,
  ChevronRight,
  ChevronLeft,
} from './Icons';

type SessionCard = {
  id: string;
  title: string;
  meta: string;
  Icon: any;
  tint: string;
  tintSoft: string;
};

const BreatheScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, images, mode } = useTheme();
  const isNight = mode === 'night';

  const openSession = (id: string, title: string) =>
    navigation.navigate('BreathingSession', { id, title });

  const sessions: SessionCard[] = [
    { id: 'anxiety',  title: 'Anxiety Reset',   meta: '6 min · Gentle',          Icon: HeartPulse, tint: colors.statMint,   tintSoft: colors.statMintSoft },
    { id: 'deep',     title: 'Deep Breathing',  meta: '8 min · 4-7-8',           Icon: Wind,       tint: '#3B82F6',         tintSoft: 'rgba(59,130,246,0.14)' },
    { id: 'energize', title: 'Energize Breath', meta: '5 min · Box Breathing',   Icon: Sun,        tint: colors.statYellow, tintSoft: colors.statYellowSoft },
    { id: 'focus',    title: 'Focus & Clarity', meta: '5 min · Alternate Nostril', Icon: Leaf,     tint: colors.statPurple, tintSoft: colors.statPurpleSoft },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.6} style={styles.backBtn}>
            <ChevronLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sparkleBtn, { borderColor: colors.borderStrong }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanionChat', { mode: 'Pranayama Guru' })}
          >
            <Sparkles size={20} color={colors.statMint} />
          </TouchableOpacity>
        </View>

        {/* TITLE BLOCK */}
        <View style={styles.titleBlock}>
          <Text style={[styles.overline, { color: colors.statMint }]}>
            SOUNDSCAPES · PRACTICE
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Breathe</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Reset your body and mind.
          </Text>
        </View>

        {/* AI GURU HERO CARD */}
        <ImageBackground
          source={images.breatheHero}
          style={[styles.heroCard, { borderColor: colors.statMint }]}
          imageStyle={{ borderRadius: 24 }}
        >
          <View
            style={[
              styles.heroOverlay,
              { backgroundColor: isNight ? 'rgba(8,12,28,0.45)' : 'rgba(255,255,255,0.04)' },
            ]}
          />
          <View style={[styles.heroBadge, { backgroundColor: colors.statMintSoft }]}>
            <Sparkles size={14} color={colors.statMint} />
            <Text style={[styles.heroBadgeText, { color: colors.statMint }]}>AI COMPANION</Text>
          </View>
          <Text style={[styles.heroTitle, { color: isNight ? '#FFFFFF' : '#0F172A' }]}>
            Pranayama Guru
          </Text>
          <Text style={[styles.heroSub, { color: isNight ? 'rgba(255,255,255,0.88)' : '#0F172A' }]}>
            A calm coach for your breath. Personalized in the moment, never preachy.
          </Text>
          <TouchableOpacity
            style={[styles.heroCta, { backgroundColor: isNight ? colors.card : '#FFFFFF' }]}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('BreathingSession', { id: 'guided', title: 'Guided Session' })
            }
          >
            <Play size={13} color={colors.statMint} />
            <Text style={[styles.heroCtaText, { color: colors.textPrimary }]}>Start Session</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* RECOMMENDED FOR YOU */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Recommended for you
          </Text>
          <TouchableOpacity activeOpacity={0.7} style={styles.linkRow}>
            <Text style={[styles.linkText, { color: colors.statMint }]}>View all</Text>
            <ChevronRight size={16} color={colors.statMint} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.recCard, { borderColor: colors.border }]}
          activeOpacity={0.85}
          onPress={() => openSession('anxiety', 'Anxiety Reset')}
        >
          <View style={[styles.recIcon, { backgroundColor: colors.statMintSoft }]}>
            <HeartPulse size={22} color={colors.statMint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.recTitle, { color: colors.textPrimary }]}>Anxiety Reset</Text>
            <Text style={[styles.recMeta, { color: colors.textSecondary }]}>
              6 min · 4-7-8 Breathing · Gentle
            </Text>
            <Text style={[styles.recHint, { color: colors.statMint }]}>
              Suggested based on your{'\n'}evening rhythm.
            </Text>
          </View>
          <View style={[styles.recPlay, { backgroundColor: colors.statMintSoft }]}>
            <Play size={16} color={colors.statMint} />
          </View>
        </TouchableOpacity>

        {/* SESSIONS */}
        <View style={[styles.sectionHeader, { marginBottom: 8 }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sessions</Text>
        </View>

        {sessions.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.sessionRow,
              i < sessions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            activeOpacity={0.7}
            onPress={() => openSession(s.id, s.title)}
          >
            <View style={[styles.sessionIcon, { backgroundColor: s.tintSoft }]}>
              <s.Icon size={20} color={s.tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>{s.title}</Text>
              <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>{s.meta}</Text>
            </View>
            <ChevronRight size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // TITLE BLOCK
  titleBlock: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },

  // HERO CARD
  heroCard: {
    marginHorizontal: 20,
    height: 320,
    borderRadius: 24,
    borderWidth: 1.5,
    overflow: 'hidden',
    padding: 22,
    justifyContent: 'flex-start',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 14,
    letterSpacing: -0.5,
  },
  heroSub: {
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 240,
  },
  heroCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    marginTop: 'auto',
    shadowColor: '#0F172A',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroCtaText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // SECTIONS
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // RECOMMENDED CARD
  recCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  recIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  recMeta: {
    fontSize: 13,
    marginTop: 2,
  },
  recHint: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 8,
    lineHeight: 18,
  },
  recPlay: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // SESSION ROWS
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    marginHorizontal: 20,
  },
  sessionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  sessionMeta: {
    fontSize: 13,
    marginTop: 3,
  },
});

export default BreatheScreen;
