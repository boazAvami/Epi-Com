import React, {
    useImperativeHandle,
    forwardRef,
    useState,
} from 'react';
import { ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerStep1Schema, registerStep1Type } from '@/schemas/register/step-1-schema';
import { useRegister } from '@/context/RegisterContext';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from '@/components/ui/form-control';
import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { AlertTriangle, EyeIcon, EyeOffIcon } from 'lucide-react-native';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

export type StepRef = {
    onNext: () => Promise<void>;
};

const RegisterStep1Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();
    const { t, isRtl } = useAppTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<registerStep1Type>({
        resolver: zodResolver(registerStep1Schema),
        defaultValues: {
            email: formData.email ||'',
            password: formData.password || '',
            userName: formData.userName || '',
            confirmPassword: formData.password || '',
        },
    });

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
    };

    useImperativeHandle(ref, () => ({
        onNext: async () => {
            return new Promise<void>((resolve, reject) => {
                handleSubmit(
                    (data) => {
                        onSubmit(data);
                        resolve();
                    },
                    (errors) => {
                        reject(errors);
                    }
                )();
            });
        },
    }));

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Center className="h-full">
                <VStack className="max-w-[440px] w-3/4" space="xl">
                    <RTLText className="font-semibold text-2xl text-[#333]">
                        {t('auth.register.step1.title')}
                    </RTLText>
                    <RTLText className="text-[#4F4F4F]">
                        {t('auth.register.step1.subtitle')}
                    </RTLText>

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
                                                className={isRtl ? "text-right" : "text-left"}
                                                placeholder={t('auth.email')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                returnKeyType="done"
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.email?.message}</FormControlErrorText>
                                        </>
                                    )}
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
                                                className={isRtl ? "text-right" : "text-left"}
                                                placeholder={t('auth.register.step1.username')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                returnKeyType="done"
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.userName?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.userName?.message}</FormControlErrorText>
                                        </>
                                    )}
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
                                                className={isRtl ? "text-right" : "text-left"}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder={t('auth.password')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                returnKeyType="done"
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.password?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.password?.message}</FormControlErrorText>
                                        </>
                                    )}
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
                                                className={isRtl ? "text-right" : "text-left"}
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder={t('auth.register.step1.confirm_password')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                returnKeyType="done"
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.confirmPassword?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.confirmPassword?.message}</FormControlErrorText>
                                        </>
                                    )}
                                </FormControlError>
                            </FormControl>
                        </VStack>
                    </VStack>
                </VStack>
            </Center>
        </ScrollView>
    );
});

export default RegisterStep1Screen;
