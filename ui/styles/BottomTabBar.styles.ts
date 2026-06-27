import { StyleSheet } from 'react-native';
import { COLORS } from './colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: COLORS.cardBrown,
    paddingTop: 10,
    paddingBottom: 24,
    paddingHorizontal: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,175,55,0.15)',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },

  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: 'rgba(212,175,55,0.18)',
  },

  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
});
