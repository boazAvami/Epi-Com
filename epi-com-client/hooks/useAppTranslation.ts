import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { I18nManager } from 'react-native';
import { changeLanguage, isRTL } from '../i18n';

export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = useCallback(async () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    await changeLanguage(newLang);

    return newLang;
  }, [i18n.language]);

  return {
    t,
    language: i18n.language as 'en' | 'he',
    isRtl: isRTL(),
    toggleLanguage
  };
}