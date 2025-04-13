import React, { useEffect } from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import {useRegister} from "@/context/RegisterContext";
import {register} from "@/services/authService";

const RegisterLoadingScreen = () => {
    const { formData } = useRegister();
    const router = useRouter();

    useEffect(() => {
        const handleRegister = async () => {
            let redirectPath: 'register-success-indicator' | 'register-error-screen' = 'register-success-indicator';
            try {
                await register(formData);
            } catch (e) {
                redirectPath = 'register-error-screen';
            } finally {
                setTimeout(() => router.replace(`/(auth)/register/indicator-screens/${redirectPath}`), 1000)
            }
        }

        handleRegister();
    }, []);

    return (
        <Center className="flex-1 bg-white">
            <VStack space="lg" className="items-center max-w-[90%]">
                <LottieView
                    source={require('@/assets/animations/register-loading.json')}
                    autoPlay
                    loop
                    style={{ width: 250, height: 250 }}
                />
                <Heading className="text-center text-gray-800" size="xl">
                    שומרים את הפרטים...
                </Heading>
                <Text className="text-center text-gray-500">
                    רגע קטן וזה קורה ✨
                </Text>
            </VStack>
        </Center>
    );
};

export default RegisterLoadingScreen;
