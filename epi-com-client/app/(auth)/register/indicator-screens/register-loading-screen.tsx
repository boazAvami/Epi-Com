import React, { useEffect } from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { useRegister } from "@/context/RegisterContext";
import { register } from "@/services/authService";
import { useAuth } from "@/context/authContext";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';
import {registerForPushNotificationsAsync} from "@/utils/sos-notifications";

const RegisterLoadingScreen = () => {
    const { formData } = useRegister();
    const { login, getUserInfo } = useAuth();
    const router = useRouter();
    const { t, language } = useAppTranslation();

    useEffect(() => {
        const handleRegister = async () => {
            try {
                formData.language = language;
                await register(formData);
            } catch (e) {
                console.error('Registration failed:', e);
                throw e;
            }
        }

        const handleLogin = async () => {
            try {
                await login(formData.email, formData.password);
                await getUserInfo()
                console.log('Login successful');
            } catch (e) {
                console.error('Login failed:', e);
                throw e;
            }
        };
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        const handleRegisterAndLogin = async () => {
            let redirectPath: 'register-success-indicator' | 'register-error-screen' = 'register-success-indicator';

            try {
                await handleRegister();
                await handleLogin();
            } catch (e) {
                console.error('Registration or login error:', e);
                redirectPath = 'register-error-screen';
            }

            await sleep(1000);
            router.replace(`/(auth)/register/indicator-screens/${redirectPath}`);
        };


        handleRegisterAndLogin();
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
                <RTLText className="font-semibold text-2xl text-center text-gray-800">
                    {t('auth.register.loading.title')}
                </RTLText>
                <RTLText className="text-center text-gray-500">
                    {t('auth.register.loading.subtitle')}
                </RTLText>
            </VStack>
        </Center>
    );
};

export default RegisterLoadingScreen;
