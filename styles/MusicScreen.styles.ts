import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export { COLORS };

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.deepBrown,
  },

  scroll: {
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 56,
    paddingHorizontal: 22,
    paddingBottom: 16,
  },

  overline: {
    color: COLORS.textSecondary,
    fontSize: 11,
    letterSpacing: 2.5,
    fontWeight: '600',
    marginBottom: 4,
  },

  title: {
    color: COLORS.textPrimary,
    fontSize: 28,
    fontWeight: '700',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },

  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.05)',
  },

  // CHIPS
  chipsRow: {
    paddingHorizontal: 18,
    marginTop: 8,
  },

  chipsRowContent: {
    paddingRight: 18,
    gap: 10,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  chipActive: {
    backgroundColor: COLORS.primaryGold,
  },

  chipText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },

  chipTextActive: {
    color: COLORS.deepBrown,
    fontWeight: '700',
  },

  moodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    gap: 8,
  },

  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  moodText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },

  // FEATURED CARDS
  featuredRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 18,
    gap: 12,
  },

  featuredCard: {
    flex: 1,
    height: 220,
    borderRadius: 18,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    overflow: 'hidden',
  },

  featuredTop: {
    flex: 1,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  featuredImageLabel: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },

  featuredPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featuredBottom: {
    padding: 14,
    paddingTop: 10,
  },

  featuredTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },

  featuredTagStar: {
    color: COLORS.primaryGold,
    fontSize: 12,
  },

  featuredTag: {
    color: COLORS.primaryGold,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  featuredTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  featuredMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  seeAll: {
    color: COLORS.primaryGold,
    fontSize: 13,
    fontWeight: '500',
  },

  // TRACK ROW
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 10,
  },

  trackThumb: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.15)',
    marginRight: 14,
  },

  trackInfo: {
    flex: 1,
    paddingRight: 8,
  },

  trackTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },

  trackTitleActive: {
    color: COLORS.primaryGold,
  },

  trackSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  trackTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginRight: 10,
  },

  trackMore: {
    padding: 4,
  },

  playingBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginRight: 14,
    height: 14,
  },

  playingBar: {
    width: 3,
    backgroundColor: COLORS.primaryGold,
    borderRadius: 1,
  },

  // RECENTLY PLAYED
  recentRow: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    gap: 10,
  },

  recentCard: {
    flex: 1,
  },

  recentThumb: {
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
    marginBottom: 8,
  },

  recentTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },

  recentMeta: {
    color: COLORS.textSecondary,
    fontSize: 11,
  },

  // MINI PLAYER (positioned above the tab bar)
  bottomDock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 80,
  },

  miniPlayer: {
    backgroundColor: COLORS.cardBrownLight,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.18)',
  },

  miniPlayerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },

  miniTapTarget: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  miniThumb: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
  },

  miniInfo: {
    flex: 1,
  },

  miniTitle: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  miniSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  miniIconBtn: {
    padding: 6,
  },

  miniPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  miniProgressBar: {
    height: 2,
    backgroundColor: 'rgba(212,175,55,0.15)',
  },

  miniProgressFill: {
    width: '38%',
    height: '100%',
    backgroundColor: COLORS.primaryGold,
  },

  // BOTTOM NAV
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 6,
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  navIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navIconWrapActive: {
    backgroundColor: 'rgba(212,175,55,0.18)',
  },

  navLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
