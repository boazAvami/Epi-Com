import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { EpipenMarker } from '../../types';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { colors } from '../../constants/Colors';
import { RTLText, RTLRow } from '../shared/RTLComponents';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

interface EpipenItemProps {
  marker: EpipenMarker;
  onPress: (marker: EpipenMarker) => void;
}

const EpipenItemComponent: React.FC<EpipenItemProps> = ({ marker, onPress }) => {
  const { t } = useAppTranslation();
  const markerColor = marker.type === 'adult' ? colors.primary : colors.warning;
  
  return (
    <TouchableOpacity
      key={marker.id}
      onPress={() => onPress(marker)}
      style={{ width: '100%' }}
      activeOpacity={0.7}
    >
      <RTLRow style={styles.epipenItem}>
        <VStack style={{ flex: 1 }}>
          <RTLText style={styles.epipenDesc}>
            {t(`epipen.types.${marker.type}`)} • {t('epipens.distance', { distance: marker.distance })}
          </RTLText>
          
          <RTLText 
            style={styles.epipenLocation}
            numberOfLines={1}
          >
            {marker.description}
          </RTLText>
        </VStack>
        
        <Box 
          style={[
            styles.epipenIcon,
            { backgroundColor: markerColor }
          ]}
        >
          <Ionicons name="medkit" size={16} color={colors.white} />
        </Box>
      </RTLRow>
    </TouchableOpacity>
  );
};

export const EpipenItem = memo(EpipenItemComponent);