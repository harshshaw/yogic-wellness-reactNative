import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewToken,
  Share,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import reelsContent from '../utils/reels-content.json';
import reelVideoSources from '../utils/reel-videos.generated';
import type { MediaSource } from '../lib/media';

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
  source: MediaSource;
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

const ICON_SIZE = 26;

const Heart = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12.001 20.5c-.27 0-.54-.08-.77-.26C6.93 17.04 2.5 13.16 2.5 9.04 2.5 6.26 4.7 4 7.4 4c1.62 0 3.13.83 4.04 2.17l.56.83.56-.83C13.47 4.83 14.98 4 16.6 4c2.7 0 4.9 2.26 4.9 5.04 0 4.12-4.43 8-8.73 11.2-.23.18-.5.26-.77.26z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
    />
  </Svg>
);

// Feather "thumbs-down" glyph — simple, unambiguous hand shape.
const ThumbsDown = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
      strokeLinecap="round"
      fill={filled ? color : 'none'}
    />
    <Path d="M17 2h4v9h-4" stroke={color} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" fill={filled ? color : 'none'} />
  </Svg>
);

const Bookmark = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4.2L5.5 21V4.5a1 1 0 0 1 1-1z" stroke={color} strokeWidth={1.7} strokeLinejoin="round" />
  </Svg>
);

const ShareIcon = ({ color }: { color: string }) => (
  <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
    <Path
      d="M21.44 2.56 2.69 10.2a.6.6 0 0 0 .03 1.12l7.06 2.55a1 1 0 0 1 .6.6l2.55 7.06a.6.6 0 0 0 1.12.03L21.69 2.81a.5.5 0 0 0-.25-.25Z"
      stroke={color}
      strokeWidth={1.7}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <Path d="M21.44 2.56 10.3 13.7" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
  </Svg>
);

type ReelEngagement = {
  liked: boolean;
  disliked: boolean;
  saved: boolean;
  onLike: () => void;
  onDislike: () => void;
  onSave: () => void;
  onShare: () => void;
};

const ActionRail = ({ liked, disliked, saved, onLike, onDislike, onSave, onShare }: ReelEngagement) => (
  <SafeAreaView style={styles.actionRail} pointerEvents="box-none">
    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75} onPress={onLike} hitSlop={8}>
      <View style={[styles.iconCircle, liked && styles.iconCircleLiked]}>
        <Heart color={liked ? '#FF3040' : '#FFFFFF'} filled={liked} />
      </View>
      <Text style={styles.actionLabel}>Like</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75} onPress={onDislike} hitSlop={8}>
      <View style={[styles.iconCircle, disliked && styles.iconCircleDisliked]}>
        <ThumbsDown color={disliked ? '#60A5FA' : '#FFFFFF'} filled={disliked} />
      </View>
      <Text style={styles.actionLabel}>Dislike</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75} onPress={onSave} hitSlop={8}>
      <View style={[styles.iconCircle, saved && styles.iconCircleSaved]}>
        <Bookmark color={saved ? '#FFD43B' : '#FFFFFF'} filled={saved} />
      </View>
      <Text style={styles.actionLabel}>Save</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.actionBtn} activeOpacity={0.75} onPress={onShare} hitSlop={8}>
      <View style={styles.iconCircle}>
        <ShareIcon color="#FFFFFF" />
      </View>
      <Text style={styles.actionLabel}>Share</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const QuoteCard = ({
  item,
  palette,
  engagement,
}: {
  item: QuoteItem;
  palette: readonly [string, string, string];
  engagement: ReelEngagement;
}) => (
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
    <ActionRail {...engagement} />
  </View>
);

const VideoCard = ({
  item,
  active,
  engagement,
}: {
  item: VideoItem;
  active: boolean;
  engagement: ReelEngagement;
}) => (
  <View style={{ height: SCREEN_H, width: '100%', backgroundColor: '#000' }}>
    <Video
      source={item.source}
      style={StyleSheet.absoluteFillObject}
      resizeMode={ResizeMode.COVER}
      isLooping
      isMuted={false}
      shouldPlay={active}
    />
    <ActionRail {...engagement} />
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

  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [disliked, setDisliked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const toggleIn = (set: Set<string>, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  };

  const handleLike = useCallback((id: string) => {
    setLiked(prev => toggleIn(prev, id));
    setDisliked(prev => (prev.has(id) ? toggleIn(prev, id) : prev));
  }, []);

  const handleDislike = useCallback((id: string) => {
    setDisliked(prev => toggleIn(prev, id));
    setLiked(prev => (prev.has(id) ? toggleIn(prev, id) : prev));
  }, []);

  const handleSave = useCallback((id: string) => {
    setSaved(prev => toggleIn(prev, id));
  }, []);

  const handleShare = useCallback((item: FeedItem) => {
    const message =
      item.kind === 'quote'
        ? `"${item.text}" — ${item.source}\n\nShared from Karmana`
        : 'Check out this reel on Karmana 🙏';
    Share.share({ message }).catch(() => {});
  }, []);

  const getEngagement = (item: FeedItem): ReelEngagement => ({
    liked: liked.has(item.id),
    disliked: disliked.has(item.id),
    saved: saved.has(item.id),
    onLike: () => handleLike(item.id),
    onDislike: () => handleDislike(item.id),
    onSave: () => handleSave(item.id),
    onShare: () => handleShare(item),
  });

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
        extraData={[liked, disliked, saved]}
        renderItem={({ item, index }) =>
          item.kind === 'video' ? (
            <VideoCard item={item} active={index === activeIndex} engagement={getEngagement(item)} />
          ) : (
            <QuoteCard item={item} palette={PALETTES[index % PALETTES.length]} engagement={getEngagement(item)} />
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
    paddingLeft: 32,
    paddingRight: 96,
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

  actionRail: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: 56,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  iconCircleLiked: {
    backgroundColor: 'rgba(255,48,64,0.22)',
    borderColor: 'rgba(255,48,64,0.5)',
  },
  iconCircleDisliked: {
    backgroundColor: 'rgba(96,165,250,0.22)',
    borderColor: 'rgba(96,165,250,0.5)',
  },
  iconCircleSaved: {
    backgroundColor: 'rgba(255,212,59,0.22)',
    borderColor: 'rgba(255,212,59,0.5)',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default ReelsScreen;
