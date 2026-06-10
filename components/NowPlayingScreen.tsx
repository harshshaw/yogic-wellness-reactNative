import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAppMusic } from '../hooks/useAppMusic';

const BG_VIDEO = require('../assets/background-video/portrait2.mp4');

// ─── ICONS ──────────────────────────────────────────────────────────────
const ChevronDown = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
    <Path d="M6 9l6 6 6-6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const Dots = ({ color }: { color: string }) => (
  <Svg width={20} height={20} viewBox="0 0 24 24">
    <Circle cx="12" cy="5" r="1.6" fill={color} />
    <Circle cx="12" cy="12" r="1.6" fill={color} />
    <Circle cx="12" cy="19" r="1.6" fill={color} />
  </Svg>
);

const Heart = ({ color, filled }: { color: string; filled?: boolean }) => (
  <Svg width={26} height={26} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 19 11c0 5.65-7 10-7 10z"
      stroke={color}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
  </Svg>
);

const Shuffle = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 3h5v5M21 3l-7 7M21 16v5h-5M21 21l-7-7M3 3l7 7M3 21l7-7"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Repeat = ({ color }: { color: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const Prev = ({ color }: { color: string }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" fill={color} />
  </Svg>
);

const Next = ({ color }: { color: string }) => (
  <Svg width={32} height={32} viewBox="0 0 24 24">
    <Path d="M16 6h2v12h-2zM6 18l8.5-6L6 6z" fill={color} />
  </Svg>
);

const Play = ({ color, size = 28 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M8 5v14l11-7z" fill={color} /></Svg>
);

const Pause = ({ color, size = 28 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24"><Path d="M6 5h4v14H6zM14 5h4v14h-4z" fill={color} /></Svg>
);

// ─── SCREEN ─────────────────────────────────────────────────────────────
const NowPlayingScreen = () => {
  const navigation = useNavigation();
  const { isTrackPlaying, toggleTrack } = useAppMusic();
  const [liked, setLiked] = useState(false);
  const [immersive, setImmersive] = useState(false);

  // Same hero gradient as the mini player's current track, for visual continuity.
  const gradient: readonly [string, string, string] = ['#1E3A8A', '#7C3AED', '#F472B6'];

  // ── IMMERSIVE MODE: full-screen looping video, tap anywhere to return.
  if (immersive) {
    return (
      <View style={styles.immersiveContainer}>
        <Video
          source={BG_VIDEO}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay
        />
        <TouchableWithoutFeedback onPress={() => setImmersive(false)}>
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.exitHint}>
              <View style={styles.exitHintBar} />
              <Text style={styles.exitHintText}>Tap anywhere to return</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  // ── NORMAL MODE: any non-button tap (while music is playing) enters immersive.
  const onSurfacePress = () => {
    if (isTrackPlaying) setImmersive(true);
  };

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Soft dark veil so white text stays readable */}
      <View style={styles.veil} />

      <Pressable style={{ flex: 1 }} onPress={onSurfacePress}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
          >
            <ChevronDown color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.headerLabel}>PLAYING FROM</Text>
            <Text style={styles.headerSource}>Continue Listening</Text>
          </View>
          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Dots color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* ALBUM ART — large square */}
        <View style={styles.artWrap}>
          <View style={styles.artCard}>
            <LinearGradient
              colors={gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFillObject}
            />
            <Text style={styles.artGlyph}>ॐ</Text>
          </View>
        </View>

        {/* TRACK INFO */}
        <View style={styles.trackInfo}>
          <View style={{ flex: 1 }}>
            <Text style={styles.trackTitle}>Himalayan Dawn</Text>
            <Text style={styles.trackArtist}>Sitar &amp; Singing Bowls · Sleep</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setLiked(l => !l)}>
            <Heart color={liked ? '#FCA5A5' : '#FFFFFF'} filled={liked} />
          </TouchableOpacity>
        </View>

        {/* PROGRESS */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: '38%' }]} />
          <View style={styles.progressThumb} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>6:42</Text>
          <Text style={styles.timeText}>-11:42</Text>
        </View>

        {/* TRANSPORT */}
        <View style={styles.transportRow}>
          <TouchableOpacity activeOpacity={0.7}><Shuffle color="rgba(255,255,255,0.75)" /></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}><Prev color="#FFFFFF" /></TouchableOpacity>
          <TouchableOpacity
            style={styles.playBtn}
            activeOpacity={0.85}
            onPress={toggleTrack}
          >
            {isTrackPlaying ? <Pause color={gradient[0]} /> : <Play color={gradient[0]} />}
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}><Next color="#FFFFFF" /></TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}><Repeat color="rgba(255,255,255,0.75)" /></TouchableOpacity>
        </View>

        {/* SECONDARY ACTIONS */}
        <View style={styles.secondaryRow}>
          <ActionPill icon="◑" label="Sleep timer" />
          <ActionPill icon="↓" label="Download" />
          <ActionPill icon="⤴" label="Share" />
        </View>

        {/* UP NEXT */}
        <View style={styles.upNextCard}>
          <View style={styles.upNextHeader}>
            <Text style={styles.upNextOverline}>UP NEXT</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.upNextQueue}>Queue</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.upNextDivider} />
          <UpNextRow title="Om Shanti — Chanting Flow" sub="Anxiety Relief" time="12:10" />
          <UpNextRow title="Rain on Sacred Temple"      sub="Focus"          time="45:00" />
          <UpNextRow title="Nidra Yoga Waves"           sub="Deep Sleep"     time="30:00" />
        </View>
      </ScrollView>
      </Pressable>

      {/* Bottom dismiss hint */}
      <View style={styles.dismissHint}>
        <View style={styles.dismissBar} />
      </View>
    </LinearGradient>
  );
};

const ActionPill = ({ icon, label }: { icon: string; label: string }) => (
  <TouchableOpacity style={styles.actionPill} activeOpacity={0.7}>
    <Text style={styles.actionPillIcon}>{icon}</Text>
    <Text style={styles.actionPillLabel}>{label}</Text>
  </TouchableOpacity>
);

const UpNextRow = ({
  title,
  sub,
  time,
}: {
  title: string;
  sub: string;
  time: string;
}) => (
  <View style={styles.upNextRow}>
    <View style={styles.upNextThumb} />
    <View style={{ flex: 1 }}>
      <Text style={styles.upNextTitle} numberOfLines={1}>{title}</Text>
      <Text style={styles.upNextSub}>{sub}</Text>
    </View>
    <Text style={styles.upNextTime}>{time}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  veil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  // ── IMMERSIVE MODE ────────────────────────────────────────
  immersiveContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  exitHint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 16,
    gap: 8,
  },
  exitHintBar: {
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  exitHintText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  scroll: { paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  headerSource: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', marginTop: 2 },

  artWrap: { paddingHorizontal: 30, marginTop: 18 },
  artCard: {
    aspectRatio: 1,
    borderRadius: 28,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 30,
    elevation: 12,
  },
  artGlyph: {
    fontSize: 140,
    color: 'rgba(255,255,255,0.92)',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },

  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 26,
    marginTop: 30,
  },
  trackTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', letterSpacing: -0.4 },
  trackArtist: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },

  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 2,
    marginHorizontal: 26,
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: { height: '100%', backgroundColor: '#FFFFFF', borderRadius: 2 },
  progressThumb: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#FFFFFF',
    marginLeft: -7,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    marginTop: 8,
  },
  timeText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500' },

  transportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 28,
  },
  playBtn: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 6 }, shadowRadius: 12,
  },

  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    marginTop: 30,
    gap: 10,
  },
  actionPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  actionPillIcon: { color: '#FFFFFF', fontSize: 14 },
  actionPillLabel: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  upNextCard: {
    marginHorizontal: 22,
    marginTop: 28,
    padding: 18,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  upNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  upNextOverline: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
  },
  upNextQueue: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  upNextDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 12 },
  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  upNextThumb: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  upNextTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  upNextSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  upNextTime: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  dismissHint: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dismissBar: {
    width: 80,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
});

export default NowPlayingScreen;
