import { View } from 'react-native';
import { useAuth } from '@/context/authContext';
import {Heading} from "@/components/ui/heading";
import {Button, ButtonText} from "@/components/ui/button";
import {Center} from "@/components/ui/center";
import {Box} from "@/components/ui/box";
import {VStack} from "@/components/ui/vstack";

export default function HomeScreen() {
    const { logout } = useAuth();

    return (
        <View>
            <Center className="p-20">
                <Heading>Welcome Home</Heading>
                <Box className="justify-center h-80">
                    <VStack space="md" reversed={false}>
                        <Button onPress={logout} >
                            <ButtonText>Logout</ButtonText>
                        </Button>
                    </VStack>
                </Box>
            </Center>
        </View>
    );
}
