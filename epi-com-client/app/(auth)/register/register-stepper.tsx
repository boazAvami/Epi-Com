import StepProgress from "@/components/StepProgress";
import RegisterStep1Screen from "@/app/(auth)/register/step-1";
import RegisterStep2Screen from "@/app/(auth)/register/step-2";
import RegisterStep3Screen from "@/app/(auth)/register/step-3";
import RegisterStep4Screen from "@/app/(auth)/register/step-4";

export default function RegisterStepper() {
    return (
        <StepProgress>
            {() => [
                <RegisterStep1Screen key="step1" />,
                <RegisterStep2Screen key="step2" />,
                <RegisterStep3Screen key="step3" />,
                <RegisterStep4Screen key="step4" />,
            ]}
        </StepProgress>
    );
}
