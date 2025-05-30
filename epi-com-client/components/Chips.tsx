import {
    StyleProp,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import React, {useCallback} from "react";

import Chip, {ChipItem, ChipItemVariant, ChipsType} from "./Chip";
import {Icon} from "@/components/ui/icon";
import {CircleX} from "lucide-react-native";
import {useFocusEffect} from "expo-router";
import { useAppTranslation } from "@/hooks/useAppTranslation";

interface ChipsProps {
    containerStyle?: StyleProp<ViewStyle>;
    itemContainerStyle?: StyleProp<ViewStyle>;
    itemLabelStyle?: StyleProp<TextStyle>;
    itemTrailingIconContainerStyle?: StyleProp<ViewStyle>;
    items: ChipItem[];
    setItems: React.Dispatch<React.SetStateAction<ChipItem[]>>;
    selectedValues?: string[];
    setSelectedValues?: React.Dispatch<React.SetStateAction<string[]>>;
    type?: ChipsType;
    itemVariant?: ChipItemVariant;
    isRtl?: boolean;
}

const Chips: React.FC<ChipsProps> = (props) => {
    const {
        containerStyle,
        itemContainerStyle,
        itemLabelStyle,
        items,
        setItems,
        selectedValues,
        setSelectedValues,
        type = "default",
        itemVariant,
        isRtl: isRtlProp
    } = props;
    
    const { isRtl: isRtlContext } = useAppTranslation();

    const isRtl = isRtlProp !== undefined ? isRtlProp : isRtlContext;

    const onSelectItem = (value: string) => {
        if (type === "filter") {
            if (!selectedValues?.includes(value)) {
                setSelectedValues &&
                setSelectedValues([...(selectedValues || []), value]);
            } else {
                setSelectedValues &&
                setSelectedValues(selectedValues?.filter((item) => item !== value));
            }
        } else if (type === "input") {
            setItems(items.filter((item) => item.value !== value));
        }
    };

    const renderInputTrailingIcon = (value: string) => {
        return (
            <TouchableOpacity onPress={() => onSelectItem(value)}>
                <Icon as={CircleX} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={[
            styles.container, 
            containerStyle, 
            { justifyContent: isRtl ? "flex-end" : "flex-start" },
            isRtl && styles.rtlContainer
        ]}>
            {items.map((item, index) => {
                const isSelected = selectedValues?.includes(item.value);

                return (
                    <Chip
                        label={item.label}
                        variant={itemVariant}
                        key={`${item.value}-${index}`}
                        style={[
                            itemContainerStyle,
                            isSelected ? styles.selectedChip : null,
                            isRtl && styles.rtlChip
                        ]}
                        labelStyle={[
                            itemLabelStyle,
                            isSelected ? styles.selectedLabel : null,
                            isRtl && styles.rtlChipText
                        ]}
                        trailingIcon={
                            type === "input"
                                ? () => renderInputTrailingIcon(item.value)
                                : undefined
                        }
                        onPress={
                            type === "filter" || type === "input"
                                ? () => onSelectItem(item.value)
                                : undefined
                        }
                    />
                );
            })}
        </View>
    );
};

export default Chips;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
    },
    selectedChip: {
        backgroundColor: "#FE385C",
        borderColor: "#FE385C",
    },
    selectedLabel: {
        color: "white",
    },
    rtlContainer: {
        alignItems: 'flex-end',
    },
    rtlChip: {
        marginRight: 0,
        marginLeft: -2,
    },
    rtlChipText: {
        textAlign: 'right',
    }
});