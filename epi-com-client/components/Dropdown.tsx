import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

export interface IDropdownItem {
    label: string;
    value: string;
}

const DropdownComponent = ({items = [], onChange, value, className, isInvalid}: {items: IDropdownItem[], onChange:  (...event: any[]) => void, value: string, className?: string, isInvalid?: boolean}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View className={className}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'black' }, isInvalid && { borderColor: '#B91C1C' }]}
                data={items}
                maxHeight={150}
                labelField="label"
                valueField="value"
                placeholder='בחר'
                placeholderStyle={styles.label}
                selectedTextStyle={styles.selectedItem}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => onChange(item.value)}            />
        </View>
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        height: 35,
        borderColor: '#D5D4D4',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        textAlign: 'right',
        writingDirection: 'rtl'
    },
    label: {
        color: '#8C8C8C',
        fontSize: 14,
        position: 'absolute',
        right: 0,
        zIndex: 999,
        paddingHorizontal: 8,
    },
    selectedItem: {
        color: 'black',
        fontSize: 14,
        position: 'absolute',
        right: 0,
        zIndex: 999,
        paddingHorizontal: 8,
    }
});
