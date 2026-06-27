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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import BrandLogo from './BrandLogo';

const GREEN = '#10B981';
const INK = '#0F172A';
const MUTED = '#6B7280';
const BORDER = '#E5E7EB';

type Mode = 'login' | 'signup';

export default function AuthScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { logIn, signUp } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isSignup = mode === 'signup';

  const { user } = useAuth();

  const goToMain = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });

  const handleSubmit = async () => {
    setError(null);

    if (isSignup && !name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      if (isSignup) {
        await signUp(name, email, password);
        // New accounts always need onboarding.
        navigation.navigate('Onboarding');
      } else {
        await logIn(email, password);
        // Returning users skip onboarding if they already completed it.
        if (user?.onboardingComplete) goToMain();
        else navigation.navigate('Onboarding');
      }
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setError(null);
    setMode(isSignup ? 'login' : 'signup');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 32 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Brand */}
        <View style={styles.brand}>
          <BrandLogo size={84} radius={24} />
          <Text style={styles.brandName}>Karmana</Text>
          <Text style={styles.brandTag}>Breathe. Rest. Grow.</Text>
        </View>

        {/* Heading */}
        <Text style={styles.title}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? 'Start your personalised wellness journey.'
            : 'Sign in to continue your journey.'}
        </Text>

        {/* Form */}
        <View style={styles.form}>
          {isSignup && (
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={MUTED}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={MUTED}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={MUTED}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.cta, submitting && { opacity: 0.7 }]}
            activeOpacity={0.9}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.ctaText}>
                {isSignup ? 'Create account' : 'Sign in'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Switch mode */}
        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={switchMode} activeOpacity={0.7}>
            <Text style={styles.switchLink}>
              {isSignup ? 'Sign in' : 'Sign up'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 28, paddingBottom: 40 },
  brand: { alignItems: 'center', marginBottom: 28 },
  brandName: { fontSize: 26, fontWeight: '700', color: INK, marginTop: 14 },
  brandTag: { fontSize: 14, color: GREEN, fontWeight: '600', marginTop: 4 },
  title: { fontSize: 24, fontWeight: '700', color: INK },
  subtitle: { fontSize: 14, color: MUTED, marginTop: 6 },
  form: { marginTop: 24, gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: INK },
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
  error: { color: '#EF4444', fontSize: 13, marginTop: -4 },
  cta: {
    backgroundColor: GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 24,
  },
  switchText: { fontSize: 14, color: MUTED },
  switchLink: { fontSize: 14, color: GREEN, fontWeight: '700' },
});
