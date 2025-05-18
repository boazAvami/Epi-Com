import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { Globe } from 'lucide-react-native';
import { colors } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  onLogout?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { t, language, toggleLanguage } = useAppTranslation();
  const insets = useSafeAreaInsets();
  
  // Get the appropriate title based on the current page
  const headerTitle = title || t('app.title');
  
  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        {/* Language Toggle Button */}
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={toggleLanguage}
            accessibilityLabel={language === 'en' ? 'Switch to Hebrew' : 'Switch to English'}
          >
            <Globe size={16} color="#FF2D55" style={styles.languageIcon} />
            <Text style={styles.languageText}>
              {language === 'en' ? 'EN' : 'עב'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Title */}
        <View style={styles.titleContainer}>
          <Heading 
            size="lg" 
            style={[
              styles.headerTitle,
              language === 'he' && styles.rtlTitle
            ]}
          >
            {headerTitle}
          </Heading>
        </View>
        
        {/* Right side - empty for balance */}
        <View style={styles.rightContainer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 50,
  },
  leftContainer: {
    width: 70,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FF2D55',
    fontSize: 22,
    textAlign: 'center',
  },
  rtlTitle: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  rightContainer: {
    width: 70,
    alignItems: 'flex-end',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#FF2D55',
  },
  languageIcon: {
    marginRight: 4,
  },
  languageText: {
    fontSize: 14,
    color: '#FF2D55',
    fontWeight: '500',
  },
});

export default Header;