import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { useReflection, ReflectionData } from '../hooks/useReflection';

// ── icons ──────────────────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const SunriseIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2v4M4.93 7.93l2.83 2.83M2 14h4M18.07 7.93l-2.83 2.83M22 14h-4M5 19h14M8 19a4 4 0 0 1 8 0" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

// ── mood data ──────────────────────────────────────────────────────────────────
const MOODS = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Tired' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
];

const ENERGY_OPTIONS: { value: ReflectionData['energy']; label: string; color: string; bg: string }[] = [
  { value: 'low',    label: '🪫  Low',    color: '#EF4444', bg: '#FEE2E2' },
  { value: 'medium', label: '⚡ Medium', color: '#F59E0B', bg: '#FEF3C7' },
  { value: 'high',   label: '🔋 High',   color: '#10B981', bg: '#D1FAE5' },
];

const INTENTION_CHIPS = [
  'Stay calm', 'Focus on work', 'Be present', 'Practice gratitude',
  'Move my body', 'Rest & recover', 'Connect with others',
];

const PURPLE = '#7C3AED';
const PURPLE_SOFT = '#EDE9FE';

export default function MorningReflectionScreen() {
  const navigation = useNavigation<any>();
  const { complete } = useReflection();

  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<ReflectionData['energy']>('medium');
  const [intention, setIntention] = useState('');
  const [selectedChip, setSelectedChip] = useState<string | null>(null);

  const handleChip = (chip: string) => {
    setSelectedChip(chip === selectedChip ? null : chip);
    setIntention(chip === selectedChip ? '' : chip);
  };

  const handleSave = () => {
    complete({ mood, energy, intention: intention || selectedChip || 'Be present' });
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={s.root}
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── HEADER ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <ChevronLeft />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <View style={s.iconCircle}>
              <SunriseIcon />
            </View>
            <Text style={s.title}>Morning Reflection</Text>
            <Text style={s.subtitle}>How are you arriving today?{'\n'}Let's personalize your day.</Text>
          </View>
        </View>

        {/* ── MOOD ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>How are you feeling?</Text>
          <View style={s.moodRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[s.moodItem, mood === m.value && s.moodItemActive]}
                onPress={() => setMood(m.value)}
                activeOpacity={0.75}
              >
                <Text style={s.moodEmoji}>{m.emoji}</Text>
                <Text style={[s.moodLabel, mood === m.value && { color: PURPLE, fontWeight: '700' }]}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── ENERGY ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>What's your energy level?</Text>
          <View style={s.energyRow}>
            {ENERGY_OPTIONS.map((e) => (
              <TouchableOpacity
                key={e.value}
                style={[
                  s.energyBtn,
                  { borderColor: energy === e.value ? e.color : '#E5E7EB' },
                  energy === e.value && { backgroundColor: e.bg },
                ]}
                onPress={() => setEnergy(e.value)}
                activeOpacity={0.8}
              >
                <Text style={[s.energyText, { color: energy === e.value ? e.color : '#6B7280' }]}>
                  {e.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── INTENTION ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Set your intention for today</Text>
          {/* chips */}
          <View style={s.chipsWrap}>
            {INTENTION_CHIPS.map((chip) => (
              <TouchableOpacity
                key={chip}
                style={[
                  s.chip,
                  selectedChip === chip && { backgroundColor: PURPLE_SOFT, borderColor: PURPLE },
                ]}
                onPress={() => handleChip(chip)}
                activeOpacity={0.75}
              >
                <Text style={[s.chipText, selectedChip === chip && { color: PURPLE }]}>
                  {chip}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* free text */}
          <TextInput
            style={s.textInput}
            placeholder="Or write your own intention…"
            placeholderTextColor="#9CA3AF"
            value={selectedChip ? '' : intention}
            onChangeText={(t) => { setSelectedChip(null); setIntention(t); }}
            onFocus={() => setSelectedChip(null)}
            multiline
          />
        </View>

        {/* ── SAVE ── */}
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.88}>
          <Text style={s.saveBtnText}>Save &amp; Continue →</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAF7' },

  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 4 },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { alignItems: 'center', marginTop: 16, paddingBottom: 8 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: PURPLE_SOFT, alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: PURPLE, letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 6, lineHeight: 20 },

  section: { marginTop: 28, paddingHorizontal: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 14 },

  // mood
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodItem: {
    alignItems: 'center', paddingVertical: 12, paddingHorizontal: 10,
    borderRadius: 16, borderWidth: 1.5, borderColor: '#E5E7EB',
    backgroundColor: '#fff', flex: 1, marginHorizontal: 3,
  },
  moodItemActive: { borderColor: PURPLE, backgroundColor: PURPLE_SOFT },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },

  // energy
  energyRow: { flexDirection: 'row', gap: 10 },
  energyBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1.5, backgroundColor: '#fff', alignItems: 'center',
  },
  energyText: { fontSize: 14, fontWeight: '600' },

  // intention chips
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 999, borderWidth: 1, borderColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  chipText: { fontSize: 13, color: '#374151', fontWeight: '500' },

  textInput: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 14,
    padding: 14, fontSize: 14, color: '#0F172A',
    backgroundColor: '#fff', minHeight: 60, textAlignVertical: 'top',
  },

  saveBtn: {
    marginHorizontal: 20, marginTop: 32,
    backgroundColor: PURPLE, borderRadius: 16,
    paddingVertical: 18, alignItems: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 }, elevation: 6,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
