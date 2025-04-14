import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EpipenMarker, Location, Contact } from '../../types';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { RTLText, RTLRow } from '../shared/RTLComponents';
import styles from './styles';
import { colors } from '../../constants/Colors';


export type EpipenFormData = Omit<EpipenMarker, 'id'>;

interface EpipenFormProps {
  onSave: (data: EpipenFormData) => void;
  onCancel: () => void;
  onPhotoPickerOpen: () => void;
  onSelectCustomLocation: () => void;
  userLocation: Location | null;
  initialData?: Partial<EpipenFormData>;
}

export const EpipenForm: React.FC<EpipenFormProps> = ({
  onSave,
  onCancel,
  onPhotoPickerOpen,
  onSelectCustomLocation,
  userLocation,
  initialData = {}
}) => {
  const { t, isRtl } = useAppTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const defaultContact: Contact = {
    name: '',
    phone: '',
  };
  
  const [formData, setFormData] = useState<Partial<EpipenFormData>>({
    type: 'adult',
    expireDate: initialData.expireDate || '',
    contact: defaultContact,
    photo: null,
    description: '',
    ...initialData
  });
  
  // Update form data when initialData changes
  useEffect(() => {
    console.log("Initial data changed in EpipenForm:", initialData);
    if (Object.keys(initialData).length > 0) {
      setFormData(currentFormData => ({
        ...currentFormData,
        ...initialData,
        // Preserve existing form data if not in initialData
        contact: {
          ...defaultContact,
          ...(currentFormData.contact || {}),
          ...(initialData.contact || {})
        }
      }));
    }
  }, [initialData]);

  useEffect(() => {
    if (initialData.photo) {
      console.log("Photo prop received/changed in EpipenForm:", initialData.photo);

      setFormData(currentFormData => ({
        ...currentFormData,
        photo: initialData.photo
      }));
    }
  }, [initialData.photo]);
  
  // Format date to MM/YYYY
  const formatDateToMonthYear = (dateString: string): string => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return '';
      
      // Format as MM/YYYY
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${month}/${year}`;
    } catch (e) {
      return '';
    }
  };
  
  // Parse MM/YYYY to date
  const parseMonthYearToDate = (monthYearStr: string): Date | null => {
    try {
      const [month, year] = monthYearStr.split('/').map(Number);
      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        return null;
      }
      
      const date = new Date(year, month - 1, 1);
      return date;
    } catch (e) {
      return null;
    }
  };
  
  // Helper to get or create expiration date
  const getExpireDate = (): Date => {
    if (formData.expireDate) {
      try {
        // Check if the date is in MM/YYYY format
        if (/^\d{2}\/\d{4}$/.test(formData.expireDate)) {
          const [month, year] = formData.expireDate.split('/').map(Number);
          return new Date(year, month - 1, 1); // Set day to 1
        }
        
        // Otherwise try to parse as a regular date
        const date = new Date(formData.expireDate);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (e) {
        console.log(e)
      }
    }
    
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };
  
  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Check location
    if (!formData.coordinate && !userLocation) {
      newErrors.location = t('validation.location_required');
    }
    
    // Check expiration date
    if (!formData.expireDate) {
      newErrors.expiryDate = t('validation.expiration_required');
    }
    
    // Check contact information
    if (!formData.contact?.name) {
      newErrors.contactName = t('validation.contact_name_required');
    }
    
    if (!formData.contact?.phone) {
      newErrors.contactPhone = t('validation.contact_phone_required');
    }
    
    // Update errors state
    setErrors(newErrors);
    
    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };
  
  const showValidationErrors = () => {
    const errorMessages = Object.values(errors).join('\n• ');
    Alert.alert(
      t('validation.error_title'),
      `${t('validation.error_message')}\n\n• ${errorMessages}`,
      [{ text: t('validation.ok'), style: 'default' }]
    );
  };
  
  const handleSave = () => {
    // Use the custom location if it exists, otherwise use current location
    const coordinate = formData.coordinate || 
      (userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : undefined);
    
    if (coordinate) {
      // Create a new object instead of modifying the existing one
      const updatedFormData = {
        ...formData,
        coordinate
      };
      
      if (validateForm()) {
        const epipenData: EpipenFormData = {
          type: updatedFormData.type || 'adult',
          expireDate: updatedFormData.expireDate!,
          coordinate: updatedFormData.coordinate,
          contact: updatedFormData.contact!,
          photo: updatedFormData.photo,
          description: updatedFormData.description || `${updatedFormData.type} Injector`
        };
        
        // Log the coordinate that will be sent
        console.log('Saving EpiPen with coordinate:', epipenData.coordinate);
        
        onSave(epipenData);
      } else {
        showValidationErrors();
      }
    } else {
      // No location available
      setErrors({
        ...errors,
        location: t('validation.location_required')
      });
      showValidationErrors();
    }
  };
  
  const updateContact = (field: keyof Contact, value: string) => {
    if (errors[`contact${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors({
        ...errors,
        [`contact${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      });
    }
    
    setFormData({
      ...formData,
      contact: {
        ...(formData.contact || defaultContact),
        [field]: value
      }
    });
  };
  
  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      photo: null
    });
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format as MM/YYYY - only care about month and year
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      setFormData({
        ...formData,
        expireDate: `${month}/${year}`
      });
      
      // Clear any expiration date error
      if (errors.expiryDate) {
        setErrors({
          ...errors,
          expiryDate: ''
        });
      }
    }
  };

  const getTypeTextStyle = (isSelected: boolean) => {
    return isSelected ? styles.selectedTypeText : styles.typeText;
  };

  const getLocationOptionTextStyle = (isSelected: boolean) => {
    return isSelected ? styles.selectedLocationText : styles.locationOptionText;
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView 
        style={styles.formScrollView}
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <RTLText style={styles.modalTitle}>
          {t('add.title')}
        </RTLText>
        
        {/* Type Selector */}
        <RTLRow style={styles.typeSelector}>
          <TouchableOpacity 
            style={[
              styles.typeOption,
              formData.type === 'adult' && styles.selectedType
            ]}
            onPress={() => setFormData({...formData, type: 'adult'})}
          >
            <RTLText style={getTypeTextStyle(formData.type === 'adult')}>
              {t('epipen.types.adult')}
            </RTLText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.typeOption,
              formData.type === 'junior' && styles.selectedType
            ]}
            onPress={() => setFormData({...formData, type: 'junior'})}
          >
            <RTLText style={getTypeTextStyle(formData.type === 'junior')}>
              {t('epipen.types.junior')}
            </RTLText>
          </TouchableOpacity>
        </RTLRow>
        
        {/* Expiration Date Input */}
        <View style={[
          styles.dateInputContainer,
          isRtl && styles.dateInputContainerRtl
        ]}>
          <TextInput
            style={[
              styles.input,
              styles.dateInput,
              isRtl && styles.inputRtl,
              isRtl && styles.dateInputRtl,
              errors.expiryDate ? styles.inputError : null
            ]}
            placeholder={`${t('add.expire_date')} (MM/YYYY) *`}
            placeholderTextColor={errors.expiryDate ? colors.error : "#999"}
            value={formData.expireDate || t('add.expire_date')}
            editable={false} 
            pointerEvents="none"
            textAlign={isRtl ? 'right' : 'left'}
          />
          <TouchableOpacity 
            style={[
              styles.calendarButton,
              isRtl && styles.calendarButtonRtl
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={22} color="white" />
          </TouchableOpacity>
        </View>
        
        {showDatePicker && (
          <DateTimePicker
            value={getExpireDate()}
            mode={Platform.OS === 'ios' ? 'date' : 'date'}
            display={Platform.OS === 'ios' ? 'spinner' : 'spinner'}
            onChange={handleDateChange}
            maximumDate={new Date(new Date().getFullYear() + 10, 11, 31)} // Limit date selection to 10 years in the future
          />
        )}

        <RTLText style={styles.sectionTitle}>{t('add.contact_info')}</RTLText>
        
        {/* Contact Name */}
        <TextInput
          style={[
            styles.input,
            isRtl && styles.inputRtl,
            errors.contactName ? styles.inputError : null
          ]}
          placeholder={`${t('add.contact_name')} *`}
          placeholderTextColor={errors.contactName ? colors.error : "#999"}
          value={formData.contact?.name}
          onChangeText={(text) => updateContact('name', text)}
          textAlign={isRtl ? 'right' : 'left'}
        />
        
        {/* Contact Phone */}
        <TextInput
          style={[
            styles.input,
            isRtl && styles.inputRtl,
            errors.contactPhone ? styles.inputError : null
          ]}
          placeholder={`${t('add.phone')} *`}
          placeholderTextColor={errors.contactPhone ? colors.error : "#999"}
          value={formData.contact?.phone}
          onChangeText={(text) => updateContact('phone', text)}
          keyboardType="phone-pad"
          textAlign={isRtl ? 'right' : 'left'}
        />
        
        {/* Photo */}
        <TouchableOpacity 
          style={[styles.photoButton, formData.photo ? styles.photoButtonWithImage : null]}
          activeOpacity={0.7}
          onPress={() => {
            console.log("Photo button pressed, opening picker");
            onPhotoPickerOpen();
          }}
        >
          {formData.photo ? (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: formData.photo }} 
                style={styles.photoPreview}
                resizeMode="cover"
                onLoadStart={() => console.log("Image loading started")}
                onLoad={() => console.log("Image loaded successfully")}
                onError={(error) => {
                  console.error("Image loading error:", error.nativeEvent.error);
                  Alert.alert(
                    t('errors.error'),
                    t('errors.image_load_error')
                  );
                }} 
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={(e) => {
                  e.stopPropagation();
                  console.log("Remove photo button pressed");
                  handleRemovePhoto();
                }}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close-circle" size={24} color="#FF385C" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addPhotoPlaceholder}>
              <Ionicons name="camera-outline" size={30} color="#999" />
              <RTLText style={styles.addPhotoText}>
                {t('add.photo')}
              </RTLText>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Location Type Selector */}
        <RTLText style={styles.sectionTitle}>
          {t('add.location')} *
          {errors.location && <RTLText style={styles.errorText}> ({t('validation.required')})</RTLText>}
        </RTLText>
        
        <RTLRow style={styles.locationSelector}>
          <TouchableOpacity 
            style={[
              styles.locationOption,
              !formData.coordinate && styles.selectedLocation
            ]}
            onPress={() => {
              setFormData({...formData, coordinate: undefined});
              if (errors.location) {
                setErrors({
                  ...errors,
                  location: ''
                });
              }
            }}
          >
            <RTLText style={getLocationOptionTextStyle(!formData.coordinate)}>
              {t('add.use_current')}
            </RTLText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.locationOption,
              formData.coordinate && styles.selectedLocation
            ]}
            onPress={() => {
              onSelectCustomLocation();
              if (errors.location) {
                setErrors({
                  ...errors,
                  location: ''
                });
              }
            }}
          >
            <RTLText style={getLocationOptionTextStyle(!!formData.coordinate)}>
              {t('add.select_custom')}
            </RTLText>
          </TouchableOpacity>
        </RTLRow>
        
        {/* Description (Optional) */}
        <TextInput
          style={[
            styles.input,
            styles.notesInput,
            isRtl && styles.inputRtl
          ]}
          placeholder={`${t('add.description')} (${t('validation.optional')})`}
          placeholderTextColor="#999"
          value={formData.description}
          onChangeText={(text) => setFormData({...formData, description: text})}
          multiline={true}
          textAlign={isRtl ? 'right' : 'left'}
        />
        
        {/* Required Fields Note */}
        <RTLText style={styles.requiredNote}>
          * {t('validation.required_fields')}
        </RTLText>
      </ScrollView>
      
      <View style={styles.stickyFooter}>
        <RTLRow style={styles.modalButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <RTLText style={styles.cancelButtonText}>
              {t('buttons.cancel')}
            </RTLText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <RTLText style={styles.saveButtonText}>
              {t('buttons.save')}
            </RTLText>
          </TouchableOpacity>
        </RTLRow>
      </View>
    </View>
  );
};