import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BrandLogo from './BrandLogo';

type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
};

const SplashScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BrandLogo size={160} radius={32} style={styles.logo} />
      <Text style={styles.title}>Karmana</Text>
      <Text style={styles.tagline}>Breathe. Rest. Grow.</Text>
      <Text style={styles.subtitle}>Your personalised wellness companion</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 32,
    marginBottom: 28,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 17,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
  },
});

export default SplashScreen;
