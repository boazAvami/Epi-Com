import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import React, { useEffect } from 'react';
import { useAuth } from '@/stores/useAuth';
import {Button, ButtonIcon, ButtonText} from "@/components/ui/button";
import GoogleIcon from "@/assets/icons/google-icon"; // מתוך zustand

WebBrowser.maybeCompleteAuthSession();

export const GoogleLoginButton = () => {
  const { googleLogin } = useAuth();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        googleLogin(idToken).catch(console.error);
      }
    }
  }, [response]);

  return (
      <Button
          style={{ borderRadius: 20 }}
          variant="outline"
          action="secondary"
          className="w-full gap-1"
          disabled={!request}
          onPress={() => promptAsync()}
      >
        <ButtonText className="font-medium">כניסה דרך גוגל</ButtonText>
        <ButtonIcon as={GoogleIcon} className="text-typography-white" />
      </Button>
  );
};
