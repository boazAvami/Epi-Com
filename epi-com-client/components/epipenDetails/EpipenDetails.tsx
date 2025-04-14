import React, { useState } from 'react';
import { View, TouchableOpacity, Image, ScrollView, Linking, Platform, Modal } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { Ionicons } from '@expo/vector-icons';
import { EpipenMarker } from '../../types';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { formatDate } from '../../utils/formatters';
import { colors } from '../../constants/Colors';
import { EpipenInfoCard } from './EpipenInfoCard';
import { RTLText, RTLView, RTLRow } from '../shared/RTLComponents';
import styles from './styles';

interface EpipenDetailsProps {
  epipen: EpipenMarker;
  onClose: () => void;
}

export const EpipenDetails: React.FC<EpipenDetailsProps> = ({ epipen, onClose }) => {
  const { language, t, isRtl } = useAppTranslation();
  const locale = language === 'en' ? 'en-US' : 'he-IL';
  const markerColor = epipen.type === 'adult' ? colors.primary : colors.warning;
  
  // State for full-screen photo modal
  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  
  // Open default maps app
  const openDirections = () => {
    const latitude = epipen.coordinate.latitude;
    const longitude = epipen.coordinate.longitude;
    const label = epipen.description || 'EpiPen Location';
    
    let url;
    if (Platform.OS === 'ios') {
      url = `maps:0,0?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
    } else {
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(label)})`;
    }
    
    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
      Linking.openURL(`https://maps.google.com/maps?q=${latitude},${longitude}`);
    });
  };

  // Open Waze for navigation
  const openWaze = () => {
    const wazeUrl = `waze://?ll=${epipen.coordinate.latitude},${epipen.coordinate.longitude}&navigate=yes`;
    Linking.canOpenURL(wazeUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(wazeUrl);
        } else {
          return Linking.openURL(`https://waze.com/ul?ll=${epipen.coordinate.latitude},${epipen.coordinate.longitude}&navigate=yes`);
        }
      })
      .catch(err => console.error('Error opening Waze:', err));
  };

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Box style={styles.detailsContainer}>
      <VStack space="md">
        {/* Combined Header and Main Info */}
        <RTLRow style={styles.detailsHeaderCombined}>
          {/* Left Side: Icon and Info */}
          <View style={[
            styles.mainInfoLeftContainer,
            isRtl && styles.mainInfoLeftContainerRtl
          ]}> 
            {/* Icon */}
            <Box style={[
              styles.detailsIconSmall, 
              isRtl ? { marginRight: 0, marginLeft: 10 } : { marginRight: 10 },
              { backgroundColor: markerColor }
            ]}>
              <Ionicons name="medkit" size={16} color={colors.white} />
            </Box>
            
            {/* Type, Description (short), Distance */}
            <RTLView style={styles.mainInfoTextContainer}> 
              {/* Injector Type */}
              <RTLText style={styles.detailsTypeTitleSmall} numberOfLines={1} ellipsizeMode="tail">
                {t(`epipen.types.${epipen.type}`)}
              </RTLText>
              {/* Location Description (short - used in header) */}
              <RTLText style={styles.detailsLocationSmall} numberOfLines={1} ellipsizeMode="tail">
                {epipen.description || t('details.no_description')} {/* Show fallback if no description */}
              </RTLText>
               {/* Distance */}
               <RTLText style={styles.detailsDistanceSmall} numberOfLines={1} ellipsizeMode="tail">
                {t('epipens.distance', { distance: epipen.distance })}
              </RTLText>
            </RTLView>
          </View>

          {/* Right Side: Navigation & Close Buttons */}
          <RTLRow style={styles.headerActionButtons}>
            {/* Maps Button - Small */}
            <TouchableOpacity 
              style={styles.headerNavButton}
              onPress={openDirections}
            >
              <Ionicons name="map-outline" size={18} color={colors.primary} />
            </TouchableOpacity>
            
            {/* Waze Button - Small */}
            <TouchableOpacity 
              style={styles.headerNavButton}
              onPress={openWaze}
            >
              <Image 
                source={require('../../assets/images/waze-logo.png')} 
                style={{ width: 20, height: 20 }} 
                resizeMode="contain" 
              />
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity 
              style={styles.closeButtonSmall}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </RTLRow>
        </RTLRow>
        
        {/* Info Cards */}
        <ScrollView style={styles.detailsScrollView} contentContainerStyle={{ paddingBottom: 20 }}>
          {epipen.photo && (
            <TouchableOpacity 
              style={styles.detailsPhotoContainer}
              activeOpacity={0.9}
              onPress={() => setPhotoModalVisible(true)}
            >
              <Image 
                source={{ uri: epipen.photo }} 
                style={styles.detailsPhoto}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
        
          {/* Expiration Date */}
          <EpipenInfoCard
            label={t('details.expiration')}
            value={formatDate(epipen.expireDate, locale)}
          />
          
          {/* Contact Information - Name */}
          {epipen.contact?.name && (
            <EpipenInfoCard
              label={t('details.contactName')}
              value={epipen.contact.name}
            />
          )}
          
          {/* Contact Information - Phone */}
          {epipen.contact?.phoneNumber && (
            <EpipenInfoCard
              label={t('details.contactPhone')}
              value={epipen.contact.phoneNumber}
              isPhone={true}
            />
          )}

          {epipen.description && (
             <EpipenInfoCard
              label={t('details.notes')} 
              value={epipen.description}
              isMultiline={true} 
            />
          )}
          
        </ScrollView>
      </VStack>
      
      {/* Full Screen Photo Modal */}
      <Modal
        visible={photoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.photoModalOverlay}>
          {/* Close Button */}
          <TouchableOpacity 
            style={styles.photoModalCloseButton}
            onPress={() => setPhotoModalVisible(false)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {/* Full Screen Image */}
          {epipen.photo && (
            <Image 
              source={{ uri: epipen.photo }} 
              style={styles.fullScreenPhoto}
              resizeMode="contain"
            />
          )}
          
          {/* Tap anywhere to close */}
          <TouchableOpacity 
            style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 0 }}
            activeOpacity={1}
            onPress={() => setPhotoModalVisible(false)}
          />
        </View>
      </Modal>
    </Box>
  );
}