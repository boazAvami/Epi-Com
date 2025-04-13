import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { EpipenMarker } from '../../types';
import { useAppTranslation } from '../../hooks/useAppTranslation';
import { EpipenItem } from './EpipenItem';
import { RTLText, RTLRow, RTLView } from '../shared/RTLComponents';
import styles from './styles';

interface EpipenListProps {
  markers: EpipenMarker[];
  onSelectEpipen: (marker: EpipenMarker) => void;
}

type FilterType = 'all' | 'nearby';

export const EpipenList: React.FC<EpipenListProps> = ({ 
  markers, 
  onSelectEpipen 
}) => {
  const { t, isRtl } = useAppTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Filter markers based on active filter
  const filteredMarkers = useMemo(() => {
    if (activeFilter === 'nearby') {
      return markers.filter(marker => (marker.distance ?? 0) < 1);
    }
    return markers;
  }, [markers, activeFilter]);

  return (
    <Box style={styles.controls}>
      <VStack space="md">
        {/* Filter Pills */}
        <RTLRow style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterPill, 
              activeFilter === 'all' && styles.activePill
            ]}
            onPress={() => setActiveFilter('all')}
          >
            <RTLText style={
              activeFilter === 'all' ? styles.activePillText : styles.pillText
            }>
              {t('filters.all')}
            </RTLText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterPill,
              activeFilter === 'nearby' && styles.activePill
            ]}
            onPress={() => setActiveFilter('nearby')}
          >
            <RTLText style={
              activeFilter === 'nearby' ? styles.activePillText : styles.pillText
            }>
              {t('filters.nearby')}
            </RTLText>
          </TouchableOpacity>
        </RTLRow>
        
        {/* Nearby EpiPens List */}
        <Box style={styles.nearbyBox}>
          <RTLText style={styles.nearbyTitle}>
            {t('epipens.nearby')}
          </RTLText>
          
          {filteredMarkers.length > 0 ? (
            <ScrollView 
              contentContainerStyle={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
              scrollEnabled={true}
              style={{ maxHeight: 200 }}
            >
              {filteredMarkers.map(marker => (
                <EpipenItem
                  key={marker.id}
                  marker={marker}
                  onPress={onSelectEpipen}
                />
              ))}
            </ScrollView>
          ) : (
            <RTLText style={styles.noEpipensText}>
              {t('epipens.none')}
            </RTLText>
          )}
        </Box>
      </VStack>
    </Box>
  );
};