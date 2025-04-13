import React from "react";
import {
    StyleProp,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

export type ChipItem = {
    label: string;
    value: string;
};

export type ChipsType = "default" | "filter" | "input";
export type ChipItemVariant = "solid" | "outlined" | "disabled";

interface ChipProps {
    variant?: ChipItemVariant;
    label: React.ReactNode;
    onPress?: () => void;
    leadingIcon?: () => React.ReactElement | null;
    trailingIcon?: () => React.ReactElement | null;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    leadingIconContainerStyle?: StyleProp<ViewStyle>;
    trailingIconContainerStyle?: StyleProp<ViewStyle>;
}

const Chip: React.FC<ChipProps> = (props) => {
    const {
        variant,
        label,
        onPress,
        leadingIcon,
        trailingIcon,
        style,
        labelStyle,
        leadingIconContainerStyle,
        trailingIconContainerStyle,
    } = props;

    const styles = makeStyles(variant);

    return (
        <View pointerEvents={variant === "disabled" ? "none" : undefined}>
            <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
                {leadingIcon && (
                    <View style={[styles.leadingIconContainer, leadingIconContainerStyle]}>
                        {leadingIcon()}
                    </View>
                )}

                {typeof label === "string" ? (
                    <Text style={[styles.labelText, labelStyle]}>{label}</Text>
                ) : (
                    label
                )}

                {trailingIcon && (
                    <View style={[styles.trailingIconContainer, trailingIconContainerStyle]}>
                        {trailingIcon()}
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};

const makeStyles = (variant: ChipItemVariant | undefined) =>
    StyleSheet.create({
        container: {
            flexDirection: "row",
            padding: 10,
            borderRadius: 20,
            backgroundColor: variant === "outlined" ? "#F2F2F2" : "#FE385C",
            overflow: "hidden",
            alignItems: "center",
            borderWidth: variant === "outlined" ? 1 : 0,
            borderColor: variant === "outlined" ? "#FE385C" : undefined,
            opacity: variant === "disabled" ? 0.5 : 1,
        },
        labelText: {
            color: "#333",
            fontSize: 12,
        },
        leadingIconContainer: {
            marginRight: 5,
        },
        trailingIconContainer: {
            marginLeft: 5,
        },
    });

export default Chip;
