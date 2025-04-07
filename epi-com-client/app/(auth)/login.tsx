import {Router, useRouter} from 'expo-router';
import {Keyboard, ScrollView} from 'react-native';
import { useAuth } from '@/context/authContext';
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button"
import {VStack} from "@/components/ui/vstack";
import {Heading} from "@/components/ui/heading";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon, FormControlErrorText,
} from "@/components/ui/form-control";
import {Input, InputField, InputIcon, InputSlot} from "@/components/ui/input";
import {Link, LinkText} from "@/components/ui/link";
import {HStack} from "@/components/ui/hstack";
import {AlertTriangle, EyeIcon, EyeOffIcon} from "lucide-react-native";
import {Text} from "@/components/ui/text";
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from "react";
import GoogleIcon from "@/assets/icons/google-icon";
import {Center} from "@/components/ui/center";
import {loginSchema, LoginSchemaType} from "@/schemas/login-schema";

export default function LoginScreen() {
    const { login } = useAuth();
    const router: Router = useRouter();
    const handleLogin = () => {
        login();
        router.replace('/');
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
    });
    const [validated, setValidated] = useState({
        emailValid: true,
        passwordValid: true,
    });

    const onSubmit = (data: LoginSchemaType) => {
        setValidated({ emailValid: true, passwordValid: true });
        reset();
        handleLogin();
    };
    const [showPassword, setShowPassword] = useState(false);

    const handleState = () => {
        setShowPassword((showState) => {
            return !showState;
        });
    };
    const handleKeyPress = () => {
        Keyboard.dismiss();
        handleSubmit(onSubmit)();
    };


    const LoginCard = () => {
        return (
            <VStack className="max-w-[440px] w-full" space="md">
                <VStack className="md:items-center" space="md">
                        <Heading className="md:text-center text-right font-semibold text-[#333333]" size="2xl">
                            ברוך הבא 👋
                        </Heading>
                    <Text className="md:text-center text-right text-[#4F4F4F]">התחבר כדי לשמור על עצמך ועל אחרים.</Text>
                </VStack>
                <VStack className="w-full mt-10">
                    <VStack space="xl" className="w-full">
                        <FormControl
                            isInvalid={!!errors?.email || !validated.emailValid}
                            className="w-full">
                            <Controller
                                defaultValue=""
                                name="email"
                                control={control}
                                rules={{
                                    validate: async (value) => {
                                        try {
                                            await loginSchema.parseAsync({ email: value });
                                            return true;
                                        } catch (error: any) {
                                            return error.message;
                                        }
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input>
                                        <InputField
                                            className="text-right"
                                            placeholder="כתובת מייל"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            onSubmitEditing={handleKeyPress}
                                            returnKeyType="done"
                                        />
                                    </Input>
                                )}
                            />
                            <FormControlError className="justify-end">
                                <FormControlErrorText>
                                    {errors?.email?.message ||
                                        (!validated.emailValid && "כתובת מייל לא נמצאה")}
                                </FormControlErrorText>
                                <FormControlErrorIcon as={AlertTriangle} />
                            </FormControlError>
                        </FormControl>
                        {/* Label Message */}
                        <FormControl
                            isInvalid={!!errors.password || !validated.passwordValid}
                            className="w-full"
                        >
                            <Controller
                                defaultValue=""
                                name="password"
                                control={control}
                                rules={{
                                    validate: async (value) => {
                                        try {
                                            await loginSchema.parseAsync({ password: value });
                                            return true;
                                        } catch (error: any) {
                                            return error.message;
                                        }
                                    },
                                }}
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <Input>
                                        <InputSlot onPress={handleState} className="p-2">
                                            <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                        </InputSlot>
                                        <InputField
                                            className="text-right"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="סיסמה"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            onSubmitEditing={handleKeyPress}
                                            returnKeyType="done"
                                        />
                                    </Input>
                                )}
                            />
                            <FormControlError className="justify-end">
                                <FormControlErrorText>
                                    {errors?.password?.message ||
                                        (!validated.passwordValid && "סיסמה לא נכונה")}
                                </FormControlErrorText>
                                <FormControlErrorIcon as={AlertTriangle} />

                            </FormControlError>
                        </FormControl>
                    </VStack>
                    <VStack className="w-full my-7 " space="lg">
                        <Button className="w-full" onPress={handleSubmit(onSubmit)}>
                            <ButtonText className="font-medium">התחבר</ButtonText>
                        </Button>
                        <Button
                            variant="outline"
                            action="secondary"
                            className="w-full gap-1"
                            onPress={() => {}}
                        >

                            <ButtonText className="font-medium">
                                כניסה דרך גוגל
                            </ButtonText>
                            <ButtonIcon as={GoogleIcon} className="text-typography-white"/>
                        </Button>
                    </VStack>
                    <HStack className="self-center" space="sm">
                        <Link onPress={() => router.push('/register')}>
                            <LinkText
                                className="font-medium text-primary-700 group-hover/link:text-primary-600  group-hover/pressed:text-primary-700"
                                size="md"
                            >
                                להרשמה
                            </LinkText>
                        </Link>
                        <Text size="md">אין לך חשבון?</Text>
                    </HStack>
                </VStack>
            </VStack>
        );
    };

    return (
        <ScrollView className="p-16 mt-10">
            <Center>
                <LoginCard/>
            </Center>
        </ScrollView>
    );
}
