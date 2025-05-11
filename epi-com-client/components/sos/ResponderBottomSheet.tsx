import React, {forwardRef, RefObject, useState} from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Dimensions, LayoutChangeEvent, StyleSheet } from 'react-native';
import { ICarouselInstance, Pagination } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel/src/components/Carousel';
import ResponderCard, { ResponderCardProps } from './ResponderCard';
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";

interface Props {
    responders: ResponderCardProps[];
    onCancelSOS: () => void;
    mapRef: RefObject<any>;
}

const width = Dimensions.get('window').width;

const ResponderListBottomSheet = forwardRef<BottomSheet, Props>(({ responders, onCancelSOS, mapRef }, ref) => {
    const carouselRef = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const [sheetHeight, setSheetHeight] = useState<number>(0);

    const onLayout = (event: LayoutChangeEvent) => {
        setSheetHeight(event.nativeEvent.layout.height);
    };

    const onPressPagination = (index: number) => {
        carouselRef.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={['15%', '60%']}
            enablePanDownToClose={false}
            handleIndicatorStyle={styles.handleIndicator}
        >
            <BottomSheetView onLayout={onLayout} style={styles.container}>
                <VStack className="mt-4">
                    <Text style={styles.title}>נמצאה עזרה בקרבת מקום</Text>

                    {responders.length === 0 ? (
                        <Center>
                            <Text>אין כרגע מגיבים זמינים</Text>
                        </Center>
                    ) : responders.length === 1 ? (
                        <ResponderCard
                            user={responders[0].user}
                            userLocation={responders[0].userLocation}
                            epipenList={responders[0].epipenList || []}
                            mapRef={mapRef}
                        />
                    ) : (
                        <>
                            <Carousel
                                ref={carouselRef}
                                width={width - 32}
                                height={sheetHeight * 0.8}
                                data={responders}
                                onProgressChange={progress}
                                renderItem={({ item }) => (
                                    <ResponderCard user={item.user} userLocation={item.userLocation} epipenList={item.epipenList || []} mapRef={mapRef}/>
                                )}
                            />
                            <Pagination.Basic
                                progress={progress}
                                data={responders}
                                dotStyle={styles.paginationDot}
                                containerStyle={styles.paginationContainer}
                                onPress={onPressPagination}
                            />
                        </>
                    )}

                    <Center>
                        <Button onPress={onCancelSOS} style={styles.cancelButton}>
                            <ButtonText>הכול בסדר, אפשר להפסיק את הקריאה</ButtonText>
                        </Button>
                    </Center>
                </VStack>
            </BottomSheetView>
        </BottomSheet>
    );
});

const styles = StyleSheet.create({
    handleIndicator: {
        backgroundColor: '#ccc',
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 8,
    },
    container: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    paginationDot: {
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 50,
    },
    paginationContainer: {
        gap: 5,
        marginTop: 10,
    },
    cancelButton: {
        backgroundColor: '#FE385C',
        borderRadius: 20,
        padding: 5,
        width: '80%',
        marginTop: 30,
        marginBottom: 30,
    },
});

export default ResponderListBottomSheet;
