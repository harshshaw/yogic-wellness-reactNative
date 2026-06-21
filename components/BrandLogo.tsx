import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const DAY_LOGO = require('../assets/images/karmanaLogo.jpg');
const NIGHT_LOGO = require('../assets/images/karmanaLogonight.jpeg');

type Props = {
  size?: number;
  /** Corner radius. Defaults to a rounded-square (~28% of size). */
  radius?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Karmana brand mark. Picks the day / night artwork from the active theme so
 * branding stays consistent everywhere it's shown.
 */
export default function BrandLogo({ size = 64, radius, style }: Props) {
  const { mode } = useTheme();
  const source = mode === 'night' ? NIGHT_LOGO : DAY_LOGO;
  return (
    <Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          borderRadius: radius ?? size * 0.28,
        },
        style,
      ]}
      resizeMode="cover"
    />
  );
}
