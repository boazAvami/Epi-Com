import {Redirect, Tabs} from 'expo-router';
import {View, TouchableOpacity, Text, StyleSheet, Pressable} from 'react-native';
import {Icon} from "@/components/ui/icon";
import {CirclePlus, CircleUser, Home, MessageCircle} from "lucide-react-native";
import {useAuth} from "@/context/authContext";

export default function TabLayout() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Redirect href="/login" />;
    }

    return (
        <Tabs
            screenOptions={{headerShown: false}}
            tabBar={({state, navigation}) => {
                const currentIndex = state.index;

                const tabItems = [
                    {
                        name: 'index',
                        icon: (focused: boolean) => (
                            <Icon size="xl" as={Home} className="text-typography-800" color="black"/>
                        ),
                    },
                    {
                        name: 'create',
                        icon: (focused: boolean) => (
                            <Icon size="xl" as={CirclePlus} color="black"/>
                        ),
                    },
                    {
                        name: 'sos',
                        isCenter: true,
                    },
                    {
                        name: 'chatbot',
                        icon: (focused: boolean) => (
                            <Icon size="xl" as={MessageCircle} color="black"/>
                        ),
                    },
                    {
                        name: 'profile',
                        icon: (focused: boolean) => (
                            <Icon size="xl" as={CircleUser} color="black"/>
                        ),
                    },
                ];

                const handlePress = (name: string) => {
                    navigation.navigate(name as never);
                };

                return (
                    <View style={styles.tabContainer}>
                        {tabItems.map((tab, index) => {
                            const focused = currentIndex === index;

                            if (tab.isCenter) {
                                return (
                                    <Pressable
                                        android_ripple={{
                                            color: '#90151C',
                                            radius: 40,
                                            borderless: false,
                                        }}
                                        key={tab.name}
                                        style={styles.sosButton}
                                        onPress={() => handlePress(tab.name)}
                                    >
                                        <Text style={styles.sosText}>SOS</Text>
                                    </Pressable>
                                );
                            }

                            return (
                                <TouchableOpacity
                                    key={tab.name}
                                    style={styles.tabItem}
                                    onPress={() => handlePress(tab.name)}
                                >
                                    {tab.icon?.(focused)}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                );
            }}
        >
            <Tabs.Screen name="index" options={{title: 'Home'}}/>
            <Tabs.Screen name="create" options={{title: 'Create'}}/>
            <Tabs.Screen name="sos" options={{title: 'SOS'}}/>
            <Tabs.Screen name="chatbot" options={{title: 'Chat'}}/>
            <Tabs.Screen name="profile" options={{title: 'Profile'}}/>
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        paddingBottom: 30
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
    },
    sosButton: {
        backgroundColor: '#FF385C',
        width: 80,
        height: 80,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        marginBottom: 20
    },
    sosText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },  sosContainer: {
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
    },

    svg: {
        position: 'absolute',
        bottom: 0,
    },
});
