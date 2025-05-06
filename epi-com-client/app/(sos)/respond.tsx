import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Button, Alert } from "react-native";

export default function SOSRespondScreen() {
    const { sosId, userId, lat, lng } = useLocalSearchParams();
    const router = useRouter();

    const handleAgree = async () => {
        // TODO: שלח מיקום והסכמה לשרת
        Alert.alert("התגובה נשלחה", "הפרטים שותפו בהצלחה");
        router.back();
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>🚨 בקשת עזרה דחופה</Text>
            <Text>משתמש סמוך זקוק לעזרה מיידית.</Text>
            <Text>מיקום: {lat}, {lng}</Text>
            <Text style={{ marginVertical: 10 }}>האם אתה מוכן לשתף את מיקומך ולהגיב?</Text>

            <Button title="אני מוכן לעזור" onPress={handleAgree} />
        </View>
    );
}
