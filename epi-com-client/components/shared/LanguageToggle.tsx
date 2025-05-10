import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { colors } from '@/constants/Colors';

interface LanguageToggleProps {
    style?: object;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({ style }) => {
    const { language, toggleLanguage } = useAppTranslation();

    return (
        <TouchableOpacity 
            style={[styles.button, style]} 
            onPress={toggleLanguage}
        >
            <Text style={styles.text}>
                {language === 'en' ? 'עב' : 'EN'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.backgroundMedium,
        borderRadius: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textDark,
    }
});

export default LanguageToggle; 