import {Router, useRouter} from 'expo-router';
import {View} from 'react-native';
import {Center} from "@/components/ui/center";
import {Heading} from "@/components/ui/heading";
import {VStack} from "@/components/ui/vstack";
import {Button, ButtonText} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {BackButton} from "@/components/BackButton";

export default function RegisterIntroScreen() {
    const router: Router = useRouter();
    const proceedToRegister = () => router.push("/register/register-stepper");

    const RegisterIntro = () => {
        return (
                <VStack space="4xl" className=" w-3/4">
                    <VStack space="2xl">
                        <Heading size="3xl" className="text-right font-semibold">
                            הצטרפו לקהילה שומרת חיים
                        </Heading>

                        <Text size="md" className="text-right color-[#4F4F4F]">
                            הרשמו עכשיו כדי לקבל ולעזור בשעת חירום.
                        </Text>

                        <Text size="sm" className="text-right color-[#4F4F4F]">
                            איפה אפי מחברת בין אנשים עם אלרגיות מסכנות חיים לבין מחזיקי אפיפן בקרבת מקום.
                            ההרשמה מהירה ובטוחה — כדי שתוכלו להיות מוגנים, כל הזמן.
                        </Text>

                        <VStack space="sm" className="mt-4 color-[#4F4F4F]">
                            <Text size="sm" className="text-right">⚡ הרשמה מהירה</Text>
                            <Text size="sm" className="text-right">🔒 פרטיותכם מוגנת</Text>
                            <Text size="sm" className="text-right">❤️ עזרה ברגעים הכי חשובים</Text>
                        </VStack>
                    </VStack>

                    <Center>
                        <Button
                            style={{backgroundColor: '#FE385C', borderRadius: 20}}
                            size="lg"
                            onPress={proceedToRegister}>
                            <ButtonText>
                                המשך להרשמה
                            </ButtonText>
                        </Button>
                    </Center>
                </VStack>
        );
    };

    return (
        <View className="p-16" style={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
            <BackButton></BackButton>
            <Center>
                <RegisterIntro/>
            </Center>
        </View>
    );
}
