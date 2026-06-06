import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { AppMusicProvider } from './hooks/useAppMusic';
import { ThemeProvider } from './hooks/useTheme';

export default function App() {
  return (
    <ThemeProvider>
      <AppMusicProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppMusicProvider>
    </ThemeProvider>
  );
}
