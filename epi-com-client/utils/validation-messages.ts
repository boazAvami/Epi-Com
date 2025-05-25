import i18n from '../i18n';

export const getValidationMessage = (key: string) => {
  // Handle direct keys (backward compatibility)
  if (key.startsWith('validation.')) {
    return i18n.t(key);
  }
  
  // Try first with register prefix
  const registerKey = `validation.register.${key}`;
  let message = i18n.t(registerKey);
  
  // If not found with register prefix, try direct validation prefix
  if (message === registerKey) {
    const validationKey = `validation.${key}`;
    message = i18n.t(validationKey);
    
    // If still not found, return with direct key
    if (message === validationKey) {
      return i18n.t(key);
    }
  }
  
  return message;
}; 