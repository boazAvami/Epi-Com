import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import he from './locales/he.json';
import dayjs from "dayjs";

const LANGUAGES = {
  en: {
    translation: en
  },
  he: {
    translation: he
  }
};

// Language detector to use AsyncStorage and device settings
const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // Try to get stored language
      const storedLanguage = await AsyncStorage.getItem('language');
      if (storedLanguage && ['en', 'he'].includes(storedLanguage)) {
        dayjs.locale(storedLanguage);
        return callback(storedLanguage);
      }
      
      // Fall back to device locale
    //   const locale = RNLocalize.findBestAvailableLanguage(Object.keys(LANGUAGES));
    //   callback(locale?.languageTag || 'en');
    } catch (error) {
      console.error('Error detecting language:', error);
      dayjs.locale('en');
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('language', language);
      
      // Set RTL for Hebrew
      const isRTL = language === 'he';
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
    } catch (error) {
      console.error('Error caching language:', error);
    }
  }
};

// Initialize i18next
i18n
  .use(LANGUAGE_DETECTOR as any)
  .use(initReactI18next)
  .init({
    resources: LANGUAGES,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false 
    },
    react: {
      useSuspense: false 
    }
  });

export const changeLanguage = async (language: 'en' | 'he') => {
  await i18n.changeLanguage(language);
  dayjs.locale(language);
};

export const isRTL = () => {
  return i18n.language === 'he';
};

export default i18n;