import StepProgress from "@/components/StepProgress";
import RegisterStep1Screen from "@/app/(auth)/register/step-1";
import RegisterStep2Screen from "@/app/(auth)/register/step-2";

export default function RegisterStepper() {
    return (
        <StepProgress>
            {() => [
                <RegisterStep1Screen key="step1" />,
                <RegisterStep2Screen key="step2" />,
            ]}
        </StepProgress>
    );
}
