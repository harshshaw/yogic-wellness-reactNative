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
const CONFETTI_COLORS = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

const ConfettiPiece = ({
  delay, startX, color, size,
}: { delay: number; startX: number; color: string; size: number }) => {
  const translateY = useSharedValue(-60);
  const translateX = useSharedValue(0);
  const rotate    = useSharedValue(0);
  const opacity   = useSharedValue(0);

  useEffect(() => {
    opacity.value    = withDelay(delay, withTiming(1, { duration: 150 }));
    translateY.value = withDelay(delay, withTiming(SCREEN_H * 0.75, { duration: 2200, easing: Easing.in(Easing.quad) }));
    translateX.value = withDelay(delay, withRepeat(
      withSequence(withTiming(22, { duration: 600 }), withTiming(-22, { duration: 600 })),
      -1, true,
    ));
    rotate.value = withDelay(delay, withRepeat(withTiming(360, { duration: 850, easing: Easing.linear }), -1));
    opacity.value = withDelay(delay + 1700, withTiming(0, { duration: 500 }));

    return () => {
      cancelAnimation(translateY); cancelAnimation(translateX);
      cancelAnimation(rotate);     cancelAnimation(opacity);
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
    <Animated.View style={[{
      position: 'absolute', top: 0, left: startX,
      width: size, height: size * 1.4, borderRadius: 2, backgroundColor: color,
    }, style]} />
  );
};

// ── heart pulse orbiting the badge ────────────────────────────────────────────
const OrbitHeart = ({ angle, delay }: { angle: number; delay: number }) => {
  const scale   = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 300 }));
    scale.value   = withDelay(delay, withSpring(1, { damping: 8, stiffness: 100 }));
    scale.value   = withDelay(delay + 400, withRepeat(
      withSequence(withTiming(1.25, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1, true,
    ));
  }, []);

  const RADIUS = 100;
  const x = Math.cos((angle * Math.PI) / 180) * RADIUS;
  const y = Math.sin((angle * Math.PI) / 180) * RADIUS;

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Text style={[{ position: 'absolute', fontSize: 18, left: x + 62, top: y + 62 }, style]}>
      ✨
    </Animated.Text>
  );
};

type Props = { visible: boolean; emoji: string; label: string; onClose: () => void };

export default function FeedbackCelebration({ visible, emoji, label, onClose }: Props) {
  const backdrop    = useSharedValue(0);
  const badgeScale  = useSharedValue(0);
  const badgeFlip   = useSharedValue(0);
  const heartPulse  = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const textShift   = useSharedValue(24);

  const confetti = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({
      key: i,
      delay: Math.floor(Math.random() * 500),
      startX: Math.random() * SCREEN_W,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 6 + Math.random() * 7,
    })),
    [],
  );

  useEffect(() => {
    if (visible) {
      backdrop.value   = withTiming(1, { duration: 280 });
      badgeScale.value = withDelay(100, withSpring(1, { damping: 9, stiffness: 120 }));
      badgeFlip.value  = withDelay(100, withTiming(720, { duration: 900, easing: Easing.out(Easing.cubic) }));
      heartPulse.value = withDelay(900, withRepeat(
        withSequence(withTiming(1.15, { duration: 550 }), withTiming(1, { duration: 550 })),
        -1, true,
      ));
      textOpacity.value = withDelay(650, withTiming(1, { duration: 400 }));
      textShift.value   = withDelay(650, withSpring(0, { damping: 12 }));
    } else {
      backdrop.value   = 0; badgeScale.value = 0; badgeFlip.value = 0;
      heartPulse.value = 1; textOpacity.value = 0; textShift.value = 24;
    }
  }, [visible]);

  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));
  const badgeStyle    = useAnimatedStyle(() => ({
    transform: [{ perspective: 800 }, { scale: badgeScale.value }, { rotateY: `${badgeFlip.value}deg` }],
  }));
  const heartStyle    = useAnimatedStyle(() => ({ transform: [{ scale: heartPulse.value }] }));
  const textStyle     = useAnimatedStyle(() => ({
    opacity: textOpacity.value, transform: [{ translateY: textShift.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[st.backdrop, backdropStyle]}>
        {confetti.map((c) => <ConfettiPiece key={c.key} {...c} />)}

        <View style={st.center}>
          {/* 3D badge */}
          <View style={{ width: 146, height: 146, alignItems: 'center', justifyContent: 'center' }}>
            <OrbitHeart angle={-40} delay={700} />
            <OrbitHeart angle={220} delay={800} />
            <OrbitHeart angle={90}  delay={900} />
            <Animated.View style={[st.badge, badgeStyle]}>
              <Animated.Text style={[st.badgeEmoji, heartStyle]}>{emoji}</Animated.Text>
            </Animated.View>
          </View>

          {/* text */}
          <Animated.View style={[st.textBlock, textStyle]}>
            <Text style={st.title}>Thank you! 🙏</Text>
            <Text style={st.subtitle}>
              You selected{' '}
              <Text style={{ fontWeight: '800', color: '#C4B5FD' }}>"{label}"</Text>
              {'\n'}We'll personalise your rest plan{'\n'}to match what works for you.
            </Text>

            <TouchableOpacity style={st.button} activeOpacity={0.88} onPress={onClose}>
              <Text style={st.buttonText}>Continue  →</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const st = StyleSheet.create({
  backdrop: {
    flex: 1, backgroundColor: 'rgba(11,10,36,0.78)', overflow: 'hidden',
  },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
  },
  badge: {
    width: 142, height: 142, borderRadius: 71, backgroundColor: '#1E1440',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#8B5CF6',
    shadowColor: '#8B5CF6', shadowOpacity: 0.65, shadowRadius: 32, shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  badgeEmoji: { fontSize: 62 },
  textBlock:  { alignItems: 'center', marginTop: 32 },
  title:      { fontSize: 28, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.4 },
  subtitle:   { fontSize: 15, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12, lineHeight: 23 },
  button: {
    marginTop: 30, backgroundColor: '#8B5CF6', borderRadius: 999,
    paddingVertical: 16, paddingHorizontal: 36,
    shadowColor: '#8B5CF6', shadowOpacity: 0.45, shadowRadius: 18, shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
