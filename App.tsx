import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { AppMusicProvider } from './hooks/useAppMusic';
import { ThemeProvider } from './hooks/useTheme';
import { ReflectionProvider } from './hooks/useReflection';

export default function App() {
  return (
    <ThemeProvider>
      <ReflectionProvider>
      <AppMusicProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppMusicProvider>
      </ReflectionProvider>
    </ThemeProvider>
  );
}
