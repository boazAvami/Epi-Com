import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/authContext';
import { useAuth as useAuthStore } from '@/stores/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import UI components
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Alert, AlertText, AlertIcon } from '@/components/ui/alert';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Avatar, AvatarFallbackText, AvatarImage } from '@/components/ui/avatar';
import { Send, RefreshCw, AlertTriangle } from 'lucide-react-native';
import { colors } from '../../constants/Colors';
import { Header } from '../../components/shared/Header';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { chatbotService } from '../../services/graphql/graphqlChatbotService';

// Define message type
type Message = {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
};

// Define User type
type User = {
  firstName?: string;
  userName?: string;
  email?: string;
  profile_picture_uri?: string;
};

const ChatScreen: React.FC = () => {
  const { getUserInfo } = useAuth();
  const { user } = useAuthStore();
  const [inputText, setInputText] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);
  const [showLimitWarning, setShowLimitWarning] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Get language from translation hook
  const { language } = useAppTranslation();
  
  // Initialize with just the welcome message
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you today with questions about allergies and EpiPens?',
      timestamp: new Date(),
      sender: 'assistant'
    }
  ]);
  
  // Keep track of conversation history for the API
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  
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
  
  // Extract sent and received messages
  const sentMessages = messages.filter(msg => msg.sender === 'user');
  const receivedMessages = messages.filter(msg => msg.sender === 'assistant');
  
  // Check if message limit is reached
  const isLimitReached = sentMessages.length >= 10;

  // Send message function
  const handleSendMessage = async () => {
    if (inputText.trim() === '' || isLimitReached || isLoading) return;
    
    setIsLoading(true);
    
    // Create new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date(),
      sender: 'user'
    };
    
    // Add user message to UI
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    
    // Update conversation history
    const updatedHistory = [...conversationHistory, inputText];
    setConversationHistory(updatedHistory);
    
    // Clear input
    setInputText('');
    
    // Check if limit is now reached
    if (sentMessages.length === 9) {
      setShowLimitWarning(true);
    }
    
    try {
      // Call the chatbot service
      const response = await chatbotService.queryAllergies(updatedHistory);
      
      // Create assistant response message
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        timestamp: new Date(),
        sender: 'assistant'
      };
      
      // Add assistant response to UI
      setMessages(prevMessages => [...prevMessages, assistantResponse]);
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      
      // Create error response message
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again later.",
        timestamp: new Date(),
        sender: 'assistant'
      };
      
      // Add error response to UI
      setMessages(prevMessages => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset session function with animation effect
  const resetSession = () => {
    setIsResetting(true);
    
    // Add animation delay before resetting messages
    setTimeout(() => {
      setMessages([
        {
          id: 'welcome',
          text: 'Hello! How can I help you today with questions about allergies and EpiPens?',
          timestamp: new Date(),
          sender: 'assistant'
        }
      ]);
      setConversationHistory([]);
      setShowLimitWarning(false);
      setIsResetting(false);
    }, 800);
  };
  
  // Get user's initial for avatar
  const getUserInitial = (): string => {
    if (!user) return '';
    if (user.firstName) return user.firstName.charAt(0);
    if (user.userName) return user.userName.charAt(0);
    if (user.email) return user.email.charAt(0);
    return '';
  };
  
  // Format timestamp
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }
  }, [messages]);
  
  return (
    <SafeAreaView style={styles.safeArea} edges={['right', 'left']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Using the Header component for the title */}
      <View style={styles.headerContainer}>
        <Header 
          title={language === 'en' ? 'EpiPen Assistant' : 'מסייע אפיפן'} 
        />
        
        {/* Reset Button - icon only without borders */}
        <View style={styles.resetButtonContainer}>
          <TouchableOpacity 
            onPress={resetSession} 
            style={[
              styles.resetButton,
              isResetting && styles.resetButtonAnimated
            ]}
          >
            <RefreshCw 
              color="#0CB7F2" 
              size={22}
              style={[
                isResetting && styles.rotatingIcon
              ]} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Medical Disclaimer - Shortened */}
      <Alert action="warning" variant="outline" style={styles.disclaimer}>
        <AlertIcon as={AlertTriangle} size="sm" />
        <View style={{ flex: 1 }}>
          <AlertText style={[{ flexShrink: 1 }, language === 'he' && styles.rtlText]}>
            {language === 'en' 
              ? 'For informational purposes only. Not a substitute for medical advice. Call emergency services in case of emergency.'
              : 'למטרות מידע בלבד. לא תחליף לייעוץ רפואי. במקרה חירום, התקשר לשירותי חירום.'}
          </AlertText>
        </View>
      </Alert>
      
      {/* Session Limit Warning */}
      {showLimitWarning && (
        <Alert action="error" style={styles.limitWarning}>
          <View style={{ flex: 1 }}>
            <AlertText style={[{ flexShrink: 1 }, language === 'he' && styles.rtlText]}>
              {language === 'en'
                ? 'You have reached the session limit of 10 messages. Please reset the session to continue.'
                : 'הגעת למגבלת ההודעות. אנא אפס את השיחה כדי להמשיך.'}
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
          {messages.map((message) => (
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
                <Text style={language === 'he' && styles.rtlText}>{message.text}</Text>
                <Text size="xs" style={[styles.timestamp, language === 'he' && styles.rtlText]}>
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
          
          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>
                {language === 'en' ? 'Assistant is typing...' : 'המסייע מקליד...'}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area with Messages Counter included */}
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.textInput, language === 'he' && styles.rtlInput]}
              value={inputText}
              onChangeText={setInputText}
              placeholder={language === 'en' ? 'Type your message here...' : 'הקלד את ההודעה שלך כאן...'}
              placeholderTextColor="#999"
              multiline={false}
              maxLength={500}
              editable={!isLimitReached && !isLoading}
              textAlign={language === 'he' ? 'right' : 'left'}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton, 
                (isLimitReached || isLoading || inputText.trim() === '') && styles.disabledButton
              ]} 
              onPress={handleSendMessage}
              disabled={isLimitReached || isLoading || inputText.trim() === ''}
            >
              <Send color={(isLimitReached || isLoading || inputText.trim() === '') ? "#999" : '#FF2D55'} size={24} />
            </TouchableOpacity>
          </View>
          
          {/* Message counter below input field - MODIFIED: added padding at the bottom */}
          <View style={styles.inputCounterContainer}>
            <Badge action="info" size="sm" style={styles.counterBadge}>
              <BadgeText style={language === 'he' && styles.rtlText}>
                {10 - sentMessages.length} {language === 'en' ? 'messages remaining' : 'הודעות נותרו'}
              </BadgeText>
            </Badge>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    position: 'relative',
    zIndex: 1,
  },
  resetButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 16,
    right: 14,
    zIndex: 10,
  },
  resetButton: {
    // Adjusted: smaller size, better positioned
    padding: 6,
    borderRadius: 40,
    width: 40, // Smaller circle width
    height: 40, // Smaller circle height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // No background
  },
  resetButtonPressed: {
    backgroundColor: '#D0EFF6', 
    transform: [{ scale: 0.98 }],
  },
  resetButtonAnimated: {
    backgroundColor: '#E6F7FB',
  },
  resetIcon: {
    marginRight: 6,
    color: '#0CB7F2',
  },
  rotatingIcon: {
    transform: [{ rotate: '180deg' }],
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  rtlInput: {
    textAlign: 'right',
    writingDirection: 'rtl',
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
    height: 60,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputCounterContainer: {
    backgroundColor: '#ffffff',
    // MODIFIED: further increased bottom padding
    paddingBottom: 24,
    paddingTop: 8,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  counterBadge: {
    // MODIFIED: added more padding for the counter badge
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6, // Additional spacing at the bottom
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    textAlignVertical: 'center',
    fontSize: 16,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: '#e1e4e8',
  },
  loadingContainer: {
    padding: 8,
    alignItems: 'center',
  },
  loadingText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ChatScreen;