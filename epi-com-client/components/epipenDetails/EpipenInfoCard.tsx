import React, { useState } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { RTLText } from '../shared/RTLComponents';
import styles from './styles';

interface EpipenInfoCardProps {
  label: string;
  value: string;
  isPhone?: boolean;
  isMultiline?: boolean;
}

export const EpipenInfoCard: React.FC<EpipenInfoCardProps> = ({
  label,
  value,
  isPhone = false,
  isMultiline = false
}) => {
  const { t, isRtl } = useAppTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Handle phone call
  const handlePhoneCall = () => {
    if (isPhone) {
      Linking.openURL(`tel:${value}`);
    }
  };
  
  // Handle WhatsApp message
  const handleWhatsApp = () => {
    if (isPhone) {
      // Format phone number for WhatsApp (remove non-digits)
      let phoneNumber = value.replace(/\D/g, '');
      
      // Add default country code if not present
      if (!phoneNumber.startsWith('+')) {
        // Default to Israel country code if number doesn't have one
        if (!phoneNumber.startsWith('972')) {
          // If number starts with 0, remove it before adding country code
          if (phoneNumber.startsWith('0')) {
            phoneNumber = phoneNumber.substring(1);
          }
          phoneNumber = `972${phoneNumber}`;
        }
      }
      
      // Try to open WhatsApp app first
      Linking.canOpenURL(`whatsapp://send?phone=${phoneNumber}`)
        .then(supported => {
          if (supported) {
            return Linking.openURL(`whatsapp://send?phone=${phoneNumber}`);
          } else {
            // Fallback to web WhatsApp if app is not installed
            return Linking.openURL(`https://wa.me/${phoneNumber}`);
          }
        })
        .catch(err => {
          console.error('An error occurred', err);
        });
    }
  };
  
  if (isMultiline) {
    return (
      <View style={styles.detailsCard}>
        <RTLText style={isRtl ? [styles.detailsCardLabel, styles.detailsCardLabelRtl] : styles.detailsCardLabel}>
          {label}
        </RTLText>
        <RTLText style={styles.detailsNotes}>
          {value}
        </RTLText>
      </View>
    );
  }
  
  return (
    <View style={[styles.detailsInfoCard, isRtl && styles.detailsInfoCardRtl]}>
      <RTLText style={isRtl ? [styles.detailsLabel, styles.detailsLabelRtl] : styles.detailsLabel}>
        {label}
      </RTLText>
      
      {isPhone ? (
        <View style={[localStyles.contactContainer, isRtl && localStyles.contactContainerRtl]}>
          <TouchableOpacity onPress={handlePhoneCall} style={localStyles.phoneContainer}>
            <RTLText style={[styles.detailsValue, styles.phoneLink]}>
              {value}
            </RTLText>
          </TouchableOpacity>
          
          <View style={isRtl ? localStyles.whatsappContainerRtl : localStyles.whatsappContainer}>
            <TouchableOpacity 
              style={localStyles.whatsappButton}
              onPress={handleWhatsApp}
              onLongPress={() => setShowTooltip(true)}
              onPressOut={() => setShowTooltip(false)}
            >
              <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
            </TouchableOpacity>
            
            {showTooltip && (
              <View style={[localStyles.tooltip, isRtl && localStyles.tooltipRtl]}>
                <Text style={localStyles.tooltipText}>
                  {t('actions.openWhatsApp')}
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : (
        <RTLText style={styles.detailsValue}>
          {value}
        </RTLText>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  contactContainerRtl: {
    flexDirection: 'row-reverse',
  },
  phoneContainer: {
    flex: 1,
  },
  whatsappContainer: {
    marginLeft: 'auto',
  },
  whatsappContainerRtl: {
    marginRight: 'auto',
    marginLeft: 0,
  },
  whatsappButton: {
    padding: 5,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 5,
    borderRadius: 5,
    top: -30,
    right: 0,
    zIndex: 1000,
  },
  tooltipRtl: {
    right: 'auto',
    left: 0,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
});