import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Mode = 'day' | 'night';

export type ThemeColors = {
  bg: string;
  card: string;
  cardLight: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentSoft: string;
  overlay: string;
  // Per-stat accents — used for rings, icon backgrounds, etc.
  statOrange: string;
  statOrangeSoft: string;
  statMint: string;
  statMintSoft: string;
  statPurple: string;
  statPurpleSoft: string;
  statYellow: string;
  statYellowSoft: string;
  statRose: string;
  statRoseSoft: string;
};

export type ThemeImages = {
  homeHero: any;
  goalHero: any;
  sleepHero: any;
  breatheHero: any;
};

const dayColors: ThemeColors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardLight: '#F9FAFB',
  textPrimary: '#0F172A',
  textSecondary: '#6B7280',
  border: '#F1F5F9',
  borderStrong: '#E5E7EB',
  accent: '#10B981',
  accentSoft: '#D1FAE5',
  overlay: 'rgba(0,0,0,0.0)',
  // multi-color accent palette
  statOrange: '#FB923C',
  statOrangeSoft: '#FFEDD5',
  statMint: '#10B981',
  statMintSoft: '#D1FAE5',
  statPurple: '#8B5CF6',
  statPurpleSoft: '#EDE9FE',
  statYellow: '#F59E0B',
  statYellowSoft: '#FEF3C7',
  statRose: '#F472B6',
  statRoseSoft: '#FCE7F3',
};

const nightColors: ThemeColors = {
  bg: '#150D1E',
  card: '#1E1230',
  cardLight: '#281840',
  textPrimary: '#F0EAF8',
  textSecondary: '#9B8DB5',
  border: 'rgba(200,170,240,0.14)',
  borderStrong: 'rgba(232,148,58,0.35)',
  accent: '#E8943A',
  accentSoft: 'rgba(232,148,58,0.18)',
  overlay: 'rgba(18,8,30,0.70)',
  statOrange: '#F97316',
  statOrangeSoft: 'rgba(249,115,22,0.15)',
  statMint: '#34D399',
  statMintSoft: 'rgba(52,211,153,0.15)',
  statPurple: '#C084FC',
  statPurpleSoft: 'rgba(192,132,252,0.15)',
  statYellow: '#FBBF24',
  statYellowSoft: 'rgba(251,191,36,0.15)',
  statRose: '#FB7185',
  statRoseSoft: 'rgba(251,113,133,0.15)',
};

const dayImages: ThemeImages = {
  homeHero: require('../assets/images/daylight-guru.png'),
  goalHero: require('../assets/images/goal-day.jpg'),
  sleepHero: require('../assets/images/pranayama-day.png'),
  breatheHero: require('../assets/images/breathe-day.jpeg'),
};

const nightImages: ThemeImages = {
  homeHero: require('../assets/images/home-night.jpg'),
  goalHero: require('../assets/images/goal-night.jpg'),
  sleepHero: require('../assets/images/sleep-night.jpeg'),
  breatheHero: require('../assets/images/pranayamaNight.jpeg'),
};

type ThemeContextValue = {
  mode: Mode;
  toggle: () => void;
  colors: ThemeColors;
  images: ThemeImages;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'day',
  toggle: () => {},
  colors: dayColors,
  images: dayImages,
});

const getTimeBasedMode = (): Mode => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6 ? 'night' : 'day';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>(getTimeBasedMode);
  // Once the user manually picks a theme, stop auto-switching by time so their
  // choice sticks until they toggle again.
  const [manual, setManual] = useState(false);

  // Re-check every minute so the switch happens automatically at 6am/6pm —
  // but only while the user hasn't overridden the theme manually.
  useEffect(() => {
    if (manual) return;
    const id = setInterval(() => setMode(getTimeBasedMode()), 60_000);
    return () => clearInterval(id);
  }, [manual]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggle: () => {
        setManual(true);
        setMode(m => (m === 'day' ? 'night' : 'day'));
      },
      colors: mode === 'day' ? dayColors : nightColors,
      images: mode === 'day' ? dayImages : nightImages,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
