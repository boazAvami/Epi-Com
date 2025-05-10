import StepProgress from "@/components/StepProgress";
import RegisterStep1Screen from "@/app/(auth)/register/step-1";
import RegisterStep2Screen from "@/app/(auth)/register/step-2";
import RegisterStep3Screen from "@/app/(auth)/register/step-3";
import RegisterStep4Screen from "@/app/(auth)/register/step-4";
import RegisterStep5Screen from "@/app/(auth)/register/step-5";
import { useAppTranslation } from '@/hooks/useAppTranslation';

export default function RegisterStepper() {
    const { t } = useAppTranslation();
    
    return (
        <StepProgress finishText={t('auth.register.finish_button')} successRedirectPath="/(auth)/register/indicator-screens/register-loading-screen">
            {() => [
                <RegisterStep1Screen key="step1" />,
                <RegisterStep2Screen key="step2" />,
                <RegisterStep3Screen key="step3" />,
                <RegisterStep4Screen key="step4" />,
                <RegisterStep5Screen key="step5" />,
            ]}
        </StepProgress>
    );
}
