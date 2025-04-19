import {ScrollView} from 'react-native';
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/vstack";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {AlertTriangle} from "lucide-react-native";
import { useRegister } from '@/context/RegisterContext';
import { registerStep2Schema, registerStep2Type } from '@/schemas/register/step-2-schema';
import DropdownComponent from "@/components/Dropdown";
import { getGenderOptions } from "@/utils/gender-utils";
import DateInput from "@/components/DatePicker";
import PhoneNumberInput from "@/components/PhoneNumberInput";
import {RegisterData} from "@/shared/types/register-data.type";
import {forwardRef, useImperativeHandle, useState, useEffect} from "react";
import {StepRef} from "@/app/(auth)/register/step-1";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';
import React from 'react';

const RegisterStep2Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();
    const { t, isRtl, language } = useAppTranslation();
    const [genderOptions, setGenderOptions] = useState(getGenderOptions());
    
    // Update gender options when language changes
    useEffect(() => {
        setGenderOptions(getGenderOptions());
    }, [language]);
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<registerStep2Type>({
        resolver: zodResolver(registerStep2Schema),
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            phone_number: formData.phone_number || '',
            date_of_birth: formData.date_of_birth || undefined,
            gender: formData.gender || undefined,
        }
    });

    const onSubmit = (data: registerStep2Type) => {
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
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
            }}>
            <Center className="h-full">
                <VStack className="max-w-[440px] w-3/4" space="xl">
                    <RTLText className="font-semibold text-2xl text-[#333]">
                        {t('auth.register.step2.title')}
                    </RTLText>
                    <RTLText className="text-[#4F4F4F]">
                        {t('auth.register.step2.subtitle')}
                    </RTLText>

                    <VStack className="w-full mt-10 gap-8">
                        <VStack space="xl" className="w-full">

                            {/** First Name */}
                            <FormControl isInvalid={!!errors.firstName} className="w-full">
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input>
                                            <InputField
                                                className={isRtl ? "text-right" : "text-left"}
                                                placeholder={t('auth.register.step2.first_name')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.firstName?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.firstName?.message}</FormControlErrorText>
                                        </>
                                    )}
                                </FormControlError>
                            </FormControl>

                            {/** Last Name */}
                            <FormControl isInvalid={!!errors.lastName} className="w-full">
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <Input>
                                            <InputField
                                                className={isRtl ? "text-right" : "text-left"}
                                                placeholder={t('auth.register.step2.last_name')}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                            />
                                        </Input>
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.lastName?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.lastName?.message}</FormControlErrorText>
                                        </>
                                    )}
                                </FormControlError>
                            </FormControl>

                            {/** Phone Number */}
                            <FormControl isInvalid={!!errors.phone_number} className="w-full">
                                <Controller
                                    name="phone_number"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <PhoneNumberInput 
                                            onChange={onChange} 
                                            onBlur={onBlur} 
                                            value={value} 
                                            isInvalid={!!errors.phone_number} 
                                        />
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.phone_number?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.phone_number?.message}</FormControlErrorText>
                                        </>
                                    )}
                                </FormControlError>
                            </FormControl>

                            {/** Date of Birth */}
                            <FormControl isInvalid={!!errors.date_of_birth} className="w-full">
                                <Controller
                                    name="date_of_birth"
                                    control={control}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <DateInput 
                                            onChange={onChange} 
                                            onBlur={onBlur} 
                                            value={value} 
                                            placeholder={t('auth.register.step2.date_of_birth')} 
                                        />
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.date_of_birth?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} />
                                            <FormControlErrorText>{errors?.date_of_birth?.message}</FormControlErrorText>
                                        </>
                                    )}
                                </FormControlError>
                            </FormControl>

                            {/** Gender */}
                            <FormControl isInvalid={!!errors.gender}>
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{
                                        validate: async (value) => {
                                            try {
                                                await registerStep2Schema.parseAsync({ gender: value });
                                                return true;
                                            } catch (error: any) {
                                                return error.message;
                                            }
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <DropdownComponent 
                                            value={value} 
                                            onChange={onChange} 
                                            items={genderOptions} 
                                            isInvalid={!!errors.gender} 
                                        />
                                    )}
                                />
                                <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                    {isRtl ? (
                                        <>
                                            <FormControlErrorText>{errors?.gender?.message}</FormControlErrorText>
                                            <FormControlErrorIcon as={AlertTriangle} size="md" />
                                        </>
                                    ) : (
                                        <>
                                            <FormControlErrorIcon as={AlertTriangle} size="md" />
                                            <FormControlErrorText>{errors?.gender?.message}</FormControlErrorText>
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

export default RegisterStep2Screen;
