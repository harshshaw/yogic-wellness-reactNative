import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './components/AppNavigator';
import { AppMusicProvider } from './hooks/useAppMusic';

export default function App() {
  return (
    <AppMusicProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppMusicProvider>
  );
}
