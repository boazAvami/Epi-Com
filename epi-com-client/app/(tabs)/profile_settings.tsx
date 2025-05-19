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
import { Controller, useForm, FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Pencil } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText, RTLView, RTLRow } from '@/components/shared/RTLComponents';
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
import { genderOptions } from "@/utils/gender-utils";
import Chips from "@/components/Chips";
import { ChipItem } from "@/components/Chip";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
} from '@/components/ui/avatar';

// Import the external validation schema
import { profileSettingsSchema, ProfileSettingsFormData } from '@/schemas/profile-settings-schema';
import { getAllergyItems } from '@/utils/allergy-utils';

// Interface for form emergency contacts that allows optional fields during editing
interface FormEmergencyContact {
  name?: string;
  phone?: string;
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { getUserInfo, logout } = useAuth();
  const { user, refreshToken } = useAuthStore();
  const { t, isRtl, toggleLanguage, language } = useAppTranslation();
  const [isLoading, setIsLoading] = useState(!user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [allergiesItems, setAllergiesItems] = useState<ChipItem[]>([]);
  
  // Update allergies items when language changes
  useEffect(() => {
    setAllergiesItems(getAllergyItems(isRtl));
  }, [isRtl, language]);
  
  // Helper function to safely convert error messages to strings
  const getErrorMessage = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error.message === 'string') return error.message;
    return 'Invalid input';
  };
  
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
      gender: user?.gender as EGender | undefined,
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
          setValue('gender', user.gender as EGender);
          
          if (user.date_of_birth) {
            // Convert to number first
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
  
  // Remove emergency contact with proper TypeScript typing
  const removeEmergencyContact = (index: number) => {
    const currentContacts = watch('emergencyContacts') || [];
    setValue(
      'emergencyContacts',
      currentContacts.filter((_contact: FormEmergencyContact, i: number) => i !== index)
    );
  };
  
  // Handle logout
  const handleLogout = async () => {
    if (!refreshToken) {
      Alert.alert("Error", "No refresh token found.");
      return;
    }
    
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
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
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      console.log('Image picker result:', result);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        console.log('Setting new image URI:', result.assets[0].uri);
        setValue('profile_picture_uri', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(t('errors.error'), t('errors.image_picker_error'));
    }
  };

  // Handle profile picture options
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

  // Take photo handler
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
      Alert.alert(t('errors.error'), t('errors.camera_error'));
    }
  };

  // Remove profile picture handler
  const handleRemovePicture = () => {
    Alert.alert(
      t('photo.remove'),
      t('profile.remove_picture_confirmation'),
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
  
  // Convert form emergency contacts to IEmergencyContact[] | null with proper TypeScript typing
  const convertEmergencyContacts = (
    contacts?: FormEmergencyContact[] | null
  ): IEmergencyContact[] | null => {
    if (!contacts || contacts.length === 0) return null;
    
    // Filter out invalid contacts (where name or phone is empty)
    const validContacts = contacts
      .filter((contact: FormEmergencyContact) => contact.name && contact.phone) // Only keep contacts with both name and phone
      .map((contact: FormEmergencyContact) => ({
        name: contact.name as string, // We've verified these exist in the filter
        phone: contact.phone as string
      }));
    
    return validContacts.length > 0 ? validContacts : null;
  };
  
  // Handle form submission with improved error handling
  const onSubmit = async (data: ProfileSettingsFormData) => {
    // Check if any changes were made
    if (!user) return;

    const formDateStr = data.date_of_birth?.toISOString();
    const userDateStr = user.date_of_birth ? new Date(Number(user.date_of_birth)).toISOString() : undefined;
    
    const hasChanges = 
      data.userName !== user.userName ||
      data.firstName !== (user.firstName || '') ||
      data.lastName !== (user.lastName || '') ||
      data.profile_picture_uri !== user.profile_picture_uri ||
      data.email !== user.email ||
      data.phone_number !== (user.phone_number || '') ||
      data.gender !== (user.gender || null) ||
      formDateStr !== userDateStr ||
      JSON.stringify(data.allergies) !== JSON.stringify(user.allergies || []) ||
      JSON.stringify(data.emergencyContacts) !== JSON.stringify(user.emergencyContacts?.map(contact => ({
        name: contact.name,
        phone: contact.phone
      })) || []);
    
    // If no changes, show message and return
    if (!hasChanges && !data.password) {
      Alert.alert(t('profile.no_changes_title'), t('profile.no_changes_message'), [
        { text: t('buttons.ok'), onPress: () => router.push("/(tabs)/profile") }
      ]);
      return;
    }

    const profilePictureValue = data.profile_picture_uri;

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
      
      Alert.alert(t('profile.update_success_title'), t('profile.update_success_message'), [
        { text: t('buttons.ok'), onPress: () => router.push("/(tabs)/profile") }
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      
      // Improved error handling for specific error cases
      let errorMessage = t('profile.update_failed');
      
      // Check for duplicate email error
      if (error instanceof Error) {
        const errorStr = error.toString();
        
        if (errorStr.includes("duplicate key error") && errorStr.includes("email")) {
          errorMessage = t('profile.email_in_use');
        } else if (errorStr.includes("NOBRIDGE")) {
          // This catches the specific error format you mentioned
          if (errorStr.includes("duplicate key error") && errorStr.includes("email")) {
            errorMessage = t('profile.email_in_use');
          }
        }
      }
      
      Alert.alert(t('errors.error'), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Center style={{ flex: 1 }}>
          <Text>{t('profile.loading')}</Text>
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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Icon as={ChevronLeft} size="lg" color="#333333" />
          </TouchableOpacity>
          <Heading size="lg">{t('profile.settings')}</Heading>
          <TouchableOpacity 
            style={styles.logoutTopButton}
            onPress={() => {
              if (isLoggingOut) return;
              Alert.alert(
                t('profile.logout'),
                t('profile.logoutConfirmation'),
                [
                  { text: t('buttons.cancel'), style: "cancel" },
                  { 
                    text: t('buttons.logout'), 
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
          </TouchableOpacity>
        </View>
        
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
                <FormControlErrorText>{getErrorMessage(errors.profile_picture_uri?.message)}</FormControlErrorText>
                <FormControlErrorIcon as={AlertTriangle} />
              </FormControlError>
            </FormControl>
          </Center>
          
          <Box style={styles.formContainer}>
            {/* Language Toggle Section */}
            <RTLView style={styles.languageSection}>
              <RTLRow style={styles.languageHeader}>
                <View style={{ flex: 1 }}>
                  <Heading size="md" style={isRtl ? styles.rtlHeading : undefined}>{t('profile.language')}</Heading>
                  <RTLText style={styles.sectionDescription}>{t('profile.languageDescription')}</RTLText>
                </View>
                <Button 
                  style={isRtl ? styles.rtlLanguageButton : styles.languageButton}
                  onPress={toggleLanguage}
                >
                  <ButtonText style={styles.languageButtonText}>
                    {language === 'en' ? 'עברית' : 'English'}
                  </ButtonText>
                </Button>
              </RTLRow>
            </RTLView>
            
            <Divider style={styles.divider} />
            
            <RTLView>
              <Heading size="md" style={isRtl ? styles.rtlHeading : undefined}>{t('profile.accountInfo')}</Heading>
            </RTLView>
            
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
                        style={isRtl ? { textAlign: 'right' } : undefined}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{getErrorMessage(errors.userName?.message)}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* First Name and Last Name */}
              <HStack space="sm" style={[styles.nameFields, isRtl ? { flexDirection: 'row-reverse' } : undefined]}>
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
                          style={isRtl ? { textAlign: 'right' } : undefined}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>{getErrorMessage(errors.firstName?.message)}</FormControlErrorText>
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
                          style={isRtl ? { textAlign: 'right' } : undefined}
                        />
                      </Input>
                    )}
                  />
                  <FormControlError>
                    <FormControlErrorText>{getErrorMessage(errors.lastName?.message)}</FormControlErrorText>
                    <FormControlErrorIcon as={AlertTriangle} />
                  </FormControlError>
                </FormControl>
              </HStack>
              
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
                        style={isRtl ? { textAlign: 'right' } : undefined}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{getErrorMessage(errors.email?.message)}</FormControlErrorText>
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
                  <FormControlErrorText>{getErrorMessage(errors.phone_number?.message)}</FormControlErrorText>
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
                  <FormControlErrorText>{getErrorMessage(errors.gender?.message)}</FormControlErrorText>
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
                  <FormControlErrorText>{getErrorMessage(errors.date_of_birth?.message)}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Allergies section - Using the same Chips component as registration */}
            <RTLView>
              <Heading size="md" style={isRtl ? styles.rtlHeading : undefined}>{t('profile.medicalInfo')}</Heading>
            </RTLView>
            <RTLText style={styles.sectionDescription}>{t('auth.register.step3.subtitle')}</RTLText>
            
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
                    isRtl={isRtl}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText>{getErrorMessage(errors.allergies?.message)}</FormControlErrorText>
                <FormControlErrorIcon as={AlertTriangle} />
              </FormControlError>
            </FormControl>
            
            <Divider style={styles.divider} />
            
            {/* Emergency contacts section */}
            <View style={[
              styles.emergencyContactsHeader, 
              isRtl && { flexDirection: 'row-reverse' }
            ]}>
              <Heading size="md" style={isRtl ? styles.rtlHeading : undefined}>{t('profile.emergencyContacts')}</Heading>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addEmergencyContact}
              >
                <RTLText style={styles.addButtonText}>+ {t('buttons.add')}</RTLText>
              </TouchableOpacity>
            </View>
            
            <RTLText style={styles.sectionDescription}>{t('auth.register.step4.subtitle')}</RTLText>
            
            <VStack space="md" style={styles.emergencyContactsList}>
              {watch('emergencyContacts')?.map((_: any, index: number) => (
                <RTLView key={index} style={styles.emergencyContactItem}>
                  <FormControl isInvalid={!!errors?.emergencyContacts 
                     && Array.isArray(errors.emergencyContacts)
                     && !!errors.emergencyContacts[index]?.name}
                     style={{ width: '100%' }}>
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
                            style={isRtl ? { textAlign: 'right' } : undefined}
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors?.emergencyContacts && 
                         Array.isArray(errors.emergencyContacts) && 
                         errors.emergencyContacts[index]?.name ? 
                         getErrorMessage(errors.emergencyContacts[index].name?.message) : ''}
                      </FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors?.emergencyContacts && Array.isArray(errors.emergencyContacts) && !!errors.emergencyContacts[index]?.phone} style={{ marginTop: 8, width: '100%' }}>
                    <Controller
                      name={`emergencyContacts.${index}.phone`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PhoneNumberInput 
                          onChange={onChange} 
                          onBlur={onBlur} 
                          value={value || ''}
                          isInvalid={!!errors?.emergencyContacts && Array.isArray(errors.emergencyContacts) && !!errors.emergencyContacts[index]?.phone}
                        />
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>
                        {errors?.emergencyContacts && 
                         Array.isArray(errors.emergencyContacts) && 
                         errors.emergencyContacts[index]?.phone ? 
                         getErrorMessage(errors.emergencyContacts[index].phone?.message) : ''}
                      </FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  {(watch('emergencyContacts') || []).length > 1 && (
                    <TouchableOpacity 
                      style={isRtl ? styles.rtlRemoveButton : styles.removeButton}
                      onPress={() => removeEmergencyContact(index)}
                    >
                      <RTLText style={styles.removeButtonText}>{t('profile.remove_contact')}</RTLText>
                    </TouchableOpacity>
                  )}
                </RTLView>
              ))}
            </VStack>
            
            {/* Save Button */}
            <Button 
              style={styles.saveButton} 
              onPress={handleSubmit(onSubmit)}
              isDisabled={isLoading}
            >
              <ButtonText>{isLoading ? t('profile.saving') : t('profile.save')}</ButtonText>
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
  logoutTopButton: {
    padding: 8,
    borderRadius: 8,
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
    backgroundColor: '#AF3C3F',
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
  logoutContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  rtlLogoutContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  rtlLogoutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  logoutText: {
    color: colors.primary,
    marginLeft: 8,
    fontWeight: '600',
  },
  rtlLogoutText: {
    color: colors.primary,
    marginRight: 8,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sectionDescription: {
    color: '#666',
    marginBottom: 12,
    fontSize: 14,
  },
  languageSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  languageHeader: {
    width: '100%',
    justifyContent: 'space-between',
  },
  languageButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginLeft: 12,
  },
  rtlLanguageButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginRight: 12,
  },
  languageButtonText: {
    fontWeight: '600',
  },
  rtlHeading: {
    textAlign: 'right',
  },
  rtlText: {
    textAlign: 'right',
  },
  nameFields: {
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 0.48, // Less than 0.5 to account for the space between
  },
  divider: {
    marginVertical: 24,
  },
  emergencyContactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
    width: '100%'
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    padding: 4,
  },
  removeButtonText: {
    color: '#777',
    fontSize: 12,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: colors.primary,
  },
  rtlRemoveButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
    padding: 4,
  },
});