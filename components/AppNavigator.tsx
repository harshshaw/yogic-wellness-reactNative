import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import SplashScreen from './SplashScreen';
import MainTabs from './MainTabs';
import MusicScreen from './MusicScreen';
import NowPlayingScreen from './NowPlayingScreen';
import BreathingSessionScreen from './BreathingSessionScreen';
import AICompanionScreen from './AICompanionScreen';
import MorningReflectionScreen from './MorningReflectionScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen
        name="Music"
        component={MusicScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="NowPlaying"
        component={NowPlayingScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="BreathingSession"
        component={BreathingSessionScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="AICompanion"
        component={AICompanionScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="MorningReflection"
        component={MorningReflectionScreen}
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
