import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import reelsContent from '../utils/reels-content.json';
import reelVideoSources from '../utils/reel-videos.generated';

const { height: SCREEN_H } = Dimensions.get('window');

type QuoteItem = {
  kind: 'quote';
  id: string;
  category: string;
  text: string;
  source: string;
};

type VideoItem = {
  kind: 'video';
  id: string;
  source: ReturnType<typeof require>;
};

type FeedItem = QuoteItem | VideoItem;

const quotes: QuoteItem[] = (reelsContent as { id: number; category: string; text: string; source: string }[]).map(
  q => ({ kind: 'quote', id: `quote-${q.id}`, category: q.category, text: q.text, source: q.source })
);

// Reel video clips, mixed into the feed alongside the text quote cards.
// Sourced from utils/reel-videos.generated.ts, which is regenerated from
// every .mp4 in assets/reel-videos/ on each `npm start` — drop a new file in
// that folder and it shows up here automatically, no code changes needed.
const videos: VideoItem[] = reelVideoSources.map((source, i) => ({
  kind: 'video',
  id: `video-${i}`,
  source,
}));

// Alternating gradient palette — cycles by index so each scroll lands on a
// visibly different backdrop, regardless of category.
const PALETTES: readonly [string, string, string][] = [
  ['#1E3A8A', '#3B82F6', '#7DD3FC'],
  ['#7C3AED', '#C084FC', '#F472B6'],
  ['#0E7490', '#5EEAD4', '#A7F3D0'],
  ['#047857', '#6EE7B7', '#FEF3C7'],
  ['#B45309', '#FCD34D', '#FDE68A'],
  ['#9D174D', '#F472B6', '#FBCFE8'],
  ['#9A3412', '#FB923C', '#FED7AA'],
  ['#312E81', '#818CF8', '#C7D2FE'],
];

const Close = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
);

const QuoteCard = ({ item, palette }: { item: QuoteItem; palette: readonly [string, string, string] }) => (
  <View style={{ height: SCREEN_H, width: '100%' }}>
    <LinearGradient
      colors={palette}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={StyleSheet.absoluteFillObject}
    />
    <SafeAreaView style={styles.cardContent}>
      <Text style={styles.category}>{item.category.toUpperCase()}</Text>
      <Text style={styles.quoteText}>{item.text}</Text>
      <Text style={styles.source}>— {item.source}</Text>
    </SafeAreaView>
  </View>
);

const VideoCard = ({ item, active }: { item: VideoItem; active: boolean }) => (
  <View style={{ height: SCREEN_H, width: '100%', backgroundColor: '#000' }}>
    <Video
      source={item.source}
      style={StyleSheet.absoluteFillObject}
      resizeMode={ResizeMode.COVER}
      isLooping
      isMuted={false}
      shouldPlay={active}
    />
  </View>
);

// Fisher-Yates shuffle so the feed order is randomized on every screen open.
const shuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const buildFeed = (): FeedItem[] => shuffle<FeedItem>([...quotes, ...videos]);

const ReelsScreen = () => {
  const navigation = useNavigation<any>();
  const [feed] = useState(buildFeed);
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    }
  ).current;
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={feed}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) =>
          item.kind === 'video' ? (
            <VideoCard item={item} active={index === activeIndex} />
          ) : (
            <QuoteCard item={item} palette={PALETTES[index % PALETTES.length]} />
          )
        }
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={SCREEN_H}
        snapToAlignment="start"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: SCREEN_H, offset: SCREEN_H * index, index })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <SafeAreaView style={styles.headerOverlay} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <Close color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },

  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  category: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 18,
  },
  quoteText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 38,
    letterSpacing: -0.4,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  source: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 22,
  },
});

export default ReelsScreen;
