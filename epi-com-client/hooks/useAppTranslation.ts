import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { changeLanguage, isRTL } from '@/i18n';
import {UpdateUser} from "@/services/graphql/graphqlUserService";

export function useAppTranslation() {
  const { t, i18n } = useTranslation();
  
  const toggleLanguage = useCallback(async () => {
    const newLang = i18n.language === 'en' ? 'he' : 'en';
    await changeLanguage(newLang);
    await UpdateUser({language: newLang});

    return newLang;
  }, [i18n.language]);

  return {
    t,
    language: i18n.language as 'en' | 'he',
    isRtl: isRTL(),
    toggleLanguage
  };
}