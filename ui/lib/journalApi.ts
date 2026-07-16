import { apiRequest } from './apiClient';

// Daily journal — guided prompts, free-write entries with an optional mood tag.

export type JournalEntry = {
  id: number;
  entryDate: string;
  prompt?: string;
  content: string;
  mood?: string;
  createdAt: string;
};

export async function createEntry(
  token: string | null,
  entry: { prompt?: string; content: string; mood?: string },
): Promise<JournalEntry> {
  return apiRequest<JournalEntry>('/journal', { method: 'POST', token, body: entry });
}

export async function getJournal(token: string | null): Promise<JournalEntry[]> {
  try {
    return await apiRequest<JournalEntry[]>('/journal', { token });
  } catch {
    return [];
  }
}

export async function deleteEntry(token: string | null, id: number): Promise<void> {
  try {
    await apiRequest(`/journal/${id}`, { method: 'DELETE', token });
  } catch {
    // best-effort
  }
}

// Rotating guided prompts (Calm-style). One is featured per day.
export const JOURNAL_PROMPTS: string[] = [
  'What is one thing you are grateful for today?',
  'What is weighing on your mind right now?',
  'Describe a small moment that brought you peace today.',
  'What would make tomorrow feel lighter?',
  'Who or what are you thankful for, and why?',
  'What is one kind thing you can do for yourself today?',
  'What emotion is asking for your attention right now?',
  'What did you learn about yourself this week?',
  'Where in your body do you feel tension, and what might it be telling you?',
  'What is something you can let go of today?',
];

/** The prompt of the day — stable per calendar day. */
export function promptOfTheDay(): string {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return JOURNAL_PROMPTS[dayIndex % JOURNAL_PROMPTS.length];
}
