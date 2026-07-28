import * as FileSystem from 'expo-file-system/legacy';

// Gates the post-play feedback prompt on the Rest screen so it appears at most
// ONCE per calendar day, at a randomly chosen play — not after every play.
const FILE = `${FileSystem.documentDirectory}rest-feedback.json`;

// Probability of asking on any given eligible play (until we've asked today).
// Keeps it feeling occasional rather than guaranteed on the first play.
const ASK_CHANCE = 0.5;

const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

async function lastAskedDate(): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(FILE);
    if (!info.exists) return '';
    const raw = await FileSystem.readAsStringAsync(FILE);
    return (JSON.parse(raw)?.date as string) ?? '';
  } catch {
    return '';
  }
}

/**
 * Returns true at most once per day. When it decides to ask, it records today's
 * date so no further prompts fire until tomorrow. On days it rolls "no", nothing
 * is recorded, so a later play can still surface the single prompt.
 */
export async function shouldAskFeedback(): Promise<boolean> {
  if ((await lastAskedDate()) === today()) return false; // already asked today
  if (Math.random() >= ASK_CHANCE) return false;         // skip this play, try a later one
  try {
    await FileSystem.writeAsStringAsync(FILE, JSON.stringify({ date: today() }));
  } catch {
    // if we can't persist, still allow the prompt this once
  }
  return true;
}
