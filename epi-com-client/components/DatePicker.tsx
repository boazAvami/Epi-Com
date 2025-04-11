import React, {useEffect, useState} from 'react';
import {
    View,
    Platform, StyleSheet,
} from 'react-native';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {Input, InputField} from "@/components/ui/input";
import {
    Modal,
    ModalBackdrop,
    ModalContent,
    ModalBody, ModalFooter,
} from "@/components/ui/modal"
import {Button, ButtonText} from "@/components/ui/button";

const DateInput = ({onChange, onBlur, value}: {onChange: (...event: any[]) => void, onBlur?: (...event: any[]) => void, value?: string}) => {
    const [dateDisplay, setDateDisplay] = useState<string | undefined>(value);
    const [date, setDate] = useState<Date>(new Date());
    const [show, setShow] = useState(false);

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
            setDateDisplay(selectedDate.toLocaleDateString('he-IL'));
        }
    };

    const openModal = () => {
        setShow(true);
    }

    const onConfirm = () => {
        const formatted = date.toLocaleDateString('he-IL');
        setDateDisplay(formatted);
        onChange(formatted);
        setShow(false);
    }

    return (
        <View>
                <Input>
                    <InputField
                        onPress={openModal}
                        className="text-right"
                        placeholder="תאריך לידה"
                        defaultValue={undefined}
                        value={dateDisplay}
                        onBlur={onBlur}
                        returnKeyType="done"
                        editable={false}
                    />
                </Input>

            {show && (<Modal isOpen={show}
                           onClose={() => {
                               setShow(false)
                           }}
                           size="md">
                    <ModalBackdrop/>
                    <ModalContent>
                        <ModalBody >
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
                                <ButtonText>
                                    ביטול
                                </ButtonText>
                            </Button>
                            <Button onPress={onConfirm}>
                                <ButtonText>
                                    אישור
                                </ButtonText>
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </View>
    );
};

export default DateInput;
