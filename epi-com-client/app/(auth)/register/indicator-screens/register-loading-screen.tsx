import React, { useEffect } from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import { useRegister } from "@/context/RegisterContext";
import { register } from "@/services/authService";
import { useAuth } from "@/context/authContext";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

const RegisterLoadingScreen = () => {
    console.log('******* RegisterLoadingScreen MOUNTED *******');
    const { formData } = useRegister();
    const { login, getUserInfo } = useAuth();
    const router = useRouter();
    const { t } = useAppTranslation();

    useEffect(() => {
        console.log('RegisterLoadingScreen - Initial form data:', JSON.stringify(formData, null, 2));
        
        const handleRegister = async () => {
            console.log('Attempting to register with data:', JSON.stringify(formData, null, 2));
            try {
                console.log('Form data details:', {
                    email: formData.email,
                    hasPassword: !!formData.password,
                    userName: formData.userName,
                    phone: formData.phone_number,
                    allergiesCount: formData.allergies?.length || 0,
                    emergencyContactsCount: formData.emergencyContacts?.length || 0,
                    hasFirstName: !!formData.firstName,
                    hasLastName: !!formData.lastName,
                    hasDateOfBirth: !!formData.date_of_birth,
                    hasGender: !!formData.gender
                });
                await register(formData);
                console.log('Registration successful');
            } catch (e) {
                console.error('Registration failed:', e);
                throw e;
            }
        }

        const handleLogin = async () => {
            console.log('Attempting to login with:', formData.email);
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
