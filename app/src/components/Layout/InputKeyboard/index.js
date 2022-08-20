import React from 'react';
import InputNumPad from './InputNumPad';
import { useGameInfo } from '../../../hooks/useGameInfo';

export function InputKeyboard() {
    const { gameStarted } = useGameInfo();

    if (!gameStarted) {
        return null;
    }

    return <InputNumPad />;
}

export default InputKeyboard;
