import { Router, useRouter } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { VStack } from "@/components/ui/vstack";
import { Heading } from "@/components/ui/heading";
import {
    FormControl,
    FormControlError,
    FormControlErrorIcon,
    FormControlErrorText,
} from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { AlertTriangle, EyeIcon, EyeOffIcon } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {forwardRef, useImperativeHandle, useState} from "react";
import { loginSchema, LoginSchemaType } from "@/schemas/login-schema";
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { RTLText } from '@/components/shared/RTLComponents';

export type LoginCardHandle = {
    submit: () => void;
};

type LoginCardProps = {
    setIsLoading: (val: boolean) => void;
};

const LoginCard = forwardRef<LoginCardHandle, LoginCardProps>((props, ref) => {
    const { login, getUserInfo } = useAuth();
    const router: Router = useRouter();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { t, isRtl } = useAppTranslation();

    const handleLogin = async (email: string, password: string) => {
        props.setIsLoading(true);
        try {
            await login(email, password);
            await getUserInfo();
        } catch (err) {
            console.error(err);
        }

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);
        props.setIsLoading(false);
        router.replace('/');
    };

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    useImperativeHandle(ref, () => ({
        submit: () => {
            handleSubmit(onSubmit)();
        }
    }));

    const onSubmit = (data: LoginSchemaType) => {
        reset();
        handleLogin(data.email, data.password);
    };

    const handleState = () => setShowPassword((prev) => !prev);

    return (
        <VStack className="w-full" space="3xl">
            <VStack className={`${isRtl ? 'items-end' : 'items-start'} md:items-center`} space="md">
                <RTLText className="font-semibold text-[#333333] md:text-center">
                    {t('auth.welcome')}
                </RTLText>
                <RTLText className="text-[#4F4F4F] md:text-center">
                    {t('auth.login_subtitle')}
                </RTLText>
            </VStack>
            <VStack className="w-full mt-10">
                <VStack space="xl" className="w-full">
                    <FormControl
                        isInvalid={!!errors?.email}
                        className="w-full"
                    >
                        <Controller
                            defaultValue=""
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
                            <FormControlErrorIcon as={AlertTriangle} />
                            <FormControlErrorText>
                                {errors?.email?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                    <FormControl
                        isInvalid={!!errors.password}
                        className="w-full"
                    >
                        <Controller
                            defaultValue=""
                            name="password"
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <Input>
                                    <InputSlot onPress={handleState} className="p-2">
                                        <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                                    </InputSlot>
                                    <InputField
                                        className={isRtl ? "text-right" : "text-left"}
                                        type={showPassword ? "text" : "password"}
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
                            <FormControlErrorIcon as={AlertTriangle} />
                            <FormControlErrorText>
                                {errors?.password?.message}
                            </FormControlErrorText>
                        </FormControlError>
                    </FormControl>
                </VStack>
            </VStack>
        </VStack>
    );
});

export default LoginCard
