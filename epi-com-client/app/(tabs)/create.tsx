import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pressable, View, Text, TextInput, Image, Alert, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useEpipens } from '@/hooks/useEpipens';
import { Contact, Coordinate, EpipenMarker } from '@/types';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { RTLText } from '@/components/shared/RTLComponents';
import styles from './styles';

// Interface for search results from Nominatim
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  name?: string;
}

export type EpipenFormData = Omit<EpipenMarker, 'id'>;

  const defaultContact: Contact = {
    name: '',
    phone: '',
  };

const AddEpiPen = () => {
  
  const { addMarker} = useEpipens(null);
  const [formData, setFormData] = useState<Partial<EpipenFormData>>({
    type: 'adult',
    expireDate: '',
    contact: defaultContact,
    photo: null,
    description: '',
  });

  const [locationQuery, setLocationQuery] = useState<String>();
  const [locationResults, setLocationResults] = useState<SearchResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Coordinate>();
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [kind, setKind] = useState(null); // 'JUNOIR' or 'ADULT'
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [missingFields, setMissingFields] = useState<String[]>([]);

  const searchTimerRef = useRef(null);

  const handleSearchChange = (text: String) => {
    setLocationQuery(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const searchPlaces = useCallback(async (query: String) => {
    if (!query || query.trim().length < 3) {
      setLocationResults([]);
      return;
    }

    try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&addressdetails=1&limit=7&accept-language=he`,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'EpipenApp',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLocationResults(data);
      } else {
        console.error('Error searching places:', response.statusText);
        setLocationResults([]);
      }
    } catch (error) {
      console.error('Error searching places:', error);
      setLocationResults([]);
    }
  }, []);

  const handleLocationSelect = (item: SearchResult) => {
    setSelectedLocation({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });
    setLocationQuery(item.display_name);
    setLocationResults([]);
  };

    const pickImage = async (sourceType: 'camera' | 'gallery') => {
      console.log(`Starting image picker for: ${sourceType}`);
      
      try {
        let permissionResult;
        if (sourceType === 'camera') {
          permissionResult = await ImagePicker.requestCameraPermissionsAsync();
          if (permissionResult.status !== 'granted') {
           // Alert.alert(t('errors.permission_denied'), t('errors.camera_permission_required'));
            return;
          }
        } else {
          permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (permissionResult.status !== 'granted') {
            //Alert.alert(t('errors.permission_denied'), t('errors.media_permission_required'));
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
            // setFormData(prevData => ({
            //   ...prevData,
            //   photo: imageUri
            // }));
            console.log("uri:" + imageUri)
            setImage(imageUri)
            setImageUrl(imageUri)
          } else {
            console.log("Image selection was canceled by user");
          }
        } catch (pickerError) {
          console.error('Error during image picking:', pickerError);
         // Alert.alert(t('errors.error'), t('errors.image_picker_error'));
        }
      } catch (error) {
        console.error('Error in pickImage function (permissions?):', error);
        //Alert.alert(t('errors.error'), t('errors.image_picker_error'));
      }
    };

  const isValidPhoneNumber = (phone) => {
    const regex = /^\+?[0-9]{7,15}$/;
    return regex.test(phone);
  };

  const handleSubmit = async () => {
    const missing = [];
    const now = new Date();
    if (!selectedLocation) missing.push('location');
    if (!expiryDate || expiryDate <= now) missing.push('expiryDate');
    if (!contactName) missing.push('contactName');
    if (!contactPhone || !isValidPhoneNumber(contactPhone)) missing.push('contactPhone');
    if (!serialNumber) missing.push('serialNumber');
    if (!kind) missing.push('kind');


    if (missing.length) {
      setMissingFields(missing);
      setErrorMessage('Please fill all required fields correctly.');
      return;
    }

    setMissingFields([]);
    setErrorMessage('');

    const requestVar: EpipenFormData = {
      coordinate: {latitude: selectedLocation?.latitude, longitude: selectedLocation?.longitude},
      description: description,
      type: kind?.toLowerCase(),
      expireDate:  expiryDate.toISOString().split('T')[0],
      contact: { name: contactName, phone: contactPhone },
      photo: imageUrl,
      serialNumber: serialNumber
    }

    await addMarker(requestVar)
  };

  return (
<SafeAreaView className="flex-1 bg-white">
  {/* Header */}
  <View className="py-6 px-4 border-b border-gray-200">
    <Text className="text-xl text-black text-center font-bold" style={{ color: '#FF385C' }}>
      Add Your Epipen
    </Text>
  </View>

  {/* Content */}
  <ScrollView contentContainerStyle={{ padding: 16 }}>
    {/* Location Input */}
    
      <TextInput
        value={locationQuery}
        onChangeText={handleSearchChange}
        placeholder="Search for a location"
        placeholderTextColor="#999"
        className={`w-full border rounded-xl px-4 py-3 text-black bg-white mb-5 ${
          missingFields.includes('location') ? 'border-red-500' : 'border-gray-300'
        }`}
      />

      {locationResults.length > 0 && (
        <View className="border border-gray-300 rounded-xl mb-5 max-h-40">
          <FlatList
            data={locationResults}
            keyExtractor={(item) => item.place_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleLocationSelect(item)}
                className="p-3 border-b border-gray-200"
              >
                <Text className="text-sm text-gray-800">{item.display_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

    {/* Expiry Date */}
    <Pressable
      onPress={() => setShowDatePicker(true)}
      className={`w-full border rounded-xl px-4 py-3 mb-4 ${
        missingFields.includes('expiryDate') ? 'border-red-500' : 'border-gray-300'
      }`}
    >
      <Text className={`text-black ${!expiryDate ? 'text-gray-400' : ''}`}>
        {expiryDate ? expiryDate.toDateString() : 'Expiration date'}
      </Text>
    </Pressable>

    <DateTimePicker
      isVisible={showDatePicker}
      mode="date"
      onConfirm={(date) => {
        setShowDatePicker(false);
        setExpiryDate(date);
      }}
      onCancel={() => setShowDatePicker(false)}
      minimumDate={new Date()}
    />

    {/* Contact Name */}
    <TextInput
      value={contactName}
      onChangeText={setContactName}
      placeholder="Contact name"
      placeholderTextColor="#999"
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
        missingFields.includes('contactName') ? 'border-red-500' : ''
      }`}
    />

    {/* Contact Phone */}
    <TextInput
      value={contactPhone}
      onChangeText={setContactPhone}
      placeholder="Contact phone"
      placeholderTextColor="#999"
      keyboardType="phone-pad"
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
        missingFields.includes('contactPhone') ? 'border-red-500' : ''
      }`}
    />

    {/* Serial Number */}
    <TextInput
      value={serialNumber}
      onChangeText={setSerialNumber}
      placeholder="Serial number"
      placeholderTextColor="#999"
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
        missingFields.includes('serialNumber') ? 'border-red-500' : ''
      }`}
    />

    {/* Kind Selection */}
    <View className="flex-row justify-between mb-4">
      {['Junior', 'Adult'].map((option) => (
        <Pressable
          key={option}
          onPress={() => setKind(option.toUpperCase())}
          className={`flex-1 mx-1 items-center py-3 rounded-xl border ${
            missingFields.includes('kind')
              ? 'border-red-500'
              : kind === option.toUpperCase()
              ? 'border-[#FF385C]'
              : 'border-gray-300'
          }`}
        >
          <Text className="text-black">{option}</Text>
        </Pressable>
      ))}
    </View>

    {/* Description */}
    <TextInput
      value={description}
      onChangeText={setDescription}
      placeholder="Description"
      placeholderTextColor="#999"
      multiline
      className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4`}
    />

    {/* Photo */}
    <TouchableOpacity 
          style={[styles.photoButton, formData.photo ? styles.photoButtonWithImage : null]}
          activeOpacity={0.8}
          onPress={() => {
            Alert.alert('Select Image', 'Choose an option to upload an image.', [
              { text: 'Gallery', onPress: () => pickImage('gallery') },
              { text: 'Camera', onPress: () => pickImage('camera') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
          {image ? (
            <View style={styles.photoContainer}>
              <Image 
                source={{ uri: image }} 
                style={styles.photoPreview}
                resizeMode="cover"
                onLoadStart={() => console.log("Image loading started")}
                onLoad={() => console.log("Image loaded successfully")}
                onError={(error) => {
                  console.error("Image loading error:", error.nativeEvent.error);
                }} 
              />
              <TouchableOpacity 
                style={styles.removePhotoButton}
                onPress={(e) => {
                  e.stopPropagation();
                  console.log("Remove photo button pressed");
                  setImage(null);
                  setImageUrl(null);
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
                add photo - optional
              </RTLText>
            </View>
          )}
        </TouchableOpacity>

    {/* Error */}
    {errorMessage ? <Text className="text-red-500 text-center mb-4">{errorMessage}</Text> : null}

    {/* Submit */}
    <Button
      onPress={handleSubmit}
      className="px-6 py-3 bg-[#FF385C] rounded-xl shadow w-full"
    >
      <ButtonText className="text-white font-bold text-center text-base">Submit</ButtonText>
    </Button>
  </ScrollView>
</SafeAreaView>
  );
};

export default AddEpiPen;
