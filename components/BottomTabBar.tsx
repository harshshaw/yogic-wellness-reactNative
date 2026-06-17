import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { styles } from '../styles/BottomTabBar.styles';
import { useTheme, type ThemeColors } from '../hooks/useTheme';

const ICON_PATHS: Record<string, string> = {
  Home:        'M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5z',
  Recommend:   'M12 3v3M9 6C6 6 3 9 3 12c0 4 2 7 5 7h1v-4H7l2-3 3 3V9M15 6c3 0 6 3 6 6 0 4-2 7-5 7h-1v-4h2l-2-3-3 3V9',
  Sleep:       'M12 18a8 8 0 0 1-7.94-7.07A1 1 0 0 1 5.4 9.86 6 6 0 0 0 14.14 4.6a1 1 0 0 1 1.07-1.34A8 8 0 0 1 12 18z',
  Progress:    'M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z',
  AICompanion: 'M12 2a5 5 0 0 1 5 5c0 1.5-.6 2.8-1.6 3.8L17 22H7l1.6-11.2A5 5 0 0 1 7 7a5 5 0 0 1 5-5zM9 7h6',
};

// Per-tab signature colors, matching the reference design (Calm-style):
// each tab keeps its own brand color when active OR inactive.
const tabColor = (
  name: string,
  colors: ThemeColors
): { strong: string; soft: string } => {
  switch (name) {
    case 'Home':        return { strong: colors.statOrange,  soft: colors.statOrangeSoft };
    case 'Recommend':   return { strong: colors.statMint,    soft: colors.statMintSoft };
    case 'Sleep':       return { strong: colors.statPurple,  soft: colors.statPurpleSoft };
    case 'Progress':    return { strong: colors.statPurple,  soft: colors.statPurpleSoft };
    case 'AICompanion': return { strong: colors.statYellow,  soft: colors.statYellowSoft };
    default:         return { strong: colors.accent, soft: colors.accentSoft };
  }
};

const TabIcon = ({ name, color }: { name: string; color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path d={ICON_PATHS[name] ?? ''} fill={color} />
  </Svg>
);

export default function BottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          (options.tabBarLabel as string) ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const tone = tabColor(route.name, colors);

        // Icon always uses its signature color. Label is gray when inactive,
        // signature color when active.
        const iconColor = tone.strong;
        const labelColor = isFocused ? tone.strong : colors.textSecondary;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tab}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
          >
            <View
              style={[
                styles.iconWrap,
                isFocused && { backgroundColor: tone.soft },
              ]}
            >
              <TabIcon name={route.name} color={iconColor} />
            </View>
            <Text style={[styles.label, { color: labelColor }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
