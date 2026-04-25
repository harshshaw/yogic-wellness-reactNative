import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

type TabKey = 'Home' | 'Dashboard' | 'Profile';

const TabIcon = ({ tab, color }: { tab: TabKey; color: string }) => {
  const paths: Record<TabKey, string> = {
    Home: 'M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5z',
    Dashboard:
      'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
    Profile:
      'M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.3 0-8 1.7-8 5v3h16v-3c0-3.3-4.7-5-8-5z',
  };
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Path d={paths[tab]} fill={color} />
    </Svg>
  );
};

const StatRing = ({ value, label, color }: { value: number; label: string; color: string }) => {
  const radius = 30;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / 100) * circumference;
  

  return (
    <View style={styles.ringContainer}>
      <Svg width={80} height={80}>
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </Svg>
      <Text style={styles.ringValue}>{value}</Text>
      <Text style={styles.ringLabel}>{label}</Text>
    </View>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('Home');
  const tabs: TabKey[] = ['Home', 'Dashboard', 'Profile'];

  return (
    <View style={styles.container}>
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={{ paddingBottom: 100 }}
    >

      {/* 🌅 HEADER WITH GURU IMAGE */}
      <ImageBackground
        source={require('../assets/images/meditatingGuru.png')}
        style={styles.header}
        imageStyle={{ borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
      >
        <View style={styles.overlay} />

        <Text style={styles.title}>Yogic Wellness</Text>
        <Text style={styles.subtitle}>Mind • Body • Soul</Text>
      </ImageBackground>

      {/* 🔴 STATS RINGS */}
      <View style={styles.ringsRow}>
        <StatRing value={75} label="Calories" color="#FF8A3D" />
        <StatRing value={60} label="Steps" color="#4EC7A4" />
        <StatRing value={40} label="Minutes" color="#D4AF37" />
      </View>

      {/* 📊 TODAY GOAL */}
      <View style={styles.goalCard}>
        <Text style={styles.cardTitle}>Today’s Goal</Text>
        <Text style={styles.cardSub}>Keep going, you're doing great!</Text>

        <View style={styles.progressBar}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.percent}>75%</Text>
      </View>

      {/* 🧘 FEATURED */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today’s Focus</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Surya Namaskar</Text>
          <Text style={styles.cardDescription}>
            Improve strength & flexibility
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Meditation</Text>
          <Text style={styles.cardDescription}>
            Calm your mind and reduce stress
          </Text>
        </View>
      </View>
    </ScrollView>

    {/* 🧭 BOTTOM NAVIGATION */}
    <View style={styles.bottomNav}>
      {tabs.map(tab => {
        const isActive = activeTab === tab;
        const color = isActive ? '#D4AF37' : '#8A8A8E';
        return (
          <TouchableOpacity
            key={tab}
            style={styles.navButton}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab)}
          >
            <TabIcon tab={tab} color={color} />
            <Text style={[styles.navLabel, { color }]}>{tab}</Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },

  scroll: {
    flex: 1,
  },

  bottomNav: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  navLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },

  activeIndicator: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D4AF37',
    marginTop: 4,
  },

  header: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    fontSize: 28,
    color: '#D4AF37',
    fontWeight: '600',
  },

  subtitle: {
    fontSize: 14,
    color: '#E5C07B',
    marginTop: 8,
  },

  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -40,
    paddingHorizontal: 10,
  },

  ringContainer: {
    alignItems: 'center',
  },

  ringValue: {
    position: 'absolute',
    top: 30,
    color: '#fff',
    fontWeight: 'bold',
  },

  ringLabel: {
    marginTop: 5,
    color: '#aaa',
    fontSize: 12,
  },

  goalCard: {
    backgroundColor: '#1C1C1E',
    margin: 20,
    borderRadius: 20,
    padding: 15,
  },

  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 10,
    marginTop: 10,
  },

  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 10,
  },

  percent: {
    color: '#D4AF37',
    marginTop: 5,
  },

  section: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 18,
    color: '#D4AF37',
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#1C1C1E',
    padding: 15,
    borderRadius: 20,
    marginBottom: 10,
  },

  cardSub: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  cardDescription: {
    color: '#aaa',
    marginTop: 5,
  },
});
export default HomeScreen;