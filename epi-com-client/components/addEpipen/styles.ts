import { StyleSheet } from 'react-native';
import { colors } from '../../constants/Colors';

export default StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '95%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 0,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: colors.textDark,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: colors.textDark,
  },
  inputRtl: {
    textAlign: 'right',
  },
  dateInputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    height: 50,
  },
  dateInputContainerRtl: {
    flexDirection: 'row-reverse',
  },
  dateInput: {
    flex: 1,
    paddingRight: 45,
    backgroundColor: colors.backgroundLight,
  },
  dateInputRtl: {
    paddingRight: 15,
    paddingLeft: 45,
  },
  calendarButton: {
    position: 'absolute',
    right: 8,
    top: 6,
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 19,
  },
  calendarButtonRtl: {
    right: 'auto',
    left: 8,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    padding: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  typeOption: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedType: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    fontSize: 16,
    color: colors.textDark,
  },
  selectedTypeText: {
    color: colors.white,
    fontWeight: '500',
  },
  locationSelector: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  locationOption: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  selectedLocation: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  locationOptionText: {
    fontSize: 14,
    color: colors.textDark,
  },
  selectedLocationText: {
    color: colors.white,
    fontWeight: '500',
  },
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 8,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.textDark,
  },
  saveButtonText: {
    fontSize: 16,
    color: colors.white,
    fontWeight: '500',
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
  
  // RTL support
  rtlContainer: {
    alignItems: 'flex-end',
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  textRtl: {
    textAlign: 'right',
  },
  
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 10,
    marginHorizontal: 15,
    color: '#333',
  },
  
  // Validation styles
  inputError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  photoButtonError: {
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
  },
  locationOptionError: {
    borderColor: colors.error,
    borderWidth: 1,
  },
  errorText: {
    color: colors.error,
  },
  requiredNote: {
    fontSize: 12,
    color: colors.textMedium,
    fontStyle: 'italic',
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  formScrollView: {
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  formContainer: {
    paddingBottom: 80, 
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderRadius: 20,
  },
  bottomSheetHandleIndicator: {
    backgroundColor: colors.borderLight,
    width: 40,
  },
  bottomSheetContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
});