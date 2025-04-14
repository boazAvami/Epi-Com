import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Modal, View, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Text, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Location } from '../../types';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { EpipenForm, EpipenFormData } from './EpipenForm';
import { RTLText } from '../shared/RTLComponents';
import styles from './styles';
import { colors } from '../../constants/Colors';

interface AddEpipenModalProps {
  visible: boolean;
  selectingLocation: boolean;
  onCancel: () => void;
  onSave: (data: EpipenFormData) => void;
  userLocation: Location | null;
  customLocation?: Location | null;
  onSelectCustomLocation?: (formData?: Partial<EpipenFormData>) => void;
  savedFormData?: Partial<EpipenFormData>;
}

export const AddEpipenModal: React.FC<AddEpipenModalProps> = ({
  visible,
  selectingLocation,
  onCancel,
  onSave,
  userLocation,
  customLocation,
  onSelectCustomLocation,
  savedFormData = {}
}) => {
  const { t } = useAppTranslation();
  const [formData, setFormData] = useState<Partial<EpipenFormData>>({});
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '35%'], []); 

  // Initialize form data with saved data when modal becomes visible or savedFormData changes
  useEffect(() => {
    if (visible && Object.keys(savedFormData).length > 0) {
      console.log('Restoring saved form data:', savedFormData);
      setFormData(prevData => ({
        ...prevData,
        ...savedFormData
      }));
    }
  }, [visible, savedFormData]);

  const handleOpenPhotoOptions = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClosePhotoOptions = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useEffect(() => {
    if (formData.photo) {
      console.log("Photo set in formData state:", formData.photo);
    }
  }, [formData.photo]);
  
  useEffect(() => {
    if (customLocation) {
      console.log('AddEpipenModal received custom location:', customLocation);
      setFormData(prevData => ({
        ...prevData,
        coordinate: customLocation
      }));
    }
  }, [customLocation]);
  
  const pickImage = useCallback(async (sourceType: 'camera' | 'gallery') => {
    handleClosePhotoOptions(); 
    console.log(`Starting image picker for: ${sourceType}`);
    
    try {
      let permissionResult;
      if (sourceType === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('errors.permission_denied'), t('errors.camera_permission_required'));
          return;
        }
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.status !== 'granted') {
          Alert.alert(t('errors.permission_denied'), t('errors.media_permission_required'));
          return;
        }
      }
      
      console.log('Permission granted, launching picker');
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      };
      
      let result;
      try {
        if (sourceType === 'camera') {
          console.log('Launching camera...');
          result = await ImagePicker.launchCameraAsync(options);
        } else {
          console.log('Launching image library...');
          result = await ImagePicker.launchImageLibraryAsync(options);
        }
        
        console.log('Picker result status:', result.canceled ? 'canceled' : 'success');
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const imageUri = result.assets[0].uri;
          console.log("Image selected:", imageUri);
          setFormData(prevData => ({
            ...prevData,
            photo: imageUri
          }));
        } else {
          console.log("Image selection was canceled by user");
        }
      } catch (pickerError) {
        console.error('Error during image picking:', pickerError);
        Alert.alert(t('errors.error'), t('errors.image_picker_error'));
      }
    } catch (error) {
      console.error('Error in pickImage function (permissions?):', error);
      Alert.alert(t('errors.error'), t('errors.image_picker_error'));
    }
  }, [t, handleClosePhotoOptions]);
  
  const handleSave = useCallback((data: EpipenFormData) => {
    onSave(data);
    setFormData({});
  }, [onSave]);
  
  const handleCancel = useCallback(() => {
    onCancel();
    setFormData({});
    handleClosePhotoOptions(); // Close bottom sheet on modal cancel too
  }, [onCancel, handleClosePhotoOptions]);

  // Handler for selecting custom location
  const handleSelectCustomLocation = useCallback(() => {
    if (onSelectCustomLocation) {
      onSelectCustomLocation(formData);
    }
  }, [onSelectCustomLocation, formData]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible && !selectingLocation}
      onRequestClose={handleCancel} 
    >
      <View style={{flex: 1}} pointerEvents="box-none"> 

        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{flex: 1}} 
          pointerEvents="box-none"
        >

          <View 
            style={styles.modalOverlay} 

            pointerEvents="box-none" 
          >

            <View style={styles.modalContent}>
              <EpipenForm
                onSave={handleSave}
                onCancel={handleCancel}
                onPhotoPickerOpen={handleOpenPhotoOptions}
                onSelectCustomLocation={handleSelectCustomLocation}
                userLocation={userLocation}
                initialData={formData}
              />
            </View>
          </View>
        </KeyboardAvoidingView>


        {visible && !selectingLocation && (
          <BottomSheet
            ref={bottomSheetRef}
            index={-1} 
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backgroundStyle={styles.bottomSheetBackground} 
            handleIndicatorStyle={styles.bottomSheetHandleIndicator}
          >
            <BottomSheetView style={styles.bottomSheetContentContainer}> 
              <RTLText style={styles.photoModalTitle}> 
                {t('add.photo')}
              </RTLText>
 
              <TouchableOpacity 
                style={styles.photoOption} 
                onPress={() => pickImage('camera')}
              >
                <Ionicons name="camera" size={24} color={colors.textDark} />
                <RTLText style={styles.photoOptionText}>
                  {t('photo.take')}
                </RTLText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.photoOption} 
                onPress={() => pickImage('gallery')}
              >
                <Ionicons name="images" size={24} color={colors.textDark} />
                <RTLText style={styles.photoOptionText}>
                  {t('photo.choose')}
                </RTLText>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.photoOption, styles.cancelPhotoOption]} 
                onPress={handleClosePhotoOptions} 
              >
                <RTLText style={styles.cancelPhotoText}>
                  {t('buttons.cancel')}
                </RTLText>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        )}
      </View> 
    </Modal>
  );
};