import {Router, useRouter} from 'expo-router';
import {View} from 'react-native';
import {Center} from "@/components/ui/center";
import {VStack} from "@/components/ui/vstack";
import {Button, ButtonText} from "@/components/ui/button";
import {BackButton} from "@/components/BackButton";
import {useAppTranslation} from '@/hooks/useAppTranslation';
import {RTLText, RTLView} from '@/components/shared/RTLComponents';
import LanguageToggle from '@/components/shared/LanguageToggle';

export default function RegisterIntroScreen() {
    const router: Router = useRouter();
    const {t, isRtl} = useAppTranslation();
    const proceedToRegister = () => router.push("/register/register-stepper");

    const RegisterIntro = () => {
        return (
            <VStack space="4xl" className="w-3/4">
                    <VStack space="2xl">
                    <RTLText className="text-2xl font-semibold">
                        {t('auth.register.title')}
                    </RTLText>

                    <RTLText className="text-base text-[#4F4F4F]">
                        {t('auth.register.subtitle')}
                    </RTLText>

                    <RTLText className="text-sm text-[#4F4F4F]">
                        {t('auth.register.description')}
                    </RTLText>

                    <VStack space="sm" className="mt-4">
                        <RTLView className={`flex-row w-full ${isRtl ? "justify-end" : "justify-start"}`}>
                            <RTLText className="text-sm text-[#4F4F4F]">{t('auth.register.benefits.fast')}</RTLText>
                        </RTLView>
                        <RTLView className={`flex-row w-full ${isRtl ? "justify-end" : "justify-start"}`}>
                            <RTLText className="text-sm text-[#4F4F4F]">{t('auth.register.benefits.privacy')}</RTLText>
                        </RTLView>
                        <RTLView className={`flex-row w-full ${isRtl ? "justify-end" : "justify-start"}`}>
                            <RTLText className="text-sm text-[#4F4F4F]">{t('auth.register.benefits.help')}</RTLText>
                        </RTLView>
                        </VStack>
                    </VStack>

                    <Center>
                        <Button
                            style={{backgroundColor: '#FE385C', borderRadius: 20}}
                            size="lg"
                            onPress={proceedToRegister}>
                            <ButtonText>
                            {t('auth.register.continue')}
                            </ButtonText>
                        </Button>
                    </Center>
                </VStack>
        );
    };

    return (
        <View className="p-16" style={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
            <View style={{ 
                position: 'absolute', 
                top: 50, 
                [isRtl ? 'left' : 'right']: 20, 
                zIndex: 100 
            }}>
                <LanguageToggle />
            </View>

            <View style={{ 
                position: 'absolute', 
                top: 50, 
                [isRtl ? 'right' : 'left']: 20, 
                zIndex: 100 
            }}>
                <BackButton />
            </View>
            
            <Center>
                <RegisterIntro/>
            </Center>
        </View>
    );
}
