import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { COLORS, styles } from '../styles/HomeScreen.styles';

const MenuIcon = ({ color }: { color: string }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Path d="M3 6h18M3 12h18M3 18h18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const BellIcon = ({ color }: { color: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24">
    <Path
      d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.83V3.5a1.5 1.5 0 1 0-3 0v.67A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinejoin="round"
    />
  </Svg>
);

const ChevronRight = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M9 6l6 6-6 6" stroke={color} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const FlameIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M12 2c1 3.5-2 5-2 8a2 2 0 1 0 4 0c0-1 .5-2 1-2 1 2 3 4 3 7a6 6 0 1 1-12 0c0-4 4-6 6-13z"
      fill={color}
    />
  </Svg>
);

const StepsIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M7 4c1.5 0 2.5 1.5 2.5 3.5S8.5 11 7 11 4.5 9.5 4.5 7.5 5.5 4 7 4zm0 9c1.5 0 2.5 1 2.5 2.5S8 18 7 18.5c-1 .5-2 1-2 2 0 1 .5 1.5 1.5 1.5h2c1 0 1.5-.5 1.5-1.5 0-2-2-3-2-4.5 0-1 1-2 2-2 1.5 0 2.5-1 2.5-2.5S11 10 10 10c-1.5 0-3 1.5-3 3zm10-9c1.5 0 2.5 1.5 2.5 3.5S18.5 11 17 11s-2.5-1.5-2.5-3.5S15.5 4 17 4zm0 9c1.5 0 2.5 1 2.5 2.5S18 18 17 18.5c-1 .5-2 1-2 2 0 1 .5 1.5 1.5 1.5h2c1 0 1.5-.5 1.5-1.5 0-2-2-3-2-4.5 0-1 1-2 2-2"
      fill={color}
    />
  </Svg>
);

const ClockIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8zm.5-13H11v6l5 3 .8-1.3-4.3-2.5z"
      fill={color}
    />
  </Svg>
);

const OmIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M7 14a4 4 0 1 1 6-3.5M13 8a3 3 0 0 1 6 0c0 2-2 3-4 3M5 18c2 0 3-1 3-3M16 16a3 3 0 1 0 3 3M14 4.5a2 2 0 1 1 1 1.8"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinecap="round"
    />
  </Svg>
);

type StatRingProps = {
  value: string;
  label: string;
  sub: string;
  color: string;
  progress: number;
  Icon: React.FC<{ color: string }>;
};

const StatRing = ({ value, label, sub, color, progress, Icon }: StatRingProps) => {
  const radius = 38;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const dash = (progress / 100) * circumference;

  return (
    <View style={styles.ringContainer}>
      <View style={styles.ringSvgWrap}>
        <Svg width={90} height={90}>
          <Circle
            cx="45"
            cy="45"
            r={radius}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <Circle
            cx="45"
            cy="45"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - dash}
            strokeLinecap="round"
            transform="rotate(-90 45 45)"
          />
        </Svg>
        <View style={styles.ringInner}>
          <Icon color={color} />
          <Text style={styles.ringValue}>{value}</Text>
        </View>
      </View>
      <Text style={styles.ringLabel}>{label}</Text>
      <Text style={styles.ringSub}>{sub}</Text>
    </View>
  );
};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER WITH GURU IMAGE */}
        <ImageBackground
          source={require('../assets/images/meditatingGuru.png')}
          style={styles.header}
          imageStyle={styles.headerImage}
        >
          <View style={styles.headerOverlay} />

          <View style={styles.topBar}>
            <TouchableOpacity activeOpacity={0.7}>
              <MenuIcon color={COLORS.deepBrown} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7}>
              <BellIcon color={COLORS.deepBrown} />
            </TouchableOpacity>
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>Namaste, Arjun 🙏</Text>
            <Text style={styles.greetingSub}>
              Embrace the ancient wisdom,{'\n'}Transform your life.
            </Text>
          </View>
        </ImageBackground>

        {/* YOUR PROGRESS CARD */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <OmIcon color={COLORS.primaryGold} />
            <Text style={styles.progressTitle}>Your Progress</Text>
          </View>

          <View style={styles.ringsRow}>
            <StatRing
              value="520"
              label="Calories"
              sub="/700 kcal"
              color={COLORS.sunsetOrange}
              progress={74}
              Icon={FlameIcon}
            />
            <StatRing
              value="8,243"
              label="Steps"
              sub="/10,000"
              color={COLORS.sageGreen}
              progress={82}
              Icon={StepsIcon}
            />
            <StatRing
              value="52"
              label="Minutes"
              sub="/60 min"
              color={COLORS.primaryGold}
              progress={86}
              Icon={ClockIcon}
            />
          </View>
        </View>

        {/* TODAY'S GOAL */}
        <ImageBackground
          source={require('../assets/images/meditatingGuru.png')}
          style={styles.goalCard}
          imageStyle={styles.goalImage}
        >
          <View style={styles.goalOverlay} />
          <Text style={styles.goalTitle}>Today's Goal</Text>
          <Text style={styles.goalSub}>Keep going, you're doing great!</Text>
          <View style={styles.goalRow}>
            <Text style={styles.goalPercent}>75%</Text>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>
        </ImageBackground>

        {/* TODAY'S FOCUS */}
        <Text style={styles.sectionTitle}>Today's Focus</Text>

        <TouchableOpacity activeOpacity={0.85} style={styles.focusCard}>
          <View style={styles.focusIconWrap}>
            <OmIcon color={COLORS.primaryGold} />
          </View>
          <View style={styles.focusContent}>
            <Text style={styles.focusTitle}>Surya Namaskar</Text>
            <Text style={styles.focusDesc}>Improve strength &amp;</Text>
            <Text style={styles.focusMeta}>25 min • Intermediate</Text>
          </View>
          <View style={styles.focusPlay}>
            <ChevronRight color={COLORS.deepBrown} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
