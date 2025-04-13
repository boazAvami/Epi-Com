import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';

const RegisterErrorScreen = () => {
    const router = useRouter();

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
                    <Heading className="text-center font-semibold" size="2xl">
                        משהו השתבש 😞
                    </Heading>
                    <Text className="text-center text-[#4F4F4F]">
                        לא הצלחנו להשלים את ההרשמה.
                        {'\n'}אנא בדוק את החיבור שלך ונסה שוב.
                    </Text>
                    <Button onPress={handleRetry} className="mt-4 w-48" style={styles.retryButton}>
                        <ButtonText>נסה שוב</ButtonText>
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
