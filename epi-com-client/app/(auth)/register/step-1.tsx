import { Router, useRouter } from 'expo-router';
import { Keyboard, ScrollView } from 'react-native';
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {useEffect, useMemo, useState} from "react";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { AlertTriangle, EyeIcon, EyeOffIcon } from "lucide-react-native";
import { BackButton } from "@/components/BackButton";
import { Text } from "@/components/ui/text";
import { registerStep1Schema, registerStep1Type } from "@/schemas/register/step-1-schema";
import { useRegister } from "@/context/RegisterContext";

export default function RegisterStep1Screen() {
    const router: Router = useRouter();
    const { formData, setFormData } = useRegister();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<registerStep1Type>({
        resolver: zodResolver(registerStep1Schema),
        defaultValues: {
            email: '',
            password: '',
            userName: '',
            confirmPassword: '',
        },
    });

    useEffect(() => {
        reset({
            email: formData.email,
            password: formData.password,
            userName: formData.userName,
            confirmPassword: formData.password,
        });
    }, [formData, reset]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordState = () => setShowPassword(prev => !prev);
    const handleConfirmPasswordState = () => setShowConfirmPassword(prev => !prev);

    const onSubmit = (data: registerStep1Type) => {
        setFormData({
            ...formData,
            email: data.email,
            password: data.password,
            userName: data.userName,
        });
        reset();
        router.push('/register/step-2');
    };

    const handleKeyPress = () => {
        Keyboard.dismiss();
        handleSubmit(onSubmit)();
    };

    const RegisterCard = () => (
        <VStack className="max-w-[440px] w-3/4" space="xl">
            <Heading className="text-right font-semibold text-[#333]" size="2xl">
                בואו נכיר קצת 😊
            </Heading>
            <Text className="text-right text-[#4F4F4F]">
                המידע שתשתפו ישמש אותנו רק כדי לעזור לכם בשעת חירום, והוא מאובטח ומוצפן.
            </Text>

            <VStack className="w-full mt-10 gap-8">
                <VStack space="xl" className="w-full">
                    {/* Email */}
                    <FormControl isInvalid={!!errors?.email} className="w-full">
                        <Controller
                            name="email"
                            control={control}
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
                            <FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>

                    {/* Username */}
                    <FormControl isInvalid={!!errors?.userName} className="w-full">
                        <Controller
                            name="userName"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input>
                                    <InputField
                                        className="text-right"
                                        placeholder="שם משתמש"
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
                            <FormControlErrorText>{errors?.userName?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>

                    {/* Password */}
                    <FormControl isInvalid={!!errors?.password} className="w-full">
                        <Controller
                            name="password"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input>
                                    <InputSlot onPress={handlePasswordState} className="p-2">
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
                            <FormControlErrorText>{errors?.password?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>

                    {/* Confirm Password */}
                    <FormControl isInvalid={!!errors?.confirmPassword} className="w-full">
                        <Controller
                            name="confirmPassword"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input>
                                    <InputSlot onPress={handleConfirmPasswordState} className="p-2">
                                        <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                    <InputField
                                        className="text-right"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="אישור סיסמה"
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
                            <FormControlErrorText>{errors?.confirmPassword?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>
                </VStack>

                <Button className="w-full" onPress={handleSubmit(onSubmit)}>
                    <ButtonText className="font-medium">המשך</ButtonText>
                </Button>
            </VStack>
        </VStack>
    );

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                padding: 24,
            }}
        >
            <BackButton />
            <Center className="h-full">
                <RegisterCard />
            </Center>
        </ScrollView>
    );
}
