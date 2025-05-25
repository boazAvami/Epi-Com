import { StyleSheet } from 'react-native';
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react-native";
import { Router, useRouter } from "expo-router";
import { useAppTranslation } from '@/hooks/useAppTranslation';

export function BackButton() {
  const router: Router = useRouter();
  const { isRtl } = useAppTranslation();
  
  const styles = StyleSheet.create({
    button: {
      position: 'absolute',
      top: 70,
      right: isRtl ? 20 : undefined,
      left: isRtl ? undefined : 20,
      zIndex: 1,
    },
  });

  return (
    <Button 
      style={styles.button} 
      className="w-10 rounded-full" 
      variant="outline" 
      onPress={() => router.back()}
    >
      <ButtonIcon 
        className="w-30 h-auto" 
        as={isRtl ? ArrowRight : ArrowLeft}
      />
    </Button>
  );
}

