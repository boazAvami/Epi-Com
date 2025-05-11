import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
    visible: boolean;
    messageIndex: number;
    spinAnim: Animated.Value;
    opacityAnim: Animated.Value;
}

const messages: string[] = [
    'מחפשים עזרה באזור שלך...',
    'בודקים זמינות מחזיקי אפיפן...',
    'מחברים אותך למי שיכול לעזור...',
    'מתאמים עבורך מענה רפואי...',
    'מקשרים אותך למחזיק אפיפן קרוב...',
    'בודקים אפשרויות תגובה מיידית...'
];

export default function SearchMessageOverlay({ visible, messageIndex, spinAnim, opacityAnim }: Props) {
    if (!visible) return null;

    const spin = spinAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.messageContainer}>
            <Animated.Text style={[styles.messageText, { opacity: opacityAnim }]}>
                {messages[messageIndex]}
            </Animated.Text>
            <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.85)',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    messageText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginRight: 8
    },
    spinner: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#FE385C',
        borderTopColor: 'transparent',
        borderRadius: 9
    }
});
