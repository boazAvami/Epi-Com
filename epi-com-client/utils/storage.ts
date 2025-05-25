import AsyncStorage from '@react-native-async-storage/async-storage';
import { EpipenMarker, Language } from '../types';

// Storage keys
const STORAGE_KEYS = {
  MARKERS: 'customMarkers',
  LANGUAGE: 'language'
};

/**
 * Load saved EpiPen markers from storage
 */
export async function loadMarkers(): Promise<EpipenMarker[]> {
  try {
    const savedMarkers = await AsyncStorage.getItem(STORAGE_KEYS.MARKERS);
    if (savedMarkers) {
      return JSON.parse(savedMarkers);
    }
    return [];
  } catch (error) {
    console.error('Error loading markers:', error);
    return [];
  }
}

/**
 * Save EpiPen markers to storage
 */
export async function saveMarkers(markers: EpipenMarker[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MARKERS, JSON.stringify(markers));
  } catch (error) {
    console.error('Error saving markers:', error);
  }
}

/**
 * Load saved language preference
 */
export async function loadLanguage(): Promise<Language | null> {
  try {
    const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language | null;
    return savedLanguage;
  } catch (error) {
    console.error('Error loading language:', error);
    return null;
  }
}

/**
 * Save language preference
 */
export async function saveLanguage(language: Language): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
}