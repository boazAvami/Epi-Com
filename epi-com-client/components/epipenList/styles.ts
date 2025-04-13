import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  controls: {
    backgroundColor: colors.white,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filterContainer: {
    marginBottom: 10,
    width: '100%'
  },
  filterContainerRtl: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-start',
  },
  filterPill: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: colors.backgroundMedium,
    borderRadius: 20,
    marginRight: 10,
  },
  filterPillRtl: {
    marginRight: 0,
    marginLeft: 10,
  },
  activePill: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: 14,
    color: colors.textDark,
  },
  activePillText: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
  nearbyBox: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  nearbyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 10,
  },
  epipenItem: {
    height: 54,
    alignItems: 'center',
    marginBottom: 10,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
  },
  epipenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  epipenIconRtl: {
    marginRight: 0,
    marginLeft: 10,
  },
  epipenIconText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  epipenName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
  },
  epipenDesc: {
    fontSize: 13,
    color: colors.textMedium,
  },
  epipenLocation: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  noEpipensText: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    paddingBottom: 10,
  },
  
  // RTL support
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  textRtl: {
    textAlign: 'right',
  },
});