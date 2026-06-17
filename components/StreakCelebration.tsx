import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const CONFETTI_COLORS = ['#F59E0B', '#10B981', '#8B5CF6', '#EF4444', '#3B82F6', '#EC4899'];

// ── single confetti piece ──────────────────────────────────────────────────────
const ConfettiPiece = ({
  delay,
  startX,
  color,
  size,
}: {
  delay: number;
  startX: number;
  color: string;
  size: number;
}) => {
  const translateY = useSharedValue(-60);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 150 }));
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_H * 0.75, { duration: 2200, easing: Easing.in(Easing.quad) }),
    );
    translateX.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(20, { duration: 600 }),
          withTiming(-20, { duration: 600 }),
        ),
        -1,
        true,
      ),
    );
    rotate.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1),
    );
    // fade out near the end of the fall
    opacity.value = withDelay(delay + 1700, withTiming(0, { duration: 500 }));

    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
    };
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: startX,
          width: size,
          height: size * 1.4,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

type Props = {
  visible: boolean;
  streakCount: number;
  onClose: () => void;
};

export default function StreakCelebration({ visible, streakCount, onClose }: Props) {
  const backdrop = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const badgeFlip = useSharedValue(0);
  const flamePulse = useSharedValue(1);
  const textShift = useSharedValue(20);
  const textOpacity = useSharedValue(0);

  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        key: i,
        delay: Math.floor(Math.random() * 600),
        startX: Math.random() * SCREEN_W,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 7 + Math.random() * 6,
      })),
    [],
  );

  useEffect(() => {
    if (visible) {
      backdrop.value = withTiming(1, { duration: 250 });
      badgeScale.value = withDelay(120, withSpring(1, { damping: 9, stiffness: 120 }));
      // 3D-style flip: two full spins on the Y axis as it lands
      badgeFlip.value = withDelay(120, withTiming(720, { duration: 900, easing: Easing.out(Easing.cubic) }));
      flamePulse.value = withDelay(
        1000,
        withRepeat(
          withSequence(
            withTiming(1.18, { duration: 600 }),
            withTiming(1, { duration: 600 }),
          ),
          -1,
          true,
        ),
      );
      textOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
      textShift.value = withDelay(700, withSpring(0, { damping: 12 }));
    } else {
      backdrop.value = 0;
      badgeScale.value = 0;
      badgeFlip.value = 0;
      flamePulse.value = 1;
      textOpacity.value = 0;
      textShift.value = 20;
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { scale: badgeScale.value },
      { rotateY: `${badgeFlip.value}deg` },
    ],
  }));

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flamePulse.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textShift.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        {/* confetti layer */}
        {confetti.map((c) => (
          <ConfettiPiece key={c.key} delay={c.delay} startX={c.startX} color={c.color} size={c.size} />
        ))}

        <View style={styles.center}>
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Animated.Text style={[styles.flame, flameStyle]}>🔥</Animated.Text>
            <Text style={styles.badgeNum}>{streakCount}</Text>
            <Text style={styles.badgeUnit}>DAY{streakCount === 1 ? '' : 'S'}</Text>
          </Animated.View>

          <Animated.View style={[styles.textBlock, textStyle]}>
            <Text style={styles.title}>Day Complete! 🎉</Text>
            <Text style={styles.subtitle}>
              You finished every practice today.{'\n'}Your streak is now {streakCount} days strong.
            </Text>

            <TouchableOpacity style={styles.button} activeOpacity={0.88} onPress={onClose}>
              <Text style={styles.buttonText}>Keep the streak going  →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,16,36,0.72)',
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  badge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.55,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 18,
    borderWidth: 4,
    borderColor: '#FCD34D',
  },
  flame: { fontSize: 40, marginBottom: -2 },
  badgeNum: { fontSize: 44, fontWeight: '900', color: '#0F172A', lineHeight: 48 },
  badgeUnit: { fontSize: 13, fontWeight: '800', color: '#F59E0B', letterSpacing: 2 },
  textBlock: { alignItems: 'center', marginTop: 28 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 21,
  },
  button: {
    marginTop: 28,
    backgroundColor: '#10B981',
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#10B981',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
