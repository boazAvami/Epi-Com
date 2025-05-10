import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';
import { colors } from '../../constants/Colors';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { t, language, toggleLanguage } = useAppTranslation();
  
  return (
    <Center style={styles.header}>
      <Heading size="lg" style={styles.headerTitle}>
        {t('app.title')}
      </Heading>
      
      <View style={styles.headerButtons}>
        {/* Logout Button */}
        {onLogout && (
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={onLogout}
            accessibilityLabel={t('buttons.logout')}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.textDark} />
          </TouchableOpacity>
        )}
        
        {/* Language Toggle Button */}
        <TouchableOpacity 
          style={styles.languageButton} 
          onPress={toggleLanguage}
        >
          <Text style={styles.languageButtonText}>
            {language === 'en' ? 'עב' : 'EN'}
          </Text>
        </TouchableOpacity>
      </View>
    </Center>
  );
};