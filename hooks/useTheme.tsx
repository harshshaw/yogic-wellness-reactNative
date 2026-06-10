import React, { createContext, useContext, useState, useMemo } from 'react';

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
  bg: '#0B1024',
  card: '#161B33',
  cardLight: '#1F2447',
  textPrimary: '#E8E9F3',
  textSecondary: '#8B92B0',
  border: 'rgba(184,164,217,0.18)',
  borderStrong: 'rgba(212,175,55,0.3)',
  accent: '#D4AF37',
  accentSoft: 'rgba(212,175,55,0.18)',
  overlay: 'rgba(8,12,28,0.65)',
  // night keeps brighter pastel accents but slightly desaturated
  statOrange: '#FB923C',
  statOrangeSoft: 'rgba(251,146,60,0.15)',
  statMint: '#5EEAD4',
  statMintSoft: 'rgba(94,234,212,0.15)',
  statPurple: '#A78BFA',
  statPurpleSoft: 'rgba(167,139,250,0.15)',
  statYellow: '#FBBF24',
  statYellowSoft: 'rgba(251,191,36,0.15)',
  statRose: '#F472B6',
  statRoseSoft: 'rgba(244,114,182,0.15)',
};

const dayImages: ThemeImages = {
  homeHero: require('../assets/images/daylight-guru.png'),
  goalHero: require('../assets/images/goal-day.jpg'),
  sleepHero: require('../assets/images/sleep-hero.jpg'),
  breatheHero: require('../assets/images/breathe-hero.jpg'),
};

const nightImages: ThemeImages = {
  homeHero: require('../assets/images/home-night.jpg'),
  goalHero: require('../assets/images/goal-night.jpg'),
  sleepHero: require('../assets/images/goal-night.jpg'),
  breatheHero: require('../assets/images/breathe-hero.jpg'),
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

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>('day');

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      toggle: () => setMode(m => (m === 'day' ? 'night' : 'day')),
      colors: mode === 'day' ? dayColors : nightColors,
      images: mode === 'day' ? dayImages : nightImages,
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
