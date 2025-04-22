import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import { useAuth } from '@/context/authContext';
import { useAuth as useAuthStore } from '@/stores/useAuth';
import { SafeAreaView as SafeAreaContext, useSafeAreaInsets } from 'react-native-safe-area-context';

// Import UI components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Divider } from '@/components/ui/divider';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Send, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { colors } from '../../constants/Colors';

// Define message type
type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
};

const ChatScreen = () => {
  const insets = useSafeAreaInsets();
  const { getUserInfo } = useAuth();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  
  // Fetch user data when component mounts if not already loaded
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user) {
          await getUserInfo();
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);
  
  // Mock data for messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today with questions about allergies and EpiPens?',
      timestamp: new Date(Date.now() - 3600000),
      sender: 'assistant'
    },
    {
      id: '2',
      text: 'I need information about how to use an EpiPen.',
      timestamp: new Date(Date.now() - 3000000),
      sender: 'user'
    },
    {
      id: '3',
      text: 'To use an EpiPen, remove the blue safety cap, then firmly push the orange tip against your outer thigh until you hear a click. Hold for 3 seconds. Call emergency services after use.',
      timestamp: new Date(Date.now() - 2400000),
      sender: 'assistant'
    },
    {
      id: '4',
      text: 'What are the common side effects after using it?',
      timestamp: new Date(Date.now() - 1800000),
      sender: 'user'
    },
    {
      id: '5', 
      text: 'Common side effects after using an EpiPen include increased heart rate, dizziness, anxiety, headache, and tremors. These are normal responses to epinephrine and typically subside within 20 minutes.',
      timestamp: new Date(Date.now() - 1200000),
      sender: 'assistant'
    }
  ]);
  
  // Extract sent and received messages
  const sentMessages = messages.filter(msg => msg.sender === 'user');
  const receivedMessages = messages.filter(msg => msg.sender === 'assistant');
  
  // Check if message limit is reached
  const isLimitReached = sentMessages.length >= 10;

  // Send message function
  const handleSendMessage = () => {
    if (inputText.trim() === '' || isLimitReached) return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date(),
      sender: 'user'
    };
    
    setMessages([...messages, newUserMessage]);
    setInputText('');
    
    // Check if limit is now reached
    if (sentMessages.length === 9) {
      setShowLimitWarning(true);
    }
    
    // Mock assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your question. I've noted your inquiry and will respond accordingly.",
        timestamp: new Date(),
        sender: 'assistant'
      };
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
    }, 1000);
  };
  
  // Reset session function
  const resetSession = () => {
    setMessages([
      {
        id: 'welcome',
        text: 'Hello! How can I help you today with questions about allergies and EpiPens?',
        timestamp: new Date(),
        sender: 'assistant'
      }
    ]);
    setShowLimitWarning(false);
  };
  
  // Get user's initial for avatar
  const getUserInitial = () => {
    if (!user) return '';
    if (user.firstName) return user.firstName.charAt(0);
    if (user.userName) return user.userName.charAt(0);
    if (user.email) return user.email.charAt(0);
    return '';
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          // @ts-ignore
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);
  
  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header - Modified to keep title centered and reset button on the right */}
      <Box style={styles.header}>
        <View style={styles.headerLeft}>
          {/* Empty view for layout balance */}
          <View style={{ width: 80 }} />
        </View>
        
        <Heading size="lg" style={styles.headerTitle}>
          EpiPen Assistant
        </Heading>
        
        <View style={styles.headerRight}>
          <Button onPress={resetSession} variant="solid" size="sm" action="primary" style={styles.resetButton}>
            <ButtonIcon as={RefreshCw} />
            <ButtonText>Reset</ButtonText>
          </Button>
        </View>
      </Box>
      
      {/* Medical Disclaimer - Shortened */}
      <Alert action="warning" variant="outline" style={styles.disclaimer}>
        <AlertIcon as={AlertTriangle} size="sm" />
        <View style={{ flex: 1 }}>
          <AlertText style={{ flexShrink: 1 }}>
          This chat isn't a substitute for professional medical advice. 
          In case of emergency, please consult a healthcare provider.
          </AlertText>
        </View>
      </Alert>
      
      {/* Session Limit Warning */}
      {showLimitWarning && (
        <Alert action="error" style={styles.limitWarning}>
          <View style={{ flex: 1 }}>
            <AlertText style={{ flexShrink: 1 }}>
              You have reached the session limit of 10 messages. Please reset the session to continue.
            </AlertText>
          </View>
        </Alert>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 1 : 20}
      >
        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message, index) => (
            <View 
              key={message.id} 
              style={[
                styles.messageRow, 
                message.sender === 'user' ? styles.userMessageRow : styles.assistantMessageRow
              ]}
            >
              {message.sender === 'assistant' && (
                <Avatar size="sm" style={styles.avatar}>
                  <AvatarFallbackText>EP</AvatarFallbackText>
                </Avatar>
              )}
              
              <Card 
                variant={message.sender === 'user' ? 'filled' : 'outline'}
                style={[
                  styles.messageCard,
                  message.sender === 'user' ? styles.userMessage : styles.assistantMessage
                ]}
              >
                <Text>{message.text}</Text>
                <Text size="xs" style={styles.timestamp}>
                  {formatTime(message.timestamp)}
                </Text>
              </Card>
              
              {message.sender === 'user' && (
                <Avatar size="sm" style={styles.avatar}>
                  {user?.profile_picture_uri ? (
                    <AvatarImage 
                      source={{ uri: user.profile_picture_uri }} 
                    />
                  ) : (
                    <AvatarFallbackText>
                      {getUserInitial()}
                    </AvatarFallbackText>
                  )}
                </Avatar>
              )}
            </View>
          ))}
        </ScrollView>

        {/* Input Area with Messages Counter included */}
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message here..."
              placeholderTextColor="#999"
              multiline={false}
              maxLength={500}
              editable={!isLimitReached}
            />
            <TouchableOpacity 
              style={[styles.sendButton, isLimitReached && styles.disabledButton]} 
              onPress={handleSendMessage}
              disabled={isLimitReached || inputText.trim() === ''}
            >
              <Send color={isLimitReached ? "#999" : colors.primary} size={24} />
            </TouchableOpacity>
          </View>
          
          {/* Message counter below input field - visible while typing */}
          <View style={styles.inputCounterContainer}>
            <Badge action="info" size="sm">
              <BadgeText>{10 - sentMessages.length} messages remaining</BadgeText>
            </Badge>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* Session Info - Now hidden as it's redundant */}
      {/* <Box style={styles.sessionInfo}>
        <Badge action="info" size="sm">
          <BadgeText>{10 - sentMessages.length} messages remaining</BadgeText>
        </Badge>
      </Box> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  headerLeft: {
    width: 80,
  },
  headerTitle: {
    color: colors.primary,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  resetButton: {
    paddingHorizontal: 8,
  },
  disclaimer: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  limitWarning: {
    margin: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  assistantMessageRow: {
    justifyContent: 'flex-start',
  },
  messageCard: {
    maxWidth: '75%',
    minWidth: 60,
    padding: 12,
    marginHorizontal: 4,
  },
  userMessage: {
    backgroundColor: '#f0f0f0',
    borderColor: '#e1e4e8',
  },
  assistantMessage: {
    backgroundColor: '#ffffff',
    borderColor: '#e1e4e8',
  },
  avatar: {
    marginBottom: 4,
  },
  timestamp: {
    alignSelf: 'flex-end',
    color: '#999',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    height: 60, // Slightly reduced height
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space between input and button
  },
  inputCounterContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 8,
    paddingTop: 4,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  textInput: {
    flex: 1,
    height: 40, // Fixed height for better centering
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'center', // Center text vertically
    fontSize: 16, // Consistent font size
    lineHeight: 20, // Help with text alignment
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#e1e4e8',
  },
  sessionInfo: {
    padding: 8,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
});

export default ChatScreen;