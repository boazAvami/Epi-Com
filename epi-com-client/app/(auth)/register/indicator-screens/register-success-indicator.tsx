import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const RegisterSuccessScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleGoToApp = () => {
        // router.replace('/(tabs)/home');
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Center className="flex-1 bg-white">
                <VStack space="xl" className="items-center max-w-[90%]">
                    <LottieView
                        source={require('@/assets/animations/success-checkmark.json')}
                        autoPlay
                        loop={false}
                        style={{ width: 160, height: 160 }}
                    />
                    <Heading className="text-center font-semibold" size="2xl">
                        כיף שבאת – עכשיו אתה חלק מאיתנו
                    </Heading>
                    <Text className="text-center text-[#333]">
                        מעכשיו, אתה אף פעם לא לבד עם האלרגיה שלך.
                        {'\n'}האפליקציה מחברת בין אנשים, מזריקה ביטחון
                        {'\n'}ונותנת מענה מיידי ברגעי חירום.
                    </Text>
                    <Button onPress={handleGoToApp} className="mt-4 w-48" style={styles.startButton}>
                        <ButtonText>בוא נתחיל</ButtonText>
                    </Button>
                </VStack>
            </Center>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    startButton: {
        backgroundColor: '#FE385C',
        borderRadius: 20,
    },
});

export default RegisterSuccessScreen;
