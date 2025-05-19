import React, { useEffect, useState } from 'react';
import { View, Platform, Pressable, Text, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Input, InputField } from '@/components/ui/input';
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalBody,
    ModalFooter,
} from '@/components/ui/modal';
import { Button, ButtonText } from '@/components/ui/button';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { Calendar } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface DatePickerProps {
    onChange: (date: Date) => void;
    onBlur?: (...event: any[]) => void;
    value?: Date;
    isRtl?: boolean;
    placeholder?: string;
}

const DateInput = ({ onChange, onBlur, value, isRtl: isRtlProp, placeholder }: DatePickerProps) => {
    const [date, setDate] = useState<Date>(value || new Date());
    const [show, setShow] = useState(false);
    const [dateDisplay, setDateDisplay] = useState<string>("");
    const { t, isRtl: isRtlContext, language } = useAppTranslation();

    const isRtl = isRtlProp !== undefined ? isRtlProp : isRtlContext;

    useEffect(() => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            const locale = language === 'he' ? 'he-IL' : 'en-US';
            const formatted = value.toLocaleDateString(locale);
            setDate(value);
            setDateDisplay(formatted);
        } else {
            setDateDisplay("");
        }
    }, [value, language]);


    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const openModal = () => {
        setShow(true);
    };

    const onConfirm = () => {
        const locale = language === 'he' ? 'he-IL' : 'en-US';
        setDateDisplay(date.toLocaleDateString(locale));
        onChange(date);
        setShow(false);
    };

    return (
        <View>
            <Pressable
                onPress={openModal}
                style={[styles.datePickerButton, isRtl && styles.rtlDatePickerButton]}
            >
                <Text style={[styles.dateText, isRtl && styles.rtlText]}>
                    {value ? dateDisplay : t('auth.register.step2.date_of_birth')}
                </Text>
                <Icon as={Calendar} size="md" color="#666" />
            </Pressable>

            {show && (
                <Modal
                    isOpen={show}
                    onClose={() => setShow(false)}
                    size="md"
                >
                    <ModalBackdrop />
                    <ModalContent>
                        <ModalBody>
                            <DateTimePicker
                                value={date}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                locale={isRtl ? "he-IL" : "en-US"}
                                onChange={onDateChange}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" onPress={() => setShow(false)}>
                                <ButtonText>{t('buttons.cancel')}</ButtonText>
                            </Button>
                            <Button onPress={onConfirm}>
                                <ButtonText>{t('buttons.confirm')}</ButtonText>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    rtlDatePickerButton: {
        flexDirection: 'row-reverse',
    },
    dateText: {
        flex: 1,
        marginLeft: 10,
    },
    rtlText: {
        textAlign: 'right',
    },
});

export default DateInput;
