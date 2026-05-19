import React, { useMemo, useState } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import { Sparkles, X, Mic, Send, HeartPulse, Moon, Target } from './Icons';

type Mode = 'Pranayama Guru' | 'Gita Companion' | 'Sleep Guide' | 'Confidence Coach';
type Msg = { from: 'ai' | 'user'; text: string; cite?: string; time: string };

const greetingByMode: Record<Mode, { open: string; cite?: string; suggestions: string[] }> = {
  'Pranayama Guru': {
    open: 'Take one slow breath with me. In through the nose, out through the mouth. What feels tight right now?',
    suggestions: ['I’m anxious', 'I need energy', 'Help me focus', 'Start a 4-7-8'],
  },
  'Gita Companion': {
    open: 'A doubt is a door. Tell me what you are carrying — I’ll offer a quiet reflection.',
    cite: 'Inspired by the Bhagavad Gita',
    suggestions: ['I missed a goal', 'I feel lost', 'What is dharma?', 'On letting go'],
  },
  'Sleep Guide': {
    open: 'You don’t have to fall asleep. Just slow down with me. How was the day, in one word?',
    suggestions: ['Heavy', 'Busy', 'Restless', 'Begin wind-down'],
  },
  'Confidence Coach': {
    open: 'You showed up. That counts. Tell me what felt hard today.',
    suggestions: ['I doubted myself', 'I avoided it', 'I want to commit', 'Celebrate a win'],
  },
};

const modeIcons: Record<Mode, any> = {
  'Pranayama Guru': HeartPulse,
  'Gita Companion': Sparkles,
  'Sleep Guide': Moon,
  'Confidence Coach': Target,
};

const replyFor = (mode: Mode, _userText: string): Msg => {
  const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  switch (mode) {
    case 'Pranayama Guru':
      return {
        from: 'ai',
        text: 'Let’s do three rounds of 4-7-8. Inhale four, hold seven, exhale eight. I’ll wait with you.',
        time: t,
      };
    case 'Gita Companion':
      return {
        from: 'ai',
        text:
          'The arrow you loose well is yours; where it lands is not. Do the work fully, then release the outcome.',
        cite: 'Gita-inspired · 2.47',
        time: t,
      };
    case 'Sleep Guide':
      return {
        from: 'ai',
        text:
          'Let the day be the day. Eyes soft. Jaw soft. One long out-breath, then another.',
        time: t,
      };
    case 'Confidence Coach':
      return {
        from: 'ai',
        text:
          'Naming it is the hardest part — you already did that. Pick one small action you can finish today.',
        time: t,
      };
  }
};

const AICompanionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const mode = ((route.params?.mode as Mode) ?? 'Pranayama Guru') as Mode;

  const intro = greetingByMode[mode];
  const Icon = modeIcons[mode];

  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      from: 'ai',
      text: intro.open,
      cite: intro.cite,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [draft, setDraft] = useState('');

  const send = (forced?: string) => {
    const text = (forced ?? draft).trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(m => [...m, { from: 'user', text, time }]);
    setDraft('');
    setTimeout(() => {
      setMessages(m => [...m, replyFor(mode, text)]);
    }, 600);
  };

  const hasUser = useMemo(() => messages.some(m => m.from === 'user'), [messages]);

  return (
    <KeyboardAvoidingView
      style={warm.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={warm.iconBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.avatar}>
            <Icon size={16} color={COLORS.deepBrown} />
          </View>
          <Text style={styles.modeTitle}>{mode}</Text>
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.status}>Listening</Text>
          </View>
        </View>
        <View style={warm.iconBtn} />
      </View>

      {/* THREAD */}
      <ScrollView
        contentContainerStyle={styles.thread}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m, i) =>
          m.from === 'ai' ? (
            <View key={i} style={styles.aiBubble}>
              {m.cite && <Text style={styles.cite}>{m.cite}</Text>}
              <Text style={styles.aiText}>{m.text}</Text>
              <Text style={styles.time}>{m.time}</Text>
            </View>
          ) : (
            <View key={i} style={styles.userBubble}>
              <Text style={styles.userText}>{m.text}</Text>
              <Text style={styles.timeOnUser}>{m.time}</Text>
            </View>
          )
        )}
      </ScrollView>

      {/* SUGGESTIONS (before user has typed) */}
      {!hasUser && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {intro.suggestions.map(s => (
            <TouchableOpacity
              key={s}
              style={styles.chip}
              activeOpacity={0.85}
              onPress={() => send(s)}
            >
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* COMPOSER */}
      <View style={styles.composer}>
        <TouchableOpacity style={styles.micBtn} activeOpacity={0.7}>
          <Mic size={18} color={COLORS.primaryGold} />
        </TouchableOpacity>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Speak your truth…"
          placeholderTextColor={COLORS.textSecondary}
          style={styles.input}
          onSubmitEditing={() => send()}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={() => send()} activeOpacity={0.85}>
          <Send size={18} color={COLORS.deepBrown} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212,175,55,0.1)',
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center', justifyContent: 'center',
  },
  modeTitle: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginTop: 6 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primaryGold },
  status: { color: COLORS.textSecondary, fontSize: 11 },

  thread: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 12,
  },

  aiBubble: {
    alignSelf: 'flex-start',
    maxWidth: '82%',
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    borderRadius: 18,
    borderTopLeftRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  cite: {
    color: COLORS.primaryGold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  aiText: { color: COLORS.textPrimary, fontSize: 14, lineHeight: 21 },
  time: { color: COLORS.textSecondary, fontSize: 10, marginTop: 6, opacity: 0.7 },

  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '82%',
    backgroundColor: COLORS.primaryGold,
    borderRadius: 18,
    borderTopRightRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  userText: { color: COLORS.deepBrown, fontSize: 14, lineHeight: 21, fontWeight: '500' },
  timeOnUser: { color: 'rgba(28,20,15,0.55)', fontSize: 10, marginTop: 6, textAlign: 'right' },

  chipsRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: RADII.pill,
  },
  chipText: { color: COLORS.primaryGold, fontSize: 12, fontWeight: '600' },

  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.1)',
    gap: 8,
    backgroundColor: COLORS.deepBrown,
  },
  micBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(212,175,55,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center', justifyContent: 'center',
  },
});

export default AICompanionScreen;
