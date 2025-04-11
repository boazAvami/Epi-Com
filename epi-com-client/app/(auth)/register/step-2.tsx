import { Router, useRouter } from 'expo-router';
import {ScrollView} from 'react-native';
import { Center } from "@/components/ui/center";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText } from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";
import {AlertTriangle} from "lucide-react-native";
import { BackButton } from "@/components/BackButton";
import { Text } from "@/components/ui/text";
import { useRegister } from '@/context/RegisterContext';
import { registerStep2Schema, registerStep2Type } from '@/schemas/register/step-2-schema';
import DropdownComponent from "@/components/Dropdown";
import {genderOptions} from "@/shared/enums/gender.enum";
import DateInput from "@/components/DatePicker";
import PhoneNumberInput from "@/components/PhoneNumberInput";

export default function RegisterStep2Screen() {
    const router: Router = useRouter();
    const { formData, setFormData } = useRegister();

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
            date_of_birth: formData.date_of_birth || '',
            gender: formData.gender || undefined,
        }
    });

    const onSubmit = (data: registerStep2Type) => {
        setFormData({ ...formData, ...data });
        router.push('/register/step-3');
    };

    const RegisterCard = () => (
        <VStack className="max-w-[440px] w-3/4" space="xl">
            <Heading className="text-right font-semibold text-[#333]" size="2xl">
                כמעט סיימנו!
            </Heading>
            <Text className="text-right text-[#4F4F4F]">
                נשתמש בפרטים האלו כדי לוודא שנוכל ליצור איתכם קשר במקרה חירום.
            </Text>

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
                                        className="text-right"
                                        placeholder="שם פרטי"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                </Input>
                            )}
                        />
                        <FormControlError className="justify-end">
                            <FormControlErrorText>{errors?.firstName?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
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
                                        className="text-right"
                                        placeholder="שם משפחה"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                    />
                                </Input>
                            )}
                        />
                        <FormControlError className="justify-end">
                            <FormControlErrorText>{errors?.lastName?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>

                    {/** Phone Number */}
                    <FormControl isInvalid={!!errors.phone_number} className="w-full">
                        <Controller
                            name="phone_number"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <PhoneNumberInput onChange={onChange} onBlur={onBlur} value={value} isInvalid={!!errors.phone_number}></PhoneNumberInput>
                            )}
                        />
                        <FormControlError className="justify-end">
                            <FormControlErrorText>{errors?.phone_number?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
                        </FormControlError>
                    </FormControl>

                    {/** Date of Birth */}
                    <FormControl isInvalid={!!errors.date_of_birth} className="w-full">
                        <Controller
                            name="date_of_birth"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <DateInput onChange={onChange} onBlur={onBlur} value={value}></DateInput>
                            )}
                        />
                        <FormControlError className="justify-end">
                            <FormControlErrorText>{errors?.date_of_birth?.message}</FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} />
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
                                <DropdownComponent value={value} onChange={onChange} items={genderOptions} isInvalid={!!errors.gender}></DropdownComponent>
                            )}
                        />
                        <FormControlError className="justify-end">
                            <FormControlErrorText>
                                {errors?.gender?.message}
                            </FormControlErrorText>
                            <FormControlErrorIcon as={AlertTriangle} size="md" />
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
            padding: 24
        }}>
            <BackButton />
            <Center className="h-full">
                <RegisterCard />
            </Center>
        </ScrollView>
    );
}
