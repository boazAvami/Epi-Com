import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  mapContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 0,
    marginTop: -5,
    paddingTop: 15,
    marginBottom: -25,
    paddingBottom: 35,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchBarFocused: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchIconRtl: {
    marginLeft: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textDark,
    padding: 0,
  },
  clearButton: {
    padding: 5,
  },
  searchText: {
    color: colors.textMedium,
    fontSize: 15,
  },
  searchResults: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: 5,
    maxHeight: 300,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 2,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  resultIcon: {
    marginRight: 10,
  },
  resultIconRtl: {
    marginLeft: 10,
  },
  resultText: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: colors.textMedium,
    textAlign: 'center',
  },
  searchingContainer: {
    padding: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchingText: {
    fontSize: 14,
    color: colors.textMedium,
    marginLeft: 10,
  },
  mapButtonsContainer: {
    position: 'absolute',
    right: 20,
    top: 80,
    alignItems: 'center',
  },
  mapButton: {
    marginBottom: 15,
    backgroundColor: colors.white,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeMapButton: {
    backgroundColor: colors.primary,
  },
  textRtl: {
    textAlign: 'right',
  },
  selectLocationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.mapOverlay,
    padding: 15,
  },
  selectLocationText: {
    color: colors.white,
    fontSize: 16,
    textAlign: 'center',
  },
  epipenMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  epipenMarkerText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tempPinMarker: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  }
});