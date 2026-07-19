import * as FileSystem from 'expo-file-system/legacy';

// Tracks which Foundations modules the user has completed, so the course can
// unlock sequentially and resume where they left off. Stored locally (like the
// auth-user cache); the completion also records a session on the backend.

const PATH = `${(FileSystem as any).documentDirectory}foundations-progress.json`;

export async function loadCompleted(): Promise<string[]> {
  try {
    const info = await FileSystem.getInfoAsync(PATH);
    if (!info.exists) return [];
    return JSON.parse(await FileSystem.readAsStringAsync(PATH)).completed ?? [];
  } catch {
    return [];
  }
}

export async function markCompleted(moduleId: string): Promise<string[]> {
  const current = await loadCompleted();
  if (current.includes(moduleId)) return current;
  const next = [...current, moduleId];
  try {
    await FileSystem.writeAsStringAsync(PATH, JSON.stringify({ completed: next }));
  } catch {}
  return next;
}
