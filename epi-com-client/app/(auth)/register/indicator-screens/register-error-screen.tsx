import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Button, ButtonText } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

const RegisterErrorScreen = () => {
    const router = useRouter();
    const { t } = useAppTranslation();

    const handleRetry = () => {
        router.replace('/(auth)/register/register-stepper');
    };

    return (
        <Animated.View style={[styles.container]}>
            <Center className="flex-1">
                <VStack space="md" className="items-center max-w-[90%]">
                    <LottieView
                        source={require('@/assets/animations/register-error.json')}
                        autoPlay
                        loop={false}
                        style={{ width: 140, height: 140 }}
                    />
                    <RTLText className="font-semibold text-2xl text-center">
                        {t('auth.register.error.title')}
                    </RTLText>
                    <RTLText className="text-center text-[#4F4F4F]">
                        {t('auth.register.error.subtitle')}
                    </RTLText>
                    <Button onPress={handleRetry} className="mt-4 w-48" style={styles.retryButton}>
                        <ButtonText>{t('auth.register.error.button')}</ButtonText>
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
    retryButton: {
        backgroundColor: '#FE385C',
        borderRadius: 20,
    },
});

export default RegisterErrorScreen;
