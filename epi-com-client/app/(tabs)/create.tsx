import React, { useState, useRef, useCallback } from 'react';
import { Pressable, View, Text, TextInput, Image, Alert, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { useEpipens } from '@/hooks/useEpipens';
import { Contact, EpipenMarker } from '@/types';
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
  const { addMarker } = useEpipens(null);
  const [formData, setFormData] = useState<Partial<EpipenFormData>>({
    type: 'adult',
    expireDate: '',
    contact: defaultContact,
    photo: null,
    description: undefined,
    serialNumber: '',
    coordinate: undefined,
  });

  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<SearchResult[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [missingFields, setMissingFields] = useState<String[]>([]);

  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (text: string) => {
    setLocationQuery(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => searchPlaces(text), 300);
  };

  const searchPlaces = useCallback(async (query: string) => {
    if (!query || query.trim().length < 3) {
      setLocationResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=7&accept-language=he`,
        { headers: { Accept: 'application/json', 'User-Agent': 'EpipenApp' } }
      );
      const data = await response.json();
      setLocationResults(data);
    } catch (error) {
      console.error('Error searching places:', error);
      setLocationResults([]);
    }
  }, []);

  const handleLocationSelect = (item: SearchResult) => {
    setFormData(prev => ({
      ...prev,
      coordinate: { latitude: parseFloat(item.lat), longitude: parseFloat(item.lon) }
    }));
    setLocationQuery(item.display_name);
    setLocationResults([]);
  };

  const pickImage = async (sourceType: 'camera' | 'gallery') => {
    try {
      let permission;
      if (sourceType === 'camera') {
        permission = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (permission.status !== 'granted') return;

      const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      };

      const result = sourceType === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;
        setFormData(prev => ({ ...prev, photo: imageUri }));
      }
    } catch (e) {
      console.error('Image picker error:', e);
    }
  };

  const isValidPhoneNumber = (phone: string): boolean => /^\+?[0-9]{7,15}$/.test(phone);

  const handleSubmit = async () => {
    try {
      const missing = [];
  
      if (!formData.coordinate) missing.push('location');
      if (!formData.expireDate || new Date(formData.expireDate) <= new Date()) missing.push('expiryDate');
      if (!formData.contact?.name) missing.push('contactName');
      if (!formData.contact?.phone || !isValidPhoneNumber(formData.contact.phone)) missing.push('contactPhone');
      if (!formData.serialNumber) missing.push('serialNumber');
      if (!formData.type) missing.push('kind');
  
      if (missing.length) {
        setErrorMessage('Please fill all required fields correctly.');
        return;
      }
  
      setErrorMessage('');
      const data: EpipenFormData = {
        coordinate: formData.coordinate!,
        expireDate: new Date(formData.expireDate!).toISOString().split('T')[0],
        contact: {
          name: formData.contact!.name,
          phone: formData.contact!.phone,
        },
        description: formData.description,
        type: formData.type!,
        photo: formData.photo,
        serialNumber: formData.serialNumber!,
      }
  
      await addMarker(data);

      setSuccessMessage('הפעולה בוצעה בהצלחה!');
      setFormData({});
      setLocationQuery("");
      setTimeout(() => setSuccessMessage(null), 3000);
     
    } catch (error) {
      setErrorMessage('אירעה שגיאה בלתי צפויה. אנא נסה שוב.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="py-6 px-4 border-b border-gray-200">
        <Text className="text-xl text-black text-center font-bold" style={{ color: '#FF385C' }}>
          Add Your Epipen
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Location */}
        <TextInput
          value={locationQuery}
          onChangeText={handleSearchChange}
          placeholder="Search for a location"
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
                <TouchableOpacity onPress={() => handleLocationSelect(item)} className="p-3 border-b border-gray-200">
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
          <Text className={`text-black ${!formData.expireDate ? 'text-gray-400' : ''}`}>
            {formData.expireDate ? new Date(formData.expireDate).toDateString() : 'Expiration date'}
          </Text>
        </Pressable>
        <DateTimePicker
          isVisible={showDatePicker}
          mode="date"
          onConfirm={(date) => {
            setShowDatePicker(false);
            setFormData(prev => ({ ...prev, expireDate: date.toISOString() }));
          }}
          onCancel={() => setShowDatePicker(false)}
          minimumDate={new Date()}
        />

        {/* Contact name */}
        <TextInput
          value={formData.contact?.name || ''}
          onChangeText={(text) => setFormData(prev => ({ ...prev, contact: { ...prev.contact! , name: text } }))}
          placeholder="Contact name"
          className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
            missingFields.includes('contactName') ? 'border-red-500' : ''
          }`}
        />

        {/* Contact phone */}
        <TextInput
          value={formData.contact?.phone || ''}
          onChangeText={(text) => setFormData(prev => ({ ...prev, contact: { ...prev.contact!, phone: text } }))}
          placeholder="Contact phone"
          keyboardType="phone-pad"
          className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
            missingFields.includes('contactPhone') ? 'border-red-500' : ''
          }`}
        />

        {/* Serial number */}
        <TextInput
          value={formData.serialNumber || ''}
          onChangeText={(text) => setFormData(prev => ({ ...prev, serialNumber: text }))}
          placeholder="Serial number"
          className={`w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4 ${
            missingFields.includes('serialNumber') ? 'border-red-500' : ''
          }`}
        />

        {/* Type */}
        <View className="flex-row justify-between mb-4">
          {['Junior', 'Adult'].map((option) => (
            <Pressable
              key={option}
              onPress={() => setFormData(prev => ({ ...prev, type: option === "Adult" ? "adult" : "junior" }))}
              className={`flex-1 mx-1 items-center py-3 rounded-xl border ${
                missingFields.includes('kind')
                  ? 'border-red-500'
                  : formData.type === option.toLowerCase()
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
          value={formData.description || ''}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Description"
          multiline
          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-black bg-white mb-4"
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
          {formData.photo ? (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: formData.photo }}
                style={styles.photoPreview}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.removePhotoButton}
                onPress={(e) => {
                  e.stopPropagation();
                  setFormData(prev => ({ ...prev, photo: null }));
                }}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close-circle" size={24} color="#FF385C" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.addPhotoPlaceholder}>
              <Ionicons name="camera-outline" size={30} color="#999" />
              <RTLText style={styles.addPhotoText}>add photo - optional</RTLText>
            </View>
          )}
        </TouchableOpacity>

        {/* Error */}
        {errorMessage ? <Text className="text-red-500 text-center mb-4">{errorMessage}</Text> : null}

        {/* Success */}
        {successMessage ? <Text className="text-red-500 text-center mb-4">{successMessage}</Text> : null}

        {/* Submit */}
        <Button
          onPress={handleSubmit}
          className="px-6 py-2 bg-[#FF385C] rounded-xl shadow w-full"
        >
          <ButtonText className="text-white font-bold text-center text-base">Submit</ButtonText>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddEpiPen;
