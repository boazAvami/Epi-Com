import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

const RegisterSuccessScreen = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    const { t } = useAppTranslation();

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleGoToApp = () => {
        router.replace('/');
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
                    <RTLText className="font-semibold text-2xl text-center">
                        {t('auth.register.success.title')}
                    </RTLText>
                    <RTLText className="text-center text-[#333]">
                        {t('auth.register.success.subtitle')}
                    </RTLText>
                    <Button onPress={handleGoToApp} className="mt-4 w-48" style={styles.startButton}>
                        <ButtonText>{t('auth.register.success.button')}</ButtonText>
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
