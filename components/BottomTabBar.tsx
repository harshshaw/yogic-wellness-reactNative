import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { styles } from '../styles/BottomTabBar.styles';
import { useTheme } from '../hooks/useTheme';

const ICON_PATHS: Record<string, string> = {
  Home: 'M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5z',
  Breathe: 'M2 12h3a3 3 0 1 0 0-6 3 3 0 0 0-3 3M2 12h3a3 3 0 1 1 0 6 3 3 0 0 1-3-3M11 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0zm-2 0H22',
  Sleep: 'M12 18a8 8 0 0 1-7.94-7.07A1 1 0 0 1 5.4 9.86 6 6 0 0 0 14.14 4.6a1 1 0 0 1 1.07-1.34A8 8 0 0 1 12 18z',
  Progress: 'M3 13h4v8H3v-8zm7-6h4v14h-4V7zm7 3h4v11h-4V10z',
  Profile: 'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.3 0-8 1.7-8 5v3h16v-3c0-3.3-4.7-5-8-5z',
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
        const color = isFocused ? colors.accent : colors.textSecondary;

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
                isFocused && { backgroundColor: colors.accentSoft },
              ]}
            >
              <TabIcon name={route.name} color={color} />
            </View>
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
