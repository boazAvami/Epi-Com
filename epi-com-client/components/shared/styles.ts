import { StyleSheet, StatusBar } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 10,
    backgroundColor: colors.primary,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
  headerButtons: {
    position: 'absolute',
    right: 15,
    top: StatusBar.currentHeight || 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.backgroundMedium,
    borderRadius: 4,
    marginRight: 8,
  },
  languageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.backgroundMedium,
    borderRadius: 4,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textDark,
  },
  
  // Common layout styles
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  rtlContainer: {
    alignItems: 'flex-end',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  textRtl: {
    textAlign: 'right',
  }
});