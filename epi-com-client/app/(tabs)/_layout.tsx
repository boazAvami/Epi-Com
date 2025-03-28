import { Tabs } from 'expo-router';
import { useAuth } from '@/context/authContext';
import { Redirect } from 'expo-router';
import {Icon} from "@/components/ui/icon";
import {CirclePlus, Home, MessageCircle, User} from "lucide-react-native";

export default function TabsLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen name="index" options={{ title: 'בית', tabBarIcon: ({ color }) => (<Icon color={color} as={Home}/>) }} />
            <Tabs.Screen name="create" options={{ title: 'צור', tabBarIcon: ({ color }) => (<Icon color={color} as={CirclePlus}/>) }} />
            <Tabs.Screen name="chatbot" options={{ title: `צ'אט`, tabBarIcon: ({ color }) => (<Icon color={color} as={MessageCircle}/>) }} />
            <Tabs.Screen name="profile" options={{ title: 'פרופיל', tabBarIcon: ({ color }) => (<Icon color={color} as={User}/>) }} />
        </Tabs>
    );
}
