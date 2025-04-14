import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
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

type DateInputProps = {
    onChange: (date: Date) => void;
    onBlur?: () => void;
    value?: Date;
    placeholder?: string;
};

const DateInput = ({ onChange, onBlur, value, placeholder }: DateInputProps) => {
    const [date, setDate] = useState<Date>(value || new Date());
    const [show, setShow] = useState(false);
    const [dateDisplay, setDateDisplay] = useState<string>("");
    const { t, isRtl, language } = useAppTranslation();

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
            <Input>
                <InputField
                    onPress={openModal}
                    className={isRtl ? "text-right" : "text-left"}
                    placeholder={placeholder || t('auth.register.step2.date_of_birth')}
                    value={dateDisplay}
                    onBlur={onBlur}
                    editable={false}
                />
            </Input>

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

export default DateInput;
