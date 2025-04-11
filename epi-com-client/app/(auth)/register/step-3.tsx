import { ScrollView } from 'react-native';
import { Center } from "@/components/ui/center";
import { BackButton } from "@/components/BackButton";

export default function RegisterStep3Screen() {

    return (
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 24
        }}>
            <BackButton />
            <Center className="h-full">
            </Center>
        </ScrollView>
    );
}
