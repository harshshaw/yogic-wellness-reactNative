import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { COLORS, styles } from '../styles/NowPlayingScreen.styles';

const ChevronDownIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M6 9l6 6 6-6"
      stroke={color}
      strokeWidth={2}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DotsVerticalIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M12 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
      fill={color}
    />
  </Svg>
);

const HeartIcon = ({ color, filled }: { color: string; filled: boolean }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24">
    <Path
      d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10z"
      stroke={color}
      strokeWidth={1.8}
      fill={filled ? color : 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShuffleIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M16 3h5v5M21 3l-7 7M21 16v5h-5M21 21l-7-7M3 3l7 7M3 21l7-7"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const RepeatIcon = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24">
    <Path
      d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PrevIcon = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill={color} />
  </Svg>
);

const NextIcon = ({ color }: { color: string }) => (
  <Svg width={28} height={28} viewBox="0 0 24 24">
    <Path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" fill={color} />
  </Svg>
);

const PlayIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M8 5v14l11-7z" fill={color} />
  </Svg>
);

const PauseIcon = ({ color, size = 18 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} />
  </Svg>
);

const SpeakerLowIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zM15.5 8.5a4 4 0 0 1 0 7"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SpeakerHighIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M11 5L6 9H2v6h4l5 4V5zM19 5a9 9 0 0 1 0 14M16 8.5a4 4 0 0 1 0 7"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const MoonIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DownloadIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const AirplayIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Path
      d="M5 17H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2M8 21l4-5 4 5z"
      stroke={color}
      strokeWidth={1.8}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ShareIcon = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Circle cx="18" cy="5" r="3" stroke={color} strokeWidth={1.8} fill="none" />
    <Circle cx="6" cy="12" r="3" stroke={color} strokeWidth={1.8} fill="none" />
    <Circle cx="18" cy="19" r="3" stroke={color} strokeWidth={1.8} fill="none" />
    <Path
      d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </Svg>
);

const VinylVisual = () => (
  <Svg width={140} height={140} viewBox="0 0 100 100">
    <Circle
      cx="50"
      cy="50"
      r="32"
      stroke={COLORS.primaryGold}
      strokeWidth={1.5}
      fill="none"
      opacity={0.7}
    />
    <Circle cx="50" cy="50" r="6" fill={COLORS.primaryGold} />
  </Svg>
);

const upNext = [
  { title: 'Om Shanti Chanting', sub: 'Anxiety Relief', time: '12:10' },
  { title: 'Rain on Sacred Temple', sub: 'Focus', time: '45:00' },
];

const NowPlayingScreen = () => {
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(true);
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ChevronDownIcon color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NOW PLAYING</Text>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <DotsVerticalIcon color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* ALBUM ART */}
        <View style={styles.albumWrap}>
          <View style={styles.albumCard}>
            <Text style={styles.albumLabel}>album</Text>
            <VinylVisual />
          </View>
        </View>

        {/* TRACK INFO */}
        <View style={styles.trackInfoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.trackTitle}>Himalayan Dawn</Text>
            <Text style={styles.trackSub}>Sitar &amp; Singing Bowls · Sleep</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setLiked(l => !l)}>
            <HeartIcon
              color={liked ? COLORS.primaryGold : COLORS.textSecondary}
              filled={liked}
            />
          </TouchableOpacity>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
          <View style={styles.progressThumb} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>6:28</Text>
          <Text style={styles.timeText}>-11:56</Text>
        </View>

        {/* PLAYBACK CONTROLS */}
        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.controlBtn} activeOpacity={0.7}>
            <ShuffleIcon color={COLORS.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} activeOpacity={0.7}>
            <PrevIcon color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playBtn}
            activeOpacity={0.85}
            onPress={() => setIsPlaying(p => !p)}
          >
            {isPlaying ? (
              <PauseIcon color={COLORS.primaryGold} size={20} />
            ) : (
              <PlayIcon color={COLORS.primaryGold} size={20} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} activeOpacity={0.7}>
            <NextIcon color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn} activeOpacity={0.7}>
            <RepeatIcon color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* VOLUME */}
        <View style={styles.volumeRow}>
          <SpeakerLowIcon color={COLORS.textSecondary} />
          <View style={styles.volumeTrack}>
            <View style={styles.volumeFill} />
          </View>
          <SpeakerHighIcon color={COLORS.textSecondary} />
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsRow}>
          <ActionItem icon={<MoonIcon color={COLORS.primaryGold} />} label="Sleep timer" />
          <ActionItem icon={<DownloadIcon color={COLORS.primaryGold} />} label="Download" />
          <ActionItem icon={<AirplayIcon color={COLORS.primaryGold} />} label="Airplay" />
          <ActionItem icon={<ShareIcon color={COLORS.primaryGold} />} label="Share" />
        </View>

        {/* UP NEXT */}
        <View style={styles.upNextCard}>
          <View style={styles.upNextHeader}>
            <Text style={styles.upNextTitle}>UP NEXT</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.queueLink}>Queue</Text>
            </TouchableOpacity>
          </View>
          {upNext.map((track, i) => (
            <View key={i} style={[styles.upNextRow, i === 0 && { borderTopWidth: 0 }]}>
              <View style={styles.upNextThumb} />
              <View style={styles.upNextInfo}>
                <Text style={styles.upNextTrackTitle}>{track.title}</Text>
                <Text style={styles.upNextTrackSub}>{track.sub}</Text>
              </View>
              <Text style={styles.upNextTime}>{track.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const ActionItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <TouchableOpacity style={styles.actionItem} activeOpacity={0.7}>
    <View style={styles.actionIconWrap}>{icon}</View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default NowPlayingScreen;
