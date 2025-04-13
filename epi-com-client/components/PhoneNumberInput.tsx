import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import DropdownComponent from "@/components/Dropdown";
import { phonePrefixOptions } from "@/shared/enums/phone-prefix.enum";
import { Input, InputField } from "@/components/ui/input";
import { HStack } from "@/components/ui/hstack";
interface IPhoneNumberInputProps {
    onChange: (value: string) => void;
    onBlur?: (...event: any[]) => void;
    value: string;
    isInvalid?: boolean;
}
const splitValue = (value: string) => {
    const match = value.match(/^(\d{3})(\d{0,7})$/);
    return {
        prefix: match?.[1] || '',
        number: match?.[2] || ''
    };
};

const PhoneNumberInput = ({
                              onChange,
                              onBlur,
                              value = '',
                              isInvalid
                          }: IPhoneNumberInputProps) => {
    const [phonePrefix, setPhonePrefix] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const { prefix, number } = splitValue(value);
        setPhonePrefix(prefix);
        setPhoneNumber(number);
    }, []);

    const handleChange = (prefix: string, number: string) => {
        onChange(prefix + number);
    };

    const onPhonePrefixChange = (newPrefix: string) => {
        setPhonePrefix(newPrefix);
        handleChange(newPrefix, phoneNumber);
    };

    const onPhoneNumberChange = (newNumber: string) => {
        setPhoneNumber(newNumber);
        handleChange(phonePrefix, newNumber);
    };

    return (
        <HStack className="w-full gap-2">
            <View style={{ flex: 1 }}>
                <DropdownComponent
                    isInvalid={isInvalid && !phonePrefix}
                    items={phonePrefixOptions}
                    onChange={onPhonePrefixChange}
                    value={phonePrefix}
                />
            </View>
            <View style={{ flex: 2 }}>
                <Input>
                    <InputField
                        className="text-right"
                        placeholder="מספר טלפון"
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={onPhoneNumberChange}
                        onBlur={onBlur}
                    />
                </Input>
            </View>
        </HStack>
    );
};

export default PhoneNumberInput;
