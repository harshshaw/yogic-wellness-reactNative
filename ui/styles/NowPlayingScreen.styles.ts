import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export { COLORS };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepBrown,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 12,
  },

  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBrown,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
  },

  headerTitle: {
    color: COLORS.primaryGold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 3,
  },

  // ALBUM ART
  albumWrap: {
    paddingHorizontal: 22,
    marginTop: 14,
  },

  albumCard: {
    aspectRatio: 1,
    borderRadius: 18,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  albumLabel: {
    position: 'absolute',
    top: 14,
    left: 16,
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  // TRACK INFO
  trackInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 22,
  },

  trackTitle: {
    color: COLORS.textPrimary,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
  },

  trackSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  // PROGRESS
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: 2,
    marginHorizontal: 22,
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressFill: {
    width: '35%',
    height: '100%',
    backgroundColor: COLORS.primaryGold,
    borderRadius: 2,
  },

  progressThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primaryGold,
    marginLeft: -7,
  },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginTop: 8,
  },

  timeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // PLAYBACK CONTROLS
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    marginTop: 22,
  },

  controlBtn: {
    padding: 8,
  },

  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // VOLUME
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 22,
    gap: 12,
  },

  volumeTrack: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderRadius: 2,
  },

  volumeFill: {
    width: '55%',
    height: '100%',
    backgroundColor: COLORS.primaryGold,
    borderRadius: 2,
  },

  // ACTION ROW
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginTop: 26,
  },

  actionItem: {
    alignItems: 'center',
    flex: 1,
  },

  actionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  actionLabel: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },

  // UP NEXT
  upNextCard: {
    marginHorizontal: 18,
    marginTop: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.18)',
    padding: 14,
    backgroundColor: 'rgba(42,31,23,0.4)',
  },

  upNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  upNextTitle: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '700',
  },

  queueLink: {
    color: COLORS.primaryGold,
    fontSize: 13,
    fontWeight: '500',
  },

  upNextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.08)',
  },

  upNextThumb: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    marginRight: 12,
  },

  upNextInfo: {
    flex: 1,
  },

  upNextTrackTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  upNextTrackSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },

  upNextTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
});
