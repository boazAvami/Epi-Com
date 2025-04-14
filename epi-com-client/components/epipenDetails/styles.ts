import { StyleSheet, Platform } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  detailsContainer: {
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
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailsHeaderRtl: {
    flexDirection: 'row-reverse',
  },
  detailsHeaderCombined: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  mainInfoLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  mainInfoLeftContainerRtl: {
    flexDirection: 'row-reverse',
    marginRight: 0,
    marginLeft: 10,
  },
  detailsIconSmall: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInfoTextContainer: {
    flex: 1,
  },
  detailsTypeTitleSmall: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 1,
  },
  detailsLocationSmall: {
    fontSize: 13,
    color: colors.textMedium,
    marginBottom: 1,
  },
  detailsDistanceSmall: {
    fontSize: 12,
    color: colors.textLight,
  },
  closeButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerActionButtons: {
    alignItems: 'center',
  },
  headerNavButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundMedium,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
  },
  detailsMainInfo: {
    marginBottom: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  detailsMainInfoRtl: {
    flexDirection: 'row-reverse',
  },
  detailsIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  detailsIconRtl: {
    marginRight: 0,
    marginLeft: 15,
  },
  detailsIconText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: 'bold',
  },
  detailsType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.textDark,
  },
  detailsTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 2,
  },
  detailsLocation: {
    fontSize: 14,
    color: colors.textMedium,
    marginBottom: 4,
  },
  detailsDistance: {
    fontSize: 13,
    color: colors.textLight,
  },
  detailsPhotoContainer: {
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  detailsPhoto: {
    width: '100%',
    height: '100%',
  },
  detailsScrollView: {
    maxHeight: 300,
  },
  detailsCard: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  detailsCardLabel: {
    fontSize: 14,
    color: colors.textMedium,
    fontWeight: '500',
    marginRight: 10,
    width: 120,
  },
  detailsCardLabelRtl: {
    marginRight: 0,
    marginLeft: 10,
  },
  detailsCardValue: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  phoneNumber: {
    color: colors.secondary,
    textDecorationLine: 'underline',
  },
  detailsNotes: {
    fontSize: 14,
    color: colors.textDark,
    marginTop: 8,
    lineHeight: 20,
  },
  directionsButton: {
    height: 50,
    backgroundColor: colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  directionsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // RTL support
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  textRtl: {
    textAlign: 'right',
  },

  // Info Cards
  detailsInfoCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: colors.backgroundGray,
    borderRadius: 8,
    marginBottom: 8,
  },
  detailsInfoCardRtl: {
    flexDirection: 'row-reverse',
  },
  detailsLabel: {
    fontSize: 14,
    color: colors.textMedium,
    fontWeight: '500',
    marginRight: 10,
    width: 120,
  },
  detailsLabelRtl: {
    marginRight: 0,
    marginLeft: 10,
  },
  detailsValue: {
    fontSize: 14,
    color: colors.textDark,
    flex: 1,
  },
  phoneLink: {
    color: colors.secondary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  // New navigation styles
  navigationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  navigationSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 10,
    marginTop: 10,
  },
  navigationButton: {
    height: 50,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  mapsButton: {
    backgroundColor: colors.primary,
    marginRight: 8, 
  },
  wazeButton: {
    backgroundColor: 'white',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#33CCFF',
  },
  navigationButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  wazeButtonText: {
    color: '#33CCFF', 
  },
  buttonIcon: {
    marginRight: 8,
  },
  wazeLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 6,
  },
  // Full screen photo modal styles
  photoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenPhoto: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  photoModalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});