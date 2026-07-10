import * as FileSystem from 'expo-file-system';
import { apiRequest } from './apiClient';
import type { ChatMessage } from './aiCompanion';

// Persistent companion memory. The distilled summary lives in Postgres (via the
// Spring Boot backend) so it survives reinstalls and works across devices; a
// local copy is cached for instant load and brief offline use.

type MemoryResponse = { summary?: string; updatedAt?: string };

const MEMORY_PATH = `${(FileSystem as any).documentDirectory}companion-memory.json`;

// ── local cache ───────────────────────────────────────────────────────────────

async function cacheMemory(summary: string): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(MEMORY_PATH, JSON.stringify({ summary }));
  } catch {}
}

async function loadCachedMemory(): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(MEMORY_PATH);
    if (!info.exists) return '';
    return JSON.parse(await FileSystem.readAsStringAsync(MEMORY_PATH)).summary ?? '';
  } catch {
    return '';
  }
}

// ── server sync ───────────────────────────────────────────────────────────────

/** Fetch the distilled summary. Falls back to the local cache if the network fails. */
export async function getMemory(token: string | null): Promise<string> {
  try {
    const res = await apiRequest<MemoryResponse>('/companion/memory', { token });
    const summary = res?.summary ?? '';
    if (summary) await cacheMemory(summary);
    return summary || (await loadCachedMemory());
  } catch {
    return loadCachedMemory();
  }
}

/** Replace the distilled summary. Also updates the local cache. */
export async function saveMemory(token: string | null, summary: string): Promise<void> {
  await cacheMemory(summary);
  try {
    await apiRequest('/companion/memory', { method: 'PUT', token, body: { summary } });
  } catch {}
}

/** Append raw conversation turns to the log. Best-effort; never blocks the UI. */
export async function saveTurns(
  token: string | null,
  mode: string,
  turns: ChatMessage[]
): Promise<void> {
  if (turns.length === 0) return;
  const payload = turns.map(t => ({
    role: t.role === 'assistant' ? 'ai' : 'user',
    content: t.content,
  }));
  try {
    await apiRequest('/companion/turns', {
      method: 'POST',
      token,
      body: { mode, turns: payload },
    });
  } catch {}
}
