import { View } from 'react-native';
import {Heading} from "@/components/ui/heading";
import {Center} from "@/components/ui/center";

export default function CreateScreen() {
    return (
        <View>
            <Center className="p-20">
                <Heading>Create Page</Heading>
            </Center>
        </View>
    );
}
