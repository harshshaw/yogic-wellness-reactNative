import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const SPACING = { screen: 20, section: 24, card: 16 };
export const RADII = { card: 22, control: 14, pill: 999 };

export const warm = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.deepBrown,
  },

  scroll: {
    paddingHorizontal: SPACING.screen,
    paddingTop: 56,
    paddingBottom: 130,
  },

  // HEADER
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.cardBrown,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // TYPOGRAPHY
  overline: {
    color: COLORS.primaryGold,
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  h1: {
    color: COLORS.textPrimary,
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
  },

  h2: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },

  h3: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },

  body: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },

  bodySm: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  meta: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // CARDS
  card: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.1)',
    padding: SPACING.card,
  },

  goldCard: {
    backgroundColor: COLORS.cardBrown,
    borderRadius: RADII.card,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.35)',
    padding: 18,
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 6,
  },

  // BUTTONS
  pillPrimary: {
    backgroundColor: COLORS.primaryGold,
    borderRadius: RADII.pill,
    paddingVertical: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: COLORS.primaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },

  pillPrimaryText: {
    color: COLORS.deepBrown,
    fontSize: 15,
    fontWeight: '700',
  },

  pillSecondary: {
    backgroundColor: 'transparent',
    borderRadius: RADII.pill,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.5)',
  },

  pillSecondaryText: {
    color: COLORS.primaryGold,
    fontSize: 15,
    fontWeight: '600',
  },

  // SECTION HEADER
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: SPACING.section,
    marginBottom: 12,
  },

  seeAll: {
    color: COLORS.primaryGold,
    fontSize: 13,
    fontWeight: '500',
  },
});
