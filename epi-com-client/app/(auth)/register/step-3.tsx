import React, {
    useImperativeHandle,
    forwardRef, useState,
} from 'react';
import {ScrollView} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/context/RegisterContext';
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { AlertTriangle } from 'lucide-react-native';
import { StepRef } from '@/app/(auth)/register/step-1';
import { registerStep3Schema, registerStep3Type } from '@/schemas/register/step-3-schema';
import {EAllergy} from "@shared/types";
import {ChipItem} from "@/components/Chip";
import Chips from "@/components/Chips";
import {RegisterData} from "@/shared/types/register-data.type";

const RegisterStep3Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();
    const [allergiesItems, setAllergiesItems] = useState<ChipItem[]>(Object.values(EAllergy).map((allergy: string) => ({label: allergy, value: allergy})));
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
                    <Heading className="text-right font-semibold text-[#333]" size="2xl">
                        האם יש לך רגישויות מסוימות?
                    </Heading>
                    <VStack space="xs">
                        <Text className="text-right text-[#4F4F4F]">
                            יש לך אלרגיות? בחר מהרשימה שלפניך.
                        </Text>

                        <Text className="text-right text-[#4F4F4F]">
                            לא סובל מאלרגיות? אפשר פשוט להמשיך.
                        </Text>
                    </VStack>
                    <VStack className="w-full mt-2 gap-8">
                        <FormControl isInvalid={!!errors.allergies}>
                            <FormControlError className="justify-end">
                                <FormControlErrorText>{errors.allergies?.message}</FormControlErrorText>
                                <FormControlErrorIcon as={AlertTriangle} />
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
