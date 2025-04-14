import React, { useImperativeHandle, forwardRef } from 'react';
import { ScrollView, Pressable } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegister } from '@/context/RegisterContext';
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from '@/components/ui/form-control';
import { Heading } from '@/components/ui/heading';
import { VStack } from '@/components/ui/vstack';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { AlertTriangle, Pencil } from 'lucide-react-native';
import { StepRef } from '@/app/(auth)/register/step-1';
import { RegisterData } from '@/shared/types/register-data.type';
import {
    registerStep5Schema,
    registerStep5Type,
} from '@/schemas/register/step-5-schema';
import {
    Avatar,
    AvatarBadge,
    AvatarFallbackText,
    AvatarImage,
} from '@/components/ui/avatar';
import { Icon } from '@/components/ui/icon';

const RegisterStep5Screen = forwardRef<StepRef>((_, ref) => {
    const { formData, setFormData } = useRegister();

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<registerStep5Type>({
        resolver: zodResolver(registerStep5Schema),
        defaultValues: {
            profile_picture_uri: formData.profile_picture_uri || '',
        },
    });

    const imageUri = watch('profile_picture_uri');

    const onSubmit = (data: registerStep5Type) => {
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

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('אין הרשאה לגשת לגלריה');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setValue('profile_picture_uri', result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Center className="h-full">
                <VStack className="max-w-[440px] w-3/4" space="xl">
                    <Heading className="text-right font-semibold text-[#333]" size="2xl">
                        אנחנו מסיימים! נשאר רק לבחור תמונה 📸
                    </Heading>
                    <VStack space="sm">
                        <Text className="text-right text-[#4F4F4F]">
                            זה הזמן לבחור תמונת פרופיל שתלווה אותך באפליקציה.
                        </Text>
                        <Text className="text-right text-[#4F4F4F]">
                            אפשר גם לדלג ולהוסיף מאוחר יותר.
                        </Text>
                    </VStack>

                    <Center className="w-full mt-2 gap-4">
                        <FormControl isInvalid={!!errors.profile_picture_uri}>
                            <FormControlError className="justify-end">
                                <FormControlErrorText>{errors.profile_picture_uri?.message}</FormControlErrorText>
                                <FormControlErrorIcon as={AlertTriangle} />
                            </FormControlError>

                            <Controller
                                name="profile_picture_uri"
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <Pressable onPress={handlePickImage}>
                                        <Avatar size="2xl">
                                            <AvatarFallbackText>{formData.userName}</AvatarFallbackText>
                                            <AvatarImage
                                                source={
                                                    imageUri
                                                        ? { uri: imageUri }
                                                        : require('@/assets/images/profile_avatar_placeholder.png')
                                                }
                                            />
                                            <AvatarBadge className="justify-center items-center bg-background-400">
                                                <Icon as={Pencil} color="#fff" />
                                            </AvatarBadge>
                                        </Avatar>
                                    </Pressable>
                                )}
                            />
                        </FormControl>
                    </Center>
                </VStack>
            </Center>
        </ScrollView>
    );
});

export default RegisterStep5Screen;