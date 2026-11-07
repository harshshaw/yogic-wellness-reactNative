import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './components/AppNavigator';
import { AppMusicProvider } from './hooks/useAppMusic';
import { AuthProvider } from './hooks/useAuth';
import { ReflectionProvider } from './hooks/useReflection';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { Platform } from 'react-native';
import MarketingLandingScreen from './components/MarketingLandingScreen';

// Keeps the OS status bar (clock, wifi, battery) legible against the
// active theme — light icons at night, dark icons during the day.
function ThemedStatusBar() {
  const { mode } = useTheme();
  return <StatusBar style={mode === 'night' ? 'light' : 'dark'} />;
}

export default function App() {
  if (Platform.OS === 'web') {
    return <MarketingLandingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <ReflectionProvider>
              <AppMusicProvider>
                <ThemedStatusBar />
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </AppMusicProvider>
            </ReflectionProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
