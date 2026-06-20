import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useStreakStorage } from '../hooks/useStreakStorage';
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Crown,
  Flame,
  Star,
  Calendar,
  Clock,
  Bell,
  Moon,
  Lock,
  Globe,
  Info,
  Activity,
  Leaf,
} from './Icons';

// Static user profile — swap for real auth/user data when available.
const USER = {
  name: 'Arjun Sharma',
  email: 'arjun.sharma@gmail.com',
  initials: 'AS',
  memberSince: 'Jan 2026',
};

const APP_VERSION = '1.0.0';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, mode, toggle } = useTheme();
  const isNight = mode === 'night';
  const { data } = useStreakStorage();

  const totalMinutes = useMemo(
    () => data.history.reduce((sum, d) => sum + (d.minutesLogged ?? 0), 0),
    [data.history]
  );

  const stats = [
    { label: 'Day streak',  value: String(data.currentStreak),     Icon: Flame,    tint: colors.statOrange, soft: colors.statOrangeSoft },
    { label: 'Best streak', value: String(data.longestStreak),     Icon: Star,     tint: colors.statYellow, soft: colors.statYellowSoft },
    { label: 'Total days',  value: String(data.totalDaysCompleted), Icon: Calendar, tint: colors.statPurple, soft: colors.statPurpleSoft },
    { label: 'Minutes',     value: String(totalMinutes),            Icon: Clock,    tint: colors.statMint,   soft: colors.statMintSoft },
  ];

  const heroGradient: readonly [string, string, string] = isNight
    ? ['#2A2150', '#1F1A40', '#15123A']
    : ['#7C3AED', '#8B5CF6', '#A78BFA'];

  const premiumGradient: readonly [string, string] = ['#F59E0B', '#FB923C'];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.backBtn}
          onPress={() => navigation.canGoBack() && navigation.goBack()}
        >
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Profile</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── PROFILE CARD ── */}
        <LinearGradient
          colors={heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{USER.name}</Text>
            <Text style={styles.profileEmail}>{USER.email}</Text>
            <Text style={styles.memberSince}>Member since {USER.memberSince}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.8}>
            <Pencil size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── SUBSCRIPTION ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SUBSCRIPTION</Text>
        <LinearGradient
          colors={premiumGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.subCard}
        >
          <View style={styles.subTopRow}>
            <View style={styles.subBadge}>
              <Crown size={16} color="#FFFFFF" />
              <Text style={styles.subBadgeText}>FREE PLAN</Text>
            </View>
            <Text style={styles.subPrice}>₹0/mo</Text>
          </View>
          <Text style={styles.subTitle}>Unlock Karmana Premium</Text>
          <Text style={styles.subDesc}>
            Unlimited AI companion sessions, all soundscapes, advanced insights &amp; offline downloads.
          </Text>
          <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.9}>
            <Text style={styles.upgradeBtnText}>Upgrade to Premium</Text>
            <ChevronRight size={18} color="#B45309" />
          </TouchableOpacity>
        </LinearGradient>

        {/* ── PROGRESS ── */}
        <View style={styles.sectionHeadRow}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: 0 }]}>YOUR PROGRESS</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Main', { screen: 'Progress' })}
          >
            <Text style={[styles.viewAll, { color: colors.statPurple }]}>View all</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          {stats.map(s => (
            <View
              key={s.label}
              style={[styles.statTile, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={[styles.statIcon, { backgroundColor: s.soft }]}>
                <s.Icon size={18} color={s.tint} />
              </View>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── ACCOUNT SETTINGS ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT SETTINGS</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row Icon={Bell} tint={colors.statRose} soft={colors.statRoseSoft} label="Notifications"
            sub="Reminders & nudges" colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row
            Icon={Moon} tint={colors.statPurple} soft={colors.statPurpleSoft}
            label="Dark mode" sub={isNight ? 'On' : 'Off'} colors={colors}
            right={
              <Switch
                value={isNight}
                onValueChange={toggle}
                trackColor={{ false: colors.borderStrong, true: colors.statPurple }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <Divider colors={colors} />
          <Row Icon={Clock} tint={colors.statMint} soft={colors.statMintSoft} label="Daily reminder"
            sub="8:00 PM" colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row Icon={Lock} tint={colors.statOrange} soft={colors.statOrangeSoft} label="Privacy & Security"
            colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row Icon={Globe} tint={colors.statYellow} soft={colors.statYellowSoft} label="Language"
            sub="English" colors={colors} onPress={() => {}} />
        </View>

        {/* ── PREFERENCES / GENERAL ── */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>GENERAL</Text>
        <View style={[styles.group, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Row Icon={Activity} tint={colors.statMint} soft={colors.statMintSoft} label="Goals & targets"
            colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row Icon={Star} tint={colors.statYellow} soft={colors.statYellowSoft} label="Rate the app"
            colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row Icon={Info} tint={colors.statPurple} soft={colors.statPurpleSoft} label="Help & Support"
            colors={colors} onPress={() => {}} />
          <Divider colors={colors} />
          <Row Icon={Leaf} tint={colors.statOrange} soft={colors.statOrangeSoft} label="About Karmana"
            colors={colors} onPress={() => {}} />
        </View>

        {/* ── SIGN OUT ── */}
        <TouchableOpacity
          style={[styles.signOut, { borderColor: colors.borderStrong }]}
          activeOpacity={0.8}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textSecondary }]}>
          Karmana · v{APP_VERSION}
        </Text>
      </ScrollView>
    </View>
  );
};

// ─── Settings row ───────────────────────────────────────────────────────
const Row = ({
  Icon, tint, soft, label, sub, colors, right, onPress,
}: {
  Icon: any; tint: string; soft: string; label: string; sub?: string;
  colors: any; right?: React.ReactNode; onPress?: () => void;
}) => (
  <TouchableOpacity
    style={styles.row}
    activeOpacity={onPress ? 0.6 : 1}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={[styles.rowIcon, { backgroundColor: soft }]}>
      <Icon size={18} color={tint} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{label}</Text>
      {sub ? <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{sub}</Text> : null}
    </View>
    {right ?? <ChevronRight size={18} color={colors.textSecondary} />}
  </TouchableOpacity>
);

const Divider = ({ colors }: { colors: any }) => (
  <View style={[styles.divider, { backgroundColor: colors.border }]} />
);

const styles = StyleSheet.create({
  container: { flex: 1 },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },

  // PROFILE CARD
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 18,
    borderRadius: 22,
  },
  avatar: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.45)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: 0.5 },
  profileName: { color: '#FFFFFF', fontSize: 19, fontWeight: '800', letterSpacing: -0.3 },
  profileEmail: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 },
  memberSince: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 6, fontWeight: '600' },
  editBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },

  // SECTION LABELS
  sectionLabel: {
    fontSize: 11, fontWeight: '800', letterSpacing: 1.6,
    marginTop: 26, marginBottom: 12, marginHorizontal: 24,
  },
  sectionHeadRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 26, marginHorizontal: 24, marginBottom: 12,
  },
  viewAll: { fontSize: 13, fontWeight: '700' },

  // SUBSCRIPTION
  subCard: { marginHorizontal: 20, borderRadius: 22, padding: 20 },
  subTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  subBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999,
  },
  subBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  subPrice: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  subTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginTop: 16, letterSpacing: -0.3 },
  subDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 19, marginTop: 6 },
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#FFFFFF', borderRadius: 14,
    paddingVertical: 13, marginTop: 16,
  },
  upgradeBtnText: { color: '#B45309', fontSize: 15, fontWeight: '800' },

  // PROGRESS STATS
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 20, gap: 12,
  },
  statTile: {
    width: '47.5%',
    borderRadius: 18, borderWidth: 1,
    padding: 16,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  statValue: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 13, fontWeight: '600', marginTop: 2 },

  // GROUPS / ROWS
  group: {
    marginHorizontal: 20,
    borderRadius: 18, borderWidth: 1,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowIcon: {
    width: 36, height: 36, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowSub: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginLeft: 66 },

  // SIGN OUT
  signOut: {
    marginHorizontal: 20, marginTop: 28,
    borderRadius: 14, borderWidth: 1.5,
    paddingVertical: 15, alignItems: 'center',
  },
  signOutText: { color: '#EF4444', fontSize: 15, fontWeight: '800' },

  version: { textAlign: 'center', fontSize: 12, marginTop: 18, fontWeight: '600' },
});

export default ProfileScreen;
