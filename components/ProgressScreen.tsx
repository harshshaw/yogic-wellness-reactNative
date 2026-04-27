import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

const ProgressScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.overline}>YOUR JOURNEY</Text>
      <Text style={styles.title}>Progress</Text>
      <Text style={styles.body}>Streaks, sessions, and milestones — coming soon.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepBrown,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  overline: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ProgressScreen;
