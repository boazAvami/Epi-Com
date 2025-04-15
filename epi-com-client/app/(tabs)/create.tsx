import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Pressable, View, Text, TextInput, Image, Alert, FlatList, SafeAreaView, TouchableOpacity} from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { API_URL } from '@/constants/Env';
import { useEpipens } from '@/hooks/useEpipens';
import { Contact, Coordinate, EpipenMarker } from '@/types';
import { ScrollView } from 'react-native-gesture-handler';

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

  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
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
  const [missingFields, setMissingFields] = useState([]);

  const searchTimerRef = useRef(null);

  const handleSearchChange = (text) => {
    setLocationQuery(text);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const searchPlaces = useCallback(async (query) => {
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

  const handleLocationSelect = (item) => {
    setSelectedLocation({
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    });
    setLocationQuery(item.display_name);
    setLocationResults([]);
  };

  const pickImage = async (fromCamera) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert('Permission required', 'Permission is needed to access this feature.');
      return;
    }

    let result = fromCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    let formData = new FormData();
    formData.append('file', { uri, name: 'upload.jpg', type: 'image/jpeg' });

    const response = await fetch(`${API_URL}/graphql/files`, {
      method: 'POST',
      body: formData,
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2YyYTY5ZTQ0MDc5MmEzNDk2NmY1ZWMiLCJyYW5kb20iOiIwLjgyOTYxMjQyNzQ3MDA3NjciLCJpYXQiOjE3NDM5NTU2MTQsImV4cCI6MTc0NDU2MDQxNH0.f6OytPS2gHqSeK4paR77QA-Q4kT1xzenMAJv_Ml_0KI'}`,
       },
    });

    const result = await response.json();
    setImageUrl(result.url);
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

    {/* Image Picker */}
    <View className="mb-6">
      {!image ? (
        <Pressable
          onPress={() => {
            Alert.alert('Select Image', 'Choose an option to upload an image.', [
              { text: 'Gallery', onPress: () => pickImage(false) },
              { text: 'Camera', onPress: () => pickImage(true) },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
          className="p-3 bg-[#FF385C] rounded-xl"
        >
          <Text className="text-white text-center">+ Add Image</Text>
        </Pressable>
      ) : (
        <View className="flex-row items-center">
          <Image source={{ uri: image }} className="w-24 h-24 rounded-lg mr-3" />
          <Pressable
            onPress={() => {
              setImage(null);
              setImageUrl(null);
            }}
            className="p-2 bg-red-500 rounded-full"
          >
            <Text className="text-white text-lg">X</Text>
          </Pressable>
        </View>
      )}
    </View>

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
