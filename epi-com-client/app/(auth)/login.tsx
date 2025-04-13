import React, { useRef, useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import LoginCard, { LoginCardHandle } from "@/app/(auth)/login-card";
import { HStack } from "@/components/ui/hstack";
import { Link, LinkText } from "@/components/ui/link";
import { Router, useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import LottieView from 'lottie-react-native';
import {GoogleLoginButton} from "@/components/GoogleLoginButton";

const loadingMessages = [
    "בודקים את הפרטים שהזנת...",
    "תכף תוכל לראות מי יכול לעזור בקרבתך...",
    "ממש תכף בפנים...",
];

const Login = () => {
    const router: Router = useRouter();
    const loginCardRef = useRef<LoginCardHandle>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);

    const submit = () => {
        loginCardRef.current?.submit();
    };

    useEffect(() => {
        if (!isLoading) return;

        const interval = setInterval(() => {
            setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <ScrollView
            className="p-16"
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
            }}
        >
            <Center className="h-full">
                {isLoading ? (
                    <VStack className="items-center space-y-4">
                        <LottieView
                            source={require('@/assets/animations/register-loading.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <Text className="text-lg text-center text-[#4F4F4F]">
                            {loadingMessages[loadingTextIndex]}
                        </Text>
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
                                <ButtonText className="font-medium">התחבר</ButtonText>
                            </Button>
                            <GoogleLoginButton></GoogleLoginButton>
                        </VStack>
                        <HStack className="self-center" space="sm">
                            <Link onPress={() => router.push('/register-intro')}>
                                <LinkText
                                    className="font-medium text-primary-700"
                                    size="md"
                                >
                                    להרשמה
                                </LinkText>
                            </Link>
                            <Text size="md">אין לך חשבון?</Text>
                        </HStack>
                    </VStack>
                )}
            </Center>
        </ScrollView>
    );
};

export default Login;
