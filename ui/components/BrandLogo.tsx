import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

// Always the day artwork — the brand mark stays identical in day and night mode.
const DAY_LOGO = require('../assets/images/karmanaLogo.jpg');

type Props = {
  size?: number;
  /** Corner radius. Defaults to a rounded-square (~28% of size). */
  radius?: number;
  style?: StyleProp<ImageStyle>;
};

/**
 * Karmana brand mark. Uses the day artwork everywhere, regardless of the active
 * theme, so branding is consistent in both light and dark mode.
 */
export default function BrandLogo({ size = 64, radius, style }: Props) {
  const source = DAY_LOGO;
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
