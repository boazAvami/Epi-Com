import React, { useState, useEffect } from 'react';
import { Pressable, View, Text, TextInput, Image, Alert, FlatList, SafeAreaView} from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { getToken } from '@/utils/tokenStorage';
import { API_URL } from '@/constants/Env';

const AddEpiPen = () => {
  const [location, setLocation] = useState(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState([]);
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

  useEffect(() => {
    if (!locationQuery) return setLocationResults([]);
    const delayDebounce = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}&accept-language=he`)
        .then(res => res.json())
        .then(data => setLocationResults(data))
        .catch(err => console.error('Location search failed:', err));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [locationQuery]);

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
    if (!location) missing.push('location');
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

    const graphqlQuery = {
      query: `
        mutation AddEpiPen($input: AddEpiPenInput!) {
          addEpiPen(input: $input) { _id, message }
        }
      `,
      variables: {
        input: {
          location: location,
          description,
          expiryDate: expiryDate.toISOString().split('T')[0],
          contact: { name: contactName, phone: contactPhone },
          image: imageUrl,
          serialNumber,
          kind
        },
      },
    };

    const accessToken: string | null = await getToken();

    await fetch(`${API_URL}/graphql`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
       },
      
      body: JSON.stringify(graphqlQuery),
    });
  };

  const renderField = (label, value, onChange, name, isRequired:boolean, keyboardType = 'default') => (
    <View className="mb-4 flex-row items-center w-full justify-between">
      <Text className="w-1/3 text-base mr-2 text-black">
        {label}{ isRequired ? <Text className="text-red-500">*</Text> : null}
        </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        className={`w-2/3 border-b border-gray-300 pb-1 ${missingFields.includes(name) ? 'border-b border-red-500' : ''}`}
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
        
        <View className="bg-white py-6 px-4 border-b border-gray-200" style={{ position: 'sticky', top: 0, zIndex: 10, width: '100%' }}>
            <Text className="text-xl text-black text-center">Add Your Epipen</Text>
        </View>

          <View className="px-4 mt-6 w-full">
          <View className="mb-4 flex-row items-center w-full justify-between">
                <Text className="text-base mb-1 text-black">
                    Location <Text className="text-red-500">*</Text>
                </Text>
                <TextInput
                    value={locationQuery}
                    onChangeText={setLocationQuery}
                    className={`w-2/3 border-b border-gray-300 pb-1 ${missingFields.includes('location') ? 'border-b border-red-500' : ''}`}
                />
            </View>

            <FlatList
                data={locationResults}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        className="bg-white p-2 border-b border-gray-200"
                        onPress={() => {
                            setLocation({
                                latitude: parseFloat(item.lat),
                                longitude: parseFloat(item.lon)
                            });
                            setLocationQuery(item.display_name);
                            setLocationResults([]);
                        }}
                    >
                        <Text>{item.display_name}</Text>
                    </Pressable>
                )}
            />

            <View className="mb-4 flex-row items-center w-full justify-between">
                <Text className="w-1/3 text-base mr-2 text-black">
                 Expiry Date <Text className="text-red-500">*</Text>
                </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                className={`w-2/3 border-b border-gray-300 pb-1 ${missingFields.includes('expiryDate') ? 'border-b border-red-500' : ''}`}
              >
                <Text>{expiryDate ? expiryDate.toDateString(): ""}</Text>
              </Pressable>
            </View>

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

            {renderField('Contact Name', contactName, setContactName, 'contactName', true)}
            {renderField('Contact Phone', contactPhone, setContactPhone, 'contactPhone', true, 'phone-pad')}
            {renderField('Serial Number', serialNumber, setSerialNumber, 'serialNumber', true)}

         <View className="mb-4 flex-row items-center">
            <Text className="w-1/3 text-base mr-2 text-black">
                Kind <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row space-x-4 flex-1 justify-between">
                {['Junior', 'Adult'].map((option) => (
                <Pressable
                key={option}
                onPress={() => setKind(option.toUpperCase())}
                className={`flex-row items-center px-7 py-2 rounded-lg border ${
                    missingFields.includes('kind')
                      ? 'border-red-500'
                      : kind === option.toUpperCase()
                      ? 'border-black-600'
                      : 'border-gray-400'
                  }`}
            >
                    <View className={`w-4 h-4 rounded-full mr-3SW ${
                     kind === option.toUpperCase() ? 'bg-gray-600' : 'border border-gray-400'}`}
                    />
                    <Text className="text-black capitalize">{option}</Text>
                </Pressable>
             ))}
            </View>
        </View>

        {renderField('Description', description, setDescription, 'description', false)}

        <View className="flex-row items-center mb-4">
        {!image ? (
        <Pressable
            onPress={() => {
            Alert.alert(
            'Select Image',
            'Choose an option to upload an image.',
            [
            {
              text: 'Gallery',
              onPress: () => pickImage(false), // From Gallery
            },
            {
              text: 'Camera',
              onPress: () => pickImage(true), // From Camera
            },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: true }
            );
        }}
            className="p-3 bg-blue-500 rounded-lg"
        >
        <Text className="text-white">+ Add Image</Text>
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
            {errorMessage ? <Text className="text-red-500 text-center mb-4">{errorMessage}</Text> : null}

            <View className="w-full">
              <Button onPress={handleSubmit} className="bg-red-600 px-6 rounded-lg shadow w-full">
                <ButtonText className="text-white font-bold text-center text-base">Submit</ButtonText>
              </Button>
            </View>
          </View>
      
    </SafeAreaView>
  );
};

export default AddEpiPen;
