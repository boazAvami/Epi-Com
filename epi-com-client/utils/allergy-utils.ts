import { EAllergy } from '@shared/types';
import { ChipItem } from '@/components/Chip';

/**
 * Formats an allergy key from camelCase to a readable format with spaces
 * @param allergyKey The enum key to format
 * @returns Formatted string with spaces
 */
export const formatAllergyName = (allergyKey: string): string => {
  return allergyKey.replace(/([a-z])([A-Z])/g, '$1 $2');
};

/**
 * Converts the EAllergy enum to an array of ChipItem objects
 * @param isRtl Whether the current language is RTL (Hebrew)
 * @returns Array of ChipItem objects for the Chips component
 */
export const getAllergyItems = (isRtl: boolean): ChipItem[] => {
  return Object.entries(EAllergy).map(([key, value]) => ({
    label: isRtl ? value : formatAllergyName(key),
    value: value
  }));
}; 