import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { ChevronLeft, ChevronRight, Play, Leaf, Target, Heart, Moon, Info, Check, Lock } from './Icons';
import techniquesData from '../utils/meditation-techniques.json';
import { FOUNDATIONS } from '../utils/foundations';
import { loadCompleted } from '../lib/foundationsProgress';

type Session = { id: string; title: string; durationMin: number; instruction: string };
type Technique = {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  why: string;
  citation: string;
  sessions: Session[];
};

const TECHNIQUES: Technique[] = techniquesData.techniques;

const TECH_STYLE: Record<string, { Icon: any; tint: string; tintSoftKey: 'statMintSoft' | 'statPurpleSoft' | 'statYellowSoft' }> = {
  'focused-attention': { Icon: Target, tint: '#3B82F6', tintSoftKey: 'statMintSoft' },
  'body-scan':          { Icon: Moon,   tint: '', tintSoftKey: 'statPurpleSoft' },
  'loving-kindness':    { Icon: Heart,  tint: '#EC4899', tintSoftKey: 'statYellowSoft' },
  'mindfulness':        { Icon: Leaf,   tint: '', tintSoftKey: 'statMintSoft' },
};

const MeditationScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [activeId, setActiveId] = useState<string>(TECHNIQUES[0].id);
  const active = TECHNIQUES.find(t => t.id === activeId) ?? TECHNIQUES[0];
  const style = TECH_STYLE[active.id];
  const tint = style.tint || colors.statMint;
  const tintSoft = (colors as any)[style.tintSoftKey] ?? colors.statMintSoft;

  // Foundations course progress — reloaded each time the screen refocuses so a
  // just-completed module unlocks the next one.
  const [completed, setCompleted] = useState<string[]>([]);
  useFocusEffect(
    React.useCallback(() => {
      loadCompleted().then(setCompleted);
    }, [])
  );
  // A module is unlocked if it's first, or the previous one is completed.
  const isUnlocked = (index: number) =>
    index === 0 || completed.includes(FOUNDATIONS[index - 1].id);

  const openModule = (index: number) => {
    const m = FOUNDATIONS[index];
    navigation.navigate('MeditationSession', {
      techniqueId: 'foundations',
      techniqueName: 'Foundations',
      title: m.title,
      instruction: m.subtitle,
      durationSec: m.durationSec,
      audio: m.audio,
      moduleId: m.id,
    });
  };

  const openSession = (session: Session) =>
    navigation.navigate('MeditationSession', {
      techniqueId: active.id,
      techniqueName: active.name,
      why: active.why,
      citation: active.citation,
      sessionId: session.id,
      title: session.title,
      durationMin: session.durationMin,
      instruction: session.instruction,
    });

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity activeOpacity={0.6} style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft color={colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.titleBlock}>
          <Text style={[styles.overline, { color: colors.statMint }]}>EVIDENCE-BASED PRACTICE</Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Meditation</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Four techniques backed by peer-reviewed research.
          </Text>
        </View>

        {/* FOUNDATIONS COURSE */}
        <View style={[styles.courseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.courseHead}>
            <View>
              <Text style={[styles.courseKicker, { color: colors.statMint }]}>NEW HERE? START WITH</Text>
              <Text style={[styles.courseTitle, { color: colors.textPrimary }]}>Foundations</Text>
              <Text style={[styles.courseSub, { color: colors.textSecondary }]}>
                {completed.length} of {FOUNDATIONS.length} complete · guided audio
              </Text>
            </View>
          </View>

          {FOUNDATIONS.map((m, i) => {
            const isDone = completed.includes(m.id);
            const unlocked = isUnlocked(i);
            const mins = Math.round(m.durationSec / 60);
            return (
              <TouchableOpacity
                key={m.id}
                activeOpacity={unlocked ? 0.7 : 1}
                disabled={!unlocked}
                onPress={() => unlocked && openModule(i)}
                style={[
                  styles.moduleRow,
                  i < FOUNDATIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.moduleIcon,
                    { backgroundColor: isDone ? colors.statMint : colors.statMintSoft },
                    !unlocked && { backgroundColor: colors.cardLight },
                  ]}
                >
                  {isDone ? (
                    <Check size={16} color="#FFFFFF" strokeWidth={3} />
                  ) : unlocked ? (
                    <Play size={14} color={colors.statMint} />
                  ) : (
                    <Lock size={14} color={colors.textSecondary} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.moduleTitle, { color: unlocked ? colors.textPrimary : colors.textSecondary }]}>
                    {m.order}. {m.title}
                  </Text>
                  <Text style={[styles.moduleSub, { color: colors.textSecondary }]} numberOfLines={1}>
                    {mins} min · {m.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Explore techniques</Text>
        </View>

        {/* TECHNIQUE TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TECHNIQUES.map(t => {
            const isActive = t.id === activeId;
            const s = TECH_STYLE[t.id];
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => setActiveId(t.id)}
                activeOpacity={0.85}
                style={[
                  styles.tab,
                  { borderColor: colors.border },
                  isActive && { backgroundColor: (colors as any)[s.tintSoftKey], borderColor: s.tint || colors.statMint },
                ]}
              >
                <s.Icon size={15} color={isActive ? (s.tint || colors.statMint) : colors.textSecondary} />
                <Text style={[styles.tabText, { color: isActive ? (s.tint || colors.statMint) : colors.textSecondary }]}>
                  {t.shortName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* WHY THIS WORKS */}
        <View style={[styles.whyCard, { backgroundColor: tintSoft, borderColor: tint }]}>
          <Text style={[styles.techName, { color: colors.textPrimary }]}>{active.name}</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>{active.tagline}</Text>
          <View style={styles.whyRow}>
            <Info size={14} color={tint} />
            <Text style={[styles.whyLabel, { color: tint }]}>WHY THIS WORKS</Text>
          </View>
          <Text style={[styles.whyText, { color: colors.textPrimary }]}>{active.why}</Text>
          <Text style={[styles.citation, { color: colors.textSecondary }]}>{active.citation}</Text>
        </View>

        {/* SESSIONS */}
        <View style={[styles.sectionHeader]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Sessions</Text>
        </View>

        {active.sessions.map((s, i) => (
          <TouchableOpacity
            key={s.id}
            style={[
              styles.sessionRow,
              i < active.sessions.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
            activeOpacity={0.7}
            onPress={() => openSession(s)}
          >
            <View style={[styles.sessionIcon, { backgroundColor: tintSoft }]}>
              <Play size={16} color={tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sessionTitle, { color: colors.textPrimary }]}>{s.title}</Text>
              <Text style={[styles.sessionMeta, { color: colors.textSecondary }]}>{s.durationMin} min · {active.shortName}</Text>
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
  headerRow: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 4 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },

  titleBlock: { paddingHorizontal: 20, paddingBottom: 18 },
  overline: { fontSize: 11, fontWeight: '700', letterSpacing: 2.5 },
  title: { fontSize: 34, fontWeight: '700', letterSpacing: -0.8, marginTop: 8 },
  subtitle: { fontSize: 15, marginTop: 4 },

  courseCard: { marginHorizontal: 20, marginBottom: 8, borderRadius: 20, borderWidth: 1, padding: 16 },
  courseHead: { marginBottom: 8 },
  courseKicker: { fontSize: 10, fontWeight: '700', letterSpacing: 1.6 },
  courseTitle: { fontSize: 20, fontWeight: '700', marginTop: 3, letterSpacing: -0.3 },
  courseSub: { fontSize: 12, marginTop: 2 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  moduleIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 14, fontWeight: '600' },
  moduleSub: { fontSize: 12, marginTop: 2 },

  tabsRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 4 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 9, paddingHorizontal: 14, borderRadius: 999, borderWidth: 1,
  },
  tabText: { fontSize: 13, fontWeight: '600' },

  whyCard: { marginHorizontal: 20, marginTop: 20, padding: 18, borderRadius: 20, borderWidth: 1 },
  techName: { fontSize: 20, fontWeight: '700' },
  tagline: { fontSize: 14, marginTop: 3 },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 },
  whyLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  whyText: { fontSize: 14, lineHeight: 21, marginTop: 6 },
  citation: { fontSize: 11, marginTop: 10, fontStyle: 'italic', lineHeight: 16 },

  sectionHeader: { paddingHorizontal: 20, marginTop: 28, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },

  sessionRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, gap: 14, marginHorizontal: 20,
  },
  sessionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sessionTitle: { fontSize: 15, fontWeight: '600' },
  sessionMeta: { fontSize: 13, marginTop: 3 },
});

export default MeditationScreen;
