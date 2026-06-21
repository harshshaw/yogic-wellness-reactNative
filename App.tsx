import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { AppMusicProvider } from './hooks/useAppMusic';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { ReflectionProvider } from './hooks/useReflection';

// Keeps the OS status bar (clock, wifi, battery) legible against the
// active theme — light icons at night, dark icons during the day.
function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'night' ? 'light' : 'dark'} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ReflectionProvider>
      <AppMusicProvider>
        <ThemedStatusBar />
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppMusicProvider>
      </ReflectionProvider>
    </ThemeProvider>
  );
}
