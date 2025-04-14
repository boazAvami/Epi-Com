import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useAppTranslation } from '@/hooks/useAppTranslation';

export interface IDropdownItem {
    label: string;
    value: string;
}

const DropdownComponent = ({items = [], onChange, value, className, isInvalid}: {items: IDropdownItem[], onChange:  (...event: any[]) => void, value: string, className?: string, isInvalid?: boolean}) => {
    const [isFocus, setIsFocus] = useState(false);
    const { t, isRtl } = useAppTranslation();

    return (
        <View className={className}>
            <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'black' }, isInvalid && { borderColor: '#B91C1C' }]}
                data={items}
                maxHeight={150}
                labelField="label"
                valueField="value"
                placeholder={t('buttons.select')}
                placeholderStyle={[
                    styles.label,
                    isRtl ? styles.rtlText : styles.ltrText
                ]}
                selectedTextStyle={[
                    styles.selectedItem,
                    isRtl ? styles.rtlText : styles.ltrText
                ]}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => onChange(item.value)}
            />
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
        paddingHorizontal: 8
    },
    label: {
        color: '#8C8C8C',
        fontSize: 14,
        position: 'absolute',
        zIndex: 999,
        paddingHorizontal: 8,
    },
    selectedItem: {
        color: 'black',
        fontSize: 14,
        position: 'absolute',
        zIndex: 999,
        paddingHorizontal: 8,
    },
    rtlText: {
        right: 0,
        textAlign: 'right',
        writingDirection: 'rtl'
    },
    ltrText: {
        left: 0,
        textAlign: 'left',
        writingDirection: 'ltr'
    }
});
