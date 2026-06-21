import * as FileSystem from 'expo-file-system';

export type OnboardingData = {
  age: string;
  gender: string;
  occupation: string;
  heightCm: string;
  weightKg: string;
  activityLevel: string;
  goals: string[];
  medicalConditions: string;
  howHeard: string;
  completedAt: string;
};

const FILE_PATH = `${(FileSystem as any).documentDirectory}onboarding-data.json`;

export async function saveOnboarding(data: OnboardingData): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(data));
  } catch {
    // best-effort persistence
  }
}

export async function loadOnboarding(): Promise<OnboardingData | null> {
  try {
    const info = await FileSystem.getInfoAsync(FILE_PATH);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(FILE_PATH);
    return JSON.parse(raw) as OnboardingData;
  } catch {
    return null;
  }
}
