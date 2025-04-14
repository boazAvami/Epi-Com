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

type DateInputProps = {
    onChange: (date: Date) => void;
    onBlur?: () => void;
    value?: Date;
};

const DateInput = ({ onChange, onBlur, value }: DateInputProps) => {
    const [date, setDate] = useState<Date>(value || new Date());
    const [show, setShow] = useState(false);
    const [dateDisplay, setDateDisplay] = useState<string>("");

    useEffect(() => {
        if (value instanceof Date && !isNaN(value.getTime())) {
            const formatted = value.toLocaleDateString('he-IL');
            setDate(value);
            setDateDisplay(formatted);
        } else if (value) {
            // Try to parse string date
            try {
                const timestamp = typeof value === 'string' ? Number(value) : value;
                const dateObj = new Date(timestamp);

                if (!isNaN(dateObj.getTime())) {
                    const formatted = dateObj.toLocaleDateString('he-IL');
                    setDate(dateObj);
                    setDateDisplay(formatted);
                  } else {
                    setDateDisplay("");
                    }
            } catch(error) {
                console.error('Error parsing date:', error);
              setDateDisplay("");
            }
          } else {
            console.log('No value provided');
            setDateDisplay("");
        }
    }, [value]);


    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const openModal = () => {
        setShow(true);
    };

    const onConfirm = () => {
        setDateDisplay(date.toLocaleDateString('he-IL'));
        onChange(date);
        setShow(false);
    };

    return (
        <View>
            <Input>
                <InputField
                    onPress={openModal}
                    className="text-right"
                    placeholder="תאריך לידה"
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
                                locale="he-IL"
                                onChange={onDateChange}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="outline" onPress={() => setShow(false)}>
                                <ButtonText>ביטול</ButtonText>
                            </Button>
                            <Button onPress={onConfirm}>
                                <ButtonText>אישור</ButtonText>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </View>
    );
};

export default DateInput;
