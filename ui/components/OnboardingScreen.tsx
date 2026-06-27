import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { saveOnboarding, OnboardingData } from '../utils/onboardingStorage';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../lib/apiClient';

const GREEN = '#10B981';
const INK = '#0F172A';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

const GENDERS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];
const ACTIVITY = ['Sedentary', 'Light', 'Moderate', 'Active', 'Very active'];
const GOALS = [
  'Reduce stress',
  'Better sleep',
  'Improve focus',
  'More energy',
  'Emotional balance',
  'Build a habit',
];
const HEARD = [
  'Friend or family',
  'Social media',
  'App Store',
  'Web search',
  'Advertisement',
  'Other',
];

const TOTAL_STEPS = 3;

export default function OnboardingScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { token, markOnboardingComplete } = useAuth();

  const [step, setStep] = useState(0);

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState('');
  const [howHeard, setHowHeard] = useState('');

  const toggleGoal = (g: string) =>
    setGoals(prev => (prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]));

  const goToMain = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  const finish = async () => {
    const data: OnboardingData = {
      age,
      gender,
      occupation,
      heightCm,
      weightKg,
      activityLevel,
      goals,
      medicalConditions,
      howHeard,
      completedAt: new Date().toISOString(),
    };

    // Persist locally (offline fallback) and sync to backend.
    await saveOnboarding(data);
    try {
      await apiRequest('/users/me/profile', {
        method: 'PUT',
        token,
        body: { age, gender, occupation, heightCm, weightKg, activityLevel, goals, medicalConditions, howHeard },
      });
      markOnboardingComplete();
    } catch {
      // Best-effort — local copy already saved; will sync on next profile fetch.
    }

    goToMain();
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else finish();
  };
  const back = () => {
    if (step > 0) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.flex, { paddingTop: insets.top + 12 }]}>
        {/* Progress */}
        <View style={styles.progressRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressSeg,
                { backgroundColor: i <= step ? GREEN : BORDER },
              ]}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 0 && (
            <Step title="Tell us about you" subtitle="This helps us personalise your plan.">
              <Field label="Age">
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 28"
                  placeholderTextColor={MUTED}
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={setAge}
                />
              </Field>
              <Field label="Gender">
                <Chips options={GENDERS} value={gender} onSelect={setGender} />
              </Field>
              <Field label="Occupation">
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Software Engineer"
                  placeholderTextColor={MUTED}
                  value={occupation}
                  onChangeText={setOccupation}
                />
              </Field>
            </Step>
          )}

          {step === 1 && (
            <Step title="Your body & health" subtitle="So we can tailor intensity safely.">
              <View style={styles.row}>
                <Field label="Height (cm)" style={{ flex: 1 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 172"
                    placeholderTextColor={MUTED}
                    keyboardType="number-pad"
                    value={heightCm}
                    onChangeText={setHeightCm}
                  />
                </Field>
                <Field label="Weight (kg)" style={{ flex: 1 }}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 68"
                    placeholderTextColor={MUTED}
                    keyboardType="number-pad"
                    value={weightKg}
                    onChangeText={setWeightKg}
                  />
                </Field>
              </View>
              <Field label="Activity level">
                <Chips options={ACTIVITY} value={activityLevel} onSelect={setActivityLevel} />
              </Field>
              <Field label="What are your goals?">
                <Chips options={GOALS} multi values={goals} onToggle={toggleGoal} />
              </Field>
              <Field label="Any medical conditions? (optional)">
                <TextInput
                  style={[styles.input, styles.multiline]}
                  placeholder="e.g. asthma, high blood pressure, pregnancy…"
                  placeholderTextColor={MUTED}
                  value={medicalConditions}
                  onChangeText={setMedicalConditions}
                  multiline
                />
              </Field>
            </Step>
          )}

          {step === 2 && (
            <Step
              title="How did you hear about Karmana?"
              subtitle="Last one — this really helps us grow. 🌱"
            >
              <Chips options={HEARD} value={howHeard} onSelect={setHowHeard} wrap />
            </Step>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.7} onPress={back}>
            <Text style={styles.backText}>{step === 0 ? 'Cancel' : 'Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextBtn} activeOpacity={0.9} onPress={next}>
            <Text style={styles.nextText}>
              {step === TOTAL_STEPS - 1 ? 'Finish' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── sub-components ───────────────────────────────────────────────────────────
const Step = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) => (
  <View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <View style={{ marginTop: 24, gap: 18 }}>{children}</View>
  </View>
);

const Field = ({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: any;
}) => (
  <View style={[{ gap: 8 }, style]}>
    <Text style={styles.label}>{label}</Text>
    {children}
  </View>
);

type ChipsProps = {
  options: string[];
  value?: string;
  onSelect?: (v: string) => void;
  multi?: boolean;
  values?: string[];
  onToggle?: (v: string) => void;
  wrap?: boolean;
};

const Chips = ({ options, value, onSelect, multi, values, onToggle }: ChipsProps) => (
  <View style={styles.chipsWrap}>
    {options.map(opt => {
      const selected = multi ? values?.includes(opt) : value === opt;
      return (
        <TouchableOpacity
          key={opt}
          activeOpacity={0.8}
          onPress={() => (multi ? onToggle?.(opt) : onSelect?.(opt))}
          style={[
            styles.chip,
            selected && { backgroundColor: '#ECFDF5', borderColor: GREEN },
          ]}
        >
          <Text style={[styles.chipText, selected && { color: GREEN, fontWeight: '700' }]}>
            {opt}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  progressRow: { flexDirection: 'row', gap: 6, paddingHorizontal: 28, paddingBottom: 8 },
  progressSeg: { flex: 1, height: 5, borderRadius: 3 },
  scroll: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: INK },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 6 },
  label: { fontSize: 14, fontWeight: '600', color: INK },
  row: { flexDirection: 'row', gap: 12 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: INK,
    backgroundColor: '#F9FAFB',
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  chipText: { fontSize: 14, color: INK },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 28,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  backBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 15, fontWeight: '600', color: MUTED },
  nextBtn: {
    flex: 1,
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
