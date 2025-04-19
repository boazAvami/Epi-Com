import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Camera, LogOut } from "lucide-react-native";
import { useAuth } from '@/context/authContext';
import { useAuth as useAuthStore } from '@/stores/useAuth';
import { UpdateUser } from '@/services/graphql/graphqlUserService';
import DateInput from "@/components/DatePicker";
import { EGender, EAllergy, IEmergencyContact } from '@shared/types';
import { RegisterData } from '@/shared/types/register-data.type';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import * as ImagePicker from 'expo-image-picker';
import { Pencil } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText, RTLView, RTLRow } from '@/components/shared/RTLComponents';
import { getValidationMessage } from '@/utils/validation-messages';
import { colors } from '@/constants/Colors';


// Import UI components
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { AlertTriangle } from 'lucide-react-native';
import PhoneNumberInput from "@/components/PhoneNumberInput";
import DropdownComponent from "@/components/Dropdown";
import { getGenderOptions } from "@/utils/gender-utils";
import Chips from "@/components/Chips";
import { ChipItem } from "@/components/Chip";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';

// Interface for form emergency contacts that allows optional fields during editing
interface FormEmergencyContact {
  name?: string;
  phone?: string;
}

// Helper to convert enum value to readable format
const formatAllergyName = (allergyKey: string): string => {
  // Convert camelCase to words with spaces
  return allergyKey.replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Define validation schema for profile settings - we'll define it inside the component to use translations
type ProfileSettingsFormData = {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone_number?: string;
  gender?: string;
  date_of_birth?: Date;
  allergies?: string[];
  emergencyContacts?: {
    name?: string;
    phone?: string;
  }[];
  password?: string;
  confirmPassword?: string;
  profile_picture_uri?: string | null;
};

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { getUserInfo, logout } = useAuth();
  const { user, refreshToken } = useAuthStore();
  const { t, isRtl, language, toggleLanguage } = useAppTranslation();
  const [isLoading, setIsLoading] = useState(!user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [allergiesItems, setAllergiesItems] = useState<ChipItem[]>([]);
  const [genderOptions, setGenderOptions] = useState(getGenderOptions());
  
  // Update options when language changes
  useEffect(() => {
    // Create allergy items based on the current language
    const allergyItems = Object.entries(EAllergy).map(([key, value]) => ({
      label: isRtl ? value : formatAllergyName(key),
      value: value
    }));
    setAllergiesItems(allergyItems);
    
    // Update gender options when language changes
    setGenderOptions(getGenderOptions());
  }, [isRtl, language]);
  
  // Define validation schema with localized messages
  const profileSettingsSchema = z.object({
    userName: z.string().min(1, getValidationMessage('validation.register.username_required')),
    firstName: z.string().min(2, getValidationMessage('validation.register.first_name_min')),
    lastName: z.string().min(2, getValidationMessage('validation.register.last_name_min')),
    email: z.string().email(getValidationMessage('validation.register.email_invalid')),
    phone_number: z.string().optional(),
    gender: z.string().optional(),
    date_of_birth: z.date().optional(),
    allergies: z.array(z.string()).optional(),
    emergencyContacts: z.array(
      z.object({
        name: z.string().optional(),
        phone: z.string().optional(),
      })
    ).optional(),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    profile_picture_uri: z.string().nullable().optional(),
  });
  
  // Set up form with React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      userName: user?.userName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone_number: user?.phone_number || '',
      gender: user?.gender,
      date_of_birth: user?.date_of_birth ? new Date(Number(user.date_of_birth)) : undefined,
      allergies: user?.allergies || [],
      // Convert IEmergencyContact[] to FormEmergencyContact[]
      emergencyContacts: user?.emergencyContacts?.map(contact => ({
        name: contact.name,
        phone: contact.phone
      })) || [{ name: '', phone: '' }],
      password: '',
      confirmPassword: '',
      profile_picture_uri: user?.profile_picture_uri || '',
    }
  });
  
  // Initialize form with user data once available
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          await getUserInfo();
        } else {
          // Initialize form fields with user data
          setValue('userName', user.userName || '');
          setValue('firstName', user.firstName || '');
          setValue('lastName', user.lastName || '');
          setValue('email', user.email || '');
          setValue('phone_number', user.phone_number || '');
          setValue('gender', user.gender);
          
          if (user.date_of_birth) {
            // Convert to number firs
            const timestamp = Number(user.date_of_birth);
            const dateObj = new Date(timestamp);

            // Check if the date is valid before setting it
            if (!isNaN(dateObj.getTime())) {
              setValue('date_of_birth', dateObj);
            } else {
              console.log('Invalid date, not setting in form');
            }
          }
          
          setValue('allergies', user.allergies || []);
          
          // Convert IEmergencyContact[] to FormEmergencyContact[]
          setValue('emergencyContacts', user.emergencyContacts?.map(contact => ({
            name: contact.name,
            phone: contact.phone
          })) || [{ name: '', phone: '' }]);
          
          setValue('profile_picture_uri', user.profile_picture_uri || '');
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Add emergency contact
  const addEmergencyContact = () => {
    const currentContacts = watch('emergencyContacts') || [];
    setValue('emergencyContacts', [...currentContacts, { name: '', phone: '' }]);
  };
  
  // Remove emergency contact
  const removeEmergencyContact = (index: number) => {
    const currentContacts = watch('emergencyContacts') || [];
    setValue(
      'emergencyContacts',
      currentContacts.filter((_, i) => i !== index)
    );
  };
  
  // Handle logout
  const handleLogout = async () => {
    if (!refreshToken) {
      Alert.alert(t('errors.error'), t('profile.no_refresh_token'));
      return;
    }
    
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert(t('errors.error'), t('profile.logout_failed'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle picking an image from the gallery
  const handlePickImage = async () => {
    console.log('Image picker triggered');  
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    console.log('Permission status:', status);
    
    if (status !== 'granted') {
      Alert.alert(t('errors.permission_denied'), t('errors.media_permission_required'));
      return;
    }
  
    try {  // Add try/catch to catch any errors
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      console.log('Image picker result:', result);  // Add this line
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Setting new image URI:', result.assets[0].uri);  // Add this line
        setValue('profile_picture_uri', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('errors.error'), t('errors.image_picker_error'));
    }
  };

  // Add this function to your component
const handleProfilePictureOptions = () => {
  Alert.alert(
    t('profile.profile_picture'),
    t('profile.select_option'),
    [
      {
        text: t('photo.choose'),
        onPress: handlePickImage
      },
      {
        text: t('photo.take'),
        onPress: handleTakePhoto
      },
      {
        text: t('photo.remove'),
        onPress: handleRemovePicture,
        style: "destructive"
      },
      {
        text: t('buttons.cancel'),
        style: "cancel"
      }
    ]
  );
};

// Add these two new handler functions
const handleTakePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(t('errors.permission_denied'), t('errors.camera_permission_required'));
    return;
  }

  try {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setValue('profile_picture_uri', result.assets[0].uri);
    }
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert(t('errors.error'), t('errors.image_picker_error'));
  }
};

const handleRemovePicture = () => {
  Alert.alert(
    t('photo.remove'),
    t('profile.confirm_remove_picture'),
    [
      {
        text: t('buttons.cancel'),
        style: "cancel"
      },
      {
        text: t('photo.remove'),
        onPress: () => {          
          setValue('profile_picture_uri', null);        
        },
        style: "destructive"
      }
    ]
  );
};
  
  // Convert form emergency contacts to IEmergencyContact[] | null
  const convertEmergencyContacts = (
    contacts?: FormEmergencyContact[] | null
  ): IEmergencyContact[] | null => {
    if (!contacts || contacts.length === 0) return null;
    
    // Filter out invalid contacts (where name or phone is empty)
    const validContacts = contacts
      .filter(contact => contact.name && contact.phone) // Only keep contacts with both name and phone
      .map(contact => ({
        name: contact.name as string, // We've verified these exist in the filter
        phone: contact.phone as string
      }));
    
    return validContacts.length > 0 ? validContacts : null;
  };
  
  // Handle form submission
  const onSubmit = async (data: ProfileSettingsFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert(t('errors.error'), getValidationMessage('validation.register.passwords_match'));
      return;
    }
    
    // Check if any changes were made
    if (!user) return;

    const formDateStr = data.date_of_birth?.toISOString();
    const userDateStr = user.date_of_birth ? new Date(Number(user.date_of_birth)).toISOString() : undefined;
    
    // Explicit check for profile picture change
    const isPictureChanged = data.profile_picture_uri !== user.profile_picture_uri;

    const hasChanges = 
      data.userName !== user.userName ||
      data.firstName !== (user.firstName || '') ||
      data.lastName !== (user.lastName || '') ||
      data.profile_picture_uri !== user.profile_picture_uri ||
      data.email !== user.email ||
      data.phone_number !== (user.phone_number || '') ||
      data.gender !== (user.gender || '') ||
      formDateStr !== userDateStr ||
      JSON.stringify(data.allergies) !== JSON.stringify(user.allergies || []) ||
      JSON.stringify(data.emergencyContacts) !== JSON.stringify(user.emergencyContacts?.map(contact => ({
        name: contact.name,
        phone: contact.phone
      })) || []);
    
    // If no changes, show message and return
    if (!hasChanges && !data.password) {
      Alert.alert(t('profile.info'), t('profile.no_changes'), [
        { text: t('buttons.ok'), onPress: () => router.push("/(tabs)/profile") }
      ]);
      return;
    }

    // If it's an empty string, set it to null for the API
    const profilePictureValue = data.profile_picture_uri // === '' ? null : data.profile_picture_uri;

    // Prepare data for update with type conversion for emergency contacts
    const updatedUserData: Partial<RegisterData> = {
      userName: data.userName,
      firstName: data.firstName?.trim() === '' ? null : data.firstName,
      lastName: data.lastName?.trim() === '' ? null : data.lastName,
      profile_picture_uri: profilePictureValue,
      email: data.email,
      phone_number: data.phone_number?.trim() === '' ? undefined : data.phone_number,
      gender: data.gender as EGender || null,
      date_of_birth: data.date_of_birth || null,
      allergies: data.allergies?.length ? data.allergies : [],
      emergencyContacts: convertEmergencyContacts(data.emergencyContacts)
    };
    
    // Add password only if provided
    if (data.password) {
      updatedUserData.password = data.password;
    }
    
    try {
      setIsLoading(true);
      await UpdateUser(updatedUserData);
      await getUserInfo();
      
      Alert.alert(t('profile.success'), t('profile.profile_updated'), [
        { text: t('buttons.ok'), onPress: () => router.push("/(tabs)/profile") }
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert(t('errors.error'), t('profile.update_failed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Center style={{ flex: 1 }}>
          <RTLText>{t('profile.loading')}</RTLText>
        </Center>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        {/* Header with back button */}
        <RTLRow style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Icon as={ChevronLeft} size="lg" color="#333333" />
          </TouchableOpacity>
          <Heading size="lg">{t('profile.settings')}</Heading>
          <View style={styles.placeholder} />
        </RTLRow>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture Section */}
          <Center style={styles.profilePictureSection}>
            <FormControl isInvalid={!!errors.profile_picture_uri}>
              <Pressable 
              onPress={handleProfilePictureOptions}
              style={({ pressed }) => [
                { opacity: pressed ? 0.7 : 1 }  // This will show visual feedback when pressed
              ]}>
                <Avatar size="2xl">
                  <AvatarFallbackText>
                    {watch('firstName') && watch('lastName')
                      ? `${watch('firstName')} ${watch('lastName')}`
                      : watch('userName')}
                  </AvatarFallbackText>
                  <AvatarImage
                    source={
                      watch('profile_picture_uri')
                        ? { uri: watch('profile_picture_uri') }
                        : require('@/assets/images/profile_avatar_placeholder.png')
                    }
                  />
                  <AvatarBadge className="justify-center items-center bg-background-400">
                    <Icon as={Pencil} color="#fff" />
                  </AvatarBadge>
                </Avatar>
              </Pressable>
              <FormControlError>
                <FormControlErrorText>
                  {errors.profile_picture_uri?.message 
                    ? t(errors.profile_picture_uri.message as string) 
                    : ''}
                </FormControlErrorText>
                <FormControlErrorIcon as={AlertTriangle} />
              </FormControlError>
            </FormControl>
          </Center>
          
          <Box style={styles.formContainer}>
            {/* Logout and Language Toggle Buttons */}
            <RTLRow style={styles.actionButtonsRow}>
              {/* Language Toggle Button */}
              <TouchableOpacity 
                style={[styles.languageButton, isRtl && styles.languageButtonRtl]}
                onPress={toggleLanguage}
              >
                <RTLText style={styles.languageButtonText}>
                  {language === 'en' ? 'עב' : 'EN'}
                </RTLText>
              </TouchableOpacity>
              
              {/* Logout Button */}
              <TouchableOpacity 
                style={[styles.logoutButton, isRtl && styles.logoutButtonRtl]}
                onPress={() => {
                  if (isLoggingOut) return;
                  Alert.alert(
                    t('buttons.logout'),
                    t('profile.confirm_logout'),
                    [
                      { text: t('buttons.cancel'), style: "cancel" },
                      { 
                        text: t('profile.yes_logout'), 
                        onPress: () => {
                          if (!isLoggingOut) {
                            handleLogout();
                          }
                        },
                        style: "destructive" 
                      }
                    ]
                  );
                }}
                disabled={isLoggingOut}
              >
                <Icon as={LogOut} size="md" color={colors.primary} />
                <RTLText style={styles.logoutText}>{t('buttons.logout')}</RTLText>
              </TouchableOpacity>
            </RTLRow>
            <RTLText style={styles.sectionTitle}>{t('profile.account_info')}</RTLText>
            
            {/* User Info Form */}
            <VStack space="md">
              {/* Username */}
              <FormControl isInvalid={!!errors.userName}>
                <Controller
                  name="userName"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder={t('auth.register.step1.username')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        textAlign={isRtl ? 'right' : 'left'}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.userName?.message ? t(errors.userName.message as string) : ''}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* First Name and Last Name */}
              <RTLRow style={styles.nameFields}>
                <FormControl isInvalid={!!errors.firstName} style={styles.halfInput}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder={t('auth.register.step2.first_name')}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          textAlign={isRtl ? 'right' : 'left'}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>{errors.firstName?.message ? t(errors.firstName.message as string) : ''}</FormControlErrorText>
                    <FormControlErrorIcon as={AlertTriangle} />
                  </FormControlError>
                </FormControl>
                
                <FormControl isInvalid={!!errors.lastName} style={styles.halfInput}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder={t('auth.register.step2.last_name')}
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          textAlign={isRtl ? 'right' : 'left'}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>{errors.lastName?.message ? t(errors.lastName.message as string) : ''}</FormControlErrorText>
                    <FormControlErrorIcon as={AlertTriangle} />
                  </FormControlError>
                </FormControl>
              </RTLRow>
              
              {/* Email */}
              <FormControl isInvalid={!!errors.email}>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder={t('auth.email')}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textAlign={isRtl ? 'right' : 'left'}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.email?.message ? t(errors.email.message as string) : ''}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* Phone Number - Using the same PhoneNumberInput component as registration */}
              <FormControl isInvalid={!!errors.phone_number}>
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <PhoneNumberInput 
                      onChange={onChange} 
                      onBlur={onBlur} 
                      value={value || ''}
                      isInvalid={!!errors.phone_number}
                    />
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.phone_number?.message ? t(errors.phone_number.message as string) : ''}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* Gender - Using the same DropdownComponent as registration */}
              <FormControl isInvalid={!!errors.gender}>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <DropdownComponent 
                      value={value || ''} 
                      onChange={onChange} 
                      items={genderOptions}
                      isInvalid={!!errors.gender}
                    />
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.gender?.message ? t(errors.gender.message as string) : ''}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* Date of Birth - Using the same DateInput component as registration */}
              <FormControl isInvalid={!!errors.date_of_birth}>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => {
                    return (
                      <DateInput 
                        onChange={onChange} 
                        onBlur={onBlur} 
                        value={value}
                      />
                    );
                  }}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.date_of_birth?.message ? t(errors.date_of_birth.message as string) : ''}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Allergies section - Using the same Chips component as registration */}
            <RTLText style={styles.sectionTitle}>{t('profile.medical_info')}</RTLText>
            <RTLText style={styles.sectionDescription}>{t('profile.allergies_description')}</RTLText>
            
            <FormControl isInvalid={!!errors.allergies}>
              <Controller
                name="allergies"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Chips
                    type="filter"
                    itemVariant="outlined"
                    items={allergiesItems}
                    setItems={setAllergiesItems}
                    selectedValues={value || []}
                    setSelectedValues={onChange}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText>{errors.allergies?.message ? t(errors.allergies.message as string) : ''}</FormControlErrorText>
                <FormControlErrorIcon as={AlertTriangle} />
              </FormControlError>
            </FormControl>
            
            <Divider style={styles.divider} />
            
            {/* Emergency contacts section - Using similar structure to registration step-4 */}
            <View style={[styles.emergencyContactsHeader, isRtl ? {flexDirection: 'row-reverse'} : {flexDirection: 'row'}]}>
              <RTLText style={styles.sectionTitle}>{t('profile.emergency_contacts')}</RTLText>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addEmergencyContact}
              >
                <RTLText style={styles.addButtonText}>{isRtl ? `${t('profile.add')} +` : `+ ${t('profile.add')}`}</RTLText>
              </TouchableOpacity>
            </View>
            
            <RTLText style={styles.sectionDescription}>{t('profile.emergency_contacts_description')}</RTLText>
            
            <VStack space="md" style={styles.emergencyContactsList}>
              {watch('emergencyContacts')?.map((_, index) => (
                <View key={index} style={styles.emergencyContactItem}>
                  <FormControl isInvalid={!!errors?.emergencyContacts?.[index]?.name}>
                    <Controller
                      name={`emergencyContacts.${index}.name`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input>
                          <InputField
                            placeholder={t('auth.register.step4.contact_name')}
                            value={value || ''}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            textAlign={isRtl ? 'right' : 'left'}
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors?.emergencyContacts?.[index]?.name?.message 
                          ? t(errors.emergencyContacts[index].name.message as string) 
                          : ''}
                      </FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors?.emergencyContacts?.[index]?.phone} style={{ marginTop: 8 }}>
                    <Controller
                      name={`emergencyContacts.${index}.phone`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PhoneNumberInput 
                          onChange={onChange} 
                          onBlur={onBlur} 
                          value={value || ''}
                          isInvalid={!!errors?.emergencyContacts?.[index]?.phone}
                        />
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors?.emergencyContacts?.[index]?.phone?.message 
                          ? t(errors.emergencyContacts[index].phone.message as string) 
                          : ''}
                      </FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  {(watch('emergencyContacts') || []).length > 1 && (
                    <TouchableOpacity 
                      style={[styles.removeButton, isRtl ? styles.removeButtonRtl : null]}
                      onPress={() => removeEmergencyContact(index)}
                    >
                      <RTLText style={styles.removeButtonText}>{t('profile.remove')}</RTLText>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </VStack>
            
            {/* Save Button */}
            <Button 
              style={styles.saveButton} 
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
            >
              <ButtonText>{isLoading ? t('profile.saving') : t('profile.save_changes')}</ButtonText>
            </Button>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 28, // Same width as the back button for balanced layout
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  profilePictureSection: {
    marginVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  formContainer: {
    paddingHorizontal: 25,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  logoutButton: {
    height: 40,
    minWidth: 110,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  logoutButtonRtl: {
    flexDirection: 'row-reverse',
  },
  logoutText: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    fontSize: 18,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 12,
    fontSize: 14,
  },
  nameFields: {
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  halfInput: {
    flex: 0.48, // Less than 0.5 to account for the space between
    marginHorizontal: 4,
  },
  divider: {
    marginVertical: 24,
  },
  emergencyContactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  addButton: {
    padding: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  emergencyContactsList: {
    marginTop: 8,
  },
  emergencyContactItem: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 4,
  },
  removeButtonRtl: {
    alignSelf: 'flex-start',
  },
  removeButtonText: {
    color: '#777',
    fontSize: 12,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: colors.primary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageButton: {
    height: 40,
    minWidth: 80,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  languageButtonRtl: {
    flexDirection: 'row-reverse',
  },
  languageButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});