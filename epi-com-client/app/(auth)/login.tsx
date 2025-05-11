import React, { useRef, useState, useEffect } from 'react';
import { View } from 'react-native';
import { Center } from '@/components/ui/center';
import LoginCard, { LoginCardHandle } from "@/app/(auth)/login-card";
import { HStack } from "@/components/ui/hstack";
import { Link, LinkText } from "@/components/ui/link";
import { Router, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import LottieView from 'lottie-react-native';
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';
import LanguageToggle from '@/components/shared/LanguageToggle';

const Login = () => {
    const router: Router = useRouter();
    const loginCardRef = useRef<LoginCardHandle>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);
    const { t, isRtl } = useAppTranslation();

    const loadingMessages = [
        t('auth.loading.checking'),
        t('auth.loading.almost'),
        t('auth.loading.final'),
    ];

    const submit = () => {
        loginCardRef.current?.submit();
    };

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading, loadingMessages.length]);

    return (
        <View
            className="p-16"
            style={{
                flexGrow: 1,
                justifyContent: 'center',
            }}
        >
            {/* Language Toggle Button */}
            <View style={{ 
                position: 'absolute', 
                top: 50, 
                right: 20, 
                zIndex: 100 
            }}>
                <LanguageToggle />
            </View>

            <Center className="h-full">
                {isLoading ? (
                    <VStack className="items-center space-y-4">
                        <LottieView
                            source={require('@/assets/animations/register-loading.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <RTLText className="text-lg text-center text-[#4F4F4F]">
                            {loadingMessages[loadingTextIndex]}
                        </RTLText>
                    </VStack>
                ) : (
                    <VStack className="max-w-[440px] w-[80%]">
                        <LoginCard ref={loginCardRef} setIsLoading={setIsLoading} />
                        <VStack className="w-full my-7" space="lg">
                            <Button
                                className="w-full"
                                onPress={submit}
                                style={{ backgroundColor: '#FE385C', borderRadius: 20 }}
                            >
                                <ButtonText className="font-medium">
                                    {t('auth.login_button')}
                                </ButtonText>
                            </Button>
                            <GoogleLoginButton />
                        </VStack>
                        <HStack className={`self-center flex-row${isRtl ? '-reverse' : ''}`} space="sm">
                            <Link onPress={() => router.push('/register-intro')}>
                                <LinkText
                                    className="font-medium text-primary-700"
                                    size="md"
                                >
                                    {t('auth.sign_up_link')}
                                </LinkText>
                            </Link>
                            <RTLText className="text-base">
                                {t('auth.no_account')}
                            </RTLText>
                        </HStack>
                    </VStack>
                )}
            </Center>
        </View>
    );
};

export default Login;
