import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  photoButton: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  photoButtonWithImage: {
    borderWidth: 0,
  },
  addPhotoPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    marginTop: 10,
    color: colors.textMedium,
  },
  photoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoContainer: {
    flex: 1,
    position: 'relative',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: colors.white,
    borderRadius: 15,
  },
  
  // Photo picker modal
  photoModalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 150,
  },
  photoModalContent: {
    width: '80%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 110,
  },
  photoModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textDark,
  },
  photoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundMedium,
  },
  photoOptionText: {
    fontSize: 16,
    color: colors.textDark,
    marginLeft: 15,
  },
  cancelPhotoOption: {
    justifyContent: 'center',
    borderBottomWidth: 0,
    marginTop: 10,
  },
  cancelPhotoText: {
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  
  photoButtonError: {
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
  },
});