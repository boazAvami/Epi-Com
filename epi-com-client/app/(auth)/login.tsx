import {Router, useRouter} from 'expo-router';
import { View } from 'react-native';
import { useAuth } from '@/context/authContext';
import { Button, ButtonText } from "@/components/ui/button"
import {VStack} from "@/components/ui/vstack";
import {Box} from "@/components/ui/box";
import {Heading} from "@/components/ui/heading";
import {Center} from "@/components/ui/center";

export default function LoginScreen() {
    const { login } = useAuth();
    const router: Router = useRouter();

    const handleLogin = () => {
        login();
        router.replace('/');
    };

    return (
        <View>
            <Center className="p-20">
                <Heading>Login Page</Heading>
                <Box className="justify-center h-80">
                    <VStack space="md" reversed={false}>
                        <Button size="md" variant="solid" action="primary" onPress={handleLogin}>
                            <ButtonText>Login</ButtonText>
                        </Button>
                        <Button size="md" variant="solid" action="primary" onPress={() => router.push('/register')}>
                            <ButtonText>Go to Register</ButtonText>
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </View>
    );
}
