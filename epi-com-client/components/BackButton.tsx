import { StyleSheet } from 'react-native';
import {Button, ButtonIcon} from "@/components/ui/button";
import {ArrowRight} from "lucide-react-native";
import {Router, useRouter} from "expo-router";

export function BackButton() {
  const router: Router = useRouter();
  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      top: 70,
      right: 20,
      zIndex: 1,
    },
  });

  return (
      <Button style={styles.button} className="w-10  rounded-full" variant="outline" onPress={() => router.back()}>
        <ButtonIcon className="w-30 h-auto" as={ArrowRight}/>
      </Button>
  );
}

