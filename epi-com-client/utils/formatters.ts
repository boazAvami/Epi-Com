/**
 * Format a date string to MM/YYYY format
 * @param dateString ISO date string or MM/YYYY string
 * @param locale Locale string (e.g. 'en-US', 'he-IL') - used only for fallback formatting
 * @returns Formatted date string in MM/YYYY format
 */
export function formatDate(dateString: string, locale: string): string {
  // Check if the date is already in MM/YYYY format
  if (/^\d{2}\/\d{4}$/.test(dateString)) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    // Format as MM/YYYY
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${year}`;
  } catch (e) {
    // Fallback to the original format if parsing fails
    return dateString;
  }
}
  
/**
 * Convert language code to locale string
 */
export function languageToLocale(language: 'en' | 'he'): string {
  return language === 'en' ? 'en-US' : 'he-IL';
}