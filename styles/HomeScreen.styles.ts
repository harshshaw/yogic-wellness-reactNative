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

  header: {
    height: 380,
    paddingTop: 50,
    paddingHorizontal: 22,
  },

  headerImage: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },

  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245,231,193,0.05)',
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greetingBlock: {
    marginTop: 18,
  },

  greeting: {
    fontSize: 30,
    color: COLORS.deepBrown,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  greetingSub: {
    fontSize: 15,
    color: COLORS.deepBrown,
    marginTop: 8,
    lineHeight: 22,
    opacity: 0.85,
  },

  progressCard: {
    backgroundColor: COLORS.cardBrown,
    marginHorizontal: 18,
    marginTop: -30,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  progressTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  ringsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ringContainer: {
    alignItems: 'center',
    flex: 1,
  },

  ringSvgWrap: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ringValue: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 15,
    marginTop: 2,
  },

  ringLabel: {
    marginTop: 8,
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },

  ringSub: {
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },

  goalCard: {
    marginHorizontal: 18,
    marginTop: 18,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    padding: 18,
    justifyContent: 'center',
  },

  goalImage: {
    borderRadius: 20,
  },

  goalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(28,20,15,0.55)',
  },

  goalTitle: {
    color: COLORS.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  goalSub: {
    color: COLORS.textPrimary,
    fontSize: 13,
    marginTop: 4,
    opacity: 0.9,
  },

  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },

  goalPercent: {
    color: COLORS.primaryGold,
    fontWeight: '700',
    fontSize: 14,
    marginRight: 10,
  },

  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    width: '75%',
    height: '100%',
    backgroundColor: COLORS.primaryGold,
    borderRadius: 10,
  },

  sectionTitle: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '600',
    marginTop: 22,
    marginBottom: 12,
    paddingHorizontal: 22,
  },

  focusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    marginHorizontal: 18,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.12)',
  },

  focusIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(212,175,55,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  focusContent: {
    flex: 1,
  },

  focusTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  focusDesc: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 3,
  },

  focusMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  focusPlay: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryGold,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    paddingTop: 12,
    paddingBottom: 24,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.15)',
  },

  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
});
