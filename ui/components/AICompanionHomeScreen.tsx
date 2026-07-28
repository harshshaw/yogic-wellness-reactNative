import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../hooks/useTheme';
import BrandLogo from './BrandLogo';
import {
  Chat,
  Frown,
  Heart,
  Mic,
  Moon,
  SleepyFace,
  Sparkles,
  Target,
} from './Icons';
import type { CompanionMode } from '../lib/aiCompanion';

type ChipMode = {
  id: string;
  label: string;
  prompt: string;
  Icon: any;
};

type Persona = {
  mode: CompanionMode;
  label: string;
  blurb: string;
  Icon: any;
};

// The selectable companion "tabs" — each opens the chat in a distinct persona.
const personas: Persona[] = [
  { mode: 'Gita Companion',   label: 'Gita',         blurb: 'Wisdom & meaning',    Icon: Sparkles },
  { mode: 'Sleep Guide',      label: 'Sleep',        blurb: 'Wind down & rest',    Icon: Moon },
  { mode: 'Confidence Coach', label: 'Confidence',   blurb: 'Courage & momentum',  Icon: Target },
  { mode: 'Relationship Guru', label: 'Relationship', blurb: 'Love & connection',  Icon: Heart },
];

const AICompanionHomeScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, mode } = useTheme();
  const insets = useSafeAreaInsets();
  const isNight = mode === 'night';

  const heroGradient: readonly [string, string, string] = isNight
    ? ['#2A2150', '#1F1A40', '#15123A']
    : ['#F3E8FF', '#EDE9FE', '#E0E7FF'];
    

  const launch = (companionMode: any, prompt: string) =>
    navigation.navigate('AICompanionChat', { mode: companionMode, prompt });

  const chips: ChipMode[] = [
    { id: 'anxious',    label: 'I feel anxious',  prompt: "I'm feeling anxious right now",  Icon: Frown },
    { id: 'sleep',      label: "Can't sleep well", prompt: "I can't sleep well",             Icon: SleepyFace },
    { id: 'motivation', label: 'Need motivation', prompt: 'I need some motivation',         Icon: Heart },
    { id: 'talk',       label: 'Just want to talk', prompt: 'I just want to talk',           Icon: Chat },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
       

        {/* TITLE BLOCK */}
        <View style={styles.titleBlock}>
          <View style={styles.overlineRow}>
            <Sparkles size={14} color={colors.statPurple} />
            <Text style={[styles.overline, { color: colors.statPurple }]}>AI COMPANION</Text>
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Your AI Companion</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Here for you, always.
          </Text>
        </View>

        {/* HERO CARD with gradient + lotus + mountains */}
        <LinearGradient
          colors={heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <MountainSilhouette />
          <View style={styles.lotusWrap}>
            <BrandLogo size={72} />
          </View>
          <Text style={[styles.heroPrompt, { color: isNight ? '#F1EBFF' : '#0F172A' }]}>
            How are you feeling{'\n'}today, Arjun?
          </Text>
        </LinearGradient>

        {/* 2x2 CHIP GRID */}
        <View style={styles.chipGrid}>
          {chips.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => launch('Gita Companion', c.prompt)}
            >
              <View style={[styles.chipIcon, { backgroundColor: colors.statPurpleSoft }]}>
                <c.Icon size={16} color={colors.statPurple} />
              </View>
              <Text style={[styles.chipLabel, { color: colors.textPrimary }]}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* COMPANION PERSONAS (tabs) */}
        <View style={styles.personaHeader}>
          <Text style={[styles.personaTitle, { color: colors.textPrimary }]}>
            Choose a companion
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.personaRow}
        >
          {personas.map(p => (
            <TouchableOpacity
              key={p.mode}
              style={[styles.personaCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => launch(p.mode, '')}
            >
              <View style={[styles.personaIcon, { backgroundColor: colors.statPurpleSoft }]}>
                <p.Icon size={20} color={colors.statPurple} />
              </View>
              <Text style={[styles.personaLabel, { color: colors.textPrimary }]}>{p.label}</Text>
              <Text style={[styles.personaBlurb, { color: colors.textSecondary }]}>{p.blurb}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* MIC BUTTON */}
        <View style={styles.micArea}>
          <View style={[styles.micRing, { backgroundColor: colors.statPurpleSoft }]}>
            <TouchableOpacity
              style={[styles.micBtn, { backgroundColor: colors.statPurple }]}
              activeOpacity={0.85}
              onPress={() => launch('Gita Companion', '')}
            >
              <Mic size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.micLabel, { color: colors.textSecondary }]}>Tap to talk</Text>
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Soft mountain silhouettes for the hero ─────────────────────────────
const MountainSilhouette = () => (
  <View style={StyleSheet.absoluteFillObject}>
    <Svg
      width="100%"
      height="100%"
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMax slice"
    >
      {/* far mountains */}
      <Path
        d="M0 140 L40 120 L80 132 L120 110 L160 124 L200 108 L240 122 L280 112 L320 130 L320 200 L0 200 Z"
        fill="rgba(167,139,250,0.16)"
      />
      {/* trees mid */}
      <Path
        d="M0 160 L20 152 L25 148 L30 152 L40 158 L50 150 L55 145 L60 150 L75 158 L90 152 L100 156 L115 148 L120 156 L130 160 L0 160 Z"
        fill="rgba(139,92,246,0.22)"
      />
      <Path
        d="M200 160 L210 152 L218 156 L228 148 L235 156 L245 150 L255 154 L265 146 L275 154 L285 148 L295 154 L305 150 L320 160 L200 160 Z"
        fill="rgba(139,92,246,0.22)"
      />
    </Svg>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtnOutline: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  dotsBtn: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },

  // TITLE BLOCK
  titleBlock: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 18 },
  overlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 2.4 },
  title: { fontSize: 32, fontWeight: '700', letterSpacing: -0.6, marginTop: 10 },
  subtitle: { fontSize: 14, marginTop: 6 },

  // HERO
  heroCard: {
    marginHorizontal: 20,
    height: 230,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotusWrap: { marginBottom: 12 },
  heroPrompt: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
    textAlign: 'center',
    lineHeight: 30,
  },

  // CHIP GRID
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    marginTop: 22,
    gap: 12,
  },
  chip: {
    width: '47.5%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipIcon: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  chipLabel: { fontSize: 14, fontWeight: '600' },

  // PERSONAS
  personaHeader: { paddingHorizontal: 20, marginTop: 30 },
  personaTitle: { fontSize: 16, fontWeight: '700', letterSpacing: -0.2 },
  personaRow: {
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
  },
  personaCard: {
    width: 120,
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  personaIcon: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  personaLabel: { fontSize: 14, fontWeight: '700' },
  personaBlurb: { fontSize: 12, marginTop: 3 },

  // MIC
  micArea: { alignItems: 'center', marginTop: 40 },
  micRing: {
    width: 96, height: 96, borderRadius: 48,
    alignItems: 'center', justifyContent: 'center',
  },
  micBtn: {
    width: 76, height: 76, borderRadius: 38,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  micLabel: { fontSize: 14, fontWeight: '600', marginTop: 14 },
});

export default AICompanionHomeScreen;
