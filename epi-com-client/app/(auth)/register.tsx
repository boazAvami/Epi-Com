import {Router, useRouter} from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/context/authContext';
import {Center} from "@/components/ui/center";
import {Heading} from "@/components/ui/heading";
import {Box} from "@/components/ui/box";
import {VStack} from "@/components/ui/vstack";
import {Button, ButtonText} from "@/components/ui/button";

export default function RegisterScreen() {
    const { login } = useAuth();
    const router: Router = useRouter();

    return (
        <View>
            <View>
                <Center className="p-20">
                    <Heading>Register Page</Heading>
                    <Box className="justify-center h-80">
                        <VStack space="md" reversed={false}>
                            <Button size="md" variant="solid" action="primary" onPress={() => {
                                login();
                                router.replace('/');
                            }}>
                                <ButtonText>Click To Register</ButtonText>
                            </Button>
                            <Button size="md" variant="solid" action="primary" onPress={() => router.back()}>
                                <ButtonText>Back To Login</ButtonText>
                            </Button>
                        </VStack>
                    </Box>
                </Center>
            </View>
        </View>
    );
}
