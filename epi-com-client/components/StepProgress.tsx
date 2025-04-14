import React, {
    useState,
    useRef,
    useEffect,
    ReactNode,
    ReactElement,
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { ArrowRight } from "lucide-react-native";
import { Router, useRouter } from "expo-router";

type StepRef = {
    onNext: () => Promise<void>;
};

type StepProgressProps = {
    children: (onNext: () => void) => ReactNode;
    onFinish?: () => void;
    successRedirectPath?: string;
    finishText?: string;
    nextText?: string;
};

const StepProgress = ({ children, onFinish, successRedirectPath, nextText = 'המשך', finishText = 'סיים' }: StepProgressProps) => {
    const [step, setStep] = useState(0);
    const router: Router = useRouter();
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const allStepsRaw = children(() => {});
    const allSteps = React.Children.toArray(allStepsRaw);
    const totalSteps = allSteps.length;

    const stepRefs = useRef<React.RefObject<StepRef>[]>([]);
    if (stepRefs.current.length !== totalSteps) {
        stepRefs.current = allSteps.map(() => React.createRef<StepRef>());
    }

    const renderedSteps = allSteps.map((child, i) =>
        React.isValidElement(child)
            ? React.cloneElement(child as ReactElement, {
                ref: stepRefs.current[i],
            })
            : child
    );

    const indicatorScales = useRef(allSteps.map(() => new Animated.Value(1))).current;

    const animateFade = () => {
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
        }).start();
    };

    const animateIndicator = (index: number) => {
        Animated.sequence([
            Animated.timing(indicatorScales[index], {
                toValue: 1.2,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(indicatorScales[index], {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useEffect(() => {
        animateFade();
        animateIndicator(step);
    }, [step]);

    async function handleNext() {
        const currentRef = stepRefs.current[step];
        if (currentRef?.current?.onNext) {
            try {
                await currentRef.current.onNext();
            } catch (error) {
                return;
            }
        }

        if (step < totalSteps - 1) {
            setStep((prev) => prev + 1);
        } else {
            if (onFinish) {
                onFinish();
            } else {
                router.replace(successRedirectPath as any);
            }
        }
    }

    function handlePrevious() {
        if (step > 0) {
            setStep((prev) => prev - 1);
        } else {
            router.back();
        }
    }

    const renderStepIndicator = () => (
        <View style={styles.indicatorContainer}>
            {allSteps.map((_, i) => (
                <View key={i} style={styles.stepContainer}>
                    <Animated.View
                        style={[
                            styles.stepIndicator,
                            i <= step && styles.activeStep,
                            { transform: [{ scale: indicatorScales[i] }] },
                        ]}
                    >
                        <Text style={[styles.stepText, i <= step && styles.activeStepText]}>{i + 1}</Text>
                    </Animated.View>
                    {i < totalSteps - 1 && (
                        <View style={[styles.line, i < step && styles.activeLine]} />
                    )}
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <HStack className="w-full justify-center">
                {renderStepIndicator()}
                <Button
                    style={styles.backButton}
                    className="w-10 rounded-full"
                    variant="outline"
                    onPress={handlePrevious}
                >
                    <ButtonIcon className="w-30 h-auto" as={ArrowRight} />
                </Button>
            </HStack>

            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                {renderedSteps[step]}
            </Animated.View>

            <View style={styles.buttonContainer}>
                <Button onPress={handleNext} style={styles.nextButton}>
                    <ButtonText>{step < totalSteps - 1 ? nextText : finishText}</ButtonText>
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 16,
    },
    indicatorContainer: {
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        marginBottom: 20,
    },
    stepContainer: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    stepIndicator: {
        width: 35,
        height: 35,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#E7E7E7',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStep: {
        borderColor: '#FE385C',
        backgroundColor: '#FE385C',
    },
    stepText: {
        color: '#E7E7E7',
        fontWeight: 'bold',
        fontSize: 16,
    },
    activeStepText: {
        color: 'white',
    },
    line: {
        width: 10,
        height: 2,
        backgroundColor: '#E7E7E7',
        marginHorizontal: 10,
    },
    activeLine: {
        backgroundColor: '#FE385C',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'column-reverse',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: '20%',
    },
    backButton: {
        position: 'absolute',
        right: 0,
    },
    nextButton: {
        backgroundColor: '#FE385C',
        width: '50%',
        borderRadius: 20
    },
});

export default StepProgress;
