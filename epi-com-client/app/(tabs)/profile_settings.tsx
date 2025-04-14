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

// Define validation schema for profile settings
const profileSettingsSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone_number: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.date().optional(),
  allergies: z.array(z.string()).default([]),
  emergencyContacts: z.array(
    z.object({
      name: z.string().optional(),
      phone: z.string().optional(),
    })
  ).default([{ name: '', phone: '' }]),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  profile_picture_uri: z.string().optional(),
});

// Make sure types match schema
type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { getUserInfo, logout } = useAuth();
  const { user, refreshToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [allergiesItems, setAllergiesItems] = useState<ChipItem[]>(
    Object.values(EAllergy).map((allergy: string) => ({label: allergy, value: allergy}))
  );
  
  // Set up form with React Hook Form
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = useForm<ProfileSettingsFormData>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      userName: '',
      firstName: '',
      lastName: '',
      email: '',
      phone_number: '',
      gender: undefined,
      date_of_birth: undefined,
      allergies: [],
      emergencyContacts: [{ name: '', phone: '' }],
      password: '',
      confirmPassword: '',
      profile_picture_uri: '',
    }
  });
  
  // Initialize form with user data once available
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          await getUserInfo();
        } else {
          // Convert date_of_birth string to Date object for display
          let dobDate = undefined;
          if (user.date_of_birth) {
            dobDate = new Date(user.date_of_birth);
            // Validate the date object is valid
            if (isNaN(dobDate.getTime())) {
              console.warn("Invalid date of birth:", user.date_of_birth);
              dobDate = undefined;
            } else {
              console.log("Valid date of birth:", dobDate.toISOString());
            }
          }

          // Reset form with user data to ensure clean state
          reset({
            userName: user.userName || '',
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
            gender: user.gender,
            date_of_birth: dobDate,
            allergies: user.allergies || [],
            emergencyContacts: user.emergencyContacts && user.emergencyContacts.length > 0 
              ? user.emergencyContacts.map(contact => ({
                  name: contact.name,
                  phone: contact.phone
                }))
              : [{ name: '', phone: '' }],
            password: '',
            confirmPassword: '',
            profile_picture_uri: user.profile_picture_uri || '',
          });
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, reset]);

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
  
  // Handle form submission
  const onSubmit = async (data: ProfileSettingsFormData) => {
    if (data.password !== data.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Create valid emergency contacts array
      let validEmergencyContacts: IEmergencyContact[] | null = null;
      
      if (data.emergencyContacts && data.emergencyContacts.length > 0) {
        const validContacts = data.emergencyContacts
          .filter(contact => contact.name && contact.phone)
          .map(contact => ({
            name: contact.name as string,
            phone: contact.phone as string
          }));
        
        if (validContacts.length > 0) {
          validEmergencyContacts = validContacts;
        }
      }
      
      // Prepare data for update
      const updatedUserData: Partial<RegisterData> = {
        userName: data.userName,
        firstName: data.firstName?.trim() === '' ? null : data.firstName,
        lastName: data.lastName?.trim() === '' ? null : data.lastName,
        email: data.email,
        phone_number: data.phone_number?.trim() === '' ? undefined : data.phone_number,
        gender: data.gender as EGender || null,
        date_of_birth: data.date_of_birth || null,
        // Ensure allergies is always an array
        allergies: data.allergies || [],
        // Apply our validated emergency contacts
        emergencyContacts: validEmergencyContacts
      };
      
      // Add password only if provided
      if (data.password) {
        updatedUserData.password = data.password;
      }
      
      // Log what we're sending for debugging
      console.log("Updating user with:", JSON.stringify({
        ...updatedUserData,
        password: updatedUserData.password ? '****' : undefined
      }, null, 2));
      
      // Send the update request
      await UpdateUser(updatedUserData);
      
      // Refresh user data
      await getUserInfo();
      
      Alert.alert("Success", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.push("/(tabs)/profile") }
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <Center style={{ flex: 1 }}>
          <Text>Loading your profile settings...</Text>
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
          <Heading size="lg">Settings</Heading>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Picture Section */}
          <Center style={styles.profilePictureSection}>
            <View style={styles.profileImageContainer}>
              {watch('profile_picture_uri') ? (
                <Image 
                  source={{ uri: watch('profile_picture_uri') }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text size="xl" bold>
                    {watch('firstName') && watch('lastName') 
                      ? watch('firstName').charAt(0) + watch('lastName').charAt(0)
                      : watch('userName').charAt(0)}
                  </Text>
                </View>
              )}
              <TouchableOpacity style={styles.cameraButton}>
                <Icon as={Camera} size="sm" color="#fff" />
              </TouchableOpacity>
            </View>
          </Center>
          
          <Box style={styles.formContainer}>
            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={() => {
                if (isLoggingOut) return;
                Alert.alert(
                  "Logout",
                  "Are you sure you want to logout?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { 
                      text: "Yes, Logout", 
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
              <Icon as={LogOut} size="md" color="#AF3C3F" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Heading size="md" style={styles.sectionTitle}>Account Information</Heading>
            
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
                        placeholder="Username"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.userName?.message}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* First Name and Last Name */}
              <HStack space="sm" style={styles.nameFields}>
                <FormControl isInvalid={!!errors.firstName} style={styles.halfInput}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="First Name"
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      </Input>
                    )}
                  />
                </FormControl>
                
                <FormControl isInvalid={!!errors.lastName} style={styles.halfInput}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input>
                        <InputField
                          placeholder="Last Name"
                          value={value || ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      </Input>
                    )}
                  />
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
                        placeholder="Email"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="email-address"
                        autoCapitalize="none"
                      />
                    </Input>
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.email?.message}</FormControlErrorText>
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
                  <FormControlErrorText>{errors.phone_number?.message}</FormControlErrorText>
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
                      value={value} 
                      onChange={onChange} 
                      items={genderOptions}
                      isInvalid={!!errors.gender}
                    />
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.gender?.message}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
              
              {/* Date of Birth - Using the same DateInput component as registration */}
              <FormControl isInvalid={!!errors.date_of_birth}>
                <Controller
                  name="date_of_birth"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <DateInput 
                      onChange={onChange} 
                      onBlur={onBlur} 
                      value={value}
                    />
                  )}
                />
                <FormControlError>
                  <FormControlErrorText>{errors.date_of_birth?.message}</FormControlErrorText>
                  <FormControlErrorIcon as={AlertTriangle} />
                </FormControlError>
              </FormControl>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Password section */}
            <Heading size="md" style={styles.sectionTitle}>Change Password</Heading>
            <VStack space="md">
              <FormControl isInvalid={!!errors.password}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="New Password"
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                      />
                    </Input>
                  )}
                />
              </FormControl>
              
              <FormControl isInvalid={!!errors.confirmPassword}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input>
                      <InputField
                        placeholder="Confirm New Password"
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry
                      />
                    </Input>
                  )}
                />
              </FormControl>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Allergies section - Using the same Chips component as registration */}
            <Heading size="md" style={styles.sectionTitle}>Medical Information</Heading>
            <Text style={styles.sectionDescription}>List any allergies or medical conditions that emergency responders should know about.</Text>
            
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
                    setSelectedValues={(selectedValues) => {
                      console.log("Selected allergies:", selectedValues);
                      onChange(selectedValues);
                    }}
                  />
                )}
              />
              <FormControlError>
                <FormControlErrorText>{errors.allergies?.message}</FormControlErrorText>
                <FormControlErrorIcon as={AlertTriangle} />
              </FormControlError>
            </FormControl>
            
            <Divider style={styles.divider} />
            
            {/* Emergency contacts section - Using similar structure to registration step-4 */}
            <View style={styles.emergencyContactsHeader}>
              <Heading size="md">Emergency Contacts</Heading>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addEmergencyContact}
              >
                <Text style={styles.addButtonText}>+ Add</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.sectionDescription}>People to contact in case of emergency.</Text>
            
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
                            placeholder="Contact Name"
                            value={value || ''}
                            onChangeText={(text) => {
                              console.log(`Setting emergency contact ${index} name to:`, text);
                              onChange(text);
                            }}
                            onBlur={onBlur}
                          />
                        </Input>
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>{errors?.emergencyContacts?.[index]?.name?.message}</FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  <FormControl isInvalid={!!errors?.emergencyContacts?.[index]?.phone} style={{ marginTop: 8 }}>
                    <Controller
                      name={`emergencyContacts.${index}.phone`}
                      control={control}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <PhoneNumberInput 
                          onChange={(text) => {
                            console.log(`Setting emergency contact ${index} phone to:`, text);
                            onChange(text);
                          }}
                          onBlur={onBlur} 
                          value={value || ''}
                          isInvalid={!!errors?.emergencyContacts?.[index]?.phone}
                        />
                      )}
                    />
                    <FormControlError>
                      <FormControlErrorText>{errors?.emergencyContacts?.[index]?.phone?.message}</FormControlErrorText>
                      <FormControlErrorIcon as={AlertTriangle} />
                    </FormControlError>
                  </FormControl>
                  
                  {watch('emergencyContacts')?.length > 1 && (
                    <TouchableOpacity 
                      style={styles.removeButton}
                      onPress={() => removeEmergencyContact(index)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
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
              <ButtonText>{isLoading ? 'Saving...' : 'Save Changes'}</ButtonText>
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 16,
  },
  logoutText: {
    color: '#AF3C3F',
    marginLeft: 8,
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
    color: '#AF3C3F',
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
  removeButtonText: {
    color: '#777',
    fontSize: 12,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#AF3C3F',
  },
});