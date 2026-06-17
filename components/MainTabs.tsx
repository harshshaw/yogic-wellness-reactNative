import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import PranayamaScreen from './PranayamaScreen';
import SleepScreen from './SleepScreen';
import ProgressScreen from './ProgressScreen';
import AICompanionScreen from './AICompanionScreen';
import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Recommend"
        component={PranayamaScreen}
        options={{ tabBarLabel: "Today's Rec" }}
      />
      <Tab.Screen name="Sleep" component={SleepScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen
        name="AICompanion"
        component={AICompanionScreen}
        options={{ tabBarLabel: 'AI Companion' }}
      />
    </Tab.Navigator>
  );
}
