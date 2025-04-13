import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Settings } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth as useAuthStore } from '@/stores/useAuth';

// Import UI components
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Divider } from "@/components/ui/divider";

// Post type definition
type Location = {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  }
};

type Contact = {
  phone?: string;
  email?: string;
  name?: string;
};

type Post = {
  userId: string;
  location: Location;
  description: string;
  expiryDate: Date;
  contact: Contact;
  image: string;
  serialNumber: string;
};

// Mock posts data - in a real app, this would be fetched from an API
const mockPosts: Post[] = [
  {
    userId: "user123",
    location: {
      address: "123 Main St, New York, NY",
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    description: "Used bicycle in great condition, almost new.",
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    contact: {
      phone: "+1 (555) 123-4567",
      email: "sarah.collins@example.com",
      name: "Sarah"
    },
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e",
    serialNumber: "BIKE-001"
  },
  {
    userId: "user123",
    location: {
      address: "456 Park Ave, New York, NY"
    },
    description: "Gaming console, like new. Comes with two controllers and three games.",
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    contact: {
      phone: "+1 (555) 123-4567",
      email: "sarah.collins@example.com"
    },
    image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42",
    serialNumber: "GAME-002"
  }
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, getUserInfo } = useAuth();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(!user);
  const [posts] = useState(mockPosts); // In a real app, fetch posts based on user ID
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

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determine if a post is expiring soon (within 3 days)
  const isExpiringSoon = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days <= 3 && days > 0;
  };

  // Function to get expiry date style based on condition
  const getExpiryDateStyle = (date: Date) => {
    return isExpiringSoon(date) 
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
        
        {/* User posts section */}
        <Box style={styles.postsContainer}>
          <Heading size="md" style={styles.sectionTitle}>My Posts</Heading>
          
          {posts.length === 0 ? (
            <Text style={styles.emptyState}>You haven't created any posts yet.</Text>
          ) : (
            <VStack space="md">
              {posts.map((post, index) => (
                <TouchableOpacity 
                  key={post.serialNumber}
                  style={styles.postCard}
                  onPress={() => console.log(`View post ${post.serialNumber}`)}
                >
                  <View style={styles.postContent}>
                    <View style={styles.postImageContainer}>
                      <Image 
                        source={{ uri: post.image }} 
                        style={styles.postImage} 
                        defaultSource={require('@/assets/images/no_image_icon.png')}
                      />
                    </View>
                    
                    <View style={styles.postDetails}>
                      <Text numberOfLines={2} bold style={styles.postDescription}>
                        {post.description}
                      </Text>
                      <Text size="sm" style={styles.postLocation}>
                        {post.location.address}
                      </Text>
                      <View style={styles.postFooter}>
                        <Text 
                          size="xs" 
                          style={getExpiryDateStyle(post.expiryDate)}
                        >
                          Expires: {formatDate(post.expiryDate)}
                        </Text>
                        <Text size="xs" style={styles.serialNumber}>
                          #{post.serialNumber}
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
    paddingTop: 60, // Increased to provide more space from the top
    paddingBottom: 24,
  },
  settingsButton: {
    position: 'absolute',
    top: 60, // Adjusted to match paddingTop for consistency
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
  postDetails: {
    flex: 1,
    justifyContent: 'space-between',
    minWidth: 0, // This ensures text will properly truncate
  },
  postDescription: {
    fontSize: 16,
    marginBottom: 4,
  },
  postLocation: {
    color: '#666',
    marginBottom: 8,
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
});