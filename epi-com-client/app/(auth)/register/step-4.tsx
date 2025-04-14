import React, {
    useImperativeHandle,
    forwardRef,
} from 'react';
import {ScrollView} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/context/RegisterContext';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { AlertTriangle } from 'lucide-react-native';
import { StepRef } from '@/app/(auth)/register/step-1';
import {RegisterData} from "@/shared/types/register-data.type";
import {registerStep4Schema, registerStep4Type} from "@/schemas/register/step-4-schema";
import {Input, InputField} from "@/components/ui/input";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

const RegisterStep4Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();
    const { t, isRtl } = useAppTranslation();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<registerStep4Type>({
        resolver: zodResolver(registerStep4Schema),
        defaultValues: {
            emergencyContacts: formData.emergencyContacts || [{ name: '', phone: '' }],
        },
    });

    const onSubmit = (data: registerStep4Type) => {
        setFormData({ ...formData, ...(data as Partial<RegisterData>) });
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
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Center className="h-full">
                <VStack className="max-w-[440px] w-3/4" space="xl">
                    <RTLText className="font-semibold text-2xl text-[#333]">
                        {t('auth.register.step4.title')}
                    </RTLText>
                    <RTLText className="text-[#4F4F4F]">
                        {t('auth.register.step4.subtitle')}
                    </RTLText>
                    <VStack className="w-full mt-2 gap-4">
                        <FormControl isInvalid={!!errors.emergencyContacts?.[0]?.name}>
                            <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                {isRtl ? (
                                    <>
                                        <FormControlErrorText>{errors.emergencyContacts?.[0]?.name?.message}</FormControlErrorText>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                    </>
                                ) : (
                                    <>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                        <FormControlErrorText>{errors.emergencyContacts?.[0]?.name?.message}</FormControlErrorText>
                                    </>
                                )}
                            </FormControlError>
                            <Controller
                                name="emergencyContacts.0.name"
                                control={control}
                                render={({ field: { onChange, value, onBlur } }) => (
                                        <Input>
                                            <InputField
                                                className={isRtl ? "text-right" : "text-left"}
                                                placeholder={t('auth.register.step4.contact_name')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                            />
                                    </Input>
                                )}
                            />
                        </FormControl>

                        <FormControl isInvalid={!!errors.emergencyContacts?.[0]?.phone}>
                            <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                {isRtl ? (
                                    <>
                                        <FormControlErrorText>{errors.emergencyContacts?.[0]?.phone?.message}</FormControlErrorText>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                    </>
                                ) : (
                                    <>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                        <FormControlErrorText>{errors.emergencyContacts?.[0]?.phone?.message}</FormControlErrorText>
                                    </>
                                )}
                            </FormControlError>
                            <Controller
                                name="emergencyContacts.0.phone"
                                control={control}
                                render={({ field: { onChange, value, onBlur } }) => (
                                    <PhoneNumberInput onChange={onChange} onBlur={onBlur} value={value} isInvalid={!!errors.emergencyContacts?.[0]?.phone} />
                                )}
                            />
                        </FormControl>
                    </VStack>
                </VStack>
            </Center>
        </ScrollView>
    );
});

export default RegisterStep4Screen;
