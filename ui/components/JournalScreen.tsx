import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { X, Check, Sparkles } from './Icons';
import {
  createEntry,
  getJournal,
  deleteEntry,
  promptOfTheDay,
  type JournalEntry,
} from '../lib/journalApi';
import { recordSession } from '../lib/wellnessApi';

const MOODS = [
  { key: 'good', emoji: '🙂', label: 'Good' },
  { key: 'calm', emoji: '😌', label: 'Calm' },
  { key: 'grateful', emoji: '🙏', label: 'Grateful' },
  { key: 'meh', emoji: '😐', label: 'Meh' },
  { key: 'low', emoji: '😔', label: 'Low' },
  { key: 'anxious', emoji: '😰', label: 'Anxious' },
];
const moodEmoji = (m?: string) => MOODS.find(x => x.key === m)?.emoji ?? '📝';

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
};

const JournalScreen = () => {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { token } = useAuth();

  const prompt = promptOfTheDay();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadHistory = () => getJournal(token).then(setEntries);
  useEffect(() => { loadHistory(); }, [token]);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    try {
      await createEntry(token, { prompt, content: content.trim(), mood: mood ?? undefined });
      // Journaling counts toward the wellness streak.
      recordSession(token, { type: 'reflection', title: 'Journal', durationSec: 120, mood: mood ?? undefined });
      setContent('');
      setMood(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
      await loadHistory();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setEntries(e => e.filter(x => x.id !== id));
    await deleteEntry(token, id);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <X size={18} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Journal</Text>
        <View style={styles.iconBtnSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* PROMPT OF THE DAY */}
        <View style={[styles.promptCard, { backgroundColor: colors.statPurpleSoft }]}>
          <View style={styles.promptLabelRow}>
            <Sparkles size={14} color={colors.statPurple} />
            <Text style={[styles.promptLabel, { color: colors.statPurple }]}>TODAY'S PROMPT</Text>
          </View>
          <Text style={[styles.promptText, { color: colors.textPrimary }]}>{prompt}</Text>
        </View>

        {/* MOOD TAG */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>How are you feeling?</Text>
        <View style={styles.moodRow}>
          {MOODS.map(m => {
            const active = mood === m.key;
            return (
              <TouchableOpacity
                key={m.key}
                style={[
                  styles.moodTile,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  active && { backgroundColor: colors.statPurpleSoft, borderColor: colors.statPurple },
                ]}
                activeOpacity={0.85}
                onPress={() => setMood(active ? null : m.key)}
              >
                <Text style={styles.moodEmoji}>{m.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    { color: colors.textSecondary },
                    active && { color: colors.statPurple, fontWeight: '700' },
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* FREE WRITE */}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Write freely… no one is reading but you."
          placeholderTextColor={colors.textSecondary}
          style={[
            styles.input,
            { backgroundColor: colors.cardLight, color: colors.textPrimary, borderColor: colors.border },
          ]}
          multiline
          textAlignVertical="top"
        />

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.statPurple }, (!content.trim() || saving) && { opacity: 0.5 }]}
          activeOpacity={0.9}
          onPress={handleSave}
          disabled={!content.trim() || saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : saved ? (
            <><Check size={16} color="#FFFFFF" strokeWidth={3} /><Text style={styles.saveText}>  Saved</Text></>
          ) : (
            <Text style={styles.saveText}>Save entry</Text>
          )}
        </TouchableOpacity>

        {/* HISTORY */}
        {entries.length > 0 && (
          <>
            <Text style={[styles.historyHead, { color: colors.textPrimary }]}>Past entries</Text>
            {entries.map(e => {
              const open = expanded === e.id;
              return (
                <TouchableOpacity
                  key={e.id}
                  style={[styles.entry, { backgroundColor: colors.card, borderColor: colors.border }]}
                  activeOpacity={0.85}
                  onPress={() => setExpanded(open ? null : e.id)}
                >
                  <View style={styles.entryTop}>
                    <Text style={styles.entryEmoji}>{moodEmoji(e.mood)}</Text>
                    <Text style={[styles.entryDate, { color: colors.textSecondary }]}>{formatDate(e.createdAt)}</Text>
                    <View style={{ flex: 1 }} />
                    <TouchableOpacity onPress={() => handleDelete(e.id)} hitSlop={10}>
                      <Text style={[styles.delete, { color: colors.textSecondary }]}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  {!!e.prompt && (
                    <Text style={[styles.entryPrompt, { color: colors.statPurple }]} numberOfLines={open ? undefined : 1}>
                      {e.prompt}
                    </Text>
                  )}
                  <Text
                    style={[styles.entryContent, { color: colors.textPrimary }]}
                    numberOfLines={open ? undefined : 2}
                  >
                    {e.content}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  iconBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  iconBtnSpacer: { width: 40, height: 40 },
  headerTitle: { fontSize: 17, fontWeight: '700' },

  promptCard: { borderRadius: 20, padding: 20 },
  promptLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  promptLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6 },
  promptText: { fontSize: 18, fontWeight: '600', lineHeight: 26 },

  sectionLabel: { fontSize: 13, fontWeight: '600', marginTop: 24, marginBottom: 10 },
  moodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  moodTile: {
    width: '31%', alignItems: 'center', paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  moodEmoji: { fontSize: 22 },
  moodLabel: { fontSize: 11, marginTop: 4, fontWeight: '500' },

  input: {
    marginTop: 20, borderRadius: 16, borderWidth: 1, padding: 16, fontSize: 15, lineHeight: 22,
    minHeight: 160,
  },
  saveBtn: {
    marginTop: 16, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row',
  },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },

  historyHead: { fontSize: 17, fontWeight: '700', marginTop: 34, marginBottom: 14 },
  entry: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 12 },
  entryTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  entryEmoji: { fontSize: 18 },
  entryDate: { fontSize: 12, fontWeight: '600' },
  delete: { fontSize: 12, fontWeight: '600' },
  entryPrompt: { fontSize: 12, fontWeight: '600', marginBottom: 4 },
  entryContent: { fontSize: 14, lineHeight: 21 },
});

export default JournalScreen;
