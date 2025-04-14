import React, {
    useImperativeHandle,
    forwardRef, useState, useEffect,
} from 'react';
import {ScrollView} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/context/RegisterContext';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { AlertTriangle } from 'lucide-react-native';
import { StepRef } from '@/app/(auth)/register/step-1';
import { registerStep3Schema, registerStep3Type } from '@/schemas/register/step-3-schema';
import {EAllergy} from "@shared/types";
import {ChipItem} from "@/components/Chip";
import Chips from "@/components/Chips";
import {RegisterData} from "@/shared/types/register-data.type";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

// Helper to convert enum value to readable format
const formatAllergyName = (allergyKey: string): string => {
    // Convert camelCase to words with spaces
    return allergyKey.replace(/([a-z])([A-Z])/g, '$1 $2');
}

const RegisterStep3Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();
    const { t, isRtl, language } = useAppTranslation();
    const [allergiesItems, setAllergiesItems] = useState<ChipItem[]>([]);
    
    useEffect(() => {
        // Create allergy items based on the current language
        const allergyItems = Object.entries(EAllergy).map(([key, value]) => ({
            label: isRtl ? value : formatAllergyName(key),
            value: value
        }));
        setAllergiesItems(allergyItems);
    }, [isRtl, language]);
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<registerStep3Type>({
        resolver: zodResolver(registerStep3Schema),
        defaultValues: {
            allergies: formData.allergies,
        }
    });

    const onSubmit = (data: registerStep3Type) => {
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
                        {t('auth.register.step3.title')}
                    </RTLText>
                    <VStack space="xs">
                        <RTLText className="text-[#4F4F4F]">
                            {t('auth.register.step3.subtitle')}
                        </RTLText>

                        <RTLText className="text-[#4F4F4F]">
                            {t('auth.register.step3.subtitle2')}
                        </RTLText>
                    </VStack>
                    <VStack className="w-full mt-2 gap-8">
                        <FormControl isInvalid={!!errors.allergies}>
                            <FormControlError className={isRtl ? "justify-end" : "justify-start"}>
                                {isRtl ? (
                                    <>
                                        <FormControlErrorText>{errors.allergies?.message}</FormControlErrorText>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                    </>
                                ) : (
                                    <>
                                        <FormControlErrorIcon as={AlertTriangle} />
                                        <FormControlErrorText>{errors.allergies?.message}</FormControlErrorText>
                                    </>
                                )}
                            </FormControlError>
                            <Controller
                                name="allergies"
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Chips
                                        type="filter"
                                        itemVariant="outlined"
                                        items={allergiesItems}
                                        setItems={setAllergiesItems}
                                        selectedValues={value}
                                        setSelectedValues={onChange}
                                    />
                                )}
                            />
                        </FormControl>
                    </VStack>
                </VStack>
            </Center>
        </ScrollView>
    );
});

export default RegisterStep3Screen;
