import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { COLORS, styles } from '../styles/MusicScreen.styles';

const SearchIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zm0 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm10.7 14.3l-4.4-4.4-1.4 1.4 4.4 4.4z"
      fill={color}
    />
  </Svg>
);

const BellIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.83V3.5a1.5 1.5 0 1 0-3 0v.67A7 7 0 0 0 5 11v5l-2 2v1h18v-1l-2-2z"
      stroke={color}
      strokeWidth={1.6}
      fill="none"
      strokeLinejoin="round"
    />
  </Svg>
);

const PlayIcon = ({ color, size = 14 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

const PauseIcon = ({ color, size = 14 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} />
  </Svg>
);

const PrevIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill={color} />
  </Svg>
);

const NextIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" fill={color} />
  </Svg>
);

const DotsIcon = ({ color }: { color: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24">
    <Path
      d="M12 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      fill={color}
    />
  </Svg>
);

const PlayingBars = ({ color }: { color: string }) => (
  <View style={styles.playingBars}>
    <View style={[styles.playingBar, { height: 8, backgroundColor: color }]} />
    <View style={[styles.playingBar, { height: 14, backgroundColor: color }]} />
    <View style={[styles.playingBar, { height: 6, backgroundColor: color }]} />
  </View>
);

const categories = ['All', 'Sleep', 'Anxiety', 'Focus', 'Healing'];

const moods = [
  { name: 'Calm', color: COLORS.primaryGold },
  { name: 'Grounded', color: COLORS.sageGreen },
  { name: 'Restful', color: COLORS.lavender },
  { name: 'Healing', color: COLORS.rose },
];

const featured = [
  { id: 'mountains', tag: 'SLEEP', title: 'Himalayan Stillness', meta: '8 tracks · 42 min' },
  { id: 'temple', tag: 'ANXIETY', title: 'Pranayama Flows', meta: '6 tracks · 35 min' },
];

type Track = { title: string; sub: string; meta: string; playing?: boolean };

const queue: Track[] = [
  { title: 'Himalayan Dawn — Sitar & Bowls', sub: 'Sleep', meta: '', playing: true },
  { title: 'Om Shanti — Chanting Flow', sub: 'Anxiety Relief', meta: '12:10' },
  { title: 'Rain on Sacred Temple', sub: 'Focus', meta: '45:00' },
  { title: 'Nidra Yoga Waves', sub: 'Deep Sleep', meta: '30:00' },
];

const recent = [
  { title: 'Deep Sleep', meta: 'Binaural · 60 min' },
  { title: 'Ganga Aarti', meta: 'Devotional · 20 min' },
  { title: 'Monsoon Raga', meta: 'Classical · 18 min' },
];

const MusicScreen = () => {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeMood, setActiveMood] = useState('Calm');
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.overline}>SOUNDSCAPES</Text>
            <Text style={styles.title}>Sacred Music</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
              <SearchIcon color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
              <BellIcon color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsRow}
          contentContainerStyle={styles.chipsRowContent}
        >
          {categories.map(cat => {
            const active = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.8}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* MOOD CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.chipsRow, { marginTop: 12 }]}
          contentContainerStyle={styles.chipsRowContent}
        >
          {moods.map(mood => {
            const active = mood.name === activeMood;
            return (
              <TouchableOpacity
                key={mood.name}
                style={[
                  styles.moodChip,
                  active && { borderColor: mood.color },
                ]}
                onPress={() => setActiveMood(mood.name)}
                activeOpacity={0.8}
              >
                <View style={[styles.moodDot, { backgroundColor: mood.color }]} />
                <Text style={styles.moodText}>{mood.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* FEATURED CARDS */}
        <View style={styles.featuredRow}>
          {featured.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.featuredCard}
              activeOpacity={0.85}
            >
              <View style={styles.featuredTop}>
                <Text style={styles.featuredImageLabel}>{card.id}</Text>
                <View style={styles.featuredPlay}>
                  <PlayIcon color={COLORS.deepBrown} />
                </View>
              </View>
              <View style={styles.featuredBottom}>
                <View style={styles.featuredTagRow}>
                  <Text style={styles.featuredTagStar}>✦</Text>
                  <Text style={styles.featuredTag}>{card.tag}</Text>
                </View>
                <Text style={styles.featuredTitle}>{card.title}</Text>
                <Text style={styles.featuredMeta}>{card.meta}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOW PLAYING QUEUE */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Now Playing Queue</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {queue.map((track, i) => (
          <View key={i} style={styles.trackRow}>
            <View style={styles.trackThumb} />
            <View style={styles.trackInfo}>
              <Text
                style={[styles.trackTitle, track.playing && styles.trackTitleActive]}
                numberOfLines={1}
              >
                {track.title}
              </Text>
              <Text style={styles.trackSub}>{track.sub}</Text>
            </View>
            {track.playing ? (
              <PlayingBars color={COLORS.primaryGold} />
            ) : (
              <Text style={styles.trackTime}>{track.meta}</Text>
            )}
            <TouchableOpacity style={styles.trackMore} activeOpacity={0.6}>
              <DotsIcon color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* RECENTLY PLAYED */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentRow}>
          {recent.map(item => (
            <TouchableOpacity key={item.title} style={styles.recentCard} activeOpacity={0.85}>
              <View style={styles.recentThumb} />
              <Text style={styles.recentTitle}>{item.title}</Text>
              <Text style={styles.recentMeta}>{item.meta}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* MINI PLAYER (sits above the tab bar) */}
      <View style={styles.bottomDock}>
        <View style={styles.miniPlayer}>
          <View style={styles.miniPlayerInner}>
            <TouchableOpacity
              style={styles.miniTapTarget}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('NowPlaying')}
            >
              <View style={styles.miniThumb} />
              <View style={styles.miniInfo}>
                <Text style={styles.miniTitle} numberOfLines={1}>
                  Himalayan Dawn — Sitar...
                </Text>
                <Text style={styles.miniSub}>Sleep · 18:24</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniIconBtn} activeOpacity={0.7}>
              <PrevIcon color={COLORS.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.miniPlayBtn}
              onPress={() => setIsPlaying(p => !p)}
              activeOpacity={0.85}
            >
              {isPlaying ? (
                <PauseIcon color={COLORS.deepBrown} size={16} />
              ) : (
                <PlayIcon color={COLORS.deepBrown} size={16} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniIconBtn} activeOpacity={0.7}>
              <NextIcon color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
          <View style={styles.miniProgressBar}>
            <View style={styles.miniProgressFill} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default MusicScreen;
