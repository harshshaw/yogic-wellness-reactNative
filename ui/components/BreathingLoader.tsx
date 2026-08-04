import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import BrandLogo from './BrandLogo';
import { orderedQuotes } from '../utils/loadingQuotes';

/**
 * A calming full-screen loading curtain: a softly "breathing" Karmana logo over
 * a subtle gradient, with gentle quotes that fade in and out while content
 * streams in. Meant to sit on top of a screen while its media loads.
 */
export default function BreathingLoader() {
  const scale = useRef(new Animated.Value(0.9)).current;
  const glow = useRef(new Animated.Value(0.55)).current;
  const quoteOpacity = useRef(new Animated.Value(0)).current;

  const [quotes] = useState(orderedQuotes);
  const [qi, setQi] = useState(0);

  // Slow breathing pulse — the logo is the loading indicator.
  useEffect(() => {
    const breath = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, { toValue: 1.08, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 1, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(scale, { toValue: 0.9, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.55, duration: 3800, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    );
    breath.start();
    return () => breath.stop();
  }, [scale, glow]);

  // Fade the first quote in, then cross-fade to a new one every few seconds.
  useEffect(() => {
    Animated.timing(quoteOpacity, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const id = setInterval(() => {
      Animated.timing(quoteOpacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        setQi(i => (i + 1) % quotes.length);
        Animated.timing(quoteOpacity, { toValue: 1, duration: 700, useNativeDriver: true }).start();
      });
    }, 5200);
    return () => clearInterval(id);
  }, [quotes.length, quoteOpacity]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={['#EAF1FF', '#F6F9FF', '#E7EFFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.center}>
        <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity: glow }]}>
          <View style={styles.halo} />
          <BrandLogo size={78} radius={22} />
        </Animated.View>

        <Animated.Text style={[styles.quote, { opacity: quoteOpacity }]}>
          {quotes[qi]}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  logoWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 34 },
  halo: {
    position: 'absolute',
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: 'rgba(91,141,239,0.16)',
  },
  quote: {
    fontSize: 19,
    lineHeight: 28,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#17253D',
    maxWidth: 320,
  },
});
