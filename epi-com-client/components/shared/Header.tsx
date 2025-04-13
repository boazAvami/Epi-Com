import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Center } from '@/components/ui/center';
import { Heading } from '@/components/ui/heading';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import styles from './styles';

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
      
      {/*TODO : move this to settings screen as soon*/}
      {/* Language Toggle Button */}
      <TouchableOpacity 
        style={styles.languageButton} 
        onPress={toggleLanguage}
      >
        <Text style={styles.languageButtonText}>
          {language === 'en' ? 'עב' : 'EN'}
        </Text>
      </TouchableOpacity>
    </Center>
  );
};