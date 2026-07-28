import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import * as Speech from 'expo-speech';
import { COLORS } from '../styles/colors';
import { warm, RADII } from '../styles/warm';
import { Sparkles, X, Mic, Send, Moon, Target, Heart, Volume2, VolumeX } from './Icons';
import {
  sendToCompanion,
  distillMemory,
  transcribeAudio,
  type CompanionMode,
  type UserContext,
} from '../lib/aiCompanion';
import { getMemory, saveMemory, saveTurns } from '../lib/companionMemory';
import { apiRequest } from '../lib/apiClient';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

type Mode = CompanionMode;
type Msg = { from: 'ai' | 'user'; text: string; cite?: string; time: string };

const greetingByMode: Record<Mode, { open: string; cite?: string; suggestions: string[] }> = {
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
  'Relationship Guru': {
    open: 'Every relationship is a mirror. Tell me what’s on your heart — I’ll listen without judgment.',
    cite: 'Inspired by yogic wisdom on connection',
    suggestions: ['We keep arguing', 'I feel unheard', 'Rebuilding trust', 'Setting boundaries'],
  },
};

const modeIcons: Record<Mode, any> = {
  'Gita Companion': Sparkles,
  'Sleep Guide': Moon,
  'Confidence Coach': Target,
  'Relationship Guru': Heart,
};

const timeStamp = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const AICompanionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const mode = ((route.params?.mode as Mode) ?? 'Gita Companion') as Mode;

  const intro = greetingByMode[mode];
  const Icon = modeIcons[mode];

  const { user, token } = useAuth();

  const [messages, setMessages] = useState<Msg[]>(() => [
    { from: 'ai', text: intro.open, cite: intro.cite, time: timeStamp() },
  ]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);

  // ── Personalisation context (who the user is + memory of past chats) ──
  const contextRef = useRef<UserContext>({});
  const memoryRef = useRef<string>('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Load durable memory, profile, and today's reflection in parallel.
      const [memory, profile, reflection] = await Promise.all([
        getMemory(token).catch(() => ''),
        apiRequest<any>('/users/me/profile', { token }).catch(() => null),
        apiRequest<any>('/reflections/today', { token }).catch(() => null),
      ]);
      if (cancelled) return;
      // TEMP DEBUG — remove once memory is confirmed working
      console.log('[companion] memory loaded:', {
        hasToken: !!token,
        memoryLength: memory?.length ?? 0,
        memoryPreview: (memory ?? '').slice(0, 80),
      });
      memoryRef.current = memory;
      contextRef.current = {
        name: user?.name,
        profile: profile
          ? {
              age: profile.age,
              gender: profile.gender,
              occupation: profile.occupation,
              goals: profile.goals,
              medicalConditions: profile.medicalConditions,
            }
          : undefined,
        reflection: reflection
          ? { mood: reflection.mood, energy: reflection.energy, sleep: reflection.sleep }
          : undefined,
        memory,
      };
    })();
    return () => {
      cancelled = true;
    };
  }, [token, user?.name]);

  // ── Voice output (text-to-speech for AI replies) ──
  const [voiceOn, setVoiceOn] = useState(true);
  const voiceOnRef = useRef(true);
  voiceOnRef.current = voiceOn;

  const speak = async (text: string) => {
    if (!voiceOnRef.current || !text) return;
    Speech.stop();
    try {
      // Route audio to the main loudspeaker (not the quiet iOS earpiece),
      // play even when the ringer switch is silent, and don't duck.
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        shouldDuckAndroid: false,
      });
    } catch {
      // ignore — fall back to default routing
    }
    Speech.speak(text, { pitch: 1.0, rate: 0.95, volume: 1.0 });
  };

  const toggleVoice = () => {
    setVoiceOn(v => {
      const next = !v;
      if (!next) Speech.stop();
      return next;
    });
  };

  // ── Voice input (record → Whisper transcription) ──
  const recordingRef = useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const startRecording = async () => {
    try {
      Speech.stop();
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        setDraft('Microphone access is needed to speak.');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.warn('startRecording failed', err);
      setIsRecording(false);
    }
  };

  const stopAndTranscribe = async () => {
    const recording = recordingRef.current;
    recordingRef.current = null;
    setIsRecording(false);
    if (!recording) return;

    setIsTranscribing(true);
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = recording.getURI();
      if (!uri) return;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });
      const ext = uri.split('.').pop()?.toLowerCase() || 'm4a';
      const text = await transcribeAudio(base64, ext);

      if (text) {
        setDraft(d => (d ? `${d} ${text}` : text));
      }
    } catch (err) {
      console.warn('transcription failed', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleMic = () => {
    if (isTranscribing) return;
    if (isRecording) stopAndTranscribe();
    else startRecording();
  };

  const send = async (forced?: string) => {
    const text = (forced ?? draft).trim();
    if (!text || pending) return;

    const userMsg: Msg = { from: 'user', text, time: timeStamp() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setDraft('');
    setPending(true);

    try {
      const apiMessages = nextMessages.map(m => ({
        role: (m.from === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: m.text,
      }));
      // TEMP DEBUG — remove once memory is confirmed working
      console.log('[companion] sending with memory length:', contextRef.current.memory?.length ?? 0);
      const reply = await sendToCompanion(mode, apiMessages, contextRef.current);
      const cite =
        reply.citations.length > 0
          ? reply.citations.map(c => c.ref).join(' · ')
          : undefined;
      setMessages(m => [...m, { from: 'ai', text: reply.content, cite, time: timeStamp() }]);
      speak(reply.content);
    } catch (err: any) {
      setMessages(m => [
        ...m,
        {
          from: 'ai',
          text:
            'I couldn’t reach the companion just now. Take a slow breath — try again in a moment.',
          time: timeStamp(),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const hasUser = useMemo(() => messages.some(m => m.from === 'user'), [messages]);
  const { colors } = useTheme();

  // Keep the latest messages in a ref so the unmount handler isn't stale.
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  // On leaving the screen: persist the session's turns, then distil an updated
  // memory summary so the AI remembers this conversation next time.
  useEffect(() => {
    return () => {
      Speech.stop();

      // Skip the opening greeting; keep only real conversation.
      const turns = messagesRef.current
        .filter((_, i) => i > 0)
        .map(m => ({
          role: (m.from === 'ai' ? 'assistant' : 'user') as 'assistant' | 'user',
          content: m.text,
        }));
      const hadUserTurn = turns.some(t => t.role === 'user');
      if (!hadUserTurn) return;

      // Fire-and-forget; the JS runtime finishes these after unmount.
      (async () => {
        try {
          await saveTurns(token, mode, turns);
          const updated = await distillMemory(memoryRef.current, turns);
          if (updated) await saveMemory(token, updated);
        } catch {
          // best-effort — never surface memory errors to the user
        }
      })();
    };
  }, [token, mode]);

  // Keep the thread pinned to the newest message.
  const scrollRef = useRef<ScrollView | null>(null);
  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [messages, pending]);

  return (
    <KeyboardAvoidingView
      style={[warm.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
    >
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[warm.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={[styles.avatar, { backgroundColor: colors.statPurple }]}>
            <Icon size={16} color="#FFFFFF" />
          </View>
          <Text style={[styles.modeTitle, { color: colors.textPrimary }]}>{mode}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.dot, { backgroundColor: colors.statMint }]} />
            <Text style={[styles.status, { color: colors.textSecondary }]}>Listening</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[warm.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={toggleVoice}
        >
          {voiceOn ? (
            <Volume2 size={18} color={colors.statPurple} />
          ) : (
            <VolumeX size={18} color={colors.textSecondary} />
          )}
        </TouchableOpacity>
      </View>

      {/* THREAD */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.thread}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((m, i) =>
          m.from === 'ai' ? (
            <View
              key={i}
              style={[
                styles.aiBubble,
                { backgroundColor: colors.cardLight, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.aiText, { color: colors.textPrimary }]}>{m.text}</Text>
              <Text style={[styles.time, { color: colors.textSecondary }]}>{m.time}</Text>
            </View>
          ) : (
            <View key={i} style={[styles.userBubble, { backgroundColor: colors.statPurple }]}>
              <Text style={[styles.userText, { color: '#FFFFFF' }]}>{m.text}</Text>
              <Text style={[styles.timeOnUser, { color: 'rgba(255,255,255,0.7)' }]}>{m.time}</Text>
            </View>
          )
        )}
        {pending && (
          <View
            style={[
              styles.aiBubble,
              { backgroundColor: colors.cardLight, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.aiText, { color: colors.textSecondary }]}>
              breathing in…
            </Text>
          </View>
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
              style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.borderStrong }]}
              activeOpacity={0.85}
              onPress={() => send(s)}
            >
              <Text style={[styles.chipText, { color: colors.statPurple }]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* COMPOSER */}
      <View
        style={[
          styles.composer,
          { backgroundColor: colors.bg, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.micBtn,
            { backgroundColor: isRecording ? colors.statPurple : colors.statPurpleSoft },
          ]}
          activeOpacity={0.7}
          onPress={toggleMic}
          disabled={isTranscribing}
        >
          {isTranscribing ? (
            <ActivityIndicator size="small" color={colors.statPurple} />
          ) : (
            <Mic size={18} color={isRecording ? '#FFFFFF' : colors.statPurple} />
          )}
        </TouchableOpacity>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={
            isRecording
              ? 'Listening… tap mic to stop'
              : isTranscribing
              ? 'Transcribing…'
              : 'Speak your truth…'
          }
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { backgroundColor: colors.cardLight, color: colors.textPrimary, borderColor: colors.border },
          ]}
          multiline
          textAlignVertical="top"
          submitBehavior="newline"
          onSubmitEditing={() => send()}
        />
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.statPurple }, pending && { opacity: 0.5 }]}
          onPress={() => send()}
          activeOpacity={0.85}
          disabled={pending}
        >
          <Send size={18} color="#FFFFFF" />
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
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: RADII.pill,
    alignSelf: 'flex-start',
  },
  chipText: { color: COLORS.primaryGold, fontSize: 12, fontWeight: '600' },

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 14,
    minHeight: 42,
    maxHeight: 120,
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
