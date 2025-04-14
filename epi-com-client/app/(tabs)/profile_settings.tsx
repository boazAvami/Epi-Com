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
import { EGender } from '@shared/types';
import { RegisterData } from '@/shared/types/register-data.type';

// Import UI components
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectItem, SelectContent } from "@/components/ui/select";

// Types
interface EmergencyContact {
  name: string;
  phone: string;
}

export default function ProfileSettingsScreen() {
  const router = useRouter();
  const { getUserInfo, logout } = useAuth(); // Get logout from context
  const { user, refreshToken } = useAuthStore(); // Get refreshToken from auth store
  const [isLoading, setIsLoading] = useState(!user);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Form state management - these will be initialized once user data is loaded
  const [userName, setUserName] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [allergies, setAllergies] = useState<string>('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  
  // Fetch user data and initialize form state
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          await getUserInfo();
        } else {
          // Initialize form fields with user data
          initializeFormFields();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Initialize form fields from user data
  const initializeFormFields = () => {
    if (!user) return;
    
    setUserName(user.userName || '');
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setEmail(user.email || '');
    setPhoneNumber(user.phone_number || '');
    setGender(user.gender || '');
    
    // Handle date of birth (convert string to Date if needed)
    if (user.date_of_birth) {
      const dob = typeof user.date_of_birth === 'string' 
        ? new Date(user.date_of_birth)
        : user.date_of_birth;
      setDateOfBirth(dob);
    } else {
      setDateOfBirth(undefined);
    }
    
    // Handle allergies (convert array to comma-separated string)
    if (Array.isArray(user.allergies)) {
      setAllergies(user.allergies.join(', '));
    }
    
    // Handle emergency contacts
    if (Array.isArray(user.emergencyContacts)) {
      setEmergencyContacts([...user.emergencyContacts]);
    } else {
      setEmergencyContacts([]);
    }
  };
  
  // Add emergency contact
  const addEmergencyContact = (): void => {
    setEmergencyContacts([...emergencyContacts, { name: "", phone: "" }]);
  };
  
  // Update emergency contact
  const updateEmergencyContact = (index: number, field: keyof EmergencyContact, value: string): void => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts[index][field] = value;
    setEmergencyContacts(updatedContacts);
  };
  
  // Remove emergency contact
  const removeEmergencyContact = (index: number): void => {
    const updatedContacts = [...emergencyContacts];
    updatedContacts.splice(index, 1);
    setEmergencyContacts(updatedContacts);
  };
  
  // Handle logout
  const handleLogout = async (): Promise<void> => {
    if (!refreshToken) {
      Alert.alert("Error", "No refresh token found.");
      return;
    }
    
    try {
      setIsLoggingOut(true);
      // Call the API logout function
      await logout();
      // Navigate to login screen
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  // Handle form submission
  const handleSave = async (): Promise<void> => {
    // Validate form
    if (!userName || !email) {
      Alert.alert("Error", "Username and email are required.");
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    
    // Check if any changes were made
    if (!user) return;
    
    const hasChanges = 
      userName !== user.userName ||
      firstName !== (user.firstName || '') ||
      lastName !== (user.lastName || '') ||
      email !== user.email ||
      phoneNumber !== (user.phone_number || '') ||
      gender !== (user.gender || '') ||
      (dateOfBirth?.toISOString() !== (user.date_of_birth ? new Date(user.date_of_birth).toISOString() : undefined)) ||
      allergies !== (Array.isArray(user.allergies) ? user.allergies.join(', ') : '') ||
      JSON.stringify(emergencyContacts) !== JSON.stringify(user.emergencyContacts || []);
    
    // If no changes, show message and return
    if (!hasChanges) {
      Alert.alert("Info", "No changes detected.", [
        { text: "OK", onPress: () => router.push("/(tabs)/profile") }
      ]);
      return;
    }
    
    // Prepare data for update
    const updatedUserData: Partial<RegisterData> = {
      userName,
      firstName: firstName.trim() === '' ? null : firstName,
      lastName: lastName.trim() === '' ? null : lastName,
      email,
      phone_number: phoneNumber.trim() === '' ? null : phoneNumber,
      gender: gender as EGender || null,
      date_of_birth: dateOfBirth || null,
      allergies: allergies.split(",").map(item => item.trim()).filter(item => item),
      emergencyContacts: emergencyContacts.length > 0 ? emergencyContacts : null
    };
    
    try {
      setIsLoading(true);
      
      // Call the UpdateUser function
      await UpdateUser(updatedUserData);
      
      // Refresh the user data in the store
      await getUserInfo();
      
      // Show success message
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
              {user?.profile_picture_uri ? (
                <Image 
                  source={{ uri: user.profile_picture_uri }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text size="xl" bold>
                    {firstName && lastName 
                      ? firstName.charAt(0) + lastName.charAt(0)
                      : userName.charAt(0)}
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
                if (isLoggingOut) return; // Prevent multiple triggers
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
              <Input>
                <InputField
                  placeholder="Username"
                  value={userName}
                  onChangeText={setUserName}
                />
              </Input>
              
              <HStack space="sm" style={styles.nameFields}>
                <Input style={styles.halfInput}>
                  <InputField
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </Input>
                <Input style={styles.halfInput}>
                  <InputField
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </Input>
              </HStack>
              
              <Input>
                <InputField
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Input>
              
              <Input>
                <InputField
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </Input>
              
              {/* Gender Selection */}
              <Select
                selectedValue={gender}
                onValueChange={(value: string) => setGender(value)}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select Gender" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectItem label="Male" value={EGender.MALE} />
                    <SelectItem label="Female" value={EGender.FEMALE} />
                    <SelectItem label="Other" value={EGender.OTHER} />
                    <SelectItem label="Prefer not to say" value={EGender.OTHER} />
                  </SelectContent>
                </SelectPortal>
              </Select>
              
              {/* Date of Birth */}
              <FormControl>
                <DateInput 
                  onChange={(date) => setDateOfBirth(date)} 
                  onBlur={() => {}} 
                  value={dateOfBirth}
                />
              </FormControl>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Password section */}
            <Heading size="md" style={styles.sectionTitle}>Change Password</Heading>
            <VStack space="md">
              <Input>
                <InputField
                  placeholder="New Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </Input>
              <Input>
                <InputField
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </Input>
            </VStack>
            
            <Divider style={styles.divider} />
            
            {/* Allergies section */}
            <Heading size="md" style={styles.sectionTitle}>Medical Information</Heading>
            <Text style={styles.sectionDescription}>List any allergies or medical conditions that emergency responders should know about.</Text>
            <Input style={styles.allergiesInput}>
              <InputField
                placeholder="Allergies (separate with commas)"
                value={allergies}
                onChangeText={setAllergies}
                multiline
              />
            </Input>
            
            <Divider style={styles.divider} />
            
            {/* Emergency contacts section */}
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
              {emergencyContacts.map((contact, index) => (
                <View key={index} style={styles.emergencyContactItem}>
                  <HStack space="sm" style={styles.contactFields}>
                    <Input style={styles.contactNameInput}>
                      <InputField
                        placeholder="Contact Name"
                        value={contact.name}
                        onChangeText={(value: string) => updateEmergencyContact(index, 'name', value)}
                      />
                    </Input>
                    <Input style={styles.contactPhoneInput}>
                      <InputField
                        placeholder="Phone Number"
                        value={contact.phone}
                        onChangeText={(value: string) => updateEmergencyContact(index, 'phone', value)}
                        keyboardType="phone-pad"
                      />
                    </Input>
                  </HStack>
                  {emergencyContacts.length > 1 && (
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
            <Button style={styles.saveButton} onPress={handleSave}>
              <ButtonText>Save Changes</ButtonText>
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
  allergiesInput: {
    marginTop: 8,
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
    marginBottom: 12,
  },
  contactFields: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactNameInput: {
    flex: 0.55,
  },
  contactPhoneInput: {
    flex: 0.45,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
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