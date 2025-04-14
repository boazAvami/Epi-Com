import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Settings } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth as useAuthStore } from '@/stores/useAuth';
import { getUserEpiPens } from '@/services/graphql/graphqlEpipenService';

// Import UI components
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

// EpiPen type definition
type EpiPen = {
  _id: string;
  userId: string;
  location: {
    type?: string;
    coordinates?: number[];
  };
  description: string;
  expiryDate: string;
  contact: {
    phone?: string;
    name?: string;
  };
  image?: string;
  serialNumber: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, getUserInfo } = useAuth();
  const { user, userId } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!user);
  const [epiPens, setEpiPens] = useState<EpiPen[]>([]);
  const [isLoadingEpiPens, setIsLoadingEpiPens] = useState(true);
  const insets = useSafeAreaInsets();

  // Fetch user data when component mounts if not already loaded
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          setIsLoading(true);
          await getUserInfo();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch user's EpiPens
  useEffect(() => {
    const fetchEpiPens = async () => {
      try {
        setIsLoadingEpiPens(true);
        
        // Get EpiPens using the getUserEpiPens function
        const response = await getUserEpiPens();

        if (response && response.epiPensByUser) {
          setEpiPens(response.epiPensByUser);
        } else {
          console.log("No EpiPensByUser property found in response:", response);
        }
      } catch (error) {
        console.error("Failed to fetch EpiPens:", error);
      } finally {
        setIsLoadingEpiPens(false);
      }
    };

    if (!isLoading) {
      fetchEpiPens();
    } else {
      console.log("Not fetching EpiPens yet. isLoading:", isLoading);
    }
  }, [isLoading]);

  // Format date for display with error handling
  const formatDate = (dateString: string) => {
    try {
      // Try to parse the date based on the format in the API response
      let date;
      
      // If it's a timestamp in milliseconds (as a string)
      if (typeof dateString === 'string' && !isNaN(Number(dateString))) {
        date = new Date(Number(dateString));
      } else {
        // Fallback to regular date parsing
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.log("Invalid date:", dateString);
        return "No expiry date";
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Invalid date";
    }
  };

  const isExpiringSoon = (dateString: string) => {
    try {
      let expiryDate;
      
      // If it's a timestamp in milliseconds (as a string)
      if (typeof dateString === 'string' && !isNaN(Number(dateString))) {
        expiryDate = new Date(Number(dateString));
      } else {
        // Fallback to regular date parsing
        expiryDate = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(expiryDate.getTime())) {
        return false;
      }
      
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      const days = diff / (1000 * 60 * 60 * 24);
      return days <= 3 && days > 0;
    } catch (error) {
      console.error("Error checking if date is expiring soon:", dateString, error);
      return false;
    }
  };

  // Function to get expiry date style based on condition
  const getExpiryDateStyle = (dateString: string) => {
    return isExpiringSoon(dateString) 
      ? { ...styles.expiryDate, ...styles.expiringSoon }
      : styles.expiryDate;
  };

  // Get user's display name
  const getDisplayName = () => {
    if (!user) return '';
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    return user.userName || user.email || '';
  };

  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return '';
    if (user.firstName) return user.firstName.charAt(0);
    if (user.userName) return user.userName.charAt(0);
    if (user.email) return user.email.charAt(0);
    return '';
  };

  // Function to get location address display - UPDATED to handle GeoJSON Point format
  const getLocationDisplay = (location: { type?: string; coordinates?: number[] }) => {
    if (location && location.type === "Point" && Array.isArray(location.coordinates) && location.coordinates.length >= 2) {
      // Display GeoJSON coordinates
      return `${location.coordinates[0].toFixed(4)}, ${location.coordinates[1].toFixed(4)}`;
    }
    
    // Fallback if location is in unexpected format
    return "Location not available";
  };

  // Function to get contact display
  const getContactDisplay = (contact: { phone?: string; name?: string }) => {
    return contact.name || contact.phone || 'No contact info';
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Center style={{ flex: 1 }}>
          <Text>Loading profile...</Text>
        </Center>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom }}>
        {/* Profile header section */}
        <View style={[styles.header, { paddingTop: Math.max(20, insets.top) }]}>
          <TouchableOpacity 
            style={[styles.settingsButton, { top: Math.max(20, insets.top) }]} 
            onPress={() => {
              console.log("Settings button pressed");
              router.push("/(tabs)/profile_settings");
            }}
          >
            <Icon as={Settings} size="lg" color="#333333" />
          </TouchableOpacity>
          
          <Center>
            <View style={styles.profileImageContainer}>
              {user?.profile_picture_uri ? (
                <Image 
                  source={{ uri: user.profile_picture_uri }} 
                  style={styles.profileImage} 
                />
              ) : (
                <View style={styles.defaultProfileImage}>
                  <Text size="xl" bold>
                    {getUserInitial()}
                  </Text>
                </View>
              )}
            </View>
            
            <VStack space="xs" style={{ alignItems: 'center', marginTop: 8 }}>
              <Heading size="lg">{getDisplayName()}</Heading>
              <Text>{user?.email}</Text>
              <Text>{user?.phone_number}</Text>
            </VStack>
          </Center>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* User EpiPens section */}
        <Box style={styles.postsContainer}>
          <Heading size="md" style={styles.sectionTitle}>My EpiPens</Heading>
          
          {isLoadingEpiPens ? (
            <Center style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="#0000ff" />
              <Text style={{ marginTop: 8 }}>Loading EpiPens...</Text>
            </Center>
          ) : epiPens.length === 0 ? (
            <Text style={styles.emptyState}>You haven't added any EpiPens yet.</Text>
          ) : (
            <VStack space="md">
              {epiPens.map((epiPen) => (
                <TouchableOpacity 
                  key={epiPen._id}
                  style={styles.postCard}
                  onPress={() => console.log(`View EpiPen ${epiPen._id}`)}
                >
                  <View style={styles.postContent}>
                    <View style={styles.postImageContainer}>
                      {epiPen.image ? (
                        <Image 
                          source={{ uri: epiPen.image }} 
                          style={styles.postImage} 
                        />
                      ) : (
                        <View style={styles.noImageContainer}>
                          <Text size="xs" style={styles.noImageText}>No Image</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.postDetails}>
                      <Text numberOfLines={2} bold style={styles.postDescription}>
                        {epiPen.description}
                      </Text>
                      <Text size="sm" style={styles.postLocation}>
                        {getLocationDisplay(epiPen.location)}
                      </Text>
                      <Text size="sm" style={styles.contactInfo}>
                        Contact: {getContactDisplay(epiPen.contact)}
                      </Text>
                      <View style={styles.postFooter}>
                        <Text 
                          size="xs" 
                          style={getExpiryDateStyle(epiPen.expiryDate)}
                        >
                          Expires: {formatDate(epiPen.expiryDate)}
                        </Text>
                        <Text size="xs" style={styles.serialNumber}>
                          #{epiPen.serialNumber}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </VStack>
          )}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    position: 'relative',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  profileImageContainer: {
    marginBottom: 16,
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
  divider: {
    marginVertical: 16,
  },
  postsContainer: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  emptyState: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postContent: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  postImageContainer: {
    marginRight: 12,
  },
  postImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    resizeMode: 'cover',
  },
  noImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    color: '#999',
  },
  postDetails: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0,
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  postLocation: {
    color: '#666',
    marginBottom: 4,
  },
  contactInfo: {
    color: '#666',
    marginBottom: 4,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expiryDate: {
    color: '#666',
  },
  expiringSoon: {
    color: '#e74c3c',
  },
  serialNumber: {
    color: '#999',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});