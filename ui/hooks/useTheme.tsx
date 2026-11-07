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

// Calm Blue — matches the landing site: white canvas, #5B8DEF action blue,
// dark-blue text, and a cohesive blue-family secondary palette.
const dayColors: ThemeColors = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  cardLight: '#F4F8FF',
  textPrimary: '#12294D',
  textSecondary: '#667089',
  border: '#E4EBF6',
  borderStrong: '#D4DEF0',
  accent: '#5B8DEF',
  accentSoft: '#E7F0FF',
  overlay: 'rgba(0,0,0,0.0)',
  // blue-family secondary palette (subtle hue variation, all cohesive)
  statOrange: '#4C82C3',
  statOrangeSoft: '#E7F0FF',
  statMint: '#2E8CC0',
  statMintSoft: '#E4F2FB',
  statPurple: '#4667C7',
  statPurpleSoft: '#E7EDFB',
  statYellow: '#3D7AD1',
  statYellowSoft: '#EDF3FF',
  statRose: '#5B72CC',
  statRoseSoft: '#ECEFFF',
};

// Black night theme — near-black base with blue accents layered on top.
const nightColors: ThemeColors = {
  bg: '#000000',
  card: '#0E1015',
  cardLight: '#16181F',
  textPrimary: '#EAF1FC',
  textSecondary: '#8A93A8',
  border: 'rgba(140,165,220,0.12)',
  borderStrong: 'rgba(110,168,255,0.34)',
  accent: '#6EA8FF',
  accentSoft: 'rgba(110,168,255,0.16)',
  overlay: 'rgba(0,0,0,0.75)',
  statOrange: '#7FA8E0',
  statOrangeSoft: 'rgba(127,168,224,0.15)',
  statMint: '#6FC3E8',
  statMintSoft: 'rgba(111,195,232,0.15)',
  statPurple: '#8FA9FF',
  statPurpleSoft: 'rgba(143,169,255,0.16)',
  statYellow: '#8FBEFF',
  statYellowSoft: 'rgba(143,190,255,0.15)',
  statRose: '#9BB2FF',
  statRoseSoft: 'rgba(155,178,255,0.16)',
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
