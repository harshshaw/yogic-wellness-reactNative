import { useState, useEffect, useCallback } from 'react';
import * as FileSystem from 'expo-file-system';

export type DayRecord = {
  date: string;       // YYYY-MM-DD
  completed: boolean;
  itemsDone: number;
  totalItems: number;
  minutesLogged: number;
};

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  history: DayRecord[]; // last 30 days, oldest first
};

const FILE_PATH = `${FileSystem.documentDirectory}streak-data.json`;

const DEFAULT_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  totalDaysCompleted: 0,
  history: [],
};

const today = () => new Date().toISOString().slice(0, 10);

async function readFile(): Promise<StreakData> {
  try {
    const info = await FileSystem.getInfoAsync(FILE_PATH);
    if (!info.exists) return DEFAULT_DATA;
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw) as StreakData;
  } catch {
    return DEFAULT_DATA;
  }
}

async function writeFile(data: StreakData): Promise<void> {
  await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(data));
}

function recalcStreak(history: DayRecord[]): { currentStreak: number; longestStreak: number } {
  const completed = history.filter((d) => d.completed).map((d) => d.date).sort();
  if (completed.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < completed.length; i++) {
    const prev = new Date(completed[i - 1]);
    const curr = new Date(completed[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86_400_000;
    if (diff === 1) {
      run++;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  // current streak: count backwards from today
  const todayStr = today();
  let cur = 0;
  const sorted = [...completed].reverse();
  let expected = todayStr;
  for (const d of sorted) {
    if (d === expected) {
      cur++;
      const prev = new Date(expected);
      prev.setDate(prev.getDate() - 1);
      expected = prev.toISOString().slice(0, 10);
    } else {
      break;
    }
  }

  return { currentStreak: cur, longestStreak: Math.max(longest, cur) };
}

export function useStreakStorage() {
  const [data, setData] = useState<StreakData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readFile().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  // Call this when the user completes all items for the day.
  // Returns the updated StreakData so callers can read the new streak immediately.
  const markDayComplete = useCallback(
    async (itemsDone: number, totalItems: number, minutesLogged = 0): Promise<StreakData> => {
      const current = await readFile();
      const todayStr = today();

      const idx = current.history.findIndex((r) => r.date === todayStr);
      const record: DayRecord = { date: todayStr, completed: true, itemsDone, totalItems, minutesLogged };
      if (idx >= 0) {
        current.history[idx] = record;
      } else {
        current.history.push(record);
      }

      current.history = current.history
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30);

      const { currentStreak, longestStreak } = recalcStreak(current.history);
      const totalDaysCompleted = current.history.filter((d) => d.completed).length;

      const updated: StreakData = { ...current, currentStreak, longestStreak, totalDaysCompleted };

      // Update UI immediately — don't wait for file write
      setData(updated);
      writeFile(updated).catch(() => {}); // persist best-effort
      return updated;
    },
    [],
  );

  // Seed fake history for testing — call once from the component
  const seedTestData = useCallback(async () => {
    const history: DayRecord[] = [];
    const minuteOptions = [12, 18, 24, 30, 36];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      // simulate gaps: skip day 10 and day 5 ago
      const completed = i !== 10 && i !== 5;
      history.push({
        date: dateStr,
        completed,
        itemsDone: completed ? 10 : 3,
        totalItems: 10,
        minutesLogged: completed ? minuteOptions[i % minuteOptions.length] : 0,
      });
    }
    const { currentStreak, longestStreak } = recalcStreak(history);
    const seeded: StreakData = {
      history,
      currentStreak,
      longestStreak,
      totalDaysCompleted: history.filter((d) => d.completed).length,
    };
    await writeFile(seeded);
    setData(seeded);
  }, []);

  const clearData = useCallback(async () => {
    await writeFile(DEFAULT_DATA);
    setData(DEFAULT_DATA);
  }, []);

  return { data, loading, markDayComplete, seedTestData, clearData };
}
