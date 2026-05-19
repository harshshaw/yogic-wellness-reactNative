import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import {
  Sparkles,
  Target,
  Bell,
  Settings,
  Lock,
  Crown,
  Globe,
  Moon,
  User,
  HeartPulse,
  ChevronRight,
} from './Icons';

type Mode = 'Pranayama Guru' | 'Gita Companion' | 'Sleep Guide' | 'Confidence Coach';
const modes: { id: Mode; tagline: string; tint: string; Icon: any }[] = [
  { id: 'Pranayama Guru', tagline: 'Breath coaching', tint: COLORS.primaryGold, Icon: HeartPulse },
  { id: 'Gita Companion', tagline: 'Wisdom & reflection', tint: COLORS.warmBeige, Icon: Sparkles },
  { id: 'Sleep Guide', tagline: 'Bedtime support', tint: COLORS.mutedTeal, Icon: Moon },
  { id: 'Confidence Coach', tagline: 'Encouragement', tint: COLORS.sunsetOrange, Icon: Target },
];

const settings = [
  { id: 'goals', label: 'My Goals', Icon: Target },
  { id: 'companion', label: 'AI Companion Settings', Icon: Sparkles },
  { id: 'notifs', label: 'Notifications', Icon: Bell },
  { id: 'reminders', label: 'Reminder Schedule', Icon: Bell },
  { id: 'theme', label: 'Theme Preferences', Icon: Settings },
  { id: 'language', label: 'Language', Icon: Globe },
  { id: 'privacy', label: 'Privacy & Safety', Icon: Lock },
];

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [activeMode, setActiveMode] = useState<Mode>('Pranayama Guru');

  return (
    <View style={warm.screen}>
      <ScrollView contentContainerStyle={warm.scroll} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={warm.topRow}>
          <View>
            <Text style={warm.overline}>Settings</Text>
            <Text style={[warm.h1, { marginTop: 4 }]}>Profile</Text>
            <Text style={warm.body}>Your journey, your way.</Text>
          </View>
          <TouchableOpacity
            style={warm.iconBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('AICompanion', { mode: activeMode })}
          >
            <Sparkles size={18} color={COLORS.primaryGold} />
          </TouchableOpacity>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <User size={28} color={COLORS.deepBrown} />
          </View>
          <Text style={styles.heroName}>Arjun</Text>
          <Text style={styles.heroSub}>Seeker · Level 3 · 1,250 / 2,000 XP</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: '62%' }]} />
          </View>
          <View style={styles.heroStats}>
            <Stat n="48" l="Days" />
            <View style={styles.statDivider} />
            <Stat n="126" l="Sessions" />
            <View style={styles.statDivider} />
            <Stat n="89%" l="Consistency" />
          </View>
        </View>

        {/* DAILY INTENTION */}
        <View style={[warm.goldCard, { marginTop: 14 }]}>
          <Text style={warm.overline}>Today’s intention</Text>
          <Text style={[warm.h3, { marginTop: 6, fontStyle: 'italic' }]}>
            “Breath first. Decisions second.”
          </Text>
          <TouchableOpacity style={styles.editLink} activeOpacity={0.7}>
            <Text style={styles.editLinkTxt}>Edit intention</Text>
            <ChevronRight size={14} color={COLORS.primaryGold} />
          </TouchableOpacity>
        </View>

        {/* COMPANION MODE */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Change companion</Text>
        </View>
        <View style={styles.modesGrid}>
          {modes.map(m => {
            const active = activeMode === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.modeCard, active && styles.modeCardActive]}
                activeOpacity={0.85}
                onPress={() => setActiveMode(m.id)}
              >
                <View style={[styles.modeIcon, { backgroundColor: hexA(m.tint, 0.16) }]}>
                  <m.Icon size={18} color={m.tint} />
                </View>
                <Text style={styles.modeName}>{m.id}</Text>
                <Text style={styles.modeTag}>{m.tagline}</Text>
                {active && <View style={styles.modeDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* SETTINGS LIST */}
        <View style={warm.sectionRow}>
          <Text style={warm.h2}>Settings</Text>
        </View>
        <View style={styles.settingsCard}>
          {settings.map((s, i) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.settingRow, i < settings.length - 1 && styles.settingDivider]}
              activeOpacity={0.7}
            >
              <View style={styles.settingIcon}>
                <s.Icon size={16} color={COLORS.primaryGold} />
              </View>
              <Text style={styles.settingLabel}>{s.label}</Text>
              <ChevronRight size={16} color={COLORS.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* PREMIUM */}
        <TouchableOpacity style={styles.premiumCard} activeOpacity={0.9}>
          <View style={styles.premiumIcon}>
            <Crown size={20} color={COLORS.deepBrown} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.premiumTitle}>Yogic Wellness · Premium</Text>
            <Text style={styles.premiumSub}>All companions. All sessions. Forever.</Text>
          </View>
          <ChevronRight size={18} color={COLORS.deepBrown} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const Stat = ({ n, l }: { n: string; l: string }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={styles.statN}>{n}</Text>
    <Text style={styles.statL}>{l}</Text>
  </View>
);

const hexA = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    padding: 22,
    alignItems: 'center',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  heroName: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700', marginTop: 12 },
  heroSub: { color: COLORS.textSecondary, fontSize: 12, marginTop: 4 },
  xpBar: {
    width: '100%',
    height: 5,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: 3,
    marginTop: 14,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: COLORS.primaryGold, borderRadius: 3 },
  heroStats: {
    flexDirection: 'row',
    marginTop: 18,
    width: '100%',
  },
  statDivider: { width: 1, backgroundColor: 'rgba(212,175,55,0.12)' },
  statN: { color: COLORS.textPrimary, fontSize: 18, fontWeight: '700' },
  statL: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },

  editLink: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 4 },
  editLinkTxt: { color: COLORS.primaryGold, fontSize: 12, fontWeight: '600' },

  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modeCard: {
    width: '48.5%',
    backgroundColor: COLORS.cardBrown,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    padding: 14,
    position: 'relative',
  },
  modeCardActive: {
    borderColor: COLORS.primaryGold,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  modeIcon: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10,
  },
  modeName: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '700' },
  modeTag: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  modeDot: {
    position: 'absolute',
    top: 12, right: 12,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.primaryGold,
  },

  settingsCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.06)',
  },
  settingIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  settingLabel: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '500', flex: 1 },

  premiumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryGold,
    borderRadius: RADII.card,
    padding: 16,
    marginTop: 20,
    gap: 12,
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 6,
  },
  premiumIcon: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(28,20,15,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  premiumTitle: { color: COLORS.deepBrown, fontSize: 14, fontWeight: '700' },
  premiumSub: { color: COLORS.deepBrown, fontSize: 12, marginTop: 2, opacity: 0.8 },
});

export default ProfileScreen;
